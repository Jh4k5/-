import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import UniversitiesExplorer from "@/components/site/UniversitiesExplorer";
import FinalCTA from "@/components/site/FinalCTA";
import { getDictionary } from "@/i18n";
import { isLocale, type Locale } from "@/i18n/config";
import { getSettings, getUniversities } from "@/lib/data";
import { whatsappLink } from "@/lib/settings-helpers";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "ar");
  return { title: dict.universities.title, description: dict.universities.subtitle };
}

export default async function UniversitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);
  const [universities, settings] = await Promise.all([getUniversities(), getSettings()]);

  return (
    <>
      <PageHero
        title={dict.universities.title}
        subtitle={dict.universities.subtitle}
        scene="campus-library"
      />

      <section className="container-page py-16">
        <UniversitiesExplorer universities={universities} locale={locale} dict={dict} />
      </section>

      <FinalCTA locale={locale} dict={dict} whatsapp={whatsappLink(settings, dict.meta.tagline)} />
    </>
  );
}
