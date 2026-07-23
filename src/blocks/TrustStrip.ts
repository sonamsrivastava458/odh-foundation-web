import type { Block } from 'payload'

export const TrustStrip: Block = {
  slug: 'trustStrip',
  labels: {
    singular: 'Trust Strip',
    plural: 'Trust Strips',
  },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'badges',
      type: 'array',
      maxRows: 6,
      fields: [
        { name: 'label', type: 'text', required: true },  // "80G Certified"
        { name: 'note', type: 'text' },                   // "Donations are tax-deductible"
      ],
    },
    {
  name: 'logos',
  type: 'array',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'graphics', required: true },                                         
    { name: 'url', type: 'text' },
  ],
},

  ],
}
