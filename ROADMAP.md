# ODH Foundation — Backend Architecture & Roadmap


| | |
|---|---|
| **Project** | odh-foundation-web |
| **Purpose** | Complete rebuild of https://odhfoundation.org |
| **Spec** | `ODH-Foundation-Website-Technical-Implementation-Document.md` (referred to below as **the spec**, with § section numbers) |
| **Stack** | Payload CMS 3.85.2 · Next.js 16.2.6 · React 19.2.6 · PostgreSQL 17 · TypeScript 5.7.3 |
| **Repo** | https://github.com/sonamsrivastava458/odh-foundation-web |
| **Status** | Backend ~35% complete overall — unchanged from the last estimate because Donations (the single largest workstream, 3 of 7 weeks) is still untouched. But the content/CMS layer itself is now essentially done: **19 of 20 spec blocks built** (only `DonateWidget` deferred), verified page-by-page against the live frontend. See [§18](#18-current-progress). |
| **Last updated** | 13 July 2026 |

---

## Table of contents

1. [Project overview](#1-project-overview)
2. [Tech stack — and why](#2-tech-stack--and-why)
3. [Folder structure](#3-folder-structure)
4. [Backend setup history](#4-backend-setup-history)
5. [Installed packages](#5-installed-packages)
6. [Access control](#6-access-control)
7. [Custom fields](#7-custom-fields)
8. [Hooks](#8-hooks)
9. [Collections](#9-collections)
10. [Globals](#10-globals)
11. [Blocks — the page builder](#11-blocks--the-page-builder)
12. [SEO system](#12-seo-system)
13. [Upload system](#13-upload-system)
14. [Relationships](#14-relationships)
15. [Homepage architecture](#15-homepage-architecture)
16. [API architecture](#16-api-architecture)
17. [Security](#17-security)
18. [Current progress](#18-current-progress)
19. [Remaining work](#19-remaining-work)
20. [Development roadmap](#20-development-roadmap)
21. [AI context](#21-ai-context)
22. [Lessons learned](#22-lessons-learned)

---

# 1. Project overview

## 1.1 What this is

ODH Foundation is an Indian NGO (the philanthropic arm of ODH Group, founded 2023). This project is a
ground-up rebuild of their website. This repository is **the backend** — a Payload CMS instance that
owns all content, all business rules, and eventually all payment processing.

The frontend is currently a **separate Next.js app** built by another developer. The spec (§2) requires
both to live in **one** Next.js application, so a merge is planned. See [§16](#16-api-architecture)
and [§19](#19-remaining-work).

## 1.2 The five hard requirements (spec §1)

These are acceptance criteria, not aspirations. Every architectural decision in this codebase traces
back to one of them.

| # | Requirement | How the backend serves it |
|---|---|---|
| 1 | **100% dynamic content** — every text, image, and section editable by non-technical staff | Page-builder blocks ([§11](#11-blocks--the-page-builder)); nothing hardcoded |
| 2 | **Top-tier SEO** | SEO group on every routable collection ([§12](#12-seo-system)); server-rendered HTML |
| 3 | **Extreme speed** — Lighthouse ≥95, LCP <2.0s, total page <1MB | WebP conversion + 4 responsive sizes ([§13](#13-upload-system)); one-request homepage ([§15](#15-homepage-architecture)) |
| 4 | **Elegant, premium design** | Frontend concern, but backend supplies the structure |
| 5 | **Donation-ready** — one-time + recurring, 80G receipts | ⚠️ **Not built yet.** See [§19](#19-remaining-work). |

## 1.3 Who uses this system

There are three human roles, enforced in code ([§6](#6-access-control)):

| Role | Can do | Cannot do |
|---|---|---|
| `super-admin` | Everything | — |
| `editor` | All content: projects, campaigns, pages, media, navigation | Donations, users, site settings, payment gateway mode |
| `finance` | View donations, export CSV, override `campaigns.raisedAmount` | Edit content |

Plus **anonymous visitors** — the public website. They can read *published* content only. Draft content
is filtered out at the database query level and can never leak through the API.

## 1.4 The admin panel

Payload ships a full React admin UI at `/admin`. It is not something we build — it is generated from
the collection configs. Every field, validation message, conditional field and permission you see in
the panel comes from a TypeScript file in `src/`.

This is the core reason Payload was chosen: **the schema, the API, the admin UI, and the TypeScript
types are all one definition.** Change a field in `src/collections/Projects.ts` and all four update.

## 1.5 Architecture at a glance

```
                    ┌──────────────────────────────────────────┐
                    │       Next.js 16 application             │
                    │                                          │
   Browser ────────►│  /admin        →  Payload admin UI       │
                    │  /api/*        →  Payload REST + GraphQL │
                    │  /(frontend)   →  public website         │
                    │                                          │
                    │      ┌────────────────────────┐          │
                    │      │  Payload CMS (embedded)│          │
                    │      │  collections/globals/  │          │
                    │      │  blocks/hooks/access   │          │
                    │      └───────────┬────────────┘          │
                    └──────────────────┼───────────────────────┘
                                       │
                          ┌────────────▼────────────┐
                          │  PostgreSQL 17          │
                          │  127 tables             │
                          └─────────────────────────┘

   Uploads → local disk (⚠️ see §13.5 — must move to Cloudflare R2 before deploy)
```

---

# 2. Tech stack — and why

Every choice below is either mandated by the spec (§2) or was made during the build. Where we deviated
from the spec, it is called out explicitly.

## 2.1 Payload CMS 3.85.2

**Purpose:** The entire content layer — schema definition, admin panel, REST/GraphQL APIs, access
control, hooks, file uploads, draft/publish workflow.

**Why selected:** Spec §2 mandates it. The reasoning given there is sound and worth repeating:

- Payload 3 runs **inside** the Next.js app. One repo, one deployment, no separate CMS server.
- It exposes a **Local API** (`payload.find()`) that queries the database directly — no HTTP round-trip.
  For a statically-generated site this makes builds dramatically faster.
- The admin panel is generated, not built. Zero frontend work for the CMS.
- Fully typed. `pnpm generate:types` produces `payload-types.ts` from the collection configs.

**Alternatives considered (per spec):**

| Alternative | Why not |
|---|---|
| **Strapi 5** | Approved fallback in the spec. Requires a separate server and HTTP calls at build time. |
| **WordPress** | PHP, plugin sprawl, poor performance ceiling, and the spec's Lighthouse ≥95 target is very hard to hit. |
| **Sanity / Contentful** | Hosted SaaS. Ongoing cost, vendor lock-in, and donor PII would live on a third-party server — a real problem under the DPDP Act 2023 (spec §10). |

**Pros:** Single source of truth. Excellent TypeScript. Hooks give total control over the data lifecycle.
Access control can return a *database query*, not just a boolean — that is unusually powerful.

**Cons:** Smaller ecosystem than WordPress. Postgres schema is auto-generated, which means a rename in
code becomes a migration you did not write — see [§22](#22-lessons-learned) for how this bit us.

## 2.2 Next.js 16.2.6

**Purpose:** The web framework. Hosts both the Payload admin (`/admin`), the API routes (`/api/*`), and
eventually the public site.

**Why:** Mandated by spec §2. The App Router's SSG + ISR model is the whole basis of the performance
strategy (spec §3): pages are pre-rendered to static HTML, served from an edge cache, and re-generated
on demand when an editor publishes.

**Alternatives:** Remix, Astro, SvelteKit. All viable, but Payload 3 is built *for* Next.js — choosing
anything else would mean running Payload as a separate server and giving up the Local API.

**Cons:** App Router has a steep learning curve. Server vs client components is a genuine source of bugs.

## 2.3 PostgreSQL 17 (local) / Neon (production)

**Purpose:** The database. All content, all relationships, all donations.

**Why Postgres over MongoDB:** Spec §2 says *"Reliable, relational (donations need transactional
integrity)"*. This is the right call. A donation is not one row — it is a `donations` row, a
`campaigns.raisedAmount` update, and a receipt number drawn from a sequence. Those three must succeed
or fail **together**. Postgres gives us that with transactions. MongoDB would make it possible to
charge a donor and fail to record it.

**Why local Postgres in development:** The spec says Neon. We started with Neon and hit a wall: the
Neon project was in `us-east-1` (USA), and every schema push from India timed out (`ETIMEDOUT`). Payload
pushes schema on every dev-server boot, and a boot that takes 90 seconds and then fails is unworkable.

**The decision:** develop against local Postgres, deploy against Neon. This is standard practice and
costs nothing — the `DATABASE_URL` is the only thing that changes.

```
.env (development)
DATABASE_URL=postgres://postgres:1234@127.0.0.1:5432/odh-foundation-web

.env (production — currently commented out)
# DATABASE_URL=postgresql://neondb_owner:…@ep-….us-east-1.aws.neon.tech/neondb?sslmode=require
```

> **Before production:** create the Neon project in a **Mumbai or Singapore** region, not `us-east-1`.
> The latency that made development painful will also hurt production TTFB (spec §9 targets <200ms).

## 2.4 TypeScript 5.7.3, `strict: true`

**Purpose:** Type safety across the whole codebase.

**Why:** Mandated by spec §2. In practice this has already caught real bugs — for example,
`relationTo: 'graphics'` failed to compile before the `graphics` collection existed, which is exactly
the feedback loop you want.

**How it works with Payload:** `pnpm generate:types` reads the collection configs and writes
`src/payload-types.ts`. That file is **generated — never edit it by hand.** Import from it:

```ts
import type { User, Project, Media } from '../payload-types'
```

The `Role` type in `src/access/index.ts` is derived from the generated `User` type, so adding a role in
`Users.ts` immediately tells TypeScript everywhere that role needs handling.

## 2.5 sharp 0.34.2

**Purpose:** Image processing — resizing and format conversion.

**Why:** Payload uses it internally for `imageSizes`. We configure it in
`src/collections/Media.ts` to convert every uploaded photo to WebP and generate four responsive sizes.

**Impact, measured on a real upload:**

| | Before | After |
|---|---|---|
| Original | 5,157,137 B (5184px JPEG) | 506,554 B (2400px WebP) |
| Card size (768px) | 72,069 B | 45,642 B |

A 90% reduction on the original. Without this the spec's 1MB page-weight budget (§9) is unreachable.

## 2.6 pnpm

**Purpose:** Package manager.

**Why:** Mandated by spec §2.1. Faster than npm and uses a content-addressable store, so disk usage
stays sane across projects.

## 2.7 Node.js 22 LTS

Mandated by spec §2.1. `package.json` currently allows `^18.20.2 || >=20.9.0` — this is the template
default and should be tightened to Node 22 before deployment.

---

# 3. Folder structure

```
odh-foundation-web/
├── .env                      # SECRETS. Never committed (.gitignore line 41).
├── .env.example              # Template. Committed. No real values.
├── package.json
├── next.config.ts            # ⚠️ Still the template default. Security headers,
│                             #    redirects and image domains must go here (spec §8, §10).
├── tsconfig.json
├── eslint.config.mjs         # ⚠️ Currently broken — see §19.
├── docker-compose.yml        # Template leftover. Not used (we use local Postgres).
│
├── ROADMAP.md                # ← you are here
├── README.md                 # Setup instructions
├── PROJECT_CONTEXT.md        # Context dump for AI assistants
├── DEVELOPER_GUIDE.md        # Conventions and "how do I add X?"
│
├── tests/
│   └── helpers/seedUser.ts   # e2e test user (super-admin)
│
└── src/
    ├── payload.config.ts     # ★ THE ENTRY POINT. Everything is registered here.
    │
    ├── access/
    │   └── index.ts          # Reusable permission functions. Used by every collection.
    │
    ├── fields/               # Reusable FIELD definitions (not collections)
    │   ├── slug.ts           #   slugField()      — auto-generates URL slugs
    │   ├── seo.ts            #   seoField()       — the 5-field SEO group
    │   ├── validators.ts     #   validateUrl, validatePan, validatePhone, validateInternalPath
    │   ├── resolvedItems.ts  #   resolvedItems()  — the virtual `items` field on reference blocks
    │   ├── sanitizePlainText.ts  # ★ Config-level walker. See §8.2 — this is the most
    │   │                          #   important architectural decision in the codebase.
    │   └── hooks/
    │       └── singleLine.ts #   The field hook that strips newlines
    │
    ├── hooks/                # Reusable COLLECTION / GLOBAL hooks
    │   ├── populateBlocks.ts      # afterRead  — fills block.items from collections
    │   ├── preventInUseDelete.ts  # beforeDelete — blocks deleting an in-use image
    │   ├── enforceFileSize.ts     # beforeValidate — per-collection file size cap
    │   ├── clearHiddenFields.ts   # beforeChange — clears stale data from conditional fields
    │   └── clearHiddenNavFields.ts# ⚠️ Older, Navigation-specific version of the above.
    │                              #    Redundant — should be replaced. See §19.
    │
    ├── collections/          # 12 collections. One file each.
    │   ├── Users.ts          #   auth + roles
    │   ├── Media.ts          #   Photos    (WebP, 4 sizes, ≥1200px)
    │   ├── Graphics.ts       #   Logos/icons/QR (as-is, no resize)
    │   ├── Documents.ts      #   PDFs (≤5MB)
    │   ├── Pages.ts          #   ★ the page builder
    │   ├── ProjectCategories.ts
    │   ├── Projects.ts
    │   ├── TeamMembers.ts    #   must be registered BEFORE MediaPosts (author relation)
    │   ├── Testimonials.ts
    │   ├── Campaigns.ts
    │   ├── MediaPosts.ts     #   news | press | blog | gallery | video
    │   └── Careers.ts
    │
    ├── blocks/               # 21 page-builder blocks. One file each.
    │   ├── Hero.ts  StatsBar.ts  AboutStrip.ts  HowYouCanHelp.ts
    │   ├── CategoryGrid.ts  FeaturedProjects.ts  FeaturedCampaigns.ts
    │   ├── TestimonialCarousel.ts  MediaGrid.ts
    │   ├── TrustStrip.ts  CTABand.ts
    │   ├── PageHeader.ts  RichText.ts  TeamGrid.ts  Timeline.ts
    │   ├── FAQAccordion.ts  FormBlock.ts  ImageGallery.ts  VideoEmbed.ts
    │   └── MapContact.ts  FeatureCards.ts   # ← FeatureCards is NOT in spec §6.2's
    │                                        #   named list; added after building the
    │                                        #   CSR page revealed a real gap. See §11.5.
    │
    ├── globals/              # 3 singletons
    │   ├── SiteSettings.ts   #   logo, contact, registrations, social, announcement, GA4
    │   ├── Navigation.ts     #   header menu + footer columns
    │   └── DonationSettings.ts #  presets, impact cards, receipt, gateway mode
    │
    ├── payload-types.ts      # ★ GENERATED. Never edit. Run `pnpm generate:types`.
    │
    └── app/
        ├── (payload)/        # Payload's own routes — admin UI + REST + GraphQL.
        │                     # Generated by the template. Do not edit.
        ├── (frontend)/       # ⚠️ Still the Payload template placeholder page.
        │                     #    The real frontend gets merged in here.
        └── my-route/         # ⚠️ Template leftover. Delete.
```

## 3.1 Why `fields/` and `hooks/` are separate from `collections/`

A collection is a *thing* (a Project, a Campaign). A field or a hook is a *behaviour* that many things
share.

The `slug` field is needed by projects, campaigns, media posts, categories, careers and pages. Writing
it six times means six chances to write it differently. Writing it once as `slugField('title')` means
one place to fix a bug, and the fix lands everywhere.

This is not abstraction for its own sake — it is the direct answer to a class of bug that hit this
project repeatedly. See [§22](#22-lessons-learned).

## 3.2 How the folders communicate

```
payload.config.ts
      │  imports and registers
      ├──────────────► collections/*   ──┐
      ├──────────────► globals/*       ──┤ each imports
      │                                  ├──► access/index.ts    (who can do what)
      │  wraps everything in             ├──► fields/slug.ts     (slugField)
      └──► fields/sanitizePlainText.ts   ├──► fields/seo.ts      (seoField)
           which walks every field in    ├──► fields/validators.ts
           every collection and global   └──► hooks/*            (behaviour)

collections/Pages.ts
      │  imports
      ├──► blocks/*            (the 21 section types)
      └──► hooks/populateBlocks.ts  (fills block.items on read)
```

**The one rule:** a collection never imports another collection. They are linked by *slug strings*
(`relationTo: 'projects'`), not by import. This keeps the dependency graph flat and avoids circular
imports.

---

# 4. Backend setup history

This section exists so that six months from now, or on a new machine, the environment can be rebuilt
exactly.

## 4.1 What was installed on the machine

| Software | Version | Notes |
|---|---|---|
| Node.js | 22 LTS | Runs everything |
| pnpm | 9+ | `npm install -g pnpm` |
| PostgreSQL | 17 | `C:\Program Files\PostgreSQL\17` — includes `psql.exe` |
| Git | any | |
| VS Code | any | |

## 4.2 Step 1 — Scaffold

The project was created from the Payload blank template, which produced:

- `src/payload.config.ts` with `Users` and `Media` collections
- `src/app/(payload)/` — the admin UI and API routes
- `src/app/(frontend)/` — a placeholder page
- Postgres adapter already wired

## 4.3 Step 2 — Database

**First attempt (Neon):** created a Neon project, put the connection string in `.env`. Every dev-server
boot hung on *"Pulling schema from database…"* and eventually failed:

```
Error: cannot connect to Postgres.
  connect ETIMEDOUT 18.215.6.120:5432        ← AWS us-east-1
  connect ENETUNREACH 2600:1f18:…            ← no IPv6 route
```

The Neon project was in `us-east-1`. Schema push runs dozens of queries; over a flaky
India→USA link it never completed.

**Resolution:** switched to local Postgres for development. The Neon string is kept in `.env`,
commented out, for the eventual production deploy.

```bash
# .env
DATABASE_URL=postgres://postgres:1234@127.0.0.1:5432/odh-foundation-web
PAYLOAD_SECRET=<64-char hex>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`PAYLOAD_SECRET` was generated with:

```powershell
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
($bytes | ForEach-Object { $_.ToString('x2') }) -join ''
```

It signs the JWT auth tokens. **Changing it logs everyone out** (existing tokens become invalid), but
does not invalidate passwords — those are salted and hashed per-user.

## 4.4 Step 3 — First admin user

Payload shows a *"Create first user"* form at `/admin` when the `users` table is empty. The first admin
created was `admin@odhfoundation.org`.

**A trap we walked into:** the `roles` field was added to `Users.ts` *after* that user existed, and
strict `read: isSuperAdmin` access was applied at the same time. The existing user had no role, so the
Users collection vanished from the admin sidebar entirely — a self-inflicted lockout.

The fix was to insert the role directly into the database:

```sql
INSERT INTO users_roles ("order", parent_id, value) VALUES (0, 1, 'super-admin');
```

Then **log out and log back in** — because `roles` has `saveToJWT: true`, the role lives in the auth
cookie and an old cookie still says "no roles". See [§17.3](#173-jwt-and-savetojwt).

## 4.5 Step 4 onwards

Everything after this is covered by the chapters below. The build order was:

1. Access helpers + Users roles + Media pipeline
2. Content collections (categories → projects → team → testimonials → campaigns → media posts → careers)
3. SEO group, applied to every routable collection
4. Blocks + the `pages` collection + `populateBlocks`
5. Globals + Documents collection
6. A full audit pass that fixed nine bugs and introduced `sanitizePlainText`

**The order matters.** Categories before projects (projects relate to categories). Team members before
media posts (posts have an author). Get this wrong and TypeScript will tell you — `relationTo` only
accepts slugs it knows about.

## 4.6 Daily commands

```bash
cd c:\Users\HP\Desktop\backend\odh-foundation-web

pnpm dev              # http://localhost:3000  — admin at /admin
pnpm generate:types   # regenerate payload-types.ts after ANY field change
pnpm build            # production build
```

Inspecting the database directly:

```powershell
$env:PGPASSWORD='1234'
& 'C:\Program Files\PostgreSQL\17\bin\psql.exe' -U postgres -h 127.0.0.1 -d "odh-foundation-web" -c "\dt"
```

---

# 5. Installed packages

## 5.1 Runtime dependencies

| Package | Version | Why it is here |
|---|---|---|
| `payload` | 3.85.2 | The CMS core. Collections, globals, hooks, access control, the Local API. |
| `@payloadcms/next` | 3.85.2 | Mounts Payload inside Next.js — the admin UI and the `/api/*` routes. |
| `@payloadcms/db-postgres` | 3.85.2 | Postgres adapter. Translates collection configs into tables, and queries into SQL. |
| `@payloadcms/ui` | 3.85.2 | The React components the admin panel is built from. |
| `@payloadcms/richtext-lexical` | 3.85.2 | The rich-text editor used by `body` and `introText` fields. |
| `next` | 16.2.6 | The framework. |
| `react` / `react-dom` | 19.2.6 | Required by Next and by the admin UI. |
| `sharp` | 0.34.2 | Image resizing and WebP conversion. See [§13](#13-upload-system). |
| `graphql` | ^16.8.1 | Payload exposes a GraphQL API at `/api/graphql`. We do not use it, but Payload requires the package. |
| `dotenv` | 16.4.7 | Loads `.env` when running scripts outside Next (e.g. `tsx`). |
| `cross-env` | ^7.0.3 | Sets `NODE_OPTIONS` in a way that works on Windows *and* Unix. |

## 5.2 Development dependencies

| Package | Why |
|---|---|
| `typescript` 5.7.3 | Type checking. |
| `@types/node`, `@types/react`, `@types/react-dom` | Type definitions. |
| `eslint` + `eslint-config-next` | Linting. ⚠️ **Currently broken** — see [§19](#19-remaining-work). |
| `prettier` | Formatting. |
| `vitest` + `@vitejs/plugin-react` + `jsdom` | Unit / integration tests. Not yet written. |
| `@playwright/test` | End-to-end tests. Not yet written. |
| `@testing-library/react` | Component testing helpers. |
| `tsx` | Runs TypeScript files directly — used for one-off scripts. |
| `vite-tsconfig-paths` | Lets Vitest resolve TS path aliases. |

## 5.3 Packages the spec requires that are NOT yet installed

These are all needed for work still to come (spec Appendix B):

| Package | Needed for |
|---|---|
| `@payloadcms/storage-s3` | **Cloudflare R2 uploads. Blocking for deployment.** See [§13.5](#135-the-storage-problem). |
| `zod` | Server-side validation of the donation and form APIs (spec §7, §10) |
| `@react-pdf/renderer` | 80G receipt PDF generation (spec §6.5) |
| `resend` | Transactional email — receipts, form notifications (spec §6.5) |
| `@sentry/nextjs` | Error tracking (spec §2) |
| `next-intl` | Hindi localization (spec §5.12) |

---

# 6. Access control

**File:** `src/access/index.ts`

## 6.1 How Payload access control actually works

An access function receives the request and returns one of three things:

```ts
type AccessResult = boolean | Where   // Where = a database query
```

| Return | Meaning |
|---|---|
| `true` | Allowed, unconditionally |
| `false` | Denied |
| `{ _status: { equals: 'published' } }` | **Allowed, but only for rows matching this query** |

That third case is the powerful one, and it is easy to miss. Payload takes the returned query and
**merges it into the SQL WHERE clause** of every read. This means filtering is enforced in the
database, not in application code you might forget to write.

This is how `readPublished` works, and it is why draft content **cannot** leak:

```ts
export const readPublished: Access = ({ req: { user } }) => {
  if (user) return true                            // staff see everything
  return { _status: { equals: 'published' } }      // public gets a filter, not a boolean
}
```

An anonymous request for `/api/projects` becomes, in SQL:

```sql
SELECT * FROM projects WHERE _status = 'published'
```

There is no code path where an unauthenticated user receives a draft. Not "we remembered to filter" —
*structurally impossible*.

## 6.2 The functions

```ts
type Role = NonNullable<User['roles']>[number]     // derived from the GENERATED type

const hasRole = (user: User | null | undefined, ...roles: Role[]): boolean => {
  const userRoles = user?.roles
  if (!userRoles) return false
  return roles.some((role) => userRoles.includes(role))
}
```

Note `Role` is derived from `payload-types.ts`. Add a fourth role in `Users.ts`, run
`generate:types`, and TypeScript will flag every place that needs to handle it. This is deliberate.

### Collection / global level

| Function | Returns `true` for | Used on |
|---|---|---|
| `isSuperAdmin` | `super-admin` | `users`, `site-settings`, `donation-settings` |
| `isEditor` | `super-admin`, `editor` | All content collections (create/update/delete), `navigation` |
| `isFinance` | `super-admin`, `finance` | Reserved for the `donations` collection (not built yet) |
| `isLoggedIn` | any authenticated user | Currently unused |
| `isPublic` | everyone | `media`, `graphics`, `documents`, all globals (read) |
| `readPublished` | staff → `true`; public → a published-only query | All content collections (read) |

### Field level

Field access is **different**: it can only return `true` or `false`. It cannot return a query, because
a query filters *rows*, and a field is not a row.

| Function | Protects |
|---|---|
| `isSuperAdminField` | `users.roles` — so an editor cannot promote themselves to super-admin |
| `isFinanceField` | `campaigns.raisedAmount` — so an editor cannot fake a progress bar |

`campaigns.raisedAmount` is money. It is written by the donation webhook. Without field-level access,
any editor could set it to ₹10,000,000 and the public progress bar would lie. This is exactly the kind
of thing field access exists for.

## 6.3 The `users.update` special case

```ts
update: ({ req: { user } }) => {
  if (user?.roles?.includes('super-admin')) return true
  return { id: { equals: user?.id } }    // everyone else: only their own row
}
```

A super-admin can edit anyone. Anyone else can edit **only themselves** — enforced by a query, not by
a check we might forget. And because `roles` has field-level access on top, even editing themselves
they cannot change their role.

## 6.4 Flow

```
Request → /api/projects
   │
   ├─ Payload calls Projects.access.read({ req })
   │     └─ readPublished:  user? → true : { _status: 'published' }
   │
   ├─ If false        → 403, done.
   ├─ If true         → SELECT * FROM projects
   └─ If a Where query→ SELECT * FROM projects WHERE _status = 'published'
                            │
                            ├─ field-level access runs per field
                            │     (strips fields the user may not read)
                            └─ afterRead hooks run  → populateBlocks etc.
```

## 6.5 The trap: `overrideAccess`

**Payload's Local API bypasses ALL access control by default**, even if you pass a `user`.

```ts
// ❌ SECURITY BUG — passes a user but ignores their permissions
await payload.find({ collection: 'projects', user: someUser })

// ✅ CORRECT — actually enforces what that user is allowed to see
await payload.find({ collection: 'projects', user: someUser, overrideAccess: false })
```

`src/hooks/populateBlocks.ts` gets this right:

```ts
await req.payload.find({
  collection,
  req,                    // stay inside the same transaction
  overrideAccess: false,  // ← without this, drafts would leak to anonymous visitors
  user: req.user,
})
```

**When to use which:**
- `overrideAccess: true` (the default) — trusted server work: cron jobs, migrations, system tasks.
- `overrideAccess: false` — anything acting on behalf of a user: API routes, hooks serving a request.

---

# 7. Custom fields

**Directory:** `src/fields/`

These are **field factories** — functions that return a `Field`. They are *not* collections.

## 7.1 Why factories and not plain objects

```ts
export const seoField = (): Field => ({ ... })   // ✅ a function
// export const seoField: Field = { ... }        // ❌ a shared object
```

If a single object were spread across six collections, all six would share **one memory reference**.
Payload mutates field configs during startup (adding labels, normalising defaults). A shared object
mutated six times produces bugs that are almost impossible to trace.

A factory returns a **fresh object every call**. Always call it: `seoField()`, not `seoField`.

## 7.2 `slug.ts` — `slugField(sourceField)`

Auto-generates a URL slug from a title. Used by projects, campaigns, media posts, categories, careers
and pages.

```ts
const slugify = (val: string): string =>
  val.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')   // drop punctuation
    .replace(/\s+/g, '-')       // spaces → hyphens
    .replace(/-+/g, '-')        // collapse repeats
    .replace(/^-|-$/g, '')      // trim leading/trailing hyphens
```

**Lifecycle:**

```
Editor types title: "Mobile Medical Van, Sitapur"
   │
   ├─ beforeValidate hook fires
   │     value (slug field) is empty → fall back to data.title
   │     → slugify("Mobile Medical Van, Sitapur")
   │     → "mobile-medical-van-sitapur"
   │
   ├─ validate() runs
   │     Is the result a non-empty string?
   │     If a title was "!!!", slugify returns "" → reject with a clear message
   │
   └─ saved. `unique: true` prevents two documents sharing a slug.
```

**Key properties:**

| Property | Why |
|---|---|
| `required: true` | An empty slug means a broken URL. Fail loudly at save, not silently in production. |
| `unique: true` | Two projects cannot share a URL. Enforced by a Postgres unique constraint. |
| `index: true` | `/projects/[slug]` queries by slug. Without an index Postgres scans the whole table. |
| `admin.position: 'sidebar'` | It is metadata, not content. Keeps the main form clean. |

**The editor can override it.** If they type a slug manually, that value is slugified and kept. Only an
empty slug falls back to the title.

## 7.3 `seo.ts` — `seoField()`

The five-field SEO group required on every routable collection (spec §6.3).

| Field | Type | Limit | Purpose |
|---|---|---|---|
| `metaTitle` | text | 60 | The blue headline in Google results |
| `metaDescription` | textarea | 160 | The grey text beneath it |
| `ogImage` | upload → media | — | The image on WhatsApp / Facebook / LinkedIn |
| `canonicalUrl` | text | — | Points duplicate pages at the original |
| `noIndex` | checkbox | — | Keeps a page out of Google |

The 60 and 160 limits are not arbitrary — Google truncates beyond them.

**The fallbacks are the frontend's job**, not the CMS's. The CMS stores what the editor typed (often
nothing). `generateMetadata()` implements:

```
metaTitle       → `${title} | ODH Foundation`
metaDescription → excerpt
ogImage         → heroImage → siteSettings.defaultOgImage
```

Applied to: `projects`, `campaigns`, `media-posts`, `project-categories`, `careers`, `pages`.

**Deliberately NOT applied to** `testimonials` and `team-members` — they have no URL of their own. The
spec says *"every **routable** collection"*, and a testimonial is not routable.

## 7.4 `validators.ts`

| Validator | Rule | Notes |
|---|---|---|
| `validateUrl` | Parses with `new URL()`, requires `http:` or `https:` | Uses the built-in parser, not a regex. URL regexes are always wrong. |
| `validateInternalPath` | Must start with `/` | For `/donate`, `/projects/…` |
| `validatePan` | `^[A-Z]{5}[0-9]{4}[A-Z]$` | Indian PAN format |
| `validatePhone` | `^(91)?[6-9][0-9]{9}$` | ⚠️ **Mobile only.** See the bug below. |

**Every validator returns `true` for an empty value.** Validation is about *format*, not *presence* —
`required: true` handles presence. Conflating the two produces confusing double errors.

> ### ⚠️ Known bug: `validatePhone` rejects landlines
> The live odhfoundation.org site publishes **two** numbers:
> ```
> Phone:  0512-2220000        ← landline — WILL BE REJECTED
> Mobile: +91-9795505106      ← mobile   — accepted
> ```
> `site-settings.contact` also has only **one** `phone` field, so both cannot be stored.
> **Fix required:** split into `phone` (landline, relaxed validation) and `mobile`, or accept both
> formats in one field.

## 7.5 `resolvedItems.ts` — `resolvedItems(relationTo)`

A **virtual** relationship field, output-only, used by every reference block.

```ts
export const resolvedItems = (relationTo: CollectionSlug): Field => ({
  name: 'items',
  type: 'relationship',
  relationTo,
  hasMany: true,
  virtual: true,              // ← no database column is created
  admin: { hidden: true },    // ← the editor never sees it
})
```

**Why `virtual: true` matters.** The `populateBlocks` hook fills this field on read. If it wrote into
the *real* `projects` field instead, then an editor opening the page in admin and hitting Save would
persist the auto-selected projects into the manual selection field — silently converting an automatic
block into a manual one. A virtual field has no column, so it **cannot** be written back.

**The bonus:** the frontend reads `block.items` for every reference block, whether the editor chose
items manually or the backend picked them automatically. One field, one code path.

---

# 8. Hooks

## 8.1 How Payload executes hooks

```
CREATE / UPDATE
   │
   ├─ 1. beforeValidate   ← reshape data. slugify, strip newlines, check image width.
   │                         Runs BEFORE validation, so maxLength counts the cleaned string.
   ├─ 2. validate         ← per-field validate() functions
   ├─ 3. beforeChange     ← business logic. Clear stale conditional fields.
   ├─ 4. ══ DATABASE WRITE ══
   └─ 5. afterChange      ← side effects: revalidate cache, send email, update totals

READ
   ├─ 1. ══ DATABASE READ ══
   ├─ 2. relationship population (controlled by `depth`)
   └─ 3. afterRead        ← populateBlocks fills block.items here

DELETE
   ├─ 1. beforeDelete     ← preventInUseDelete throws here
   ├─ 2. ══ DATABASE DELETE ══
   └─ 3. afterDelete
```

**Field hooks** (`fields[].hooks`) operate on one value. **Collection hooks** (`hooks` on the config)
operate on the whole document and can throw to abort the operation.

## 8.2 ★ `sanitizePlainText.ts` — the most important decision in this codebase

**File:** `src/fields/sanitizePlainText.ts`
**Applied in:** `payload.config.ts`, wrapping the entire config.

### The problem it solves

Editors copy text from Word, from an email, from a chat. That text carries `\n` and double spaces.
Those characters then land in:

- `metaDescription` → producing a **broken HTML meta tag**
- `excerpt` → producing a card that renders across two lines
- `statement80G` → producing a **broken 80G receipt PDF**

The obvious fix is a `singleLine` hook on each text field:

```ts
{ name: 'excerpt', type: 'textarea', hooks: { beforeValidate: [singleLine] } }
```

**And that is exactly what we did, and it failed.** Not because the hook was wrong, but because
attaching it by hand to ~40 fields means forgetting some. We forgot five: `faqs.answer`,
`testimonials.quote`, `teamMembers.bio`, `hero.subline`, `impactStats.label`. Each was found only when
a `\n` appeared in an API response.

**The bug was not the missing hook. The bug was that forgetting was possible.**

### The solution

A function that walks the entire config tree and attaches the hook to **every** `text` and `textarea`
field — recursively, through blocks, arrays, groups, rows and tabs.

```ts
const walk = (field: Field): Field => {
  switch (field.type) {
    case 'text':
    case 'textarea': {
      if (field.admin?.custom?.multiline === true) return field   // opt-out

      const existing = field.hooks?.beforeValidate ?? []
      if (existing.includes(singleLine)) return field             // idempotent

      return { ...field, hooks: { ...field.hooks, beforeValidate: [...existing, singleLine] } }
    }

    case 'group': case 'array': case 'collapsible': case 'row':
      return { ...field, fields: field.fields.map(walk) }

    case 'blocks':
      return { ...field, blocks: field.blocks.map((b) => ({ ...b, fields: b.fields.map(walk) })) }

    case 'tabs':
      return { ...field, tabs: field.tabs.map((t) => ({ ...t, fields: t.fields.map(walk) })) }

    default:
      return field
  }
}

export const sanitizePlainText = (config: Config): Config => ({
  ...config,
  collections: config.collections?.map((c) => ({ ...c, fields: c.fields.map(walk) })),
  globals:     config.globals?.map((g) => ({ ...g, fields: g.fields.map(walk) })),
})
```

Wired up in `payload.config.ts`:

```ts
export default buildConfig(
  sanitizePlainText({
    collections: [ ... ],
    globals: [ ... ],
    ...
  }),
)
```

### The opt-out

One field genuinely needs newlines: a postal address.

```ts
{
  name: 'address',
  type: 'textarea',
  admin: { custom: { multiline: true } },   // sanitizePlainText skips this field
}
```

**The default is safe; the exception is explicit.** This is the right way round — forget to opt out and
you get a collapsed address (ugly). Forget to opt *in* to sanitisation and you get a broken receipt PDF
(costly).

### Verified, not assumed

This was tested against three fields that **never had a manual hook**:

```
PASS  testimonials.quote  → "Line one. Line two. Extra spaces."
PASS  testimonials.role   → "Line one. Line two. Extra spaces."
PASS  team-members.bio    → "Line one. Line two. Extra spaces."
PASS  site-settings.tagline  HAS the hook
PASS  site-settings.address  SKIPPED (multiline opt-out)
PASS  pages > hero > slides > headline HAS the hook (nested inside a block)
```

## 8.3 `singleLine.ts`

```ts
export const singleLine: FieldHook = ({ value }) => {
  if (typeof value !== 'string') return value
  return value.replace(/\s+/g, ' ').trim()
}
```

Runs on `beforeValidate` — **before** `maxLength` is checked, so a 160-character limit counts the
*cleaned* string, not one padded with invisible whitespace.

## 8.4 `populateBlocks.ts` — one request for the whole homepage

**Type:** `CollectionAfterReadHook`
**Applied to:** `Pages`

Reference blocks (`featuredProjects`, `categoryGrid`, …) store only a *reference* — the real data lives
in the collections. Something has to fetch it. Two options:

| | Frontend fetches | Backend fetches (chosen) |
|---|---|---|
| Cost | 5–6 extra HTTP calls per page | 5–6 database queries, in parallel, in one request |
| Frontend | Must know which block needs which collection | Reads `block.items`. Done. |

The spec (§3) demands the fewest possible round-trips. Backend wins.

```ts
export const populateBlocks: CollectionAfterReadHook = async ({ doc, req }) => {
  const layout = doc?.layout
  if (!Array.isArray(layout) || layout.length === 0) return doc

  await Promise.all(layout.map(async (block) => {
    switch (block?.blockType) {
      case 'featuredProjects':
        block.items = block.mode === 'manual'
          ? manualSelection(block.projects)
          : await query({ req, collection: 'projects',
                          where: { featured: { equals: true } },
                          limit: clampLimit(block.limit), sort: '-createdAt' })
        break
      // … featuredCampaigns, testimonialCarousel, mediaGrid, categoryGrid

      case 'teamGrid':
        // No auto/manual toggle — unlike featuredProjects, a team page always shows
        // everyone, ordered by `order`. Founder-larger is a frontend display concern.
        block.items = await query({ req, collection: 'team-members', limit: 50, sort: 'order' })
        break
    }
  }))

  return doc
}
```

**`team-members` was added to the hook's `ResolvableCollection` union type** when `TeamGrid` was
built — the switch and the type are extended together, or TypeScript will not let `'team-members'`
compile as a valid `collection` argument. This was verified against a live document: `GET
/api/pages/2?depth=2` returned `teamGrid.items` already populated with the one seeded team member,
confirming the hook resolves correctly end-to-end (see [§18](#18-current-progress)).

**Four things this gets right, each deliberately:**

1. **`Promise.all`** — the blocks are queried in parallel, not one after another.
2. **`req` is threaded through** — the queries join the same database transaction.
3. **`overrideAccess: false, user: req.user`** — access control still applies. Without this, an
   anonymous visitor's homepage would include **draft** projects.
4. **`clampLimit`** — the editor's `limit` is clamped to 1…12. Nobody accidentally renders 500 projects.

## 8.5 `preventInUseDelete.ts` — protecting referential integrity

**Type:** `CollectionBeforeDeleteHook`
**Applied to:** `Media`, `Graphics`

### The bug it fixes

An editor deletes an image. Payload sets every reference to it to `null` — **silently**. The live site
loses an image and nobody knows. `required: true` does not help: it is only checked *at save time*, and
the image is deleted later.

We hit this for real. A media post's `heroImage` went to `null` in production data, and the only reason
we caught it was reading a raw API response.

### How it works

```ts
const MEDIA_USAGE: Usage[] = [
  { collection: 'projects',   fields: ['heroImage', 'seo.ogImage', 'gallery.image', 'partners.logo'], label: 'Project' },
  { collection: 'campaigns',  fields: ['heroImage', 'seo.ogImage', 'gallery.image'],                  label: 'Campaign' },
  { collection: 'pages',      fields: ['seo.ogImage', 'layout.image', 'layout.slides.image'],         label: 'Page' },
  // …
]
```

Before deleting image `id`, it queries every collection that could reference it. If anything is found,
it **throws** — and the delete never happens:

> *This image is still in use in 3 places: Project: Mobile Medical Van, Campaign: Ab Har Koi Padhega,
> Page: Home. Replace or remove it there first, then delete it here.*

> ### ⚠️ Maintenance burden
> `MEDIA_USAGE` and `GRAPHICS_USAGE` are **hand-maintained lists**. Add a new upload field anywhere and
> you must add its path here, or the protection silently has a hole. This is the weakest part of the
> design. A better version would derive the paths from the config at boot. **Noted as future work.**

## 8.6 `clearHiddenFields.ts` — the conditional-field trap

**Type:** `CollectionBeforeChangeHook`
**Applied to:** `MediaPosts`

### The trap

`admin.condition` hides a field **in the browser**. It does two things it does not do:

1. It does **not** delete the value from the database.
2. It does **not** make `required: true` apply to a hidden field.

So: an editor sets a post's type to `Video`, fills in `videoUrl`, then changes the type to `News`. The
UI hides `videoUrl`. **The database still has it.** The frontend, seeing a `videoUrl`, may render a
video player on a news article.

We hit this three separate times:

| Where | Symptom |
|---|---|
| Navigation — plain link | Still carried a `featuredProject` from when it was a mega-menu |
| Navigation — dropdown | Saved with **zero links** — `required` did not apply to the hidden array |
| MediaPosts — type switch | `videoUrl` survived a change to `news` |

### The rule

> **Every conditional field needs two things, not one:**
> 1. A `beforeChange` hook to clear stale values.
> 2. A **parent-level** `validate` to check the required data is actually there.
>
> `admin.condition` alone is a UI convenience. It is not a data guarantee.

```ts
hooks: {
  beforeChange: [
    clearHiddenFields<MediaPostData>(
      {
        galleryImages: (d) => d.type === 'gallery',
        videoUrl:      (d) => d.type === 'video',
        externalUrl:   (d) => d.type === 'press',
      },
      { galleryImages: [] },   // arrays empty to [], everything else to null
    ),
  ],
}
```

Note it writes `null` / `[]` explicitly, **never `undefined`** — Payload reads `undefined` as
"field not sent, keep the old value", which is the exact opposite of what we want.

And in `Navigation.ts`, the parent-level check:

```ts
const headerItemsAreComplete: Validate = (value) => {
  // "Dropdown" with no links, or "Mega-menu" with no featured project → reject
}
```

> ### ⚠️ Duplication
> `clearHiddenNavFields.ts` is an older, Navigation-specific version of this hook. It still works, but
> it duplicates `clearHiddenFields`. **Navigation should be migrated to the generic hook and
> `clearHiddenNavFields.ts` deleted.**

## 8.7 `enforceFileSize.ts`

**Type:** `CollectionBeforeValidateHook`
**Applied to:** `Media` (10 MB), `Documents` (5 MB)

Payload has **no per-collection file size limit**. `upload.limits.fileSize` exists only on the
top-level config, and applies to everything. The spec (§10) needs different caps for images and PDFs,
so this hook exists.

Defence in depth — two layers:

```ts
// payload.config.ts — the server-level wall. Stops a 500MB upload from eating memory.
upload: {
  limits: { fileSize: 10 * 1024 * 1024 },
  abortOnLimit: true,
  responseOnLimit: 'File is too large. The maximum upload size is 10 MB.',
}

// Documents.ts — the per-collection rule
hooks: { beforeValidate: [enforceFileSize(5 * 1024 * 1024)] }
```

## 8.8 The width check in `Media.ts`

Not a shared hook, but worth documenting. Photos below 1200px are rejected:

```ts
if (typeof width === 'number' && width < MIN_WIDTH) {
  throw new APIError(
    `This image is only ${width}px wide. Photos must be at least ${MIN_WIDTH}px wide so that ` +
      `the card and hero sizes can be generated. If this is a logo, icon, badge or QR code, ` +
      `upload it under Graphics instead.`,
    400,
  )
}
```

**Why:** `withoutEnlargement: true` means sharp never upscales. A 347px image produces `sizes.hero =
null`, and the frontend renders nothing. Rejecting at upload is far better than a blank hero in
production.

### `APIError` vs `Error` — a real distinction

| | Shown to the user |
|---|---|
| `throw new Error(msg)` | ❌ *"Something went wrong"* — Payload treats it as an unexpected crash and hides the detail |
| `throw new APIError(msg, 400)` | ✅ **Your message**, with HTTP 400 |

We learned this the hard way: the width check originally used `Error` and editors saw only
*"Something went wrong"*. **Use `APIError` for anything a human should read.**

---

# 9. Collections

12 collections. Postgres tables: **127** (each array and each `hasMany` field becomes its own table —
this rose from 91 as the block library grew; see [§14.3](#143-what-hasmany-and-array-do-to-postgres)).

## 9.1 `users`

| | |
|---|---|
| **Purpose** | Admin authentication and roles |
| **Auth** | `auth: true` — Payload adds email, password, salt, hash, sessions |
| **Drafts** | No |
| **Tables** | `users`, `users_roles`, `users_sessions` |

**Fields:** `roles` (select, hasMany, required, default `['editor']`, `saveToJWT: true`)

**Access:**
- `create` / `delete` / `read` → `isSuperAdmin`
- `update` → super-admin, or a query limiting the user to their own row
- **`roles` field** → `isSuperAdminField` (an editor cannot promote themselves)

**Note on `hasMany` in Postgres:** `roles` is not a column. It is a separate table:

```
users_roles
  order      int     -- position in the array
  parent_id  int     -- FK → users.id
  value      enum    -- 'super-admin' | 'editor' | 'finance'
```

Payload joins it on every read. This is why the admin panel crashed when the `roles` field was added
without restarting the dev server — the table did not exist yet.

## 9.2 `media` (labelled "Photos")

| | |
|---|---|
| **Purpose** | Field photography — heroes, project images, portraits |
| **Upload** | `mimeTypes: ['image/*']` |
| **Tables** | `media` (sizes stored as columns on the same row) |

**Pipeline** (see [§13](#13-upload-system) for detail):
- Original capped at 2400px, converted to WebP q80
- Four sizes generated: `thumb` 480 · `card` 768 · `feature` 1280 · `hero` 1920 — all WebP
- Minimum width **1200px**, enforced by hook

**Fields:** `alt` (required — spec §6.1 mandates it), `caption`

**Hooks:** width check + `enforceFileSize(10MB)` on `beforeValidate`; `preventInUseDelete('media')` on
`beforeDelete`

**Access:** `read: isPublic` (the website must load images), everything else `isEditor`

## 9.3 `graphics`

| | |
|---|---|
| **Purpose** | Logos, icons, badges, QR codes |
| **Upload** | `mimeTypes: ['image/png', 'image/svg+xml', 'image/webp', 'image/jpeg']` |

**No `imageSizes`. No `formatOptions`. No `resizeOptions`.** The file is stored exactly as uploaded.

**Why a separate collection?** Because photos and graphics have *opposite* rules:

| | Photos | Graphics |
|---|---|---|
| Size | Big (≥1200px) | Small (300–800px) |
| Format | WebP is ideal | **PNG/SVG** — transparency, crisp edges |
| Resize | Yes, 4 sizes | **Never** |

Forcing both into one collection means the rules fight each other. We discovered this when an 80G badge
(500×500 PNG) was rejected by the 1200px photo rule. The error was correct; the design was wrong.

**Consequence for the frontend:** a Graphic has **no `sizes` object**. `graphic.sizes.card.url` throws.
Use `graphic.url`.

## 9.4 `documents`

| | |
|---|---|
| **Purpose** | PDFs — 80G/12A certificates, annual reports, the CSR deck |
| **Upload** | `mimeTypes: ['application/pdf']`, capped at **5 MB** (spec §10) |

**Fields:** `title` (required — used as the download link text)

## 9.5 `pages` ★

The page builder. See [§11](#11-blocks--the-page-builder).

| | |
|---|---|
| **Purpose** | Homepage, and every generic page (privacy, terms, refund policy — spec §5.13) |
| **Drafts** | Yes |
| **Hooks** | `afterRead: [populateBlocks]` |

**Fields:** `title`, `slugField('title')`, `layout` (blocks, `minRows: 1`), `seoField()`

The homepage is simply the page with `slug: 'home'`.

## 9.6 `project-categories`

The 11 focus areas (Health, Education, Environment, Livelihood, Agriculture, Sports & Events, Urban
Renewal, Rural Development, Women Empowerment, Disaster Management, Art & Culture).

**Fields:** `name`, `slugField('name')`, `icon` (→ **graphics**), `heroImage` (→ **media**),
`introText` (richText — 150–300 words of SEO copy per spec §8.3), `order`, `seoField()`

**Why `introText` matters:** category landing pages are the pages that rank for *"NGO education India"*
type queries. Without body copy they are thin content and Google ignores them.

## 9.7 `projects`

The core content type.

| Field | Type | Notes |
|---|---|---|
| `title` | text | required |
| `slug` | — | `slugField('title')` |
| `category` | relationship → project-categories | required |
| `status` | select | `ongoing` \| `completed`. **`enumName: 'enum_projects_project_status'`** — see below |
| `location` | group | `city` (req), `district`, `state` (req) |
| `heroImage` | upload → media | required |
| `excerpt` | textarea | required, max 160 — becomes the meta description |
| `body` | richText | |
| `impactStats` | array | `label`, `value` (number), `suffix` |
| `beneficiaries` | number | min 0 |
| `gallery` | array | `image` → media |
| `partners` | array | `name`, `logo` → **graphics** |
| `startDate` / `endDate` | date | `endDate` validated to be ≥ `startDate` |
| `featured` | checkbox | drives the homepage `featuredProjects` block |
| `seo` | group | `seoField()` |

> ### ⚠️ The `enumName` trap — read this before adding any `status` field
> Payload's draft system adds an internal `_status` field (`draft` | `published`). The Postgres adapter
> names enums `enum_<table>_<column>`, so `_status` becomes **`enum_projects_status`**.
>
> Our own `status` field (`ongoing` | `completed`) would produce the **same name**. The result:
>
> ```
> Failed query: CREATE TABLE "projects" ( … "status" "enum_projects_status" DEFAULT 'ongoing' … )
> Caused by: invalid input value for enum enum_projects_status: "ongoing"
> ```
>
> **The rule:** with `versions: { drafts: true }`, never name a field `status` without giving it an
> explicit `enumName`. The API name stays `status` — `enumName` only changes the database.

## 9.8 `team-members`

**Fields:** `name`, `role`, `photo` → media, `bio`, `linkedin` (validated URL), `isFounder`, `order`

**Registered before `media-posts`** in `payload.config.ts`, because posts have an `author` relationship
to this collection.

## 9.9 `testimonials`

**Fields:** `quote` (required), `name`, `role` ("Farmer, Sitapur"), `photo`, `relatedProject`

**No SEO group** — testimonials have no URL of their own.

## 9.10 `campaigns`

**Fields:** `title`, `slug`, `heroImage`, `excerpt` (160), `body`, `goalAmount`, `raisedAmount`,
`showProgress`, `faqs[]`, `gallery[]`, `featured`, `active`, `seo`

**`raisedAmount` is protected at the field level:**

```ts
access: { update: isFinanceField }
```

It is money, written by the donation webhook. An editor must not be able to touch it.

**`faqs[]`** feeds `FAQPage` structured data (spec §8.2) — Google renders these as an expandable
accordion in search results.

**Frontend note:** only draw the progress bar when `showProgress` is true **and** `goalAmount` is set.
`goalAmount` is nullable, and `raised / null` is `NaN`.

## 9.11 `media-posts`

News, press coverage, blog, photo gallery, video — one collection, discriminated by `type`.

| Field | Shown when |
|---|---|
| `galleryImages[]` | `type === 'gallery'` |
| `videoUrl` (validated URL) | `type === 'video'` |
| `externalUrl` (validated URL) | `type === 'press'` |

Conditional fields are cleared on save by `clearHiddenFields` — see [§8.6](#86-clearhiddenfieldsts--the-conditional-field-trap).

**No `enumName` needed here:** `type` produces `enum_media_posts_type`, and `_status` produces
`enum_media_posts_status`. Different names, no collision. The problem in `projects` was specifically the
name `status`.

**Blog posts are the SEO engine** (spec §8.3): *"content team publishes ≥2 posts/month post-launch
(biggest long-term ranking lever)"*.

## 9.12 `careers`

**Fields:** `title`, `slug`, `location` (required), `type` (`full-time`|`part-time`|`volunteer`|`intern`),
`description` (richText), `active`, `seo`

`location`, `type` and `description` are the required fields of Google's `JobPosting` schema (spec §8.2),
which is why `location` is required.

---

# 10. Globals

## 10.1 Global vs Collection

| | Collection | Global |
|---|---|---|
| How many documents | Many (100 projects) | **Exactly one** |
| API | `/api/projects` → `{ docs: [...] }` | `/api/globals/site-settings` → the object directly |
| Example | Projects, Campaigns | The footer. The logo. Site settings. |

**When NOT to use a global:** if you might ever want a second one. There is one footer, so `navigation`
is a global. There could be many campaigns, so `campaigns` is a collection. If in doubt, use a
collection — converting a global to a collection later is a migration.

## 10.2 `site-settings`

**Access:** `read: isPublic`, `update: isSuperAdmin`

**Why super-admin only:** spec §6.1 — *"editor: all content, no donations/users/**settings**"*. An
editor writing project copy must not be able to change the 80G registration number or the GA4 ID.

Organised into tabs (a UI device — tabs do not appear in the API):

| Tab | Fields |
|---|---|
| **Brand** | `siteName`, `tagline`, `logo`, `logoLight`, `favicon`, `defaultOgImage` |
| **Contact** | `contact.address` ⚠️, `phone`, `email`, `hours`, `mapUrl` |
| **Registrations** | `pan`, `reg80G`, `reg12A`, `csr1`, `certificates[]` → documents |
| **Social** | `socialLinks[]` — `platform` (facebook\|instagram\|linkedin\|x\|youtube), `url` |
| **Announcement Bar** | `enabled`, `text`, `linkLabel`, `linkHref` |
| **Analytics** | `ga4Id`, `clarityId` |

**⚠️ `contact.address` is the one field in the entire CMS that keeps its newlines**
(`admin.custom.multiline: true`). The frontend must render it with `white-space: pre-line`.

**The announcement bar's conditional-required pattern** is worth copying:

```ts
{ name: 'enabled', type: 'checkbox', defaultValue: false },
{
  name: 'text',
  type: 'text',
  required: true,                                              // required…
  admin: { condition: (_, s) => s?.enabled === true },         // …but only when visible
}
```

Payload does not enforce `required` on hidden fields. So the bar can be left off with the text blank —
but the moment you switch it on, the text becomes mandatory. Exactly the behaviour you want.

**Real registration numbers** (from the live site, replacing the placeholders currently in the database):

```
PAN: AADCO9821D    80G: AADCO9821DF20231    CSR: CSR00064209
```

## 10.3 `navigation`

**Access:** `read: isPublic`, `update: isEditor` — this is content, not settings.

**Header items** have three styles:

| `style` | Extra field | Rendering |
|---|---|---|
| `link` | — | A plain link |
| `dropdown` | `children[]` | A small dropdown |
| `megaMenu` | `featuredProject` | The full-width Projects panel |

**The mega-menu's 11 categories are deliberately NOT stored here.** They live in
`project-categories`, and the frontend fetches them from `/api/project-categories?sort=order`.

**Why:** storing them in the nav too would duplicate the data. Add a 12th category and someone must
remember to add it to the nav as well. They will forget. The categories live in exactly one place.

The editor only picks the **featured project** — because *that* is curation, not duplication.

**Footer:** `footerColumns[]` (title + links), `legalLine`, `newsletter` (enabled/heading/blurb).

**Hooks:** `beforeChange: [clearHiddenNavFields]` + a `validate` on `headerItems` that rejects a
dropdown with no links, or a mega-menu with no featured project.

## 10.4 `donation-settings`

**Access:** `read: isPublic`, `update: isSuperAdmin`

| Tab | Fields |
|---|---|
| **Amounts** | `presetAmounts[]` (amount, highlight), `minAmount` (default 100), `allowMonthly` |
| **Impact Cards** | `impactCards[]` — amount, description, icon → graphics |
| **Receipt** | `signatoryName`, `signatoryRole`, `signatureImage`, `statement80G` |
| **Gateway** | `gatewayMode` (`test`\|`live`), `gateway` (`payu`\|`razorpay`), `upiQr` |

**`presetAmounts` has an array-level validator:**

```ts
const onlyOneHighlight: Validate = (value) => {
  if (!Array.isArray(value)) return true
  const highlighted = value.filter((row) => row?.highlight === true)
  if (highlighted.length > 1) return 'Only one amount can be marked as "most popular".'
  return true
}
```

**Why array-level and not row-level?** A single row cannot know whether *another* row is also
highlighted. **Validate at the level where the information exists.** This pattern generalises — for
example, "only one team member can be the founder".

> ### ⚠️ `gatewayMode` is the single most dangerous field in the CMS
> Flipping it from `test` to `live` means **real cards start being charged.** Hence:
> - `update: isSuperAdmin` — editors and finance cannot touch it
> - The option labels warn: *"Live — real donations are charged"*
> - Spec §7: *"full test-card checklist must pass before go-live"*

> ### ⚠️ `minAmount` is NOT validation
> It is a **display** value. The donation API must independently reject anything below it. An attacker
> does not use your form — they `curl` your endpoint. Client-side validation is a courtesy to the user;
> it is never a security control.

---

# 11. Blocks — the page builder

## 11.1 Why blocks exist

Spec §1: *"100% dynamic content — every text, image, project, campaign, banner, team member, statistic,
and page section is editable from an admin panel by non-technical staff."*

Spec §6.2 makes it a rule:

> *"**Any new page the client dreams up must be buildable from blocks without a developer.** If a layout
> can't be composed, add a block — don't hardcode a page."*

A normal collection has a fixed shape. Every project has a title, a category, an excerpt. The editor
*fills* it; they cannot *change* it.

A page is different. The editor must be able to drag Testimonials above Media, insert a CTA band in
the middle, and delete the stats bar — **without a developer**. That is what `type: 'blocks'` provides.

```ts
{
  name: 'layout',
  type: 'blocks',
  minRows: 1,
  blocks: [Hero, StatsBar, AboutStrip, CategoryGrid, FeaturedCampaigns,
           FeaturedProjects, HowYouCanHelp, TestimonialCarousel,
           MediaGrid, TrustStrip, CTABand],
}
```

The API returns an array, each entry tagged with `blockType`. The frontend maps over it and switches.
**It must never hardcode the order** — the order belongs to the editor.

## 11.2 The two kinds of block

This distinction is the core of the design.

| | **Content blocks** | **Reference blocks** |
|---|---|---|
| Where the data lives | Inside the block | In a collection |
| Example | `Hero` — the headline is typed into the block | `FeaturedProjects` — projects live in `projects` |
| Fields | Many (text, image, arrays) | Few (`heading`, `mode`, `limit`) |
| Blocks | Hero, StatsBar, AboutStrip, HowYouCanHelp, TrustStrip, CTABand | CategoryGrid, FeaturedProjects, FeaturedCampaigns, TestimonialCarousel, MediaGrid |

### The mistake reference blocks avoid

```ts
// ❌ WRONG — re-declaring project data inside the block
{ name: 'projects', type: 'array', fields: [
    { name: 'title', type: 'text' },      // already exists in `projects`!
    { name: 'image', type: 'upload' },    // here too?!
]}
```

Now a project's title lives in two places. Change it once and the homepage still shows the old one.
This is the oldest bug in database design.

```ts
// ✅ RIGHT — reference it
{ name: 'mode', type: 'select', options: ['auto', 'manual'] }
{ name: 'limit', type: 'number' }
resolvedItems('projects')     // ← output-only, filled by populateBlocks
```

### Auto vs manual

Reference blocks support both, and the frontend does not have to care:

| Mode | Behaviour |
|---|---|
| `auto` | Backend queries `featured: true`, sorted, limited |
| `manual` | Editor picks specific documents, in order |

**Either way, the result lands in `block.items`.** The frontend reads one field.

The `mode`/`limit`/`projects` fields are editor plumbing. **The frontend should ignore them entirely.**

## 11.3 Every block

### Content blocks

| Block | `blockType` | Fields |
|---|---|---|
| **Hero** | `hero` | `slides[]` (1–3): `headline`, `subline`, `image`. Plus `primaryCta{label,href}`, `secondaryCta{label,href}` |
| **StatsBar** | `statsBar` | `stats[]` (2–4): `label`, `value` (number), `suffix` |
| **AboutStrip** | `aboutStrip` | `eyebrow`, `title`, `paragraphs[]` (1–4), `image`, `link{label,href}` |
| **HowYouCanHelp** | `howYouCanHelp` | `heading`, `options[]` (1–3): `title`, `description`, `ctaLabel`, `ctaHref`, `icon` → graphics |
| **TrustStrip** | `trustStrip` | `heading`, `badges[]` (≤6): `label`, `note`. `logos[]`: `name`, `logo` → graphics, `url` |
| **CTABand** | `ctaBand` | `eyebrow`, `heading`, `subheading`, `ctaLabel`, `ctaHref`, `secondaryCta{label,href}`, `trustBadges[]` (≤4, `text`), `qrImage` → graphics |
| **PageHeader** | `pageHeader` | `title`, `subtitle`, `crumbs[]` (`label`, `href`), `image` → media (optional — falls back to the brand gradient) |
| **RichText** | `richText` | `eyebrow`, `heading`, `content` (richText) |
| **Timeline** | `timeline` | `heading`, `milestones[]`: `year`, `title`, `description` |
| **FAQAccordion** | `faqAccordion` | `heading`, `faqs[]`: `question`, `answer`. (Distinct from `campaigns.faqs` — that field feeds the campaign's own `FAQPage` schema; this block is for generic pages) |
| **FormBlock** | `formBlock` | `heading`, `subheading`, `formType` (`contact`\|`volunteer`\|`csr`\|`career`\|`newsletter` — matches the not-yet-built `form-submissions.formType`), `fields[]` (`name`, `label`, `type`, `required`, `placeholder`, `options[]`), `submitLabel` |
| **ImageGallery** | `imageGallery` | `heading`, `images[]`: `image` → media, `caption` |
| **VideoEmbed** | `videoEmbed` | `heading`, `videoUrl`, `caption` |
| **MapContact** | `mapContact` | `mapImage` → media only. Address/phone/email/hours/map link are **not** duplicated here — they come from `site-settings.contact` |
| **FeatureCards** | `featureCards` | `eyebrow`, `heading`, `subheading`, `cards[]` (≤6): `icon` → graphics (optional), `title`, `description`. `downloadCta{label, file → documents}` (optional) |

**`CTABand` was extended, not replaced.** It shipped with 5 fields (`heading`, `subheading`,
`ctaLabel`, `ctaHref`, `qrImage`). Verifying it against the live About/CSR/Media pages showed the
frontend also renders an eyebrow pill, a second button, and a small trust-badge line — none of
which existed in the schema. Three fields (`eyebrow`, `secondaryCta`, `trustBadges`) were added,
**all optional**, so every `ctaBand` block already saved in the database stayed valid with no
migration. See [§22.10](#2210-additive-schema-changes-are-free-if-the-new-fields-are-optional).

**`FeatureCards` is not one of the spec's 20 named blocks.** It was added after building the CSR
page revealed a real gap: the "Why partner with us" / "Two ways to partner" sections are icon+title
+description cards **without** a mandatory per-card CTA, which is what `HowYouCanHelp` requires.
Rather than force-fit `HowYouCanHelp` (whose `ctaLabel`/`ctaHref`/`icon` are all `required`),
a second, more permissive card-grid block was added. It is already reused twice on one page (CSR)
with different content — the definition of a correctly generalised block. See [§11.5](#115-block-coverage-against-spec-6.2).

**`FormBlock.formType`** is designed to match the **not-yet-built** `form-submissions.formType`
field from spec §6.1 exactly (`contact`\|`volunteer`\|`csr`\|`career`\|`newsletter`). When that
collection is built (Phase 2, [§19.3](#193-missing-features-by-spec-section)), submissions from
every `FormBlock` instance on the site will slot into it with no schema change on either side.

**`MapContact` deliberately has one field.** Address, phone, email, hours and the Google Maps link
all already exist on `site-settings.contact` (§10.2). Giving the block its own copies of those
fields would duplicate content an editor could then update in one place and forget the other —
exactly the mistake reference blocks exist to avoid ([§11.2](#112-the-two-kinds-of-block)). The
frontend combines `mapContact.mapImage` with the `site-settings` global at render time.

**`Hero.slides` is capped at `maxRows: 3`** — spec §5.1 says *"Rotating (max 3)"*. Payload will refuse
a fourth. The spec's rule is enforced in code, not in a comment.

**`StatsBar.value` is a number, not text.** The frontend uses `react-countup` to animate 0 → 48,000.
That needs a real number. Formatting — commas, the `+` suffix — is the frontend's job.

> **A general principle:** the backend stores **data**; the frontend handles **presentation**. Commas,
> `₹`, `+` suffixes, date formats — none of it belongs in the database.

### Reference blocks

| Block | `blockType` | Resolves to |
|---|---|---|
| **CategoryGrid** | `categoryGrid` | All categories, sorted by `order`. Also has `columns` (`"3"`\|`"4"` — a **string**, because select values always are) |
| **FeaturedProjects** | `featuredProjects` | Projects where `featured: true` |
| **FeaturedCampaigns** | `featuredCampaigns` | Campaigns where `featured: true` **and** `active: true` |
| **TestimonialCarousel** | `testimonialCarousel` | Latest testimonials |
| **MediaGrid** | `mediaGrid` | Media posts, newest first. `filterByType[]` can narrow to specific types |
| **TeamGrid** | `teamGrid` | All team members, sorted by `order` — no auto/manual toggle, unlike the blocks above. A team page shows everyone; "founder appears larger" is a frontend display rule driven by `isFounder`, not a curation choice an editor makes per-page |

## 11.4 `condition(_, siblingData)` — the gotcha

Inside a block, this is **wrong**:

```ts
condition: (data) => data?.mode === 'auto'      // ❌ `data` is the whole PAGE
```

The page has 10 blocks. `data.mode` is meaningless.

```ts
condition: (_, siblingData) => siblingData?.mode === 'auto'   // ✅ this block's fields
```

**Inside blocks and arrays, always use `siblingData`.** `data` only makes sense at the top level of a
document (which is why `MediaPosts` correctly uses `data.type`).

## 11.5 Block coverage against spec §6.2

Spec §6.2 lists **20** named blocks. **19 of 20 exist.** Only one is intentionally still missing:

```
DonateWidget   ← deferred to Phase 3 (Donations). Not a content block — it is a live payment
                 form wired to the `donations`/`subscriptions` collections and the PayU API,
                 none of which exist yet. Building it now would mean building it twice.
```

Plus **one block beyond the spec's named list** — `FeatureCards` (see [§11.3](#113-every-block)) —
added because the actual CSR page needed a card-grid shape the spec's other blocks did not cover.

This was verified page-by-page, not assumed complete: `About`, `CSR`, `Media`, and `Volunteer` were
each built end-to-end in the admin panel using only these blocks, and the resulting `/api/pages/:id`
response was checked field-by-field against what the corresponding frontend route actually renders.
Three real mistakes surfaced this way and were fixed before being treated as done:

1. A `CSR` inquiry form field (`contactPerson`) was typed `email` instead of `text` — the person's
   *name*, not their email address, would have hit an HTML5 email-format validator.
2. The same page's field `name` was entered as `"company name"` (with a space) — this becomes an
   object key once form submissions are wired up in Phase 2, and a space there breaks it silently.
3. A required select field (*"Preferred focus area"*) was missing from the form entirely — the
   frontend has 7 fields, the admin content only had 6.

None of these were schema bugs — the block definitions were correct. They were **content-entry
mistakes**, caught only by reading the raw API response next to the rendered page. **Verify against
the API, not against how the admin form looks** — the form does not show you what actually got saved.

**Until `DonateWidget` exists, the Donate page cannot be built from blocks** — everything else spec
§6.2 requires now can be.

## 11.6 Generic pages vs. collection-driven listings — a rule that is easy to get backwards

Building the `Media` page in admin produced a real mistake worth documenting, because the instinct
it corrects is a natural one.

**What happened:** a `pages` document (slug `media`) was created with a `PageHeader` block — correct
— followed by an `ImageGallery` block into which someone tried to manually type each news/blog/press
item (title, a "description", a date, a type badge). `ImageGallery` has no such fields, because that
is not its job, and the attempt stalled.

**The rule this reveals:**

| | Generic `pages` documents | A dedicated collection (`media-posts`, `projects`, `campaigns`, `careers`) |
|---|---|---|
| Holds | Page **chrome** — header, static sections, closing CTA | The actual **list items** — each with its own detail page |
| Structure per item | Whatever the editor composes, any order | Fixed schema, identical shape for every item (required for SEO structured data and template consistency — see [§11.2](#112-the-two-kinds-of-block)) |
| Example | `About`, `CSR`, `Volunteer`, `Contact`, legal pages | Every news post, every project, every campaign |

**The correct shape for `/media`, `/projects`, `/campaigns`** is therefore *two* independent reads,
not one:

```
1. Pages collection, slug "media"  → PageHeader + (optional) CTABand   — the chrome only
2. media-posts collection, queried directly, with its own type/date filters → the card grid
```

The `pages` document for a listing route **never** contains the list items as blocks. Each item is
its own document in its own collection, exactly as [§11.2](#112-the-two-kinds-of-block) already
argues for reference blocks — this is the same principle one level up: don't let a generic,
freely-reordered container hold data that needs a fixed, queryable, individually-routable shape.

**Practical check before building any new generic page:** if the page's content is "a list of things
that each need their own URL, own date, own type" — it is a collection, not a block. If it is "static
prose/cards that only exist on this one page" — it is a block.

---

# 12. SEO system

## 12.1 Where SEO lives

Every routable document carries the same `seo` group ([§7.3](#73-seots--seofield)). The database columns
are prefixed by the group name: `seo_meta_title`, `seo_meta_description`, `seo_og_image_id`,
`seo_canonical_url`, `seo_no_index`.

## 12.2 Slugs

`slugField` produces clean, lowercase, hyphenated URLs (spec §8.1):

```
"Mobile Medical Van, Sitapur"  →  /projects/mobile-medical-van-sitapur
```

`unique: true` guarantees no two documents share a URL. `index: true` makes slug lookups fast — this
matters because **every** detail page does exactly one query: find by slug.

## 12.3 The fallback chain (frontend responsibility)

Every SEO field is nullable and usually empty. `generateMetadata()` must implement:

| Field | Fallback |
|---|---|
| `metaTitle` | `` `${title} | ODH Foundation` `` |
| `metaDescription` | `excerpt` |
| `ogImage` | `heroImage` → `siteSettings.defaultOgImage` |
| `noIndex` | → `robots: { index: false }` |

This is why `excerpt` is `required` with `maxLength: 160` — it is the meta-description fallback, and
Google truncates at 160.

## 12.4 What the backend does NOT do yet

Spec §8 is an extensive checklist. Backend-side, these are **not built**:

- [ ] `sitemap.ts` — dynamic, all published slugs
- [ ] `robots.ts` — disallow `/admin`, `/api`
- [ ] JSON-LD structured data: `NGO`, `WebSite`+`SearchAction`, `BreadcrumbList`, `Article`, `FAQPage`, `JobPosting`
- [ ] A `redirects` collection + `next.config.ts` redirect map from every old odhfoundation.org URL
  — **missing this loses all current search rankings** (spec §8.1)
- [ ] `opengraph-image.tsx` — dynamic OG image generation

The **data** for all of this exists (`faqs[]` → `FAQPage`, `careers` → `JobPosting`). Only the rendering
is missing.

---

# 13. Upload system

## 13.1 Three collections, three sets of rules

| | `media` ("Photos") | `graphics` | `documents` |
|---|---|---|---|
| **Holds** | Field photography | Logos, icons, badges, QR | PDFs |
| **Accepts** | `image/*` | PNG, SVG, WebP, JPEG | `application/pdf` |
| **Min width** | **1200px** (enforced) | none | — |
| **Max size** | 10 MB | 10 MB (server cap) | **5 MB** |
| **Converted** | → WebP | **No** | — |
| **Resized** | Original → 2400px, + 4 sizes | **No** | — |
| **Has `sizes`** | ✅ | ❌ | ❌ |

## 13.2 The photo pipeline

```ts
upload: {
  mimeTypes: ['image/*'],
  adminThumbnail: 'thumb',
  resizeOptions: { width: 2400, withoutEnlargement: true },
  formatOptions: { format: 'webp', options: { quality: 80 } },
  imageSizes: [
    { name: 'thumb',   width: 480,  formatOptions: { format: 'webp', options: { quality: 75 } } },
    { name: 'card',    width: 768,  formatOptions: { format: 'webp', options: { quality: 78 } } },
    { name: 'feature', width: 1280, formatOptions: { format: 'webp', options: { quality: 80 } } },
    { name: 'hero',    width: 1920, formatOptions: { format: 'webp', options: { quality: 82 } } },
  ],
}
```

**Quality rises with size (75 → 82) on purpose.** Nobody zooms into a 480px thumbnail, so 75 is
invisible there and saves real bytes. A 1920px hero fills the screen and needs 82.

**`withoutEnlargement: true`** means sharp never upscales. This is correct — upscaling produces a
blurry image and a bigger file, the worst of both. But it has a consequence: a small image produces
`sizes.hero = null`. Hence the 1200px minimum.

## 13.3 Frontend contract

```ts
// ✅ Photo — has sizes, with a fallback chain (any size may be null)
photo.sizes.hero?.url ?? photo.sizes.feature?.url ?? photo.url

// ✅ Graphic — no sizes. This is the only correct usage:
graphic.url

// ❌ Throws. Graphics have no `sizes` object.
graphic.sizes.card.url
```

## 13.4 Referential integrity

`preventInUseDelete` ([§8.5](#85-preventinusedeletets--protecting-referential-integrity)) blocks
deleting an image that is still referenced anywhere.

## 13.5 ⚠️ THE STORAGE PROBLEM — blocking for deployment

```ts
// payload.config.ts
plugins: [],   // ← empty
```

**There is no storage adapter.** Every uploaded file is written to the local disk.

This works in development. **It will break on Vercel**, because Vercel's filesystem is ephemeral —
every deploy wipes it. All uploaded images would vanish.

Spec §2 mandates **Cloudflare R2** via `@payloadcms/storage-s3`. Required env vars (already listed in
the spec's Appendix A):

```
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
```

**This must be done before the first deploy.** It is the single largest hidden blocker in the project.

---

# 14. Relationships

## 14.1 The full graph

```
                            ┌──────────────┐
                            │    users     │  (auth only — no content relations)
                            └──────────────┘

  ┌───────────────────┐        ┌──────────────────┐        ┌──────────────┐
  │ project-categories│◄───────│     projects     │───────►│    media     │
  │                   │ category│                  │heroImage│  (Photos)   │
  │  icon → graphics  │        │  gallery[].image ─┼───────►│              │
  │  heroImage ───────┼───────►│  seo.ogImage ─────┼───────►│              │
  └───────────────────┘        │  partners[].logo ─┼──┐     └──────────────┘
                               └──────────────────┘  │
                                        ▲            │     ┌──────────────┐
                                        │            └────►│   graphics   │
                          relatedProject│                  │ (logos/icons)│
                               ┌────────┴─────────┐        └──────────────┘
                               │   testimonials   │               ▲
                               │  photo → media   │               │
                               └──────────────────┘               │
                                                                  │
  ┌──────────────────┐        ┌──────────────────┐                │
  │   team-members   │◄───────│   media-posts    │                │
  │  photo → media   │ author │  heroImage       │                │
  └──────────────────┘        │  galleryImages[] │                │
                              └──────────────────┘                │
                                                                  │
  ┌──────────────────┐        ┌──────────────────┐                │
  │    campaigns     │        │     careers      │                │
  │  heroImage       │        │  seo.ogImage     │                │
  │  gallery[]       │        └──────────────────┘                │
  │  faqs[]          │                                            │
  └──────────────────┘                                            │
                                                                  │
  ┌───────────────────────────────────────────────┐               │
  │                    pages                      │               │
  │  layout: [ blocks ]                           │               │
  │    ├─ hero.slides[].image ────────► media     │               │
  │    ├─ aboutStrip.image ──────────► media      │               │
  │    ├─ howYouCanHelp.options[].icon ───────────┼───────────────┤
  │    ├─ trustStrip.logos[].logo ────────────────┼───────────────┤
  │    ├─ ctaBand.qrImage ────────────────────────┼───────────────┘
  │    └─ REFERENCE BLOCKS ──────────► resolved at read time
  │         via populateBlocks into block.items
  └───────────────────────────────────────────────┘

  GLOBALS
  ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
  │  site-settings   │   │    navigation    │   │ donation-settings│
  │  logo → graphics │   │  headerItems[]   │   │  impactCards[]   │
  │  favicon         │   │   .featuredProject──►│   .icon → graphics│
  │  defaultOgImage  │   │      → projects  │   │  upiQr → graphics│
  │  certificates[]  │   │  footerColumns[] │   │  receipt.signature│
  │    → documents   │   └──────────────────┘   │    → graphics    │
  └──────────────────┘                          └──────────────────┘
```

## 14.2 How relationships arrive in the API — `depth`

`depth` controls how many levels are expanded from an ID into a full object.

| `depth` | Result |
|---|---|
| `0` | `"heroImage": 3` — just the ID |
| `1` | `"heroImage": { url, sizes, … }` |
| `2` (default) | Also expands relations *inside* those objects |
| **`3`** | **Required for the homepage** |

### ⚠️ Why the homepage needs `depth=3`

```
pages (0) → layout blocks (1) → ctaBand.qrImage (2) → the Graphic itself (3)
```

Because `ctaBand` is a block nested inside `layout`, its `qrImage` sits one level deeper than a
top-level field. At the default depth it comes back as the **number** `3`, not an object.

**This fails silently.** No error. `qrImage.url` is `undefined` and the QR code simply does not render.

```
✅  GET /api/pages?where[slug][equals]=home&depth=3
```

## 14.3 What `hasMany` and `array` do to Postgres

Neither is a column. Both become **separate tables**:

```
projects_impact_stats
  _order     int
  _parent_id int   -- FK → projects.id
  label      varchar
  value      numeric
  suffix     varchar
```

This is why the project has **127 tables** for 12 collections. It is also why adding an array field
requires a **dev-server restart** — Payload creates tables at boot, not on hot-reload.

---

# 15. Homepage architecture

## 15.1 One request

```
Browser → GET /api/pages?where[slug][equals]=home&depth=3
   │
   ├─ access: readPublished
   │     anonymous → WHERE _status = 'published'
   │
   ├─ SELECT the page + its 91-table block joins
   │
   ├─ relationship population (depth=3)
   │     hero.slides[].image → Photo objects
   │     ctaBand.qrImage     → Graphic object
   │
   ├─ afterRead: populateBlocks
   │     ├─ featuredProjects   → SELECT projects  WHERE featured  LIMIT 3   ┐
   │     ├─ featuredCampaigns  → SELECT campaigns WHERE featured & active   │ all in
   │     ├─ testimonialCarousel→ SELECT testimonials ORDER BY -createdAt    │ parallel
   │     ├─ mediaGrid          → SELECT media-posts ORDER BY -publishDate   │ (Promise.all)
   │     └─ categoryGrid       → SELECT project-categories ORDER BY order   ┘
   │           each with overrideAccess:false → still no drafts leak
   │
   └─ Response: the complete homepage.
```

**The frontend makes ONE call.** Not six. The projects, campaigns, testimonials and news posts are
already inside `block.items`.

## 15.2 Section order — the editor's, not the code's

The current homepage (from the live database):

```
1. hero                 4. howYouCanHelp        7. ctaBand           10. testimonialCarousel
2. statsBar             5. featuredCampaigns    8. trustStrip
3. aboutStrip           6. featuredProjects     9. mediaGrid
```

**This order lives in the database, not in the code.** An editor can drag Testimonials to position 3
and it will render there. This is the entire point of the block system.

The frontend must therefore:

```tsx
{page.layout.map((block, i) => {
  switch (block.blockType) {
    case 'hero':             return <Hero key={i} {...block} />
    case 'statsBar':         return <StatsBar key={i} {...block} />
    case 'featuredProjects': return <FeaturedProjects key={i} projects={block.items} />
    // …
    default:                 return null   // ← unknown block renders nothing, does NOT crash
  }
})}
```

The `default: return null` matters. A block added in the CMS before the frontend supports it must not
take the site down.

## 15.3 What the header and footer need

Two more requests, both cacheable and shared across every page:

```
GET /api/globals/site-settings?depth=1   → logo, contact, registrations, social, announcement
GET /api/globals/navigation?depth=2      → header menu, footer columns
GET /api/project-categories?sort=order   → the mega-menu's 11 categories
```

---

# 16. API architecture

## 16.1 Payload generates the REST API

**No API code was written for content.** Defining a collection produces its endpoints:

```
GET    /api/projects                             list
GET    /api/projects/:id                         one
GET    /api/projects?where[featured][equals]=true filter
GET    /api/projects?sort=-publishDate&limit=3    sort + limit
POST   /api/projects                             create (auth)
PATCH  /api/projects/:id                         update (auth)
DELETE /api/projects/:id                         delete (auth)

GET    /api/globals/site-settings                a global
POST   /api/users/login                          auth
```

Plus GraphQL at `/api/graphql` (available, unused).

**`sort=-publishDate`** — the minus means descending.

## 16.2 REST vs the Local API

| | REST (`/api/*`) | Local API (`payload.find()`) |
|---|---|---|
| Transport | HTTP | **Direct database call** |
| Latency | network round-trip | none |
| CORS | applies | not applicable |
| Use from | a separate app, a browser | **inside the same Next.js app** |

The Local API is the whole point of embedding Payload in Next.js (spec §3):

```ts
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function HomePage() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    depth: 3,
  })
  return <PageRenderer page={docs[0]} />
}
```

**Same data. Same shape. No HTTP.** At build time, generating 200 static pages costs 200 database
queries rather than 200 HTTP requests to yourself.

## 16.3 Current state and the merge

Today the frontend is a **separate app** using `axios` against the REST API. This deviates from spec §2.

The plan (spec §2, §3):

```
NOW                                    AFTER MERGE
frontend app                           one Next.js app
   │ axios → HTTP → CORS                  │
   ▼                                      ▼
backend app  →  Postgres               getPayload() → Postgres
```

**The merge is small if the frontend is disciplined.** The frontend developer keeps all fetching
behind `src/services/*.ts`. At merge time only those 5–6 files change — `axios.get(...)` becomes
`payload.find(...)`. **Not one component is touched.**

An API contract has been issued to the frontend developer covering exact response shapes, the `depth=3`
requirement, the Photo/Graphic distinction, and `block.items`.

## 16.4 Caching and ISR — not built yet

Spec §3 requires on-demand revalidation:

```
Editor hits Publish
   → collection afterChange hook
   → POST /api/revalidate  (with REVALIDATE_TOKEN)
   → revalidateTag('projects')
   → Next.js regenerates the affected static pages
   → live in <10 seconds, no redeploy
```

**None of this exists.** No `afterChange` hooks, no `/api/revalidate` route, no `REVALIDATE_TOKEN`.
Until it does, published content will not appear on a statically-generated site. See
[§19](#19-remaining-work).

## 16.5 APIs still to be built (spec §7, §5.11)

```
POST /api/donate/initiate     create donation, generate PayU hash server-side
POST /api/donate/webhook      verify signature, idempotent, update status
GET  /api/donate/status       poll for the success page
POST /api/forms/submit        contact, volunteer, CSR, careers, newsletter
POST /api/revalidate          on-demand ISR
GET  /api/search              Postgres full-text search
GET  /api/health              uptime monitoring
```

---

# 17. Security

## 17.1 Authentication

`auth: true` on `Users` gives Payload-managed email/password auth: salted+hashed passwords, JWT
sessions in an httpOnly cookie, login-attempt lockout.

`PAYLOAD_SECRET` signs the JWTs. **It must never be committed.** It is in `.env`, which is git-ignored
(`.gitignore` line 41 — verified with `git check-ignore -v .env`).

## 17.2 Authorization

Three roles, enforced by [§6](#6-access-control). The two decisive properties:

1. **Access can return a query, not just a boolean.** `readPublished` filters drafts *in SQL*. There is
   no code path that leaks a draft.
2. **Field-level access exists.** `users.roles` (no self-promotion) and `campaigns.raisedAmount`
   (no faked progress bars) are protected individually, even where the document is writable.

## 17.3 JWT and `saveToJWT`

```ts
{ name: 'roles', saveToJWT: true }
```

The role is baked into the auth token. **Benefit:** no database lookup on every permission check.
**Cost:** changing someone's role requires them to **log out and log back in** — the old token still
carries the old role.

This is a deliberate performance/freshness trade-off, and it is the right one: roles change rarely,
permission checks happen constantly.

## 17.4 Validation and sanitisation

| Layer | What it does |
|---|---|
| `required` | Presence |
| `maxLength` | Length (checked **after** `singleLine` cleans the string) |
| `validate` | Format — URL, PAN, phone, internal path |
| `sanitizePlainText` | **Every** text field, stripped of newlines and repeated spaces |
| `clearHiddenFields` | Stale conditional data never reaches the database |
| Array-level `validate` | Cross-row rules (one highlighted amount; a dropdown must have links) |

**The principle behind all of it:**

> Whatever an editor *can* get wrong, they eventually *will*. `admin.condition` and `required` are UI
> conveniences. Hooks and validators are the actual wall.

## 17.5 Upload security

| Control | Where |
|---|---|
| MIME allow-list | `upload.mimeTypes` on each collection |
| Size cap (server) | `payload.config.ts` → `upload.limits.fileSize` |
| Size cap (per collection) | `enforceFileSize` hook |
| Minimum width | `Media` `beforeValidate` |
| Delete protection | `preventInUseDelete` |

> ### ⚠️ SVG is an XSS vector
> `graphics` accepts `image/svg+xml`, and an SVG can contain `<script>`. This is acceptable **today**
> because only authenticated editors can upload. It becomes a real vulnerability the moment any
> public-facing upload exists (e.g. a volunteer's CV). **Sanitise SVGs before that ships.**

## 17.6 Not built yet (spec §10)

- [ ] Security headers in `next.config.ts` — CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`,
      `Permissions-Policy`
- [ ] Rate limiting on `/api/*` (5/min/IP on forms and donations)
- [ ] Honeypot + time-trap anti-spam on forms
- [ ] Cloudflare WAF
- [ ] Donor PII handling: access restricted to finance/super-admin, never logged, deletion on request
      (**DPDP Act 2023**)
- [ ] `pnpm audit` in CI, Dependabot

---

# 18. Current progress

Weighted against the spec's own workstream estimates (§12), for **backend scope only**.

| Workstream | Spec estimate | Done | Notes |
|---|---|---|---|
| **A — Foundation** | 0.5 wk | 🟡 **40%** | DB ✅, env ✅, git ✅. **R2 storage ❌**, CI ❌ |
| **C — CMS models** | 2 wk | 🟢 **95%** | 12 collections ✅, 3 globals ✅, **19/20 blocks ✅** (only `DonateWidget` deferred), revalidation ❌, i18n ❌ |
| **E — Engagement** | ~1 wk (backend) | 🔴 **0%** | Forms, emails, search |
| **F — Donations** | **3 wk** | 🔴 **0%** | The largest single piece |
| **G — Hardening** | ~0.5 wk (backend) | 🔴 **10%** | SEO *fields* exist; sitemap/JSON-LD/headers/redirects do not |

**Backend total: roughly 7 weeks of work. About 2.15 weeks done — still call it 30–35%.**

**Read this the right way:** the CMS-modelling workstream (C) is nearly finished — completing it
moved the needle only slightly overall because it is not the biggest workstream. **Donations (F) is
3 of the remaining 7 weeks, untouched, and is what the overall percentage is actually waiting on.**
Reporting "block library complete" and "overall % roughly flat" are both true at once, and a manager
should hear both: real, verifiable progress on content tooling, with the honest reminder that the
largest and riskiest piece of work has not started.

By area:

| Area | % |
|---|---|
| CMS content models | 95% (19/20 spec blocks; only `DonateWidget` remains, by design) |
| Admin panel | 90% (generated; only role UX polish left) |
| Authentication & roles | 95% |
| REST API (content) | 100% (generated) |
| Upload pipeline | 85% (**local disk, not R2**) |
| SEO — data model | 90% |
| SEO — output (sitemap, JSON-LD, redirects) | 0% |
| Homepage data | 100% |
| Donations | 0% |
| Forms & search | 0% |
| Emails & webhooks | 0% |
| Hindi (i18n) | 0% |
| Deployment | 0% |
| Tests | 0% |

---

# 19. Remaining work

## 19.1 Blocking for any deployment

| # | Item | Why it blocks |
|---|---|---|
| 1 | **Cloudflare R2 storage adapter** | Vercel's filesystem is ephemeral. Every uploaded image disappears on deploy. |
| 2 | **Revalidation hooks + `/api/revalidate`** | Without it, published content never reaches a static site. |
| 3 | **Neon in a Mumbai/Singapore region** | `us-east-1` was unusable from India. It will hurt production TTFB too. |
| 4 | **Security headers in `next.config.ts`** | Currently the template default. Spec §10. |

## 19.2 Known bugs

| # | Bug | Detail |
|---|---|---|
| 1 | **`validatePhone` rejects landlines** | The live site publishes `0512-2220000`. It cannot be entered. Also `contact` has only one `phone` field but the org has two numbers. |
| 2 | **`clearHiddenNavFields` duplicates `clearHiddenFields`** | Migrate Navigation to the generic hook and delete the old one. |
| 3 | **ESLint is broken** | `Cannot find package '@eslint/eslintrc'`. `pnpm lint` does not run. |
| 4 | **`preventInUseDelete` paths are hand-maintained** | Add an upload field and forget to list it → silent hole in the protection. |
| 5 | **`package.json` still says "A blank template"** | Cosmetic, but it is the project description. |
| 6 | **`src/app/my-route/` is template debris** | Delete. |
| 7 | **`docker-compose.yml` is unused** | We use local Postgres. Delete or wire it up. |

## 19.3 Missing features, by spec section

### Donations (spec §7) — the biggest piece, 3 weeks

- [ ] `donations` collection (admin-only): donor details, amount, `frequency`, `subscriptionId`,
      campaign/project link, gateway IDs, `internalStatus`, `receiptNumber`, `receiptPdfUrl`, consent
- [ ] `subscriptions` collection: one row per active monthly donor, with a `cancelToken`
- [ ] `POST /api/donate/initiate` — zod validation, create the row, **generate the PayU hash
      server-side (the salt must never reach the client)**
- [ ] `POST /api/donate/webhook` — **verify the signature**, **be idempotent**, update status,
      log failures to Sentry
- [ ] `GET /api/donate/status` — for the success page to poll
- [ ] Recurring: PayU Standing Instructions / e-mandate (UPI Autopay + card SI). Razorpay
      Subscriptions as the documented fallback, behind one `PaymentGateway` interface.
- [ ] Receipt: **atomic** receipt number (`ODH/2026-27/0001`), PDF via `@react-pdf/renderer`, upload,
      email via Resend
- [ ] `campaigns.raisedAmount` updated by the webhook (the field access is already in place)
- [ ] Finance CSV export with a date-range filter
- [ ] Self-service cancellation via a signed token link
- [ ] Failed-charge handling: after 3 consecutive failures, mark `failed` and notify

> **The rule that governs all of this (spec §7):**
> **Payment truth comes only from the verified webhook. Never from the redirect URL.**

### Forms (spec §5.6, §5.8, §5.10)

- [ ] `form-submissions` collection — `formType`, `payload` (JSON), `sourcePage`, `resumeFile`
- [ ] `POST /api/forms/submit` — zod, honeypot, time-trap, rate limit
- [ ] Email notification per form type

### Search (spec §5.11)

- [ ] Postgres full-text search across projects, campaigns, media posts, pages
- [ ] `GET /api/search?q=` — ranked, with type badges and highlighted snippets
- [ ] Results page is `noindex`

### The block library (spec §6.2) — ✅ done, except one

`PageHeader` · `RichText` · `TeamGrid` · `Timeline` · `ImageGallery` · `VideoEmbed` · `FAQAccordion` ·
`FormBlock` · `MapContact` — all built, registered in `Pages.ts`, and verified against live content on
the About, CSR, Media and Volunteer pages (see [§11.5](#115-block-coverage-against-spec-6.2)).

**Only `DonateWidget` remains**, deliberately deferred — it depends on the `donations`/`subscriptions`
collections and the PayU API (Phase 3), so building it now would mean building it twice. Until then,
the Donate page is the one page in the spec that cannot yet be composed from blocks.

### SEO output (spec §8)

- [ ] `sitemap.ts`, `robots.ts`
- [ ] JSON-LD: `NGO`, `WebSite`+`SearchAction`, `BreadcrumbList`, `Article`, `FAQPage`, `JobPosting`
- [ ] `redirects` collection + old→new URL map (**crawl the old site first; skipping this loses all
      current rankings**)
- [ ] `opengraph-image.tsx`

### Hindi (spec §5.12)

- [ ] Payload field-level localization across all collections and globals
- [ ] `next-intl` routing, `/hi/…`
- [ ] `hreflang` alternates, both locales in the sitemap

### Ops (spec §11)

- [ ] GitHub Actions: typecheck, lint, build, Lighthouse CI on every PR
- [ ] Sentry
- [ ] Vercel deploy; `develop` → staging (noindex, basic-auth), `main` → production
- [ ] Weekly Postgres dump to R2; Neon PITR
- [ ] UptimeRobot on `/` and `/api/health`

---

# 20. Development roadmap

## Phase 1 — Unblock deployment (1 week)

The point of this phase is that **nothing else is safe to build on a foundation that cannot ship.**

| Task | Why first |
|---|---|
| Cloudflare R2 storage adapter | Every day without it is another day of images that will vanish |
| Revalidation hooks + `/api/revalidate` | Without it a static site never updates |
| Security headers in `next.config.ts` | Cheap, and easy to forget later |
| Fix `validatePhone` (landline) | A real bug against real data |
| Fix ESLint | CI cannot be built on a broken linter |
| Delete `my-route`, `docker-compose.yml`, fix `package.json` | Housekeeping |
| Deploy to Vercel + Neon (Mumbai/Singapore) → **staging** | Proves the whole chain works |

## Phase 2 — Complete the CMS (1 week)

| Task | Status |
|---|---|
| ~~The 9 missing blocks (§6.2)~~ — `TeamGrid`, `Timeline`, `ImageGallery`, `FAQAccordion`, `MapContact`, `FormBlock`, `RichText`, `PageHeader`, `VideoEmbed` | ✅ **Done** — plus `FeatureCards` (beyond spec). `DonateWidget` intentionally left for Phase 3. |
| `form-submissions` collection + `/api/forms/submit` + email | ⬜ Not started — `FormBlock.formType` is already shaped to match it |
| `redirects` collection | ⬜ Not started |
| Migrate Navigation to `clearHiddenFields`; delete `clearHiddenNavFields` | ⬜ Not started |

## Phase 3 — Donations (3 weeks) ★

The spec's own estimate. This is where the risk lives.

| Week | Work |
|---|---|
| 1 | `donations` + `subscriptions` collections. `PaymentGateway` interface. `/api/donate/initiate` with server-side hashing. |
| 2 | Webhook: signature verification, idempotency, status transitions. Receipt: atomic number, PDF, Resend email. `campaigns.raisedAmount` update. |
| 3 | Recurring mandates. Self-service cancellation. Failed-charge handling. Finance CSV export. Full test-card matrix. |

**Do not start this until the PayU merchant credentials exist** (spec Appendix C, item 2) and
**e-mandate is confirmed enabled** on the account (item 6) — the recurring flow depends on it.

## Phase 4 — Frontend merge + SEO + search (2 weeks)

| Task |
|---|
| Merge the frontend into this repo (spec §2) |
| Rewrite `services/*.ts` from axios → Local API |
| `sitemap.ts`, `robots.ts`, JSON-LD, `opengraph-image.tsx` |
| Postgres full-text search + `/api/search` |
| Old→new redirect map (crawl odhfoundation.org with Screaming Frog **first**) |

## Phase 5 — Hindi + hardening (2 weeks)

| Task |
|---|
| Payload localization + `next-intl` |
| Rate limiting, honeypot, WAF |
| Sentry, GA4, uptime monitoring |
| GitHub Actions CI + Lighthouse CI |
| Backups |

## Phase 6 — Content, UAT, launch (2 weeks)

Per spec §12 workstream H/I: the client loads all real content in both languages, admin training,
UAT fixes, then DNS cutover and one week of hypercare.

**Total: ~11 weeks from today**, which is consistent with the spec's 15–17 week single-developer
estimate given the ~2 weeks already done.

---

# 21. AI context

> **This section is written for an AI assistant (Claude, ChatGPT, Gemini) picking up this project.**
> Read it before touching any code.

## 21.1 What you are working on

A Payload CMS 3 backend for an Indian NGO. The controlling document is
`ODH-Foundation-Website-Technical-Implementation-Document.md` — **it is the spec, and it wins any
argument.** When it and this file disagree, follow the spec and fix this file.

## 21.2 The mental model

```
payload.config.ts   ← everything is registered here, wrapped in sanitizePlainText()
       │
       ├── collections/   things that exist many times   (12)
       ├── globals/       things that exist once          (3)
       ├── blocks/        page sections                  (19 of 20 required, +1 beyond spec)
       ├── access/        who can do what                 (1 file, used everywhere)
       ├── fields/        reusable field definitions
       └── hooks/         reusable behaviour
```

A collection **never** imports another collection. They link by slug string (`relationTo: 'projects'`).

## 21.3 Conventions — follow these exactly

| Thing | Convention | Example |
|---|---|---|
| Collection file | PascalCase, one per file | `src/collections/Projects.ts` |
| Collection slug | kebab-case, plural | `'project-categories'` |
| Block file | PascalCase | `src/blocks/FeaturedProjects.ts` |
| Block slug | camelCase | `'featuredProjects'` |
| Field name | camelCase | `heroImage`, `raisedAmount` |
| Field factory | a function, **always called** | `seoField()`, `slugField('title')` |
| Admin-facing text | **professional English**, always | `'Leave blank to use the excerpt.'` |
| Code comments | Hinglish is fine (the owner's preference) | `// Paise ka field — webhook isse update karta hai` |
| Errors shown to editors | `APIError`, never `Error` | see §8.8 |

## 21.4 Hard-won rules — violating these has already caused bugs

1. **Restart the dev server after adding any field.** Payload creates tables at boot, not on
   hot-reload. Hot-reloading a new array field produces `relation "x" does not exist`.

2. **`versions: { drafts: true }` + a field named `status` = enum collision.** Give it an explicit
   `enumName`. See [§9.7](#97-projects).

3. **`admin.condition` is UI only.** It does not clear the database and does not enforce `required`.
   Every conditional field needs a `beforeChange` hook *and* a parent-level `validate`. See
   [§8.6](#86-clearhiddenfieldsts--the-conditional-field-trap).

4. **Never attach `singleLine` to a field by hand.** `sanitizePlainText` does it for every text field
   automatically. Adding it manually is redundant; forgetting is impossible. To *exclude* a field, use
   `admin.custom.multiline: true`.

5. **Inside blocks and arrays, use `condition: (_, siblingData)`,** not `(data)`. `data` is the whole
   page.

6. **Local API bypasses access control by default.** When acting for a user, always pass
   `overrideAccess: false` **and** `user: req.user`. Forgetting leaks drafts.

7. **Thread `req` through nested Payload calls inside hooks** — otherwise they run in a separate
   transaction and atomicity is lost.

8. **Run `pnpm generate:types` after any field change.** `payload-types.ts` is generated. Never edit it.

9. **Photos have `sizes`; Graphics do not.** `graphic.sizes.card.url` throws.

10. **The homepage needs `depth=3`.** At the default depth, `ctaBand.qrImage` is a number, and the QR
    code silently disappears.

## 21.5 What NOT to do

- ❌ Do not duplicate collection data inside a block. Reference it and let `populateBlocks` resolve it.
- ❌ Do not hardcode section order on the frontend. The editor owns it.
- ❌ Do not trust client-side validation for money. The server rejects independently.
- ❌ Do not put presentation in the database (commas, `₹`, date formats). Store data; format on the
  frontend.
- ❌ Do not use `Error` for anything an editor will read. Use `APIError`.

## 21.6 Where to start

Read, in order:

1. `src/payload.config.ts` — everything is registered here
2. `src/access/index.ts` — the permission model, used by every collection
3. `src/collections/Projects.ts` — the most representative collection
4. `src/collections/Pages.ts` + `src/hooks/populateBlocks.ts` — the page builder, the most novel part
5. `src/fields/sanitizePlainText.ts` — the most important architectural decision

## 21.7 Current state, honestly

- ✅ Content layer is solid and verified
- ✅ **19 of 20 required blocks** exist (only `DonateWidget` deferred, on purpose — see §11.5)
- ⚠️ Uploads go to **local disk** — will break on Vercel
- ❌ Donations: nothing
- ❌ Revalidation: nothing — published content will not reach a static site
- ❌ Hindi: nothing
- ❌ Tests: nothing

---

# 22. Lessons learned

## 22.1 The bug is never the missing hook — it is that forgetting was possible

We attached `singleLine` to text fields by hand. We forgot five of them. The instinct is to add the
five and move on. That instinct is wrong: the sixth will also be forgotten.

The fix was `sanitizePlainText` — a config walker that makes forgetting **structurally impossible**.
The exception (postal addresses) is explicit and opt-out.

> **When you find yourself fixing the same class of bug twice, stop fixing instances and fix the
> class.**

## 22.2 `admin.condition` is a UI convenience, not a data guarantee

Three separate bugs, one root cause. Hiding a field in the browser does not clear the database and does
not enforce `required`.

> **The database does not know what the browser is showing.** Enforce data rules where the data lives.

## 22.3 Access control that returns a query beats access control that returns a boolean

`readPublished` does not check "is this a draft?" in application code. It returns a **query fragment**
that Postgres merges into the `WHERE` clause. There is no code path that leaks a draft — not because
we remembered to filter, but because filtering is not optional.

> **Prefer designs where the mistake cannot be made over designs where the mistake is caught.**

## 22.4 One collection, one purpose

Photos and Graphics are both "images", so putting them together felt natural. Their rules turned out
to be *opposites* — big vs small, WebP vs PNG, resize vs never-resize. In one collection the rules
fought, and an 80G badge was rejected by a rule meant for hero photography.

> **If two things need contradictory rules, they are not the same thing.**

## 22.5 The database is not a place to store presentation

`stats.value` is `48000`, a number. Not `"48,000+"`. The comma and the `+` are decisions about how a
number *looks*, and they belong to whoever is drawing it. Storing them means the count-up animation
cannot work, and Hindi formatting is impossible.

## 22.6 Version-history tables will surprise you

Changing `qrImage` from `relationTo: 'media'` to `relationTo: 'graphics'` broke the schema push — not
because of the live data, but because **draft-history rows** still held old media IDs, and the new
foreign key pointed at `graphics`.

The result was `payloadInitError: true` and one FK constraint silently missing. The app appeared to
work. It was half-migrated.

> **When you change a `relationTo`, the version tables (`_*_v`) hold stale references too. Check them.**

## 22.7 The message an editor reads is part of the product

`throw new Error(...)` shows *"Something went wrong"*. Editors then ask you what went wrong, and you
read the server log for them. `throw new APIError(msg, 400)` shows your message. Same effort, entirely
different experience.

## 22.8 Trade-offs we accepted, and would accept again

| Decision | Cost | Why it is still right |
|---|---|---|
| `saveToJWT: true` on roles | Role changes need a re-login | Roles change rarely; permission checks happen constantly |
| Local Postgres in dev, Neon in prod | Two environments to keep in sync | Neon from India made development unworkable |
| Backend resolves reference blocks | The hook runs on every page read | The frontend makes 1 request instead of 6 |
| `paragraphs[]` array instead of richText in AboutStrip | No bold/links in that section | The frontend gets a `string[]`, not a Lexical AST it must parse |

## 22.9 Future improvements

- **Derive `preventInUseDelete` paths from the config** instead of hand-maintaining them. Today,
  adding an upload field and forgetting to list it leaves a silent hole.
- **A `multilineTrim` hook** — keep newlines but trim each line. Today `multiline: true` disables all
  sanitisation, so an address can keep a stray leading space.
- **Extract the block-resolution rules from the `switch` in `populateBlocks`** into a declarative map,
  so adding a reference block is a data change rather than a code change.

## 22.10 Additive schema changes are free if the new fields are optional

`CTABand` shipped with 5 fields. Verifying it against the live frontend showed it needed 3 more
(`eyebrow`, `secondaryCta`, `trustBadges`) to match what About/CSR/Media pages actually render. The
fix was to add all three as **optional** fields to the existing block — not to version the block, not
to migrate existing `ctaBand` documents, not to touch the Home page's already-saved instance.

Every `ctaBand` block saved before the change stayed valid: Payload does not require a document to
populate a field that was added after it was created. The Home page's CTA band kept rendering exactly
as before, with the new fields simply absent.

> **A block/collection schema can always grow.** The only changes that require migration work are
> narrowing one (making an optional field required, removing a field with live data, renaming a field
> — see [§22.6](#226-version-history-tables-will-surprise-you)). Adding an optional field is not an
> architectural event; it does not need a plan, a flag, or a conversation about "breaking changes."

## 22.11 A generic page-builder and a collection-driven listing look identical in the admin — until you try to fill one in wrong

Building the `Media` page surfaced this directly: the instinct to put a `PageHeader` on it was
correct; the instinct to also put the news items in an `ImageGallery` block was not, and the mistake
was only visible once the block's fields (heading + images + caption) plainly could not express a
type badge, a date, or a description. See [§11.6](#116-generic-pages-vs-collection-driven-listings--a-rule-that-is-easy-to-get-backwards)
for the full rule.

> **A freely-reordered container (a `pages` block layout) and a fixed-shape repeatable item (a
> collection document) are not two flavours of the same thing.** The tell is whether each "item"
> needs its own URL, its own date, its own filterable type. If it does, it is a collection. Building
> it as a block first, then discovering the fields don't fit, is a slower way to arrive at the same
> answer — the check in §11.6 is meant to be run *before* building, not after.

---

*End of document. Keep it accurate — a documentation file that lies is worse than none.*
