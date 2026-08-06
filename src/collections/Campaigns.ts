import type { CollectionConfig } from 'payload'
import { isEditor, isFinanceField, readPublished } from '../access'
import { slugField } from '../fields/slug'
import { seoField } from '../fields/seo'

export const Campaigns: CollectionConfig = {
  slug: 'campaigns',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'goalAmount', 'raisedAmount', 'active'],
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
    { name: 'heroImage', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'crumbs',
      type: 'array',
      labels: { singular: 'Crumb', plural: 'Crumbs' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text' },
      ],
    },
    { name: 'excerpt', type: 'textarea', maxLength: 160 },
    { name: 'body', type: 'richText' },
    {
      name: 'goalAmount',
      type: 'number',
      label: 'Fundraising Goal (₹)',
      min: 0,
      admin: {
        description: 'Leave blank if this campaign has no fundraising target.',
      },
    },
    {
      name: 'raisedAmount',
      type: 'number',
      label: 'Amount Raised (₹)',
      min: 0,
      defaultValue: 0,
      access: {
        // Paise ka field — donation webhook isse update karta hai. Editor ise badal
        // kar jhoota progress bar nahi dikha sakta.
        update: isFinanceField,
      },
      admin: {
        description:
          'Updated automatically as donations are received. Only finance can override it.',
      },
    },
    {
      name: 'showProgress',
      type: 'checkbox',
      label: 'Show progress bar',
      defaultValue: false,
      admin: {
        description: 'Displays the amount raised against the goal on the campaign page.',
      },
    },
   {
  name: 'donation',
  type: 'group',
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'allowCustomAmount',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'presetAmounts',
      type: 'array',
      maxRows: 6,
      fields: [
        {
          name: 'amount',
          type: 'number',
          required: true,
        },
        {
          name: 'impactText',
          type: 'text',
          required: true,
          admin: {
            description:
              'Text shown below the amount when this amount is selected.',
          },
        },
        {
          name: 'highlight',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
  ],
},
    {
      name: 'faqs',
      type: 'array',
      admin: {
        description: 'Shown as an accordion, and published as FAQ structured data for Google.',
      },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
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
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Featured campaigns appear on the homepage.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Uncheck to retire a campaign without deleting it.',
      },
    },
    seoField(),
  ],
}
