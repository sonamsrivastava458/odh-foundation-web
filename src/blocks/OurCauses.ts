import type { Block } from 'payload'

export const OurCauses: Block = {
  slug: 'ourCauses',

  labels: {
    singular: 'Our Causes',
    plural: 'Our Causes Blocks',
  },

  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Our Causes',
    },

    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Short text displayed below the heading.',
      },
    },

    {
      name: 'causes',
      type: 'array',
      required: true,
      minRows: 3,
      maxRows: 12,
      labels: {
        singular: 'Cause',
        plural: 'Causes',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },

        {
          name: 'title',
          type: 'text',
          required: true,
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
              defaultValue: 'Donate',
            },
            {
              name: 'href',
              type: 'text',
              defaultValue: '/donate',
            },
          ],
        },
      ],
    },
  ],
}