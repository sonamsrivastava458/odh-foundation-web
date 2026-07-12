import type { Block } from 'payload'
import { resolvedItems } from '../fields/resolvedItems'

export const FeaturedCampaigns: Block = {
  slug: 'featuredCampaigns',
  labels: {
    singular: 'Featured Campaigns',
    plural: 'Featured Campaigns Blocks',
  },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Our Campaigns' },
    { name: 'subheading', type: 'textarea' },
    {
      name: 'mode',
      type: 'select',
      required: true,
      defaultValue: 'auto',
      label: 'How to choose campaigns',
      options: [
        { label: 'Automatically — show campaigns marked as Featured', value: 'auto' },
        { label: 'Manually — I will pick the campaigns', value: 'manual' },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 12,
      admin: {
        condition: (_, siblingData) => siblingData?.mode === 'auto',
      },
    },
    {
      name: 'campaigns',
      type: 'relationship',
      relationTo: 'campaigns',
      hasMany: true,
      maxRows: 12,
      admin: {
        condition: (_, siblingData) => siblingData?.mode === 'manual',
      },
    },
    resolvedItems('campaigns'),
    { name: 'ctaLabel', type: 'text', defaultValue: 'See all campaigns' },
    { name: 'ctaHref', type: 'text', defaultValue: '/campaigns' },
  ],
}
