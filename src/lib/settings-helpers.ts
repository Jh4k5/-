import type { Locale } from "@/i18n/config";
import type { SettingRow } from "./types";

export type SettingsMapLike = Record<string, SettingRow | undefined>;

/** Reads a shared (non-translated) setting such as a link, number or handle. */
export function settingValue(settings: SettingsMapLike, key: string, fallback = ""): string {
  const row = settings[key];
  return (row?.value ?? "").trim() || fallback;
}

/** Reads a translated setting, falling back to Arabic and then the shared value. */
export function settingText(
  settings: SettingsMapLike,
  key: string,
  locale: Locale,
  fallback = "",
): string {
  const row = settings[key];
  if (!row) return fallback;
  const localized = row[`value_${locale}` as "value_ar" | "value_en" | "value_ru"];
  if (localized && localized.trim()) return localized;
  if (row.value_ar && row.value_ar.trim()) return row.value_ar;
  return (row.value ?? "").trim() || fallback;
}

export function settingNumber(settings: SettingsMapLike, key: string, fallback: number): number {
  const raw = settingValue(settings, key);
  const parsed = Number.parseInt(raw.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function whatsappLink(settings: SettingsMapLike, message?: string): string {
  const raw = settingValue(settings, "whatsapp_number", "+8613800000000");
  const digits = raw.replace(/[^\d]/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}
