import type { Block } from 'payload'

export const StatsBar: Block = {
  slug: 'statsBar',
  labels: {
    singular: 'Stats Bar',
    plural: 'Stats Bars',
  },
  fields: [
    {
      name: 'stats',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 4,
      fields: [
        { name: 'label', type: 'text', required: true },   // "Lives Impacted"
        { name: 'value', type: 'number', required: true }, // 48000
        { name: 'suffix', type: 'text' },                  // "+"
      ],
    },
  ],
}
