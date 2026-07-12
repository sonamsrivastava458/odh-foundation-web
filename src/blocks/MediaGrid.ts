import type { Block } from 'payload'
import { resolvedItems } from '../fields/resolvedItems'

export const MediaGrid: Block = {
  slug: 'mediaGrid',
  labels: {
    singular: 'Media Grid',
    plural: 'Media Grids',
  },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'News & Updates' },
    { name: 'subheading', type: 'textarea' },
    {
      name: 'filterByType',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'News', value: 'news' },
        { label: 'Press Coverage', value: 'press' },
        { label: 'Blog', value: 'blog' },
        { label: 'Photo Gallery', value: 'gallery' },
        { label: 'Video', value: 'video' },
      ],
      label: 'Show only these types',
      admin: {
        description: 'Leave blank to show posts of every type.',
      },
    },
    { name: 'limit', type: 'number', defaultValue: 3, min: 1, max: 12 },
    resolvedItems('media-posts'),
    { name: 'ctaLabel', type: 'text', defaultValue: 'All updates' },
    { name: 'ctaHref', type: 'text', defaultValue: '/media' },
  ],
}
