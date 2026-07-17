import type { Block } from 'payload'

export const FeatureCards: Block = {
  slug: 'featureCards',
  labels: {
    singular: 'Feature Cards',
    plural: 'Feature Cards Blocks',
  },
  fields: [
    { name: 'eyebrow', type: 'text' }, // "WHY PARTNER WITH US", "MODELS"
    { name: 'heading', type: 'text', required: true },
    { name: 'subheading', type: 'textarea' },
    {
      name: 'cards',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'icon', type: 'upload', relationTo: 'graphics' },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'downloadCta',
      type: 'group',
      label: 'Optional download button',
      admin: {
        description: 'Used for things like "CSR deck (PDF)" below the cards. Leave blank to hide.',
      },
      fields: [
        { name: 'label', type: 'text' },
        { name: 'file', type: 'upload', relationTo: 'documents' },
      ],
    },
  ],
}
