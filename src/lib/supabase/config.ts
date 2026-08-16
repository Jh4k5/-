/**
 * Supabase connection details.
 *
 * The publishable (anon) key is designed to be exposed to the browser — every
 * table is protected by Row Level Security, so it only grants the public read /
 * lead-insert permissions defined in the migration. Values can still be
 * overridden with environment variables on any deployment.
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://hwqvvhnbfnkeqfzpofaa.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "sb_publishable_RAzKlvJ9Qt6EssDgFrajYg_53cJ2bS7";

export const MEDIA_BUCKET = "media";

export const supabaseHost = (() => {
  try {
    return new URL(SUPABASE_URL).hostname;
  } catch {
    return "";
  }
})();
