import type { Block } from 'payload'
import { resolvedItems } from '../fields/resolvedItems'

export const TeamGrid: Block = {
  slug: 'teamGrid',
  labels: {
    singular: 'Team Grid',
    plural: 'Team Grids',
  },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Meet Our Team' },
    { name: 'subheading', type: 'textarea' },
    resolvedItems('team-members'),
  ],
}
