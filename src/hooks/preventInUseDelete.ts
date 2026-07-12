import type { CollectionBeforeDeleteHook, CollectionSlug, Where } from 'payload'
import { APIError } from 'payload'

/**
 * Ek upload (photo/graphic) jo kisi content me use ho rahi hai, use delete hone se rokta hai.
 *
 * Bina iske: editor image delete karta hai -> Payload reference ko chup-chaap `null` kar deta hai
 * -> live website par image gayab, aur kisi ko pata bhi nahi chalta. `required: true` bhi nahi
 * bachata, kyunki wo sirf save ke waqt check hota hai.
 */

type Usage = {
  collection: CollectionSlug
  /** Is collection ke wo field-paths jo upload ko point karte hain (blocks/arrays ke andar bhi) */
  fields: string[]
  /** Error message me dikhne wala naam */
  label: string
}

/** `media` (photos) ko kaun-kaun se fields point karte hain */
const MEDIA_USAGE: Usage[] = [
  {
    collection: 'projects',
    fields: ['heroImage', 'seo.ogImage', 'gallery.image', 'partners.logo'],
    label: 'Project',
  },
  {
    collection: 'campaigns',
    fields: ['heroImage', 'seo.ogImage', 'gallery.image'],
    label: 'Campaign',
  },
  {
    collection: 'media-posts',
    fields: ['heroImage', 'seo.ogImage', 'galleryImages.image'],
    label: 'Media Post',
  },
  {
    collection: 'project-categories',
    fields: ['heroImage', 'seo.ogImage'],
    label: 'Category',
  },
  { collection: 'team-members', fields: ['photo'], label: 'Team Member' },
  { collection: 'testimonials', fields: ['photo'], label: 'Testimonial' },
  {
    collection: 'pages',
    // Hero slides + AboutStrip ki images blocks ke andar hain
    fields: ['seo.ogImage', 'layout.image', 'layout.slides.image'],
    label: 'Page',
  },
  { collection: 'careers', fields: ['seo.ogImage'], label: 'Career' },
]

/** `graphics` (logos, icons, badges, QR) ko kaun point karta hai */
const GRAPHICS_USAGE: Usage[] = [
  { collection: 'project-categories', fields: ['icon'], label: 'Category icon' },
  {
    collection: 'pages',
    // CTABand ka QR, TrustStrip ke logos, HowYouCanHelp ke icons
    fields: ['layout.qrImage', 'layout.logos.logo', 'layout.options.icon'],
    label: 'Page',
  },
]

const titleOf = (doc: unknown): string => {
  const record = doc as { id?: unknown; title?: unknown; name?: unknown }
  if (typeof record.title === 'string') return record.title
  if (typeof record.name === 'string') return record.name
  return `#${record.id}`
}

export const preventInUseDelete = (
  uploadSlug: 'media' | 'graphics',
): CollectionBeforeDeleteHook => {
  const usages = uploadSlug === 'media' ? MEDIA_USAGE : GRAPHICS_USAGE

  return async ({ id, req }) => {
    const found: string[] = []

    await Promise.all(
      usages.map(async ({ collection, fields, label }) => {
        const where: Where = {
          or: fields.map((field) => ({ [field]: { equals: id } })),
        }

        const { docs } = await req.payload.find({
          collection,
          where,
          limit: 5,
          depth: 0,
          req,
        })

        docs.forEach((doc) => {
          found.push(`${label}: ${titleOf(doc)}`)
        })
      }),
    )

    if (found.length > 0) {
      const unique = [...new Set(found)]
      const places = unique.length === 1 ? 'one place' : `${unique.length} places`

      throw new APIError(
        `This image is still in use in ${places}: ${unique.join(', ')}. ` +
          `Replace or remove it there first, then delete it here.`,
        400,
      )
    }
  }
}
