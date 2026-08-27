# جسر إلى الصين — house rules

Read this before changing anything visual. These are decisions already made for
this brand; treat them as constraints, not suggestions.

## The identity

The site is about **China**. That has to be visible on every screen, not just in
the logo.

- **China red `#C8102E` is the primary.** It carries the call to action, the
  trust strip, section chips and the active state. Trust blue is the ground for
  dark sections; imperial gold is an accent measured in slivers, never a fill.
  Roughly 60% neutral ground / 30% blue / 10% red-and-gold.
- **Chinese characters are part of the furniture.** `KanjiWatermark` hangs one
  meaning-matched glyph behind a section (学 study, 桥 bridge, 语 language,
  门 gate, 信 trust, 路 path). They render from the OS Chinese face — never ship
  a CJK web font for decoration.
- **Shapes are stamped, not rounded.** Chips and buttons are seals (`.seal-chip`,
  `.btn-seal`) with a small radius and an inner keyline. Full pills read as a
  generic template.
- **祥云 cloud rules** (`CloudDivider`) separate major sections instead of a
  plain `<hr>`.

## Banned outright

The linter enforces these; do not disable the rule to get around it.

- Purple/violet anything — `from-purple-*`, `#a855f7`, `#8b5cf6`. This is the
  single most recognisable AI-template signature.
- Inter, Roboto, Arial. Headings are Cairo (Arabic) or Manrope (Latin/Cyrillic)
  through `--font-display`.
- Decorative gradients on UI chrome: rules, chips, icon tiles, buttons. A
  gradient is legitimate **only** as a scrim over a photograph, and those always
  end in `to-transparent`.
- Heavy glassmorphism (`backdrop-blur-2xl` and up).
- Emoji standing in for icons. Use Lucide, sized, with `aria-hidden="true"`.

## Layout and type

- Spacing comes from `--space-*`. Type comes from `--text-step-*` (ratio 1.25),
  and headings use `.text-fluid-h1/h2/h3` rather than a hand-written clamp.
- Body text never below 16px, never tighter than 1.5 line-height.
- Avoid the "centred hero over three identical cards" shape. Prefer asymmetry,
  overlap, and a rail that breaks the grid.

## Motion

Motion here is deliberately generous — it is part of the brand — but it is never
imposed:

- Everything decorative yields to `prefers-reduced-motion`.
- Autoplay pauses on hover, on drag, and when the tab is hidden.
- Never hijack scrolling.
- Entrances stagger (`.stagger`); hovers lift in 3D (`.card-3d`).

## Non-negotiables

- **Raw HTML.** `dangerouslySetInnerHTML` appears in exactly two audited places:
  `components/seo/JsonLd.tsx` (escapes `<`, `>`, `&`, U+2028/9) and the blog
  article body (passed through `sanitizeRichText` server-side first). The
  pre-commit hook blocks a third.
- **Auth and permissions are server-side.** Client checks are for UX only.
- **Every image needs `alt`; every icon-only control needs `aria-label`;**
  decorative icons get `aria-hidden="true"`. Everything interactive must be
  reachable by Tab in a sensible order.
- **Trilingual or it does not ship.** Any new visible string is `_ar` (required)
  plus `_en`/`_ru`, editable from the admin panel, with the dictionary as the
  final fallback. Never hardcode visible copy in JSX.
- **No invented content.** No fabricated testimonials, statistics, partnerships
  or guarantees. Admission outcomes are never promised.

## Verifying

`npm run lint && npx tsc --noEmit && npm run build` before every commit. CI adds
Lighthouse with a floor of 90 on performance, accessibility and SEO.

Local runtime falls back to seed data because the sandbox cannot reach Supabase —
so seed completeness is functional, not cosmetic. And after any rebuild, restart
the server before trusting a check: `next start` loads the build once at boot,
and a stale process will happily serve you the previous build.
