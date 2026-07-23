import { getPayload } from 'payload'
import config from '@payload-config'

type SearchRow = {
  type: string
  id: number
  title: string
  slug: string
  snippet: string
}

export async function GET(request: Request) {
  const payload = await getPayload({ config })
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return Response.json({ error: 'q must be at least 2 characters.' }, { status: 400 })
  }

  const { rows } = await payload.db.pool.query<SearchRow>(
    `
    SELECT 'pages' AS type, id, title, slug,
           ts_rank(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(seo_meta_description,'')), plainto_tsquery('english', $1)) AS rank,
           ts_headline('english', coalesce(title,'') || ' — ' || coalesce(nullif(seo_meta_description, ''), ''), plainto_tsquery('english', $1)) AS snippet
    FROM pages
    WHERE _status = 'published'
      AND to_tsvector('english', coalesce(title,'') || ' ' || coalesce(seo_meta_description,'')) @@ plainto_tsquery('english', $1)

    UNION ALL

    SELECT 'projects' AS type, id, title, slug,
           ts_rank(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(excerpt,'')), plainto_tsquery('english', $1)) AS rank,
           ts_headline('english', coalesce(title,'') || ' — ' || coalesce(nullif(excerpt, ''), ''), plainto_tsquery('english', $1)) AS snippet
    FROM projects
    WHERE _status = 'published'
      AND to_tsvector('english', coalesce(title,'') || ' ' || coalesce(excerpt,'')) @@ plainto_tsquery('english', $1)

    UNION ALL

    SELECT 'campaigns' AS type, id, title, slug,
           ts_rank(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(excerpt,'')), plainto_tsquery('english', $1)) AS rank,
           ts_headline('english', coalesce(title,'') || ' — ' || coalesce(nullif(excerpt, ''), ''), plainto_tsquery('english', $1)) AS snippet
    FROM campaigns
    WHERE _status = 'published'
      AND to_tsvector('english', coalesce(title,'') || ' ' || coalesce(excerpt,'')) @@ plainto_tsquery('english', $1)

    UNION ALL

    SELECT 'media-posts' AS type, id, title, slug,
           ts_rank(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(excerpt,'')), plainto_tsquery('english', $1)) AS rank,
           ts_headline('english', coalesce(title,'') || ' — ' || coalesce(nullif(excerpt, ''), ''), plainto_tsquery('english', $1)) AS snippet
    FROM media_posts
    WHERE _status = 'published'
      AND to_tsvector('english', coalesce(title,'') || ' ' || coalesce(excerpt,'')) @@ plainto_tsquery('english', $1)

    ORDER BY rank DESC
    LIMIT 20
    `,
    [q],
  )

  return Response.json({
    query: q,
    results: rows.map((row) => ({
      type: row.type,
      id: row.id,
      title: row.title,
      slug: row.slug,
      snippet: row.snippet,
    })),
  })
}
