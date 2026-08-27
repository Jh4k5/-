-- Every homepage section already has an editable title and subtitle. The small
-- label above the heading and the button under it were the last visible strings
-- that could only be changed in code, so they become columns on the same row.
-- Left null, each falls back to the dictionary exactly as before.
alter table public.site_sections
  add column if not exists eyebrow_ar text,
  add column if not exists eyebrow_en text,
  add column if not exists eyebrow_ru text,
  add column if not exists cta_label_ar text,
  add column if not exists cta_label_en text,
  add column if not exists cta_label_ru text;
