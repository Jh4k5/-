-- =========================================================
-- Prompt 2 §6: reuse the existing `leads` table for the short
-- eligibility-check form instead of building a parallel table/route.
-- Purely additive: two new optional columns plus a `source` tag that
-- defaults to the existing contact-form behaviour, so ContactForm
-- keeps working unchanged.
-- =========================================================

alter table public.leads
  add column if not exists source text not null default 'contact_form'
    check (source in ('contact_form','eligibility_check')),
  add column if not exists wants_scholarship boolean,
  add column if not exists desired_start_year integer;

-- The eligibility form also offers a PhD stage, which the contact
-- form's qualification field did not previously support.
alter table public.leads drop constraint if exists leads_current_qualification_check;
alter table public.leads add constraint leads_current_qualification_check
  check (current_qualification in ('high_school','bachelor','master','phd'));

-- Eligibility-check section copy (admin-editable, matches the owner's exact wording).
insert into public.settings (key, value, value_ar, value_en, value_ru) values
  ('eligibility_title', null,
   'فحص أهلية أولي',
   'Quick eligibility check',
   'Быстрая проверка права на поступление'),
  ('eligibility_subtitle', null,
   'أجب عن بضعة أسئلة سريعة لنفهم وضعك قبل أن نتواصل معك.',
   'Answer a few quick questions so we can understand your situation before we get in touch.',
   'Ответьте на несколько коротких вопросов, чтобы мы поняли вашу ситуацию перед тем, как связаться с вами.'),
  ('eligibility_success_message', null,
   'وصلت معلوماتك. سنراجعها مبدئياً ونتواصل معك لتوضيح المسارات المناسبة والشروط التي تحتاج إلى تحقق رسمي.',
   'Your information has been received. We will do an initial review and reach out to explain the suitable tracks and any conditions that still need official verification.',
   'Ваша информация получена. Мы проведём первичный анализ и свяжемся с вами, чтобы объяснить подходящие направления и условия, которые ещё требуют официального подтверждения.'),
  ('eligibility_whatsapp_status', 'active', null, null, null)
on conflict (key) do nothing;
