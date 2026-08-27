import Link from "next/link";
import { MessageCircle } from "lucide-react";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import SectionHeading from "./SectionHeading";
import { iconFor } from "@/lib/icons";
import type { Dictionary } from "@/i18n";
import { pick, type Locale } from "@/i18n/config";
import { settingText, type SettingsMapLike } from "@/lib/settings-helpers";
import type { ProcessStage, ProcessTrustBadge } from "@/lib/types";
import TrackedWhatsAppLink from "./TrackedWhatsAppLink";

export default function ProcessSection({
  stages,
  trustBadges,
  locale,
  dict,
  settings,
  title,
  subtitle,
  whatsapp,
}: {
  stages: ProcessStage[];
  trustBadges: ProcessTrustBadge[];
  locale: Locale;
  dict: Dictionary;
  settings: SettingsMapLike;
  title?: string;
  subtitle?: string;
  whatsapp?: string;
}) {
  if (stages.length === 0) return null;

  const bridgePerkTitle = settingText(settings, "process_bridge_perk_title", locale, "");
  const bridgePerkDuration = settingText(settings, "process_bridge_perk_duration", locale, "");
  const bridgePerkText = settingText(settings, "process_bridge_perk_text", locale, dict.process.bridgePerk);

  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="brand-pattern pointer-events-none absolute inset-0 opacity-20" />
      <div className="container-page relative">
        <SectionHeading
          title={title || dict.process.title}
          subtitle={subtitle || dict.process.subtitle}
        />

        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustBadges.map((badge) => {
            const Icon = iconFor(badge.icon);
            return (
              <RevealItem key={badge.id}>
                <div className="h-full rounded-2xl border border-trust-blue/10 bg-ivory p-5">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-trust-blue/10 text-trust-blue">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 font-extrabold text-trust-blue">{pick(badge, "title", locale)}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-charcoal/70">
                    {pick(badge, "description", locale)}
                  </p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage, index) => {
            const Icon = iconFor(stage.icon);
            return (
              <RevealItem key={stage.id}>
                <div className="surface-card h-full p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-trust-blue to-china-red text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-xs font-bold uppercase tracking-widest text-china-red">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 text-lg font-extrabold text-trust-blue">
                    {pick(stage, "title", locale)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                    {pick(stage, "description", locale)}
                  </p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <Reveal delay={80}>
          <div className="mt-8 flex justify-center">
            <Link
              href={`/${locale}/how-it-works`}
              className="group inline-flex items-center gap-2 rounded-full border-2 border-trust-blue px-7 py-3 text-sm font-bold text-trust-blue transition-all duration-300 hover:-translate-y-0.5 hover:bg-trust-blue hover:text-white"
            >
              {dict.process.viewAllSteps}
            </Link>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl bg-trust-blue/5 p-8 text-center">
            {bridgePerkDuration && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-jade/10 px-3 py-1 text-xs font-bold text-jade">
                {bridgePerkDuration}
              </span>
            )}
            {bridgePerkTitle && (
              <p className="text-xs font-bold uppercase tracking-widest text-trust-blue/60">
                {bridgePerkTitle}
              </p>
            )}
            <p className="max-w-2xl text-sm leading-relaxed text-charcoal/75 sm:text-base">
              {bridgePerkText}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href={`/${locale}/contact#booking`}
                className="inline-flex items-center gap-2 rounded-full bg-china-red px-7 py-3.5 text-base font-bold text-white shadow-[0_10px_24px_-12px_var(--color-china-red)] transition-transform duration-300 hover:-translate-y-1"
              >
                {dict.process.cta}
              </Link>
              {whatsapp && (
                <TrackedWhatsAppLink
                  href={whatsapp}
                  locale={locale}
                  className="inline-flex items-center gap-2 rounded-full bg-jade px-7 py-3.5 text-base font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#008a60]"
                >
                  <MessageCircle className="h-5 w-5" />
                  {dict.common.whatsapp}
                </TrackedWhatsAppLink>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
