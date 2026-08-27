-- =========================================================
-- Prompt 4 §1: correct the live brand colors to the mandated
-- identity hex values (previously a muted approximation).
-- Prompt 4 §10: centralized, admin-editable site URL — fixes
-- the wrong hardcoded fallback domain used across SEO files.
-- =========================================================

update public.settings set value = '#C8102E', updated_at = now() where key = 'brand_primary';
update public.settings set value = '#D4AF37', updated_at = now() where key = 'brand_gold';
update public.settings set value = '#1B3A6B', updated_at = now() where key = 'brand_blue';

insert into public.settings (key, value, value_ar, value_en, value_ru) values
  ('site_url', 'https://jisr-to-china-henna.vercel.app', null, null, null)
on conflict (key) do nothing;
