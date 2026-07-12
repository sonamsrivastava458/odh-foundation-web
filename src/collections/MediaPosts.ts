import type { CollectionConfig } from 'payload'
import { isEditor, readPublished } from '../access'
import { slugField } from '../fields/slug'
import { seoField } from '../fields/seo'
import { validateUrl } from '../fields/validators'
import { clearHiddenFields } from '../hooks/clearHiddenFields'

type MediaPostData = { type?: string }

export const MediaPosts: CollectionConfig = {
  slug: 'media-posts',
  labels: {
    singular: 'Media Post',
    plural: 'Media Posts',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'publishDate'],
    group: 'Content',
  },
  access: {
    read: readPublished,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  versions: { drafts: true },
  hooks: {
    // Type badalne par purane type ka data DB me na bacha rahe —
    // warna news post par video embed ho sakta hai.
    beforeChange: [
      clearHiddenFields<MediaPostData>(
        {
          galleryImages: (d) => d.type === 'gallery',
          videoUrl: (d) => d.type === 'video',
          externalUrl: (d) => d.type === 'press',
        },
        { galleryImages: [] },
      ),
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'news',
      options: [
        { label: 'News', value: 'news' },
        { label: 'Press Coverage', value: 'press' },
        { label: 'Blog', value: 'blog' },
        { label: 'Photo Gallery', value: 'gallery' },
        { label: 'Video', value: 'video' },
      ],
    },
    { name: 'publishDate', type: 'date', required: true },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'team-members',
    },
    { name: 'heroImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'excerpt', type: 'textarea', required: true, maxLength: 160 },
    { name: 'body', type: 'richText' },

    // Ye teen fields sirf apne type par dikhengi (aur beforeChange hook baaki saaf kar deta hai)
    {
      name: 'galleryImages',
      type: 'array',
      admin: {
        condition: (data) => data?.type === 'gallery',
      },
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video URL',
      validate: validateUrl,
      admin: {
        condition: (data) => data?.type === 'video',
        description: 'Full YouTube link, for example https://www.youtube.com/watch?v=…',
      },
    },
    {
      name: 'externalUrl',
      type: 'text',
      label: 'Link to the original article',
      validate: validateUrl,
      admin: {
        condition: (data) => data?.type === 'press',
      },
    },

    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text', required: true }],
    },
    seoField(),
  ],
}
