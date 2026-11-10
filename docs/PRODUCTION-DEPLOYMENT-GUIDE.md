# Production Deployment Guide — Session 5

**Scope:** moving the four local commits (`9dae837`, `a3f5775`, `7dc50de`, `fffecab`) safely to
production: GitHub push → Vercel auto-deploy → Supabase migrations 0034–0037 → Resend activation →
blog publication → Search Console.

**State as of this document (2026-11-10):**

| Item | State |
|---|---|
| Local branch `claude/jisr-china-trilingual-platform-wzojbr` | 4 commits ahead of origin (verified, clean tree, no secrets) |
| Production (Vercel) | serves `2d88802` — does **not** yet contain email/DB/blog work |
| Production database | migrations 0030–0033 applied & verified live; **0034–0037 not yet applied** |
| Blog articles | **not yet published** — they exist only in migration `0037` (local file) |
| Resend | no key anywhere; sandbox `.env.local` holds `LEAD_NOTIFICATION_TO` only |
| GSC token | deployed on production since `063f80b` (verified in served HTML) |

---

## Part A — GitHub push (blocked on credentials; exact setup below)

### Why it is blocked

The sandbox holds **no GitHub credentials** — verified: no credential helper, no
`~/.git-credentials`, no `gh` CLI, no token in the environment. The credentials used in earlier
sessions were rotated per the exposure policy (recovery report §6), which is why they are gone.
`git ls-remote` works (the repo is public and readable), so connectivity is fine — only
**authentication for push** is missing.

### What was verified before this conclusion (do not repeat)

- Branch: `claude/jisr-china-trilingual-platform-wzojbr`; remote branch at `2d88802` → the push
  is a clean fast-forward of exactly 4 commits. No history rewrite, no force needed (and
  force-push is forbidden for this repo).
- Working tree: tracked files clean; only sandbox artifacts are untracked (`skills/`,
  `.zscripts/`, `Caddyfile` — never to be committed).
- Secrets scan of the full 4-commit diff: pattern scan + high-entropy scan + `.env.example`
  review — **clean** (only variable names, docs and code identifiers).
- Commit inventory: `9dae837` email/leads (+908 lines), `a3f5775` migrations 0034–0036 (+414),
  `7dc50de` blog batch 1 + editorial plan (+842), `fffecab` session-4 reports (+246).

### Secure credential setup (owner action)

1. Create a **fine-grained Personal Access Token**:
   GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens →
   *Generate new token*:
   - **Repository access:** *Only select repositories* → `Jh4k5/-`
   - **Permissions:** `Contents: Read and write` (nothing else; Metadata is granted implicitly)
   - **Expiration:** 7 days (short — it exists only for this push)
2. Deliver it through a **secure channel, not chat**:
   - Preferred: the same secure environment-settings mechanism you use for the Resend key —
     set it as `GITHUB_TOKEN` for this workspace, then tell me it is set. I will wire git to
     read it from the environment (value never printed), push the four commits, and confirm.
   - Fallback (documented exposure): if no secure channel can hold it, a repo-scoped,
     contents-only, 7-day token may be pasted in chat **with the explicit agreement that it is
     revoked immediately after I confirm the push**. This is the last resort, not the default.
3. After the push is confirmed: **revoke the token** (or let it expire).

### What happens after the push

The Vercel project `jisr-to-china` is GitHub-linked to this branch and **auto-deploys** every
push (verified end-to-end in session 2; typically live in ~1 minute). The push alone already
ships: the email feature (inert until the Resend key exists — leads keep saving, emails are
recorded as `skipped`), the rate-limiter upgrade (fails open if RPC missing), the admin
leads-table email columns, and all session-4 documentation. **Database migrations 0034–0037 are
NOT part of the deploy** — they are applied separately (Part B).

---

## Part B — Supabase migration preflight & safe sequential procedure

### Verified preflight findings (this session)

1. **All four migrations are idempotent and additive:**
   - `0034_split_admin_editor_roles.sql` — re-creates role helpers (`is_admin()` now truly
     admin-only; new `is_staff()` = admin ∪ editor) and 41 policies via `drop policy if exists`
     + `create`. **No row data is touched. The current admin account keeps every privilege —
     no lockout path exists** (the only policy on `users` remains self-select + admin).
   - `0035_lead_notification_status.sql` — `add column if not exists` ×2 (nullable status
     columns), rebuilds the public insert policy *more* restrictively, creates a bounded
     SECURITY DEFINER RPC (`record_lead_notification`). The app **feature-detects** the RPC and
     falls back to log-only mode when it is missing.
   - `0036_shared_rate_limiting.sql` — `create table if not exists`, RLS on, all privileges
     revoked from client roles, atomic upsert RPC `consume_rate_limit` with input validation,
     opportunistic pruning and a 50k-row hard cap. The app **fails open** (per-instance limiter
     still guards each instance) when the RPC is missing or slow.
   - `0037_blog_batch_1.sql` — five `insert … on conflict (slug) do nothing` statements.
     Schema-compatible with `public.articles` (verified column-by-column), categories valid
     (`tips`×2, `universities`, `about_china`, `student_life`), status `published`, covers use
     built-in brand scenes (`scene:campus-gate`, `scene:night-bridge`, `scene:campus-library`,
     `scene:xian`, `scene:hangzhou` — all five confirmed present in `SceneArt.tsx`).
2. **Remote history vs local files (documented state, recovery report §3.3):**
   - Remote `supabase_migrations.schema_migrations`: 30 entries, timestamp versions
     (`20260816004552`…`20260828200914`) ≈ local `0001`–`0029`.
   - `0030`–`0033`: applied out-of-band in session 2 (statement-by-statement via the
     Management API) and verified live in the schema — but **absent from the history table**.
3. **⚠️ Never run `supabase db push` on this project.** Local files use `00NN_` names; remote
   history uses timestamps — `db push` would consider all 37 local files unapplied and try to
   re-run them. `0001_init.sql` contains 21 unguarded `create policy` statements → it fails
   loudly (safe, but a mess), and re-running `0030`/`0031` (plain UPDATEs with no guards) would
   **clobber any owner edits** made since to `footer_note`, `footer_builtwith`,
   `about_story_text`. The SQL-editor path below is the established, safe procedure.
4. **Never reset the production database.** Not required by anything in this guide.

### Preflight queries (run in Supabase Dashboard → SQL Editor, read-only)

```sql
-- P1 · Confirm the owner account holds the admin role BEFORE touching anything.
-- Must return one row with role = 'admin' for the owner's login address.
select u.id, u.email, u.role, a.last_sign_in_at
from public.users u
join auth.users a on a.id = u.id;

-- P2 · Baseline: current role helper behaviour (documents DB-06 pre-fix state).
select public.is_admin() as is_admin_now;  -- run signed-in as owner via the app; expected true

-- P3 · Baseline: article count before the blog batch (expected: current count, e.g. 0–2).
select count(*), count(*) filter (where status = 'published') from public.articles;

-- P4 · Baseline: rate-limit table must not exist yet.
select to_regclass('public.rate_limit_hits');  -- expected null

-- P5 · Baseline: lead status columns must not exist yet.
select column_name from information_schema.columns
where table_schema = 'public' and table_name = 'leads'
  and column_name in ('confirmation_status','owner_notice_status');  -- expected 0 rows
```

### Sequential application procedure

Apply **one migration at a time, in order**, in the Supabase Dashboard → SQL Editor (or via the
Management API if a scoped PAT is provided to the agent). After each step, run its verification
query before proceeding.

**Step 1 — apply `0034_split_admin_editor_roles.sql` (entire file), then verify:**

```sql
-- V1 · Helpers exist and behave for each role value.
select proname from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and proname in ('is_admin','is_staff');  -- 2 rows

-- V2 · Spot-check the privilege split took effect.
select tablename, policyname, qual from pg_policies
where schemaname = 'public' and tablename in ('leads','articles')
order by tablename, policyname;  -- leads → is_admin; articles → is_staff
```

*Lockout safety:* the owner's account (role `admin` in P1) passes both `is_admin()` and
`is_staff()` — the admin dashboard, leads, settings and analytics remain fully accessible. If
P1 unexpectedly shows a role other than `admin`, **stop** and fix that first (never proceed).

**Step 2 — apply `0035_lead_notification_status.sql`, then verify:**

```sql
-- V3 · Both columns exist.
select column_name from information_schema.columns
where table_schema = 'public' and table_name = 'leads'
  and column_name in ('confirmation_status','owner_notice_status');  -- 2 rows

-- V4 · RPC exists and is executable by the API roles.
select p.proname, p.proconfig, has_function_privilege('anon', 'execute',
  'public.record_lead_notification(uuid,text,text,text)') as anon_can_execute;  -- true
```

**Step 3 — apply `0036_shared_rate_limiting.sql`, then verify:**

```sql
-- V5 · Table exists, RLS on, no client-role privileges, RPC present.
select relname, relrowsecurity from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and relname = 'rate_limit_hits';  -- relrowsecurity = true

select has_function_privilege('anon', 'execute',
  'public.consume_rate_limit(text,int,int)') as anon_can_execute;  -- true

-- V6 · Functional probe (safe): one self-counted hit in a private bucket pattern.
select public.consume_rate_limit('track:probe', 1000, 60);  -- false (not over limit)
```

**Step 4 — apply `0037_blog_batch_1.sql`, then verify (Part D has the full checklist):**

```sql
-- V7 · Exactly five published articles, all three language versions populated.
select slug, category, status,
  (title_ar is not null and content_ar <> '') as ar_ok,
  (title_en is not null and content_en <> '') as en_ok,
  (title_ru is not null and content_ru <> '') as ru_ok
from public.articles order by created_at;  -- 5 rows, all *_ok = true, status = 'published'
```

### After all four steps (optional bookkeeping)

The history table remains without `0030`–`0037` entries. This is **cosmetic** — the established
convention for this project is SQL-editor application, and `db push` is forbidden anyway (see
finding 3). If you want the history table to reflect reality, run:

```sql
insert into supabase_migrations.schema_migrations (version, statements) values
  ('0030', '{}'), ('0031', '{}'), ('0032', '{}'), ('0033', '{}'),
  ('0034', '{}'), ('0035', '{}'), ('0036', '{}'), ('0037', '{}')
on conflict (version) do nothing;
```

If the `statements` column rejects the literal (schema varies by platform version), skip this
step entirely — it is not required for correctness.

### Rollback notes (not expected to be needed)

- 0034–0036 are policy/function DDL — their previous state is restorable from the migration
  files' `drop … if exists` predecessors (documented in git history). Nothing here deletes data.
- 0037 inserts five rows; inverse = `delete from public.articles where slug in (…five slugs…)`.
- **Never** "roll back" by resetting the database.

---

## Part C — Resend production configuration

### The three environment variables (Vercel → Project `jisr-to-china` → Settings → Environment Variables → Production)

| Variable | Value | Notes |
|---|---|---|
| `RESEND_API_KEY` | *(your fresh restricted key — never paste into chat)* | Create at resend.com → API Keys → *Create API Key* → restrict to **Sending access** only. The old key pasted in a previous session is treated as exposed — if it still exists, delete it first. |
| `LEAD_NOTIFICATION_TO` | *(the owner-provided recipient — already set in the sandbox `.env.local`, verified; kept out of this public repo)* | Owner address receiving "New Student Inquiry — Bridge to China Edu". |
| `LEAD_NOTIFICATION_FROM` | see decision below | Verified sender for both emails. |

### `LEAD_NOTIFICATION_FROM` decision — is a verified sending domain required?

**Yes, for applicant confirmations. No, for a first owner-notification test.**

- **Without any verified domain**, Resend only lets you send from `onboarding@resend.dev`,
  and that shared test sender **delivers only to the Resend account owner's own address**.
  So: register the Resend account with the owner address (the same one configured
  as `LEAD_NOTIFICATION_TO`), set
  `LEAD_NOTIFICATION_FROM=onboarding@resend.dev`, and the **owner notification** will genuinely
  arrive in that inbox during activation testing — while **applicant confirmations** to
  arbitrary addresses will fail (Resend rejects them) and be recorded as `failed` on the lead
  row (the lead itself is never lost).
- **To deliver applicant confirmations**, Resend requires a **verified sending domain**: you
  add the domain in Resend → Domains, receive DNS records (typically an SPF TXT, a DKIM TXT/CNAME
  pair, and an optional DMARC record), publish them at the DNS provider, and wait for
  verification. `bridge-to-china.com` currently still points at the old IP and its DNS is not
  yet under your control (see IMPROVEMENT-REPORT §10), so either finish the domain move first,
  or verify a different domain you control and use e.g. `notify@that-domain`.
- **Recommended sequencing:** ① activate with `onboarding@resend.dev` → ② confirm the owner
  notification arrives → ③ verify the sending domain whenever DNS is under your control → ④
  switch `LEAD_NOTIFICATION_FROM` to `notify@bridge-to-china.com` (or your chosen domain) and
  re-test with a real submission including your own address as the applicant email.

The code defaults `LEAD_NOTIFICATION_FROM` to `onboarding@resend.dev`, so **you may start by
setting only `RESEND_API_KEY` and `LEAD_NOTIFICATION_TO`** — no FROM is needed for step ①.

### Why the sandbox intentionally has no key

The sandbox dev server talks to the **production database**. Without a key in `.env.local`,
form submissions from the Review Panel save real leads but skip emails (recorded as `skipped`) —
this is deliberate: test traffic can never email real applicants. Keep it that way; configure
the key only in Vercel (production).

### Behaviour once configured (already implemented, verified locally)

- Lead persists **first**; both emails dispatch after — an email failure can never lose a lead.
- Applicant confirmation subject (by submission language): AR «تم استلام طلبك بنجاح — Bridge to
  China Edu» / EN "Your Request Has Been Received Successfully — Bridge to China Edu" / RU
  «Ваш запрос успешно получен — Bridge to China Edu» — content is confirmation-of-receipt only.
- Owner notification subject: "New Student Inquiry — Bridge to China Edu" with the lead summary,
  the applicant's preferred contact channel, the `BTC-XXXXXXXX` reference and a deep link to
  `/admin/leads`.
- One retry on 429/5xx/network; idempotency keys `lead-<uuid>-confirmation` /
  `lead-<uuid>-owner-notice` make retries safe.
- Delivery status per lead (`sent`/`failed`/`skipped`) is recorded once migration 0035 is
  applied and shown in the admin leads table (columns added in `9dae837`).

---

## Part D — Blog publication verification (only valid after Part B Step 4)

**Honest status: the five articles are NOT publicly published until the production database
contains them and the live pages return successfully.** Until then they exist only as a local
migration file.

Post-migration, verify in this order:

1. **Records** — SQL `V7` above returns 5 rows with all language versions `true` and
   `status = 'published'`.
2. **Trilingual content** — for each article: Arabic title/excerpt/body populated (and every
   internal link points at `/ar/…`), same for `/en`, `/ru`. SQL spot-check:
   ```sql
   select slug,
     length(content_ar) as ar_len, length(content_en) as en_len, length(content_ru) as ru_len
   from public.articles order by slug;
   ```
3. **Cover art** — each row's `cover_image` is one of the five `scene:*` brand scenes (no
   storage upload needed; rendering is code-side).
4. **Blog archive** — `https://jisr-to-china-henna.vercel.app/{ar,en,ru}/blog` lists five
   articles with category filtering working (`tips`, `universities`, `about_china`,
   `student_life`).
5. **Individual pages** — all **15 URLs** return 200:
   `/{locale}/blog/{chinese-government-scholarship-csc-guide|china-student-visa-x1-x2-guide|english-taught-degrees-china-guide|hsk-levels-guide-study-china|study-in-china-costs-guide}`
   for each of ar/en/ru.
6. **Sitemap integration** — `https://jisr-to-china-henna.vercel.app/sitemap.xml` now contains
   all 15 article URLs (the sitemap derives them from the same `articles` table automatically —
   verified in code and locally: unpublished slugs are correctly excluded today).
7. **Admin CMS** — `/admin/articles` lists the five rows; the editor opens each with all three
   language tabs populated.

---

## Part E — Google Search Console (final instructions)

The new verification token (`exO4pshzvmU92JX-E0Sjh3hBBvKqX9lzqMxLdU8AyYk`) is already deployed
to production (commit `063f80b`, live since session 3; re-verified this session in served HTML
on :3000 — exactly two `google-site-verification` meta tags: new + legacy).

**Owner steps (≈3 minutes):**

1. Go to **search.google.com/search-console** and sign in with the Google account that owns the
   property.
2. **Add property → URL prefix** → enter exactly:
   `https://jisr-to-china-henna.vercel.app`
3. Choose **HTML tag** verification → Google will show the tag → click **Verify** — it should
   verify immediately because the tag is already served by the live site. (The legacy token
   remains as a second tag so any previously-verified property stays verified.)
4. After verification, open **Sitemaps** (left menu) and — **recommended after Part B/D are
   done, so the sitemap already includes the 15 article URLs** — enter:
   ```
   sitemap.xml
   ```
   in the "Add a new sitemap" field (the full URL
   `https://jisr-to-china-henna.vercel.app/sitemap.xml` is filled automatically) → **Submit**.
   If you submit earlier, simply resubmit after the blog goes live.
5. Expect "Success" within minutes; article indexing then follows on Google's crawl schedule.

Notes: when the custom domain `bridge-to-china.com` finally moves to Vercel, add it as a
**separate URL-prefix property** (or a Domain property via DNS) and repeat verification there —
Google treats each host as its own property.

---

## Part F — Final verification checklist (after push + migrations + Resend)

| # | Check | Method | Expected |
|---|---|---|---|
| 1 | Production deployment status | Vercel dashboard (or API) — deployment for the pushed commit | `READY`, serving `9dae837…fffecab` lineage |
| 2 | Migration results | SQL `V1`–`V7` (Part B) | all pass |
| 3 | Owner admin access | Sign in to `/admin` on production | full access; leads/analytics/settings visible |
| 4 | Rate limiting | From the production site, submit the contact form 6+ times rapidly | later submissions blocked by the 429 limiter (⚠️ creates real leads — mark names `TEST`) |
| 5 | Applicant confirmation email | Submit one real lead with an email address you control | subject per submission language, `BTC-` reference present |
| 6 | Owner notification email | Same submission | "New Student Inquiry — Bridge to China Edu" arriving at the `LEAD_NOTIFICATION_TO` inbox |
| 7 | Lead email statuses | `/admin/leads` row for the test lead | `confirmation`/`owner_notice` columns show `sent` (or documented `failed` reason) |
| 8 | Blog articles | Part D checks 4–6 | 15 URLs 200; archive lists 5; sitemap contains 15 |
| 9 | Trilingual | spot-check `/ar` (RTL), `/en`, `/ru` homepages + one article each | correct direction, language, hreflang tags |
| 10 | Sitemap & robots | fetch `/sitemap.xml`, `/robots.txt` | valid; sitemap has articles; robots blocks `/admin`,`/api` |

---

## Owner action summary (ordered)

1. **GitHub token** (Part A): fine-grained PAT → secure channel → push → revoke.
2. **Supabase**: either run Part B yourself in the SQL editor, or provide a scoped Supabase PAT
   via the secure channel and I execute it with the same procedure.
3. **Resend**: restricted sending key + `LEAD_NOTIFICATION_TO` (the owner recipient,
   set in Vercel — same value already verified in the sandbox `.env.local`) in Vercel;
   optionally `LEAD_NOTIFICATION_FROM` (start with the Resend default). Verified sending domain
   required before applicant confirmations can deliver (Part C).
4. **GSC**: verify the URL-prefix property now; submit `sitemap.xml` after the blog is live
   (Part E).
5. Cleanup when convenient: delete the three documented test records via the admin leads view
   (see IMPROVEMENT-REPORT §12 "Housekeeping").
