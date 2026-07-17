import type { CollectionAfterChangeHook } from 'payload'
import type { Donation } from '../payload-types'

type ReqArg = Parameters<CollectionAfterChangeHook<Donation>>[0]['req']

const adjustRaisedAmount = async (
  req: ReqArg,
  collection: 'campaigns' | 'projects',
  id: string | number,
  delta: number,
): Promise<void> => {
  const target = await req.payload.findByID({ collection, id, overrideAccess: true, depth: 0 })
  const current = (target as { raisedAmount?: number }).raisedAmount ?? 0

  await req.payload.update({
    collection,
    id,
    overrideAccess: true,
    data: { raisedAmount: Math.max(0, current + delta) },
  })
}

/** Donation success/refund pe linked campaign/project ka raisedAmount update karta hai.
 * Receipt-counter jaisi raw SQL yahan jaan-boojh kar NAHI use ki — campaigns/projects
 * versions:{drafts:true} use karte hain, aur unki table ko seedha SQL se chhedne se
 * Payload ka version-history table (`_campaigns_v` / `_projects_v`) desync ho sakta hai.
 * Local API se hi karna safe hai. */
export const updateRaisedAmount: CollectionAfterChangeHook<Donation> = async ({
  doc,
  previousDoc,
  req,
}) => {
  const justSucceeded = doc.internalStatus === 'success' && previousDoc?.internalStatus !== 'success'
  const justRefunded = doc.internalStatus === 'refunded' && previousDoc?.internalStatus === 'success'

  if (!justSucceeded && !justRefunded) return doc

  const delta = justSucceeded ? doc.amount : -doc.amount

  const campaignId = typeof doc.campaign === 'object' ? doc.campaign?.id : doc.campaign
  const projectId = typeof doc.project === 'object' ? doc.project?.id : doc.project

  if (campaignId) await adjustRaisedAmount(req, 'campaigns', campaignId, delta)
  if (projectId) await adjustRaisedAmount(req, 'projects', projectId, delta)

  return doc
}
