-- =========================================================
-- Prompt 4 §6: rebuild the language-platform section/page as a
-- real marketing asset — new admin-editable settings for the
-- image, headline, offer status, benefits, audiences, and the
-- "how it fits your journey" text. Tags the existing "two months
-- free" FAQ under the language_platform category so the detail
-- page can pull it without a new table.
-- =========================================================

insert into public.settings (key, value, value_ar, value_en, value_ru) values
  ('language_platform_image', null, null, null, null),
  ('language_platform_image_alt', null, 'واجهة منصة تعلّم اللغة الصينية', 'Chinese language platform interface', 'Интерфейс платформы изучения китайского языка'),
  ('language_platform_offer_status', 'active', null, null, null),
  ('language_platform_headline', null,
   'ابدأ الصينية قبل وصولك',
   'Start learning Chinese before you arrive',
   'Начните изучать китайский до отъезда'),
  ('language_platform_benefit_1_text', null,
   'دروس منظمة للمبتدئين من الصفر.',
   'Structured lessons for absolute beginners.',
   'Структурированные уроки для начинающих с нуля.'),
  ('language_platform_benefit_2_text', null,
   'مسار تحضيري لاختبار HSK بحسب مستواك.',
   'A prep track for the HSK exam matched to your level.',
   'Подготовительный курс к экзамену HSK по вашему уровню.'),
  ('language_platform_benefit_3_text', null,
   'تهيئة عملية قبل السفر للتواصل اليومي في الصين.',
   'Practical preparation for everyday communication once you are in China.',
   'Практическая подготовка к повседневному общению в Китае.'),
  ('language_platform_audience_1_title', null, 'المبتدئ', 'The beginner', 'Начинающий'),
  ('language_platform_audience_1_text', null,
   'لا خبرة سابقة باللغة الصينية ويريد أساساً واضحاً قبل التقديم.',
   'No prior Chinese experience and wants a clear foundation before applying.',
   'Нет опыта китайского языка, нужна чёткая основа перед подачей документов.'),
  ('language_platform_audience_2_title', null, 'قبل الجامعة', 'Pre-university', 'Перед университетом'),
  ('language_platform_audience_2_text', null,
   'قُبل أو ينتظر القبول ويريد الوصول مستعداً للحياة الجامعية اليومية.',
   'Admitted or awaiting admission and wants to arrive ready for daily campus life.',
   'Уже зачислен или ожидает зачисления и хочет приехать готовым к учебной жизни.'),
  ('language_platform_audience_3_title', null, 'رفع المستوى (HSK)', 'Raising your HSK level', 'Повышение уровня HSK'),
  ('language_platform_audience_3_text', null,
   'يدرس بالفعل ويريد رفع مستوى HSK المطلوب لتخصصه أو منحته.',
   'Already studying and wants to raise the HSK level their major or scholarship requires.',
   'Уже учится и хочет повысить уровень HSK, требуемый для специальности или стипендии.'),
  ('language_platform_integration_text', null,
   'منصة «Bridge to Chinese» شريك مستقل لتعلّم اللغة، لا بديل عن برنامج اللغة الجامعي الرسمي الذي ننسّق تسجيلك فيه ضمن خدماتنا. الهدف أن تصل لبرنامجك الجامعي وقد بدأت الاستعداد فعلاً، لا أن تبدأ من الصفر في يومك الأول.',
   'The "Bridge to Chinese" platform is an independent partner for language learning, not a substitute for the official university language programme we help you register in. The goal is to arrive at your programme already underway, not to start from zero on day one.',
   'Платформа «Bridge to Chinese» — независимый партнёр для изучения языка, а не замена официальной университетской программе, на которую мы помогаем зарегистрироваться. Цель — приехать на программу уже подготовленным, а не начинать с нуля в первый день.')
on conflict (key) do nothing;

update public.faqs set category = 'language_platform', updated_at = now()
where question_ar = 'ما معنى اشتراك "شهران مجاناً" في تعلّم اللغة الصينية؟';
