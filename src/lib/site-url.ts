import { settingValue, type SettingsMapLike } from "./settings-helpers";

/**
 * Single source of truth for the production origin used in canonical URLs,
 * hreflang alternates, JSON-LD, robots.txt and sitemap.xml. Previously four
 * different files each hardcoded their own fallback — and it was wrong
 * (missing the "-henna" segment of the real Vercel domain), so every one of
 * those tags pointed at a domain that doesn't exist.
 *
 * Priority: admin-editable `site_url` setting > NEXT_PUBLIC_SITE_URL env var
 * (if a real Vercel env var is ever configured) > this corrected fallback.
 */
const FALLBACK_SITE_URL = "https://jisr-to-china-henna.vercel.app";

export function getSiteUrl(settings?: SettingsMapLike): string {
  const fromSetting = settings ? settingValue(settings, "site_url") : "";
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const candidate = fromSetting || fromEnv || FALLBACK_SITE_URL;

  try {
    return new URL(candidate).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}
