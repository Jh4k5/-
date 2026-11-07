import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MotionConfig } from "framer-motion";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import HtmlLangSync from "@/components/site/HtmlLangSync";
import ScrollDepthTracker from "@/components/site/ScrollDepthTracker";
import { getDictionary } from "@/i18n";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getSettings } from "@/lib/data";
import { settingValue, whatsappLink } from "@/lib/settings-helpers";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "ar");

  // Only the title template lives here — canonical, hreflang and OG are set
  // per-page (via buildMetadata) so they reflect the actual current path
  // instead of always pointing at the locale root.
  return {
    title: {
      default: `${dict.meta.siteName} — ${dict.meta.tagline}`,
      template: `%s | ${dict.meta.siteName}`,
    },
    description: dict.meta.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();

  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const settings = await getSettings();
  const whatsapp = whatsappLink(settings, dict.meta.tagline);

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen flex-col">
        {/* Skip link — first focusable element so keyboard users can bypass
            the header before tabbing through every nav item (WCAG 2.4.1). */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-trust-blue focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
        >
          {dict.a11y.skipToContent}
        </a>
        <HtmlLangSync locale={locale} />
        <ScrollDepthTracker locale={locale} />
        <Header
          locale={locale}
          dict={dict}
          whatsapp={whatsapp}
          logoUrl={settingValue(settings, "logo_url")}
        />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer locale={locale} settings={settings} />
        <WhatsAppFloat href={whatsapp} label={dict.common.whatsapp} />
      </div>
    </MotionConfig>
  );
}
