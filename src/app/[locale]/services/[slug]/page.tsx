import JsonLd from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, MessageCircle, X } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import FinalCTA from "@/components/site/FinalCTA";
import Reveal from "@/components/motion/Reveal";
import { iconFor } from "@/lib/icons";
import { getDictionary } from "@/i18n";
import { isLocale, pick, type Locale } from "@/i18n/config";
import { getServiceBySlug, getServices, getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/settings-helpers";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 60;

export async function generateStaticParams() {
  const services = await getServices();
  return services.filter((s) => s.slug).map((s) => ({ slug: s.slug as string }));
}

function lines(value: string) {
  return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "404" };

  return buildMetadata({
    locale,
    path: `/services/${slug}`,
    title: pick(service, "title", locale),
    description: pick(service, "description", locale).slice(0, 155),
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);

  const [service, settings, all] = await Promise.all([
    getServiceBySlug(slug),
    getSettings(),
    getServices(),
  ]);

  if (!service) notFound();

  const title = pick(service, "title", locale);
  const description = pick(service, "description", locale);
  const includes = lines(pick(service, "includes", locale));
  const excludes = lines(pick(service, "excludes", locale));
  const Icon = iconFor(service.icon);
  const others = all.filter((item) => item.slug && item.slug !== slug).slice(0, 3);

  const trail = [
    { name: dict.nav.home, path: "/" },
    { name: dict.nav.services, path: "/services" },
    { name: title, path: `/services/${slug}` },
  ];

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    description,
    serviceType: title,
    provider: {
      "@type": "EducationalOrganization",
      name: dict.meta.siteName,
      url: getSiteUrl(settings),
    },
    areaServed: "CN",
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd(locale, trail, settings)} />

      <PageHero title={title} subtitle={dict.services.subtitle} scene="campus-gate" />
      <Breadcrumbs locale={locale} trail={trail} />

      <section className="container-page py-14">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-china-red/10 text-china-red">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="mt-6 text-base leading-relaxed text-charcoal/80">{description}</p>
          </Reveal>

          {(includes.length > 0 || excludes.length > 0) && (
            <Reveal delay={90}>
              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                {includes.length > 0 && (
                  <div>
                    <h2 className="text-sm font-extrabold uppercase tracking-widest text-trust-blue">
                      {dict.services.detailsTitle}
                    </h2>
                    <ul className="mt-4 space-y-2.5">
                      {includes.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-charcoal/80">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-jade" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {excludes.length > 0 && (
                  <div>
                    <h2 className="text-sm font-extrabold uppercase tracking-widest text-charcoal/50">
                      {dict.faq.title}
                    </h2>
                    <ul className="mt-4 space-y-2.5">
                      {excludes.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-charcoal/60">
                          <X className="mt-0.5 h-4 w-4 shrink-0 text-china-red/70" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Reveal>
          )}

          <Reveal delay={140}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href={`/${locale}/contact#booking`}
                className="inline-flex items-center gap-2 rounded-full bg-china-red px-7 py-3.5 text-base font-bold text-white transition-transform duration-300 hover:-translate-y-0.5"
              >
                {dict.hero.ctaPrimary}
              </Link>
              <a
                href={whatsappLink(settings, title)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[10px] border border-jade px-6 py-3 text-sm font-bold text-jade transition-colors hover:bg-jade hover:text-white"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                {dict.common.whatsapp}
              </a>
            </div>
          </Reveal>
        </div>

        {others.length > 0 && (
          <div className="mx-auto mt-16 max-w-3xl border-t border-trust-blue/10 pt-8">
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-charcoal/45">
              {dict.services.viewAll}
            </h2>
            <ul className="mt-4 divide-y divide-trust-blue/10">
              {others.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/${locale}/services/${item.slug}`}
                    className="flex items-center justify-between gap-4 py-3.5 text-sm font-bold text-trust-blue transition-colors hover:text-china-red"
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
