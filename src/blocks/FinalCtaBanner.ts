import type { Block } from 'payload'

export const FinalCtaBanner: Block = {
  slug: 'finalctabanner',
  labels: {
    singular: 'CTA Banner',
    plural: 'CTA Banners',
  },
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'buttonLabel',
      type: 'text',
      defaultValue: 'Donate',
      required: true,
    },
    {
      name: 'buttonHref',
      type: 'text',
      defaultValue: '/donate',
      required: true,
    },
  ],
}