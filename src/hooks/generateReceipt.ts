import type { CollectionBeforeChangeHook, PayloadRequest } from 'payload'
import type { Donation } from '../payload-types'
import React from 'react'
import { renderToBuffer , DocumentProps  } from '@react-pdf/renderer'
import { ReceiptPDF } from './ReceiptPDF'
import { sendReceiptEmail } from './sendReceiptEmail'
import sharp from 'sharp'

const getImageUrl = (media: unknown): string | undefined => {
  if (media && typeof media === 'object' && 'url' in media && typeof (media as { url?: unknown }).url === 'string') {
    return (media as { url: string }).url
  }
  return undefined
}

const fetchAsPngDataUri = async (url: string): Promise<string | undefined> => {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!response.ok) return undefined
    const arrayBuffer = await response.arrayBuffer()
    const pngBuffer = await sharp(Buffer.from(arrayBuffer)).png().toBuffer()
    return `data:image/png;base64,${pngBuffer.toString('base64')}`
  } catch {
    return undefined
  }
}

const getFiscalYear = (date: Date): string => {
  const month = date.getMonth()
  const year = date.getFullYear()
  const startYear = month >= 3 ? year : year - 1
  const endYearShort = String((startYear + 1) % 100).padStart(2, '0')
  return `${startYear}-${endYearShort}`
}

const nextReceiptNumber = async (req: PayloadRequest, fiscalYear: string): Promise<string> => {
  const { rows } = await req.payload.db.pool.query<{ last_number: number }>(
    `WITH actual_max AS (
       SELECT COALESCE(MAX(CAST(split_part(receipt_number, '/', 3) AS INTEGER)), 0) AS n
       FROM donations
       WHERE receipt_number LIKE 'ODH/' || $1 || '/%'
     )
     INSERT INTO receipt_counters (fiscal_year, last_number)
     VALUES ($1, (SELECT n FROM actual_max) + 1)
     ON CONFLICT (fiscal_year) DO UPDATE
     SET last_number = GREATEST(receipt_counters.last_number, (SELECT n FROM actual_max)) + 1
     RETURNING last_number`,
    [fiscalYear],
  )
  return `ODH/${fiscalYear}/${String(rows[0].last_number).padStart(4, '0')}`
}

/** beforeChange mein chalta hai — receiptNumber/receiptPdfUrl ko seedha `data` mein daal
 * deta hai taaki ek hi save-statement mein chala jaaye. Pehle yeh afterChange mein tha aur
 * apni hi row ko dobara `payload.update()` se update karta tha — jab tak outer save khatam
 * na ho uska transaction khula rehta, aur andar wala update usi row ka lock maangta,
 * dono ek dusre ka intezaar karte reh jaate the (self-deadlock). Ab aisa update hi nahi hai. */
export const generateReceipt: CollectionBeforeChangeHook<Donation> = async ({
  data,
  originalDoc,
  req,
  operation,
}) => {
  if (operation !== 'update') return data
  if (data.internalStatus !== 'success') return data
  if (!originalDoc) {
  throw new Error('originalDoc is required')
}
  if (originalDoc?.internalStatus === 'success') return data // already processed

  const donorName = data.donorName ?? originalDoc.donorName
  const email = data.email ?? originalDoc.email
  const pan = data.pan ?? originalDoc.pan
  const amount = data.amount ?? originalDoc.amount
  const frequency = data.frequency ?? originalDoc.frequency

  const receiptNumber = await nextReceiptNumber(req, getFiscalYear(new Date()))

  const [siteSettings, donationSettings] = await Promise.all([
    req.payload.findGlobal({ slug: 'site-settings', req }),
    req.payload.findGlobal({ slug: 'donation-settings', req }),
  ])

  const signatureImagePath = getImageUrl(donationSettings.receipt?.signatureImage)
  const signatureImageBase64 = signatureImagePath
    ? await fetchAsPngDataUri(`${process.env.NEXT_PUBLIC_SITE_URL}${signatureImagePath}`)
    : undefined

 const pdfBuffer = await renderToBuffer(
  React.createElement(ReceiptPDF, {
    receiptNumber,
    signatureImageBase64,
    date: new Date(originalDoc.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    donorName,
    donorEmail: email,
    donorPan: pan ?? undefined,
    amount,
    frequency,
    orgName: siteSettings.siteName,
    orgPan: siteSettings.registrations?.pan ?? undefined,
    org80G: siteSettings.registrations?.reg80G ?? undefined,
    signatoryName: donationSettings.receipt?.signatoryName ?? undefined,
    signatoryRole: donationSettings.receipt?.signatoryRole ?? undefined,
    statement80G: donationSettings.receipt?.statement80G ?? undefined,
  }) as unknown as React.ReactElement<DocumentProps>,
)
  const receiptDoc = await req.payload.create({
    collection: 'documents',
    overrideAccess: true,
    data: { title: `Receipt ${receiptNumber}` },
    file: {
      data: pdfBuffer,
      mimetype: 'application/pdf',
      name: `${receiptNumber.replace(/\//g, '-')}.pdf`,
      size: pdfBuffer.length,
    },
    req,
  })

  try {
    await sendReceiptEmail({
      to: email,
      donorName,
      receiptNumber,
      amount,
      orgName: siteSettings.siteName,
      pdfBuffer,
    })
  } catch (err) {
    req.payload.logger.error(`sendReceiptEmail failed for ${receiptNumber}: ${err}`)
  }

  return {
    ...data,
    receiptNumber,
    receiptPdfUrl: `${process.env.NEXT_PUBLIC_SITE_URL}${receiptDoc.url}`,
  }
}
