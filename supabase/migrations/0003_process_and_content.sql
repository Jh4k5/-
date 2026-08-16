-- =========================================================
-- "How we work" process steps + richer stories/articles + service copy
-- that reflects the real business model (scholarship-first positioning,
-- HSK registration not teaching, no public tuition figures).
-- =========================================================

-- ---------- process_steps (same shape as services, admin-editable) ----------
create table if not exists public.process_steps (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null,
  title_en text,
  title_ru text,
  description_ar text not null default '',
  description_en text,
  description_ru text,
  icon text not null default 'file-check',
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.process_steps enable row level security;

create policy process_steps_public_read on public.process_steps
  for select to anon, authenticated using (true);
create policy process_steps_admin_write on public.process_steps
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- success_stories: richer optional fields ----------
alter table public.success_stories
  add column if not exists university_name text,
  add column if not exists country text;

-- ---------- articles: featured flag ----------
alter table public.articles
  add column if not exists is_featured boolean not null default false;

-- ---------- site_sections: insert "process" right after the hero ----------
update public.site_sections
set display_order = display_order + 1,
    updated_at = now()
where key <> 'process';

insert into public.site_sections (key, is_visible, display_order) values
  ('process', true, 1)
on conflict (key) do nothing;

-- ---------- seed the 11 process steps ----------
insert into public.process_steps (title_ar, title_en, title_ru, description_ar, description_en, description_ru, icon, display_order) values
('استشارة مجانية أولى','Free initial consultation','Бесплатная первичная консультация',
 'نستمع لرغبتك وتخصصك المفضّل، ونوجّهك مجاناً وبلا التزام نحو المسار الأنسب لملفك قبل أي خطوة أخرى.',
 'We listen to your goals and preferred major, and guide you — free of charge and with no obligation — towards the path that fits your profile before any other step.',
 'Мы выслушаем ваши цели и желаемую специальность и бесплатно, без обязательств, подскажем путь, который подходит именно вам.',
 'headphones',1),

('التسجيل وتوقيع العقد الإلكتروني','Registration and e-contract','Регистрация и электронный договор',
 'بعد الاتفاق، نوثّق تعاوننا بعقد إلكتروني مسجّل يحدّد الخدمات والمواعيد بوضوح، ونبدأ رحلتك رسمياً.',
 'Once we agree, we formalise our cooperation with a recorded electronic contract that clearly states the services and timeline, and officially begin your journey.',
 'После согласования мы оформляем сотрудничество зафиксированным электронным договором с чёткими услугами и сроками — и официально начинаем ваш путь.',
 'file-check',2),

('تحضير اختبارات اللغة والقبول','Language and admission exam prep','Подготовка к языковым и вступительным экзаменам',
 'ندرّبك على اختبارات HSK وأي اختبارات أخرى تطلبها الجامعة أو جهة المنحة، بخطة زمنية واضحة ومتابعة مستمرة.',
 'We train you for HSK and any other exams your university or scholarship provider requires, with a clear timeline and ongoing follow-up.',
 'Готовим вас к HSK и любым другим экзаменам, которые требует вуз или стипендия, с чётким графиком и постоянным сопровождением.',
 'book-open-check',3),

('تدريب المقابلة والفيديو التعريفي','Interview coaching and intro video','Подготовка к собеседованию и видео-визитка',
 'نؤهّلك لمقابلة القبول أو المنحة، ونساعدك في تجهيز فيديو تعريفي احترافي يعزّز ملفك أمام لجنة القبول.',
 'We prepare you for the admission or scholarship interview, and help you produce a professional introduction video that strengthens your file before the committee.',
 'Готовим вас к собеседованию на поступление или стипендию и помогаем создать профессиональное видео-представление для приёмной комиссии.',
 'messages-square',4),

('تجهيز الملفات باحترافية','Professional document preparation','Профессиональная подготовка документов',
 'نراجع ونرتّب جميع مستنداتك (الشهادات، كشوف الدرجات، جواز السفر) ونتولى ترجمتها وتوثيقها بالمعايير المطلوبة.',
 'We review and organise every document you need (certificates, transcripts, passport) and handle translation and authentication to the required standard.',
 'Проверяем и упорядочиваем все ваши документы (аттестаты, выписки оценок, паспорт), берём на себя перевод и легализацию по требуемым стандартам.',
 'briefcase',5),

('التقديم على أكثر من جامعة','Applying to multiple universities','Подача документов в несколько университетов',
 'نقدّم ملفك على عدة جامعات صينية تناسب تخصصك وميزانيتك في آنٍ واحد، لرفع فرص قبولك.',
 'We submit your file to several Chinese universities that fit your major and budget at the same time, to raise your chances of admission.',
 'Одновременно подаём ваши документы в несколько китайских университетов, подходящих по специальности и бюджету, чтобы повысить шансы на зачисление.',
 'building',6),

('انتظار نتيجة القبول','Awaiting the admission result','Ожидание результата зачисления',
 'نتابع طلبك مباشرة مع الجامعات ونبقيك على اطلاع بكل مستجدّ حتى وصول الرد الرسمي.',
 'We follow up directly with the universities and keep you updated on every development until the official reply arrives.',
 'Напрямую отслеживаем ваш статус в университетах и держим вас в курсе всех новостей до официального ответа.',
 'sparkles',7),

('إجراءات القبول الرسمية','Official admission procedures','Оформление официального зачисления',
 'عند وصول القبول، نساعدك في استكمال كل إجراءاته الرسمية وفهم خطواته التالية بوضوح.',
 'Once your admission arrives, we help you complete all the official procedures and clearly understand the next steps.',
 'После получения зачисления помогаем оформить все официальные процедуры и понятно объясняем следующие шаги.',
 'award',8),

('تجهيز ملف الفيزا والتقديم عليها','Visa document prep and application','Подготовка документов и подача на визу',
 'نساعدك في تجهيز كل مستندات تأشيرة الدراسة الصينية (X1/X2) والتقديم عليها بالطريقة الصحيحة.',
 'We help you prepare every document for the Chinese study visa (X1/X2) and apply for it the correct way.',
 'Помогаем подготовить все документы для учебной визы в Китай (X1/X2) и правильно подать заявление.',
 'stamp',9),

('حجز الطيران واستقبالك في المطار','Flight booking and airport pickup','Бронирование рейса и встреча в аэропорту',
 'نساعدك في حجز رحلة الطيران، ونستقبلك في مطار مدينتك الصينية عند الوصول إن رغبت بذلك.',
 'We help you book your flight, and meet you at the airport of your Chinese city on arrival if you would like.',
 'Помогаем забронировать рейс и, при желании, встречаем вас в аэропорту вашего китайского города по прибытии.',
 'plane-landing',10),

('إعداد VPN ووسائل الدفع في الصين','VPN and payment setup in China','Настройка VPN и способов оплаты в Китае',
 'نساعدك في تجهيز VPN موثوق ووسائل الدفع الإلكترونية المستخدمة في الصين، لتبدأ حياتك اليومية هناك دون تعقيد.',
 'We help you set up a reliable VPN and the electronic payment methods used in China, so your daily life there starts without hassle.',
 'Помогаем настроить надёжный VPN и электронные способы оплаты, используемые в Китае, чтобы повседневная жизнь началась без сложностей.',
 'globe',11)
on conflict do nothing;

-- ---------- rewrite the live services copy to match the real business model ----------
update public.services set
  description_ar = 'نساعدك في التقديم لبرامج البكالوريوس والماجستير والدكتوراه عبر المنصات الرسمية للجامعات الصينية. أغلب برامج الماجستير والدكتوراه (حتى 90%) تمنح منحاً كاملة أو جزئية للطلاب الدوليين، ونتولى عنك تجهيز جميع المستندات وترجمتها وتوثيقها حتى صدور خطاب القبول.',
  description_en = 'We help you apply for bachelor''s, master''s and PhD programmes through the official portals of Chinese universities. Most master''s and PhD programmes (up to 90%) offer full or partial scholarships to international students, and we handle preparing, translating and authenticating every document until your admission letter is issued.',
  description_ru = 'Помогаем подать документы на бакалавриат, магистратуру и докторантуру через официальные порталы китайских вузов. Большинство программ магистратуры и докторантуры (до 90%) предлагают полные или частичные стипендии иностранным студентам, а мы берём на себя подготовку, перевод и легализацию всех документов до получения письма о зачислении.'
where title_ar = 'القبول الجامعي';

update public.services set
  description_ar = 'لسنا الجهة التي تُدرّس اللغة الصينية، بل نتولى تسجيلك في برنامج سنة أو فصل تحضيري معتمد داخل جامعة صينية لتعلّم اللغة، ونساعدك في اختيار المستوى المناسب والجامعة المضيفة والتخطيط لتحقيق مستوى HSK المطلوب لتخصصك.',
  description_en = 'We are not the language teacher — we register you in an accredited preparatory year or semester at a Chinese university to learn the language, helping you choose the right level, host university and a plan to reach the HSK level your major requires.',
  description_ru = 'Мы не преподаём китайский язык сами — мы регистрируем вас на аккредитованный подготовительный год или семестр в китайском университете для изучения языка, помогаем выбрать подходящий уровень, принимающий вуз и построить план до нужного уровня HSK для вашей специальности.'
where title_ar = 'برامج اللغة الصينية (HSK)';

update public.services set
  description_ar = 'هذا هو محور عملنا: أغلب الجامعات الصينية تمنح منحاً جزئية أو كاملة لطلابها الدوليين — منحة حكومية (CSC)، منح المقاطعات، ومنح جامعية داخلية. نساعدك في اختيار المسار الأنسب لملفك وتجهيز ملف تقديم قوي (خطاب الدوافع، خطة الدراسة، رسائل التوصية) لرفع فرصك الحقيقية في الحصول على منحة.',
  description_en = 'This is the heart of what we do: most Chinese universities offer partial or full scholarships to international students — the government scholarship (CSC), provincial scholarships, and internal university scholarships. We help you pick the right track for your profile and build a strong application (motivation letter, study plan, recommendation letters) to maximise your real chances of winning one.',
  description_ru = 'Это суть нашей работы: большинство китайских университетов предлагают иностранным студентам частичные или полные стипендии — государственную стипендию (CSC), провинциальные и внутренние стипендии вуза. Мы поможем выбрать подходящий путь и подготовить сильную заявку (мотивационное письмо, учебный план, рекомендации), чтобы повысить ваши реальные шансы на стипендию.'
where title_ar = 'المنح الدراسية';

update public.services set
  description_ar = 'تدريب مركّز على اختبارات اللغة (HSK/HSKK) وأي اختبارات أخرى تطلبها الجامعة أو جهة المنحة، مع خطة زمنية واقعية ونماذج تدريبية ومتابعة مستواك حتى يوم الاختبار.',
  description_en = 'Focused training for language exams (HSK/HSKK) and any other test your university or scholarship provider requires, with a realistic timeline, practice papers and progress tracking up to exam day.',
  description_ru = 'Целенаправленная подготовка к языковым экзаменам (HSK/HSKK) и любым другим тестам, которые требует вуз или стипендиальная программа: реалистичный график, пробные задания и контроль прогресса до дня экзамена.'
where title_ar = 'التحضير للاختبارات';

update public.services set
  description_ar = 'تجهيزك لمقابلات القبول والمنح: الأسئلة المتوقعة، طريقة عرض خطتك الدراسية، بالإضافة إلى مساعدتك في تحضير فيديو تعريفي احترافي عن نفسك يُرفق مع ملف التقديم لرفع فرص نجاحك.',
  description_en = 'Getting you ready for admission and scholarship interviews: expected questions, how to present your study plan, plus help preparing a professional introduction video to attach to your application and raise your chances.',
  description_ru = 'Подготовка к собеседованиям на поступление и стипендию: ожидаемые вопросы, презентация учебного плана, а также помощь в создании профессионального видео-визитки для заявки, повышающей ваши шансы.'
where title_ar = 'التحضير للمقابلات';
