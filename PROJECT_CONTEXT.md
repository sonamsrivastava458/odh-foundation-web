# PROJECT_CONTEXT.md

> **Purpose:** This file is written for an AI assistant (Claude, ChatGPT, Gemini) that has never seen
> this project. Paste it, or point the model at it, and it should be able to continue development
> without asking questions.
>
> **For humans:** read [`ROADMAP.md`](./ROADMAP.md) instead — it is the full architecture document.
> This file is a dense, self-contained briefing.

---

## 0. TL;DR for the model

You are working on the **backend of an NGO website** built with **Payload CMS 3.85.2** embedded in
**Next.js 16**, backed by **PostgreSQL 17**, in **TypeScript (strict)**.

- The content layer is **built and working**. 12 collections, 3 globals, 11 blocks, 7 hooks.
- Payments, forms, search, Hindi, and deployment are **not built**.
- Roughly **35% of the backend** is complete.
- The controlling spec is `ODH-Foundation-Website-Technical-Implementation-Document.md`. **It wins any
  argument.** If this file contradicts it, the spec is right.

Before writing code, read §5 (conventions) and §6 (hard rules) below. The rules exist because
violating them has already caused real bugs in this codebase.

---

## 1. The project

| | |
|---|---|
| **Client** | ODH Foundation — an Indian NGO, the philanthropic arm of ODH Group, founded 2023 |
| **Task** | Complete rebuild of https://odhfoundation.org |
| **This repo** | The backend. A Payload CMS instance. |
| **Frontend** | Currently a **separate** Next.js app by another developer. The spec requires a merge into this repo. Not done yet. |
| **Repo** | https://github.com/sonamsrivastava458/odh-foundation-web |
| **Owner** | Sonam Srivastava (`contactus@odhgroups.com`) |

### The five hard requirements (spec §1)

1. **100% dynamic content** — every section editable by non-technical staff. Nothing hardcoded.
2. **Top-tier SEO** — server-rendered, structured data, perfect metadata.
3. **Extreme speed** — Lighthouse ≥95 mobile, LCP <2.0s, page weight <1MB.
4. **Elegant design** — frontend's problem, but the backend supplies the structure.
5. **Donation-ready** — one-time + recurring, automated 80G tax receipts. **Not built.**

---

## 2. Stack

| Layer | Choice | Note |
|---|---|---|
| CMS | Payload 3.85.2 | Embedded in Next.js. Generates the admin UI, REST + GraphQL APIs, and TS types from the collection configs. |
| Framework | Next.js 16.2.6 (App Router) | |
| UI | React 19.2.6 | |
| Database | PostgreSQL 17 | **Local in dev.** Neon is reserved for production but is currently commented out in `.env` — a Neon project in `us-east-1` timed out from India. Recreate it in **Mumbai/Singapore** before deploying. |
| Language | TypeScript 5.7.3, `strict: true` | |
| Images | sharp 0.34.2 | WebP conversion, 4 responsive sizes |
| Package manager | pnpm | |

**Not yet installed but required by the spec:** `@payloadcms/storage-s3` (R2), `zod`,
`@react-pdf/renderer`, `resend`, `@sentry/nextjs`, `next-intl`.

---

## 3. Repository map

```
src/
├── payload.config.ts       ★ THE ENTRY POINT. Everything registers here.
│                             Wrapped in sanitizePlainText() — see §6 rule 4.
│
├── access/index.ts         Permission functions. Imported by every collection.
│
├── fields/                 Reusable FIELD definitions (factories — always call them)
│   ├── slug.ts             slugField('title')  — auto URL slugs
│   ├── seo.ts              seoField()          — the 5-field SEO group
│   ├── validators.ts       validateUrl / validatePan / validatePhone / validateInternalPath
│   ├── resolvedItems.ts    resolvedItems('projects') — the VIRTUAL `items` field
│   ├── sanitizePlainText.ts ★ config walker — see §6 rule 4
│   └── hooks/singleLine.ts  strips newlines from a string
│
├── hooks/                  Reusable COLLECTION / GLOBAL hooks
│   ├── populateBlocks.ts       afterRead     — fills block.items
│   ├── preventInUseDelete.ts   beforeDelete  — blocks deleting an in-use image
│   ├── enforceFileSize.ts      beforeValidate— per-collection size cap
│   ├── clearHiddenFields.ts    beforeChange  — clears stale conditional data
│   └── clearHiddenNavFields.ts ⚠️ older duplicate of the above. Should be deleted.
│
├── collections/            12 files
├── blocks/                 11 files
├── globals/                3 files
└── payload-types.ts        ★ GENERATED. Never edit. `pnpm generate:types`.
```

**A collection never imports another collection.** They link by slug string (`relationTo: 'projects'`).

---

## 4. The data model

### 4.1 Collections (12)

| Slug | Purpose | Drafts | Key detail |
|---|---|---|---|
| `users` | Admin auth + roles | no | `roles` is `hasMany` + `saveToJWT`. Role change ⇒ **re-login required**. |
| `media` ("Photos") | Field photography | no | WebP, 4 sizes (thumb/card/feature/hero), **min width 1200px**, max 10MB |
| `graphics` | Logos, icons, badges, QR | no | **No resize, no conversion, NO `sizes` object.** Accepts SVG. |
| `documents` | PDFs (certificates, reports) | no | max 5MB |
| `pages` | ★ The page builder | yes | `layout` = blocks array. `afterRead: [populateBlocks]` |
| `project-categories` | The 11 focus areas | yes | `icon` → graphics, `heroImage` → media |
| `projects` | Core content | yes | `status` needs `enumName` — see §6 rule 2 |
| `team-members` | Staff | yes | **Register before `media-posts`** (author relation) |
| `testimonials` | Field voices | yes | No SEO group (not routable) |
| `campaigns` | Fundraising | yes | `raisedAmount` has **field-level access** (finance only) |
| `media-posts` | news / press / blog / gallery / video | yes | Conditional fields cleared by `clearHiddenFields` |
| `careers` | Job listings | yes | `location` required (Google `JobPosting` schema) |

**91 Postgres tables** — every array and every `hasMany` field becomes its own table.

### 4.2 Globals (3)

| Slug | Update access | Contains |
|---|---|---|
| `site-settings` | `isSuperAdmin` | logo, tagline, contact, registrations (PAN/80G/12A/CSR), social links, announcement bar, GA4 ID |
| `navigation` | `isEditor` | header items (link / dropdown / megaMenu), donate CTA, footer columns, newsletter |
| `donation-settings` | `isSuperAdmin` | preset amounts, minAmount, impact cards, receipt (signatory + 80G statement), **`gatewayMode` (test\|live)**, UPI QR |

`site-settings.contact.address` is **the only field in the entire CMS that keeps its newlines**
(`admin.custom.multiline: true`).

### 4.3 Blocks (11 built, 20 required)

**Content blocks** — data lives inside the block:
`hero` · `statsBar` · `aboutStrip` · `howYouCanHelp` · `trustStrip` · `ctaBand`

**Reference blocks** — data lives in a collection, resolved into `block.items` by `populateBlocks`:
`categoryGrid` · `featuredProjects` · `featuredCampaigns` · `testimonialCarousel` · `mediaGrid`

**Missing (spec §6.2 requires them):**
`PageHeader` · `RichText` · `TeamGrid` · `Timeline` · `ImageGallery` · `VideoEmbed` · `FAQAccordion` ·
`DonateWidget` · `FormBlock` · `MapContact`

Without these, the About / CSR / Contact / Donate pages **cannot be built without a developer**, which
violates spec §6.2 directly.

### 4.4 Roles

| Role | Can |
|---|---|
| `super-admin` | Everything |
| `editor` | All content + navigation. **Not** donations, users, settings, gateway mode. |
| `finance` | Donations (read/export), override `campaigns.raisedAmount`. Not content. |
| *(anonymous)* | Read **published** content only. Drafts are filtered in SQL — they cannot leak. |

---

## 5. Conventions

| Thing | Rule | Example |
|---|---|---|
| Collection file | PascalCase, one per file | `src/collections/Projects.ts` |
| Collection slug | kebab-case, plural | `'project-categories'` |
| Block file | PascalCase | `src/blocks/FeaturedProjects.ts` |
| Block slug | camelCase | `'featuredProjects'` |
| Field name | camelCase | `heroImage`, `raisedAmount` |
| Field factory | a **function** — always call it | `seoField()`, `slugField('title')` |
| Admin-facing text | **professional English**, always | `'Leave blank to use the excerpt.'` |
| Code comments | Hinglish is acceptable (owner's preference) | `// Paise ka field — webhook isse update karta hai` |
| Editor-facing errors | `APIError`, **never** `Error` | `throw new APIError('This image is only 347px wide…', 400)` |

**Why `APIError`:** a plain `Error` makes Payload show *"Something went wrong"* and hide your message.
`APIError(msg, 400)` shows the message you wrote.

---

## 6. Hard rules — each one exists because it was violated and caused a bug

### Rule 1 — Restart the dev server after adding any field

Payload creates Postgres tables **at boot**, not on hot-reload. Adding an array field and hot-reloading
produces `relation "projects_impact_stats" does not exist`.

### Rule 2 — `versions: { drafts: true }` + a field named `status` = enum collision

Payload's draft system adds an internal `_status` field. The Postgres adapter names enums
`enum_<table>_<column>`, so `_status` → `enum_projects_status`. A field of your own called `status`
produces **the same name**:

```
Caused by: invalid input value for enum enum_projects_status: "ongoing"
```

**Fix:** give your field an explicit `enumName`. The API name stays `status`.

```ts
{ name: 'status', type: 'select', enumName: 'enum_projects_project_status', … }
```

### Rule 3 — `admin.condition` is UI only

It hides the field **in the browser**. It does **not**:
- clear the value from the database
- enforce `required` on a hidden field

**Every conditional field needs two more things:**
1. `clearHiddenFields` in a `beforeChange` hook — clears stale values
2. A **parent-level** `validate` — checks the required data actually exists

This caused three separate bugs: a plain nav link keeping a `featuredProject`, a dropdown saving with
zero links, and a `news` post keeping a `videoUrl` from when it was a `video`.

### Rule 4 — Never attach `singleLine` to a field by hand

`sanitizePlainText` (in `payload.config.ts`) walks the **entire config tree** and attaches it to every
`text` and `textarea` field — recursively, through blocks, arrays, groups, rows and tabs.

Attaching it manually is redundant. Forgetting is **impossible**.

To *exclude* a field (only postal addresses so far):

```ts
{ name: 'address', type: 'textarea', admin: { custom: { multiline: true } } }
```

### Rule 5 — Inside blocks and arrays, use `siblingData`

```ts
condition: (data) => data?.mode === 'auto'                  // ❌ `data` is the whole PAGE
condition: (_, siblingData) => siblingData?.mode === 'auto' // ✅ this block's own fields
```

`data` only makes sense at the top level of a document.

### Rule 6 — The Local API bypasses access control by default

```ts
await payload.find({ collection: 'projects', user })                       // ❌ leaks drafts
await payload.find({ collection: 'projects', user, overrideAccess: false }) // ✅
```

When acting on behalf of a user, pass **both** `overrideAccess: false` and `user`.

### Rule 7 — Thread `req` through nested Payload calls inside hooks

```ts
await req.payload.find({ collection: 'projects', req })   // ← same transaction
```

Without `req`, the query runs in a separate transaction and atomicity is lost.

### Rule 8 — `pnpm generate:types` after any field change

`src/payload-types.ts` is generated. **Never edit it.** The `Role` type in `access/index.ts` is derived
from it, so adding a role flows type errors to every place that must handle it.

### Rule 9 — Photos have `sizes`. Graphics do not.

```ts
photo.sizes.hero?.url ?? photo.sizes.feature?.url ?? photo.url   // ✅ (any size may be null)
graphic.url                                                       // ✅
graphic.sizes.card.url                                            // ❌ throws
```

Any photo size can be `null` — we never upscale (`withoutEnlargement: true`), so a small image simply
has no `hero`.

### Rule 10 — The homepage needs `depth=3`

```
pages (0) → layout blocks (1) → ctaBand.qrImage (2) → the Graphic (3)
```

At the default `depth=2`, `qrImage` comes back as the **number** `3`, not an object.
**This fails silently** — no error, the QR code just does not render.

```
GET /api/pages?where[slug][equals]=home&depth=3
```

---

## 7. The three things that are genuinely novel here

### 7.1 Access control returns a query, not a boolean

```ts
export const readPublished: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }   // ← a WHERE clause, not true/false
}
```

Payload merges that into the SQL. An anonymous `/api/projects` becomes:

```sql
SELECT * FROM projects WHERE _status = 'published'
```

There is **no code path** that leaks a draft. Not "we remembered to filter" — structurally impossible.

### 7.2 Reference blocks + `populateBlocks` = one request per page

A `featuredProjects` block stores **no project data** — only `mode`, `limit`, and (in manual mode) a
list of IDs. The `afterRead` hook queries the `projects` collection and fills a **virtual** field
`items`.

```ts
block.items = block.mode === 'manual'
  ? manualSelection(block.projects)
  : await query({ req, collection: 'projects',
                  where: { featured: { equals: true } },
                  limit: clampLimit(block.limit), sort: '-createdAt' })
```

The frontend reads **`block.items`** for every reference block, auto or manual. One field, one code
path, and **one HTTP request for the entire homepage** instead of six.

`items` is `virtual: true` — it has no database column, so an editor pressing Save cannot accidentally
persist auto-selected projects into the manual selection field.

### 7.3 `sanitizePlainText` — making a class of bug impossible

Editors paste from Word. The `\n` lands in `metaDescription` (broken meta tag), in `excerpt` (broken
card), in `statement80G` (**broken 80G receipt PDF**).

We attached a `singleLine` hook to each field by hand — and forgot five. The fix was not to add the
five. The fix was to make forgetting impossible: a function that walks the config and attaches the
hook everywhere.

> **When you fix the same class of bug twice, stop fixing instances and fix the class.**

---

## 8. What works right now

- ✅ 12 collections, 3 globals, 11 blocks — all live and verified against real data
- ✅ Auth + 3 roles, with field-level protection on `users.roles` and `campaigns.raisedAmount`
- ✅ REST API — **auto-generated**, no API code was written for content
- ✅ Upload pipeline: WebP + 4 sizes, min-width enforcement, in-use delete protection
- ✅ Draft/publish, with drafts filtered out of public reads at the SQL level
- ✅ The whole homepage in **one** API request
- ✅ TypeScript clean (`src/` and `tests/`)

## 9. What does NOT work / does not exist

| | Status |
|---|---|
| **Uploads on Vercel** | ⚠️ **BROKEN.** `plugins: []` — no storage adapter. Files go to local disk. Vercel's filesystem is ephemeral; every deploy wipes them. **Needs `@payloadcms/storage-s3` + Cloudflare R2.** |
| **Revalidation** | ❌ No `afterChange` hooks, no `/api/revalidate`. Published content will never reach a statically-generated site. |
| **Donations** | ❌ Nothing. The largest remaining piece — the spec allows **3 weeks**. |
| **Forms** | ❌ No `form-submissions` collection, no `/api/forms/submit`, no email. |
| **Search** | ❌ No Postgres full-text search. |
| **9 of 20 blocks** | ❌ About / CSR / Contact / Donate cannot be built without a developer. |
| **SEO output** | ❌ No sitemap, robots, JSON-LD, or old→new redirect map. **Missing the redirect map loses all current rankings.** |
| **Hindi** | ❌ Nothing. |
| **Tests** | ❌ Nothing. |
| **CI/CD** | ❌ Nothing. ESLint itself is broken (`@eslint/eslintrc` missing). |

## 10. Known bugs

1. **`validatePhone` rejects landlines.** The live site publishes `0512-2220000`. It cannot be entered.
   `site-settings.contact` also has only one `phone` field but the organisation has two numbers.
2. **`clearHiddenNavFields.ts` duplicates `clearHiddenFields.ts`.** Migrate Navigation to the generic
   hook and delete the old one.
3. **ESLint is broken** — `Cannot find package '@eslint/eslintrc'`.
4. **`preventInUseDelete` field paths are hand-maintained.** Add an upload field, forget to list it,
   and the protection silently has a hole.
5. **Template debris:** `src/app/my-route/`, `docker-compose.yml`, and `package.json`'s description
   still says *"A blank template"*.

---

## 11. If you are asked to continue development

**Priority order** (each depends on the one before it):

1. **Cloudflare R2 storage** — nothing can be deployed without it
2. **Revalidation hooks + `/api/revalidate`** — nothing published reaches the site without it
3. **The 9 missing blocks** — the frontend needs them for About / CSR / Contact / Donate
4. **Donations (spec §7)** — 3 weeks; do not start until PayU credentials exist
5. **Forms + search**
6. **Frontend merge** (spec §2) — one repo, `services/*.ts` switches from axios to the Local API
7. **SEO output** — sitemap, JSON-LD, and the old→new redirect map
8. **Hindi, hardening, CI**

**Before writing any donation code, internalise this (spec §7):**

> **Payment truth comes only from the verified webhook. Never from the redirect URL.**

And:
- The PayU **salt must never leave the server**. Hashes are generated server-side.
- The webhook must be **idempotent** — gateways retry.
- `donation-settings.minAmount` is a **display** value. The server must reject small amounts
  independently. An attacker does not use your form; they `curl` your endpoint.

## 12. Where to start reading

1. `src/payload.config.ts` — everything registers here
2. `src/access/index.ts` — the permission model
3. `src/collections/Projects.ts` — the most representative collection
4. `src/collections/Pages.ts` + `src/hooks/populateBlocks.ts` — the page builder, the novel part
5. `src/fields/sanitizePlainText.ts` — the most important architectural decision

Then [`ROADMAP.md`](./ROADMAP.md) for the full picture, and
[`DEVELOPER_GUIDE.md`](./DEVELOPER_GUIDE.md) for "how do I add X?".
