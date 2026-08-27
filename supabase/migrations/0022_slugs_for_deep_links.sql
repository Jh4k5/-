-- =========================================================
-- Prompt 5 §1: give every content type a real, indexable URL.
-- Until now only universities and articles had slugs, so the
-- sitemap was ~66 URLs and none of the services, study paths,
-- cities or stories could rank on their own.
--
-- Every column is added WITH an immediate backfill, so no row
-- is ever left without a slug. Slugs are derived from the
-- English title (first segment before an em-dash, so a city
-- becomes "beijing" rather than the whole sentence), with a
-- short id suffix appended only when two rows would collide.
-- =========================================================

alter table public.services           add column if not exists slug text;
alter table public.study_paths        add column if not exists slug text;
alter table public.destination_media  add column if not exists slug text;
alter table public.success_stories    add column if not exists slug text;

-- Long-form body so a story page is real content, not a thin page.
alter table public.success_stories add column if not exists body_ar text;
alter table public.success_stories add column if not exists body_en text;
alter table public.success_stories add column if not exists body_ru text;

-- Seeded placeholder stories stay visible (owner's decision) but must
-- never be indexed by Google as if they were genuine testimonials.
alter table public.success_stories add column if not exists is_demo boolean not null default false;

-- Cities deserve their own description so the page isn't just a photo.
alter table public.destination_media add column if not exists description_ar text;
alter table public.destination_media add column if not exists description_en text;
alter table public.destination_media add column if not exists description_ru text;

-- ---------- backfill helper ----------
create or replace function public.slugify(input text)
returns text language sql immutable as $$
  select nullif(
    trim(both '-' from
      regexp_replace(
        lower(split_part(coalesce(input, ''), '—', 1)),
        '[^a-z0-9]+', '-', 'g'
      )
    ),
    ''
  );
$$;

-- ---------- services ----------
with numbered as (
  select id,
         public.slugify(title_en) as s,
         row_number() over (partition by public.slugify(title_en) order by display_order, id) as rn
  from public.services
)
update public.services t
set slug = case
  when n.s is null then 'service-' || left(t.id::text, 8)
  when n.rn = 1    then n.s
  else n.s || '-' || left(t.id::text, 4)
end
from numbered n
where n.id = t.id and t.slug is null;

-- ---------- study paths (path_key is already a perfect slug) ----------
update public.study_paths set slug = path_key where slug is null;

-- ---------- destinations ----------
with numbered as (
  select id,
         public.slugify(title_en) as s,
         row_number() over (partition by public.slugify(title_en) order by display_order, id) as rn
  from public.destination_media
)
update public.destination_media t
set slug = case
  when n.s is null then 'place-' || left(t.id::text, 8)
  when n.rn = 1    then n.s
  else n.s || '-' || left(t.id::text, 4)
end
from numbered n
where n.id = t.id and t.slug is null;

-- ---------- stories ----------
with numbered as (
  select id,
         public.slugify(student_name) as s,
         row_number() over (partition by public.slugify(student_name) order by display_order, id) as rn
  from public.success_stories
)
update public.success_stories t
set slug = case
  when n.s is null then 'story-' || left(t.id::text, 8)
  when n.rn = 1    then n.s
  else n.s || '-' || left(t.id::text, 4)
end
from numbered n
where n.id = t.id and t.slug is null;

-- Mark the three seeded placeholder students as demo data.
update public.success_stories
set is_demo = true
where student_name in ('Omar A.', 'Lina M.', 'Yusuf K.');

-- ---------- constraints (safe now that every row is filled) ----------
create unique index if not exists services_slug_key          on public.services(slug);
create unique index if not exists study_paths_slug_key       on public.study_paths(slug);
create unique index if not exists destination_media_slug_key on public.destination_media(slug);
create unique index if not exists success_stories_slug_key   on public.success_stories(slug);
