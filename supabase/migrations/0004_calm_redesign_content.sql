-- =========================================================
-- Calm-redesign content pass: move remaining hardcoded copy
-- (hero, stats labels, why-china points, process trust badges,
-- footer, contact form, social-link status) into admin-editable
-- storage. Purely additive — no drops, no column removals.
-- =========================================================

-- ---------- why_china_points (same shape as services) ----------
create table if not exists public.why_china_points (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null,
  title_en text,
  title_ru text,
  description_ar text not null default '',
  description_en text,
  description_ru text,
  icon text not null default 'sparkles',
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.why_china_points enable row level security;

create policy why_china_points_public_read on public.why_china_points
  for select to anon, authenticated using (true);
create policy why_china_points_admin_write on public.why_china_points
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into public.why_china_points
  (title_ar, title_en, title_ru, description_ar, description_en, description_ru, icon, display_order)
values
  ('جامعات ضمن التصنيفات العالمية', 'Universities in global rankings', 'Университеты в мировых рейтингах',
   'الصين تضم عدداً من أفضل الجامعات عالمياً في الهندسة والطب والأعمال وعلوم الحاسب، مع اعتراف دولي بشهاداتها.',
   'China hosts several of the world''s leading universities in engineering, medicine, business and computer science, with internationally recognised degrees.',
   'В Китае работают ведущие мировые университеты в инженерии, медицине, бизнесе и информатике с международно признанными дипломами.',
   'award', 1),
  ('تكلفة دراسة ومعيشة معقولة', 'Reasonable tuition and living costs', 'Разумная стоимость обучения и жизни',
   'الرسوم الدراسية وتكاليف المعيشة أقل بكثير من أوروبا وأمريكا، مع مستوى خدمات وبنية تحتية متقدمة جداً.',
   'Tuition and living expenses are far lower than in Europe or the United States, alongside highly advanced services and infrastructure.',
   'Обучение и проживание обходятся значительно дешевле, чем в Европе и США, при современном уровне инфраструктуры.',
   'home', 2),
  ('منح دراسية واسعة', 'A wide range of scholarships', 'Широкие возможности стипендий',
   'منح حكومية (CSC) ومنح مقاطعات ومنح جامعية تغطي الرسوم أو السكن أو مصروف شهري — والتقديم عليها ممكن.',
   'Government (CSC), provincial and university scholarships cover tuition, accommodation or a monthly stipend — and applying is realistic.',
   'Государственные (CSC), провинциальные и университетские стипендии покрывают обучение, проживание или ежемесячную выплату.',
   'sparkles', 3),
  ('برامج باللغة الإنجليزية', 'English-taught programmes', 'Программы на английском языке',
   'عدد كبير من البرامج يُدرَّس بالكامل بالإنجليزية، مع إمكانية تعلّم الصينية بالتوازي لفتح فرص أكبر.',
   'Many programmes are taught entirely in English, while you learn Chinese in parallel to open even bigger opportunities.',
   'Многие программы полностью преподаются на английском, а китайский можно изучать параллельно.',
   'languages', 4),
  ('أمان وبنية تحتية متقدمة', 'Safety and modern infrastructure', 'Безопасность и современная инфраструктура',
   'مدن آمنة، مواصلات حديثة، ومدن جامعية مجهزة بالكامل تجعل تجربة الطالب الدولي مريحة.',
   'Safe cities, modern transport and fully equipped campuses make the international student experience comfortable.',
   'Безопасные города, современный транспорт и полностью оснащённые кампусы делают жизнь студента комфортной.',
   'shield', 5),
  ('سوق عمل وفرص مستقبلية', 'Career and future opportunities', 'Карьера и перспективы',
   'خبرة الدراسة في ثاني أكبر اقتصاد بالعالم وإتقان الصينية يفتحان أبواباً في التجارة والصناعة والتقنية.',
   'Studying in the world''s second-largest economy and mastering Chinese opens doors in trade, industry and technology.',
   'Учёба во второй экономике мира и владение китайским открывают двери в торговле, промышленности и технологиях.',
   'briefcase', 6);

-- ---------- process_trust_badges (same shape as process_steps) ----------
create table if not exists public.process_trust_badges (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null,
  title_en text,
  title_ru text,
  description_ar text not null default '',
  description_en text,
  description_ru text,
  icon text not null default 'shield',
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.process_trust_badges enable row level security;

create policy process_trust_badges_public_read on public.process_trust_badges
  for select to anon, authenticated using (true);
create policy process_trust_badges_admin_write on public.process_trust_badges
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into public.process_trust_badges
  (title_ar, title_en, title_ru, description_ar, description_en, description_ru, icon, display_order)
values
  ('استشارة أولى مجانية', 'Free first consultation', 'Бесплатная первая консультация',
   'نناقش تخصصك ووجهتك الدراسية المناسبة دون أي التزام أو تكلفة.',
   'We discuss your major and the right study direction for you, with no commitment or cost.',
   'Обсуждаем вашу специальность и подходящее направление обучения — без обязательств и без оплаты.',
   'headphones', 1),
  ('عقود إلكترونية موثّقة', 'Verified e-contracts', 'Подтверждённые электронные договоры',
   'كل اتفاق بيننا موثّق إلكترونياً بوضوح يحفظ حقك من البداية.',
   'Every agreement between us is documented electronically and clearly protects your rights from day one.',
   'Каждая договорённость фиксируется электронно и чётко защищает ваши права с самого начала.',
   'file-check', 2),
  ('مقابلات ومتابعة مسجّلة', 'Recorded interviews & follow-up', 'Записанные собеседования',
   'جلسات التحضير للمقابلات تُسجَّل لمراجعتها معك وتطوير أدائك.',
   'Interview preparation sessions are recorded so we can review and improve your performance together.',
   'Сессии подготовки к собеседованию записываются, чтобы вместе разобрать и улучшить результат.',
   'messages-square', 3),
  ('تسعير عادل للجميع', 'Fair pricing for everyone', 'Честные цены для всех',
   'خدمة احترافية بتكلفة منصفة تناسب الجميع، بلا رسوم مفاجئة.',
   'Professional service at a fair cost that suits everyone, with no surprise fees.',
   'Профессиональная услуга по справедливой цене без скрытых платежей.',
   'shield', 4);

-- ---------- settings: correct bad placeholder social URLs ----------
-- these were seeded as bare domain homepages, not real pages; a link that
-- resolves to nothing but a generic homepage should read as "not set".
update public.settings
set value = ''
where key in ('instagram_url', 'facebook_url', 'tiktok_url', 'youtube_url')
  and value in ('https://instagram.com/', 'https://facebook.com/', 'https://tiktok.com/', 'https://youtube.com/');

-- ---------- settings: new admin-editable keys ----------
insert into public.settings (key, value, value_ar, value_en, value_ru) values
  -- hero
  ('hero_headline', null,
   'تريد الدراسة في الصين؟ ابدأ بخطة واضحة لملفك.',
   'Want to study in China? Start with a clear plan for your file.',
   'Хотите учиться в Китае? Начните с чёткого плана для вашего дела.'),
  ('hero_description', null,
   'نساعدك على اختيار المسار المناسب، تجهيز ملفك، والتقديم على برامج ومنح تتوافق مبدئياً مع مؤهلك وأهدافك.',
   'We help you choose the right path, prepare your file, and apply to programmes and scholarships that initially match your qualifications and goals.',
   'Мы поможем выбрать подходящее направление, подготовить документы и подать заявку на программы и стипендии, предварительно соответствующие вашей квалификации и целям.'),
  ('hero_cta_primary', null, 'تواصل معنا الآن', 'Contact us now', 'Связаться с нами'),
  ('hero_cta_secondary', null, 'تحدث معنا على واتساب', 'Chat with us on WhatsApp', 'Написать нам в WhatsApp'),
  ('hero_trust_line', null,
   'نوضح لك الشروط والخطوات بواقعية؛ أما قرار القبول والمنحة فيصدر من الجهة المختصة.',
   'We explain the terms and steps honestly; the admission and scholarship decision is issued by the relevant institution.',
   'Мы честно объясняем условия и этапы; решение о зачислении и стипендии принимает соответствующее учреждение.'),
  ('hero_services_link_label', null, 'تعرّف على خدماتنا', 'Explore our services', 'Наши услуги'),

  -- stats
  ('stat_students_helped_label', null, 'طالب تمت مساعدته', 'Students assisted', 'Студентов получили помощь'),
  ('stat_years_experience_label', null, 'سنوات خبرة', 'Years of experience', 'Лет опыта'),
  ('stat_universities_label', null, 'جامعة صينية نتعامل معها', 'Chinese universities we work with', 'Китайских вузов-партнёров'),
  ('stat_satisfaction_rate_label', null, 'نسبة رضا الطلاب', 'Student satisfaction rate', 'Уровень удовлетворённости'),
  ('stats_measured_at', null, 'بيانات محدثة دورياً', 'Figures updated periodically', 'Данные обновляются регулярно'),

  -- footer
  ('footer_about', null,
   'مكتب استشارات تعليمية متخصص حصرياً في الدراسة بالصين، يرافق الطالب من أول استشارة حتى الاستقرار.',
   'An educational consultancy focused exclusively on studying in China, accompanying the student from the first consultation to settling in.',
   'Образовательный консалтинг, работающий исключительно с обучением в Китае и сопровождающий студента от первой консультации до обустройства.'),
  ('footer_quick_links_title', null, 'روابط سريعة', 'Quick links', 'Быстрые ссылки'),
  ('footer_contact_title', null, 'تواصل معنا', 'Contact', 'Контакты'),
  ('footer_rights', null, 'جميع الحقوق محفوظة', 'All rights reserved', 'Все права защищены'),
  ('footer_builtwith', null,
   'جسر إلى الصين — نرافقك خطوة بخطوة نحو جامعتك في الصين',
   'Bridge to China — walking with you step by step toward your university in China',
   'Мост в Китай — сопровождаем вас шаг за шагом на пути к вашему университету в Китае'),

  -- "Bridge to Chinese" subscription perk (corrected duration: two months, not lifetime)
  ('process_bridge_perk_title', null, 'مزايا إضافية عند التسجيل', 'An extra perk when you sign up', 'Дополнительный бонус при регистрации'),
  ('process_bridge_perk_duration', null, 'شهران مجاناً', 'Two months free', 'Два месяца бесплатно'),
  ('process_bridge_perk_text', null,
   'بالتسجيل معنا تحصل أيضاً على اشتراك مجاني لمدة شهرين في منصّة «Bridge to Chinese» لتعلّم اللغة الصينية.',
   'Signing up with us also gets you two months of free access to the "Bridge to Chinese" language-learning platform.',
   'Регистрируясь у нас, вы также получаете бесплатный двухмесячный доступ к платформе изучения китайского языка «Bridge to Chinese».'),

  -- university examples disclaimer (home section)
  ('university_examples_disclaimer', null,
   'لا نرسل قائمة عامة عشوائية. نبدأ بمقابلة نفهم فيها مرحلتك وتخصصك وهدفك وميزانيتك، ثم نرسل لك خطة تقديم مخصصة بالمسارات والجامعات المقترحة.',
   'We don''t send a random public list. We start with an interview to understand your stage, major, goal and budget, then send you a tailored application plan with suggested tracks and universities.',
   'Мы не отправляем случайный общий список. Сначала мы проводим интервью, чтобы понять ваш этап, специальность, цель и бюджет, а затем присылаем индивидуальный план подачи с рекомендованными направлениями и университетами.'),

  -- contact form
  ('contact_submit_label', null, 'أرسل بياناتي للمراجعة', 'Send my details for review', 'Отправить данные на рассмотрение'),
  ('contact_after_submit_note', null,
   'سنراجع بياناتك يدوياً ونعود إليك خلال 24–48 ساعة عمل عبر وسيلة التواصل التي اخترتها.',
   'We review every submission manually and get back to you within 24–48 business hours via your chosen contact method.',
   'Мы вручную рассматриваем каждую заявку и отвечаем в течение 24–48 рабочих часов через выбранный вами способ связи.'),
  ('contact_privacy_consent_text', null,
   'بإرسال هذا النموذج، أوافق على استخدام بياناتي للتواصل معي بخصوص طلبي فقط.',
   'By submitting this form, I agree that my details will be used only to contact me about my request.',
   'Отправляя эту форму, я соглашаюсь на использование моих данных исключительно для связи по моему запросу.'),
  ('contact_success_message', null,
   'تم إرسال طلبك بنجاح! سنتواصل معك قريباً عبر الوسيلة التي اخترتها.',
   'Your request has been sent! We will contact you soon through your chosen channel.',
   'Заявка отправлена! Мы свяжемся с вами выбранным способом.'),
  ('contact_error_message', null,
   'تعذّر إرسال الطلب. تحقق من البيانات وحاول مرة أخرى.',
   'The request could not be sent. Please check your details and try again.',
   'Не удалось отправить заявку. Проверьте данные и попробуйте снова.'),

  -- social link visibility state: active | coming_soon | hidden
  ('facebook_status', 'hidden', null, null, null),
  ('instagram_status', 'hidden', null, null, null),
  ('youtube_status', 'hidden', null, null, null),
  ('tiktok_status', 'hidden', null, null, null),

  -- muted brand accent used for WhatsApp CTAs (theme-editable)
  ('brand_jade', '#1f7a68', null, null, null)
on conflict (key) do nothing;

-- ---------- site_sections: promote stats/process/services near the top ----------
update public.site_sections set display_order = 1, updated_at = now() where key = 'stats';
update public.site_sections set display_order = 2, updated_at = now() where key = 'process';
update public.site_sections set display_order = 3, updated_at = now() where key = 'services';
update public.site_sections set display_order = 4, updated_at = now() where key = 'admissions';
update public.site_sections set display_order = 5, updated_at = now() where key = 'universities';
update public.site_sections set display_order = 6, updated_at = now() where key = 'destinations';
update public.site_sections set display_order = 7, updated_at = now() where key = 'why_china';
update public.site_sections set display_order = 8, updated_at = now() where key = 'stories';
update public.site_sections set display_order = 9, updated_at = now() where key = 'blog';
update public.site_sections set display_order = 10, updated_at = now() where key = 'final_cta';

-- ---------- calmer default theme palette ----------
update public.settings set value = '#0f2740' where key = 'brand_blue';
update public.settings set value = '#b73535' where key = 'brand_primary';
update public.settings set value = '#c6a15b' where key = 'brand_gold';
