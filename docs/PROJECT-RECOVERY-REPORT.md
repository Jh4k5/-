# Project Recovery Report — Bridge to China Edu

**Date:** 2026-11-10 (recovery session, environment handover)
**Context:** New AI development environment continuing the project per the owner's handover directive
**Source of truth:** `github.com/Jh4k5/-` · default branch `claude/jisr-china-trilingual-platform-wzojbr` · HEAD at recovery start: `e3069da`
**Production:** https://jisr-to-china-henna.vercel.app (Vercel project `jisr-to-china`, auto-deploy from GitHub)
**Database:** Supabase project `jisr-to-china` (ref `hwqvvhnbfnkeqfzpofaa`, eu-central-1, Postgres 17.6, ACTIVE_HEALTHY)

---

## 1. Executive summary

The project was recovered **with zero loss**. Everything the previous environment reported as "two
commits ahead locally" (`44fce32`, `e3069da`) **exists on GitHub and is already deployed to
production** — the handover's fear of unpushed work is outdated. The working tree is clean, the
production deployment is `READY`, the database is healthy, and the application was re-run and
browser-verified in the new environment against the live database. One authorized change was made
(new Google Search Console verification token); everything else was read-only recovery.

---

## 2. The twelve recovery questions

### 2.1 What had already been implemented?
Full trilingual (AR/EN/RU) consultancy platform: 21 public routes under `[locale]`, Arabic admin CMS
(25 routes), blog CMS (articles table + rich-text editor; **0 published articles**), universities /
services / study-paths / destinations / stories content, first-party analytics (13 events,
`analytics_events` table), lead intake (`/api/leads` with honeypot, allowlist validation, rate
limiting), RLS-hardened Supabase schema (18 tables, 41 policies), homegrown i18n (no library),
Tailwind v4 theme tokens + dashboard-controlled branding, SEO layer (per-page metadata, canonicals,
alternates, JSON-LD, `robots.ts`, `sitemap.ts`, og:image). Stack: Next 15.5.23 · React 19.1.0 ·
@supabase/ssr 0.12.4 · @supabase/supabase-js 2.112.3 · framer-motion 13.

### 2.2 Which previous changes are present in GitHub?
- `44fce32` — backlog batch (DB-07 seed-fallback fix, sitemap honesty, locale 404s, WCAG pause
  control, MediaFrame, font diet). **Present, deployed.**
- `e3069da` — session-2 report (0032/0033 applied & verified, custom-domain DNS findings).
  **Present, deployed — it was the tip of the default branch at recovery start.**
- Branch `improvement/audit-remediation` (tip `77fc550`) is **fully contained** in the default
  branch (`git rev-list --left-right --count` → `2 0`): default = audit branch + exactly those two
  commits. Nothing on it is missing from production.

### 2.3 Which commits are missing?
**None.** The previous environment did eventually push; Vercel deployment (READY, 2026-11-10
10:35 UTC) was built from `e3069da` via the confirmed GitHub→Vercel auto-deploy pipeline
(~1 minute push-to-production).

### 2.4 Which previous issues have been resolved?
Per IMPROVEMENT-REPORT.md (sessions 1–2): I1 (open redirect), I3 (CI never triggers), I5 (locale
fallbacks/dropdown), I6 (revalidate), I7 (dead code), I8 (cookie loss on guard redirects), I11
(status toggles), I12 (leads PII pagination), I13 (rate-limit defects), I15 (dict key), I16
(.env.example); security headers, auth cookie hardening, og:image (SEO-02), logo 667 KB→7.2 KB,
hero sizes, axe-verified WCAG AA batch, skip link, focus traps, DB-03/DB-04/DB-08 via migration
0032, DB-07, sitemap honesty, uppercase-locale 404s, slideshow pause (WCAG 2.2.2), font-stack diet.
Migration 0033 (default og image) applied.

### 2.5 Which issues remain? (active backlog)
| Item | Issue | Status |
|---|---|---|
| DB-02 | Admission-letter samples in public `media` bucket | **Excluded by owner decision (2026-11 handover): intentional public demo samples — do not touch; removed from the active backlog** |
| DB-06 | `is_admin()` conflates admin and editor roles | **Open — re-verified live in the production DB (see §3.4)** |
| — | Rate limiter is per-process (serverless dilution) | Open |
| SEC backlog | Settings URL fields unvalidated | Open |
| FE-05 | MediaFrame bypass (minor, partially fixed) | Open |
| — | `npm audit` blocked in the dev sandbox | Open |
| — | Trust content thin by design (founder/company fields, no articles yet) | Open — owner content task |
| — | Custom domain `bridge-to-china.com` | **Postponed by owner decision — DNS must not be touched** |

### 2.6 Does the application currently run?
**Yes** — dev server on :3000 in the recovery sandbox, connecting to the production database
(read-only during verification; no lead submissions were made).

### 2.7 Does the Review Panel work?
**Yes** — browser-verified (agent-browser, dedicated session): `/` redirects by Accept-Language;
`/ar` renders RTL with Arabic title; `/en`, `/ru` LTR; universities page renders localized cards;
blog renders its designed empty state; contact form renders all fields incl. live country-code
data; `/admin/login` renders (not logged in — no credentials by design); slideshow pause control
present; skip link present. No errors in the dev server log.

### 2.8 Is the production deployment healthy?
**Yes** — Vercel API: latest 5 deployments all `READY`; production alias served from `e3069da`;
project linked to `Jh4k5/-` (production branch = default branch). Note: this sandbox's egress
DNS-hijacks `*.vercel.app` (resolves to a `face:b00c` address), so the public URL cannot be
fetched from inside the sandbox — the same limitation the previous environment documented. Health
is verified through the Vercel API instead.

### 2.9 Are Google verification and sitemap configured?
- `verification.google` in `src/app/layout.tsx` held only the legacy token
  `LJl-JQBx91rZFrdUADtap4MnUNwBQtBFpxecbe9deFo`. **This session added the owner's new token
  `exO4pshzvmU92JX-E0Sjh3hBBvKqX9lzqMxLdU8AyYk` alongside it** (rendered HTML on :3000 shows both
  meta tags; no duplicates). Three legacy HTML verification files in `public/` were left untouched.
- `robots.ts` and `sitemap.ts` are implemented and correct (14 static pages × 3 locales + slug
  routes, content-derived `lastModified`).
- After the deploy, submit `https://jisr-to-china-henna.vercel.app/sitemap.xml` in Search Console
  using URL-prefix property `https://jisr-to-china-henna.vercel.app/`.

### 2.10 Are Resend emails implemented?
**No.** Zero email code exists anywhere in the codebase (exhaustive search) — the two
owner-requested workflows (applicant confirmation in AR/EN/RU + owner new-lead notification) are
greenfield work. The Resend key pasted into the handover chat was **not used or stored in the
repo**: per the handover, the previously-shared key is compromised, and any key pasted in chat must
be treated as exposed. Implementation awaits a fresh restricted key + `LEAD_NOTIFICATION_TO`.

### 2.11 What owner configuration is still missing?
1. A **fresh, restricted Resend API key** (create in Resend; add via protected channel or directly
   to Vercel env) + a verified sending domain.
2. **`LEAD_NOTIFICATION_TO`** — the owner's notification email address (never invented by us).
3. Optional: admin test credentials if the owner wants the admin flow browser-verified too.
4. Postponed: custom-domain decision (no action; DNS untouched per owner directive).

### 2.12 Which skills are already installed?
See **docs/AI-SKILLS-INVENTORY.md** — the previous environment's 27-skill install did not survive
the handover (it lived in an untracked `skills/` folder). The new environment re-cloned all **9
owner-requested skill repositories (122 skills)** into a sandbox reference directory and
additionally provides its own native specialist skill system mapped to the requested capabilities.

---

## 3. Verified infrastructure state (evidence)

### 3.1 Git
Clean tree at `e3069da`; branches: default `claude/jisr-china-trilingual-platform-wzojbr`,
`improvement/audit-remediation` (`77fc550`, fast-forward-contained); no tags; no unpushed work.

### 3.2 Vercel
Project `jisr-to-china` (id `prj_AGktJY8fWY4faoEfAB6i41fwRYbQ`), framework nextjs, GitHub-linked
(repo `-`, owner `Jh4k5`). **Environment variables: none** — the app runs by design on the
committed publishable-key fallback in `src/lib/supabase/config.ts` (RLS-protected; no
service-role key exists in the codebase, and the pre-commit scanner blocks one from being
committed).

### 3.3 Supabase migrations — the documented "mismatch", resolved
- Local files: **33** (`0001`…`0033`, no gaps).
- Remote `supabase_migrations.schema_migrations`: **30 entries** (timestamps
  `20260816004552`…`20260828200914` = local `0001`–`0029`, including two remote-only names:
  `harden_touch_updated_at_search_path`, `unify_booking_cta`).
- `0030`–`0033` are **not in the history table but their changes are verifiably live in the
  schema** (applied out-of-band via the Management API, as documented in IMPROVEMENT-REPORT §7):
  - 0032: `leads_status_idx`, `leads_created_idx`, `analytics_events_created_idx`,
    `analytics_events_name_idx` + the constrained `leads_public_insert` / `analytics_events_insert`
    policies — all present.
  - 0033: `default_og_image` settings key — present.
  - 0030/0031: renamed brand/settings keys — present (settings inventory matches the post-0031 state).
- **Action taken: none.** Per the handover, migration history is never blindly repaired and
  production is never reset. Future migrations should use the standard flow so new entries land in
  the history table again.

### 3.4 Database security posture (read-only inspection, 2026-11-10)
- 41 RLS policies across all 18 tables (public read on published content; admin write gated by
  `is_admin()`; constrained public inserts on `leads` and `analytics_events`).
- **DB-06 confirmed live:** `is_admin()` returns true for `role in ('admin','editor')` — the
  editor/admin conflation is real and is the next database work item.
- `users_select_self` is the only policy on `users`; passwords live in `auth.users`.

### 3.5 Sandbox environment constraints (documented for future sessions)
- Egress: `api.github.com`, `api.vercel.com`, `api.supabase.com`, `<project-ref>.supabase.co` all
  reachable; `*.vercel.app` is DNS-hijacked (unusable from inside — verify production via APIs).
- The app in the sandbox talks to the **production** database — form submissions from the Review
  Panel would create real leads. Write-path testing must use a Supabase branch or owner-approved
  test records only. No writes were made during recovery.

---

## 4. Changes made in this recovery session

| Commit | Change | Evidence |
|---|---|---|
| `feat(seo): add new Google Search Console verification token` | `src/app/layout.tsx` — `verification.google` becomes an array: new owner token first, legacy token retained (one meta tag each; no duplicates; previously-verified property stays verified) | Rendered `/ar` HTML on :3000 shows both `google-site-verification` meta tags; `tsc --noEmit` clean; `eslint src` clean |
| `docs: session 3 recovery — handover report, skills inventory, GSC token` | This file + docs/AI-SKILLS-INVENTORY.md + IMPROVEMENT-REPORT.md §11 | Committed to the default branch; auto-deployed |

**Explicitly untouched** (per owner decisions): admission-letter samples and their URLs/permissions;
Xin Net DNS / A / CNAME records; canonical URLs (still `jisr-to-china-henna.vercel.app`); brand,
logo, colors, typography, page structure, navigation, services, university content, blog
architecture, admin CMS, database relationships; all production data (read-only queries only);
no deletions of any kind.

---

## 5. Roadmap continuation (earliest incomplete priorities)

1. **Email workflows (Resend)** — two transactional emails (applicant confirmation in AR/EN/RU +
   owner new-lead notification), triggered after the lead persists so an email failure can never
   lose a lead; unique lead reference ID; delivery status recorded; safe retries; **blocked on the
   owner's fresh key + recipient address** (§2.11).
2. **DB-06** — split `is_admin()` into true admin vs editor privileges before hiring any editor.
3. **Distributed rate limiting** — shared-store limiter for serverless (compatible free tier),
   preserving the current trustworthy-IP keying and stale-key pruning.
4. **Blog batch 1** — 4–5 researched articles via the existing CMS; create
   docs/EDITORIAL-CONTENT-PLAN.md with the batch (topic, keyword, intent, audience, language,
   references, image status, URL, status).
5. Production-build CWV/Lighthouse verification (dev-server numbers are not representative).

## 6. Security actions required from the owner

1. **Rotate the four credentials pasted into chat** (GitHub PAT, Vercel token, Supabase PAT,
   Resend key). Treat every chat-pasted secret as exposed. They were stored only in a
   permission-600 file **outside** the repository and never committed; rotation closes the loop.
2. Create the **replacement restricted Resend sending key** before the email batch starts.
3. (Supabase guidance) Prefer **scoped** personal access tokens for future automation instead of
   account-wide classic PATs.
