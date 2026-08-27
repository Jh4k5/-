import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import HowItWorksAccordion from "@/components/site/HowItWorksAccordion";
import FinalCTA from "@/components/site/FinalCTA";
import { getDictionary } from "@/i18n";
import { isLocale, type Locale } from "@/i18n/config";
import { getProcessSteps, getProcessStages, getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/settings-helpers";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    path: "/how-it-works",
    title: dict.howItWorks.title,
    description: dict.howItWorks.subtitle,
  });
}

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);

  const [stages, steps, settings] = await Promise.all([
    getProcessStages(),
    getProcessSteps(),
    getSettings(),
  ]);

  return (
    <>
      <PageHero title={dict.howItWorks.title} subtitle={dict.howItWorks.subtitle} scene="campus-quad" />

      <section className="container-page py-20">
        <HowItWorksAccordion stages={stages} steps={steps} locale={locale} />
      </section>

      <FinalCTA locale={locale} dict={dict} whatsapp={whatsappLink(settings, dict.meta.tagline)} />
    </>
  );
}
