import JsonLd from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import MediaFrame from "@/components/ui/MediaFrame";
import PageHero from "@/components/site/PageHero";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import FinalCTA from "@/components/site/FinalCTA";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getDictionary } from "@/i18n";
import { isLocale, pick, type Locale } from "@/i18n/config";
import { getDestinations, getSettings } from "@/lib/data";
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
    path: "/destinations",
    title: dict.explore.title,
    description: dict.explore.subtitle,
  });
}

export default async function DestinationsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);

  const [all, settings] = await Promise.all([getDestinations(), getSettings()]);
  const cities = all.filter((item) => item.category === "city" && item.slug);

  const trail = [
    { name: dict.nav.home, path: "/" },
    { name: dict.explore.title, path: "/destinations" },
  ];

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: dict.explore.title,
    description: dict.explore.subtitle,
    url: `${getSiteUrl(settings)}/${locale}/destinations`,
    hasPart: cities.map((city) => ({
      "@type": "WebPage",
      name: pick(city, "title", locale),
      url: `${getSiteUrl(settings)}/${locale}/destinations/${city.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={collectionJsonLd} />
      <JsonLd data={breadcrumbJsonLd(locale, trail, settings)} />

      <PageHero title={dict.explore.title} subtitle={dict.explore.subtitle} scene="shanghai" />
      <Breadcrumbs locale={locale} trail={trail} />

      <section className="container-page py-14">
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <RevealItem key={city.id}>
              <Link
                href={`/${locale}/destinations/${city.slug}`}
                className="group block overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-soft)]"
              >
                <span className="relative block aspect-4/3 overflow-hidden">
                  <span className="absolute inset-0 block transition-transform duration-[1200ms] group-hover:scale-105">
                    <MediaFrame
                      src={city.image_url}
                      alt={city.alt_text || pick(city, "title", locale)}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-t from-trust-blue-dark/85 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-5">
                    <span className="inline-flex items-center gap-1 text-[0.6875rem] font-bold text-imperial-gold">
                      <MapPin className="h-3 w-3" aria-hidden="true" />
                      {dict.explore.cityLabel}
                    </span>
                    <span className="mt-1 block text-lg font-extrabold text-white">
                      {pick(city, "title", locale)}
                    </span>
                  </span>
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <FinalCTA locale={locale} dict={dict} whatsapp={whatsappLink(settings, dict.meta.tagline)} />
    </>
  );
}
