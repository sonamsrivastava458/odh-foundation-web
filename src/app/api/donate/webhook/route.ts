import { getPayload } from 'payload'
import config from '@payload-config'
import crypto from 'crypto'

export async function POST(request: Request) {
  const payload = await getPayload({ config })

  const contentType = request.headers.get('content-type') || ''
  const fields: Record<string, string> = {}

  if (contentType.includes('application/json')) {
    Object.assign(fields, await request.json())
  } else {
    const form = await request.formData()
    form.forEach((value, key) => {
      fields[key] = String(value)
    })
  }

  const { txnid, status, amount, productinfo, firstname, email, hash: receivedHash } = fields

  if (!txnid || !status || !receivedHash) {
    payload.logger.error('PayU webhook: missing required fields')
    return Response.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  const key = process.env.PAYU_MERCHANT_KEY || ''
  const salt = process.env.PAYU_SALT || ''

  // ⚠️ VERIFY against PayU's current official response-hash sequence before relying
  // on this — reverse of the request hash, `status` inserted right after salt.
  const expectedHashString = `${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`
  const expectedHash = crypto.createHash('sha512').update(expectedHashString).digest('hex')

  if (expectedHash !== receivedHash) {
    payload.logger.error(`PayU webhook: hash mismatch for txnid ${txnid}`)
    return Response.json({ error: 'Invalid signature.' }, { status: 401 })
  }

  const existing = await payload.find({
    collection: 'donations',
    where: { gatewayTxnId: { equals: txnid } },
    overrideAccess: true,
    limit: 1,
  })

  const donation = existing.docs[0]
  if (!donation) {
    payload.logger.error(`PayU webhook: no donation found for txnid ${txnid}`)
    return Response.json({ error: 'Unknown transaction.' }, { status: 404 })
  }

  // Idempotent — PayU retries webhooks. Once success is recorded, never touch it again.
  if (donation.internalStatus === 'success') {
    return Response.json({ received: true, alreadyProcessed: true })
  }

  await payload.update({
    collection: 'donations',
    id: donation.id,
    overrideAccess: true,
    data: {
      internalStatus: status === 'success' ? 'success' : 'failed',
      gatewayStatus: status,
    },
  })

  // Receipt PDF + email + campaign/project raisedAmount update all react to this
  // internalStatus change via donations.afterChange — that hook is Step 3, not built yet.

  return Response.json({ received: true })
}
