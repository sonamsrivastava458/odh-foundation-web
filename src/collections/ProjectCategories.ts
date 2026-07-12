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
      // Category landing page ka SEO copy (doc §8.3: 150-300 words)
      name: 'introText',
      type: 'richText',
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
