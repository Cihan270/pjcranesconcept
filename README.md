# PJ Cranes

Premium B2B website for [PJ Cranes B.V.](https://www.pj-cranes.com) — mobile crane trading from Nijkerk, the Netherlands.

## Stack

- Next.js App Router + TypeScript
- next-intl (`nl` default; `en` / `de` / `es` / `fr`)
- Tailwind CSS v4 + shadcn primitives (restyled)
- Zod + React Hook Form for lead forms
- Resend for outbound email (optional until configured)
- Mock inventory repository (swap for CRM/Supabase later)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — root redirects to `/nl`.

## Environment

Copy `.env.example` to `.env.local`:

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Resend API key. **Required for form success.** If missing, APIs log the CRM-shaped lead and return `503` with `email_not_configured` (never fake success). |
| `RESEND_FROM_EMAIL` | Verified sender, e.g. `PJ Cranes <leads@your-domain.com>`. Dev can use Resend’s `onboarding@resend.dev`. |
| `CONTACT_TO_EMAIL` | Inbox for lead notifications (defaults to `info@pj-cranes.com`). |
| `NEXT_PUBLIC_SITE_URL` | Canonical site origin for SEO/sitemap (e.g. `https://www.pj-cranes.com`). |

Lead endpoints: `POST /api/contact`, `/api/sell`, `/api/find`, `/api/newsletter`.

## Content policy

- Use verified company facts from `src/data/company.ts` (address, KvK, VAT, phones, contacts).
- No public prices; enquiry-only.
- No WhatsApp CTA until a number is explicitly confirmed.
- Soften unverified marketing claims (e.g. unnamed “global offices”).
- Privacy/terms copy must be reviewed by counsel before production launch.

## i18n notes

- `messages/nl.json` is the primary dictionary.
- `en` is filled professionally; `de` / `es` / `fr` mirror EN for newer namespaces (Contact / Sell / Find / About / Faq / Privacy / Terms / News / Services hub pages) until native copy is supplied — **TODO**: localize DE/ES/FR secondary-page and form strings.
- Terms body comes from `src/data/terms.ts` (NL + EN May 2025). Privacy draft lives in `src/data/privacy.ts` (NL + EN).

## Forms & CRM shape

Payloads follow `{ source, locale, type, payload, consent, meta }` via `toCrmEnvelope`. Sell-form file picker is UI-only: attachment **names** are emailed; files are not stored until storage (e.g. Supabase) is connected.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```
