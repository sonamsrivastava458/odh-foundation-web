import type { Block } from 'payload'

export const Hero: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero',
    plural: 'Hero Blocks',
  },
  fields: [
    {
      name: 'slides',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 3, // doc §5.1 -> "Rotating (max 3)"
      fields: [
        { name: 'headline', type: 'text', required: true },
        { name: 'subline', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'primaryCta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', defaultValue: 'Donate Now' },
        { name: 'href', type: 'text', defaultValue: '/donate' },
      ],
    },
    {
      name: 'secondaryCta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', defaultValue: 'Explore Our Work' },
        { name: 'href', type: 'text', defaultValue: '/projects' },
      ],
    },
  ],
}
