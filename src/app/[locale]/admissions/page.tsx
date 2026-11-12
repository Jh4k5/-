import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import AdmissionsStrip from "@/components/site/AdmissionsStrip";
import AdmissionsGrid from "@/components/site/AdmissionsGrid";
import FinalCTA from "@/components/site/FinalCTA";
import { getDictionary } from "@/i18n";
import { isLocale, type Locale } from "@/i18n/config";
import { getAdmissions, getSettings } from "@/lib/data";
import { settingText, whatsappLink } from "@/lib/settings-helpers";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);
  const keywords = {
    ar: ['نماذج قبول جامعي حقيقية', 'خطاب قبول الصين', 'قبول جامعي في الصين', 'أمثلة قبول منح CSC'],
    en: ['real China admission letters', 'China acceptance letter', 'China university admission', 'CSC scholarship acceptance examples'],
    ru: ['письма о зачислении в Китае', 'поступление в китайский вуз', 'примеры зачисления по стипендии CSC'],
  }[locale];

  return buildMetadata({
    locale,
    path: "/admissions",
    title: dict.admissions.title,
    description: dict.admissions.subtitle,
    keywords,
  });
}

export default async function AdmissionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);
  const [admissions, settings] = await Promise.all([getAdmissions(), getSettings()]);
  const disclaimer = settingText(settings, "admissions_disclaimer", locale);

  return (
    <>
      <PageHero
        title={dict.admissions.title}
        subtitle={dict.admissions.subtitle}
        scene="night-bridge"
      />

      {admissions.length > 0 ? (
        <>
          <AdmissionsStrip
            items={admissions.slice(0, 10)}
            locale={locale}
            dict={dict}
            showAllLink={false}
            disclaimer={disclaimer}
          />
          <section className="container-page section-pad">
            <AdmissionsGrid items={admissions} locale={locale} dict={dict} disclaimer={disclaimer} />
          </section>
        </>
      ) : (
        <section className="container-page section-pad text-center text-charcoal/60">
          {dict.admissions.empty}
        </section>
      )}

      <FinalCTA locale={locale} dict={dict} whatsapp={whatsappLink(settings, dict.meta.tagline)} />
    </>
  );
}
