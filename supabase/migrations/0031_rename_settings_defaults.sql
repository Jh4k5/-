-- Three untouched settings defaults still named the old brand explicitly.
-- Confirmed against the live rows before writing this: all three still held
-- exactly the seed-content.ts default (never edited by the owner), so this is
-- safe to overwrite outright rather than risk clobbering real admin copy.
update public.settings set
  value_ar = 'جسر الصين التعليمية… مستقبل بلا حدود.',
  value_en = 'Bridge to China Edu… a future without borders.',
  value_ru = 'Bridge to China Edu… будущее без границ.',
  updated_at = now()
where key = 'footer_note';

update public.settings set
  value_ar = 'جسر الصين التعليمية — نرافقك خطوة بخطوة نحو جامعتك في الصين',
  value_en = 'Bridge to China Edu — walking with you step by step toward your university in China',
  value_ru = 'Bridge to China Edu — сопровождаем вас шаг за шагом на пути к вашему университету в Китае',
  updated_at = now()
where key = 'footer_builtwith';

update public.settings set
  value_ar = 'بدأت فكرة «جسر الصين التعليمية» (المعروفة سابقاً باسم جسر إلى الصين) من تجربة شخصية مع تعقيد إجراءات الدراسة في الخارج: مستندات متفرقة، معلومات متضاربة، ووعود لا تُنفَّذ. اخترنا أن نتخصص في وجهة واحدة فقط ونتقنها بدل تشتيت الجهد على عشرات الدول. اليوم نرافق الطالب العربي خطوة بخطوة، من أول سؤال عن التخصص وحتى استقباله في مطار المدينة الصينية التي سيدرس فيها.',
  value_en = 'Bridge to China Edu (previously known as Bridge to China) began with first-hand experience of how complicated studying abroad can be: scattered documents, conflicting information and promises that were never kept. We chose to specialise in a single destination and master it, instead of spreading our effort across dozens of countries. Today we walk with the student step by step, from the first question about a major to being met at the airport of the Chinese city where they will study.',
  value_ru = '«Bridge to China Edu» (ранее известное как Bridge to China) выросло из личного опыта: разрозненные документы, противоречивая информация и невыполненные обещания. Мы решили специализироваться на одном направлении и делать это безупречно, вместо того чтобы распылять усилия на десятки стран. Сегодня мы сопровождаем студента шаг за шагом — от первого вопроса о специальности до встречи в аэропорту китайского города, где он будет учиться.',
  updated_at = now()
where key = 'about_story_text';
