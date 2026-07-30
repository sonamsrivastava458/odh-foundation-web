import type { GlobalConfig, Validate } from 'payload'
import { isEditor, isPublic } from '../access'
import { clearHiddenNavFields } from '../hooks/clearHiddenNavFields'


type HeaderItem = {
  label?: string
  style?: string
  children?: unknown[] | null
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
      const links = Array.isArray(item.children)
        ? item.children
        : []

      if (links.length === 0) {
        problems.push(
          `“${name}” is a dropdown but has no links.`,
        )
      }
    }
  })

  return problems.length
    ? problems.join(' ')
    : true
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
      maxRows: 12,
      validate: headerItemsAreComplete,
      admin: {
        description:
          'Drag & drop to change the order of the header menu.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description:
              'Example: Home, About Us, Our Projects, Campaigns',
          },
        },

        {
          name: 'href',
          type: 'text',
          required: true,
          admin: {
            description:
              'Internal path. Example: /about-us',
          },
        },

        {
          name: 'style',
          type: 'select',
          required: true,
          defaultValue: 'link',
          label: 'Menu Type',
          options: [
            {
              label: 'Plain Link',
              value: 'link',
            },
            {
              label: 'Dropdown',
              value: 'dropdown',
            },
          ],
        },

        {
          name: 'children',
          type: 'array',
          label: 'Dropdown Links',
          admin: {
            description:
              'Shown only when the menu type is Dropdown.',
            condition: (_, siblingData) =>
              siblingData?.style === 'dropdown',
          },
          minRows: 1,
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              
            },

            {
              name: 'href',
              type: 'text',
              required: true,
              
            },
          ],
        },
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
      label: 'Footer Link Columns',
      maxRows: 2,
      admin: {
        description:
          'Footer link sections like Quick Links.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'links',
          type: 'array',
          required: true,
          minRows: 1,
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'href',
              type: 'text',
              required: true,
       
            },
          ],
        },
      ],
    },

    {
      name: 'legalLine',
      type: 'text',
      required: true,
      defaultValue:
        'Copyright © ODH Foundation NGO in India. All Rights Reserved.',
      admin: {
        description:
          'Bottom copyright text.',
      },
    },
  ],
}
      ],
    },
  ],
}
