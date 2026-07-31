import type { Block } from 'payload'

export const VisionMission: Block = {
  slug: 'visionMission',

  interfaceName: 'VisionMissionBlock',

  labels: {
    singular: 'Vision & Mission',
    plural: 'Vision & Mission',
  },

  fields: [
    {
      name: 'vision',
      type: 'group',
      label: 'Vision',

      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
          defaultValue: 'Our Vision',
        },

        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },

    {
      name: 'mission',
      type: 'group',
      label: 'Mission',

      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
          defaultValue: 'Our Mission',
        },

        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}