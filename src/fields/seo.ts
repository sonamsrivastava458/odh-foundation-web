import type { Field } from 'payload'

export const seoField = (): Field => ({
  name: 'seo',
  type: 'group',
  label: 'SEO',
  fields: [
    {
      name: 'metaTitle',
      type: 'text',
      label: 'Meta Title',
      maxLength: 60,
      admin: {
        description:
          'Headline shown in Google search results. Leave blank to use the page title followed by “| ODH Foundation”.',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'Meta Description',
      maxLength: 160,
      admin: {
        description:
          'Summary shown beneath the headline in search results. Leave blank to use the excerpt.',
      },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Social Share Image',
      admin: {
        description:
          'Image shown when this page is shared on WhatsApp, Facebook or LinkedIn. Recommended 1200 × 630 px. Leave blank to use the hero image.',
      },
    },
    {
      name: 'canonicalUrl',
      type: 'text',
      label: 'Canonical URL',
      admin: {
        description:
          'Only set this if the same content is published at another URL. Points search engines to the original.',
      },
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      label: 'Hide from search engines',
      defaultValue: false,
      admin: {
        description: 'Prevents this page from appearing in Google search results.',
      },
    },
  ],
})
