import type { Block } from 'payload'

export const EventsAndCausesSection: Block = {
  slug: 'eventsAndCausesSection',

  labels: {
    singular: 'Events & Causes Section',
    plural: 'Events & Causes Sections',
  },

  fields: [
    // =========================
    // Upcoming Events
    // =========================

    {
      name: 'eventsHeading',
      type: 'text',
      defaultValue: 'Upcoming Events',
      required: true,
    },

    {
      name: 'events',
      type: 'array',
      minRows: 1,
      labels: {
        singular: 'Event',
        plural: 'Events',
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
          name: 'date',
          type: 'text',
            required: true,
        },

        {
          name: 'location',
          type: 'text',
        },

        {
          name: 'readMoreLabel',
          type: 'text',
          defaultValue: 'Read More',
        },

        {
          name: 'readMoreLink',
          type: 'relationship',
          relationTo: 'pages',
        },
      ],
    },

    // =========================
    // Latest Causes
    // =========================

    {
      name: 'causesHeading',
      type: 'text',
      defaultValue: 'Latest Causes',
      required: true,
    },

    {
      name: 'causes',
      type: 'array',
      minRows: 1,
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
      name: 'buttonLabel',
      type: 'text',
      defaultValue: 'Donate',
      required: true,
    },
    {
      name: 'buttonHref',
      type: 'text',
      defaultValue: '/donate',
      required: true,
    },
      ],
    },

    // =========================
    // Slider Settings
    // =========================

    // {
    //   type: 'collapsible',
    //   label: 'Slider Settings',
    //   fields: [
    //     {
    //       name: 'autoplay',
    //       type: 'checkbox',
    //       defaultValue: true,
    //     },

    //     {
    //       name: 'autoplayDelay',
    //       label: 'Autoplay Delay (ms)',
    //       type: 'number',
    //       defaultValue: 3000,
    //     },

    //     {
    //       name: 'loop',
    //       type: 'checkbox',
    //       defaultValue: true,
    //     },
    //   ],
    // },
  ],
}