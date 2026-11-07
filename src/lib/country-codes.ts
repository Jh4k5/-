import type { Locale } from "@/i18n/config";

type CountryCode = {
  code: string;
  /** Arabic label (default) — shown on the Arabic contact form. */
  label: string;
  label_en: string;
  label_ru: string;
};

export const COUNTRY_CODES: CountryCode[] = [
  { code: "+20", label: "مصر +20", label_en: "Egypt +20", label_ru: "Египет +20" },
  { code: "+966", label: "السعودية +966", label_en: "Saudi Arabia +966", label_ru: "Саудовская Арабия +966" },
  { code: "+971", label: "الإمارات +971", label_en: "UAE +971", label_ru: "ОАЭ +971" },
  { code: "+965", label: "الكويت +965", label_en: "Kuwait +965", label_ru: "Кувейт +965" },
  { code: "+974", label: "قطر +974", label_en: "Qatar +974", label_ru: "Катар +974" },
  { code: "+973", label: "البحرين +973", label_en: "Bahrain +973", label_ru: "Бахрейн +973" },
  { code: "+968", label: "عُمان +968", label_en: "Oman +968", label_ru: "Оман +968" },
  { code: "+962", label: "الأردن +962", label_en: "Jordan +962", label_ru: "Иордания +962" },
  { code: "+964", label: "العراق +964", label_en: "Iraq +964", label_ru: "Ирак +964" },
  { code: "+212", label: "المغرب +212", label_en: "Morocco +212", label_ru: "Марокко +212" },
  { code: "+213", label: "الجزائر +213", label_en: "Algeria +213", label_ru: "Алжир +213" },
  { code: "+216", label: "تونس +216", label_en: "Tunisia +216", label_ru: "Тунис +216" },
  { code: "+218", label: "ليبيا +218", label_en: "Libya +218", label_ru: "Либия +218" },
  { code: "+249", label: "السودان +249", label_en: "Sudan +249", label_ru: "Судан +249" },
  { code: "+967", label: "اليمن +967", label_en: "Yemen +967", label_ru: "Йемен +967" },
  { code: "+86", label: "الصين +86", label_en: "China +86", label_ru: "Китай +86" },
  { code: "+7", label: "روسيا / كازاخستان +7", label_en: "Russia / Kazakhstan +7", label_ru: "Россия / Казахстан +7" },
  {
    code: "",
    label: "أخرى (اكتب الرمز يدوياً)",
    label_en: "Other (type the code manually)",
    label_ru: "Другое (введите код вручную)",
  },
];

/** Locale-aware label for the country-code dropdown. */
export function countryLabel(entry: CountryCode, locale: Locale): string {
  if (locale === "en") return entry.label_en;
  if (locale === "ru") return entry.label_ru;
  return entry.label;
}
