import type { CollectionConfig } from 'payload'
import { isEditor, readPublished } from '../access'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role'],
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
    { name: 'quote', type: 'textarea', required: true },
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'text',
      required: true,
      label: 'Role / Location', // e.g. "Farmer, Sitapur"
    },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'relatedProject',
      type: 'relationship',
      relationTo: 'projects',
    },
  ],
}
