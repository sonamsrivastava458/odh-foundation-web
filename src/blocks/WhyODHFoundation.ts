import type { Block } from 'payload'

export const WhyODHFoundation: Block = {
  slug: 'whyODHFoundation',
  labels: {
    singular: 'Why ODH Foundation',
    plural: 'Why ODH Foundation Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Why ODH Foundation',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'features',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'graphics',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}