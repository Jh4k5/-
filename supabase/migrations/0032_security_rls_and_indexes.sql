-- 0032_security_rls_and_indexes.sql
--
-- Security remediation from the Phase 3 audit (2026-11):
--   DB-01: admissions public read must enforce student_consent (matches the
--          contract documented in 0008 and the pattern already used for
--          success_stories in 0006).
--   DB-03: leads public insert must constrain what anon can write
--          (status/source/lengths) instead of `with check (true)`.
--   DB-04: analytics_events public insert must constrain event names/lengths.
--   DB-08: partial indexes for the public read paths (status filter + order).
--   DB-11: wrap is_admin() calls in (select …) so the planner can evaluate
--          them once per statement instead of per row.
--
-- Review checklist before applying (production):
--   * Back up first (Supabase dashboard → Database → Backups).
--   * All statements are additive and idempotent; they can re-run safely.
--   * No row data is changed except the analytics event-name allowlist seed.
-- Apply with: supabase db push (or paste into the SQL editor).

-- ---------------------------------------------------------------------------
-- DB-01 · admissions: consent enforced at the policy level
-- ---------------------------------------------------------------------------
drop policy if exists admissions_public_read on public.admissions;
create policy admissions_public_read on public.admissions
  for select to anon, authenticated
  using (
    (
      is_visible
      and status = 'published'
      and student_consent
    )
    or (select public.is_admin())
  );

-- ---------------------------------------------------------------------------
-- DB-03 · leads: constrain the public insert surface
-- Without this, anyone holding the (public) anon key can insert rows with an
-- arbitrary status/source and unbounded text straight through PostgREST,
-- skipping every application-level check.
-- ---------------------------------------------------------------------------
drop policy if exists leads_public_insert on public.leads;
create policy leads_public_insert on public.leads
  for insert to anon, authenticated
  with check (
    status = 'new'
    and source in ('contact_form', 'eligibility_check')
    and char_length(full_name) between 1 and 120
    and char_length(phone) between 1 and 40
    and char_length(country) between 1 and 80
    and char_length(coalesce(message, '')) <= 2000
    and char_length(coalesce(email, '')) <= 160
  );

-- ---------------------------------------------------------------------------
-- DB-04 · analytics_events: constrain the public insert surface
-- Mirrors the validation the /api/track route performs (event-name allowlist
-- + length caps) so direct PostgREST writes cannot poison or bloat the table.
-- ---------------------------------------------------------------------------
drop policy if exists analytics_events_insert on public.analytics_events;
create policy analytics_events_insert on public.analytics_events
  for insert to anon, authenticated
  with check (
    char_length(event_name) between 1 and 40
    and char_length(page_path) between 1 and 200
    and event_name in (
      'hero_primary_click', 'whatsapp_click', 'services_view',
      'process_expand', 'eligibility_start', 'eligibility_complete',
      'form_start', 'form_error', 'form_submit', 'admission_open',
      'story_open', 'scroll_50', 'scroll_90'
    )
  );

-- ---------------------------------------------------------------------------
-- DB-08 · partial indexes for the public read paths
-- Every public fetch filters status = 'published' and orders by display_order;
-- none of those columns were indexed (except articles). Partial indexes keep
-- them small and aligned with the RLS predicate.
-- ---------------------------------------------------------------------------
create index if not exists services_public_order_idx
  on public.services (display_order) where status = 'published';
create index if not exists process_steps_public_order_idx
  on public.process_steps (display_order) where status = 'published';
create index if not exists process_trust_badges_public_order_idx
  on public.process_trust_badges (display_order) where status = 'published';
create index if not exists why_china_points_public_order_idx
  on public.why_china_points (display_order) where status = 'published';
create index if not exists universities_public_order_idx
  on public.universities (display_order) where status = 'published';
create index if not exists success_stories_public_order_idx
  on public.success_stories (display_order) where status = 'published';
create index if not exists gallery_public_order_idx
  on public.gallery (display_order) where status = 'published';
create index if not exists destination_media_public_order_idx
  on public.destination_media (display_order) where status = 'published';

-- Admissions public path additionally filters visibility + consent.
create index if not exists admissions_public_idx
  on public.admissions (display_order)
  where (is_visible and status = 'published' and student_consent);

-- FAQ category lookups on the language-platform page.
create index if not exists faqs_public_category_idx
  on public.faqs (category, display_order) where status = 'published';

-- Admin orders leads by created_at desc without a status equality filter,
-- so the existing (status, created_at) index cannot serve it.
create index if not exists leads_created_idx
  on public.leads (created_at desc);

-- ---------------------------------------------------------------------------
-- DB-11 · evaluate is_admin() once per statement in the remaining policies
-- The (select …) wrapper lets Postgres use an InitPlan. Only the two policies
-- below were left unwrapped by earlier migrations; the ones recreated above
-- already use the wrapped form.
-- ---------------------------------------------------------------------------
drop policy if exists stories_public_read on public.success_stories;
create policy stories_public_read on public.success_stories
  for select to anon, authenticated
  using ((status = 'published' and consent) or (select public.is_admin()));

drop policy if exists users_select_self on public.users;
create policy users_select_self on public.users
  for select
  using ((id = auth.uid()) or (select public.is_admin()));
