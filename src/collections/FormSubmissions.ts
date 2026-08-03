import type { CollectionConfig } from 'payload'
import { isEditor, isSuperAdmin } from '../access'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  labels: {
    singular: 'Form Submission',
    plural: 'Form Submissions',
  },
  admin: {
    useAsTitle: 'formType',
    defaultColumns: ['formType', 'page', 'status', 'createdAt'],
    group: 'Engagement',
    description:
      'Written by the public /api/forms/submit API. Staff triage happens here — mark Read/Archived as you action each one.',
  },
  access: {
    read: isEditor,
    create: isEditor, // public submissions go through the API route with overrideAccess — nobody can POST here directly
    update: isEditor,
    delete: isSuperAdmin,
  },
  timestamps: true,
  fields: [
    {
      name: 'formType',
      type: 'select',
      required: true,
      options: [
        { label: 'Contact', value: 'contact' },
        { label: 'Volunteer', value: 'volunteer' },
        { label: 'CSR', value: 'csr' },
        { label: 'Career', value: 'career' },
        { label: 'Newsletter', value: 'newsletter' },
      ],
    },
    { name: 'page', type: 'relationship', relationTo: 'pages', required: true },
    {
      name: 'blockId',
      type: 'text',
      required: true,
      admin: { description: 'Which Form block on the page this came from — matches its internal block ID.' },
    },
    {
      name: 'data',
      type: 'json',
      required: true,
      admin: { description: "The submitted field values, keyed by each field's Name." },
    },
    {
      name: 'files',
      label: 'Uploaded Files',
      type: 'array',
      admin: {
        description:
          'Files uploaded with this submission. Each item links to the Media library.',
      },
      fields: [
        {
          name: 'fieldName',
          type: 'text',
          required: true,
          admin: {
            readOnly: true,
            description:
              'The FormBlock field name that uploaded this file.',
          },
        },
        {
          name: 'file',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Read', value: 'read' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
