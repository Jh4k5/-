-- =========================================================
-- Prompt 2 §7: cost-transparency section on /services.
-- Mirrors the why_china_points table shape exactly.
-- =========================================================

create table if not exists public.cost_factors (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null,
  title_en text,
  title_ru text,
  description_ar text not null,
  description_en text,
  description_ru text,
  icon text not null default 'sparkles',
  display_order int not null default 0,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz
);
create index if not exists cost_factors_order_idx on public.cost_factors(display_order);

alter table public.cost_factors enable row level security;

create policy cost_factors_public_read on public.cost_factors
  for select to anon, authenticated using (status = 'published' or public.is_admin());
create policy cost_factors_admin_write on public.cost_factors
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create trigger cost_factors_touch before update on public.cost_factors
for each row execute function public.touch_updated_at();

insert into public.cost_factors
  (title_ar, title_en, title_ru, description_ar, description_en, description_ru, icon, display_order, status)
values
(
  'المرحلة الدراسية والدرجة العلمية',
  'Academic stage and degree',
  'Учебный этап и степень',
  'تختلف التكلفة باختلاف مرحلتك الدراسية (ثانوية، بكالوريوس، ماجستير، دكتوراه) وتعقيد متطلبات كل درجة.',
  'Cost varies by your academic stage (high school, bachelor''s, master''s, PhD) and the complexity of each degree''s requirements.',
  'Стоимость зависит от вашего учебного этапа (школа, бакалавриат, магистратура, докторантура) и сложности требований каждой степени.',
  'graduation-cap', 1, 'published'
),
(
  'عدد الجامعات والبرامج',
  'Number of universities and programmes',
  'Количество университетов и программ',
  'كلما زاد عدد الجامعات أو البرامج التي تتقدّم إليها، زاد حجم العمل المطلوب في التجهيز والمتابعة.',
  'The more universities or programmes you apply to, the more work is required in preparation and follow-up.',
  'Чем больше университетов или программ, на которые вы подаёте документы, тем больше объём подготовки и сопровождения.',
  'building', 2, 'published'
),
(
  'نطاق تجهيز الملف والترجمة والتوثيق',
  'Scope of file preparation, translation and authentication',
  'Объём подготовки документов, перевода и легализации',
  'تختلف التكلفة حسب عدد المستندات المطلوب ترجمتها وتوثيقها، ومدى تعقيد إجراءات الجهة المستقبلة.',
  'Cost depends on how many documents need translation and authentication, and how complex the receiving institution''s procedures are.',
  'Стоимость зависит от количества документов, требующих перевода и легализации, и сложности процедур принимающей стороны.',
  'file-check', 3, 'published'
),
(
  'المقابلات والاختبارات',
  'Interviews and tests',
  'Собеседования и тесты',
  'بعض البرامج تتطلب مقابلات أو اختبارات إضافية، وهذا يضيف وقتاً وجهداً إلى ملفك يُؤخذ بعين الاعتبار عند تحديد التكلفة.',
  'Some programmes require additional interviews or tests, which adds time and effort to your file and is factored into the cost.',
  'Некоторые программы требуют дополнительных собеседований или тестов, что увеличивает объём работы над вашим досье и учитывается в стоимости.',
  'messages-square', 4, 'published'
),
(
  'خدمات ما بعد القبول',
  'Post-admission services',
  'Услуги после зачисления',
  'مساعدتك في خطوات ما بعد صدور القبول، مثل التأشيرة أو الترتيبات الأولى، تُحسب ضمن نطاق الخدمة المتفق عليه.',
  'Helping you with the steps after admission is issued, such as the visa or initial arrangements, is counted within the agreed service scope.',
  'Помощь на этапах после получения admission, таких как виза или первые организационные шаги, учитывается в согласованном объёме услуг.',
  'plane-landing', 5, 'published'
),
(
  'خدمات إضافية حسب العقد',
  'Extra services per contract',
  'Дополнительные услуги по контракту',
  'أي خدمة إضافية خارج النطاق الأساسي المتفق عليه تُذكر بوضوح في العقد قبل بدء العمل، ولا توجد رسوم مخفية.',
  'Any extra service outside the agreed core scope is clearly stated in the contract before work begins — there are no hidden fees.',
  'Любая дополнительная услуга вне согласованного базового объёма чётко прописывается в контракте до начала работы — скрытых платежей нет.',
  'shield', 6, 'published'
)
on conflict do nothing;

insert into public.settings (key, value, value_ar, value_en, value_ru) values
  ('services_cost_title', null,
   'كيف تتحدد التكلفة؟',
   'How is the cost determined?',
   'Как определяется стоимость?'),
  ('cost_transparency_text', null,
   'تختلف التكلفة حسب ملفك والخدمات التي تحتاجها. بعد المقابلة نرسل لك نطاقاً واضحاً وخطة مكتوبة قبل بدء التعاقد، ولا توجد رسوم مخفية خارج ما ينص عليه العقد.',
   'The cost varies according to your profile and the services you need. After the interview we send you a clear range and a written plan before the contract begins, with no hidden fees beyond what the contract states.',
   'Стоимость зависит от вашего профиля и необходимых услуг. После собеседования мы присылаем чёткий диапазон и письменный план до начала сотрудничества, без скрытых платежей за пределами того, что указано в контракте.')
on conflict (key) do nothing;
