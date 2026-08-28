import JsonLd from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Hero from "@/components/site/Hero";
import TrustBar from "@/components/site/TrustBar";
import AboutTeaser from "@/components/site/AboutTeaser";
import SectionHeading from "@/components/site/SectionHeading";
import ServicesEditorial from "@/components/site/ServicesEditorial";
import DestinationsSection from "@/components/site/DestinationsSection";
import StoriesGrid from "@/components/site/StoriesGrid";
import ArticleCard from "@/components/site/ArticleCard";
import AdmissionsStrip from "@/components/site/AdmissionsStrip";
import UniversitiesShowcase from "@/components/site/UniversitiesShowcase";
import ProcessSection from "@/components/site/ProcessSection";
import StudyPathsSection from "@/components/site/StudyPathsSection";
import LanguagePlatformSection from "@/components/site/LanguagePlatformSection";
import FaqSection from "@/components/site/FaqSection";
import FinalCTA from "@/components/site/FinalCTA";
import ViewTracker from "@/components/site/ViewTracker";
import Reveal from "@/components/motion/Reveal";
import { getDictionary } from "@/i18n";
import { isLocale, pick, type Locale } from "@/i18n/config";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import {
  getAdmissions,
  getArticles,
  getDestinations,
  getFaqs,
  getFeaturedUniversities,
  getHeroSlides,
  getProcessStages,
  getSections,
  getServices,
  getSettings,
  getStories,
  getStudyPaths,
  getWhyChinaPoints,
} from "@/lib/data";
import { settingText, whatsappLink } from "@/lib/settings-helpers";
import { heroOverlay } from "@/lib/theme";
import { buildMetadata } from "@/lib/seo";
import type { SiteSection } from "@/lib/types";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);
  const settings = await getSettings();

  // The owner's own words for what people actually type into Google when
  // looking for this site — its Arabic and Latin-script name variants, the
  // CSC exam, and the core services — so the homepage is eligible for all of
  // them, not just the phrasing already in the title and description above.
  const keywords = {
    ar: [
      "جسر الصين للمنح الدراسية",
      "جسر إلى الصين",
      "جسر الصين التعليمية",
      "منح دراسية الصين",
      "القبول الجامعي في الصين",
      "اختبار CSC",
      "منحة CSC",
      "الدراسة في الصين",
      "الجامعات الصينية",
    ],
    en: [
      "Jisr to China",
      "Bridge to China",
      "Bridge to China Edu",
      "China scholarships",
      "CSC scholarship exam",
      "study in China",
      "China university admission",
      "Chinese universities",
    ],
    ru: [
      "Bridge to China Edu",
      "стипендии в Китае",
      "экзамен CSC",
      "поступление в вузы Китая",
      "учёба в Китае",
      "китайские университеты",
    ],
  }[locale];

  return buildMetadata({
    locale,
    path: "",
    title: `${dict.meta.siteName} — ${dict.meta.tagline}`,
    description: dict.meta.description,
    settings,
    keywords,
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);
  const rtl = locale === "ar";
  const Arrow = rtl ? ArrowLeft : ArrowRight;

  const [
    slides,
    services,
    processStages,
    whyChinaPoints,
    destinations,
    stories,
    articles,
    settings,
    sections,
    admissions,
    universities,
    faqs,
    studyPaths,
  ] = await Promise.all([
    getHeroSlides(),
    getServices(),
    getProcessStages(),
    getWhyChinaPoints(),
    getDestinations(),
    getStories(3),
    getArticles(3),
    getSettings(),
    getSections(),
    getAdmissions(6),
    getFeaturedUniversities(3),
    getFaqs(),
    getStudyPaths(),
  ]);

  const whatsapp = whatsappLink(settings, dict.meta.tagline);

  /** Dashboard overrides win; otherwise the translated default is used. */
  const heading = (section: SiteSection, field: "title" | "subtitle", fallback: string) =>
    pick(section, field, locale) || fallback;

  // Eyebrow and button label are editable per section too, so no visible string
  // on this page is locked in code. Null falls back to the dictionary.
  const eyebrow = (section: SiteSection, fallback: string) =>
    pick(section, "eyebrow", locale) || fallback;
  const ctaLabel = (section: SiteSection, fallback: string) =>
    pick(section, "cta_label", locale) || fallback;

  const renderBody = (section: SiteSection) => {
    switch (section.key) {
      case "process":
        return (
          <ProcessSection
            key={section.key}
            stages={processStages}
            locale={locale}
            dict={dict}
            title={heading(section, "title", dict.process.title)}
            subtitle={heading(section, "subtitle", dict.process.subtitle)}
            whatsapp={whatsapp}
          />
        );

      case "study_paths":
        return (
          <StudyPathsSection
            key={section.key}
            paths={studyPaths}
            locale={locale}
            dict={dict}
            title={heading(section, "title", dict.studyPaths.title)}
            subtitle={heading(section, "subtitle", dict.studyPaths.subtitle)}
          />
        );

      case "language_platform":
        return (
          <LanguagePlatformSection
            key={section.key}
            locale={locale}
            dict={dict}
            settings={settings}
            title={heading(section, "title", dict.languagePlatform.title)}
          />
        );

      case "trust_bar":
        return <TrustBar key={section.key} locale={locale} settings={settings} />;

      case "about":
        return (
          <AboutTeaser
            key={section.key}
            locale={locale}
            dict={dict}
            settings={settings}
            title={heading(section, "title", dict.about.title)}
          />
        );

      case "admissions":
        return (
          <AdmissionsStrip
            key={section.key}
            items={admissions}
            locale={locale}
            dict={dict}
            title={heading(section, "title", dict.admissions.title)}
            subtitle={heading(section, "subtitle", dict.admissions.subtitle)}
            disclaimer={settingText(settings, "admissions_disclaimer", locale)}
          />
        );

      case "universities":
        return (
          <UniversitiesShowcase
            key={section.key}
            universities={universities}
            locale={locale}
            dict={dict}
            title={heading(section, "title", dict.universities.title)}
            subtitle={heading(section, "subtitle", dict.universities.subtitle)}
          />
        );

      case "destinations":
        return (
          <DestinationsSection
            key={section.key}
            items={destinations}
            locale={locale}
            dict={dict}
            title={heading(section, "title", dict.explore.title)}
            subtitle={heading(section, "subtitle", dict.explore.subtitle)}
          />
        );

      case "services":
        return (
          <ViewTracker key={section.key} event={ANALYTICS_EVENTS.servicesView} locale={locale}>
            <section className="container-page py-24">
              <SectionHeading
                eyebrow={eyebrow(section, dict.nav.services)}
                title={heading(section, "title", dict.services.title)}
                subtitle={heading(section, "subtitle", dict.services.subtitle)}
              />
              <div className="mt-14">
                <ServicesEditorial services={services} locale={locale} dict={dict} />
              </div>
            </section>
          </ViewTracker>
        );

      case "why_china":
        return (
          <section key={section.key} className="container-page py-24">
            <div className="grid items-start gap-12 lg:grid-cols-2">
              <SectionHeading
                eyebrow={eyebrow(section, dict.nav.whyChina)}
                title={heading(section, "title", dict.whyChina.title)}
                subtitle={heading(section, "subtitle", dict.whyChina.subtitle)}
                align="start"
              />

              <Reveal delay={120} direction="start">
                <ul className="divide-y divide-trust-blue/10">
                  {whyChinaPoints.slice(0, 4).map((point, index) => (
                    <li key={point.id} className="flex gap-4 py-4 first:pt-0">
                      <span className="shrink-0 font-[family-name:var(--font-display)] text-xl font-extrabold text-imperial-gold">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="font-extrabold text-trust-blue">{pick(point, "title", locale)}</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-charcoal/70">
                          {pick(point, "description", locale)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>
        );

      case "stories":
        return (
          <section key={section.key} className="bg-white py-24">
            <div className="container-page">
              <SectionHeading
                eyebrow={eyebrow(section, dict.nav.stories)}
                title={heading(section, "title", dict.stories.title)}
                subtitle={heading(section, "subtitle", dict.stories.subtitle)}
              />
              <div className="mt-14">
                <StoriesGrid stories={stories} locale={locale} dict={dict} />
              </div>
              <div className="mt-10 flex justify-center">
                <Link
                  href={`/${locale}/stories`}
                  className="group inline-flex items-center gap-2 rounded-full border-2 border-china-red px-7 py-3 text-sm font-bold text-china-red transition-all duration-300 hover:-translate-y-0.5 hover:bg-china-red hover:text-white"
                >
                  {ctaLabel(section, dict.stories.viewAll)}
                  <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>
        );

      case "blog":
        if (articles.length === 0) return null;
        return (
          <section key={section.key} className="container-page py-24">
            <SectionHeading
              eyebrow={eyebrow(section, dict.nav.blog)}
              title={heading(section, "title", dict.blog.latest)}
              subtitle={heading(section, "subtitle", dict.blog.subtitle)}
            />
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, index) => (
                <Reveal key={article.id} delay={index * 80} direction="scale">
                  <ArticleCard article={article} locale={locale} dict={dict} />
                </Reveal>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Link
                href={`/${locale}/blog`}
                className="group inline-flex items-center gap-2 rounded-full border-2 border-trust-blue px-7 py-3 text-sm font-bold text-trust-blue transition-all duration-300 hover:-translate-y-0.5 hover:bg-trust-blue hover:text-white"
              >
                {ctaLabel(section, dict.blog.viewAll)}
                <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </section>
        );

      case "faq":
        if (faqs.length === 0) return null;
        return (
          <FaqSection
            key={section.key}
            items={faqs}
            locale={locale}
            dict={dict}
            limit={4}
            title={heading(section, "title", dict.faq.title)}
            subtitle={heading(section, "subtitle", dict.faq.subtitle)}
          />
        );

      case "final_cta":
        return <FinalCTA key={section.key} locale={locale} dict={dict} whatsapp={whatsapp} />;

      default:
        return null;
    }
  };

  const render = (section: SiteSection) => {
    const body = renderBody(section);
    if (!body) return null;
    return (
      <div key={section.key} id={section.key.replace(/_/g, "-")} className="scroll-mt-24">
        {body}
      </div>
    );
  };

  const faqSectionVisible = sections.some((section) => section.key === "faq");
  const faqJsonLd =
    faqSectionVisible && faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((item) => ({
            "@type": "Question",
            name: pick(item, "question", locale),
            acceptedAnswer: {
              "@type": "Answer",
              text: pick(item, "answer", locale),
            },
          })),
        }
      : null;

  return (
    <>
      {faqJsonLd && (
        <JsonLd data={faqJsonLd} />
      )}
      <Hero
        locale={locale}
        dict={dict}
        slides={slides}
        rtl={rtl}
        overlay={heroOverlay(settings)}
        whatsapp={whatsapp}
        settings={settings}
      />
      {sections.map(render)}
    </>
  );
}
