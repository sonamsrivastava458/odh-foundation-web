import { getPayload } from 'payload'
import config from '@payload-config'
import { sendFormNotification } from '../../../../hooks/sendFormNotification'
import { Media } from '@/payload-types'

// File uploads ke liye Buffer chahiye — edge runtime pe available nahi hota.
export const runtime = 'nodejs'

type FormFieldDef = {
  name: string
  label: string
  type: string
  required?: boolean
  minLength?: number
  maxLength?: number
  options?: Array<{ value: string }>
  accept?: string
  maxFileSizeMB?: number
}

const isValidEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const isValidIndianPhone = (value: string): boolean => {
  const digits = value.replace(/[\s\-()+]/g, '')
  return /^(91)?[6-9][0-9]{9}$/.test(digits)
}

const MAX_FILE_FIELD_DEFAULT_MB = 5

/** "image/*,.pdf,application/pdf" jaisi accept string ko uploaded File
 * ke against check karta hai — extension aur mimetype dono patterns handle karta hai. */
const matchesAccept = (file: File, acceptStr?: string): boolean => {
  if (!acceptStr) return true
  const patterns = acceptStr.split(',').map((p) => p.trim().toLowerCase()).filter(Boolean)
  if (patterns.length === 0) return true

  const mime = (file.type || '').toLowerCase()
  const name = (file.name || '').toLowerCase()

  return patterns.some((pattern) => {
    if (pattern.startsWith('.')) return name.endsWith(pattern)
    if (pattern.endsWith('/*')) return mime.startsWith(pattern.slice(0, -1))
    return mime === pattern
  })
}

/** Client-bheji text/select/etc. data ko form ki asli, server-side field-definition
 * ke against check karta hai — file fields yahan skip hote hain, unki validation
 * validateFileFields() alag se karta hai (kyunki wahan inputs strings nahi, File hote hain). */
const validateSubmission = (fields: FormFieldDef[], data: Record<string, unknown>): string | null => {
  for (const field of fields) {
    if (field.type === 'file') continue

    const value = data[field.name]

    if (field.required && (value === undefined || value === null || value === '')) {
      return `"${field.label}" is required.`
    }
    if (value === undefined || value === null || value === '') continue
    if (typeof value !== 'string') {
      return `"${field.label}" must be text.`
    }
    if (field.type === 'email' && !isValidEmail(value)) {
      return `"${field.label}" must be a valid email address.`
    }
    if (field.type === 'tel' && !isValidIndianPhone(value)) {
      return `"${field.label}" must be a valid 10-digit Indian mobile number.`
    }
    if (field.type === 'select') {
      const allowed = (field.options ?? []).map((o) => o.value)
      if (!allowed.includes(value)) {
        return `"${field.label}" has an invalid value.`
      }
    }
    if (typeof field.minLength === 'number' && value.length < field.minLength) {
      return `"${field.label}" must be at least ${field.minLength} characters.`
    }
    if (typeof field.maxLength === 'number' && value.length > field.maxLength) {
      return `"${field.label}" must be at most ${field.maxLength} characters.`
    }
  }
  return null
}

/** File-type fields ki required/size/accept validation. */
const validateFileFields = (
  fields: FormFieldDef[],
  formData: FormData,
): { error: string | null; files: Array<{ field: FormFieldDef; file: File }> } => {
  const collected: Array<{ field: FormFieldDef; file: File }> = []

  for (const field of fields) {
    if (field.type !== 'file') continue

    const entry = formData.get(field.name)
    const file = entry instanceof File && entry.size > 0 ? entry : null

    if (field.required && !file) {
      return { error: `"${field.label}" is required.`, files: collected }
    }
    if (!file) continue

    const maxMB = field.maxFileSizeMB ?? MAX_FILE_FIELD_DEFAULT_MB
    if (file.size > maxMB * 1024 * 1024) {
      return { error: `"${field.label}" must be smaller than ${maxMB}MB.`, files: collected }
    }
    if (!matchesAccept(file, field.accept)) {
      return { error: `"${field.label}" has an unsupported file type.`, files: collected }
    }

    collected.push({ field, file })
  }

  return { error: null, files: collected }
}

export async function POST(request: Request) {
  const payload = await getPayload({ config })

  const contentType = request.headers.get('content-type') || ''
  let pageSlug: string | undefined
  let blockId: string | undefined
  let data: Record<string, unknown> = {}
  let formData: FormData | null = null

  // File fields ke saath request hamesha multipart/form-data hogi.
  // Text-only forms abhi bhi plain JSON bhej sakte hain — backward compatible.
  if (contentType.includes('multipart/form-data')) {
    formData = await request.formData().catch(() => null)
    if (!formData) {
      return Response.json({ error: 'Invalid form data.' }, { status: 400 })
    }
    pageSlug = String(formData.get('pageSlug') ?? '') || undefined
    blockId = String(formData.get('blockId') ?? '') || undefined
    const rawData = formData.get('data')
    if (typeof rawData === 'string') {
      try {
        data = JSON.parse(rawData)
      } catch {
        return Response.json({ error: 'Invalid "data" payload.' }, { status: 400 })
      }
    }
  } else {
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return Response.json({ error: 'Invalid request body.' }, { status: 400 })
    }
    ; ({ pageSlug, blockId, data = {} } = body as {
      pageSlug?: string
      blockId?: string
      data?: Record<string, unknown>
    })
  }

  if (!pageSlug || !blockId || !data || typeof data !== 'object') {
    return Response.json({ error: 'pageSlug, blockId and data are required.' }, { status: 400 })
  }

  // overrideAccess NAHI diya — readPublished khud filter kar dega, sirf published
  // pages ke forms hi submit ho sakte hain, draft page ka form nahi.
  const pageResult = await payload.find({
    collection: 'pages',
    where: { slug: { equals: pageSlug } },
    depth: 0,
    limit: 1,
  })

  const page = pageResult.docs[0]
  if (!page) {
    return Response.json({ error: 'Unknown page.' }, { status: 404 })
  }

  type FormType = 'contact' | 'volunteer' | 'csr' | 'career' | 'newsletter'

  const layout = (page.layout ?? []) as Array<{
    id?: string
    blockType?: string
    formType: FormType
    fields?: FormFieldDef[]
  }>
  const block = layout.find((row) => row.id === blockId && row.blockType === 'formBlock')

  if (!block) {
    return Response.json({ error: 'Unknown form.' }, { status: 404 })
  }

  const fields = block.fields ?? []
  const hasFileFields = fields.some((f) => f.type === 'file')

  if (hasFileFields && !formData) {
    return Response.json(
      { error: 'This form requires multipart/form-data submission.' },
      { status: 400 },
    )
  }

  const validationError = validateSubmission(fields, data)
  if (validationError) {
    return Response.json({ error: validationError }, { status: 400 })
  }

  let filePayload: Array<{ field: FormFieldDef; file: File }> = []
  if (formData) {
    const result = validateFileFields(fields, formData)
    if (result.error) {
      return Response.json({ error: result.error }, { status: 400 })
    }
    filePayload = result.files
  }

  // Sirf woh keys rakho jo form khud define karta hai — kuch bhi extra (jaise bot ka
  // honeypot field) chup-chaap gir jaata hai, DB mein junk data nahi jaata.
  const sanitizedData: Record<string, unknown> = {}
  for (const field of fields) {
    if (field.type === 'file') continue // files alag `files` array mein jaate hain
    if (field.name in data) sanitizedData[field.name] = data[field.name]
  }
  // Admin list mein context ke liye filename `data` mein bhi rakh do.
  for (const { field, file } of filePayload) {
    sanitizedData[field.name] = file.name
  }

  // Files pehle `media` collection mein upload karo, phir unke doc IDs ko
  // form-submission ke `files` array mein reference ke taur pe save karo.
 const uploadedFiles: {
  fieldName: string
  file: Media | number
}[] = []
  try {
    for (const { field, file } of filePayload) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const mediaDoc = await payload.create({
        collection: 'media',
        overrideAccess: true,
        data: {
          alt: `${block.formType} form upload — ${field.label}`,
        },
        file: {
          data: buffer,
          mimetype: file.type || 'application/octet-stream',
          name: file.name,
          size: file.size,
        },
      })
      uploadedFiles.push({ fieldName: field.name, file: mediaDoc.id })
    }
  } catch (err) {
    payload.logger.error(`Form file upload failed: ${err}`)
    return Response.json({ error: 'File upload failed. Please try again.' }, { status: 500 })
  }

  await payload.create({
    collection: 'form-submissions',
    overrideAccess: true,
    data: {
      formType: block.formType,
      page: page.id,
      blockId,
      data: sanitizedData,
      files: uploadedFiles,
      status: 'new',
    },
  })

  const siteSettings = await payload.findGlobal({ slug: 'site-settings' })

  try {
    await sendFormNotification({
      to: siteSettings.contact.email,
      formType: block.formType ?? 'contact',
      entries: fields.map((field) => ({ label: field.label, value: sanitizedData[field.name] })),
    })
  } catch (err) {
    payload.logger.error(`sendFormNotification failed: ${err}`)
  }

  return Response.json({ success: true })
}