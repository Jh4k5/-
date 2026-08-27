-- Search-intent copy for the Chinese-language platform landing page. It targets
-- language-learning queries rather than study-abroad ones, so the title and
-- description are separate from the marketing headline shown on the page.
insert into public.settings (key, value, value_ar, value_en, value_ru) values
  ('language_platform_seo_title', null,
   'منصة تعلّم اللغة الصينية — جسر إلى الصين',
   'Chinese Language Learning Platform — Bridge to China',
   'Платформа изучения китайского языка — Мост в Китай'),
  ('language_platform_seo_description', null,
   'منصة «جسر إلى الصينية» لتعلّم اللغة الصينية والتحضير لاختبار HSK، ترافقك قبل السفر وأثناء دراستك في الصين.',
   'The "Bridge to Chinese" platform for learning Chinese and preparing for the HSK exam — with you before you travel and throughout your studies in China.',
   'Платформа «Мост к китайскому» для изучения китайского языка и подготовки к экзамену HSK — с вами до отъезда и на протяжении учёбы в Китае.')
on conflict (key) do nothing;
