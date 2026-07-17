import type { CollectionConfig } from 'payload'
import { isFinance, isSuperAdmin } from '../access'
import { validatePan, validatePhone } from '../fields/validators'

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
}
