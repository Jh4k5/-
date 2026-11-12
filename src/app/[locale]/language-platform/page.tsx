import { ExternalLink } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/site/PageHero";
import FinalCTA from "@/components/site/FinalCTA";
import ArticleCard from "@/components/site/ArticleCard";
import MediaFrame from "@/components/ui/MediaFrame";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/site/SectionHeading";
import { getDictionary } from "@/i18n";
import { pick, isLocale, type Locale } from "@/i18n/config";
import { getArticles, getFaqs, getSettings } from "@/lib/data";
import { settingText, settingValue, whatsappLink } from "@/lib/settings-helpers";
import { breadcrumbJsonLd, buildMetadata, courseJsonLd } from "@/lib/seo";
import Breadcrumbs from "@/components/site/Breadcrumbs";

export const revalidate = 60;

/** Locale-aware CTA fallback when the platform URL label setting is missing. */
const PLATFORM_CTA: Record<Locale, string> = {
  ar: "ادخل إلى المنصة",
  en: "Enter the platform",
  ru: "Войти на платформу",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);
  const settings = await getSettings();

  // This page targets language-learning intent, which is a different search
  // audience from the rest of the site, so it carries its own keyword set.
  const keywords = {
    ar: ["تعلم اللغة الصينية", "منصة اللغة الصينية", "HSK", "دورة لغة صينية", "الدراسة في الصين"],
    en: ["learn Chinese", "Chinese language platform", "HSK", "Chinese course", "study in China"],
    ru: ["изучение китайского", "платформа китайского языка", "HSK", "курс китайского", "учёба в Китае"],
  }[locale];

  return buildMetadata({
    locale,
    path: "/language-platform",
    title: settingText(settings, "language_platform_seo_title", locale, dict.languagePlatform.title),
    description: settingText(
      settings,
      "language_platform_seo_description",
      locale,
      dict.languagePlatform.subtitle,
    ),
    settings,
    image: settingValue(settings, "language_platform_image") || null,
    keywords,
  });
}

export default async function LanguagePlatformPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);

  const [settings, faqs, articles] = await Promise.all([getSettings(), getFaqs(), getArticles()]);

  const whatsapp = whatsappLink(settings, dict.meta.tagline);
  const image = settingValue(settings, "language_platform_image");
  const imageAlt = settingText(settings, "language_platform_image_alt", locale, dict.languagePlatform.title);
  const headline = settingText(settings, "language_platform_headline", locale, dict.languagePlatform.title);
  const offerStatus = settingValue(settings, "language_platform_offer_status", "active");
  const perkTitle = settingText(settings, "process_bridge_perk_title", locale, "");
  const perkDuration = settingText(settings, "process_bridge_perk_duration", locale, "");
  const perkText = settingText(settings, "process_bridge_perk_text", locale, dict.process.bridgePerk);
  const terms = settingText(settings, "language_platform_terms", locale, "");
  const platformUrl = settingValue(settings, "language_platform_url");
  const platformCta = settingText(
    settings,
    "language_platform_url_label",
    locale,
    PLATFORM_CTA[locale],
  );
  const integrationText = settingText(settings, "language_platform_integration_text", locale, "");

  const audiences = [1, 2, 3]
    .map((n) => ({
      title: settingText(settings, `language_platform_audience_${n}_title`, locale, ""),
      text: settingText(settings, `language_platform_audience_${n}_text`, locale, ""),
    }))
    .filter((a) => a.title && a.text);

  const platformFaqs = faqs.filter((f) => f.category === "language_platform");
  const relatedArticles = articles
    .filter((a) => a.category === "student_life" || a.category === "tips")
    .slice(0, 3);

  const trail = [
    { name: dict.nav.home, path: "/" },
    { name: dict.languagePlatform.title, path: "/language-platform" },
  ];

  return (
    <>
      <JsonLd data={courseJsonLd({
            locale,
            name: headline,
            description: settingText(
              settings,
              "language_platform_seo_description",
              locale,
              dict.languagePlatform.subtitle,
            ),
            path: "/language-platform",
            settings,
            image,
          })} />
      <JsonLd data={breadcrumbJsonLd(locale, trail, settings)} />

      <PageHero title={headline} subtitle={dict.languagePlatform.subtitle} scene="campus-library" />
      <Breadcrumbs locale={locale} trail={trail} />

      {platformUrl && (
        <div className="container-page flex justify-center pt-6">
          <a href={platformUrl} target="_blank" rel="noopener noreferrer" className="btn-seal">
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            {platformCta}
          </a>
        </div>
      )}

      {image && (
        <section className="container-page -mt-10 relative">
          <Reveal>
            <div className="relative mx-auto aspect-21/9 max-w-4xl overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
              <MediaFrame src={image} alt={imageAlt} sceneDetail="full" />
            </div>
          </Reveal>
        </section>
      )}

      {audiences.length > 0 && (
        <section className="container-page section-pad">
          <SectionHeading title={dict.languagePlatform.title} subtitle={dict.languagePlatform.subtitle} />
          <div className="mx-auto mt-12 grid max-w-3xl gap-8 sm:grid-cols-3">
            {audiences.map((audience, index) => (
              <Reveal key={audience.title} delay={index * 70}>
                <div className="border-t-2 border-imperial-gold pt-4 text-center sm:text-start">
                  <h3 className="font-extrabold text-trust-blue">{audience.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{audience.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {integrationText && (
        <section className="bg-white section-pad">
          <div className="container-page">
            <div className="mx-auto max-w-2xl rounded-2xl border-s-4 border-trust-blue bg-ivory p-7 text-center sm:text-start">
              <p className="text-sm leading-relaxed text-charcoal/75">{integrationText}</p>
            </div>
          </div>
        </section>
      )}

      <section className="container-page section-pad">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            {offerStatus === "active" && perkDuration && (
              <span className="inline-flex items-center gap-1.5 rounded-[10px] bg-jade/10 px-3 py-1 text-xs font-bold text-jade">
                {perkDuration}
              </span>
            )}
            {perkTitle && (
              <p className="mt-3 text-xs font-bold uppercase tracking-widest text-trust-blue/60">
                {perkTitle}
              </p>
            )}
            <p className="mt-3 text-base leading-relaxed text-charcoal/75">{perkText}</p>
          </div>
        </Reveal>

        {terms && (
          <Reveal delay={90}>
            <div className="mx-auto mt-8 max-w-2xl rounded-2xl border-s-4 border-imperial-gold bg-white p-6 shadow-[var(--shadow-soft)]">
              <h3 className="text-sm font-extrabold text-trust-blue">
                {dict.languagePlatform.termsTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{terms}</p>
            </div>
          </Reveal>
        )}
      </section>

      {platformFaqs.length > 0 && (
        <section className="bg-ivory-dark/40 section-pad">
          <div className="container-page">
            <SectionHeading title={dict.faq.title} />
            <div className="mx-auto mt-10 max-w-2xl space-y-4">
              {platformFaqs.map((faq) => (
                <Reveal key={faq.id}>
                  <div className="border-b border-trust-blue/10 pb-4">
                    <p className="font-extrabold text-trust-blue">{pick(faq, "question", locale)}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-charcoal/70">
                      {pick(faq, "answer", locale)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedArticles.length > 0 && (
        <section className="container-page section-pad">
          <SectionHeading title={dict.blog.latest} />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {relatedArticles.map((article, index) => (
              <Reveal key={article.id} delay={index * 70} direction="scale">
                <ArticleCard article={article} locale={locale} dict={dict} />
              </Reveal>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              href={`/${locale}/blog`}
              className="text-sm font-bold text-trust-blue underline underline-offset-4"
            >
              {dict.blog.viewAll}
            </Link>
          </div>
        </section>
      )}

      <FinalCTA locale={locale} dict={dict} whatsapp={whatsapp} />
    </>
  );
}
