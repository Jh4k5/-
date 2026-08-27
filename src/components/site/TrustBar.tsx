import { BadgeCheck, FileCheck2, ShieldCheck } from "lucide-react";
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
    <section className="border-y border-trust-blue/8 bg-white py-6">
      <div className="container-page">
        <div className="flex flex-col divide-y divide-trust-blue/8 sm:flex-row sm:divide-x sm:divide-y-0 sm:divide-trust-blue/8 rtl:sm:divide-x-reverse">
          {points.map(({ Icon, text }, index) => (
            <Reveal key={text} delay={index * 60} className="flex-1">
              <div className="flex items-center gap-3 py-3 sm:justify-center sm:px-6 sm:py-0">
                <Icon className="h-4.5 w-4.5 shrink-0 text-imperial-gold" />
                <span className="text-sm font-semibold text-trust-blue">{text}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
