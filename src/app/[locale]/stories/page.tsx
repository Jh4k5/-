import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import StoriesGrid from "@/components/site/StoriesGrid";
import FinalCTA from "@/components/site/FinalCTA";
import { getDictionary } from "@/i18n";
import { isLocale, type Locale } from "@/i18n/config";
import { getSettings, getStories } from "@/lib/data";
import { whatsappLink } from "@/lib/settings-helpers";
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
  return buildMetadata({
    locale,
    path: "/stories",
    title: dict.stories.title,
    description: dict.stories.subtitle,
  });
}

export default async function StoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);
  const [stories, settings] = await Promise.all([getStories(), getSettings()]);

  return (
    <>
      <PageHero title={dict.stories.title} subtitle={dict.stories.subtitle} scene="campus-quad" />

      <section className="container-page py-20">
        <StoriesGrid stories={stories} locale={locale} dict={dict} />
      </section>

      <FinalCTA locale={locale} dict={dict} whatsapp={whatsappLink(settings, dict.meta.tagline)} />
    </>
  );
}
