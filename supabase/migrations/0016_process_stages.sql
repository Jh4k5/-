-- =========================================================
-- Prompt 3 §5: group the 11 flat process_steps under 4 real
-- stages instead of showing all 11 on the homepage at once.
-- The 11 existing steps are UPDATED (classified), never deleted.
-- =========================================================

create table if not exists public.process_stages (
  id uuid primary key default gen_random_uuid(),
  stage_number int not null unique check (stage_number between 1 and 4),
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
create index if not exists process_stages_order_idx on public.process_stages(display_order);

alter table public.process_stages enable row level security;

create policy process_stages_public_read on public.process_stages
  for select to anon, authenticated using (status = 'published' or public.is_admin());
create policy process_stages_admin_write on public.process_stages
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create trigger process_stages_touch before update on public.process_stages
for each row execute function public.touch_updated_at();

insert into public.process_stages
  (stage_number, title_ar, title_en, title_ru, description_ar, description_en, description_ru, icon, display_order, status)
values
(
  1, 'الاستشارة والتسجيل', 'Consultation and registration', 'Консультация и регистрация',
  'نفهم هدفك ووضعك الدراسي، ثم نوثّق اتفاقنا معك بعقد إلكتروني واضح.',
  'We understand your goal and academic situation, then formalise our agreement with a clear electronic contract.',
  'Мы разбираемся в вашей цели и учебной ситуации, затем оформляем договорённость чётким электронным контрактом.',
  'headphones', 1, 'published'
),
(
  2, 'التحضير والتقديم', 'Preparation and application', 'Подготовка и подача документов',
  'نحضّرك للاختبارات والمقابلة، ونجهّز ملفك، ونقدّم نيابة عنك لأكثر من جامعة.',
  'We prepare you for tests and interviews, put your file together, and apply to more than one university on your behalf.',
  'Мы готовим вас к тестам и собеседованиям, собираем документы и подаём заявки более чем в один университет от вашего имени.',
  'file-check', 2, 'published'
),
(
  3, 'القبول والفيزا', 'Admission and visa', 'Зачисление и виза',
  'ننتظر معك نتيجة القبول، ثم نُنهي إجراءاته الرسمية ونجهّز ملف الفيزا ونقدّمه.',
  'We wait for the admission result with you, then complete its official procedures and prepare and submit the visa file.',
  'Мы вместе ждём результата зачисления, затем оформляем официальные процедуры и готовим и подаём визовое дело.',
  'stamp', 3, 'published'
),
(
  4, 'السفر والاستقرار', 'Travel and settling in', 'Поездка и обустройство',
  'نحجز طيرانك ونستقبلك في المطار، ونساعدك في إعداد VPN ووسائل الدفع بالصين.',
  'We book your flight and welcome you at the airport, and help you set up a VPN and payment methods in China.',
  'Мы бронируем перелёт и встречаем вас в аэропорту, помогаем настроить VPN и способы оплаты в Китае.',
  'plane-landing', 4, 'published'
)
on conflict (stage_number) do nothing;

alter table public.process_steps
  add column if not exists stage_number int check (stage_number between 1 and 4);

update public.process_steps set stage_number = 1 where display_order in (1, 2);
update public.process_steps set stage_number = 2 where display_order in (3, 4, 5, 6);
update public.process_steps set stage_number = 3 where display_order in (7, 8, 9);
update public.process_steps set stage_number = 4 where display_order in (10, 11);
