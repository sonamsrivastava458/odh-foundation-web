import { getPayload } from 'payload'
import config from '@payload-config'
import crypto from 'crypto'
import { z } from 'zod'

const donateSchema = z.object({
  donorName: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
pan: z
  .string()
  .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Invalid PAN')
  .optional(),
  address: z.string().optional(),
  amount: z.number().int().min(100), // whole rupees, ≥ ₹100 — spec §7
  frequency: z.enum(['one-time', 'monthly']),
  campaign: z.string().optional(),
  project: z.string().optional(),
  consent: z.object({
    termsAccepted: z.literal(true),
    contactPermission: z.boolean().optional(),
  }),
})

export async function POST(request: Request) {
  const payload = await getPayload({ config })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const parsed = donateSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid input.', details: parsed.error.flatten() }, { status: 400 })
  }
  const data = parsed.data

  // Donor koi logged-in Payload user nahi hai — yeh trusted server-side code hai,
  // isliye overrideAccess:true. Donations.access.create (isFinance) sirf admin-panel
  // se manual entry ko govern karta hai, is public path ko nahi.
  const donation = await payload.create({
    collection: 'donations',
    overrideAccess: true,
    data: {
      donorName: data.donorName,
      email: data.email,
      phone: data.phone,
      pan: data.pan,
      address: data.address,
      amount: data.amount,
      currency: 'INR',
      frequency: data.frequency,
      campaign: data.campaign,
      project: data.project,
      gateway: 'payu',
      internalStatus: 'initiated',
      consent: data.consent,
    },
  })

  const txnid = `ODH${donation.id}${Date.now()}`
  const key = process.env.PAYU_MERCHANT_KEY || ''
  const salt = process.env.PAYU_SALT || ''
  const amountStr = data.amount.toFixed(2)
  const productinfo =
    data.frequency === 'monthly' ? 'ODH Foundation Monthly Donation' : 'ODH Foundation Donation'
  const firstname = data.donorName.trim().split(/\s+/)[0]

  // ⚠️ VERIFY THIS against PayU's current official hash-sequence docs once you
  // have dashboard access — a wrong pipe count here fails every transaction with
  // "invalid hash", and it can't be caught except by an actual PayU sandbox call.
  const hashString = `${key}|${txnid}|${amountStr}|${productinfo}|${firstname}|${data.email}|||||||||||${salt}`
  const hash = crypto.createHash('sha512').update(hashString).digest('hex')

  await payload.update({
    collection: 'donations',
    id: donation.id,
    overrideAccess: true,
    data: { gatewayTxnId: txnid },
  })

  return Response.json({
    key,
    txnid,
    amount: amountStr,
    productinfo,
    firstname,
    email: data.email,
    phone: data.phone,
    surl: `${process.env.NEXT_PUBLIC_SITE_URL}/donate/success`,
    furl: `${process.env.NEXT_PUBLIC_SITE_URL}/donate/failed`,
    hash,
    payuBaseUrl:
      process.env.PAYU_MODE === 'live'
        ? 'https://secure.payu.in/_payment'
        : 'https://test.payu.in/_payment',
  })
}
