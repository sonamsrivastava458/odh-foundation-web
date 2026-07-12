import type { CollectionConfig } from 'payload'
import { isEditor, isPublic } from '../access'
import { enforceFileSize } from '../hooks/enforceFileSize'

/** Doc §10: PDF uploads capped at 5 MB */
const MAX_PDF_BYTES = 5 * 1024 * 1024

export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: {
    singular: 'Document',
    plural: 'Documents',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    description: 'PDFs — certificates, annual reports, the CSR deck.',
  },
  access: {
    read: isPublic,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  hooks: {
    beforeValidate: [enforceFileSize(MAX_PDF_BYTES)],
  },
  upload: {
    mimeTypes: ['application/pdf'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Shown as the download link text.' },
    },
  ],
}
