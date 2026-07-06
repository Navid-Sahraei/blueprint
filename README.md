# Blueprint

An interactive, subscription-based web app for annual life and goal planning.
Five layers — values, goals, bold moves, execution, review — built from
eleven methods that each cite the research or named practitioner framework
behind them. See `docs/` for the design brief; the full product spec lives
with the founder.

**Status:** all eleven method modules are built and interactive, plus a
cross-module dashboard. The app runs entirely local-first (browser
localStorage) — there are no real user accounts yet. See "What's not done"
below.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** + shadcn-style components (copied in, `src/components/ui`)
- **Supabase** (Postgres + Auth + RLS) — schema in `supabase/migrations`,
  written and migration-tested, not yet connected to a live project
- **Stripe** (subscriptions — not yet wired)
- Fonts self-hosted via Fontsource: IBM Plex Mono (display/measurements) +
  Inter Variable (body)

## Development

```bash
pnpm install
cp .env.example .env.local   # fill in Supabase keys (optional at first)
pnpm dev
```

Auth is currently disabled on purpose (`AUTH_REQUIRED = false` in
`src/lib/flags.ts`) so the app can be used and tested without signing in —
`/app` routes stay open, and `/signup` shows a "closed for now" notice with
the real form intact in `src/components/auth-form.tsx`. Every module's data
lives in that browser's localStorage; nothing syncs across devices yet.

To try the database schema, apply the migrations in `supabase/migrations/`
(0001 through 0004, in order) to a Supabase project's SQL editor.

## Structure

```
src/app/                public pages (/, /pricing, /methods, /methods/[slug])
src/app/app/            authenticated shell — dashboard + all 11 modules
src/components/dashboard/  the three-band dashboard (This week / Year so
                        far / Not yet active) and its active-modules logic
src/lib/methods.ts      the 11-method content model with citations
src/lib/<module>/       each module's local-first data layer (types, store,
                        hook) — shapes match the Supabase tables 1:1
src/lib/ics.ts          dependency-free .ics generation for "Add to
                        calendar" buttons (Misogi, Adventures, Review)
src/components/ui/      shadcn-style primitives
supabase/               SQL migrations (all module tables + RLS)
docs/                   design brief
```

## The modules

Values Compass, Life Design / Odyssey Plan, Annual Goals / OKRs, Misogi OS,
Adventure Ledger, Deep Work & Time Blocking, Mental Contrasting (built on the
`woop` route/tables — the method's generic scientific name is used in the UI
to avoid trading on Gabriele Oettingen's WOOP branding), Habit Foundry,
Deliberate Practice Tracker, Annual / Quarterly Review, Gratitude Practice.

## Content standards (binding)

Every scientific claim in user-facing copy carries a real citation (author,
year, publication). Practitioner books are labeled as books, never passed off
as studies. Known controversies — the 21-day habit myth, the 10,000-hour
rule, gratitude effect sizes — are stated plainly in the UI, not smoothed
over. See `src/lib/methods.ts` for the canonical sources list. Landing-page
and method copy is final-draft, not locked — the founder may send revised
wording after running it through an AI-detection pass.

## What's not done

- **Live Supabase connection.** Every module's store already matches its
  table shape (`get`/`replace`/`subscribe`), so swapping localStorage for
  real queries is a read/write-internals change, not a redesign. Re-enabling
  the auth gate (`AUTH_REQUIRED` in `src/lib/flags.ts`, plus `src/proxy.ts`)
  goes with it.
- **Stripe billing** (checkout, webhooks, tier gating). Pricing is
  presentation-only right now — a single $79/year price, no enforcement.
- **Onboarding flow** (forced values sort → module picker before the
  dashboard) and **quarterly nudge emails**.
- **Data export** (CSV/JSON) for module data.
- **Live calendar sync** (Google/Apple OAuth) — the `.ics` download is the
  interim solution and is shipped.
- **Notion template and printable PDF planner** — separate projects; the app
  only links to them (currently placeholder anchors in the footer and
  pricing page).
- **Localization** (Persian/Italian) and a **team/coach tier**.
- A **formal accessibility audit** and a **citation accuracy pass** (page
  numbers/DOIs) before any of this copy is treated as fully public-facing.
