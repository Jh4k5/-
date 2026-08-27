import { Building2, CalendarRange, Smile, Users } from "lucide-react";
import Counter from "@/components/ui/Counter";
import Reveal from "@/components/motion/Reveal";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { settingNumber, settingText, type SettingsMapLike } from "@/lib/settings-helpers";

export default function StatsBar({
  locale,
  dict,
  settings,
}: {
  locale: Locale;
  dict: Dictionary;
  settings: SettingsMapLike;
}) {
  const items = [
    {
      Icon: Users,
      value: settingNumber(settings, "stat_students_helped", 480),
      suffix: "+",
      label: settingText(settings, "stat_students_helped_label", locale, dict.stats.studentsHelped),
    },
    {
      Icon: CalendarRange,
      value: settingNumber(settings, "stat_years_experience", 8),
      suffix: "",
      label: settingText(settings, "stat_years_experience_label", locale, dict.stats.yearsExperience),
    },
    {
      Icon: Building2,
      value: settingNumber(settings, "stat_universities", 35),
      suffix: "+",
      label: settingText(settings, "stat_universities_label", locale, dict.stats.universities),
    },
    {
      Icon: Smile,
      value: settingNumber(settings, "stat_satisfaction_rate", 97),
      suffix: "%",
      label: settingText(settings, "stat_satisfaction_rate_label", locale, dict.stats.satisfaction),
    },
  ];

  const measuredAt = settingText(settings, "stats_measured_at", locale, "");

  return (
    <section className="relative z-20 -mt-16">
      <div className="container-page">
        <Reveal className="surface-card grid gap-6 rounded-2xl bg-white p-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ Icon, value, suffix, label }) => (
            <div key={label} className="flex items-center gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-china-red text-white shadow-[0_8px_18px_-10px_rgba(15,39,64,0.55)]">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-trust-blue">
                  <Counter value={value} suffix={suffix} locale={locale} />
                </p>
                <p className="text-sm text-charcoal/65">{label}</p>
              </div>
            </div>
          ))}
        </Reveal>
        {measuredAt && (
          <p className="mt-3 text-center text-xs text-charcoal/45">{measuredAt}</p>
        )}
      </div>
    </section>
  );
}
