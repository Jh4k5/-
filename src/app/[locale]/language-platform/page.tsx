import type { Metadata } from "next";
import { Languages } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import FinalCTA from "@/components/site/FinalCTA";
import Reveal from "@/components/motion/Reveal";
import { getDictionary } from "@/i18n";
import { isLocale, type Locale } from "@/i18n/config";
import { getSettings } from "@/lib/data";
import { settingText, whatsappLink } from "@/lib/settings-helpers";
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
    path: "/language-platform",
    title: dict.languagePlatform.title,
    description: dict.languagePlatform.subtitle,
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
  const settings = await getSettings();

  const perkTitle = settingText(settings, "process_bridge_perk_title", locale, "");
  const perkDuration = settingText(settings, "process_bridge_perk_duration", locale, "");
  const perkText = settingText(settings, "process_bridge_perk_text", locale, dict.process.bridgePerk);
  const terms = settingText(settings, "language_platform_terms", locale, "");

  return (
    <>
      <PageHero title={dict.languagePlatform.title} subtitle={dict.languagePlatform.subtitle} scene="campus-library" />

      <section className="container-page py-20">
        <Reveal>
          <div className="surface-card mx-auto max-w-2xl p-8 text-center sm:p-10">
            <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-jade/10 text-jade">
              <Languages className="h-6 w-6" />
            </span>
            {perkDuration && (
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-jade/10 px-3 py-1 text-xs font-bold text-jade">
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

      <FinalCTA locale={locale} dict={dict} whatsapp={whatsappLink(settings, dict.meta.tagline)} />
    </>
  );
}
