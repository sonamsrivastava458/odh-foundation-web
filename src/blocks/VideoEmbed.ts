import type { Block } from 'payload'

export const VideoEmbed: Block = {
  slug: 'videoEmbed',
  labels: {
    singular: 'Video Embed',
    plural: 'Video Embeds',
  },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'videoUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'YouTube URL — loaded lazily on click (lite-youtube-embed), never an eager iframe (spec §9).',
      },
    },
    { name: 'caption', type: 'text' },
  ],
}
