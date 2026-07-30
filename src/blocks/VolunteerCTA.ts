import type { Block } from 'payload'

export const VolunteerCTA: Block = {
  slug: 'volunteerCTA',

  labels: {
    singular: 'Volunteer CTA',
    plural: 'Volunteer CTA Blocks',
  },

  fields: [
    {
      name: 'backgroundImage',
      label: 'Background Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    {
      name: 'foregroundImage',
      label: 'Right Side Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Become a Volunteer',
    },

    {
      name: 'description',
      type: 'textarea',
      required: true,
    },

    {
      name: 'button',
      type: 'group',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          defaultValue: 'Join Us',
        },
        {
          name: 'href',
          type: 'text',
          required: true,
          defaultValue: '/volunteer',
        },
      ],
    },
  ],
}