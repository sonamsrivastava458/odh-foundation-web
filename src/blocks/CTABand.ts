import type { Block } from 'payload'

export const CTABand: Block = {
  slug: 'ctaBand',
  labels: {
    singular: 'CTA Band',
    plural: 'CTA Bands',
  },
  fields: [
    { name: 'eyebrow', type: 'text' }, // "MAKE A DIFFERENCE TODAY"
    { name: 'heading', type: 'text', required: true },
    {
      name: 'subheading',
      type: 'textarea',
    },
    { name: 'ctaLabel', type: 'text', required: true, defaultValue: 'Donate Now' },
    { name: 'ctaHref', type: 'text', required: true, defaultValue: '/donate' },
    {
      name: 'secondaryCta',
      type: 'group',
      admin: {
        description: 'Optional second button, e.g. "Volunteer With Us". Leave label blank to hide.',
      },
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
    {
      name: 'trustBadges',
      type: 'array',
      label: 'Trust badges (small text line)',
      maxRows: 4,
      fields: [{ name: 'text', type: 'text', required: true }], // "80G Certified"
    },
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
