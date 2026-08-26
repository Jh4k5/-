-- =========================================================
-- Prompt 2 §5: admin-editable FAQ, seeded with the 12 owner-provided
-- questions and honest, non-promissory default answers.
-- =========================================================

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question_ar text not null,
  question_en text,
  question_ru text,
  answer_ar text not null,
  answer_en text,
  answer_ru text,
  category text,
  display_order int not null default 0,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz
);
create index if not exists faqs_order_idx on public.faqs(display_order);

alter table public.faqs enable row level security;

create policy faqs_public_read on public.faqs
  for select to anon, authenticated using (status = 'published' or public.is_admin());
create policy faqs_admin_write on public.faqs
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create trigger faqs_touch before update on public.faqs
for each row execute function public.touch_updated_at();

insert into public.faqs
  (question_ar, question_en, question_ru, answer_ar, answer_en, answer_ru, display_order, status)
values
(
  'هل القبول أو المنحة مضمونة؟',
  'Is admission or a scholarship guaranteed?',
  'Гарантировано ли поступление или стипендия?',
  'لا. لا نضمن قبولاً ولا منحة لأي طالب. نساعدك في تجهيز ملف قوي وتقديمه للجهات المناسبة، والقرار النهائي يعود دائماً للجامعة أو الجهة المانحة.',
  'No. We never guarantee admission or a scholarship for any student. We help you prepare a strong file and submit it to the right institutions — the final decision always belongs to the university or the funding body.',
  'Нет. Мы никогда не гарантируем поступление или стипендию ни одному студенту. Мы помогаем подготовить сильное досье и подать его в нужные учреждения — окончательное решение всегда остаётся за университетом или организацией, предоставляющей стипендию.',
  1, 'published'
),
(
  'ما المراحل الدراسية التي تتعاملون معها؟',
  'What academic stages do you handle?',
  'С какими учебными этапами вы работаете?',
  'نتعامل مع المرحلة الثانوية، البكالوريوس، الماجستير، والدكتوراه، إضافة إلى برامج تعلّم اللغة الصينية.',
  'We work with high school, bachelor''s, master''s and PhD applicants, as well as Chinese language programmes.',
  'Мы работаем с поступающими на уровень средней школы, бакалавриата, магистратуры и докторантуры, а также с программами изучения китайского языка.',
  2, 'published'
),
(
  'هل تقدّمون برامج لتعلّم اللغة الصينية؟',
  'Do you offer Chinese language programmes?',
  'Предлагаете ли вы программы изучения китайского языка?',
  'نعم، نساعدك في الالتحاق ببرامج لغة صينية مناسبة لمستواك، سواء كخطوة تمهيدية قبل الدراسة الأكاديمية أو كمسار مستقل.',
  'Yes. We help you join a Chinese language programme suited to your level, either as preparation before academic study or as a standalone track.',
  'Да. Мы помогаем подобрать программу китайского языка, соответствующую вашему уровню — как подготовку перед академическим обучением, так и отдельное направление.',
  3, 'published'
),
(
  'ما الذي تشمله الخدمة؟',
  'What does the service include?',
  'Что включает услуга?',
  'تشمل الاستشارة الأولى، مراجعة ملفك واقتراح المسارات المناسبة، تجهيز الأوراق والترجمة والتوثيق اللازم، والتقديم للجامعات المختارة، مع متابعة حتى صدور القرار.',
  'It includes the first consultation, reviewing your profile and suggesting suitable tracks, preparing documents, translation and authentication, applying to the chosen universities, and follow-up until a decision is issued.',
  'Она включает первую консультацию, анализ вашего профиля и подбор подходящих направлений, подготовку документов, перевод и легализацию, подачу заявок в выбранные университеты и сопровождение до получения решения.',
  4, 'published'
),
(
  'هل يمكنني اختيار الجامعة؟',
  'Can I choose the university?',
  'Могу ли я выбрать университет?',
  'نعم، القرار النهائي لاختيار الجامعة والتخصص يعود لك دائماً. نساعدك بمعلومات وخيارات تناسب ملفك وهدفك لتقرر بنفسك.',
  'Yes. The final choice of university and major always stays with you. We provide information and options that match your profile and goal so you can decide.',
  'Да. Окончательный выбор университета и специальности всегда остаётся за вами. Мы предоставляем информацию и варианты, соответствующие вашему профилю и цели, чтобы вы могли принять решение сами.',
  5, 'published'
),
(
  'كيف تتحدد التكلفة؟',
  'How is the cost determined?',
  'Как определяется стоимость?',
  'تختلف التكلفة حسب مرحلتك الدراسية، عدد الجامعات والبرامج المتقدَّم لها، ونطاق الخدمات التي تحتاجها. بعد المقابلة الأولى نرسل لك نطاقاً واضحاً وخطة مكتوبة قبل بدء التعاقد.',
  'Cost varies by your academic stage, the number of universities and programmes you apply to, and the scope of services you need. After the first interview we send you a clear range and a written plan before the contract begins.',
  'Стоимость зависит от вашего учебного этапа, количества университетов и программ, на которые вы подаёте документы, и объёма необходимых услуг. После первого собеседования мы присылаем чёткий диапазон и письменный план до начала сотрудничества.',
  6, 'published'
),
(
  'كم تستغرق المراجعة الأولى لملفي؟',
  'How long does the first review take?',
  'Сколько времени занимает первичное рассмотрение?',
  'عادة نُعطيك رداً أولياً خلال أيام قليلة من استلام بياناتك الأساسية، ثم نحدد معك موعد مقابلة لمناقشة التفاصيل والخطوات التالية.',
  'We usually give you an initial response within a few days of receiving your basic information, then schedule an interview to discuss the details and next steps.',
  'Обычно мы даём первичный ответ в течение нескольких дней после получения основных данных, затем назначаем собеседование для обсуждения деталей и дальнейших шагов.',
  7, 'published'
),
(
  'ما المستندات المطلوبة في البداية؟',
  'What initial documents are required?',
  'Какие документы нужны на начальном этапе?',
  'غالباً نحتاج في البداية إلى صورة جواز السفر، آخر مؤهل دراسي أو كشف الدرجات، وبيانات تواصل أساسية. أي مستندات إضافية تُطلب لاحقاً بحسب الجامعة والبرنامج المختار.',
  'Usually a passport copy, your latest academic qualification or transcript, and basic contact details. Any further documents are requested later depending on the university and programme.',
  'Как правило, на старте нужны копия паспорта, последний документ об образовании или табель успеваемости и основные контактные данные. Дополнительные документы запрашиваются позже, в зависимости от университета и программы.',
  8, 'published'
),
(
  'هل يمكنني التقديم لأكثر من جامعة؟',
  'Can I apply to more than one university?',
  'Могу ли я подать документы в несколько университетов?',
  'نعم، يمكن التقديم لأكثر من جامعة أو برنامج ضمن الخطة التي نتفق عليها معك، بحسب ملفك والوقت المتاح.',
  'Yes. You can apply to more than one university or programme within the plan we agree on together, based on your profile and available time.',
  'Да, вы можете подать документы в несколько университетов или программ в рамках плана, который мы согласуем вместе, исходя из вашего профиля и доступного времени.',
  9, 'published'
),
(
  'ماذا يحدث بعد صدور القبول؟',
  'What happens after admission is issued?',
  'Что происходит после получения admission?',
  'نساعدك في فهم خطوات ما بعد القبول مثل التأشيرة والإجراءات الإدارية، وحسب الاتفاق في عقدك قد تشمل خدماتنا أيضاً مساعدة في الترتيبات الأولى بعد الوصول.',
  'We help you understand the post-admission steps such as the visa and administrative procedures, and depending on your contract, our services may also include help with initial arrangements after arrival.',
  'Мы помогаем разобраться в шагах после получения admission, таких как виза и административные процедуры, а в зависимости от условий контракта наши услуги могут также включать помощь с первыми шагами после приезда.',
  10, 'published'
),
(
  'هل الاستقبال من المطار والسكن مشمولان في كل عقد؟',
  'Is airport pickup or housing included in every contract?',
  'Входят ли встреча в аэропорту и жильё в каждый контракт?',
  'لا، هذه الخدمات ليست مشمولة تلقائياً في كل عقد. تُحدَّد بوضوح ضمن نطاق الاتفاق المكتوب معك قبل بدء التعاقد.',
  'No. These services are not automatically included in every contract. They are defined clearly within the written agreement before the contract begins.',
  'Нет. Эти услуги не включены автоматически в каждый контракт. Они чётко прописываются в письменном соглашении до начала сотрудничества.',
  11, 'published'
),
(
  'ما معنى اشتراك "شهران مجاناً" في تعلّم اللغة الصينية؟',
  'What does the free 2-month "Bridge to Chinese" subscription mean?',
  'Что означает бесплатная 2-месячная подписка «Мост к китайскому языку»?',
  'هو اشتراك تعريفي مجاني لمدة شهرين في برنامج تعلّم اللغة الصينية، تنطبق عليه شروط محددة نوضحها لك عند التسجيل.',
  'It''s a free introductory subscription for two months to a Chinese language learning programme, subject to specific terms that we explain to you at sign-up.',
  'Это бесплатная ознакомительная подписка на два месяца на программу изучения китайского языка, на которую распространяются определённые условия, разъясняемые при регистрации.',
  12, 'published'
)
on conflict do nothing;

-- Register the new homepage section (accordion FAQ, placed right before the final CTA).
update public.site_sections set display_order = 11, updated_at = now() where key = 'final_cta';
insert into public.site_sections (key, is_visible, display_order) values
  ('faq', true, 10)
on conflict (key) do nothing;
