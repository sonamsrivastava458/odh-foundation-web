import type { CollectionConfig } from 'payload'
import { isEditor, isPublic } from '../access'
import { validateInternalPath } from '../fields/validators'

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  labels: {
    singular: 'Redirect',
    plural: 'Redirects',
  },
  admin: {
    useAsTitle: 'from',
    defaultColumns: ['from', 'to', 'type'],
    group: 'Settings',
    description:
      'Old URL → new URL mappings, for when the site migrates off the old domain structure. The frontend reads this list to issue real 301/302 redirects.',
  },
  access: {
    read: isPublic, // frontend ko bina login ke fetch karna hai
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  fields: [
    {
      name: 'from',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      validate: validateInternalPath,
      admin: { description: 'Old path, e.g. /old-about-us' },
    },
    {
      name: 'to',
      type: 'text',
      required: true,
      validate: validateInternalPath,
      admin: { description: 'New path it should redirect to, e.g. /about' },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: '301',
      options: [
        { label: '301 — Permanent', value: '301' },
        { label: '302 — Temporary', value: '302' },
      ],
    },
  ],
}
