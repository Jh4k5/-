-- 0033_default_og_image.sql
--
-- Backfills the default Open Graph share image (SEO-02 from the Phase 3
-- audit). Until now every page shared on WhatsApp / Telegram / Facebook /
-- Twitter rendered as a bare link because `default_og_image` was NULL and
-- no caller supplied an image — a direct loss for a consultancy whose lead
-- funnel runs through messengers.
--
-- The bundled brand asset lives at /public/og-default.png (1344x768) and
-- src/lib/seo.ts resolves it to an absolute URL against the site origin.
-- Owners can still override it from the admin panel (Settings → صورة
-- المشاركة الافتراضية) with their own uploaded image.
--
-- Idempotent: only fills the row when it is empty, never overwrites an
-- owner-chosen value.

insert into public.settings (key, value)
values ('default_og_image', '/og-default.png')
on conflict (key) do nothing;

update public.settings
set value = '/og-default.png'
where key = 'default_og_image'
  and (value is null or value = '');
