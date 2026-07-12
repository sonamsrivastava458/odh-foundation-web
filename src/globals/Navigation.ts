import type { GlobalConfig, Validate } from 'payload'
import { isEditor, isPublic } from '../access'
import { clearHiddenNavFields } from '../hooks/clearHiddenNavFields'

type HeaderItem = {
  label?: string
  style?: string
  children?: unknown[] | null
  featuredProject?: unknown
}

/**
 * `condition` sirf UI chhupata hai aur `required` hidden fields par nahi chalta —
 * isliye "Dropdown" bina links ke, ya "Mega-menu" bina featured project ke save ho jaata tha.
 * Ye check poore array par chalta hai, jahan har item ka style aur uska data dono dikhte hain.
 */
const headerItemsAreComplete: Validate = (value) => {
  if (!Array.isArray(value)) return true

  const problems: string[] = []

  value.forEach((raw, index) => {
    const item = raw as HeaderItem
    const name = item.label?.trim() || `Item ${index + 1}`

    if (item.style === 'dropdown') {
      const links = Array.isArray(item.children) ? item.children : []
      if (links.length === 0) {
        problems.push(`“${name}” is a dropdown but has no links.`)
      }
    }

    if (item.style === 'megaMenu' && !item.featuredProject) {
      problems.push(`“${name}” is a mega-menu but has no featured project.`)
    }
  })

  return problems.length > 0 ? problems.join(' ') : true
}

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  admin: {
    group: 'Settings',
    description: 'Header menu and footer link columns.',
  },
  access: {
    read: isPublic,
    update: isEditor,
  },
  hooks: {
    beforeChange: [clearHiddenNavFields],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Header',
          fields: [
            {
              name: 'headerItems',
              type: 'array',
              label: 'Menu Items',
              maxRows: 8,
              validate: headerItemsAreComplete,        // 👈 ye add hua
              admin: {
                description:
                  'Shown left to right. The Donate button is separate — see below.',
              },
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'href', type: 'text', required: true },
                {
                  name: 'style',
                  type: 'select',
                  required: true,
                  defaultValue: 'link',
                  label: 'Menu type',
                  options: [
                    { label: 'Plain link', value: 'link' },
                    { label: 'Dropdown', value: 'dropdown' },
                    { label: 'Projects mega-menu (all categories)', value: 'megaMenu' },
                  ],
                },
                {
                  name: 'children',
                  type: 'array',
                  label: 'Dropdown links',
                  admin: {
                    condition: (_, siblingData) => siblingData?.style === 'dropdown',
                  },
                  fields: [
                    { name: 'label', type: 'text', required: true },
                    { name: 'href', type: 'text', required: true },
                  ],
                },
                {
                  name: 'featuredProject',
                  type: 'relationship',
                  relationTo: 'projects',
                  label: 'Featured project card',
                  admin: {
                    condition: (_, siblingData) => siblingData?.style === 'megaMenu',
                    description:
                      'Shown on the right of the mega-menu. Categories are pulled in automatically.',
                  },
                },
              ],
            },
            {
              name: 'donateCta',
              type: 'group',
              label: 'Donate Button',
              fields: [
                { name: 'label', type: 'text', required: true, defaultValue: 'Donate Now' },
                { name: 'href', type: 'text', required: true, defaultValue: '/donate' },
              ],
            },
          ],
        },

        {
          label: 'Footer',
          fields: [
            {
              name: 'footerColumns',
              type: 'array',
              label: 'Link Columns',
              maxRows: 4,
              fields: [
                { name: 'title', type: 'text', required: true },
                {
                  name: 'links',
                  type: 'array',
                  required: true,
                  minRows: 1,
                  fields: [
                    { name: 'label', type: 'text', required: true },
                    { name: 'href', type: 'text', required: true },
                  ],
                },
              ],
            },
            {
              name: 'legalLine',
              type: 'text',
              admin: {
                description:
                  'Bottom bar text, for example: Registered under the Indian Trusts Act, 1882.',
              },
            },
            {
              name: 'newsletter',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Show newsletter signup',
                  defaultValue: true,
                },
                { name: 'heading', type: 'text', defaultValue: 'Stay updated' },
                {
                  name: 'blurb',
                  type: 'text',
                  defaultValue: 'Field stories and impact reports, once a month.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
