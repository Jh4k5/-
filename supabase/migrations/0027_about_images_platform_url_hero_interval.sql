-- Slots the panel had no field for: the two photographs on the About page, the
-- Chinese-language platform's own address, and the pace of the hero slideshow.
insert into public.settings (key, value, value_ar, value_en, value_ru) values
  ('about_image_1', null, null, null, null),
  ('about_image_2', null, null, null, null),
  ('about_image_1_alt', null, 'صورة من مكتب جسر إلى الصين', 'Bridge to China office', 'Офис «Мост в Китай»'),
  ('about_image_2_alt', null, 'طلابنا في الحرم الجامعي', 'Our students on campus', 'Наши студенты в кампусе'),
  ('language_platform_url', null, null, null, null),
  ('language_platform_url_label', null, 'ادخل إلى المنصة', 'Open the platform', 'Открыть платформу'),
  ('hero_slide_interval_ms', '5000', null, null, null)
on conflict (key) do nothing;
