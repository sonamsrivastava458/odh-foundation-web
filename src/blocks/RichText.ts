import type { Block } from 'payload'

export const RichText: Block = {
  slug: 'richText',

  labels: {
    singular: 'Rich Text',
    plural: 'Rich Text Blocks',
  },

  fields: [
    {
      name: 'eyebrow',
      type: 'text',
    },

    {
      name: 'heading',
      type: 'text',
    },

    {
      name: 'content',
      type: 'richText',
      required: true,
    },

    {
      type: 'collapsible',
      label: 'Call To Action',
      fields: [
        {
          name: 'showButton',
          type: 'checkbox',
          defaultValue: false,
        },

        {
          name: 'buttonLabel',
          type: 'text',
          defaultValue: 'Click Here For More Information',
          admin: {
            condition: (_, siblingData) => siblingData?.showButton,
          },
        },

        {
          name: 'buttonPage',
          type: 'relationship',
          relationTo: 'pages',
          admin: {
            condition: (_, siblingData) => siblingData?.showButton,
          },
        },
      ],
    },
  ],
}