import type { Block } from 'payload'

export const HowYouCanHelp: Block = {
  slug: 'howYouCanHelp',
  labels: {
    singular: 'How You Can Help',
    plural: 'How You Can Help Blocks',
  },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'How you can help' },
    {
      name: 'options',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 3,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'ctaLabel', type: 'text', required: true },
        { name: 'ctaHref', type: 'text', required: true },
        { name: 'icon', type: 'upload', relationTo: 'graphics', required: true },
      ],
    },
  ],
}
