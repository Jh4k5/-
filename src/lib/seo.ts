import type { Metadata } from "next";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { settingValue, type SettingsMapLike } from "./settings-helpers";
import { getSiteUrl } from "./site-url";

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
  const siteUrl = getSiteUrl(settings);
  const normalizedPath = path === "/" ? "" : path;
  const canonical = `${siteUrl}/${locale}${normalizedPath}`;
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((code) => [code, `${siteUrl}/${code}${normalizedPath}`]),
  );
  languages["x-default"] = `${siteUrl}/${defaultLocale}${normalizedPath}`;

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

/**
 * BreadcrumbList JSON-LD for any sub-page. Google shows this as the
 * navigation path under the result title instead of a bare URL.
 * `trail` is ordered parent → current, with paths after the locale segment.
 */
export function breadcrumbJsonLd(
  locale: Locale,
  trail: { name: string; path: string }[],
  settings?: SettingsMapLike,
) {
  const siteUrl = getSiteUrl(settings);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${siteUrl}/${locale}${crumb.path === "/" ? "" : crumb.path}`,
    })),
  };
}

/** Serialises a JSON-LD object for a <script type="application/ld+json"> tag. */
export function jsonLdScript(data: unknown) {
  return { __html: JSON.stringify(data) };
}
