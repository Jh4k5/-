import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import SectionHeading from "@/components/site/SectionHeading";
import ServicesGrid from "@/components/site/ServicesGrid";
import FinalCTA from "@/components/site/FinalCTA";
import { getDictionary } from "@/i18n";
import { isLocale, type Locale } from "@/i18n/config";
import { getServices, getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/settings-helpers";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "ar");
  return { title: dict.services.title, description: dict.services.subtitle };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);
  const [services, settings] = await Promise.all([getServices(), getSettings()]);

  return (
    <>
      <PageHero title={dict.services.title} subtitle={dict.services.subtitle} scene="campus-library" />

      <section className="container-page py-20">
        <SectionHeading eyebrow={dict.nav.services} title={dict.services.detailsTitle} />
        <div className="mt-14">
          <ServicesGrid services={services} locale={locale} detailed />
        </div>
      </section>

      <FinalCTA locale={locale} dict={dict} whatsapp={whatsappLink(settings, dict.meta.tagline)} />
    </>
  );
}
