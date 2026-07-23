import { getPayload } from 'payload'
import config from '@payload-config'

const SITEMAP_COLLECTIONS = ['pages', 'projects', 'campaigns', 'media-posts', 'careers'] as const

export async function GET() {
  const payload = await getPayload({ config })

  const results = await Promise.all(
    SITEMAP_COLLECTIONS.map((collection) => payload.find({ collection, limit: 0, depth: 0 })),
  )

  const items = SITEMAP_COLLECTIONS.flatMap((collectionSlug, index) =>
    results[index].docs
      .filter((doc: any) => !doc.seo?.noIndex)
      .map((doc: any) => ({
        type: collectionSlug,
        slug: doc.slug,
        updatedAt: doc.updatedAt,
        metaTitle: doc.seo?.metaTitle ?? null,
        metaDescription: doc.seo?.metaDescription ?? null,
        canonicalUrl: doc.seo?.canonicalUrl ?? null,
      })),
  )

  return Response.json({ items })
}
