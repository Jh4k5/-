# Bridge to China Edu — Improvement Mission: Final Quality Report

**Branch:** `improvement/audit-remediation` (6 commits on top of `760e4e7`, never pushed)
**Date:** 2026-11-07 · **Executed by:** coordinated AI specialist team (skills-loaded agents)
**Guarantee honored:** no deploys, no production database operations, no destructive changes, brand identity and design conventions preserved, AR/EN/RU maintained throughout.

---

## 1. Installed skills (Phase 1)

27 skills installed to `skills/` (untracked by git) with full provenance in `skills/INSTALLED-AGENTS-SKILLS.md`. All five source repos verified genuine (official orgs / known authors), MIT licensed, scripts reviewed (read-only analyzers).

| Source repo | Commit | Skills installed |
|---|---|---|
| addyosmani/agent-skills | `301b02b` | code-review-and-quality, frontend-ui-engineering, security-and-hardening, performance-optimization, debugging-and-error-recovery, test-driven-development, ci-cd-and-automation |
| addyosmani/web-quality-skills | `afa8da9` | web-quality-audit, seo, accessibility, core-web-vitals, performance, best-practices |
| vercel-labs/agent-skills | `1a2c79d` | react-best-practices |
| coreyhaines31/marketingskills | `96798cf` | product-marketing, seo-audit, site-architecture, competitor-profiling, customer-research, content-strategy-marketing, cro, copywriting, schema, ai-seo, marketing-plan |
| supabase/agent-skills | `c9be0e9` | supabase, supabase-postgres-best-practices |

Deduplication: `web-design-guidelines` skipped (already present); marketing `content-strategy` renamed `content-strategy-marketing` (name collision with an unrelated platform skill).

## 2. Business assessment (Phase 2)

- **Identity:** "جسر الصين التعليمية / Bridge to China Edu", mid-rename from "Jisr to China" (SEO-bridged via `alternateName`). One-destination-only positioning: *"An educational consultancy that works on one destination only: China."*
- **Model:** free first consultation → custom-quoted written e-contract. Zero prices published by design; costs framed via 6 transparent cost factors.
- **Services (6):** university admission, HSK language programmes, scholarships (self-described "heart of what we do"), test prep, interview prep, arrival & settling-in. Plus an 11-step process and a partner "Bridge to Chinese" platform perk (two months free).
- **Audiences:** primary Arab students (4 study-path segments: language/bachelor/master/PhD), parents addressed; RU/CIS secondary.
- **Conversion machinery:** WhatsApp-first funnel (floating button, hero, header, process, FinalCTA), contact form with honeypot + rate limit, lead pipeline in the Arabic admin CMS, privacy-first analytics. Trust content honestly thin by design (demo stories noindexed, founder fields empty pending owner data) — a code-enforced "no invented content" rule exists in CLAUDE.md.
- **Copy divergences found & fixed:** "lifetime" vs "two-months" perk contradiction; RU about-story missing rename note; RU stats label claiming "partner universities".

## 3. Technical audit (Phase 3) — verified findings

Four parallel specialist audits (all read-only, evidence with file:line). Previous I1–I16 findings independently re-verified:

| Prior ID | Verdict | Disposition |
|---|---|---|
| I1 open redirect | CONFIRMED | **Fixed** (SEC-01) |
| I2 admissions RLS consent | CONFIRMED | **Migration 0032** (pending owner apply) |
| I3 CI never triggers | CONFIRMED (`branches: ain]` corrupted YAML) | **Fixed** |
| I4 Vercel tarball deploy | CONFIRMED | Documented (README already advises Git integration) |
| I5 Arabic in EN/RU dicts | REFUTED (dictionaries clean) → real variant: Arabic-only country dropdown + locale-blind page fallbacks | **Fixed** (FE-01/FE-04) |
| I6 missing revalidate | CONFIRMED | **Fixed** (3 pages) |
| I7 stats dead code | CONFIRMED (+ dead admin control) | **Fixed** (components deleted) |
| I8 middleware cookie loss | REFUTED as stated → real minor variant (guardAdmin redirects drop refreshed cookies) | **Fixed** (SEC-06) |
| I9 photo bypasses MediaFrame | CONFIRMED | Backlog (FE-05, minor) |
| I11 status toggles not persisted | REFUTED (payloads include status) → real UX trap: toggle flips UI but doesn't save | **Fixed** (auto-persist, 13 editors) |
| I12 leads unbounded PII | CONFIRMED | **Fixed** (50/page server pagination) |
| I13 rate-limit flaws | CONFIRMED (3 defects) | **Fixed** (SEC-02) |
| I15 wrong dict key | CONFIRMED (latent) | **Fixed** (excludesTitle) |
| I16 missing .env.example | CONFIRMED | **Fixed** |

**New findings (selected):**
- **SEC:** security headers absent (fixed); auth cookies lacked `secure` (fixed); settings URLs unvalidated (backlog); CSRF assessed low-risk (documented).
- **DB:** **DB-02 CRITICAL — admission-letter PII sits in the public `media` bucket; blur is CSS-only, so the unblurred original is one GET away** (backlog — requires private bucket + signed URLs; owner decision); `leads`/`analytics_events` inserts `with check (true)` (fixed in 0032); `is_admin()` conflates admin/editor (backlog); seed fallback can republish unpublished content on empty results (backlog DB-07); missing public-path indexes (fixed in 0032); slug nullability, non-idempotent seeds, JS-side analytics aggregation (documented backlog).
- **SEO:** homepage title brand duplication + Arabic suffix on EN/RU (fixed); no og:image anywhere (fixed — brand asset + wiring); og:locale format (fixed); sitemap lastModified always-now (backlog); uppercase-locale 404s (backlog).
- **PERF:** 667 KB logo PNG auto-preloaded on every page (fixed → 7.2 KB optimized, −98.9%); hero `sizes` undersized (fixed); font stack self-hosted but non-critical weights shipped (backlog).
- **A11Y (axe-verified):** contrast failures (fixed at 6 spots); hero dots < 24 px targets (fixed); no skip link (fixed); Lightbox no focus trap/name (fixed); form errors not announced (fixed); nav landmarks unlabeled (fixed); no slideshow pause control (backlog); fixed-header anchor occlusion (fixed via scroll-padding).

## 4. SEO strategy (Phase 4)

### 4.1 Competitive landscape (from live web research — observed SERP compositions, not volume estimates)

- **Arabic (primary market, least saturated):** SERPs mix the official `arabic.beijing.gov.cn`, CUCAS's Arabic portal, and small agencies: **Edumasar (edumasar.com), Study Gate (studygate.online), Great Wall Education (greatwall.ma, Morocco), ApplyForChina, CEC, النخبة**. Fragmented field — a trilingual, Arabic-first specialist can realistically compete.
- **English (supporting locale):** dominated by **China Admissions (china-admissions.com), CUCAS, Mastersportal, Go Abroad China** — treat EN as supporting/credibility, not the primary battleground.
- **Russian:** **portalchina.ru, StudyinChinas, Crossline Education (crosslineedu.com), mychina.org, uchina.kz (Almaty)** — moderate competition, strong CIS student demand.

### 4.2 Keyword → page mapping (intent-aligned; volumes NOT asserted — validate in Search Console / a keyword tool)

| Page | Arabic (primary) | English | Russian |
|---|---|---|---|
| `/ar` home | الدراسة في الصين · القبول الجامعي في الصين · مكتب دراسة في الصين | study in China | учёба в Китае |
| `/services/scholarships` | منح دراسية في الصين · منحة CSC · منحة الحكومة الصينية | CSC scholarship · China scholarships | гранты в Китае · стипендия CSC |
| `/services/university-admission` | التقديم على الجامعات الصينية · قبول جامعي الصين | China university admission | поступление в вузы Китая |
| `/services/chinese-language-programmes-hsk` | سنة تحضيرية في الصين · دورة اللغة الصينية · اختبار HSK | HSK preparation China | подготовительный год в Китае · HSK |
| `/study-paths/bachelor` (etc.) | البكالوريوس في الصين · الماجستير في الصين · الدكتوراه في الصين | bachelor's/master's/PhD in China | бакалавриат/магистратура/аспирантура в Китае |
| `/universities` | أفضل الجامعات الصينية · ترتيب الجامعات الصينية | best Chinese universities | лучшие вузы Китая |
| `/language-platform` | تعلم اللغة الصينية للمبتدئين | learn Chinese online | выучить китайский язык |
| `/faq` + `/blog` | informational support cluster (see 4.4) | — | — |

### 4.3 Technical SEO — implemented this mission

Homepage title per locale (no Arabic leakage on EN/RU); og:image + twitter:summary_large_image on every page (WhatsApp-critical); og:locale territory format; revalidate=60 on the 3 missing pages (admin SEO edits now actually publish); correct `services.excludesTitle` before any owner fills the field; `.env.example`; robots/sitemap/hreflang/canonicals/JSON-LD verified healthy (Organization + WebSite + SearchAction, FAQPage, BlogPosting, BreadcrumbList, Service/Course/CollegeOrUniversity).

### 4.4 Content strategy (sustainable, no doorway pages)

The blog/articles infrastructure + FAQ table already exist. Highest-leverage informational articles (mapped to real SERP demand observed in research): CSC scholarship step-by-step guide (per locale), real cost-of-living by city, HSK levels explained, X1/X2 visa file checklist, spring vs autumn intakes, city guides for the destinations already in the DB. Each article should internally link to its matching service page. Publish cadence: 1–2 articles/month is sufficient for this niche; quality and locale-completeness over volume. **AI-search readiness (ai-seo skill):** server-rendered content, FAQPage schema and clean entity naming are already in place; add `llms.txt` only when content volume justifies it.

## 5. Business & conversion review (Phase 5)

**Fixed with direct conversion impact:** og:image (WhatsApp shares now render a branded card instead of a bare link — the funnel is WhatsApp-first); localized country-code dropdown (EN/RU visitors could not identify their country code); form error announcements (screen-reader users now complete the form); 667 KB → 7 KB logo (every page view); two-months perk copy aligned with the DB (avoids promising "lifetime").

**Owner actions recommended (in priority order):**
1. Apply migrations 0032 + 0033 (see §7), then upload real (consented) admission letters — the strongest trust asset is currently empty.
2. Fill founder/company fields in the admin (cards render only once filled).
3. Register the site in Google Search Console; submit the sitemap; wire the existing analytics to a weekly review.
4. Get a custom domain + 301 from the vercel.app URL (canonical host currently `jisr-to-china-henna.vercel.app`).
5. Instagram is the only active social — cross-post admission successes there (already linked in footer).

## 6. Implemented fixes (Phase 6–7) — all browser-verified

| Commit | Batch | Contents |
|---|---|---|
| `d2b58da` | Security | open-redirect validation (incl. backslash trick), shared rate limiter (trustworthy IP key + stale-key pruning), secure cookies, redirect cookie preservation, 5 security headers, migration 0032 |
| `2ae5243` | Admin/PII | leads inbox 50/page server pagination + count, status-toggle auto-persist across 13 editors (consent guard preserved in Admissions) |
| `7c73ed7` | i18n | localized country dropdown, locale-aware fallbacks (Hero/services/language-platform), perk/story/stats copy alignment |
| `c018ccf` | SEO | homepage absolute titles, og:image + twitter card + og:locale, logo via next/image (−98.9%), hero sizes=100vw, revalidate ×3, excludesTitle, NULL-settings merge fix, migration 0033, .env.example (committed in follow-up) |
| `0d602c0` | Repo | .env.example un-ignored, dev.log/tool-results ignored |
| `0e3693e` | A11y/CI/docs | skip link, nav labels, dot targets, language-switcher targets, Lightbox focus trap + localization, form error announcements, 6 contrast fixes, overflow-x clip, scroll-padding, search focus ring; dead code removed (4 components + stats control); CI trigger fixed; README corrected |

**Verification evidence:** `tsc --noEmit` 0 errors · `eslint . --quiet` 0 problems in project code · live curl checks (headers present, 429 after 5 posts, XFF last-entry keying, 307 admin gating, 200s on ar/en/ru/contact/faq/search/universities, 404 on bad route) · agent-browser end-to-end (skip link first-focus, EN↔RU switching, empty-submit form shows role=alert + focuses first invalid + aria-describedby, lightbox focus trap, mobile 390px scrollWidth = 390 (was 406), zero console/page errors on every page tested) · logo 667,792 B → 7,200 B measured.

## 7. Database migrations — status update (Session 2, 2026-11-10)

**0032 and 0033 have been applied to production** (statement-by-statement via the Management API, all 23 statements OK) after a documented pre-flight review:

- `leads_public_insert` / `analytics_events_insert` constraints were diffed against the ONLY two insert paths (`/api/leads`, `/api/track`) — field-by-field match (status/source allowlists, length caps).
- Consent impact checked before applying: 4/4 published admissions and 3/3 published stories already carry consent, so nothing was hidden by the new policies.
- Post-apply verification (live REST tests as `anon`): valid lead insert → **201**; wrong-status insert → **blocked (42501)**; 200-char name → **blocked**; fake analytics event → **blocked**; anon SELECT on leads/analytics → **`[]`** (PII still private). Test rows deleted after verification.
- 11 partial indexes live (public read paths + `leads_created_idx`).

## 8. Remaining issues & limitations (prioritized backlog — updated Session 2)

**Fixed in Session 2 (commit `44fce32`, deployed & verified):** DB-07 seed fallback (list fetchers + `fetchBySlug` — unpublished/deleted content now stays gone); sitemap `lastModified` honesty (static pages date from the newest content row, not "now"); uppercase-locale 404s (`/AR` → 308 → `/ar`); WCAG 2.2.2 hero slideshow pause/resume control (44 px, trilingual, opposite the WhatsApp float — click, pause-freeze and resume verified in-browser); AboutTeaser/about owner photos through MediaFrame; Cairo 400 + Tajawal 500 font weights dropped (audited unused); `bun.lock` ignored (package-lock.json canonical); pre-commit scanner activated via `npm run prepare` → `core.hooksPath` (ran on this session's commit).

1. **DB-02 (Critical, owner decision):** admission-letter originals are publicly readable in the `media` bucket regardless of blur/consent. Plan: private bucket (or server-side redaction) + short-lived signed URLs for consented+published rows only; keep `media` public for marketing assets.
2. **DB-06:** `is_admin()` treats editors as admins (delete/leads access). Needs role split before hiring an editor.
3. Rate limiter is per-process (serverless multi-instance dilutes it); back with a shared store if abuse appears.
4. `npm audit` against the official registry (blocked in this sandbox — mirror lacks the endpoint).
5. Sitemap `lastModified` for static entries now content-derived (fixed); uppercase-locale paths 308-normalize (fixed); hero slideshow pause control added (fixed); AboutTeaser/about photos render via MediaFrame (fixed); unused font weights dropped (fixed); competing lockfiles resolved (package-lock.json canonical, bun.lock ignored, fixed); `scripts/pre-commit-scan.mjs` wired via `.githooks` + `prepare` (fixed).
6. **Deferred verification:** Lighthouse/CWV on the production build (dev-server numbers are not representative); title template behavior in a production build; Search Console data.

## 9. Reproducing the environment

`npm install` → `npm run dev` (port 3000). Supabase URL/anon key have safe built-in fallbacks; `.env.example` documents the three overridable variables. The admin CMS is at `/admin/login` (credentials via Supabase Auth, outside this repo).

---

## 10. Session 2 continuation log (2026-11-10, "push updates straight to GitHub")

**Pipeline confirmed:** `Jh4k5/-` default branch `claude/jisr-china-trilingual-platform-wzojbr` → Vercel project `jisr-to-china` (henna) auto-deploy, verified live end-to-end. Every code change lands in production within ~1 minute of push.

**Deployed:** commit `44fce32` (backlog batch, §8 above) — deployment READY; production HTML verified to contain the pause control, per-locale titles, content-derived sitemap dates.

**Production platform state (all live-verified):**
- Leads pipeline: RLS-hardened AND still accepting public inserts (201 on valid, 42501 on crafted abuse) — the original "orders don't appear" fix remains intact.
- `default_og_image` backfilled (0033): every page now emits `og:image` + `summary_large_image` — WhatsApp shares render the branded card.
- Supabase Auth hardened: `site_url` set to the serving host, `uri_allow_list` covers the vercel.app host, both custom hosts and localhost.
- Canonicals/sitemap/robots serve from `https://jisr-to-china-henna.vercel.app` (the one host that actually serves).

**Custom-domain investigation (bridge-to-china.com):** the domain (registered 2011, Xin Net/xincache nameservers) has its apex AND www records pointing to legacy hosting on AS2516 (`106.186.19.42`) — it has **never** pointed at Vercel; the Vercel "verified" flags came from TXT records only. A redirect experiment was run and fully reverted after live testing exposed this. **No production traffic was affected** (the platform continued serving on henna throughout; verified mid- and post-experiment).

**Owner action to activate the custom domain** (DNS changes at the Xin Net registrar — then flip `settings.site_url`, auth `site_url`, and the henna redirect, all already prepared):

| Record | Type | Value |
|---|---|---|
| `bridge-to-china.com` | A | `76.76.21.21` |
| `www.bridge-to-china.com` | CNAME | `cname.vercel-dns.com` |

Vercel-side config is already staged for that switch: www serves, apex 308 → www, and the auth allowlist already admits both hosts.

**Redeploy note:** `robots.txt` and `sitemap.xml` are Next.js build-time metadata routes — they snapshot `settings.site_url` at build time. After any future `site_url` change (e.g. when the custom domain goes live), push any commit or trigger a redeploy so they re-bake; per-page canonicals update via ISR within 60 s on their own.

---

## 11. Session 3 — environment handover recovery (2026-11-10)

A new AI development environment took over the project per the owner's handover directive and completed full recovery before changing anything:

- **Git:** `44fce32` and `e3069da` confirmed pushed and deployed (the earlier "two commits ahead locally" note is obsolete — both landed on GitHub and auto-deployed). `improvement/audit-remediation` (`77fc550`) is fully contained in the default branch. Clean tree, no tags, nothing dangling.
- **Production:** latest Vercel deployment READY from `e3069da`; the project runs with zero env vars by design (committed publishable-key fallback; no service-role key exists in the codebase, and the pre-commit scanner keeps it that way).
- **Database:** `jisr-to-china` ACTIVE_HEALTHY (Postgres 17.6, eu-central-1). Migration-history mismatch documented and resolved as benign: remote history holds 30 entries (≈ `0001`–`0029`); `0030`–`0033` are absent from the table but **verified live in the schema** (0032 indexes + constrained insert policies, 0033 `default_og_image`, post-0030/0031 renamed settings keys). No history repair attempted, per the handover.
- **DB-06 re-verified live:** `is_admin()` still returns true for both `admin` and `editor` roles — remains the next database work item before any editor is hired.
- **Search Console:** the owner's new verification token was added to `verification.google` in `src/app/layout.tsx` (legacy token retained alongside — one meta tag each). Rendered HTML verified on the dev server; tsc + eslint clean.
- **Emails:** confirmed absent from the codebase — the two Resend workflows (applicant confirmation + owner notification) are greenfield and blocked on the owner's fresh restricted key + notification address.
- **Skills:** the previous 27-skill install lived in an untracked `skills/` folder and was lost in the handover; the new environment re-cloned all nine owner-requested repos (122 skills) and maps its native skill system onto them — see `docs/AI-SKILLS-INVENTORY.md`.
- Full evidence and the twelve recovery answers: `docs/PROJECT-RECOVERY-REPORT.md`.

**Untouched, per owner decisions:** admission-letter samples and their storage, DNS/custom domain (postponed), brand/identity, production data (read-only inspection only).

---

## 12. Session 4 — email automation, DB-06, rate limiting, blog batch 1 (2026-11)

Continuing the master directive with the owner's notification address provided (`mohmonef6@gmail.com`,
delivered via the chat channel and stored only in the gitignored `.env.local` + Vercel-style env
documentation — never in the public repo).

### Phase 4 — two-way lead email notifications (implemented & locally verified)

- **New `src/lib/email/` module** (no new dependencies — plain `fetch` to the Resend API):
  `config.ts` (env-gated), `templates.ts` (applicant confirmation in AR/EN/RU with true RTL for
  Arabic + English owner notification), `notifications.ts` (dispatcher).
- **Applicant confirmation** — subject "Your Request Has Been Received Successfully — Bridge to
  China Edu" (localized AR/RU equivalents), confirms receipt only (explicit no-admission/no-
  scholarship disclaimer), includes the service, the unique reference and next steps; mobile-
  friendly inline-styled HTML, image-free, with plain-text alternative. Reply-to routes to the
  owner's notification address.
- **Owner notification** — subject "New Student Inquiry — Bridge to China Edu": student name,
  email, phone/WhatsApp, country, service, track, scholarship interest, preferred contact,
  submission time (UTC), website language, unique lead reference + lead ID, and a link to the
  admin leads dashboard.
- **References:** stable `BTC-XXXXXXXX` derived deterministically from the lead UUID
  (`src/lib/leads/reference.ts`) — no schema change needed, shown to the applicant in the success
  state (all three locales), quoted in both emails, displayed and searchable in the admin
  leads table.
- **Reliability contract:** the API route generates the UUID server-side (RLS grants anon no
  SELECT, so insert+returning would return empty), persists the lead FIRST, then dispatches both
  emails best-effort — email failure can never lose a lead or fail the response. Resend
  idempotency keys (`lead-{uuid}-confirmation/owner-notice`) prevent duplicate sends; one retry
  on 429/5xx/network; errors classified and logged by reference only (no keys, no PII).
- **Delivery status:** recorded on the lead row via a tightly-bounded RPC (migration 0035) —
  feature-detected: while the migration is unapplied the dispatcher degrades to log-only mode
  (verified live). Statuses surface in the admin leads table once 0035 lands.
- **Verified:** browser golden path on :3000 — Arabic form submit → `201 {ok:true, reference:
  BTC-5F816BB1}` → reference rendered in the success UI; EN/RU render; zero console errors;
  dev log shows the expected `[lead-email] ref=… skipped — email not configured` line; all four
  templates structurally verified (RTL/LTR directions, content, no unresolved placeholders,
  clean text parts).
- **Not yet possible:** a real end-to-end send — the previously shared Resend key is treated as
  compromised and no fresh restricted key exists. Activation steps are in
  `docs/COMMERCIAL-READINESS-REPORT.md`.

### Database work (written, application pending credentials)

Three idempotent migrations written; none applied — this environment holds no Supabase
management credentials (verified: both new RPCs return `PGRST202` against production):

- **`0034_split_admin_editor_roles.sql` (DB-06):** `is_admin()` now means `role='admin'` only;
  new `is_staff()` (admin or editor) powers all content tables + the media bucket. Leads,
  analytics, settings and users stay admin-only. The current single admin is unaffected;
  future editor accounts can no longer inherit full administrator privileges.
- **`0035_lead_notification_status.sql`:** `confirmation_status`/`owner_notice_status` columns
  (sent|failed|skipped), the bounded `record_lead_notification()` RPC (24 h recency window,
  enum validation, 200-char error cap) and a hardened `leads_public_insert` that keeps both
  status columns out of the anon insert surface.
- **`0036_shared_rate_limiting.sql`:** cross-instance fixed-window limiter inside the existing
  Supabase (free tier, no new infrastructure) — `rate_limit_hits` + atomic `consume_rate_limit()`
  with input validation, probabilistic pruning and a hard row cap; table hidden from all client
  roles. The application side (`sharedLimited()` in `src/lib/rate-limit.ts`) is already live on
  both `/api/leads` and `/api/track` and fails open (verified live: PGRST202 probe → silent
  fallback; the in-memory limiter remains the per-instance first line).

### Blog batch 1 (Phase 6)

Five articles written natively in AR/EN/RU as migration `0037_blog_batch_1.sql` (CSC guide, X1/X2
visa, English-taught degrees, HSK levels, costs) — see `docs/EDITORIAL-CONTENT-PLAN.md` for the
full 30-topic plan. All 15 bodies pass the project's real `sanitizeRichText` with headings/links
intact; hrefs limited to five official domains + 54 localized internal links; unique brand-scene
covers. They go live (blog archive + sitemap) the moment the migration is applied.

### Housekeeping / known state

- **Test records:** this session created exactly one clearly-marked verification lead
  (`BTC-5F816BB1`, name "TEST VERIFICATION — SESSION 4 — SAFE TO DELETE") through the real API.
  Together with the previously documented test lead + test analytics event, all three await
  deletion via admin credentials (Phase 3D cleanup).
- **Commits:** `9dae837` (email feature), `a3f5775` (migrations 0034–0036), plus the blog-batch
  commit — **all local; push requires GitHub credentials this environment does not hold**
  (verified: `git push` → no stored credentials). Production therefore still serves `2d88802`.
- Owner decisions untouched: admission-letter samples, DNS/custom domain, brand, canonicals.
