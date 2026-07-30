import type { Block } from 'payload'

export const HomeIntroSection: Block = {
  slug: 'homeIntroSection',
  labels: {
    singular: 'Home Intro Section',
    plural: 'Home Intro Sections',
  },
  fields: [
    // -------------------------
    // ABOUT
    // -------------------------
    {
      name: 'about',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: 'About ODH Foundation',
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
              defaultValue: 'Learn More',
            },
            {
              name: 'href',
              type: 'text',
              defaultValue: '/about',
            },
          ],
        },
      ],
    },

    // -------------------------
    // FEATURED PROJECT
    // -------------------------
    {
      name: 'featuredProject',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: 'Featured Project',
        },
        {
          name: 'images',
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
    },

    // -------------------------
    // GET INVOLVED
    // -------------------------
    {
      name: 'getInvolved',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'Get Involved',
        },
        {
          name: 'items',
          type: 'array',
          required: true,
          minRows: 1,
          maxRows: 6,
          fields: [
            {
              name: 'icon',
              type: 'upload',
              relationTo: 'graphics',
              required: true,
            },
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'href',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}