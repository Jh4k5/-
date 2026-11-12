import type { Locale } from "@/i18n/config";

const LOCALE_TAGS: Record<Locale, string> = {
  ar: "ar-EG",
  en: "en-GB",
  ru: "ru-RU",
};

export function formatDate(value: string | null | undefined, locale: Locale): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale] ?? "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/** Strips HTML and trims to a readable excerpt. */
export function plainExcerpt(html: string, length = 160): string {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > length ? `${text.slice(0, length).trim()}…` : text;
}

/**
 * Estimated reading time in whole minutes. CJK-adjacent Arabic and Cyrillic
 * prose both land near 200 words/minute for study-guidance reading; one
 * minute is the honest floor so a card never promises "0 min".
 */
export function readingMinutes(html: string | null | undefined): number {
  if (!html) return 1;
  const words = plainExcerpt(html, Number.MAX_SAFE_INTEGER).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
