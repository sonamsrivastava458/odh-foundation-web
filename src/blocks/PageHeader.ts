import type { Block } from 'payload'

export const PageHeader: Block = {
  slug: 'pageHeader',
  labels: {
    singular: 'Page Header',
    plural: 'Page Headers',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'textarea' },
    {
      name: 'crumbs',
      type: 'array',
      labels: { singular: 'Crumb', plural: 'Crumbs' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional background photo — falls back to the brand gradient if empty.',
      },
    },
  ],
}
