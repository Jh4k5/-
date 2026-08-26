import type { Metadata } from "next";
import { Eye, HeartHandshake, Target } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import SectionHeading from "@/components/site/SectionHeading";
import FinalCTA from "@/components/site/FinalCTA";
import Reveal from "@/components/motion/Reveal";
import SceneArt from "@/components/art/SceneArt";
import { getDictionary } from "@/i18n";
import { isLocale, type Locale } from "@/i18n/config";
import { getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/settings-helpers";
import { buildMetadata } from "@/lib/seo";

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
    path: "/about",
    title: dict.about.title,
    description: dict.about.subtitle,
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);
  const settings = await getSettings();

  return (
    <>
      <PageHero title={dict.about.title} subtitle={dict.about.subtitle} scene="campus-gate" />

      <section className="container-page py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
              <SceneArt scene="hangzhou" detail="full" className="h-80 w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-trust-blue-dark/60 to-transparent" />
            </div>
          </Reveal>

          <div>
            <SectionHeading
              eyebrow={dict.nav.about}
              title={dict.about.storyTitle}
              align="start"
            />
            <Reveal delay={90}>
              <p className="mt-6 text-base leading-relaxed text-charcoal/80">
                {dict.about.storyText}
              </p>
              <div className="mt-8 rounded-2xl border-s-4 border-china-red bg-white p-6 shadow-[var(--shadow-soft)]">
                <h3 className="text-lg font-extrabold text-trust-blue">
                  {dict.about.whyExclusiveTitle}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/75">
                  {dict.about.whyExclusiveText}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-page grid gap-6 md:grid-cols-2">
          {[
            { Icon: Eye, title: dict.about.visionTitle, text: dict.about.visionText },
            { Icon: Target, title: dict.about.missionTitle, text: dict.about.missionText },
          ].map(({ Icon, title, text }, index) => (
            <Reveal key={title} delay={index * 100}>
              <article className="surface-card h-full p-8">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-china-red to-imperial-gold text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-2xl font-extrabold text-trust-blue">{title}</h3>
                <p className="mt-3 leading-relaxed text-charcoal/75">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page py-20">
        <SectionHeading
          eyebrow={dict.about.valuesTitle}
          title={dict.about.valuesTitle}
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dict.about.values.map((value, index) => (
            <Reveal key={value.title} delay={index * 80}>
              <article className="surface-card h-full p-6 transition-transform duration-500 hover:-translate-y-1">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-trust-blue/8 text-trust-blue">
                  <HeartHandshake className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-extrabold text-trust-blue">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{value.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <FinalCTA locale={locale} dict={dict} whatsapp={whatsappLink(settings, dict.meta.tagline)} />
    </>
  );
}
