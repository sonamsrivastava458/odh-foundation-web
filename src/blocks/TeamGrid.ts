import type { Block } from 'payload'
import { resolvedItems } from '../fields/resolvedItems'

export const TeamGrid: Block = {
  slug: 'teamGrid',

  interfaceName: 'TeamGridBlock',

  labels: {
    singular: 'Team Grid',
    plural: 'Team Grids',
  },

  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Our Team',
    },

    {
      name: 'subheading',
      type: 'textarea',
    },

    {
      name: 'showFoundersFirst',
      type: 'checkbox',
      defaultValue: true,
    },

    resolvedItems('team-members'),
  ],
}