-- =========================================================
-- Prompt 3 §2: widen lead statuses from 3 to 7 (additive — the
-- old values stay valid so no existing row breaks), and refresh
-- the booking success-message copy to match the merged form.
-- =========================================================

alter table public.leads drop constraint if exists leads_status_check;
alter table public.leads add constraint leads_status_check
  check (status in (
    'new', 'reviewed', 'awaiting_reply', 'qualified', 'contracted', 'unqualified', 'deferred',
    'contacted', 'completed'
  ));

update public.settings
set value_ar =
      'وصل طلبك بنجاح. سنراجعه خلال يوم عمل واحد ونتواصل معك عبر الوسيلة التي اخترتها لتوضيح المسار المناسب — هذا الطلب الأولي بلا أي التزام.',
    value_en =
      'Your request has arrived. We''ll review it within one business day and reach out through your chosen channel to explain the right track — this initial request carries no commitment.',
    value_ru =
      'Ваша заявка получена. Мы рассмотрим её в течение одного рабочего дня и свяжемся с вами удобным способом, чтобы объяснить подходящий путь — эта первичная заявка ни к чему не обязывает.',
    updated_at = now()
where key = 'contact_success_message';
