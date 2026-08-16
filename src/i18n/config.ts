export const locales = ["ar", "en", "ru"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

export const localeConfig: Record<
  Locale,
  { label: string; nativeLabel: string; dir: "rtl" | "ltr"; htmlLang: string; short: string }
> = {
  ar: { label: "Arabic", nativeLabel: "العربية", dir: "rtl", htmlLang: "ar", short: "AR" },
  en: { label: "English", nativeLabel: "English", dir: "ltr", htmlLang: "en", short: "EN" },
  ru: { label: "Russian", nativeLabel: "Русский", dir: "ltr", htmlLang: "ru", short: "RU" },
};

export const LOCALE_COOKIE = "jisr_locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function dirOf(locale: Locale) {
  return localeConfig[locale].dir;
}

/**
 * Picks the best available translation for a multilingual record and falls back
 * to the Arabic master copy whenever the admin has not filled a translation in.
 */
export function pick(row: object, field: string, locale: Locale): string {
  const record = row as Record<string, unknown>;
  const localized = record[`${field}_${locale}`];
  if (typeof localized === "string" && localized.trim().length > 0) return localized;
  const arabic = record[`${field}_ar`];
  return typeof arabic === "string" ? arabic : "";
}
