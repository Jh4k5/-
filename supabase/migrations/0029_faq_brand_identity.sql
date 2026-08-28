-- A "who are you" FAQ is genuinely useful to a visitor and, unlike stuffing the
-- name into meta tags, this is real on-page content Google can match a brand
-- search against — including the Latin-script transliteration people search
-- for after hearing the name spoken.
insert into public.faqs (question_ar, question_en, question_ru, answer_ar, answer_en, answer_ru, category, display_order, status) values
('من نحن؟ وما اسم المنصة؟',
 'Who are we, and what is the platform called?',
 'Кто мы и как называется платформа?',
 'نحن «جسر إلى الصين» (يُكتب أحياناً Jisr to China)، ويُعرف كياننا التعليمي رسمياً باسم «جسر الصين التعليمية» (Bridge to China Edu) — مكتب استشارات متخصص حصرياً في المنح الدراسية والقبول الجامعي في الصين، من أول استشارة مجانية حتى استقبال الطالب في مطار مدينته الجامعية.',
 'We are "Bridge to China" (also written Jisr to China), and our educational entity is formally known as "Bridge to China Edu" — a consultancy focused exclusively on scholarships and university admission in China, from your first free consultation to being met at the airport of your university city.',
 'Мы — «Bridge to China» (также пишется Jisr to China), а наша образовательная организация официально называется «Bridge to China Edu» — консалтинговое агентство, специализирующееся исключительно на стипендиях и поступлении в вузы Китая, от первой бесплатной консультации до встречи в аэропорту вашего университетского города.',
 null, 21, 'published')
on conflict do nothing;
