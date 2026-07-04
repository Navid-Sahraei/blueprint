# Blueprint — Design Brief (one page)

Required by the product spec (§4): exact values, two typefaces, one wireframe,
and a self-critique against the "does this look like any other SaaS app" test.

## Identity

Architecture and drafting. The user is designing their year like a structure,
so the interface borrows from technical drawings: navy ink on paper, a
drafting grid, corner registration marks, and numbers set in mono like
measurements. This is content-derived, not decorative.

## Color

| Token        | Hex / value            | Use                                       |
| ------------ | ---------------------- | ----------------------------------------- |
| `--blueprint`| `#1B3A5C`              | Structural navy — headings, primary UI    |
| `--blueprint-deep` | `#122A45`        | Hover/pressed navy                        |
| `--paper`    | `#F7F5F0`              | Page background                           |
| `--paper-raised` | `#FFFDF9`          | Cards                                     |
| `--graphite` | `#2E2E2E`              | Body text                                 |
| `--graphite-soft` | `#5C5A55`         | Secondary text                            |
| `--accent`   | `#C4551A`              | Technical-drawing orange — CTAs and progress ONLY |
| `--grid-line`| `rgba(27,58,92,0.07)`  | Blueprint grid                            |
| `--hairline` | `rgba(27,58,92,0.18)`  | Borders, corner marks                     |
| `--dimension`| `rgba(27,58,92,0.45)`  | Dimension-style annotations, labels       |

Deliberately excluded: terracotta `#D97757` (the AI-cliché accent the spec
bans), gradients, glow, and any dark-mode neon scheme.

Contrast check (WCAG AA): graphite `#2E2E2E` on paper `#F7F5F0` ≈ 12.6:1 ✓;
navy `#1B3A5C` on paper ≈ 9.0:1 ✓; white on accent `#C4551A` ≈ 4.6:1 ✓ (large
text / UI components; keep accent buttons ≥ 14px medium). Verify again if any
value shifts.

## Typography

1. **IBM Plex Mono** — display headings, labels, numerals, dates. Everything
   that should read as a measurement. Uppercase micro-labels at 11px with
   0.14em tracking (`.label-technical`); tabular numerals (`.measure`).
2. **Inter Variable** — body text, forms, paragraphs.

Both self-hosted via Fontsource (no external font requests).

## Layout signature

- `.blueprint-grid`: two-scale drafting grid (24px fine, 120px coarse) on
  hero, dashboard, and auth screens.
- `.corner-marks`: registration-mark brackets on module cards.
- Tight radii (4px) — drafting is square-cornered.
- Progress bars styled as measurement scales (when modules land).

## Motion

Restrained. One signature: `draft-in` (elements appear as if drawn,
clip-path wipe, 600ms) for onboarding only. Everything else is instant or a
plain color transition. `prefers-reduced-motion` disables the signature.

## Dashboard wireframe (ASCII)

```
┌──────────────────────────────────────────────────────────────┐
│ BLUEPRINT                              Dashboard · Methods    │
├──────────────────────────────────────────────────────────────┤
│ · · · · · · · · · · (drafting grid) · · · · · · · · · · · ·  │
│  2026 — THIS YEAR AT A GLANCE                                 │
│                                                               │
│  LAYER 01 · DIRECTION                                         │
│  ┌─ Values ─────┐ ┌─ Odyssey ────┐ ┌─ OKRs ───────┐          │
│  │ 4 values set │ │ 3 paths      │ │ Q3: 62% ▓▓▓░ │          │
│  └──────────────┘ └──────────────┘ └──────────────┘          │
│                                                               │
│  LAYER 02 · BIG MOVES                                         │
│  ┌─ Misogi ────────────┐ ┌─ Adventures ─────────┐            │
│  │ 118 days to event   │ │ next: Aug 14 · 3/6   │            │
│  └─────────────────────┘ └──────────────────────┘            │
│  ... layers 03–05 ...                                         │
└──────────────────────────────────────────────────────────────┘
```

## Self-critique ("does this look like any other SaaS app?")

- Navy + off-white + mono headings is uncommon in this category; the common
  patterns (cream/terracotta/serif, black/neon, blue-purple gradient) are all
  avoided by construction.
- Risk: "paper + technical" could drift toward Stripe-docs territory. The
  drafting grid, corner marks, and measurement-styled numerals are the
  differentiators — they must survive future redesigns, or the identity
  collapses into generic minimalism.
- Risk: over-using the accent orange would make it read like any orange CTA
  SaaS. Rule: accent appears at most twice per screen.
