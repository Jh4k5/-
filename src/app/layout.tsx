import JsonLd from "@/components/seo/JsonLd";
import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
// Font weights shipped — audited against actual usage:
//   · Cairo (Arabic display): every font-display usage pairs with
//     font-extrabold/semibold and h1–h5 are weight 800, so 600/700/800 cover
//     it. 400 is never rendered.
//   · Tajawal (Arabic body): font-medium never appears in the codebase, so
//     500 is never rendered. 400 (body/normal) + 700 (bold) cover it.
//   · Manrope Variable: one variable file, all weights.
import "@fontsource/cairo/600.css";
import "@fontsource/cairo/700.css";
import "@fontsource/cairo/800.css";
import "@fontsource/tajawal/400.css";
import "@fontsource/tajawal/700.css";
import "@fontsource-variable/manrope";
import "./globals.css";
import { defaultLocale, dirOf, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { getSettings } from "@/lib/data";
import { motionIntensity, themeStyle } from "@/lib/theme";
import { settingText, settingValue } from "@/lib/settings-helpers";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: {
    default: "جسر الصين التعليمية | Bridge to China Edu",
    template: "%s | جسر الصين التعليمية",
  },
  description:
    "مكتب استشارات تعليمية متخصص حصرياً في الدراسة بالصين — قبول جامعي، منح دراسية، لغة صينية، واستقبال الطالب.",
  icons: {
    icon: [{ url: "/logo-mark.svg", type: "image/svg+xml" }],
  },
  verification: {
    google: "LJl-JQBx91rZFrdUADtap4MnUNwBQtBFpxecbe9deFo",
  },
};

export const viewport: Viewport = {
  themeColor: "#1b3a6b",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headerList = await headers();
  const headerLocale = headerList.get("x-locale");
  const locale = isLocale(headerLocale) ? headerLocale : defaultLocale;

  // Brand colours and motion strength are dashboard-controlled.
  const settings = await getSettings();
  const dict = getDictionary(locale);

  const logo = settingValue(settings, "logo_url");
  const phone = settingValue(settings, "contact_phone");
  const socialLinks = [
    ["facebook_url", "facebook_status"],
    ["instagram_url", "instagram_status"],
    ["youtube_url", "youtube_status"],
    ["tiktok_url", "tiktok_status"],
  ]
    .map(([urlKey, statusKey]) => ({
      url: settingValue(settings, urlKey),
      active: settingValue(settings, statusKey, "hidden") === "active",
    }))
    .filter((item) => item.active && item.url)
    .map((item) => item.url);

  const siteUrl = getSiteUrl(settings);

  // The primary name is now "Bridge to China Edu" / "جسر الصين التعليمية".
  // The site launched under "Bridge to China" / "جسر إلى الصين", and people
  // still search the Latin-script transliteration "Jisr to China" after
  // hearing the name spoken — all three ride as alternateName so Google's
  // entity matching keeps connecting those searches to this Organization
  // through the rename, instead of losing that history.
  const legalName = settingText(settings, "company_legal_name", locale);
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: dict.meta.siteName,
    alternateName: [
      "Bridge to China",
      "جسر إلى الصين",
      "Jisr to China",
      "جسر الصين للمنح الدراسية",
      ...(legalName && legalName !== dict.meta.siteName ? [legalName] : []),
    ],
    url: siteUrl,
    description: dict.meta.description,
    ...(logo ? { logo } : {}),
    ...(phone ? { telephone: phone } : {}),
    ...(socialLinks.length > 0 ? { sameAs: socialLinks } : {}),
    areaServed: "CN",
    knowsAbout: [
      "China university admission",
      "China scholarships",
      "CSC Scholarship exam",
      "HSK exam",
      "Chinese language programmes",
    ],
  };

  /** Lets Google offer a search box for the site directly in results. */
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: dict.meta.siteName,
    url: siteUrl,
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/${locale}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang={locale}
      dir={dirOf(locale)}
      data-motion={motionIntensity(settings)}
      style={themeStyle(settings)}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-ivory text-charcoal antialiased">
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        {children}
      </body>
    </html>
  );
}
