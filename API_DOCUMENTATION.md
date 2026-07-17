# ODH Foundation — API Documentation

**Base URL (local):** `http://localhost:3000`
**Base URL (production):** `https://odhfoundation.org` (once deployed)
**Last verified:** 16 July 2026 — every endpoint below was hit directly against the running dev server and the actual HTTP status recorded, not assumed.

---

## 1. How authentication works

| Access level | How it's enforced |
|---|---|
| **Public** | No token needed. Anonymous requests only ever see *published* content — draft content is filtered out at the database query level and cannot leak through the API. |
| **Staff (logged in)** | `POST /api/users/login` returns a session cookie. Logged-in staff see drafts too. |
| **Role-gated** | `donations`, `subscriptions`, `users` collections require a logged-in `finance` or `super-admin` role. An unauthenticated or under-privileged request gets `403 Forbidden` — this is correct, expected behaviour, not a bug. |

---

## 2. Content Collections (auto-generated REST + GraphQL)

Every collection below gets the same 5 standard endpoints automatically — no custom code was written for these; Payload generates them from the collection's field definitions.

```
GET    /api/{collection}                 list (paginated, filterable, sortable)
GET    /api/{collection}/:id             one document
GET    /api/{collection}?where[x][equals]=y   filter
POST   /api/{collection}                 create (auth required)
PATCH  /api/{collection}/:id             update (auth required)
DELETE /api/{collection}/:id             delete (auth required)
```

| Collection | Purpose | Public read? | Verified status |
|---|---|---|---|
| `media` | Field photography (auto WebP + 4 sizes) | ✅ Yes | ✅ 200 |
| `graphics` | Logos, icons, QR codes (unmodified) | ✅ Yes | ✅ 200 |
| `documents` | PDFs — certificates, reports, receipts | ✅ Yes | ✅ 200 |
| `pages` | Page-builder — Home, About, CSR, Contact, etc. | ✅ Yes (published only) | ✅ 200 |
| `project-categories` | The 11 focus areas | ✅ Yes | ✅ 200 |
| `projects` | Field programmes | ✅ Yes (published only) | ✅ 200 |
| `team-members` | About page team grid | ✅ Yes (published only) | ✅ 200 |
| `testimonials` | Quote carousel | ✅ Yes (published only) | ✅ 200 |
| `campaigns` | Fundraising campaigns | ✅ Yes (published only) | ✅ 200 |
| `media-posts` | News / press / blog / gallery / video | ✅ Yes (published only) | ✅ 200 |
| `careers` | Job openings | ✅ Yes (published only) | ✅ 200 |
| `users` | Staff accounts (admin login) | ❌ No — `super-admin` only | ✅ 403 (correctly blocked) |
| `donations` | Every donation transaction | ❌ No — `finance`/`super-admin` only | ✅ 403 (correctly blocked) |
| `subscriptions` | Active monthly-donor mandates | ❌ No — `finance`/`super-admin` only | ✅ 403 (correctly blocked) |

**Example — fetch 3 featured projects:**
```
GET /api/projects?where[featured][equals]=true&limit=3
```

**GraphQL:** available at `POST /api/graphql`, verified reachable. Not currently used by the frontend (REST is the primary contract).

---

## 3. Globals (site-wide singletons)

Unlike collections, each of these returns **one object directly** (not a `{docs: [...]}` list).

| Global | Purpose | Verified status |
|---|---|---|
| `GET /api/globals/site-settings` | Logo, contact info, registration numbers, social links, announcement bar | ✅ 200 |
| `GET /api/globals/navigation` | Header menu + footer columns | ✅ 200 |
| `GET /api/globals/donation-settings` | Preset amounts, impact cards, receipt signatory, gateway mode | ✅ 200 |

---

## 4. Donation & Payment APIs (custom — hand-written, not auto-generated)

These are the only endpoints with custom business logic behind them. This is the core of the donation flow described in the technical spec §7: **payment truth comes only from the verified webhook, never from a redirect URL.**

### 4.1 `POST /api/donate/initiate`

Called when a donor submits the donate form. Validates input, creates a `donations` record (`status: initiated`), and returns the parameters needed to redirect the browser to PayU's hosted checkout.

**Request body:**
```json
{
  "donorName": "Test Donor",
  "email": "test@example.com",
  "phone": "9876543210",
  "amount": 500,
  "frequency": "one-time",
  "pan": "AAAAA9999A",
  "campaign": "<campaign id, optional>",
  "project": "<project id, optional>",
  "consent": { "termsAccepted": true, "contactPermission": false }
}
```

**Success response (verified `200`):**
```json
{
  "key": "",
  "txnid": "ODH61784203109032",
  "amount": "500.00",
  "productinfo": "ODH Foundation Donation",
  "firstname": "Test",
  "email": "test@example.com",
  "phone": "9876543210",
  "surl": "http://localhost:3000/donate/success",
  "furl": "http://localhost:3000/donate/failed",
  "hash": "<sha512 hash>",
  "payuBaseUrl": "https://test.payu.in/_payment"
}
```
> `key` is empty above because `PAYU_MERCHANT_KEY` is not yet set in `.env` — the merchant account is pending (see §6). Everything else — validation, donation-row creation, hash generation — is fully working.

**Invalid input (verified `400`):** missing/malformed fields are rejected individually with a field-by-field error list, e.g. `email: "Invalid email address"`.

### 4.2 `POST /api/donate/webhook`

PayU's server calls this directly (never the donor's browser) once a payment completes. **This is the only source of truth for whether a donation succeeded.**

- Verifies PayU's signature hash — an invalid/forged signature is rejected with `401` before anything is touched.
- Idempotent — calling it twice for the same transaction never double-processes it.
- On a verified success, triggers receipt generation, PDF, email, and (next) campaign total updates automatically.

**Verified (`401`)** with a deliberately invalid test signature — confirms the security check itself is working, not bypassable.

### 4.3 `GET /api/donate/status?txnid=...`

Polled by the donor-facing success page to confirm the donation actually went through (never trusts the redirect URL alone).

**Verified (`200`):**
```json
{ "status": "initiated", "amount": 500, "frequency": "one-time" }
```
Returns only a public-safe subset — never the donor's email, phone, PAN, or address.

**Missing `txnid` (verified `400`):** `{ "error": "txnid is required." }`

---

## 5. What happens automatically after a successful donation

Not a callable API, but part of the same system — triggered internally the moment a donation's status becomes `success`:

1. An atomic, sequential receipt number is generated (`ODH/2026-27/0001`, never duplicated even under concurrent donations).
2. An 80G donation receipt PDF is rendered (org details, donor details, amount in words, signatory, 80G clause) and stored.
3. The receipt is emailed to the donor (via Resend) with the PDF attached.
4. *(Next in progress)* The related campaign's raised-amount total is updated.

---

## 6. Known gaps — not yet live, by design

| Item | Status | Blocked on |
|---|---|---|
| Real PayU payments | Hash/flow built, untestable end-to-end | PayU merchant test credentials (not yet issued) |
| Real receipt emails | Code complete, currently logs a caught error | Resend account/API key (not yet created) |
| Recurring (monthly) donations, subscription cancellation | Not started | Comes after one-time flow is fully live |
| `campaign.raisedAmount` auto-update | Not started | Next immediate task |
| Contact/volunteer/CSR form submission API | Not started | Later workstream |
| Site search API | Not started | Later workstream |

---

*This document was generated by running real requests against the local dev server, not written from assumptions. Re-run the checks in `postman_collection.json` any time to reconfirm.*
