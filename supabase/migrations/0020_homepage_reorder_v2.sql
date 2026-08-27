-- =========================================================
-- Prompt 4 §3: replace the numeric stats bar with a 3-point
-- qualitative trust bar, add a mini "about" homepage section,
-- and reorder the homepage to the new mandated sequence.
-- Nothing is deleted: stat_* settings and the "stats" section
-- row stay in the database (just hidden), so this is fully
-- reversible.
-- =========================================================

update public.site_sections set is_visible = false, display_order = 1, updated_at = now() where key = 'stats';

insert into public.site_sections (key, is_visible, display_order) values
  ('trust_bar', true, 2),
  ('about', true, 11)
on conflict (key) do update set is_visible = excluded.is_visible;

update public.site_sections set display_order = 3,  updated_at = now() where key = 'study_paths';
update public.site_sections set display_order = 4,  updated_at = now() where key = 'services';
update public.site_sections set display_order = 5,  updated_at = now() where key = 'process';
update public.site_sections set display_order = 6,  updated_at = now() where key = 'language_platform';
update public.site_sections set display_order = 7,  updated_at = now() where key = 'admissions';
update public.site_sections set display_order = 8,  updated_at = now() where key = 'destinations';
update public.site_sections set display_order = 9,  updated_at = now() where key = 'universities';
update public.site_sections set display_order = 10, updated_at = now() where key = 'why_china';
update public.site_sections set display_order = 12, updated_at = now() where key = 'stories';
update public.site_sections set display_order = 13, updated_at = now() where key = 'faq';
update public.site_sections set display_order = 14, updated_at = now() where key = 'blog';
update public.site_sections set display_order = 15, updated_at = now() where key = 'final_cta';

insert into public.settings (key, value, value_ar, value_en, value_ru) values
  ('trust_bar_point_1_text', null, 'التخصص الحصري في الصين', 'Exclusive specialisation in China', 'Исключительная специализация на Китае'),
  ('trust_bar_point_2_text', null, 'مراجعة أولية لملفك قبل أي التزام', 'An initial review of your file before any commitment', 'Первичный анализ вашего досье до любых обязательств'),
  ('trust_bar_point_3_text', null, 'مرافقة واضحة بعقد إلكتروني', 'Clear support with an electronic contract', 'Чёткое сопровождение по электронному договору')
on conflict (key) do nothing;
