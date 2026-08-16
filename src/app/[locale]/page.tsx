import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Hero from "@/components/site/Hero";
import StatsBar from "@/components/site/StatsBar";
import SectionHeading from "@/components/site/SectionHeading";
import ServicesGrid from "@/components/site/ServicesGrid";
import DestinationsSection from "@/components/site/DestinationsSection";
import StoriesGrid from "@/components/site/StoriesGrid";
import ArticleCard from "@/components/site/ArticleCard";
import FinalCTA from "@/components/site/FinalCTA";
import Reveal from "@/components/ui/Reveal";
import { getDictionary } from "@/i18n";
import { isLocale, type Locale } from "@/i18n/config";
import {
  getArticles,
  getDestinations,
  getHeroSlides,
  getServices,
  getSettings,
  getStories,
} from "@/lib/data";
import { whatsappLink } from "@/lib/settings-helpers";
import { UNIVERSITY_NAMES } from "@/lib/seed-content";

export const revalidate = 60;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);
  const rtl = locale === "ar";
  const Arrow = rtl ? ArrowLeft : ArrowRight;

  const [slides, services, destinations, stories, articles, settings] = await Promise.all([
    getHeroSlides(),
    getServices(),
    getDestinations(),
    getStories(3),
    getArticles(3),
    getSettings(),
  ]);

  return (
    <>
      <Hero locale={locale} dict={dict} slides={slides} rtl={rtl} />

      <StatsBar locale={locale} dict={dict} settings={settings} />

      <DestinationsSection items={destinations} locale={locale} dict={dict} />

      {/* Services preview */}
      <section className="bg-white py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow={dict.nav.services}
            title={dict.services.title}
            subtitle={dict.services.subtitle}
          />
          <div className="mt-14">
            <ServicesGrid services={services.slice(0, 6)} locale={locale} />
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href={`/${locale}/services`}
              className="group inline-flex items-center gap-2 rounded-full border-2 border-trust-blue px-7 py-3 text-sm font-bold text-trust-blue transition-all duration-300 hover:-translate-y-0.5 hover:bg-trust-blue hover:text-white"
            >
              {dict.services.viewAll}
              <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why China teaser */}
      <section className="container-page py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow={dict.nav.whyChina}
            title={dict.whyChina.title}
            subtitle={dict.whyChina.subtitle}
            align="start"
          />

          <Reveal delay={120}>
            <ul className="grid gap-4 sm:grid-cols-2">
              {dict.whyChina.points.slice(0, 4).map((point) => (
                <li key={point.title} className="surface-card p-5">
                  <p className="font-extrabold text-trust-blue">{point.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{point.text}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <div className="mt-14 overflow-hidden rounded-3xl border border-trust-blue/10 bg-white py-6">
            <p className="px-6 text-center text-xs font-bold uppercase tracking-widest text-charcoal/45">
              {dict.whyChina.universitiesTitle}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6">
              {UNIVERSITY_NAMES.map((name) => (
                <span
                  key={name}
                  dir="ltr"
                  className="text-sm font-semibold text-trust-blue/55 transition-colors duration-300 hover:text-china-red"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Success stories preview */}
      <section className="bg-white py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow={dict.nav.stories}
            title={dict.stories.title}
            subtitle={dict.stories.subtitle}
          />
          <div className="mt-14">
            <StoriesGrid stories={stories} locale={locale} dict={dict} />
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href={`/${locale}/stories`}
              className="group inline-flex items-center gap-2 rounded-full border-2 border-china-red px-7 py-3 text-sm font-bold text-china-red transition-all duration-300 hover:-translate-y-0.5 hover:bg-china-red hover:text-white"
            >
              {dict.stories.viewAll}
              <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog preview */}
      {articles.length > 0 && (
        <section className="container-page py-24">
          <SectionHeading
            eyebrow={dict.nav.blog}
            title={dict.blog.latest}
            subtitle={dict.blog.subtitle}
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <Reveal key={article.id} delay={index * 80}>
                <ArticleCard article={article} locale={locale} dict={dict} />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href={`/${locale}/blog`}
              className="group inline-flex items-center gap-2 rounded-full border-2 border-trust-blue px-7 py-3 text-sm font-bold text-trust-blue transition-all duration-300 hover:-translate-y-0.5 hover:bg-trust-blue hover:text-white"
            >
              {dict.blog.viewAll}
              <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
          </div>
        </section>
      )}

      <FinalCTA locale={locale} dict={dict} whatsapp={whatsappLink(settings, dict.meta.tagline)} />
    </>
  );
}
