import { BadgeCheck, FileCheck2, ShieldCheck } from "lucide-react";
import CloudDivider from "@/components/art/CloudDivider";
import KanjiWatermark from "@/components/art/KanjiWatermark";
import Reveal from "@/components/motion/Reveal";
import type { Locale } from "@/i18n/config";
import { settingText, type SettingsMapLike } from "@/lib/settings-helpers";

export default function TrustBar({
  locale,
  settings,
}: {
  locale: Locale;
  settings: SettingsMapLike;
}) {
  const points = [
    { Icon: BadgeCheck, text: settingText(settings, "trust_bar_point_1_text", locale, "") },
    { Icon: FileCheck2, text: settingText(settings, "trust_bar_point_2_text", locale, "") },
    { Icon: ShieldCheck, text: settingText(settings, "trust_bar_point_3_text", locale, "") },
  ].filter((point) => point.text);

  if (points.length === 0) return null;

  return (
    // Full-bleed China red: the strip that vouches for the office is where the
    // identity colour carries the most weight, and it breaks up the run of
    // white sections without tinting the content areas.
    <section className="china-red-panel relative overflow-hidden py-7">
      <KanjiWatermark
        char="trust"
        tone="light"
        size="sm"
        className="top-1/2 end-6 hidden -translate-y-1/2 sm:block"
      />
      <div className="container-page relative">
        <div className="flex flex-col divide-y divide-white/15 sm:flex-row sm:divide-x sm:divide-y-0 sm:divide-white/15 rtl:sm:divide-x-reverse">
          {points.map(({ Icon, text }, index) => (
            <Reveal key={text} delay={index * 60} className="flex-1">
              <div className="flex items-center gap-3 py-3 sm:justify-center sm:px-6 sm:py-0">
                <Icon className="h-4.5 w-4.5 shrink-0 text-imperial-gold-soft" aria-hidden="true" />
                <span className="text-sm font-semibold text-white">{text}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <CloudDivider tone="light" className="absolute inset-x-0 bottom-0" />
    </section>
  );
}
