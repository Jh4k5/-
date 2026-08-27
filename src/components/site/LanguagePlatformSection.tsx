import Link from "next/link";
import { MessageCircle } from "lucide-react";
import MediaFrame from "@/components/ui/MediaFrame";
import KanjiWatermark from "@/components/art/KanjiWatermark";
import Reveal from "@/components/motion/Reveal";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { settingText, settingValue, type SettingsMapLike } from "@/lib/settings-helpers";

export default function LanguagePlatformSection({
  locale,
  dict,
  settings,
  title,
}: {
  locale: Locale;
  dict: Dictionary;
  settings: SettingsMapLike;
  title?: string;
}) {
  const image = settingValue(settings, "language_platform_image");
  const imageAlt = settingText(settings, "language_platform_image_alt", locale, dict.languagePlatform.title);
  const offerStatus = settingValue(settings, "language_platform_offer_status", "active");
  const headline = settingText(settings, "language_platform_headline", locale, dict.languagePlatform.title);
  const perkDuration = settingText(settings, "process_bridge_perk_duration", locale, "");
  const benefits = [
    settingText(settings, "language_platform_benefit_1_text", locale, ""),
    settingText(settings, "language_platform_benefit_2_text", locale, ""),
    settingText(settings, "language_platform_benefit_3_text", locale, ""),
  ].filter(Boolean);

  return (
    <section className="relative overflow-hidden bg-ivory-dark/40 py-24">
      <KanjiWatermark char="language" className="top-6 end-6 hidden lg:block" />
      <div className="container-page relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <Reveal direction="scale" className="order-1">
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl shadow-[var(--shadow-soft)] lg:aspect-3/4">
              <MediaFrame src={image} alt={imageAlt} sceneDetail="full" fallbackScene="campus-library" />
            </div>
          </Reveal>

          <Reveal direction="start" delay={90} className="order-2">
            <div>
              {offerStatus === "active" && perkDuration && (
                <span className="inline-flex items-center gap-1.5 rounded-[10px] bg-jade/10 px-3 py-1 text-xs font-bold text-jade">
                  {perkDuration}
                </span>
              )}
              <h2 className="mt-4 text-[clamp(1.5rem,2.8vw,2.2rem)] font-extrabold text-trust-blue">
                {title || headline}
              </h2>

              {benefits.length > 0 && (
                <ul className="mt-5 space-y-2.5">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5 text-sm leading-relaxed text-charcoal/75">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-imperial-gold" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={`/${locale}/language-platform`}
                  className="inline-flex items-center gap-2 rounded-[10px] bg-trust-blue px-6 py-3 text-sm font-bold text-white transition-colors duration-300 hover:bg-trust-blue-dark"
                >
                  {dict.languagePlatform.cta}
                </Link>
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center gap-2 rounded-[10px] border border-china-red px-6 py-3 text-sm font-bold text-china-red transition-colors duration-300 hover:bg-china-red hover:text-white"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  {dict.hero.ctaPrimary}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
