import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
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

  return {
    title: {
      default: `${dict.meta.siteName} — ${dict.meta.tagline}`,
      template: `%s | ${dict.meta.siteName}`,
    },
    description: dict.meta.description,
    alternates: {
      languages: {
        ar: "/ar",
        en: "/en",
        ru: "/ru",
      },
    },
    openGraph: {
      title: `${dict.meta.siteName} — ${dict.meta.tagline}`,
      description: dict.meta.description,
      type: "website",
    },
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
    <div className="flex min-h-screen flex-col">
      <Header
        locale={locale}
        dict={dict}
        whatsapp={whatsapp}
        logoUrl={settingValue(settings, "logo_url")}
      />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} settings={settings} />
      <WhatsAppFloat href={whatsapp} label={dict.common.whatsapp} />
    </div>
  );
}
