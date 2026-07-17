import type { Block } from 'payload'

export const Timeline: Block = {
  slug: 'timeline',
  labels: {
    singular: 'Timeline',
    plural: 'Timelines',
  },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Our Journey' },
    {
      name: 'milestones',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        { name: 'year', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}
