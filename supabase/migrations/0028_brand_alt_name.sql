-- The owner is adopting a formal brand pairing — "جسر الصين التعليمية" / "Bridge to
-- China Edu" — as the entity's registered/legal name, distinct from the everyday
-- display name in the header. Stored so it can be edited from the panel and fed
-- into the Organization schema (alternateName/legalName), which is what actually
-- helps Google associate brand-name searches (including "Jisr to China") with
-- this site — rather than hardcoding it into components.
insert into public.settings (key, value, value_ar, value_en, value_ru) values
  ('company_legal_name', null, 'جسر الصين التعليمية', 'Bridge to China Edu', 'Bridge to China Edu')
on conflict (key) do nothing;
