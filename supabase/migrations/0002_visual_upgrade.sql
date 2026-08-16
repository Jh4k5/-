-- =========================================================
-- Visual upgrade: universities, admission samples, home page sections,
-- video support and dashboard-controlled theme.
-- =========================================================

-- ---------- universities ----------
create table if not exists public.universities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  name_ar text,
  name_en text,
  name_ru text,
  city_ar text,
  city_en text,
  city_ru text,
  logo text,
  cover_media text,
  gallery jsonb not null default '[]'::jsonb,
  description_ar text not null default '',
  description_en text,
  description_ru text,
  highlights_ar text,
  highlights_en text,
  highlights_ru text,
  world_rank int,
  founded_year int,
  students_count int,
  international_students int,
  programs_language text default 'en_zh' check (programs_language in ('en','zh','en_zh')),
  tuition_range text,
  is_featured boolean not null default false,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists universities_order_idx on public.universities(display_order);

-- ---------- admission samples ----------
-- blur_box holds the privacy patch in image percentages: {x, y, w, h}
create table if not exists public.admissions (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  university_name text,
  major_ar text,
  major_en text,
  major_ru text,
  year int,
  blur_enabled boolean not null default true,
  blur_box jsonb not null default '{"x":6,"y":22,"w":52,"h":12}'::jsonb,
  display_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists admissions_order_idx on public.admissions(display_order);

-- ---------- home page sections ----------
create table if not exists public.site_sections (
  key text primary key,
  is_visible boolean not null default true,
  display_order int not null default 0,
  title_ar text,
  title_en text,
  title_ru text,
  subtitle_ar text,
  subtitle_en text,
  subtitle_ru text,
  updated_at timestamptz not null default now()
);

-- ---------- media type support ----------
alter table public.destination_media
  add column if not exists media_type text not null default 'image'
    check (media_type in ('image','video','scene')),
  add column if not exists poster text;

alter table public.gallery
  add column if not exists media_type text not null default 'image'
    check (media_type in ('image','video','scene')),
  add column if not exists poster text;

-- ---------- RLS ----------
alter table public.universities  enable row level security;
alter table public.admissions    enable row level security;
alter table public.site_sections enable row level security;

create policy universities_public_read on public.universities
  for select to anon, authenticated using (true);
create policy universities_admin_write on public.universities
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy admissions_public_read on public.admissions
  for select to anon, authenticated using (is_visible or public.is_admin());
create policy admissions_admin_write on public.admissions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy sections_public_read on public.site_sections
  for select to anon, authenticated using (true);
create policy sections_admin_write on public.site_sections
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- storage: allow video uploads up to 50 MB ----------
update storage.buckets
set file_size_limit = 52428800,
    allowed_mime_types = array[
      'image/jpeg','image/png','image/webp','image/avif','image/gif','image/svg+xml',
      'video/mp4','video/webm','video/quicktime'
    ]
where id = 'media';

-- ---------- default sections + theme keys ----------
insert into public.site_sections (key, is_visible, display_order) values
  ('stats', true, 1),
  ('admissions', true, 2),
  ('universities', true, 3),
  ('destinations', true, 4),
  ('services', true, 5),
  ('why_china', true, 6),
  ('stories', true, 7),
  ('blog', true, 8),
  ('final_cta', true, 9)
on conflict (key) do nothing;

insert into public.settings (key, value) values
  ('brand_primary', '#c8102e'),
  ('brand_gold', '#d4af37'),
  ('brand_blue', '#1b3a6b'),
  ('motion_intensity', 'cinematic'),
  ('logo_url', ''),
  ('hero_overlay_opacity', '66')
on conflict (key) do nothing;
