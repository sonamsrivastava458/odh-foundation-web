import type { CollectionConfig } from 'payload'
import { isEditor, readPublished } from '../access'
import { slugField } from '../fields/slug'
import { seoField } from '../fields/seo'


export const ProjectCategories: CollectionConfig = {
  slug: 'project-categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order'],
    group: 'Content',
  },
  access: {
    read: readPublished,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    slugField('name'), // slug 'name' se banega
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'graphics',   // ← category icons chhote hote hain

    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'crumbs',
      type: 'array',
      labels: { singular: 'Crumb', plural: 'Crumbs' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text' },
      ],
    },
    {
      // Category landing page ka SEO copy (doc §8.3: 150-300 words)

      name: 'content',
      type: 'richText',

    },
    {
      name: 'donateCTA',
      type: 'group',
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Donate Now',
        },
        {
          name: 'link',
          type: 'text',
          defaultValue: '/donate',
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    seoField(),
  ],
}
