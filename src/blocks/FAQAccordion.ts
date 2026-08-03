import type { Block } from 'payload'

export const FAQAccordion: Block = {
  slug: 'faqAccordion',
  labels: {
    singular: 'FAQ Accordion',
    plural: 'FAQ Accordions',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Frequently Asked Questions',
    },
    {
      name: 'faqs',
      type: 'array',
      required: true,
      minRows: 1,
      labels: {
        singular: 'FAQ',
        plural: 'FAQs',
      },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'richText', required: true },
        
        {
          name: 'defaultOpen',
          type: 'checkbox',
          label: 'Open by default (first one should ideally be true)',
          defaultValue: false,
        },
      ],
    },
  ],
}