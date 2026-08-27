import JsonLd from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/site/PageHero";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import FinalCTA from "@/components/site/FinalCTA";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { iconFor } from "@/lib/icons";
import { getDictionary } from "@/i18n";
import { isLocale, pick, type Locale } from "@/i18n/config";
import { getSettings, getStudyPaths } from "@/lib/data";
import { whatsappLink } from "@/lib/settings-helpers";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

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
    path: "/study-paths",
    title: dict.studyPaths.title,
    description: dict.studyPaths.subtitle,
  });
}

export default async function StudyPathsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);

  const [paths, settings] = await Promise.all([getStudyPaths(), getSettings()]);

  const trail = [
    { name: dict.nav.home, path: "/" },
    { name: dict.studyPaths.title, path: "/study-paths" },
  ];

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: dict.studyPaths.title,
    description: dict.studyPaths.subtitle,
    url: `${getSiteUrl(settings)}/${locale}/study-paths`,
    hasPart: paths.map((path) => ({
      "@type": "WebPage",
      name: pick(path, "title", locale),
      url: `${getSiteUrl(settings)}/${locale}/study-paths/${path.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={collectionJsonLd} />
      <JsonLd data={breadcrumbJsonLd(locale, trail, settings)} />

      <PageHero title={dict.studyPaths.title} subtitle={dict.studyPaths.subtitle} scene="campus-quad" />
      <Breadcrumbs locale={locale} trail={trail} />

      <section className="container-page py-14">
        <RevealGroup className="grid gap-5 sm:grid-cols-2">
          {paths.map((path) => {
            const Icon = iconFor(path.icon);
            return (
              <RevealItem key={path.id}>
                <Link
                  href={`/${locale}/study-paths/${path.slug}`}
                  className="surface-card group flex h-full flex-col p-7 transition-transform duration-300 hover:-translate-y-1"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-china-red/10 text-china-red transition-colors duration-300 group-hover:bg-china-red group-hover:text-white">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h2 className="mt-5 text-lg font-extrabold text-trust-blue">
                    {pick(path, "title", locale)}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/70">
                    {pick(path, "description", locale)}
                  </p>
                  <span className="mt-4 text-sm font-bold text-china-red">
                    {dict.studyPaths.cta}
                  </span>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      <FinalCTA locale={locale} dict={dict} whatsapp={whatsappLink(settings, dict.meta.tagline)} />
    </>
  );
}
