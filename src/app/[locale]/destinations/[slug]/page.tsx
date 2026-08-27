import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import MediaFrame from "@/components/ui/MediaFrame";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import UniversityCard from "@/components/site/UniversityCard";
import FinalCTA from "@/components/site/FinalCTA";
import Reveal from "@/components/motion/Reveal";
import { getDictionary } from "@/i18n";
import { isLocale, pick, type Locale } from "@/i18n/config";
import { getDestinationBySlug, getDestinations, getSettings, getUniversities } from "@/lib/data";
import { whatsappLink } from "@/lib/settings-helpers";
import { breadcrumbJsonLd, buildMetadata, jsonLdScript } from "@/lib/seo";
import { slugify } from "@/lib/slug";

export const revalidate = 60;

/** Only real cities get their own page — campus photos stay in the gallery. */
export async function generateStaticParams() {
  const all = await getDestinations();
  return all
    .filter((item) => item.category === "city" && item.slug)
    .map((item) => ({ slug: item.slug as string }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const city = await getDestinationBySlug(slug);
  if (!city) return { title: "404" };

  const name = pick(city, "title", locale);
  return buildMetadata({
    locale,
    path: `/destinations/${slug}`,
    title: name,
    description:
      pick(city, "description", locale).slice(0, 155) || `${name} — ${dictDescription(locale)}`,
    image: city.image_url?.startsWith("scene:") ? null : city.image_url,
  });
}

function dictDescription(locale: Locale) {
  return getDictionary(locale).explore.subtitle;
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);

  const [city, settings, universities, all] = await Promise.all([
    getDestinationBySlug(slug),
    getSettings(),
    getUniversities(),
    getDestinations(),
  ]);

  if (!city) notFound();

  const name = pick(city, "title", locale);
  const description = pick(city, "description", locale);

  // A city page is only substantial if it lists what you can actually study
  // there, so pull every university whose city matches this slug.
  const inCity = universities.filter(
    (uni) =>
      slugify(uni.city_en) === slug ||
      slugify(uni.city_ar) === slug ||
      slugify(uni.name) === slug,
  );

  const otherCities = all
    .filter((item) => item.category === "city" && item.slug && item.slug !== slug)
    .slice(0, 4);

  const trail = [
    { name: dict.nav.home, path: "/" },
    { name: dict.explore.title, path: "/destinations" },
    { name: name, path: `/destinations/${slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd(locale, trail, settings))}
      />

      <section className="relative h-[18rem] overflow-hidden bg-trust-blue-dark sm:h-[24rem]">
        <MediaFrame src={city.image_url} alt={city.alt_text || name} priority sceneDetail="full" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(6,14,28,0.45) 0%, rgba(6,14,28,0.8) 100%)",
          }}
        />
        <div className="container-page absolute inset-x-0 bottom-0 pb-8">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold text-imperial-gold">
            <MapPin className="h-3.5 w-3.5" />
            {dict.explore.cityLabel}
          </p>
          <h1 className="mt-2 text-[clamp(1.8rem,4.5vw,3rem)] font-extrabold text-white">{name}</h1>
        </div>
      </section>

      <Breadcrumbs locale={locale} trail={trail} />

      <section className="container-page py-14">
        {description && (
          <Reveal>
            <p className="mx-auto max-w-3xl text-base leading-relaxed text-charcoal/80">
              {description}
            </p>
          </Reveal>
        )}

        {inCity.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-extrabold text-trust-blue">{dict.universities.title}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {inCity.map((uni, index) => (
                <Reveal key={uni.id} delay={index * 70}>
                  <UniversityCard university={uni} locale={locale} dict={dict} />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {otherCities.length > 0 && (
          <div className="mt-16 border-t border-trust-blue/10 pt-8">
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-charcoal/45">
              {dict.explore.title}
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {otherCities.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/${locale}/destinations/${item.slug}`}
                    className="inline-flex rounded-[10px] bg-trust-blue/8 px-4 py-2 text-sm font-bold text-trust-blue transition-colors hover:bg-china-red hover:text-white"
                  >
                    {pick(item, "title", locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <FinalCTA locale={locale} dict={dict} whatsapp={whatsappLink(settings, dict.meta.tagline)} />
    </>
  );
}
