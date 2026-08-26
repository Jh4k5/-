-- =========================================================
-- Prompt 2 §4: restructure admissions into real trust evidence
-- (student label, city, degree, result type, office-role text,
-- publish consent, graded blur) without ever dropping the
-- existing blur_enabled column or deleting any admission image.
--
-- SAFETY: student_consent defaults to false for NEW rows (a human
-- must confirm consent before a new admission can publish), but
-- existing rows are explicitly backfilled to true here so already
-- published admissions stay visible — consistent with the
-- non-destruction rule used throughout this migration series.
-- =========================================================

alter table public.admissions
  add column if not exists student_label text,
  add column if not exists city_ar text,
  add column if not exists city_en text,
  add column if not exists city_ru text,
  add column if not exists degree_level text
    check (degree_level in ('high_school','bachelor','master','phd')),
  add column if not exists result_type text
    check (result_type in ('admission','scholarship','admission_scholarship','pre_admission')),
  add column if not exists office_role_ar text,
  add column if not exists office_role_en text,
  add column if not exists office_role_ru text,
  add column if not exists student_consent boolean not null default false,
  add column if not exists blur_level text not null default 'medium'
    check (blur_level in ('none','light','medium','heavy'));

-- Backfill existing rows: keep them visible (consent = true) and
-- carry their current blur_enabled flag over into blur_level.
update public.admissions
set
  student_consent = true,
  blur_level = case when blur_enabled then 'medium' else 'none' end
where student_label is null and city_ar is null and degree_level is null;

comment on column public.admissions.blur_enabled is
  'Kept for backward compatibility; derived from blur_level on save. Use blur_level going forward.';

-- Disclaimer shown under the admissions section — no admission/scholarship
-- outcome is ever guaranteed.
insert into public.settings (key, value, value_ar, value_en, value_ru) values
  ('admissions_disclaimer', null,
   'هذه حالات سابقة وليست ضماناً لنتيجة أي ملف جديد. تختلف القرارات حسب الجامعة والبرنامج والملف وسنة التقديم.',
   'These are past cases, not a guarantee of any new application''s outcome. Decisions vary by university, programme, profile and application year.',
   'Это прошлые случаи, а не гарантия результата для новой заявки. Решения зависят от университета, программы, профиля и года подачи.')
on conflict (key) do nothing;
