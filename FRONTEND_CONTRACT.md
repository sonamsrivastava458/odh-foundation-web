# Frontend Contract — ODH Foundation

**For the frontend developer.** This is the exact shape of every response the backend returns.
It is derived from the generated `src/payload-types.ts` — not from memory, not from the spec.

Where this document and anything else disagree, **this document wins**, because it is generated from
the running schema.

---

## 0. Read this first — the three rules

Three mistakes are already present in the frontend code and will each cost a day if left:

### Rule 1 — Images are objects, never strings

The frontend currently types every image as `string | null`:

```ts
heroImage: string | null;   // ❌ WRONG
```

The backend never sends a string. It sends an object with `url`, `alt`, `width`, `height` and four
pre-generated responsive sizes. Typing it as a string throws away the entire image pipeline:
WebP conversion, responsive sizes, alt text (accessibility + SEO), and width/height (which prevent
layout shift).

Use the `Media` type in §1.

### Rule 2 — `body` is Lexical JSON, not `string[]`

The frontend currently types rich text as an array of paragraphs and renders it with
`.map(p => <p>{p}</p>)`. Rich text in Payload is a nested Lexical document. Rendering it needs
Payload's own React component:

```tsx
import { RichText } from '@payloadcms/richtext-lexical/react'

<RichText data={project.body} />
```

Affects: `Project.body`, `Campaign.body`, `MediaPost.body`, `Career.description`,
`ProjectCategory.introText`.

### Rule 3 — Section order lives in the database, not in your JSX

`src/app/(frontend)/page.tsx` currently hardcodes eleven sections in a fixed order. The whole point
of the Pages collection is that **the editor** controls which sections appear and in what order,
without a developer. Map over `page.layout` and switch on `blockType`. See §4.

This one changes every section component's props, so **do it before writing more sections.**

---

## 1. Core types

Copy these verbatim into `src/types/payload.ts`. Everything else builds on them.

```ts
/** Postgres primary keys are integers. Not strings. */
export type ID = number

/**
 * A photo from the `media` collection — project heroes, campaign heroes, team
 * portraits, galleries.
 *
 * Every photo is converted to WebP on upload and four sizes are generated.
 * A size is `null` when the original was smaller than that size — we never
 * upscale — so always fall back down the chain.
 */
export interface Media {
  id: ID
  alt: string                     // always present, always use it
  caption?: string | null
  url: string                     // the full-size original (WebP, max 2400px wide)
  width?: number | null
  height?: number | null
  mimeType?: string | null
  filesize?: number | null
  sizes?: {
    thumb?: MediaSize             // 300px  — admin thumbnails, tiny avatars
    card?: MediaSize              // 640px  — grid cards
    feature?: MediaSize           // 1024px — two-column sections
    hero?: MediaSize              // 1600px — full-bleed heroes
  }
}

export interface MediaSize {
  url?: string | null
  width?: number | null
  height?: number | null
  mimeType?: string | null
  filesize?: number | null
}

/**
 * A logo, icon, badge or QR code from the `graphics` collection.
 *
 * Stored EXACTLY as uploaded — no resizing, no format conversion. A 500px 80G
 * badge stays a 500px PNG.
 *
 * ⚠️ Graphics have NO `sizes`. `graphic.sizes.card.url` will throw.
 *    Use `graphic.url`.
 */
export interface Graphic {
  id: ID
  alt: string
  url: string
  width?: number | null
  height?: number | null
  mimeType?: string | null
}

/** A PDF from the `documents` collection — certificates, annual reports. */
export interface Document {
  id: ID
  title: string                   // use as the download link text
  url: string
  filesize?: number | null
}

/** Lexical rich-text. Opaque — never read into it, pass it to <RichText />. */
export type RichText = Record<string, unknown>

/**
 * Any relationship or upload field is EITHER the id (when not populated)
 * OR the full document (when `depth` reached it).
 *
 * Ask for enough depth and you always get the object — but type it honestly
 * so TypeScript forces you to handle the number case.
 */
export type Ref<T> = ID | T

export interface Seo {
  metaTitle?: string | null
  metaDescription?: string | null
  ogImage?: Ref<Media> | null
  canonicalUrl?: string | null
  noIndex?: boolean | null
}

/** Payload's draft/publish state. Public API only ever returns 'published'. */
export type Status = 'draft' | 'published'
```

### Two helpers you will use constantly

```ts
/** Narrow a Ref<T> to T, or undefined if the API returned a bare id. */
export const resolve = <T extends { id: ID }>(ref: Ref<T> | null | undefined): T | undefined =>
  typeof ref === 'object' && ref !== null ? ref : undefined

/**
 * Best available URL for a photo at a given size, walking DOWN to smaller
 * sizes and finally the original. Never returns a broken src.
 */
export const photoUrl = (
  photo: Ref<Media> | null | undefined,
  size: 'thumb' | 'card' | 'feature' | 'hero' = 'card',
): string | undefined => {
  const m = resolve(photo)
  if (!m) return undefined

  const order = ['hero', 'feature', 'card', 'thumb'] as const
  const from = order.indexOf(size as (typeof order)[number])

  for (let i = from; i < order.length; i++) {
    const url = m.sizes?.[order[i]]?.url
    if (url) return url
  }
  return m.url ?? undefined
}
```

Usage:

```tsx
const hero = resolve(project.heroImage)

<Image
  src={photoUrl(project.heroImage, 'card')!}
  alt={hero?.alt ?? ''}
  width={hero?.width ?? 640}
  height={hero?.height ?? 400}
/>
```

---

## 2. Collection types

These replace the current contents of `src/types/*.ts`. **Field names are already correct** in the
frontend — what changes is the shape.

```ts
// ── project-categories ────────────────────────────────────────────────────
export interface ProjectCategory {
  id: ID
  name: string                    // NOT `title`
  slug: string
  icon?: Ref<Graphic> | null      // Graphic — no sizes
  heroImage?: Ref<Media> | null
  introText?: RichText | null
  order: number
  seo?: Seo
}

// ── projects ──────────────────────────────────────────────────────────────
export type ProjectStatus = 'ongoing' | 'completed'

export interface Project {
  id: ID
  title: string
  slug: string
  category: Ref<ProjectCategory>  // needs depth >= 1 to be an object
  status: ProjectStatus
  location: {
    city: string
    district?: string | null
    state: string
  }
  heroImage: Ref<Media>
  excerpt: string                 // max 160 chars — safe as a meta description
  body?: RichText | null
  impactStats?: { id?: string; label: string; value: number; suffix?: string | null }[]
  beneficiaries?: number | null

  // ⚠️ Arrays of OBJECTS, not arrays of strings
  gallery?: { id?: string; image: Ref<Media> }[]
  partners?: { id?: string; name: string; logo?: Ref<Graphic> | null }[]

  startDate?: string | null       // ISO 8601
  endDate?: string | null
  featured?: boolean
  seo?: Seo
}

// ── campaigns ─────────────────────────────────────────────────────────────
export interface Campaign {
  id: ID
  title: string
  slug: string
  heroImage: Ref<Media>
  excerpt: string
  body?: RichText | null
  goalAmount?: number | null      // ₹ — may be absent (campaign with no target)
  raisedAmount?: number           // ₹ — written by the donation webhook
  showProgress: boolean           // false → do NOT render the progress bar
  faqs?: { id?: string; question: string; answer: string }[]
  gallery?: { id?: string; image: Ref<Media> }[]
  featured?: boolean
  active: boolean                 // false → retired; exclude from listings
  seo?: Seo
}

// ── media-posts ───────────────────────────────────────────────────────────
export type MediaPostType = 'news' | 'press' | 'blog' | 'gallery' | 'video'

export interface MediaPost {
  id: ID
  title: string
  slug: string
  type: MediaPostType
  publishDate: string             // ISO 8601
  author?: Ref<TeamMember> | null // a relationship, NOT a string
  heroImage: Ref<Media>
  excerpt: string
  body?: RichText | null

  // Each of these only exists for its own `type` — the backend clears the others.
  galleryImages?: { id?: string; image: Ref<Media> }[]   // type === 'gallery'
  videoUrl?: string | null                               // type === 'video'
  externalUrl?: string | null                            // type === 'press'

  tags?: { id?: string; tag: string }[]                  // NOT string[]
  seo?: Seo
}

// ── team-members ──────────────────────────────────────────────────────────
export interface TeamMember {
  id: ID
  name: string
  role: string
  photo?: Ref<Media> | null
  bio?: string | null             // plain textarea — safe to render directly
  linkedin?: string | null
  isFounder?: boolean
  order: number                   // sort ascending
}

// ── testimonials ──────────────────────────────────────────────────────────
export interface Testimonial {
  id: ID
  quote: string                   // plain textarea
  name: string
  role: string                    // "Farmer, Sitapur"
  photo?: Ref<Media> | null
  relatedProject?: Ref<Project> | null
}

// ── careers ───────────────────────────────────────────────────────────────
export type CareerType = 'full-time' | 'part-time' | 'volunteer' | 'intern'

export interface Career {
  id: ID
  title: string
  slug: string
  location: string
  type: CareerType
  description?: RichText | null   // rich text, NOT string[]
  active: boolean
  seo?: Seo
}
```

### What changed vs. the current frontend types

| Current | Correct | Why it matters |
|---|---|---|
| `id: string` | `id: number` | `p.id === "3"` is never true when the API sends `3` |
| `heroImage: string \| null` | `Ref<Media>` | loses alt, dimensions, and all 4 responsive sizes |
| `photo: string \| null` | `Ref<Media>` | same |
| `body: string[]` | `RichText` | Lexical JSON — `.map()` over it renders nothing |
| `Career.description: string[]` | `RichText` | same |
| `partners: string[]` | `{ name, logo }[]` | partner logos are Graphics |
| `tags: string[]` | `{ tag: string }[]` | Payload arrays are always arrays of objects |
| `author: string` | `Ref<TeamMember>` | it is a relationship |
| `galleryCount: number` | `gallery: {...}[]` | you get the whole array; count it yourself |
| `category: {name, slug}` | `Ref<ProjectCategory>` | ✅ names were right — just needs `depth>=1` |

---

## 3. Endpoints

Everything is auto-generated REST. No custom endpoints for content.

```
GET /api/{collection}?where[...]&depth=N&limit=N&page=N&sort=field
GET /api/{collection}/{id}
GET /api/globals/{slug}?depth=N
```

Unauthenticated requests **only ever see published documents.** Drafts are filtered out by an access
query in the database, not in application code — there is no way to leak one.

### Response envelope (lists)

```jsonc
{
  "docs": [ /* … */ ],
  "totalDocs": 42,
  "limit": 12,
  "totalPages": 4,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevPage": null,
  "nextPage": 2
}
```

Single documents (`/api/pages/3`) and globals return the document **directly**, not wrapped.

### The queries you actually need

```ts
// Homepage — ONE request returns everything. depth=3 is mandatory (§4).
GET /api/pages?where[slug][equals]=home&depth=3&limit=1

// Projects listing, filtered + paginated (spec §5.3 — 12 per page)
GET /api/projects?depth=1&limit=12&page=1&sort=-createdAt
  &where[category.slug][equals]=health
  &where[status][equals]=ongoing

// Project detail
GET /api/projects?where[slug][equals]=mobile-medical-van&depth=2&limit=1

// Related projects (same category, excluding this one)
GET /api/projects?depth=1&limit=3
  &where[category.slug][equals]=health
  &where[slug][not_equals]=mobile-medical-van

// Campaigns (only live ones)
GET /api/campaigns?depth=1&where[active][equals]=true&sort=-createdAt

// Media, filtered by type
GET /api/media-posts?depth=1&limit=9&page=1&sort=-publishDate
  &where[type][equals]=press

// Team, in the editor's order
GET /api/team-members?depth=1&sort=order

// Open roles
GET /api/careers?depth=0&where[active][equals]=true

// Globals
GET /api/globals/site-settings?depth=1
GET /api/globals/navigation?depth=1
GET /api/globals/donation-settings?depth=1
```

### Choosing `depth`

`depth` is how many levels of relationships get expanded into objects.

| depth | what you get |
|---|---|
| `0` | every relationship is a bare `number`. Use only for `careers` (it has none). |
| `1` | uploads and direct relationships become objects. **The default for listings.** |
| `2` | detail pages — e.g. `project.partners[].logo` |
| `3` | **the homepage only** — see below |

The homepage needs `depth=3` because of one nested chain:

```
page (0) → layout.ctaBand (1) → qrImage (2) → the Graphic document (3)
```

At `depth=2`, `qrImage` comes back as a **number**. Nothing errors. The QR code simply never
renders and nobody notices for a week. **Use `depth=3` on the homepage.**

---

## 4. The page-builder contract

### What a page looks like

```ts
export interface Page {
  id: ID
  title: string
  slug: string
  layout?: Block[] | null    // ← the editor owns this: which sections, in what order
  seo?: Seo
}
```

`layout` is an ordered array. Every entry has a `blockType` discriminator. Eleven exist today:

| `blockType` | what it carries |
|---|---|
| `hero` | `slides[]` (headline, subline, image), `primaryCta`, `secondaryCta` |
| `statsBar` | `stats[]` (label, value, suffix) |
| `aboutStrip` | `eyebrow`, `title`, `paragraphs[]`, `image`, `link` |
| `categoryGrid` | `heading`, `subheading`, `columns`, **`items[]`** |
| `featuredCampaigns` | `heading`, `mode`, `limit`, **`items[]`**, `ctaLabel`, `ctaHref` |
| `featuredProjects` | `heading`, `mode`, `limit`, **`items[]`**, `ctaLabel`, `ctaHref` |
| `howYouCanHelp` | `heading`, `options[]` (title, description, ctaLabel, ctaHref, icon) |
| `testimonialCarousel` | `heading`, `mode`, `limit`, **`items[]`** |
| `mediaGrid` | `heading`, `filterByType`, `limit`, **`items[]`**, `ctaLabel`, `ctaHref` |
| `trustStrip` | `heading`, `badges[]`, `logos[]` |
| `ctaBand` | `heading`, `subheading`, `ctaLabel`, `ctaHref`, `qrImage` |

### `items` — the single most important field

Five blocks are **reference blocks**: they don't store content, they point at collections.

**Do not fetch projects, campaigns, testimonials, categories or posts separately for the homepage.**
An `afterRead` hook on the server has already run the query — respecting the editor's `mode`
(`auto` = newest featured, `manual` = the exact ones they picked) and `limit` — and put the **fully
populated documents** into `block.items`.

```ts
// ✅ correct — the data is already there
<FeaturedProjects heading={block.heading} projects={block.items} />

// ❌ wrong — a second request that returns different, un-curated data
const projects = await getFeaturedProjects()
```

`block.projects` / `block.campaigns` / `block.testimonials` are the editor's *manual picks* — raw
input. **`block.items` is the resolved output.** Always read `items`.

### Block types

```ts
export type CtaGroup = { label?: string | null; href?: string | null }

export type HeroBlock = {
  blockType: 'hero'
  id?: string | null
  slides: { id?: string; headline: string; subline?: string | null; image: Ref<Media> }[]
  primaryCta?: CtaGroup
  secondaryCta?: CtaGroup
}

export type StatsBarBlock = {
  blockType: 'statsBar'
  id?: string | null
  stats: { id?: string; label: string; value: number; suffix?: string | null }[]
}

export type AboutStripBlock = {
  blockType: 'aboutStrip'
  id?: string | null
  eyebrow?: string | null
  title: string
  paragraphs: { id?: string; text: string }[]   // array of objects, not string[]
  image: Ref<Media>
  link?: CtaGroup
}

export type CategoryGridBlock = {
  blockType: 'categoryGrid'
  id?: string | null
  heading?: string | null
  subheading?: string | null
  columns?: '3' | '4' | null                    // a STRING, not a number
  items?: Ref<ProjectCategory>[] | null         // ← resolved
}

export type FeaturedCampaignsBlock = {
  blockType: 'featuredCampaigns'
  id?: string | null
  heading?: string | null
  subheading?: string | null
  mode: 'auto' | 'manual'
  limit?: number | null
  campaigns?: Ref<Campaign>[] | null            // editor's manual picks — ignore
  items?: Ref<Campaign>[] | null                // ← resolved. use this.
  ctaLabel?: string | null
  ctaHref?: string | null
}

export type FeaturedProjectsBlock = {
  blockType: 'featuredProjects'
  id?: string | null
  heading?: string | null
  subheading?: string | null
  mode: 'auto' | 'manual'
  limit?: number | null
  projects?: Ref<Project>[] | null              // editor's manual picks — ignore
  items?: Ref<Project>[] | null                 // ← resolved. use this.
  ctaLabel?: string | null
  ctaHref?: string | null
}

export type HowYouCanHelpBlock = {
  blockType: 'howYouCanHelp'
  id?: string | null
  heading?: string | null
  options: {
    id?: string
    title: string
    description: string
    ctaLabel: string
    ctaHref: string
    icon: Ref<Graphic>                          // Graphic — .url only, no sizes
  }[]
}

export type TestimonialCarouselBlock = {
  blockType: 'testimonialCarousel'
  id?: string | null
  heading?: string | null
  mode: 'auto' | 'manual'
  limit?: number | null
  testimonials?: Ref<Testimonial>[] | null      // manual picks — ignore
  items?: Ref<Testimonial>[] | null             // ← resolved
}

export type MediaGridBlock = {
  blockType: 'mediaGrid'
  id?: string | null
  heading?: string | null
  subheading?: string | null
  filterByType?: MediaPostType[] | null
  limit?: number | null
  items?: Ref<MediaPost>[] | null               // ← resolved
  ctaLabel?: string | null
  ctaHref?: string | null
}

export type TrustStripBlock = {
  blockType: 'trustStrip'
  id?: string | null
  heading?: string | null
  badges?: { id?: string; label: string; note?: string | null }[] | null
  logos?: { id?: string; name: string; logo: Ref<Graphic>; url?: string | null }[] | null
}

export type CtaBandBlock = {
  blockType: 'ctaBand'
  id?: string | null
  heading: string
  subheading?: string | null
  ctaLabel: string
  ctaHref: string
  qrImage?: Ref<Graphic> | null                 // ← the reason depth=3 exists
}

export type Block =
  | HeroBlock
  | StatsBarBlock
  | AboutStripBlock
  | CategoryGridBlock
  | FeaturedCampaignsBlock
  | FeaturedProjectsBlock
  | HowYouCanHelpBlock
  | TestimonialCarouselBlock
  | MediaGridBlock
  | TrustStripBlock
  | CtaBandBlock
```

### The renderer

`src/components/RenderBlocks.tsx` — this replaces the hardcoded section list in
`src/app/(frontend)/page.tsx`:

```tsx
import type { Block } from '@/types/payload'

import { Hero } from '@/components/sections/Hero'
import { StatsBar } from '@/components/sections/StatsBar'
import { AboutStrip } from '@/components/sections/TwoColumnContent'
import { CategoryGrid } from '@/components/sections/CategoryGrid'
import { FeaturedCampaigns } from '@/components/sections/FeaturedCampaigns'
import { FeaturedProjects } from '@/components/sections/FeaturedProjects'
import { HowYouCanHelp } from '@/components/sections/HowYouCanHelp'
import { TestimonialCarousel } from '@/components/sections/TestimonialCarousel'
import { MediaGrid } from '@/components/sections/MediaGrid'
import { TrustStrip } from '@/components/sections/LogoStrip'
import { CTABand } from '@/components/sections/CTABand'

export function RenderBlocks({ layout }: { layout?: Block[] | null }) {
  if (!layout?.length) return null

  return (
    <>
      {layout.map((block, i) => {
        // Blocks have no stable id until saved; index is a safe fallback.
        const key = block.id ?? `${block.blockType}-${i}`

        switch (block.blockType) {
          case 'hero':                return <Hero key={key} block={block} />
          case 'statsBar':            return <StatsBar key={key} block={block} />
          case 'aboutStrip':          return <AboutStrip key={key} block={block} />
          case 'categoryGrid':        return <CategoryGrid key={key} block={block} />
          case 'featuredCampaigns':   return <FeaturedCampaigns key={key} block={block} />
          case 'featuredProjects':    return <FeaturedProjects key={key} block={block} />
          case 'howYouCanHelp':       return <HowYouCanHelp key={key} block={block} />
          case 'testimonialCarousel': return <TestimonialCarousel key={key} block={block} />
          case 'mediaGrid':           return <MediaGrid key={key} block={block} />
          case 'trustStrip':          return <TrustStrip key={key} block={block} />
          case 'ctaBand':             return <CTABand key={key} block={block} />

          // A block added in the CMS that this build doesn't know about must not
          // take the site down. Skip it.
          default:
            return null
        }
      })}
    </>
  )
}
```

And the homepage collapses to this:

```tsx
// src/app/(frontend)/page.tsx
import { notFound } from 'next/navigation'
import { getPageBySlug } from '@/services/page.service'
import { RenderBlocks } from '@/components/RenderBlocks'

export default async function HomePage() {
  const page = await getPageBySlug('home')     // ONE request. depth=3.
  if (!page) notFound()

  return (
    <main>
      <RenderBlocks layout={page.layout} />
    </main>
  )
}
```

Every section component changes from flat props to one `block` prop:

```tsx
// before: <FeaturedProjects projects={projects} />
// after:  <FeaturedProjects block={block} />

import { resolve } from '@/types/payload'
import type { FeaturedProjectsBlock, Project } from '@/types/payload'

export function FeaturedProjects({ block }: { block: FeaturedProjectsBlock }) {
  const projects = (block.items ?? [])
    .map((ref) => resolve<Project>(ref))
    .filter((p): p is Project => Boolean(p))

  if (projects.length === 0) return null        // editor added the block but picked nothing

  return (
    <Section>
      {block.heading && <h2>{block.heading}</h2>}
      {block.subheading && <p>{block.subheading}</p>}

      <div className="grid gap-6 md:grid-cols-3">
        {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
      </div>

      {block.ctaLabel && block.ctaHref && (
        <Link href={block.ctaHref}>{block.ctaLabel}</Link>
      )}
    </Section>
  )
}
```

Note the guards. **Every optional field is genuinely optional** — an editor can save a block with an
empty heading and no items. A section that crashes on empty data will take the live site down the
first time someone experiments in the admin panel.

---

## 5. The service layer

Keep the `services/` boundary exactly as it is — it is the one thing the frontend got completely
right. Only the bodies change.

```ts
// src/services/api.ts
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

interface Paginated<T> {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

async function get<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${API}/api${path}`, { next: { revalidate } })

  if (!res.ok) {
    throw new Error(`GET ${path} → ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

export const getList = <T>(path: string, revalidate?: number) =>
  get<Paginated<T>>(path, revalidate)

/** Fetch one document by slug. Returns undefined — not an empty object — if absent. */
export const getOne = async <T>(
  collection: string,
  slug: string,
  depth = 1,
): Promise<T | undefined> => {
  const { docs } = await getList<T>(
    `/${collection}?where[slug][equals]=${encodeURIComponent(slug)}&depth=${depth}&limit=1`,
  )
  return docs[0]
}
```

```ts
// src/services/page.service.ts
import { getOne } from './api'
import type { Page } from '@/types/payload'

/** depth=3 — the homepage's ctaBand.qrImage is three levels deep. */
export const getPageBySlug = (slug: string) => getOne<Page>('pages', slug, 3)
```

```ts
// src/services/project.service.ts
import { getList, getOne } from './api'
import type { Project, ProjectStatus } from '@/types/payload'

const PER_PAGE = 12   // spec §5.3

export interface ProjectFilters {
  category?: string
  status?: ProjectStatus
  page?: number
}

export async function getFilteredProjects({ category, status, page = 1 }: ProjectFilters) {
  const qs = new URLSearchParams({
    depth: '1',
    limit: String(PER_PAGE),
    page: String(Math.max(1, page)),
    sort: '-createdAt',
  })
  if (category) qs.set('where[category.slug][equals]', category)
  if (status) qs.set('where[status][equals]', status)

  const res = await getList<Project>(`/projects?${qs}`)

  return {
    items: res.docs,
    total: res.totalDocs,
    page: res.page,
    totalPages: res.totalPages,
  }
}

export const getProjectBySlug = (slug: string) => getOne<Project>('projects', slug, 2)

export const getRelatedProjects = async (project: Project, limit = 3) => {
  const category = resolve(project.category)
  if (!category) return []

  const { docs } = await getList<Project>(
    `/projects?depth=1&limit=${limit}` +
      `&where[category.slug][equals]=${category.slug}` +
      `&where[slug][not_equals]=${project.slug}`,
  )
  return docs
}
```

**`getFeaturedProjects()` should be deleted.** The homepage gets its featured projects from
`block.items`. Keeping a second source means the editor curates one list and the site shows another.

---

## 6. Not built yet — do not integrate against these

These endpoints **do not exist**. Keep them behind mock services with a `TODO(backend)` marker, as
you are already doing.

| Feature | Status |
|---|---|
| Donations / PayU (`/api/donations/*`) | not started — spec §7, the largest remaining piece |
| Forms (contact, volunteer, CSR enquiry) | not started |
| Search | not started |
| Hindi (`?locale=hi`) | not started |
| Newsletter | not started |

The section components you already built for these — `DonateWidget`, `FormBlock`, `ContactForm` —
are fine. They just have nothing to talk to yet.

Similarly, these **blocks do not exist in the CMS yet**, so `page.layout` will never contain them:
`pageHeader`, `richText`, `teamGrid`, `timeline`, `imageGallery`, `videoEmbed`, `faqAccordion`,
`donateWidget`, `formBlock`, `mapContact`. Your components for them are welcome; they are just not
CMS-driven yet. Pages other than the homepage can stay hardcoded until those blocks ship.

---

## 7. Migration checklist

In dependency order. Steps 1–3 are two days of work now, and a week if left until merge.

- [ ] Add `src/types/payload.ts` (§1) — `Media`, `Graphic`, `Ref`, `resolve`, `photoUrl`
- [ ] Replace `src/types/{project,campaign,media,team,career}.ts` with §2
- [ ] Fix every image usage: `src={p.heroImage}` → `src={photoUrl(p.heroImage, 'card')}`, and pass
      `alt`, `width`, `height` from the resolved `Media`
- [ ] Install and wire `<RichText />` for the five rich-text fields (Rule 2)
- [ ] Add `src/components/RenderBlocks.tsx` (§4)
- [ ] Convert the 11 homepage sections from flat props to a single `block` prop
- [ ] Rewrite `src/app/(frontend)/page.tsx` to `<RenderBlocks layout={page.layout} />`
- [ ] Add `src/services/api.ts` and `page.service.ts` (§5); point the other services at the API
- [ ] Delete `getFeaturedProjects` / `getFeaturedCampaigns` / homepage `getLatestPosts` — the
      homepage reads `block.items`
- [ ] Delete `src/data/*.ts` once every service is live
- [ ] Set `NEXT_PUBLIC_API_URL=http://localhost:3000` in `.env.local`

### Sanity check

With the backend running on `:3000`:

```bash
curl -s "http://localhost:3000/api/pages?where[slug][equals]=home&depth=3&limit=1" | jq '
  .docs[0].layout[] | { blockType, items: (.items | length?) }
'
```

Every reference block should report a non-zero `items` count. If `items` is `null`, the block is a
content block (`hero`, `statsBar`, `aboutStrip`, `howYouCanHelp`, `trustStrip`, `ctaBand`) and that
is correct.
