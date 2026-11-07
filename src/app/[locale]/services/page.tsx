import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import SectionHeading from "@/components/site/SectionHeading";
import ServicesGrid from "@/components/site/ServicesGrid";
import Reveal from "@/components/motion/Reveal";
import FinalCTA from "@/components/site/FinalCTA";
import { getDictionary } from "@/i18n";
import { isLocale, pick, type Locale } from "@/i18n/config";
import { getCostFactors, getServices, getSettings } from "@/lib/data";
import { iconFor } from "@/lib/icons";
import { settingText, whatsappLink } from "@/lib/settings-helpers";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

/** Locale-aware fallbacks for settings that may not exist in the database. */
const AFTER_INTERVIEW_TITLE: Record<Locale, string> = {
  ar: "ماذا يحدث بعد المقابلة؟",
  en: "What happens after the interview?",
  ru: "Что происходит после собеседования?",
};

const AFTER_INTERVIEW_STEPS: Record<Locale, string[]> = {
  ar: [
    "نفهم مرحلتك الدراسية وتخصصك وهدفك وميزانيتك.",
    "نراجع المسارات والبرامج التي تناسب ملفك مبدئياً.",
    "نرسل لك خطة تقديم مخصصة لتختار منها.",
    "نبدأ تجهيز الملف والتقديم بعد الاتفاق الواضح على النطاق والتكلفة.",
  ],
  en: [
    "We understand your academic stage, major, goals and budget.",
    "We initially review the tracks and programmes that suit your profile.",
    "We send you a tailored application plan to choose from.",
    "We start preparing your file and applying once the scope and cost are clearly agreed.",
  ],
  ru: [
    "Мы понимаем ваш этап обучения, специальность, цели и бюджет.",
    "Мы предварительно рассматриваем направления и программы, подходящие вашему профилю.",
    "Мы отправляем вам индивидуальный план подачи на выбор.",
    "Мы начинаем подготовку документов и подачу после чёткого согласования объёма и стоимости.",
  ],
};

const COST_TITLE: Record<Locale, string> = {
  ar: "كيف تتحدد التكلفة؟",
  en: "How is the cost determined?",
  ru: "Как определяется стоимость?",
};

const COST_TEXT: Record<Locale, string> = {
  ar: "تختلف التكلفة حسب ملفك والخدمات التي تحتاجها. بعد المقابلة نرسل لك نطاقاً واضحاً وخطة مكتوبة قبل بدء التعاقد، ولا توجد رسوم مخفية خارج ما ينص عليه العقد.",
  en: "The cost varies according to your profile and the services you need. After the interview we send you a clear range and a written plan before the contract begins — there are no hidden fees beyond what the contract states.",
  ru: "Стоимость зависит от вашего профиля и необходимых услуг. После собеседования мы отправляем вам чёткий диапазон и письменный план до начала договора — никаких скрытых платежей сверх условий договора.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);
  const keywords = {
    ar: ['خدمات القبول الجامعي في الصين', 'تجهيز ملف القبول', 'تسجيل برنامج اللغة الصينية', 'ترجمة وتوثيق مستندات', 'خدمات منح دراسية الصين'],
    en: ['China admission services', 'application file preparation', 'Chinese language programme enrolment', 'document translation and authentication', 'China scholarship services'],
    ru: ['услуги поступления в Китае', 'подготовка документов', 'зачисление на языковую программу', 'перевод и легализация документов'],
  }[locale];

  return buildMetadata({
    locale,
    path: "/services",
    title: dict.services.title,
    description: dict.services.subtitle,
    keywords,
  });
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);
  const [services, settings, costFactors] = await Promise.all([
    getServices(),
    getSettings(),
    getCostFactors(),
  ]);

  const afterInterviewTitle = settingText(
    settings,
    "services_after_interview_title",
    locale,
    AFTER_INTERVIEW_TITLE[locale],
  );
  const afterInterviewSteps = AFTER_INTERVIEW_STEPS[locale].map((fallback, index) =>
    settingText(settings, `services_after_interview_step${index + 1}`, locale, fallback),
  );

  const costTitle = settingText(settings, "services_cost_title", locale, COST_TITLE[locale]);
  const costText = settingText(
    settings,
    "cost_transparency_text",
    locale,
    COST_TEXT[locale],
  );

  return (
    <>
      <PageHero title={dict.services.title} subtitle={dict.services.subtitle} scene="campus-library" />

      <section className="container-page py-20">
        <SectionHeading eyebrow={dict.nav.services} title={dict.services.detailsTitle} />
        <div className="mt-14">
          <ServicesGrid services={services} locale={locale} detailed />
        </div>
      </section>

      <section className="border-t border-trust-blue/8 bg-trust-blue/[0.03] py-20">
        <div className="container-page">
          <SectionHeading eyebrow={dict.nav.services} title={afterInterviewTitle} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {afterInterviewSteps.map((step, index) => (
              <Reveal key={step} delay={index * 90}>
                <div className="surface-card h-full p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-jade/10 text-jade">
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="mt-3 block text-xs font-bold text-charcoal/40">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-2 text-base leading-relaxed text-charcoal/80">{step}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {costFactors.length > 0 && (
        <section className="container-page py-20">
          <SectionHeading eyebrow={dict.nav.services} title={costTitle} subtitle={costText} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {costFactors.map((factor, index) => {
              const Icon = iconFor(factor.icon);
              return (
                <Reveal key={factor.id} delay={index * 70}>
                  <div className="surface-card h-full p-6">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-trust-blue/10 text-trust-blue">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <p className="mt-4 font-extrabold text-trust-blue">{pick(factor, "title", locale)}</p>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                      {pick(factor, "description", locale)}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      <FinalCTA locale={locale} dict={dict} whatsapp={whatsappLink(settings, dict.meta.tagline)} />
    </>
  );
}
