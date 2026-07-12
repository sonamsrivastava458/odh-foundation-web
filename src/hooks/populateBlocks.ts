import type { CollectionAfterReadHook, PayloadRequest, Where } from 'payload'

type Block = Record<string, unknown> & { blockType?: string }

type ResolvableCollection =
  | 'projects'
  | 'campaigns'
  | 'testimonials'
  | 'media-posts'
  | 'project-categories'

const MAX_LIMIT = 12
const DEFAULT_LIMIT = 3

const clampLimit = (value: unknown): number => {
  const n = Number(value)
  if (!Number.isFinite(n) || n < 1) return DEFAULT_LIMIT
  return Math.min(Math.trunc(n), MAX_LIMIT)
}

/**
 * Manual mode: editor ne jo docs chune hain wahi. Payload unhe depth ke through
 * pehle hi populate kar chuka hota hai, isliye sirf objects filter karte hain
 * (agar depth 0 hua to yahan IDs aayengi — unhe chhod dete hain).
 */
const manualSelection = (value: unknown): unknown[] =>
  Array.isArray(value) ? value.filter((item) => item !== null && typeof item === 'object') : []

const query = async (args: {
  req: PayloadRequest
  collection: ResolvableCollection
  limit: number
  sort: string
  where?: Where
}): Promise<unknown[]> => {
  const { req, collection, limit, sort, where } = args

  const { docs } = await req.payload.find({
    collection,
    where,
    limit,
    sort,
    depth: 1,
    // Same transaction me raho
    req,
    // Access control lagu rakho — warna anonymous visitor ko draft content leak ho jayega
    overrideAccess: false,
    user: req.user,
  })

  return docs
}

/**
 * Reference blocks (featuredProjects, categoryGrid, …) me sirf ek reference hoti hai,
 * asli data collections me hota hai. Ye hook har aisi block ke liye uska data laakar
 * `block.items` me bhar deta hai, taaki frontend ko ek hi API call me poora page mil jaye.
 */
export const populateBlocks: CollectionAfterReadHook = async ({ doc, req }) => {
  const layout = (doc as { layout?: unknown })?.layout

  if (!Array.isArray(layout) || layout.length === 0) return doc

  await Promise.all(
    layout.map(async (block: Block) => {
      switch (block?.blockType) {
        case 'featuredProjects':
          block.items =
            block.mode === 'manual'
              ? manualSelection(block.projects)
              : await query({
                  req,
                  collection: 'projects',
                  where: { featured: { equals: true } },
                  limit: clampLimit(block.limit),
                  sort: '-createdAt',
                })
          break

        case 'featuredCampaigns':
          block.items =
            block.mode === 'manual'
              ? manualSelection(block.campaigns)
              : await query({
                  req,
                  collection: 'campaigns',
                  where: {
                    featured: { equals: true },
                    active: { equals: true },
                  },
                  limit: clampLimit(block.limit),
                  sort: '-createdAt',
                })
          break

        case 'testimonialCarousel':
          block.items =
            block.mode === 'manual'
              ? manualSelection(block.testimonials)
              : await query({
                  req,
                  collection: 'testimonials',
                  limit: clampLimit(block.limit),
                  sort: '-createdAt',
                })
          break

        case 'mediaGrid': {
          const types = Array.isArray(block.filterByType) ? block.filterByType : []

          block.items = await query({
            req,
            collection: 'media-posts',
            where: types.length > 0 ? { type: { in: types } } : undefined,
            limit: clampLimit(block.limit),
            sort: '-publishDate',
          })
          break
        }

        case 'categoryGrid':
          // Saari categories dikhani hain (doc §5.1 — 11 focus areas), isliye koi limit nahi
          block.items = await query({
            req,
            collection: 'project-categories',
            limit: 50,
            sort: 'order',
          })
          break

        default:
          break
      }
    }),
  )

  return doc
}
