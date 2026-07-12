import type { CollectionConfig } from 'payload'
import { isEditor, readPublished } from '../access'
import { slugField } from '../fields/slug'
import { seoField } from '../fields/seo'

export const Careers: CollectionConfig = {
  slug: 'careers',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'location', 'active'],
    group: 'Content',
  },
  access: {
    read: readPublished,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    { name: 'location', type: 'text', required: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'full-time',
      options: [
        { label: 'Full-time', value: 'full-time' },
        { label: 'Part-time', value: 'part-time' },
        { label: 'Volunteer', value: 'volunteer' },
        { label: 'Intern', value: 'intern' },
      ],
    },
    { name: 'description', type: 'richText' },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    seoField(),
  ],
}
