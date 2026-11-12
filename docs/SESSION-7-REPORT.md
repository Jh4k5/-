# Session 7 — Mobile-First Redesign, Canonical Host & SEO Repair, Editorial Batch 2

Date: 2026-11-12 · Branch: `claude/jisr-china-trilingual-platform-wzojbr` · Commit: `c298e50`

## What changed

### 1. Canonical host switched to the brand domain

Production setting `site_url` changed from `https://jisr-to-china-henna.vercel.app`
to `https://www.bridge-to-china.com` (Supabase `settings` table, verified via
REST before and after). Everything derived from `getSiteUrl()` follows
automatically: canonical URLs, hreflang alternates (ar/en/ru/x-default),
`robots.txt` sitemap reference, XML sitemap (150 URLs), JSON-LD.

Why: the owner's Search Console property was created as a URL-prefix property
scoped to `https://jisr-to-china-henna.vercel.app/ar/`. A sitemap submitted
there resolves to `/ar/sitemap.xml`, which the app has never served (the
sitemap route is `/sitemap.xml`; `/ar/sitemap.xml` 404s — reproduced locally).
That is the "Couldn't fetch" in the Search Console screenshots. The fix is the
correct property scope (see "Owner actions" below), and canonicals pointing at
the one brand domain rather than being split between two hosts.

### 2. Mobile-first redesign (house rules preserved)

- **Header/navigation** — compact glass bar (`h-14/16/20` across breakpoints,
  `backdrop-blur-md` when scrolled); full-screen mobile sheet navigation with
  a four-tile quick grid (Services / Universities / Study Paths / Blog), icon
  rows for the remaining destinations, language switcher and CTA buttons
  pinned at the bottom within thumb reach, scrim + ESC dismissal, body scroll
  lock, staggered entrance, `prefers-reduced-motion` respected. Sheet renders
  outside the `<header>` element because `backdrop-filter` creates a
  containing block that would break nested `position: fixed`.
- **Section rhythm** — new `section-pad` utility (`clamp(3.5rem, 8vw, 6rem)`)
  replaces every `py-16/20/24` on public sections; content top-margins made
  responsive (`mt-8 sm:mt-14` pattern).
- **Universities showcase** — native snap-scroll rail below `md`; the 3D
  coverflow remains for desktop.
- **Hero** — glass badge, full-width stacked CTAs on phones, tuned spacing.
- **Cards** — `ArticleCard` mobile sizing + reading time; `BlogExplorer`
  category chips become a single-line swipe rail on phones.
- **Article page** — server-side table of contents (anchors injected into
  sanitized HTML, `withToc()`), reading time, updated-on date, category-aware
  related articles.
- **Footer** — two-column link grid on phones, tighter rhythm, contrast bump.
- **WhatsApp FAB** — refined 56px mobile button with a soft halo ring; z-index
  lowered below the nav sheet so it never overlaps the sheet's CTA row.
- **Logo** — Latin sub-line hidden below `sm` (it cropped mid-word at 390px).
- **320px overflow fix** — why-china list items got `min-w-0` + `break-words`
  (EN/RU homepages previously overflowed by 16px).

Verified: 45 page/locale combinations return 200; zero horizontal overflow at
320/360/375/390/414/430/768/1024/1440; desktop regression check clean;
tsc + eslint clean.

### 3. Editorial batch 2 (migration 0038 — applied and verified)

Five new trilingual articles (original writing per language, official sources
only, indicative ranges, no fabricated figures):

1. `china-application-documents-checklist` (tips)
2. `china-application-timeline-guide` (tips)
3. `accommodation-in-china-international-students` (student_life)
4. `university-scholarships-china-guide` (tips)
5. `banking-payments-china-students-guide` (student_life)

Production now has **14 published articles** (was 9); the sitemap grew from
135 to 150 localized URLs automatically. Applied via the Supabase management
SQL endpoint and verified by count + per-slug query.

### 4. Resend sending domain prepared (blocked on DNS — owner action)

`send.bridge-to-china.com` created in Resend (account of key ending `…GW`,
owner `mhomnyf8@gmail.com` — confirmed by test-mode rejection message). DNS
records generated; see "Owner actions". Until they are added and Resend
verifies, lead notifications remain recorded as skipped/failed — leads are
always saved first (by design).

## Deployment

- Commit `c298e50` pushed (fast-forward from `85c78e0`).
- Vercel deployment `dpl_6LdVV3wkebQMwJUTdBpQxcGHL8K4` — READY, production
  target, serving all three domains (`www.bridge-to-china.com`,
  apex redirects to www, `jisr-to-china-henna.vercel.app`).

## Owner actions (required)

1. **Search Console** — create a property for the brand domain:
   - Best: **Domain property** `bridge-to-china.com` (needs a DNS TXT record
     Google provides), or
   - URL-prefix property `https://www.bridge-to-china.com/` — verifies
     instantly via the already-deployed meta tag
     (`exO4pshzvmU92JX-E0Sjh3hBBvKqX9lzqMxLdU8AyYk`).
   Then submit **`sitemap.xml`** (root). Delete/ignore the
   `…/ar/`-scoped property; a sitemap can never be fetched under it.
2. **Resend DNS** — at the DNS provider for `bridge-to-china.com`, add the
   records shown at resend.com/domains for `send.bridge-to-china.com`
   (DKIM TXT, SPF TXT + MX, forge CNAME). Nothing existing is overwritten —
   all records live under the new subdomain. Once verified, notify the
   assistant session so `LEAD_NOTIFICATION_FROM` and the runtime key are
   finalized and an end-to-end test send is performed.

## Token rotation note

Several credentials were shared in chat during handover. Once the Resend
domain flow is complete, rotate: the GitHub PAT, the Vercel token, the
Supabase access token, and the Resend keys — then update the Vercel env
values that reference them.
