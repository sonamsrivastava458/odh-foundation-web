import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: Request) {
  const payload = await getPayload({ config })
  const { searchParams } = new URL(request.url)
  const txnid = searchParams.get('txnid')

  if (!txnid) {
    return Response.json({ error: 'txnid is required.' }, { status: 400 })
  }

  const result = await payload.find({
    collection: 'donations',
    where: { gatewayTxnId: { equals: txnid } },
    overrideAccess: true,
    limit: 1,
  })

  const donation = result.docs[0]
  if (!donation) {
    return Response.json({ error: 'Not found.' }, { status: 404 })
  }

  return Response.json({
    status: donation.internalStatus,
    amount: donation.amount,
    frequency: donation.frequency,
  })
}
