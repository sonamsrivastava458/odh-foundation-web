import type { Block } from 'payload'

export const AboutIntroSection: Block = {
  slug: 'aboutIntroSection',

  labels: {
    singular: 'About Intro Section',
    plural: 'About Intro Sections',
  },

  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'leftHeading',
          label: 'Left Heading',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'rightHeading',
          label: 'Right Heading',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
      ],
    },

    {
      name: 'description',
      label: 'Description',
      type: 'richText',
      required: true,
    },

    {
      name: 'button',
      type: 'group',
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Contact Us',
        },
        {
          name: 'href',
          type: 'text',
          required: true,
        },
      ],
    },

    {
      name: 'sliderImages',
      label: 'Image Slider',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}