import type { Block } from 'payload'
import { resolvedItems } from '../fields/resolvedItems'

export const CategoryGrid: Block = {
  slug: 'categoryGrid',
  labels: {
    singular: 'Category Grid',
    plural: 'Category Grids',
  },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Our Focus Areas' },
    { name: 'subheading', type: 'textarea' },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '4',
      options: [
        { label: '3 per row', value: '3' },
        { label: '4 per row', value: '4' },
      ],
    },
    resolvedItems('project-categories'),
  ],
}
