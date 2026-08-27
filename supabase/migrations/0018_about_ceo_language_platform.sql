-- =========================================================
-- Prompt 3 §5: move the /about page's prose to settings (was
-- hardcoded in the dictionary), add a fully-conditional CEO
-- section, and a terms setting for the new /language-platform page.
-- =========================================================

insert into public.settings (key, value, value_ar, value_en, value_ru) values
  ('about_story_text', null,
   'بدأت فكرة «جسر إلى الصين» من تجربة شخصية مع تعقيد إجراءات الدراسة في الخارج: مستندات متفرقة، معلومات متضاربة، ووعود لا تُنفَّذ. اخترنا أن نتخصص في وجهة واحدة فقط ونتقنها بدل تشتيت الجهد على عشرات الدول. اليوم نرافق الطالب العربي خطوة بخطوة، من أول سؤال عن التخصص وحتى استقباله في مطار المدينة الصينية التي سيدرس فيها.',
   'Bridge to China began with first-hand experience of how complicated studying abroad can be: scattered documents, conflicting information and promises that were never kept. We chose to specialise in a single destination and master it, instead of spreading our effort across dozens of countries. Today we walk with the student step by step, from the first question about a major to being met at the airport of the Chinese city where they will study.',
   '«Мост в Китай» вырос из личного опыта: разрозненные документы, противоречивая информация и невыполненные обещания. Мы решили специализироваться на одном направлении и делать это безупречно, вместо того чтобы распылять усилия на десятки стран. Сегодня мы сопровождаем студента шаг за шагом — от первого вопроса о специальности до встречи в аэропорту китайского города, где он будет учиться.'),
  ('about_vision_text', null,
   'أن نكون الجهة العربية الرائدة في دعم الطلاب الراغبين في الدراسة بالصين، وتحويل طموحاتهم إلى واقع ملموس.',
   'To be the leading Arab reference for students who want to study in China, turning their ambitions into tangible reality.',
   'Стать ведущим центром поддержки студентов, желающих учиться в Китае, и превращать их амбиции в реальный результат.'),
  ('about_mission_text', null,
   'تقديم استشارات وخدمات متكاملة وموثوقة ومبسّطة، تُمكّن الطالب العربي من الالتحاق بالجامعات الصينية وبناء مستقبله الأكاديمي والمهني.',
   'To provide integrated, reliable and simplified consulting and services that enable students to join Chinese universities and build their academic and professional future.',
   'Предоставлять комплексные, надёжные и понятные консультации и услуги, которые позволяют студенту поступить в китайский университет и построить академическое и профессиональное будущее.'),
  ('about_why_exclusive_text', null,
   'لأن نظام القبول الصيني له تفاصيله الخاصة: مواعيد تقديم مختلفة لكل جامعة، متطلبات لغة متفاوتة، ومنح لها شروط دقيقة. التخصص يعني أننا نعرف هذه التفاصيل عن قرب، ولدينا شبكة علاقات فعلية داخل الصين تخدم الطالب بدل أن تتركه وحيداً.',
   'Because the Chinese admission system has its own details: different application windows for every university, varying language requirements and scholarships with precise conditions. Specialising means we know those details closely and hold a real network inside China that serves the student instead of leaving them alone.',
   'Потому что китайская система приёма имеет свои особенности: разные сроки подачи в каждом вузе, разные языковые требования и стипендии с точными условиями. Специализация означает, что мы знаем эти детали изнутри и располагаем реальной сетью контактов в Китае.'),
  ('ceo_section_enabled', 'false', null, null, null),
  ('ceo_name', null, null, null, null),
  ('ceo_photo', null, null, null, null),
  ('ceo_title', null, null, null, null),
  ('ceo_bio', null, null, null, null),
  ('language_platform_terms', null,
   'الاشتراك المجاني لمدة شهرين ينطبق على الطلاب الجدد المسجَّلين معنا، ويشمل الوصول لدروس اللغة الصينية الأساسية. تُطبَّق الشروط الكاملة عند التسجيل.',
   'The two-month free subscription applies to new students registered with us and includes access to core Chinese language lessons. Full terms apply at sign-up.',
   'Бесплатная двухмесячная подписка распространяется на новых студентов, зарегистрированных у нас, и включает доступ к базовым урокам китайского языка. Полные условия действуют при регистрации.')
on conflict (key) do nothing;
