import type { CollectionConfig } from 'payload'
import { isEditor, isFinanceField, readPublished } from '../access'
import { slugField } from '../fields/slug'
import { seoField } from '../fields/seo'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'featured'],
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
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField('title'),
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'project-categories',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      // Payload ka internal `_status` (drafts) bhi `enum_projects_status` naam maangta hai,
      // isliye is field ko apna enum naam dena zaroori hai.
      enumName: 'enum_projects_project_status',
      required: true,
      defaultValue: 'ongoing',
      options: [
        { label: 'Ongoing', value: 'ongoing' },
        { label: 'Completed', value: 'completed' },
      ],
    },
    {
      name: 'location',
      type: 'group',
      fields: [
        { name: 'city', type: 'text', required: true },
        { name: 'district', type: 'text' },
        { name: 'state', type: 'text', required: true },
      ],
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      // Meta description ban jaata hai — Google 160 chars ke baad kaat deta hai.
      maxLength: 160,
    },
    {
      name: 'body',
      type: 'richText',
    },
    {
      name: 'impactStats',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'number', required: true },
        { name: 'suffix', type: 'text' },
      ],
    },
        {
      name: 'raisedAmount',
      type: 'number',
      label: 'Amount Raised (₹)',
      min: 0,
      defaultValue: 0,
      access: {
        // Campaigns.ts jaisa hi pattern — webhook update karta hai, editor nahi.
        update: isFinanceField,
      },
      admin: {
        description: 'Updated automatically as donations are received. Only finance can override it.',
      },
    },

    {
      name: 'beneficiaries',
      type: 'number',
      min: 0,
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      name: 'partners',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        // Partner logos chhote hote hain — `media` ka 1200px minimum unhe reject kar deta.
        { name: 'logo', type: 'upload', relationTo: 'graphics' },
      ],
    },
    { name: 'startDate', type: 'date' },
    {
      name: 'endDate',
      type: 'date',
      validate: (value: unknown, options: unknown) => {
        const siblingData = (options as { siblingData?: { startDate?: string | null } })
          ?.siblingData
        const start = siblingData?.startDate

        if (!value || !start) return true

        if (new Date(value as string) < new Date(start)) {
          return 'End date cannot be before the start date.'
        }
        return true
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Featured projects appear on the homepage.',
      },
    },
    seoField(),
  ],
}
