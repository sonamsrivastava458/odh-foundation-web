import { getPayload } from 'payload'
import config from '@payload-config'

type FormFieldDef = {
  name: string
  label: string
  type: string
  required?: boolean
  minLength?: number
  maxLength?: number
  options?: Array<{ value: string }>
}

const isValidEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const isValidIndianPhone = (value: string): boolean => {
  const digits = value.replace(/[\s\-()+]/g, '')
  return /^(91)?[6-9][0-9]{9}$/.test(digits)
}

/** Client-bheji data ko form ki asli, server-side field-definition ke against check
 * karta hai — client ka JS bypass ho sakta hai, yeh check nahi hoti. */
const validateSubmission = (fields: FormFieldDef[], data: Record<string, unknown>): string | null => {
  for (const field of fields) {
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

export async function POST(request: Request) {
  const payload = await getPayload({ config })
  const body = await request.json().catch(() => null)

  if (!body || typeof body !== 'object') {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { pageSlug, blockId, data } = body as {
    pageSlug?: string
    blockId?: string
    data?: Record<string, unknown>
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

  const layout = (page.layout ?? []) as Array<{
    id?: string
    blockType?: string
    formType?: string
    fields?: FormFieldDef[]
  }>
  const block = layout.find((row) => row.id === blockId && row.blockType === 'formBlock')

  if (!block) {
    return Response.json({ error: 'Unknown form.' }, { status: 404 })
  }

  const fields = block.fields ?? []
  const validationError = validateSubmission(fields, data)
  if (validationError) {
    return Response.json({ error: validationError }, { status: 400 })
  }

  // Sirf woh keys rakho jo form khud define karta hai — kuch bhi extra (jaise bot ka
  // honeypot field) chup-chaap gir jaata hai, DB mein junk data nahi jaata.
  const sanitizedData: Record<string, unknown> = {}
  for (const field of fields) {
    if (field.name in data) sanitizedData[field.name] = data[field.name]
  }

  await payload.create({
    collection: 'form-submissions',
    overrideAccess: true,
    data: {
      formType: block.formType,
      page: page.id,
      blockId,
      data: sanitizedData,
    },
  })

  return Response.json({ success: true })
}
