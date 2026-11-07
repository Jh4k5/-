import JsonLd from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarRange,
  CheckCircle2,
  Globe2,
  GraduationCap,
  MapPin,
  MessageCircle,
  Trophy,
  Users,
} from "lucide-react";
import MediaFrame from "@/components/ui/MediaFrame";
import UniversityGallery from "@/components/site/UniversityGallery";
import Reveal from "@/components/motion/Reveal";
import { languageLabel, universityCity, universityName } from "@/components/site/UniversityCard";
import { getDictionary } from "@/i18n";
import { isLocale, pick, type Locale } from "@/i18n/config";
import { getSettings, getUniversities, getUniversityBySlug } from "@/lib/data";
import { whatsappLink } from "@/lib/settings-helpers";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateStaticParams() {
  const universities = await getUniversities();
  return universities.filter((u) => u.slug).map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const university = await getUniversityBySlug(slug);
  if (!university) return { title: "404" };

  return buildMetadata({
    locale,
    path: `/universities/${slug}`,
    title: universityName(university, locale),
    description: pick(university, "description", locale).slice(0, 155),
    image: university.logo || university.cover_media,
  });
}

export default async function UniversityPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);
  const Arrow = locale === "ar" ? ArrowRight : ArrowLeft;

  const [university, settings, all] = await Promise.all([
    getUniversityBySlug(slug),
    getSettings(),
    getUniversities(),
  ]);

  if (!university) notFound();

  const name = universityName(university, locale);
  const city = universityCity(university, locale);
  const description = pick(university, "description", locale);
  const highlights = pick(university, "highlights", locale)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const trail = [
    { name: dict.nav.home, path: "/" },
    { name: dict.nav.universities, path: "/universities" },
    { name, path: `/universities/${slug}` },
  ];

  const collegeJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name,
    description,
    ...(city ? { address: { "@type": "PostalAddress", addressLocality: city, addressCountry: "CN" } } : {}),
    ...(university.founded_year ? { foundingDate: String(university.founded_year) } : {}),
    ...(university.logo && !university.logo.startsWith("scene:") ? { logo: university.logo } : {}),
  };

  const facts = [
    { Icon: MapPin, label: dict.universities.facts.city, value: city },
    {
      Icon: Trophy,
      label: dict.universities.facts.worldRank,
      value: university.world_rank ? `#${university.world_rank}` : "",
    },
    {
      Icon: CalendarRange,
      label: dict.universities.facts.founded,
      value: university.founded_year ? String(university.founded_year) : "",
    },
    {
      Icon: Users,
      label: dict.universities.facts.students,
      value: university.students_count ? university.students_count.toLocaleString(locale) : "",
    },
    {
      Icon: Globe2,
      label: dict.universities.facts.international,
      value: university.international_students
        ? university.international_students.toLocaleString(locale)
        : "",
    },
    { Icon: GraduationCap, label: dict.universities.facts.language, value: languageLabel(university, dict) },
  ].filter((fact) => fact.value);

  const others = all.filter((item) => item.slug !== university.slug).slice(0, 3);
  const gallery = Array.isArray(university.gallery) ? university.gallery : [];

  return (
    <>
      <JsonLd data={collegeJsonLd} />
      <JsonLd data={breadcrumbJsonLd(locale, trail, settings)} />

      <section className="relative flex min-h-[26rem] items-end overflow-hidden bg-trust-blue-dark pt-28 pb-14">
        <div className="absolute inset-0">
          <div className="ken-burns h-full w-full">
            <MediaFrame src={university.cover_media} alt={name} priority />
          </div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(120deg,color-mix(in_srgb,var(--color-china-red)_55%,transparent)_0%,color-mix(in_srgb,var(--color-trust-blue)_92%,transparent)_60%,rgba(6,14,30,0.96)_100%)]" />

        <div className="container-page relative">
          <Link
            href={`/${locale}/universities`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 transition-colors hover:text-white"
          >
            <Arrow className="h-4 w-4" aria-hidden="true" />
            {dict.universities.backToList}
          </Link>

          <div className="mt-5 flex flex-wrap items-end gap-5">
            {university.logo && (
              <span className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white/95 p-2">
                <MediaFrame src={university.logo} alt={name} className="object-contain" />
              </span>
            )}
            <div>
              <h1 className="text-[clamp(1.9rem,5vw,3.2rem)] font-extrabold text-white" dir="auto">
                {name}
              </h1>
              <p className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/75">
                {city && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    {city}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5" dir="ltr">
                  <Building2 className="h-4 w-4" aria-hidden="true" />
                  {university.name}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ivory to-transparent" />
      </section>

      <section className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[1.55fr_1fr]">
          <Reveal>
            <div>
              <h2 className="text-2xl font-extrabold text-trust-blue">
                {dict.universities.aboutTitle}
              </h2>
              <span className="mt-3 block h-1 w-20 rounded-full bg-china-red" />
              <p className="mt-5 text-[1.0625rem] leading-[1.9] text-charcoal/80">{description}</p>

              {highlights.length > 0 && (
                <>
                  <h3 className="mt-10 text-xl font-extrabold text-trust-blue">
                    {dict.universities.highlightsTitle}
                  </h3>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {highlights.map((line) => (
                      <li
                        key={line}
                        className="flex items-start gap-2.5 rounded-2xl bg-white p-4 shadow-[var(--shadow-soft)]"
                      >
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-jade" aria-hidden="true" />
                        <span className="text-sm leading-relaxed text-charcoal/80">{line}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </Reveal>

          <Reveal delay={120} direction="end">
            <aside className="lg:sticky lg:top-28">
              <div className="surface-card overflow-hidden p-0">
                <div className="bg-trust-blue px-6 py-4">
                  <h2 className="text-lg font-extrabold text-white">
                    {dict.universities.factsTitle}
                  </h2>
                </div>
                <dl className="divide-y divide-trust-blue/8">
                  {facts.map(({ Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3 px-6 py-3.5">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-china-red/10 text-china-red">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <dt className="text-xs text-charcoal/50">{label}</dt>
                        <dd className="truncate text-sm font-bold text-trust-blue" dir="auto">
                          {value}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="relative mt-5 overflow-hidden rounded-2xl bg-china-red p-6 text-white">
                <div className="brand-pattern pointer-events-none absolute inset-0 opacity-40" />
                <h3 className="relative text-lg font-extrabold">{dict.universities.ctaTitle}</h3>
                <p className="relative mt-2 text-sm text-white/80">{dict.universities.ctaText}</p>
                <div className="relative mt-5 flex flex-wrap gap-2">
                  <Link
                    href={`/${locale}/contact`}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-china-red transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    {dict.nav.cta}
                  </Link>
                  <a
                    href={whatsappLink(settings, `${dict.meta.tagline} — ${name}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-jade px-5 py-2.5 text-sm font-bold text-white transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    {dict.common.whatsapp}
                  </a>
                </div>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>

      <UniversityGallery images={gallery} title={dict.universities.galleryTitle} alt={name} locale={locale} />

      {others.length > 0 && (
        <section className="bg-white py-16">
          <div className="container-page">
            <h2 className="text-2xl font-extrabold text-trust-blue">
              {dict.universities.viewAll}
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {others.map((item, index) => (
                <Reveal key={item.id} delay={index * 80} direction="scale">
                  <Link href={`/${locale}/universities/${item.slug}`} className="block">
                    <article className="group relative h-52 overflow-hidden rounded-2xl shadow-[var(--shadow-soft)]">
                      <div className="absolute inset-0 transition-transform duration-[1300ms] group-hover:scale-110">
                        <MediaFrame src={item.cover_media} alt={universityName(item, locale)} />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-trust-blue-dark/90 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <p className="text-lg font-extrabold text-white" dir="auto">
                          {universityName(item, locale)}
                        </p>
                        <p className="text-xs text-white/70">{universityCity(item, locale)}</p>
                      </div>
                    </article>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
