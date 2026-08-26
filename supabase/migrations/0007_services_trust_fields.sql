-- Prompt 2 §3: "what we provide" / "what we don't guarantee" per service,
-- plus an optional per-service CTA. Purely additive.
alter table public.services
  add column if not exists includes_ar text,
  add column if not exists includes_en text,
  add column if not exists includes_ru text,
  add column if not exists excludes_ar text,
  add column if not exists excludes_en text,
  add column if not exists excludes_ru text,
  add column if not exists cta_label_ar text,
  add column if not exists cta_label_en text,
  add column if not exists cta_label_ru text,
  add column if not exists cta_link text;

-- "What happens after the interview?" — 4-step block on the services page.
insert into public.settings (key, value, value_ar, value_en, value_ru) values
  ('services_after_interview_title', null,
   'ماذا يحدث بعد المقابلة؟',
   'What happens after the interview?',
   'Что происходит после собеседования?'),
  ('services_after_interview_step1', null,
   'نفهم مرحلتك الدراسية وتخصصك وهدفك وميزانيتك.',
   'We understand your academic stage, major, goal and budget.',
   'Мы разбираемся в вашем учебном этапе, специальности, цели и бюджете.'),
  ('services_after_interview_step2', null,
   'نراجع المسارات والبرامج التي تناسب ملفك مبدئياً.',
   'We review the tracks and programmes that initially suit your profile.',
   'Мы рассматриваем направления и программы, предварительно подходящие вашему профилю.'),
  ('services_after_interview_step3', null,
   'نرسل لك خطة تقديم مخصصة لتختار منها.',
   'We send you a tailored application plan to choose from.',
   'Мы отправляем вам индивидуальный план подачи документов на выбор.'),
  ('services_after_interview_step4', null,
   'نبدأ تجهيز الملف والتقديم بعد الاتفاق الواضح على النطاق والتكلفة.',
   'We start preparing your file and applying after a clear agreement on scope and cost.',
   'Мы начинаем подготовку документов и подачу после чёткой договорённости об объёме и стоимости.')
on conflict (key) do nothing;
