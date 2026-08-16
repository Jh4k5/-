import ar, { type Dictionary } from "./dictionaries/ar";
import en from "./dictionaries/en";
import ru from "./dictionaries/ru";
import { type Locale } from "./config";

const dictionaries: Record<Locale, Dictionary> = { ar, en, ru };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? ar;
}

export type { Dictionary };
export * from "./config";
