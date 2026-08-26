-- =========================================================
-- Prompt 2 §8: lightweight, privacy-respecting analytics.
-- Append-only table: anon can insert, only the admin can read/delete.
-- No IP, no raw user-agent, no PII of any kind is stored.
-- =========================================================

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  page_path text not null,
  locale text check (locale in ('ar','en','ru')),
  device_type text check (device_type in ('mobile','tablet','desktop')),
  referrer_source text check (referrer_source in ('direct','organic','social','whatsapp','other')),
  session_id uuid,
  created_at timestamptz not null default now()
);
create index if not exists analytics_events_created_idx on public.analytics_events(created_at desc);
create index if not exists analytics_events_name_idx on public.analytics_events(event_name);

alter table public.analytics_events enable row level security;

create policy analytics_events_insert on public.analytics_events
  for insert to anon, authenticated with check (true);
create policy analytics_events_admin_read on public.analytics_events
  for select to authenticated using (public.is_admin());
create policy analytics_events_admin_delete on public.analytics_events
  for delete to authenticated using (public.is_admin());
