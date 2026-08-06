import { getPayload } from 'payload'
import config from '@payload-config'
import crypto from 'crypto'
import { z } from 'zod'
// import { NextResponse } from 'next/server'
// import { getClientIP } from '@/security/clientIP'
// import { donationLimiter } from '@/security/rateLimiter'
// import { setRateLimitHeaders } from '@/security/rateLimitHeaders'
// import { RATE_LIMITS } from '@/security/rateLimitConfig'

// import type {
//   RateLimiterRes,
// } from 'rate-limiter-flexible'

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
  frequency: z.enum(['one-time', 'monthly']).optional(),
  campaign: z.coerce.number().int().optional(),
  project: z.coerce.number().int().optional(),
  consent: z.object({
    termsAccepted: z.boolean().optional(),
    contactPermission: z.boolean().optional(),
  }).optional(),
})

export async function POST(request: Request) {
  // const ip = await getClientIP()
  // let rateLimitRes: RateLimiterRes
  // try {
  //   rateLimitRes = await donationLimiter.consume(ip)
  // } catch (err: any) {
  //   const response = NextResponse.json(
  //     {
  //       error: 'Too many requests.',
  //     },
  //     {
  //       status: 429,
  //     },
  //   )

  //   setRateLimitHeaders(response, {
  //     limit: RATE_LIMITS.donation.points,
  //     remaining: 0,
  //     reset: Math.ceil(
  //       Date.now() / 1000 +
  //       err.msBeforeNext / 1000,
  //     ),
  //     retryAfter: Math.ceil(
  //       err.msBeforeNext / 1000,
  //     ),
  //   })

  //   return response
  // }
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
      frequency: data.frequency ?? 'one-time',
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

  const response = Response.json({
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
  // setRateLimitHeaders(response, {
  //   limit: RATE_LIMITS.donation.points,
  //   remaining: rateLimitRes.remainingPoints,
  //   reset: Math.ceil(Date.now() / 1000 + rateLimitRes.msBeforeNext / 1000),
  // })

  return response
}