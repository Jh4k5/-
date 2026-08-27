-- =========================================================
-- Prompt 3 §5: "اختر مسارك" homepage section — four fixed logical
-- paths (language / bachelor / master / phd), each linking straight
-- into the booking form with the track pre-selected.
-- =========================================================

create table if not exists public.study_paths (
  id uuid primary key default gen_random_uuid(),
  path_key text not null unique check (path_key in ('language','bachelor','master','phd')),
  title_ar text not null,
  title_en text,
  title_ru text,
  description_ar text not null,
  description_en text,
  description_ru text,
  icon text not null default 'graduation-cap',
  display_order int not null default 0,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz
);
create index if not exists study_paths_order_idx on public.study_paths(display_order);

alter table public.study_paths enable row level security;

create policy study_paths_public_read on public.study_paths
  for select to anon, authenticated using (status = 'published' or public.is_admin());
create policy study_paths_admin_write on public.study_paths
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create trigger study_paths_touch before update on public.study_paths
for each row execute function public.touch_updated_at();

insert into public.study_paths
  (path_key, title_ar, title_en, title_ru, description_ar, description_en, description_ru, icon, display_order, status)
values
(
  'language',
  'برنامج اللغة الصينية',
  'Chinese language programme',
  'Программа китайского языка',
  'ابدأ بتعلّم اللغة الصينية كخطوة تمهيدية قبل الالتحاق بالدراسة الأكاديمية، أو كمسار مستقل.',
  'Start by learning Chinese as preparation before academic study, or as a standalone track.',
  'Начните с изучения китайского языка в качестве подготовки перед академическим обучением или как отдельное направление.',
  'languages', 1, 'published'
),
(
  'bachelor',
  'البكالوريوس',
  'Bachelor''s degree',
  'Бакалавриат',
  'التحق ببرنامج بكالوريوس في إحدى الجامعات الصينية بعد الثانوية العامة، مع مساعدتك في كل خطوة.',
  'Join a bachelor''s programme at a Chinese university after high school, with our help at every step.',
  'Поступите на бакалавриат в китайский университет после окончания школы — мы поможем на каждом этапе.',
  'graduation-cap', 2, 'published'
),
(
  'master',
  'الماجستير',
  'Master''s degree',
  'Магистратура',
  'أكمل دراستك العليا ببرنامج ماجستير مناسب لتخصصك، مع فرص منح واسعة في الجامعات الصينية.',
  'Continue your postgraduate studies with a master''s programme suited to your field, with broad scholarship opportunities at Chinese universities.',
  'Продолжите обучение по программе магистратуры, соответствующей вашей специальности, с широкими возможностями получения стипендий.',
  'award', 3, 'published'
),
(
  'phd',
  'الدكتوراه',
  'PhD',
  'Докторантура',
  'واصل بحثك الأكاديمي ببرنامج دكتوراه في الصين، مع دعم كامل في التقديم والمنح البحثية.',
  'Continue your academic research with a PhD programme in China, with full support in applying and research funding.',
  'Продолжите научные исследования по программе докторантуры в Китае при полной поддержке в подаче документов и поиске финансирования.',
  'book-open-check', 4, 'published'
)
on conflict (path_key) do nothing;
