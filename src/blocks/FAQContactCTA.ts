import type { Block } from 'payload'
export const FAQContactCTA: Block = {
  slug: 'faqContactCTA',

  fields: [

    {
      name: 'heading',
      type: 'text',
      required: true,
    },

    {
      name: 'description',
      type: 'textarea',
    },

    // {
    //   name: 'phoneNumbers',
    //   type: 'array',
    //   fields: [
    //     {
    //       name: 'phone',
    //       type: 'text',
    //       required: true,
    //     },
    //   ],
    // },

    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },

    // {
    //   name: 'overlayOpacity',
    //   type: 'number',
    //   defaultValue: 50,
    // },

    // {
    //   name: 'showBackground',
    //   type: 'checkbox',
    //   defaultValue: true,
    // },
  ],
}