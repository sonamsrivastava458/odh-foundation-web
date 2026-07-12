import type { Block } from 'payload'
import { resolvedItems } from '../fields/resolvedItems'

export const FeaturedProjects: Block = {
  slug: 'featuredProjects',
  labels: {
    singular: 'Featured Projects',
    plural: 'Featured Projects Blocks',
  },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Our Work' },
    { name: 'subheading', type: 'textarea' },
    {
      name: 'mode',
      type: 'select',
      required: true,
      defaultValue: 'auto',
      label: 'How to choose projects',
      options: [
        { label: 'Automatically — show projects marked as Featured', value: 'auto' },
        { label: 'Manually — I will pick the projects', value: 'manual' },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 12,
      admin: {
        condition: (_, siblingData) => siblingData?.mode === 'auto',
      },
    },
    {
      name: 'projects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      maxRows: 12,
      admin: {
        condition: (_, siblingData) => siblingData?.mode === 'manual',
      },
    },
    resolvedItems('projects'),
    {
      name: 'ctaLabel',
      type: 'text',
      defaultValue: 'View all projects',
    },
    { name: 'ctaHref', type: 'text', defaultValue: '/projects' },
  ],
}
