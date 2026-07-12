import type { Block } from 'payload'

export const AboutStrip: Block = {
  slug: 'aboutStrip',
  labels: {
    singular: 'About Strip',
    plural: 'About Strips',
  },
  fields: [
    { name: 'eyebrow', type: 'text' }, // "Who We Are"
    { name: 'title', type: 'text', required: true },
    {
      name: 'paragraphs',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 4, // doc -> "3-4 sentence mission"
      fields: [
        {
          name: 'text',
          type: 'textarea',
          required: true,
        },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'link',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', defaultValue: 'Read our story' },
        { name: 'href', type: 'text', defaultValue: '/about' },
      ],
    },
  ],
}
