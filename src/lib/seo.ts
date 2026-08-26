import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/config";
import { settingValue, type SettingsMapLike } from "./settings-helpers";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://jisr-to-china.vercel.app").replace(
  /\/$/,
  "",
);

/**
 * Shared metadata builder used by every page. Computes a canonical URL and
 * per-locale alternates from the ACTUAL current path (not a hardcoded root),
 * so hreflang and canonical are correct on every page, not just the homepage.
 */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  settings,
  image,
}: {
  locale: Locale;
  /** Path after the locale segment, e.g. "" or "/services" or "/universities/tsinghua". */
  path: string;
  title: string;
  description: string;
  settings?: SettingsMapLike;
  image?: string | null;
}): Metadata {
  const normalizedPath = path === "/" ? "" : path;
  const canonical = `${SITE_URL}/${locale}${normalizedPath}`;
  const languages = Object.fromEntries(
    locales.map((code) => [code, `${SITE_URL}/${code}${normalizedPath}`]),
  );

  const ogImage = image || (settings ? settingValue(settings, "default_og_image") : "");

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale,
      url: canonical,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}
