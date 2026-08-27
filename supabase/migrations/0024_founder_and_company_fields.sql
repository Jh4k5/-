-- Settings keys backing the rebuilt "About" section: the founder card (name, photo,
-- title, bio) sits beside a short company intro. Name/photo/bio start empty so the
-- card only appears once the owner fills them in from the admin panel.
insert into public.settings (key, value, value_ar, value_en, value_ru) values
  ('founder_name', null, null, null, null),
  ('founder_photo', null, null, null, null),
  ('founder_title', null, 'المؤسس', 'Founder', 'Основатель'),
  ('founder_bio', null, null, null, null),
  ('company_founded_year', null, null, null, null),
  ('company_intro', null,
   'مكتب استشارات تعليمية متخصص حصرياً في الدراسة بالصين — نرافق الطالب من أول سؤال عن التخصص حتى استقراره في مدينته الجامعية.',
   'An educational consultancy focused exclusively on studying in China — we walk with the student from the first question about a major to settling into their university city.',
   'Образовательный консалтинг, работающий исключительно с обучением в Китае — мы сопровождаем студента от первого вопроса о специальности до обустройства в университетском городе.'),
  ('about_team_title', null, 'من يقف خلف المكتب', 'The people behind the office', 'Люди за этим офисом')
on conflict (key) do nothing;
