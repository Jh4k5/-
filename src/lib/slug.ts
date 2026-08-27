/**
 * Mirrors the SQL `public.slugify()` used to backfill slugs in migration
 * 0022, so a city's slug can be matched against `universities.city_en`
 * in TypeScript without storing a second key.
 */
export function slugify(input: string | null | undefined): string {
  return (input ?? "")
    .split("—")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
