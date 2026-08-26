-- =========================================================
-- Prompt 2 §2: add a real draft/published workflow + updated_at
-- tracking to every content table that lacked it. Purely additive.
--
-- SAFETY: `status` defaults to 'draft' for NEW rows going forward,
-- but every table gets an explicit UPDATE backfilling ALL EXISTING
-- rows to 'published' in this same migration, before the RLS
-- policies below start filtering on it — otherwise every existing
-- row would silently vanish from the public site the moment this
-- migration lands. Do not skip the backfill step for any table.
-- =========================================================

-- ---------- services ----------
alter table public.services
  add column if not exists status text not null default 'draft' check (status in ('draft','published')),
  add column if not exists updated_at timestamptz;
update public.services set status = 'published', updated_at = coalesce(created_at, now());
drop trigger if exists services_touch on public.services;
create trigger services_touch before update on public.services
for each row execute function public.touch_updated_at();
drop policy if exists services_public_read on public.services;
create policy services_public_read on public.services
  for select to anon, authenticated using (status = 'published' or public.is_admin());

-- ---------- process_steps ----------
alter table public.process_steps
  add column if not exists status text not null default 'draft' check (status in ('draft','published')),
  add column if not exists updated_at timestamptz;
update public.process_steps set status = 'published', updated_at = coalesce(created_at, now());
drop trigger if exists process_steps_touch on public.process_steps;
create trigger process_steps_touch before update on public.process_steps
for each row execute function public.touch_updated_at();
drop policy if exists process_steps_public_read on public.process_steps;
create policy process_steps_public_read on public.process_steps
  for select to anon, authenticated using (status = 'published' or public.is_admin());

-- ---------- process_trust_badges ----------
alter table public.process_trust_badges
  add column if not exists status text not null default 'draft' check (status in ('draft','published')),
  add column if not exists updated_at timestamptz;
update public.process_trust_badges set status = 'published', updated_at = coalesce(created_at, now());
drop trigger if exists process_trust_badges_touch on public.process_trust_badges;
create trigger process_trust_badges_touch before update on public.process_trust_badges
for each row execute function public.touch_updated_at();
drop policy if exists process_trust_badges_public_read on public.process_trust_badges;
create policy process_trust_badges_public_read on public.process_trust_badges
  for select to anon, authenticated using (status = 'published' or public.is_admin());

-- ---------- why_china_points ----------
alter table public.why_china_points
  add column if not exists status text not null default 'draft' check (status in ('draft','published')),
  add column if not exists updated_at timestamptz;
update public.why_china_points set status = 'published', updated_at = coalesce(created_at, now());
drop trigger if exists why_china_points_touch on public.why_china_points;
create trigger why_china_points_touch before update on public.why_china_points
for each row execute function public.touch_updated_at();
drop policy if exists why_china_points_public_read on public.why_china_points;
create policy why_china_points_public_read on public.why_china_points
  for select to anon, authenticated using (status = 'published' or public.is_admin());

-- ---------- universities ----------
alter table public.universities
  add column if not exists status text not null default 'draft' check (status in ('draft','published')),
  add column if not exists updated_at timestamptz;
update public.universities set status = 'published', updated_at = coalesce(created_at, now());
drop trigger if exists universities_touch on public.universities;
create trigger universities_touch before update on public.universities
for each row execute function public.touch_updated_at();
drop policy if exists universities_public_read on public.universities;
create policy universities_public_read on public.universities
  for select to anon, authenticated using (status = 'published' or public.is_admin());

-- ---------- success_stories ----------
alter table public.success_stories
  add column if not exists status text not null default 'draft' check (status in ('draft','published')),
  add column if not exists updated_at timestamptz,
  add column if not exists consent boolean not null default false;
update public.success_stories set status = 'published', updated_at = coalesce(created_at, now()), consent = true;
drop trigger if exists success_stories_touch on public.success_stories;
create trigger success_stories_touch before update on public.success_stories
for each row execute function public.touch_updated_at();
drop policy if exists stories_public_read on public.success_stories;
create policy stories_public_read on public.success_stories
  for select to anon, authenticated using ((status = 'published' and consent) or public.is_admin());

-- ---------- destination_media ----------
alter table public.destination_media
  add column if not exists status text not null default 'draft' check (status in ('draft','published')),
  add column if not exists updated_at timestamptz,
  add column if not exists alt_text text;
update public.destination_media set status = 'published', updated_at = coalesce(created_at, now());
drop trigger if exists destination_media_touch on public.destination_media;
create trigger destination_media_touch before update on public.destination_media
for each row execute function public.touch_updated_at();
drop policy if exists destinations_public_read on public.destination_media;
create policy destinations_public_read on public.destination_media
  for select to anon, authenticated using (status = 'published' or public.is_admin());

-- ---------- gallery ----------
alter table public.gallery
  add column if not exists status text not null default 'draft' check (status in ('draft','published')),
  add column if not exists updated_at timestamptz,
  add column if not exists alt_text text;
update public.gallery set status = 'published', updated_at = coalesce(created_at, now());
drop trigger if exists gallery_touch on public.gallery;
create trigger gallery_touch before update on public.gallery
for each row execute function public.touch_updated_at();
drop policy if exists gallery_public_read on public.gallery;
create policy gallery_public_read on public.gallery
  for select to anon, authenticated using (status = 'published' or public.is_admin());

-- ---------- admissions: add status alongside the existing is_visible ----------
alter table public.admissions
  add column if not exists status text not null default 'draft' check (status in ('draft','published')),
  add column if not exists updated_at timestamptz;
update public.admissions set status = 'published', updated_at = coalesce(created_at, now());
drop trigger if exists admissions_touch on public.admissions;
create trigger admissions_touch before update on public.admissions
for each row execute function public.touch_updated_at();
drop policy if exists admissions_public_read on public.admissions;
create policy admissions_public_read on public.admissions
  for select to anon, authenticated using ((is_visible and status = 'published') or public.is_admin());

-- ---------- articles: add cover image alt text (the only table already publish-gated) ----------
alter table public.articles
  add column if not exists cover_image_alt text;
