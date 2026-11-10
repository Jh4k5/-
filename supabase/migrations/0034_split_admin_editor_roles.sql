-- 0034_split_admin_editor_roles.sql
--
-- DB-06 (Phase 3 audit): `is_admin()` returned true for BOTH 'admin' and
-- 'editor' rows in public.users, so every "admin" RLS policy actually granted
-- full administrator privileges — including leads (PII), analytics, settings
-- and the users table — to any future editor account.
--
-- This migration separates the two roles:
--
--   is_admin() → true only for role = 'admin'      (unchanged call sites)
--   is_staff() → true for role in ('admin','editor') (content + media)
--
-- Privilege split applied to the existing 41-policy inventory:
--   • ADMIN ONLY (is_admin): leads, analytics_events, settings, users.
--     These carry personal data, business analytics, site identity and
--     account information — editors have no business touching them.
--   • STAFF (is_staff): every content table (articles, services,
--     universities, study paths, destinations + media, stories, gallery,
--     faqs, admissions, cost factors, why-china, process steps/stages/
--     trust badges, site sections) plus the storage `media` bucket
--     (editors must upload article cover images).
--   • Public read policies are unchanged.
--
-- The single existing admin account (role 'admin') keeps every privilege —
-- no behavior change for the current operator.
--
-- Idempotent: safe to re-run. Additive: no data is touched.
-- Apply with: supabase db push (or paste into the SQL editor).

-- ---------------------------------------------------------------------------
-- 1 · Role helper functions
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.users u
    where u.id = auth.uid() and u.role = 'admin'
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.users u
    where u.id = auth.uid() and u.role in ('admin', 'editor')
  );
$$;

-- ---------------------------------------------------------------------------
-- 2 · Content tables → staff (admin or editor)
--    Same shape as before, only the predicate changes. The (select …)
--    wrapper keeps the DB-11 InitPlan optimization.
-- ---------------------------------------------------------------------------

-- articles
drop policy if exists articles_admin_write on public.articles;
create policy articles_admin_write on public.articles
  for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));

-- services
drop policy if exists services_admin_write on public.services;
create policy services_admin_write on public.services
  for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));

-- universities
drop policy if exists universities_admin_write on public.universities;
create policy universities_admin_write on public.universities
  for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));

-- study_paths
drop policy if exists study_paths_admin_write on public.study_paths;
create policy study_paths_admin_write on public.study_paths
  for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));

-- destination media
drop policy if exists destinations_admin_write on public.destination_media;
create policy destinations_admin_write on public.destination_media
  for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));

-- success stories
drop policy if exists stories_admin_write on public.success_stories;
create policy stories_admin_write on public.success_stories
  for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));

-- gallery
drop policy if exists gallery_admin_write on public.gallery;
create policy gallery_admin_write on public.gallery
  for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));

-- faqs
drop policy if exists faqs_admin_write on public.faqs;
create policy faqs_admin_write on public.faqs
  for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));

-- admissions (trust evidence — public read still consent-gated by 0032)
drop policy if exists admissions_admin_write on public.admissions;
create policy admissions_admin_write on public.admissions
  for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));

-- cost factors
drop policy if exists cost_factors_admin_write on public.cost_factors;
create policy cost_factors_admin_write on public.cost_factors
  for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));

-- why china points
drop policy if exists why_china_points_admin_write on public.why_china_points;
create policy why_china_points_admin_write on public.why_china_points
  for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));

-- process steps / stages / trust badges
drop policy if exists process_steps_admin_write on public.process_steps;
create policy process_steps_admin_write on public.process_steps
  for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));

drop policy if exists process_stages_admin_write on public.process_stages;
create policy process_stages_admin_write on public.process_stages
  for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));

drop policy if exists process_trust_badges_admin_write on public.process_trust_badges;
create policy process_trust_badges_admin_write on public.process_trust_badges
  for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));

-- site sections (homepage composition)
drop policy if exists sections_admin_write on public.site_sections;
create policy sections_admin_write on public.site_sections
  for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));

-- storage media bucket — editors need cover-image uploads for articles.
-- (Policies live on storage.objects, which is managed by Supabase; the
-- same drop/create pattern works because the table lives in the storage
-- schema of the same database.)
drop policy if exists "media_admin_insert" on storage.objects;
create policy "media_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and (select public.is_staff()));

drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and (select public.is_staff()))
  with check (bucket_id = 'media' and (select public.is_staff()));

drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and (select public.is_staff()));

-- ---------------------------------------------------------------------------
-- 3 · Admin-only tables — predicate now really means admin
--    (policies are re-created verbatim so the narrowed is_admin() takes
--    effect; leads/analytics/settings/users)
-- ---------------------------------------------------------------------------

-- leads (PII) — read/write/delete stay admin-only
drop policy if exists leads_admin_read on public.leads;
create policy leads_admin_read on public.leads
  for select to authenticated using ((select public.is_admin()));

drop policy if exists leads_admin_update on public.leads;
create policy leads_admin_update on public.leads
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists leads_admin_delete on public.leads;
create policy leads_admin_delete on public.leads
  for delete to authenticated using ((select public.is_admin()));

-- analytics events
drop policy if exists analytics_events_admin_read on public.analytics_events;
create policy analytics_events_admin_read on public.analytics_events
  for select to authenticated using ((select public.is_admin()));

drop policy if exists analytics_events_admin_delete on public.analytics_events;
create policy analytics_events_admin_delete on public.analytics_events
  for delete to authenticated using ((select public.is_admin()));

-- settings (site identity, URLs, brand) — admin only
drop policy if exists settings_admin_write on public.settings;
create policy settings_admin_write on public.settings
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- users table: self-select stays; the is_admin() branch is now truly admin
drop policy if exists users_select_self on public.users;
create policy users_select_self on public.users
  for select to authenticated
  using ((id = auth.uid()) or (select public.is_admin()));

-- ---------------------------------------------------------------------------
-- 4 · Grant the helper to authenticated roles (idempotent)
-- ---------------------------------------------------------------------------
revoke execute on function public.is_staff() from public;
grant execute on function public.is_staff() to authenticated, anon, service_role;
revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon, service_role;
