import type { CollectionConfig } from 'payload'
import { isFinance, isSuperAdmin } from '../access'
import { validatePan, validatePhone } from '../fields/validators'
import crypto from 'crypto'
import { APIError } from 'payload'

export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  labels: {
    singular: 'Subscription',
    plural: 'Subscriptions',
  },
  admin: {
    useAsTitle: 'donorName',
    defaultColumns: ['donorName', 'amount', 'status', 'nextChargeDate'],
    group: 'Finance',
    description: 'One row per active monthly donor mandate. Created by the donation webhook when a recurring mandate is confirmed.',
  },
  access: {
    read: isFinance,
    create: isFinance,
    update: isFinance,
    delete: isSuperAdmin,
  },
    hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.cancelToken) {
          data.cancelToken = crypto.randomBytes(24).toString('hex')
        }
        return data
      },
    ],
  },

  timestamps: true,
  fields: [
    { name: 'donorName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', required: true, validate: validatePhone },
    { name: 'pan', type: 'text', label: 'PAN', validate: validatePan },

    { name: 'amount', type: 'number', required: true, min: 100 },
    {
      name: 'gatewaySubscriptionId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Gateway Subscription/Mandate ID',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Failed', value: 'failed' },
      ],
      admin: {
        description: 'Safe to name "status" here — this collection has no versions/drafts, so there is no _status field to collide with.',
      },
    },
    { name: 'startDate', type: 'date', required: true },
    { name: 'nextChargeDate', type: 'date' },
    {
      name: 'cancelToken',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Signed token used in the donor self-service cancel link emailed with every receipt.',
      },
    },
  ],
    endpoints: [
    {
      path: '/cancel',
      method: 'post',
      handler: async (req) => {
        const body = await req.json().catch(() => null)
        const cancelToken = body?.cancelToken

        if (!cancelToken || typeof cancelToken !== 'string') {
          throw new APIError('cancelToken is required.', 400)
        }

        const result = await req.payload.find({
          collection: 'subscriptions',
          where: { cancelToken: { equals: cancelToken } },
          overrideAccess: true,
          limit: 1,
        })

        const subscription = result.docs[0]
        if (!subscription) {
          throw new APIError('Invalid cancellation link.', 404)
        }

        if (subscription.status === 'cancelled') {
          return Response.json({ success: true, alreadyCancelled: true })
        }

        await req.payload.update({
          collection: 'subscriptions',
          id: subscription.id,
          overrideAccess: true,
          data: { status: 'cancelled' },
        })

        return Response.json({ success: true })
      },
    },
  ],

}
