import type { Block } from 'payload'
import { resolvedItems } from '../fields/resolvedItems'

export const TestimonialCarousel: Block = {
  slug: 'testimonialCarousel',
  labels: {
    singular: 'Testimonial Carousel',
    plural: 'Testimonial Carousels',
  },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Voices from the field' },
    {
      name: 'mode',
      type: 'select',
      required: true,
      defaultValue: 'auto',
      label: 'How to choose testimonials',
      options: [
        { label: 'Automatically — show the most recent', value: 'auto' },
        { label: 'Manually — I will pick the testimonials', value: 'manual' },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 10,
      admin: {
        condition: (_, siblingData) => siblingData?.mode === 'auto',
      },
    },
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.mode === 'manual',
      },
    },
    resolvedItems('testimonials'),
  ],
}
