import Link from "next/link";
import { Languages } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { settingText, type SettingsMapLike } from "@/lib/settings-helpers";

export default function LanguagePlatformSection({
  locale,
  dict,
  settings,
  title,
  subtitle,
}: {
  locale: Locale;
  dict: Dictionary;
  settings: SettingsMapLike;
  title?: string;
  subtitle?: string;
}) {
  const perkDuration = settingText(settings, "process_bridge_perk_duration", locale, "");
  const perkText = settingText(settings, "process_bridge_perk_text", locale, dict.process.bridgePerk);

  return (
    <section className="bg-trust-blue/5 py-20">
      <div className="container-page">
        <Reveal>
          <div className="surface-card mx-auto flex max-w-3xl flex-col items-center gap-4 p-8 text-center sm:p-10">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-jade/10 text-jade">
              <Languages className="h-6 w-6" />
            </span>
            {perkDuration && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-jade/10 px-3 py-1 text-xs font-bold text-jade">
                {perkDuration}
              </span>
            )}
            <h2 className="text-2xl font-extrabold text-trust-blue">
              {title || dict.languagePlatform.title}
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-charcoal/70 sm:text-base">
              {subtitle || perkText}
            </p>
            <Link
              href={`/${locale}/language-platform`}
              className="mt-2 inline-flex items-center gap-2 rounded-full border-2 border-trust-blue px-6 py-3 text-sm font-bold text-trust-blue transition-all duration-300 hover:-translate-y-0.5 hover:bg-trust-blue hover:text-white"
            >
              {dict.languagePlatform.cta}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
