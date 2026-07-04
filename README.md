# Blueprint

An interactive, subscription-based web app for annual life and goal planning.
Five layers — values, goals, bold moves, execution, review — built from ten
methods that each cite the research or named practitioner framework behind
them. See `docs/` for the design brief; the full product spec lives with the
founder.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** + shadcn-style components (copied in, `src/components/ui`)
- **Supabase** (Postgres + Auth + RLS) — schema in `supabase/migrations`
- **Stripe** (subscriptions — not yet wired)
- Fonts self-hosted via Fontsource: IBM Plex Mono (display/measurements) +
  Inter Variable (body)

## Development

```bash
pnpm install
cp .env.example .env.local   # fill in Supabase keys (optional at first)
pnpm dev
```

Without Supabase env vars the app runs in "drafting mode": the marketing
site works fully, `/app` routes stay reachable, and auth forms explain what's
missing. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
to enable real auth and the `/app` gate (see `src/proxy.ts`).

To set up the database, apply `supabase/migrations/0001_init.sql` to your
Supabase project (SQL editor or `supabase db push`).

## Structure

```
src/app/            public pages (/, /pricing, /methods, /methods/[slug])
src/app/app/        authenticated shell (/app/dashboard, modules to come)
src/lib/methods.ts  the 10-method content model with citations
src/components/ui/  shadcn-style primitives
supabase/           SQL migrations (all module tables + RLS)
docs/               design brief
```

## Content standards (binding)

Every scientific claim in user-facing copy carries a real citation (author,
year, publication). Practitioner books are labeled as books, never passed off
as studies. Known controversies — the 21-day habit myth, the 10,000-hour
rule, gratitude effect sizes — are stated plainly in the UI, not smoothed
over. See `src/lib/methods.ts` for the canonical sources list.

## Roadmap (not in this build)

Module interiors (the ten interactive homes), Stripe gating, quarterly email
nudges, data export, calendar sync, PDF/Notion versions, team/coach tier.
