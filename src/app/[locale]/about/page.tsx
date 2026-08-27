import type { Metadata } from "next";
import Image from "next/image";
import { Eye, Target } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import SectionHeading from "@/components/site/SectionHeading";
import FinalCTA from "@/components/site/FinalCTA";
import Reveal from "@/components/motion/Reveal";
import SceneArt from "@/components/art/SceneArt";
import { getDictionary } from "@/i18n";
import { isLocale, type Locale } from "@/i18n/config";
import { getSettings } from "@/lib/data";
import { settingText, settingValue, whatsappLink } from "@/lib/settings-helpers";
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

  const storyText = settingText(settings, "about_story_text", locale, dict.about.storyText);
  const visionText = settingText(settings, "about_vision_text", locale, dict.about.visionText);
  const missionText = settingText(settings, "about_mission_text", locale, dict.about.missionText);
  const whyExclusiveText = settingText(
    settings,
    "about_why_exclusive_text",
    locale,
    dict.about.whyExclusiveText,
  );

  const teamTitle = settingText(settings, "about_team_title", locale, dict.about.storyTitle);
  const companyIntro = settingText(settings, "company_intro", locale);
  const foundedYear = settingValue(settings, "company_founded_year");

  // A person is only shown once their name and photo are both filled in —
  // never a half-empty card. The CEO additionally needs the section enabled.
  const founder = {
    name: settingValue(settings, "founder_name"),
    photo: settingValue(settings, "founder_photo"),
    title: settingText(settings, "founder_title", locale),
    bio: settingText(settings, "founder_bio", locale),
  };
  const ceo = {
    name: settingValue(settings, "ceo_name"),
    photo: settingValue(settings, "ceo_photo"),
    title: settingText(settings, "ceo_title", locale),
    bio: settingText(settings, "ceo_bio", locale),
  };
  const ceoEnabled = settingValue(settings, "ceo_section_enabled") === "true";

  const people = [
    ...(founder.name && founder.photo ? [founder] : []),
    ...(ceoEnabled && ceo.name && ceo.photo ? [ceo] : []),
  ];

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
              {companyIntro && (
                <p className="mt-6 text-base leading-relaxed font-semibold text-trust-blue">
                  {companyIntro}
                  {foundedYear && (
                    <span className="ms-2 text-sm font-bold text-imperial-gold">— {foundedYear}</span>
                  )}
                </p>
              )}
              <p className="mt-4 text-base leading-relaxed text-charcoal/80">{storyText}</p>
              <div className="mt-8 rounded-2xl border-s-4 border-china-red bg-white p-6 shadow-[var(--shadow-soft)]">
                <h3 className="text-lg font-extrabold text-trust-blue">
                  {dict.about.whyExclusiveTitle}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/75">{whyExclusiveText}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-page grid gap-6 md:grid-cols-2">
          {[
            { Icon: Eye, title: dict.about.visionTitle, text: visionText },
            { Icon: Target, title: dict.about.missionTitle, text: missionText },
          ].map(({ Icon, title, text }, index) => (
            <Reveal key={title} delay={index * 100}>
              <article className="surface-card h-full p-8">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-china-red text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-2xl font-extrabold text-trust-blue">{title}</h3>
                <p className="mt-3 leading-relaxed text-charcoal/75">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {people.length > 0 && (
        <section className="container-page py-20">
          <SectionHeading title={teamTitle} />
          <div className="mx-auto mt-12 max-w-3xl space-y-8">
            {people.map((person, index) => (
              <Reveal key={person.name} delay={index * 90}>
                <article className="border-b border-trust-blue/10 pb-8 last:border-0">
                  {/* Small photo sits directly beside the name, per the brief. */}
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-1 ring-trust-blue/10">
                      <Image
                        src={person.photo}
                        alt={person.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-extrabold text-trust-blue">{person.name}</p>
                      {person.title && (
                        <p className="text-xs font-bold text-china-red">{person.title}</p>
                      )}
                    </div>
                  </div>
                  {person.bio && (
                    <p className="mt-4 text-sm leading-relaxed text-charcoal/75">{person.bio}</p>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <FinalCTA locale={locale} dict={dict} whatsapp={whatsappLink(settings, dict.meta.tagline)} />
    </>
  );
}
