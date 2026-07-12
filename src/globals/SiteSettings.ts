import type { GlobalConfig } from 'payload'
import { isPublic, isSuperAdmin } from '../access'
import { validateInternalPath, validatePan, validatePhone, validateUrl } from '../fields/validators'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Settings',
    description: 'Logo, contact details, registration numbers and the announcement bar.',
  },
  access: {
    read: isPublic,
    update: isSuperAdmin,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ---------- Brand ----------
        {
          label: 'Brand',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
              defaultValue: 'ODH Foundation',
            },
            {
              name: 'tagline',
              type: 'textarea',
              admin: {
                description: 'One-line mission statement. Shown in the footer.',
              },
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'graphics',
              required: true,
              admin: { description: 'SVG preferred. Shown in the header.' },
            },
            {
              name: 'logoLight',
              type: 'upload',
              relationTo: 'graphics',
              admin: {
                description: 'Optional light version, for use on dark backgrounds such as the footer.',
              },
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'graphics',
              admin: { description: 'Browser tab icon. 32 × 32 px or an SVG.' },
            },
            {
              name: 'defaultOgImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Default Social Share Image',
              admin: {
                description:
                  'Used when a page has no share image of its own. Recommended 1200 × 630 px.',
              },
            },
          ],
        },

        // ---------- Contact ----------
        {
          label: 'Contact',
          fields: [
            {
              name: 'contact',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'address',
                  type: 'textarea',
                  required: true,
                  admin: {
                    description: 'Registered office address, shown in the footer.',
                    // Pate me line breaks chahiye — isliye sanitizePlainText isse chhod dega.
                    custom: { multiline: true },
                  },
                },
                {
                  name: 'phone',
                  type: 'text',
                  required: true,
                  validate: validatePhone,
                },
                {
                  name: 'email',
                  type: 'email',
                  required: true,
                },
                {
                  name: 'hours',
                  type: 'text',
                  admin: { description: 'For example: Mon–Fri, 10:00 – 18:00' },
                },
                {
                  name: 'mapUrl',
                  type: 'text',
                  label: 'Google Maps Link',
                  validate: validateUrl,
                  admin: {
                    description: 'Opens when someone clicks the map on the Contact page.',
                  },
                },
              ],
            },
          ],
        },

        // ---------- Registrations ----------
        {
          label: 'Registrations',
          fields: [
            {
              name: 'registrations',
              type: 'group',
              label: false,
              admin: {
                description:
                  'Shown in the footer and on the trust strip. Donors check these before giving.',
              },
              fields: [
                {
                  name: 'pan',
                  type: 'text',
                  label: 'PAN',
                  validate: validatePan,
                },
                { name: 'reg80G', type: 'text', label: '80G Registration Number' },
                { name: 'reg12A', type: 'text', label: '12A Registration Number' },
                { name: 'csr1', type: 'text', label: 'CSR-1 Registration Number' },
                {
                  name: 'certificates',
                  type: 'array',
                  labels: { singular: 'Certificate', plural: 'Certificates' },
                  admin: {
                    description: 'Downloadable PDFs shown on the About page.',
                  },
                  fields: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'file', type: 'upload', relationTo: 'documents', required: true },
                  ],
                },
              ],
            },
          ],
        },

        // ---------- Social ----------
        {
          label: 'Social',
          fields: [
            {
              name: 'socialLinks',
              type: 'array',
              label: 'Social Profiles',
              maxRows: 6,
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'X (Twitter)', value: 'x' },
                    { label: 'YouTube', value: 'youtube' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  validate: validateUrl,
                },
              ],
            },
          ],
        },

        // ---------- Announcement bar ----------
        {
          label: 'Announcement Bar',
          fields: [
            {
              name: 'announcement',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Show announcement bar',
                  defaultValue: false,
                },
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled === true,
                  },
                },
                {
                  name: 'linkLabel',
                  type: 'text',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled === true,
                  },
                },
                {
                  name: 'linkHref',
                  type: 'text',
                  validate: validateInternalPath,
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled === true,
                  },
                },
              ],
            },
          ],
        },

        // ---------- Analytics ----------
        {
          label: 'Analytics',
          fields: [
            {
              name: 'ga4Id',
              type: 'text',
              label: 'Google Analytics 4 Measurement ID',
              admin: { description: 'For example: G-XXXXXXXXXX' },
            },
            {
              name: 'clarityId',
              type: 'text',
              label: 'Microsoft Clarity Project ID',
            },
          ],
        },
      ],
    },
  ],
}
