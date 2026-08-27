-- =========================================================
-- Prompt 3 §5: reorder the homepage so each topic has one owner
-- and appears once, plus register the two new sections.
-- =========================================================

update public.site_sections set display_order = 1,  updated_at = now() where key = 'stats';
update public.site_sections set display_order = 3,  updated_at = now() where key = 'destinations';
update public.site_sections set display_order = 4,  updated_at = now() where key = 'services';
update public.site_sections set display_order = 5,  updated_at = now() where key = 'process';
update public.site_sections set display_order = 6,  updated_at = now() where key = 'admissions';
update public.site_sections set display_order = 7,  updated_at = now() where key = 'universities';
update public.site_sections set display_order = 8,  updated_at = now() where key = 'why_china';
update public.site_sections set display_order = 10, updated_at = now() where key = 'stories';
update public.site_sections set display_order = 11, updated_at = now() where key = 'faq';
update public.site_sections set display_order = 12, updated_at = now() where key = 'blog';
update public.site_sections set display_order = 13, updated_at = now() where key = 'final_cta';

insert into public.site_sections (key, is_visible, display_order) values
  ('study_paths', true, 2),
  ('language_platform', true, 9)
on conflict (key) do nothing;
