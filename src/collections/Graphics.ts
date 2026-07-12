import type { CollectionConfig } from 'payload'
import { isEditor, isPublic } from '../access'
import { preventInUseDelete } from '../hooks/preventInUseDelete'

export const Graphics: CollectionConfig = {
  slug: 'graphics',
  labels: {
    singular: 'Graphic',
    plural: 'Graphics',
  },
  admin: {
    useAsTitle: 'alt',
    group: 'Content',
    description: 'Logos, icons, badges and QR codes. Uploaded as-is — no resizing or conversion.',
  },
  access: {
    read: isPublic,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  hooks: {
    beforeDelete: [preventInUseDelete('graphics')],
  },
  upload: {
    // SVG bhi allow — logo/icon ke liye best (koi bhi size, zero blur)
    mimeTypes: ['image/png', 'image/svg+xml', 'image/webp', 'image/jpeg'],
    // Koi imageSizes nahi, koi format conversion nahi.
    // Graphic jaisi upload hui, waisi hi rahegi — transparency aur
    // sharp edges bach jaate hain.
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
      required: true,
      admin: {
        description: 'Describe the graphic, e.g. “80G certified badge”.',
      },
    },
  ],
}
