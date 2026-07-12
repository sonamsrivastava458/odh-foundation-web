import type { Block } from 'payload'

export const CTABand: Block = {
  slug: 'ctaBand',
  labels: {
    singular: 'CTA Band',
    plural: 'CTA Bands',
  },
  fields: [
    { name: 'heading', type: 'text', required: true },
    {
      name: 'subheading',
      type: 'textarea',
    },
    { name: 'ctaLabel', type: 'text', required: true, defaultValue: 'Donate Now' },
    { name: 'ctaHref', type: 'text', required: true, defaultValue: '/donate' },
    {
      name: 'qrImage',
      type: 'upload',
     relationTo: 'graphics',
      admin: {
        description: 'UPI QR code for donors who prefer to pay directly.',
      },
    },
  ],
}
