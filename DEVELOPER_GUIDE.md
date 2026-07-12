# Developer Guide

> **Who this is for:** anyone about to write code in this repository — including you, six months from
> now, having forgotten all of it.
>
> **What this is:** conventions, recipes, and the traps. For *why* the architecture is the way it is,
> read [`ROADMAP.md`](./ROADMAP.md). For a briefing to hand an AI, read
> [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md).

---

## Table of contents

1. [Before you write anything](#1-before-you-write-anything)
2. [Conventions](#2-conventions)
3. [The ten rules](#3-the-ten-rules)
4. [Recipe: add a field to an existing collection](#4-recipe-add-a-field-to-an-existing-collection)
5. [Recipe: add a new collection](#5-recipe-add-a-new-collection)
6. [Recipe: add a new block](#6-recipe-add-a-new-block)
7. [Recipe: add a reference block](#7-recipe-add-a-reference-block)
8. [Recipe: add a conditional field](#8-recipe-add-a-conditional-field)
9. [Recipe: add a global](#9-recipe-add-a-global)
10. [Recipe: add an API route](#10-recipe-add-an-api-route)
11. [Working with the database](#11-working-with-the-database)
12. [Debugging](#12-debugging)
13. [Testing your change](#13-testing-your-change)
14. [Git workflow](#14-git-workflow)
15. [Code review checklist](#15-code-review-checklist)

---

# 1. Before you write anything

## 1.1 The daily loop

```bash
cd c:\Users\HP\Desktop\backend\odh-foundation-web

pnpm dev              # http://localhost:3000  · admin at /admin
pnpm generate:types   # after ANY field change — regenerates src/payload-types.ts
npx tsc --noEmit      # typecheck
```

## 1.2 The one thing that will waste your afternoon

**Payload creates database tables at boot, not on hot-reload.**

Add a field → hot-reload updates the code → the database has no column for it → you get:

```
relation "projects_impact_stats" does not exist
column "seo_meta_title" does not exist
```

**Restart the dev server after any schema change.** Every time. There is no exception.

## 1.3 The environment

`.env` (never committed — verified git-ignored at `.gitignore:41`):

```bash
DATABASE_URL=postgres://postgres:1234@127.0.0.1:5432/odh-foundation-web
PAYLOAD_SECRET=<64-char hex>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`PAYLOAD_SECRET` signs the auth JWTs. Changing it logs everyone out. It does **not** invalidate
passwords (those are salted and hashed per user).

---

# 2. Conventions

| Thing | Convention | Example |
|---|---|---|
| Collection file | PascalCase, one collection per file | `src/collections/Projects.ts` |
| Collection slug | kebab-case, plural | `'project-categories'` |
| Block file | PascalCase | `src/blocks/FeaturedProjects.ts` |
| Block slug | camelCase | `'featuredProjects'` |
| Global file | PascalCase | `src/globals/SiteSettings.ts` |
| Global slug | kebab-case | `'site-settings'` |
| Field name | camelCase | `heroImage`, `raisedAmount` |
| Field factory | a function — **always called** | `seoField()`, `slugField('title')` |
| Hook file | camelCase, named for what it does | `preventInUseDelete.ts` |

## 2.1 Language

| Where | Language |
|---|---|
| **Anything an editor sees** — labels, descriptions, error messages, select options | **Professional English.** Always. |
| Code comments | Hinglish is fine — the owner's preference |

```ts
// ✅ Editor-facing: English
admin: { description: 'Leave blank to use the excerpt.' }

// ✅ Code comment: Hinglish is fine
// Paise ka field — donation webhook isse update karta hai
```

## 2.2 Errors an editor will read

```ts
import { APIError } from 'payload'

throw new APIError('This image is only 347px wide. Photos must be at least 1200px wide.', 400)
```

**Never `throw new Error(...)`** for anything a human will read. Payload treats a plain `Error` as an
unexpected crash and shows *"Something went wrong"*, hiding your message. `APIError` shows it.

## 2.3 A collection never imports another collection

Link by slug string, not by import:

```ts
{ name: 'category', type: 'relationship', relationTo: 'project-categories' }
```

This keeps the dependency graph flat and avoids circular imports. TypeScript still checks the slug —
if the collection does not exist, it will not compile.

---

# 3. The ten rules

Each one is here because breaking it caused a real bug in this codebase.

| # | Rule |
|---|---|
| 1 | **Restart the dev server after any field change.** Tables are created at boot. |
| 2 | **`versions: { drafts: true }` + a field named `status` = enum collision.** Give it an `enumName`. |
| 3 | **`admin.condition` is UI only.** It does not clear the DB, and does not enforce `required`. |
| 4 | **Never attach `singleLine` by hand.** `sanitizePlainText` does it for every text field. |
| 5 | **Inside blocks and arrays, use `condition: (_, siblingData)`,** not `(data)`. |
| 6 | **The Local API bypasses access control** unless you pass `overrideAccess: false`. |
| 7 | **Thread `req`** through nested Payload calls in hooks, or you lose transaction atomicity. |
| 8 | **Run `pnpm generate:types`** after any field change. Never edit `payload-types.ts`. |
| 9 | **Photos have `sizes`. Graphics do not.** |
| 10 | **The homepage needs `depth=3`,** or `ctaBand.qrImage` silently comes back as a number. |

Full explanations: [`PROJECT_CONTEXT.md` §6](./PROJECT_CONTEXT.md#6-hard-rules--each-one-exists-because-it-was-violated-and-caused-a-bug).

---

# 4. Recipe: add a field to an existing collection

## Steps

```ts
// 1. Add the field
{
  name: 'videoUrl',
  type: 'text',
  label: 'Video URL',                 // shown in the admin panel
  validate: validateUrl,              // format check — reuse from fields/validators.ts
  admin: {
    description: 'Full YouTube link.', // English
  },
},
```

```bash
# 2. Restart the dev server        ← the table/column is created here
# 3. pnpm generate:types           ← payload-types.ts picks up the new field
```

4. Open `/admin`, check the field appears, and **try to break it**. Enter a bad value. Does the
   validation message make sense to someone who is not you?

## Ask yourself

- **Is it a plain text field?** Then `sanitizePlainText` is already stripping newlines from it. Do
  nothing.
- **Does it genuinely need newlines** (a postal address)? Opt out:
  ```ts
  admin: { custom: { multiline: true } }
  ```
- **Is it money, or otherwise sensitive?** Add field-level access:
  ```ts
  access: { update: isFinanceField }
  ```
- **Is it an upload?** Decide: **Photo** (`media` — big, WebP, has `sizes`) or **Graphic**
  (`graphics` — small logo/icon, no resize). Getting this wrong means the 1200px minimum rejects a
  logo. Then **add its path to `preventInUseDelete.ts`** — see §4.1.
- **Does it need a `maxLength`?** If it feeds a meta description, 160. A meta title, 60.

## 4.1 ⚠️ If you added an upload field, you MUST update `preventInUseDelete.ts`

The lists in `src/hooks/preventInUseDelete.ts` are **hand-maintained**. Forget to add your field and
an editor can delete an image that is still in use — silently breaking the live site.

```ts
const MEDIA_USAGE: Usage[] = [
  {
    collection: 'projects',
    fields: ['heroImage', 'seo.ogImage', 'gallery.image', 'partners.logo'],
    //                                                     ^^^^^^^^^^^^^^ add yours here
    label: 'Project',
  },
]
```

Paths use dot notation and reach into arrays and blocks: `layout.slides.image`,
`layout.options.icon`.

> This is the weakest part of the design and is flagged as future work. Until it is fixed, this step
> is on you.

---

# 5. Recipe: add a new collection

## Template

```ts
import type { CollectionConfig } from 'payload'
import { isEditor, readPublished } from '../access'
import { slugField } from '../fields/slug'
import { seoField } from '../fields/seo'

export const Partners: CollectionConfig = {
  slug: 'partners',                 // kebab-case, plural
  labels: {
    singular: 'Partner',
    plural: 'Partners',
  },
  admin: {
    useAsTitle: 'name',             // what shows in relationship dropdowns
    defaultColumns: ['name', 'type'],
    group: 'Content',               // groups it in the admin sidebar
  },
  access: {
    read: readPublished,            // public sees published; staff see drafts
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  versions: { drafts: true },       // gives you Save Draft / Publish
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),              // only if it has its own URL
    { name: 'logo', type: 'upload', relationTo: 'graphics' },
    seoField(),                     // only if it has its own URL
  ],
}
```

## Register it

```ts
// src/payload.config.ts
import { Partners } from './collections/Partners'

collections: [
  Users, Media, Graphics, Documents, Pages,
  ProjectCategories, Projects,
  TeamMembers,      // ← must come BEFORE MediaPosts (author relation)
  Testimonials, Campaigns, MediaPosts, Careers,
  Partners,         // ← new
],
```

**Order matters.** If collection A relates to collection B, B must be registered first.

## Then

```bash
# restart the dev server     ← the tables are created
pnpm generate:types
```

## Decisions to make consciously

| Question | Guidance |
|---|---|
| **Does it have its own URL?** | Yes → add `slugField()` **and** `seoField()`. No (like testimonials) → neither. |
| **Drafts?** | Yes for anything the public sees. No for internal records (donations, form submissions). |
| **Who can read it?** | Public content → `readPublished`. Internal → `isFinance` or `isSuperAdmin`. |
| **A field named `status`?** | You need an `enumName`. See §5.1. |

## 5.1 ⚠️ The `status` + drafts collision

```ts
versions: { drafts: true },   // this adds an internal `_status` field
fields: [
  {
    name: 'status',                                    // ← collides!
    type: 'select',
    enumName: 'enum_partners_partner_status',          // ← the fix
    options: [ … ],
  },
]
```

**Why:** the Postgres adapter names enums `enum_<table>_<column>`. Payload's internal `_status`
produces `enum_partners_status`, and so would your `status`. Same name, different values, and the
schema push fails:

```
Caused by: invalid input value for enum enum_partners_status: "active"
```

`enumName` only changes the **database** name. The API still returns `status`.

---

# 6. Recipe: add a block (content block)

A **content block** holds its own data — a hero headline, a stats row.

```ts
// src/blocks/FeatureGrid.ts
import type { Block } from 'payload'

export const FeatureGrid: Block = {
  slug: 'featureGrid',              // camelCase — this becomes `blockType` in the API
  labels: {
    singular: 'Feature Grid',
    plural: 'Feature Grids',
  },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'features',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 4,                   // enforce the spec's limits in code, not in a comment
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'icon', type: 'upload', relationTo: 'graphics' },
      ],
    },
  ],
}
```

Register it in `src/collections/Pages.ts`:

```ts
import { FeatureGrid } from '../blocks/FeatureGrid'

{
  name: 'layout',
  type: 'blocks',
  blocks: [ Hero, StatsBar, AboutStrip, /* … */ FeatureGrid ],
}
```

**The order of this array is the order of the "Add Block" dropdown** in the admin. Put it where an
editor would look for it.

## Then tell the frontend

```tsx
case 'featureGrid': return <FeatureGrid key={i} {...block} />
```

## Notes

- **No `hooks: { beforeValidate: [singleLine] }`.** `sanitizePlainText` walks into blocks
  automatically.
- **Store data, not presentation.** `value: 48000`, not `"48,000+"`. The comma and the `+` are the
  frontend's decision — and a count-up animation needs a real number.
- **Enforce spec limits with `minRows`/`maxRows`.** `Hero` has `maxRows: 3` because spec §5.1 says
  *"Rotating (max 3)"*. Payload will refuse a fourth slide. A comment would not.

---

# 7. Recipe: add a reference block

A **reference block** shows data that lives in a **collection**. It must not copy that data.

## The mistake to avoid

```ts
// ❌ NEVER — this duplicates the projects collection inside the block
{ name: 'projects', type: 'array', fields: [
    { name: 'title', type: 'text' },      // already exists in `projects`
    { name: 'image', type: 'upload' },    // here too?!
]}
```

Now a project's title lives in two places. Edit it once and the homepage shows the old one.

## The pattern

```ts
// src/blocks/FeaturedPartners.ts
import type { Block } from 'payload'
import { resolvedItems } from '../fields/resolvedItems'

export const FeaturedPartners: Block = {
  slug: 'featuredPartners',
  labels: { singular: 'Featured Partners', plural: 'Featured Partners Blocks' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Our Partners' },
    { name: 'subheading', type: 'textarea' },
    {
      name: 'mode',
      type: 'select',
      required: true,
      defaultValue: 'auto',
      label: 'How to choose partners',
      options: [
        { label: 'Automatically — show partners marked as Featured', value: 'auto' },
        { label: 'Manually — I will pick the partners', value: 'manual' },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
      min: 1,
      max: 12,
      admin: {
        condition: (_, siblingData) => siblingData?.mode === 'auto',   // ← siblingData!
      },
    },
    {
      name: 'partners',
      type: 'relationship',
      relationTo: 'partners',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.mode === 'manual',
      },
    },
    resolvedItems('partners'),      // ← the virtual `items` field the frontend reads
  ],
}
```

## Then teach `populateBlocks` how to resolve it

```ts
// src/hooks/populateBlocks.ts
case 'featuredPartners':
  block.items = block.mode === 'manual'
    ? manualSelection(block.partners)
    : await query({
        req,
        collection: 'partners',
        where: { featured: { equals: true } },
        limit: clampLimit(block.limit),
        sort: '-createdAt',
      })
  break
```

You must also add `'partners'` to the `ResolvableCollection` union at the top of that file.

## Why `resolvedItems` is `virtual: true`

It has **no database column**. The hook fills it on read.

If it wrote into the real `partners` field instead, an editor opening the page and pressing Save would
persist the auto-selected partners into the *manual selection* field — silently converting the block
from automatic to manual. A virtual field cannot be written back.

**Bonus:** the frontend reads `block.items` for every reference block, auto or manual. One field, one
code path.

---

# 8. Recipe: add a conditional field

A field that only appears when another field has a certain value.

## ⚠️ `admin.condition` alone is NOT enough

It hides the field **in the browser**. It does **not**:
- delete the value from the database
- enforce `required` on a hidden field

So an editor sets type → `Video`, fills `videoUrl`, then switches to `News`. The UI hides the field.
**The database still has the URL**, and the frontend may render a video player on a news article.

This has bitten this project **three times**.

## The complete pattern — three parts

### Part 1 — the condition (UI)

```ts
{
  name: 'videoUrl',
  type: 'text',
  validate: validateUrl,
  admin: {
    condition: (data) => data?.type === 'video',    // top level → `data` is correct here
  },
}
```

Inside a **block or array**, use `siblingData` instead:

```ts
condition: (_, siblingData) => siblingData?.mode === 'auto'
```

### Part 2 — clear stale data (`beforeChange`)

```ts
import { clearHiddenFields } from '../hooks/clearHiddenFields'

type MediaPostData = { type?: string }

hooks: {
  beforeChange: [
    clearHiddenFields<MediaPostData>(
      {
        galleryImages: (d) => d.type === 'gallery',
        videoUrl:      (d) => d.type === 'video',
        externalUrl:   (d) => d.type === 'press',
      },
      { galleryImages: [] },   // arrays empty to []; everything else defaults to null
    ),
  ],
}
```

**Never write `undefined`.** Payload reads `undefined` as *"field not sent, keep the old value"* —
the exact opposite of what you want.

### Part 3 — validate at the parent level

`required` does not apply to a hidden field, so a "Dropdown" menu item could be saved with **zero
links**. Validate on the **array**, where you can see both the style and its data:

```ts
const headerItemsAreComplete: Validate = (value) => {
  if (!Array.isArray(value)) return true

  const problems: string[] = []

  value.forEach((item, i) => {
    const name = item.label?.trim() || `Item ${i + 1}`

    if (item.style === 'dropdown' && (item.children ?? []).length === 0) {
      problems.push(`"${name}" is a dropdown but has no links.`)
    }
    if (item.style === 'megaMenu' && !item.featuredProject) {
      problems.push(`"${name}" is a mega-menu but has no featured project.`)
    }
  })

  return problems.length > 0 ? problems.join(' ') : true
}

// then:
{ name: 'headerItems', type: 'array', validate: headerItemsAreComplete, fields: [ … ] }
```

## The general principle

> **Validate at the level where the information exists.**
>
> A single row cannot know whether *another* row is also marked "most popular". A single field cannot
> know whether its sibling `style` field makes it required. Move the check up.

---

# 9. Recipe: add a global

Use a global when there is **exactly one** of something — one footer, one set of site settings.

```ts
import type { GlobalConfig } from 'payload'
import { isPublic, isSuperAdmin } from '../access'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: {
    group: 'Settings',
    description: 'Shown at the bottom of every page.',
  },
  access: {
    read: isPublic,
    update: isSuperAdmin,       // or isEditor, if it is content rather than settings
  },
  fields: [ … ],
}
```

Register in `payload.config.ts` under `globals: [ ... ]`.

## Choosing the update access

| The global holds | Access |
|---|---|
| Settings — registration numbers, GA4 ID, payment gateway mode | `isSuperAdmin` |
| Content — menus, footer links | `isEditor` |

Spec §6.1: *"editor: all content, **no** donations/users/**settings**"*.

## When NOT to use a global

**If you might ever want a second one.** Converting a global to a collection later is a migration.
When in doubt, use a collection.

## Use `tabs` once you have more than ~8 fields

```ts
fields: [
  {
    type: 'tabs',
    tabs: [
      { label: 'Brand',   fields: [ … ] },
      { label: 'Contact', fields: [ … ] },
    ],
  },
]
```

Tabs are **UI only** — they do not appear in the API. Fields come back at the top level.

---

# 10. Recipe: add an API route

For anything Payload does not generate — donations, forms, search, revalidation.

```ts
// src/app/(payload)/api/donate/initiate/route.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'

const schema = z.object({
  amount: z.number().int().min(100),        // ← server-side. NEVER trust the client.
  email: z.string().email(),
  name: z.string().min(1).max(200),
})

export async function POST(request: Request) {
  const body = await request.json()

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  // Re-read the minimum from the CMS — do not trust a number the client sent
  const settings = await payload.findGlobal({ slug: 'donation-settings' })
  if (parsed.data.amount < settings.minAmount) {
    return Response.json({ error: 'Amount below minimum' }, { status: 400 })
  }

  // …create the donation row, generate the gateway hash SERVER-SIDE
}
```

## Rules for API routes

1. **Validate with zod. Always.** The client can send anything.
2. **Never trust a value the client sent that the server can look up itself** — amounts, prices,
   minimums, IDs of things they should not access.
3. **Secrets never leave the server.** The PayU salt is used to compute a hash *on the server*. It is
   never sent to the browser, not even in an "internal" response.
4. **Webhooks must be idempotent.** Gateways retry. Receiving the same event twice must not create two
   donations or send two receipts.
5. **Payment truth comes only from the verified webhook** (spec §7) — never from the redirect URL a
   browser lands on. A user can craft that URL.

---

# 11. Working with the database

## Inspecting

```powershell
$env:PGPASSWORD='1234'
$psql = 'C:\Program Files\PostgreSQL\17\bin\psql.exe'

& $psql -U postgres -h 127.0.0.1 -d "odh-foundation-web" -c "\dt"              # tables
& $psql -U postgres -h 127.0.0.1 -d "odh-foundation-web" -c "\d projects"      # one table
& $psql -U postgres -h 127.0.0.1 -d "odh-foundation-web" -c "SELECT id, title, _status FROM projects;"
```

Listing enums (useful when debugging an enum collision):

```sql
SELECT t.typname, string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) AS values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
GROUP BY t.typname
ORDER BY t.typname;
```

## How Payload maps to Postgres

| Payload | Postgres |
|---|---|
| A collection | A table |
| `type: 'group'` | Columns prefixed with the group name — `seo_meta_title` |
| `type: 'array'` | **A separate table** — `projects_impact_stats` |
| `hasMany: true` | **A separate table** — `users_roles` |
| `type: 'blocks'` | **One table per block type** — `pages_blocks_hero` |
| `versions: { drafts: true }` | **A shadow table** — `_projects_v` |
| `virtual: true` | **No column at all** |

This is why 12 collections produce **91 tables**, and why a schema change needs a restart.

## ⚠️ When a schema push fails halfway

If the dev server logs `payloadInitError: true` and a `Failed query`, the database may be **half
migrated** — some tables created, a constraint missing. The app appears to work but is broken.

**This happened when `qrImage` changed from `relationTo: 'media'` to `relationTo: 'graphics'`.** The
live data was fine; the **draft-history tables** (`_pages_v_*`) still held old media IDs, and the new
foreign key pointed at `graphics`.

Diagnosing:

```sql
-- Find rows pointing at an id that no longer exists in the target table
SELECT * FROM _pages_v_blocks_cta_band
WHERE qr_image_id IS NOT NULL
  AND qr_image_id NOT IN (SELECT id FROM graphics);

-- Which foreign keys exist against `graphics`?
SELECT conrelid::regclass, conname
FROM pg_constraint
WHERE confrelid = 'graphics'::regclass;
```

Fixing (development only — never run blind against production):

```sql
UPDATE _pages_v_blocks_cta_band
SET qr_image_id = NULL
WHERE qr_image_id IS NOT NULL
  AND qr_image_id NOT IN (SELECT id FROM graphics);
```

Then restart. Payload will add the missing constraint.

> **The lesson: when you change a `relationTo`, the version tables hold stale references too.**

---

# 12. Debugging

## Read the `Caused by:` line

A Payload/Postgres error has two parts. The long `Failed query: CREATE TABLE …` is context. The real
reason is underneath:

```
Failed query: CREATE TABLE "projects" ( … "status" "enum_projects_status" DEFAULT 'ongoing' … )
Caused by: invalid input value for enum enum_projects_status: "ongoing"
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ← this is the bug
```

## Common errors and what they actually mean

| Error | Cause | Fix |
|---|---|---|
| `relation "x" does not exist` | Added a field, did not restart | Restart the dev server |
| `column "seo_meta_title" does not exist` | Same | Restart |
| `invalid input value for enum enum_x_status` | A `status` field colliding with drafts' `_status` | Add `enumName` |
| `Cannot find module '../fields/seo'` | File not created, or a typo in the path | Check the path |
| Field missing from the admin panel | `seoField` written without `()` | It is a **function**. Call it. |
| A collection missing from the sidebar | Either not registered in `payload.config.ts`, **or your role has no `read` access** | Check both |
| *"Something went wrong"* instead of your message | You used `Error` | Use `APIError` |
| API returns a stale/old value | You clicked **Save Draft**, not **Publish** | `readPublished` only returns published docs |

## The `updatedAt` trick

If a change is not showing up in the API, look at `updatedAt` in the response. If it is old, **the
document was never saved** — probably Save Draft instead of Publish. This is the fastest way to tell
"my code is broken" from "I did not actually save it".

## Locked out of a collection

If a collection disappears from the admin sidebar, your user probably lacks `read` access. Payload
hides what you cannot read.

Check your roles:

```sql
SELECT u.email, r.value FROM users u JOIN users_roles r ON r.parent_id = u.id;
```

Grant super-admin directly (`order` is a reserved SQL word — it needs the quotes):

```sql
INSERT INTO users_roles ("order", parent_id, value) VALUES (0, 1, 'super-admin');
```

**Then log out and log back in.** `roles` has `saveToJWT: true` — your old cookie still says "no roles".

---

# 13. Testing your change

There is no automated test suite yet. Until there is, do this manually — in this order.

## 1. Typecheck

```bash
npx tsc --noEmit
```

## 2. Restart and watch the boot log

```bash
pnpm dev
```

Look for `payloadInitError` or `Failed query`. **A silent half-migration is worse than a crash** — the
app will appear to work.

## 3. Exercise it in the admin panel

Do not just check the happy path. **Try to break it:**

- Leave a required field empty → does it stop you?
- Enter a bad URL / PAN / phone → is the message useful to someone who is not you?
- Paste multi-line text into a text field → does the newline get stripped?
- Switch a conditional field's controlling value → does the stale data get cleared?
- Exceed `maxRows` → does it refuse?

## 4. Check the raw API

```
http://localhost:3000/api/projects?limit=1&depth=2
```

Read the JSON. This is where bugs hide that the admin panel makes invisible:

- Is `heroImage` an object, or a bare number? (a `depth` problem)
- Are `sizes.hero`, `sizes.card` present, or `null`? (the image was too small)
- Is there a `\n` in any string? (sanitisation missed it)
- Are stale conditional fields still populated?

## 5. Write a throwaway script for anything subtle

```ts
// verify.ts (in the project root; delete when done)
import 'dotenv/config'
import { getPayload } from 'payload'
import config from './src/payload.config.js'

const run = async () => {
  const payload = await getPayload({ config })
  const doc = await payload.create({
    collection: 'testimonials',
    data: { quote: 'Line one.\nLine two.', name: 'test', role: 'test' },
  })
  console.log(JSON.stringify(doc.quote))     // expect no \n
  await payload.delete({ collection: 'testimonials', id: doc.id })
}

run()
```

```bash
npx tsx verify.ts
```

This is how `sanitizePlainText` was verified — against three fields that never had a manual hook. Do
not trust "it should work". Make it prove it.

---

# 14. Git workflow

Spec §2.1:

```
main       ← production. Always deployable.
develop    ← staging. Where work is integrated.
feature/*  ← your work, alone.
```

```bash
git checkout -b feature/donations
# … work, commit …
git push origin feature/donations
# open a PR → review → merge
```

## Commit messages — conventional commits

```
feat: add donations collection and PayU initiate route
fix: reject landline numbers in validatePhone
docs: document the enumName collision
refactor: replace clearHiddenNavFields with the generic hook
```

## ⚠️ Never commit `.env`

It holds `DATABASE_URL` and `PAYLOAD_SECRET`. It is git-ignored (`.gitignore:41`). Before your first
push on a new machine, verify:

```bash
git check-ignore -v .env
# expect: .gitignore:41:.env    .env
```

If that prints **nothing**, stop. `.env` is not ignored, and a push would put your database password
and JWT secret in the repository history — where deleting the file later does **not** remove them.

---

# 15. Code review checklist

Before opening a PR:

## Correctness

- [ ] `npx tsc --noEmit` is clean
- [ ] Dev server boots with **no** `payloadInitError` and no `Failed query`
- [ ] `pnpm generate:types` was run and `payload-types.ts` is committed
- [ ] Tried to break it in the admin panel — bad input is rejected with a **useful** message
- [ ] Checked the **raw API response**, not just the admin UI

## The traps

- [ ] Added a field named `status` alongside drafts? → has an `enumName`
- [ ] Added a conditional field? → has `clearHiddenFields` **and** a parent-level `validate`
- [ ] Added an upload field? → **its path is in `preventInUseDelete.ts`**
- [ ] Used `condition` inside a block/array? → uses `siblingData`, not `data`
- [ ] Called Payload from inside a hook? → passes `req` **and** `overrideAccess: false`
- [ ] Added an upload? → chose `media` (photo) vs `graphics` (logo/icon) deliberately

## Craft

- [ ] Editor-facing text is **professional English**
- [ ] Errors an editor reads use `APIError`, not `Error`
- [ ] No `singleLine` attached by hand (`sanitizePlainText` handles it)
- [ ] No collection data duplicated inside a block — reference it
- [ ] No presentation in the database (no commas, no `₹`, no formatted dates)
- [ ] Spec limits enforced in code (`maxRows`, `maxLength`), not in a comment

## Docs

- [ ] A new architectural decision? → add it to `ROADMAP.md`
- [ ] A new rule learned the hard way? → add it to `PROJECT_CONTEXT.md` §6 and §3 here
- [ ] A new API endpoint? → tell the frontend developer

---

## One last thing

> **A documentation file that lies is worse than no documentation.**

If you change something these files describe, change the files. It takes two minutes now and saves an
afternoon in six months.
