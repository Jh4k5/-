import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import FinalCTA from "@/components/site/FinalCTA";
import Reveal from "@/components/motion/Reveal";
import { getDictionary } from "@/i18n";
import { isLocale, pick, type Locale } from "@/i18n/config";
import { getFaqs, getSettings } from "@/lib/data";
import { settingText, whatsappLink } from "@/lib/settings-helpers";
import { breadcrumbJsonLd, buildMetadata, jsonLdScript } from "@/lib/seo";

export const revalidate = 60;

/** Category labels are editable; these are only the last-resort fallbacks. */
const CATEGORY_FALLBACK: Record<string, Record<Locale, string>> = {
  admissions: { ar: "القبول والاختبارات", en: "Admission and exams", ru: "Поступление и экзамены" },
  living: { ar: "المعيشة والتكاليف", en: "Living and costs", ru: "Проживание и расходы" },
  language_platform: { ar: "منصة اللغة", en: "Language platform", ru: "Языковая платформа" },
  general: { ar: "أسئلة عامة", en: "General questions", ru: "Общие вопросы" },
};

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
    path: "/faq",
    title: dict.faq.title,
    description: dict.faq.subtitle,
  });
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);

  const [faqs, settings] = await Promise.all([getFaqs(), getSettings()]);

  // Group by category, keeping uncategorised questions under "general".
  const groups = new Map<string, typeof faqs>();
  for (const faq of faqs) {
    const key = faq.category?.trim() || "general";
    groups.set(key, [...(groups.get(key) ?? []), faq]);
  }

  const label = (key: string) =>
    settingText(
      settings,
      `faq_category_${key}`,
      locale,
      CATEGORY_FALLBACK[key]?.[locale] ?? CATEGORY_FALLBACK.general[locale],
    );

  const trail = [
    { name: dict.nav.home, path: "/" },
    { name: dict.faq.title, path: "/faq" },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: pick(faq, "question", locale),
      acceptedAnswer: { "@type": "Answer", text: pick(faq, "answer", locale) },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqJsonLd)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd(locale, trail, settings))}
      />

      <PageHero title={dict.faq.title} subtitle={dict.faq.subtitle} scene="campus-library" />
      <Breadcrumbs locale={locale} trail={trail} />

      <section className="container-page py-14">
        {faqs.length === 0 ? (
          <p className="text-center text-charcoal/60">{dict.faq.empty}</p>
        ) : (
          <div className="mx-auto max-w-3xl space-y-14">
            {[...groups.entries()].map(([key, items]) => (
              <div key={key}>
                <h2 className="border-b-2 border-imperial-gold pb-3 text-lg font-extrabold text-trust-blue">
                  {label(key)}
                </h2>
                <div className="mt-6 space-y-7">
                  {items.map((faq) => {
                    const question = pick(faq, "question", locale);
                    return (
                      <Reveal key={faq.id}>
                        {/* Anchor per question so any answer is directly linkable. */}
                        <article id={faq.id} className="scroll-mt-24">
                          <h3 className="font-extrabold text-trust-blue">{question}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-charcoal/75">
                            {pick(faq, "answer", locale)}
                          </p>
                        </article>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <FinalCTA locale={locale} dict={dict} whatsapp={whatsappLink(settings, dict.meta.tagline)} />
    </>
  );
}
