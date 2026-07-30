import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { isEditor, isPublic } from '../access'
import { preventInUseDelete } from '../hooks/preventInUseDelete'
import { enforceFileSize } from '../hooks/enforceFileSize'

// const MIN_WIDTH = 1200
/** Doc §10: image uploads capped at 10 MB */
const MAX_IMAGE_BYTES = 10 * 1024 * 1024

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Photo',
    plural: 'Photos',
  },
  admin: {
    useAsTitle: 'alt',
    description:
      'Photographs from the field. Converted to WebP and resized automatically. Minimum width 1200px.',
  },
  access: {
    read: isPublic,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  hooks: {
    beforeValidate: [
      enforceFileSize(MAX_IMAGE_BYTES),
      ({ data, operation }) => {
        // Sirf naye upload pe check karo
        if (operation !== 'create') return data

        // Payload sharp se dimensions nikal kar `data` me daal chuka hota hai
        // (generateFileData beforeValidate se pehle chalta hai)
        const width = data?.width

        // if (typeof width === 'number' && width < MIN_WIDTH) {
        //   throw new APIError(
        //     `This image is only ${width}px wide. Photos must be at least ${MIN_WIDTH}px wide so that ` +
        //       `the card and hero sizes can be generated. If this is a logo, icon, badge or QR code, ` +
        //       `upload it under Graphics instead.`,
        //     400,
        //   )
        // }

        return data
      },
    ],
    // Use ho rahi image delete na ho — warna live site par image gayab ho jayegi
    beforeDelete: [preventInUseDelete('media')],
  },
  upload: {
    mimeTypes: ['image/*'],
    adminThumbnail: 'thumb',
    resizeOptions: {
      width: 2400,
      height: undefined,
      withoutEnlargement: true,
    },
    formatOptions: {
      format: 'webp',
      options: { quality: 80 },
    },
    imageSizes: [
      { name: 'thumb', width: 480, formatOptions: { format: 'webp', options: { quality: 75 } } },
      { name: 'card', width: 768, formatOptions: { format: 'webp', options: { quality: 78 } } },
      { name: 'feature', width: 1280, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'hero', width: 1920, formatOptions: { format: 'webp', options: { quality: 82 } } },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
      required: true,
      admin: {
        description:
          'Describe what is in the photo. Read aloud by screen readers and used by search engines.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional. Shown below the photo where the design allows.',
      },
    },
  ],
}
