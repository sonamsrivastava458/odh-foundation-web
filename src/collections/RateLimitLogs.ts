import type { CollectionConfig } from 'payload'

export const RateLimitLogs: CollectionConfig = {
  slug: 'rate-limit-logs',

  admin: {
    group: 'Security',
    useAsTitle: 'ip',
    defaultColumns: [
      'ip',
      'endpoint',
      'country',
      'userAgent',
      'createdAt',
    ],
  },

  access: {
    read: () => true,
    create: () => false,
    update: () => false,
    delete: () => false,
  },

  fields: [
    {
      name: 'ip',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'endpoint',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'method',
      type: 'text',
      required: true,
    },
    {
      name: 'country',
      type: 'text',
    },
    {
      name: 'userAgent',
      type: 'textarea',
    },
    {
      name: 'reason',
      type: 'text',
    },
    {
      name: 'remainingPoints',
      type: 'number',
    },
    {
      name: 'retryAfter',
      type: 'number',
    },
  ],
}