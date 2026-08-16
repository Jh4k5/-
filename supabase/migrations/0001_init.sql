-- =========================================================
-- Jisr to China (جسر إلى الصين) — trilingual platform schema
-- Applied to the project's Supabase database. Re-runnable on a fresh project.
-- =========================================================
create extension if not exists pgcrypto with schema extensions;

-- ---------- admin profiles (passwords are bcrypt-hashed inside auth.users) ----------
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null unique,
  role text not null default 'admin' check (role in ('admin','editor')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.users u
    where u.id = auth.uid() and u.role in ('admin','editor')
  );
$$;

-- ---------- articles ----------
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_ar text not null,
  title_en text,
  title_ru text,
  excerpt_ar text,
  excerpt_en text,
  excerpt_ru text,
  content_ar text not null default '',
  content_en text,
  content_ru text,
  cover_image text,
  category text not null default 'about_china'
    check (category in ('about_china','universities','student_life','tips')),
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists articles_status_idx on public.articles(status, created_at desc);

-- ---------- services ----------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null,
  title_en text,
  title_ru text,
  description_ar text not null default '',
  description_en text,
  description_ru text,
  icon text not null default 'graduation-cap',
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- success stories ----------
create table if not exists public.success_stories (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  photo text,
  achievement_ar text not null default '',
  achievement_en text,
  achievement_ru text,
  quote_ar text,
  quote_en text,
  quote_ru text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- generic gallery ----------
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption_ar text,
  caption_en text,
  caption_ru text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- destination media (cities / campuses / hero backgrounds) ----------
create table if not exists public.destination_media (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  category text not null default 'city' check (category in ('city','campus','hero')),
  title_ar text not null default '',
  title_en text,
  title_ru text,
  display_order int not null default 0,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists destination_media_cat_idx on public.destination_media(category, display_order);

-- ---------- leads ----------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  country text not null,
  current_qualification text not null
    check (current_qualification in ('high_school','bachelor','master')),
  desired_major text,
  chinese_level text
    check (chinese_level in ('none','beginner','hsk1_2','hsk3_4','hsk5_6')),
  preferred_contact text not null default 'whatsapp'
    check (preferred_contact in ('whatsapp','email','phone')),
  phone text not null,
  email text,
  message text,
  language text not null default 'ar' check (language in ('ar','en','ru')),
  status text not null default 'new' check (status in ('new','contacted','completed')),
  created_at timestamptz not null default now()
);
create index if not exists leads_status_idx on public.leads(status, created_at desc);

-- ---------- settings ----------
create table if not exists public.settings (
  key text primary key,
  value text,
  value_ar text,
  value_en text,
  value_ru text,
  updated_at timestamptz not null default now()
);

-- ---------- updated_at trigger ----------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists articles_touch on public.articles;
create trigger articles_touch before update on public.articles
for each row execute function public.touch_updated_at();

-- =========================================================
-- Row Level Security
-- =========================================================
alter table public.users             enable row level security;
alter table public.articles          enable row level security;
alter table public.services          enable row level security;
alter table public.success_stories   enable row level security;
alter table public.gallery           enable row level security;
alter table public.destination_media enable row level security;
alter table public.leads             enable row level security;
alter table public.settings          enable row level security;

create policy users_select_self on public.users
  for select to authenticated using (id = auth.uid() or public.is_admin());

create policy articles_public_read on public.articles
  for select to anon, authenticated using (status = 'published' or public.is_admin());
create policy articles_admin_write on public.articles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy services_public_read on public.services
  for select to anon, authenticated using (true);
create policy services_admin_write on public.services
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy stories_public_read on public.success_stories
  for select to anon, authenticated using (true);
create policy stories_admin_write on public.success_stories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy gallery_public_read on public.gallery
  for select to anon, authenticated using (true);
create policy gallery_admin_write on public.gallery
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy destinations_public_read on public.destination_media
  for select to anon, authenticated using (true);
create policy destinations_admin_write on public.destination_media
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy settings_public_read on public.settings
  for select to anon, authenticated using (true);
create policy settings_admin_write on public.settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- leads: anyone may submit, only admins may read / update / delete
create policy leads_public_insert on public.leads
  for insert to anon, authenticated with check (true);
create policy leads_admin_read on public.leads
  for select to authenticated using (public.is_admin());
create policy leads_admin_update on public.leads
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy leads_admin_delete on public.leads
  for delete to authenticated using (public.is_admin());

-- =========================================================
-- Storage bucket for dashboard uploads
-- =========================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760,
        array['image/jpeg','image/png','image/webp','image/avif','image/gif'])
on conflict (id) do nothing;

create policy "media_public_read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');
create policy "media_admin_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "media_admin_update" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "media_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());
