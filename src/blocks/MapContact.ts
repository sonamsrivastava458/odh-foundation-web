import type { Block } from 'payload'

export const MapContact: Block = {
  slug: 'mapContact',
  labels: {
    singular: 'Map & Contact',
    plural: 'Map & Contact Blocks',
  },
  fields: [
    {
      name: 'mapImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description:
          'Static map screenshot, links out to Google Maps. Office address/phone/email/hours come from Site Settings → Contact — not repeated here. Never embed a live Maps iframe (spec §5.10).',
      },
    },
  ],
}
