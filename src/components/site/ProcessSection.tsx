"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import SectionHeading from "./SectionHeading";
import { iconFor } from "@/lib/icons";
import type { Dictionary } from "@/i18n";
import { pick, type Locale } from "@/i18n/config";
import { settingText, type SettingsMapLike } from "@/lib/settings-helpers";
import type { ProcessStep, ProcessTrustBadge } from "@/lib/types";
import { track } from "@/lib/analytics";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

export default function ProcessSection({
  steps,
  trustBadges,
  locale,
  dict,
  settings,
  title,
  subtitle,
  whatsapp,
}: {
  steps: ProcessStep[];
  trustBadges: ProcessTrustBadge[];
  locale: Locale;
  dict: Dictionary;
  settings: SettingsMapLike;
  title?: string;
  subtitle?: string;
  whatsapp?: string;
}) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  if (steps.length === 0) return null;

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

        <div className="relative mt-16">
          <div className="absolute top-0 bottom-0 hidden w-px bg-gradient-to-b from-china-red via-imperial-gold to-trust-blue/30 sm:block start-6" />
          <ol className="space-y-6">
            {steps.map((step, index) => {
              const Icon = iconFor(step.icon);
              return (
                <Reveal key={step.id} delay={index * 60}>
                  <li className="relative flex gap-5 sm:ps-16">
                    <span className="absolute top-0 hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-trust-blue to-china-red text-white shadow-[0_14px_30px_-16px_rgba(27,58,107,0.9)] sm:flex start-0">
                      <Icon className="h-5 w-5" />
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedStep((current) => (current === step.id ? null : step.id));
                        track(ANALYTICS_EVENTS.processExpand, locale);
                      }}
                      className={`surface-card flex w-full items-start gap-4 p-5 text-start transition-all duration-300 ${
                        expandedStep === step.id ? "ring-2 ring-china-red/50" : ""
                      }`}
                    >
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-trust-blue/10 text-sm font-extrabold text-trust-blue sm:hidden">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-widest text-china-red">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <h3 className="mt-1 text-lg font-extrabold text-trust-blue">
                          {pick(step, "title", locale)}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                          {pick(step, "description", locale)}
                        </p>
                      </div>
                    </button>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </div>

        <Reveal delay={100}>
          <div className="mt-14 flex flex-col items-center gap-4 rounded-2xl bg-trust-blue/5 p-8 text-center">
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
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 rounded-full bg-china-red px-7 py-3.5 text-base font-bold text-white shadow-[0_10px_24px_-12px_var(--color-china-red)] transition-transform duration-300 hover:-translate-y-1"
              >
                {dict.process.cta}
              </Link>
              {whatsapp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track(ANALYTICS_EVENTS.whatsappClick, locale)}
                  className="inline-flex items-center gap-2 rounded-full bg-jade px-7 py-3.5 text-base font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#008a60]"
                >
                  <MessageCircle className="h-5 w-5" />
                  {dict.common.whatsapp}
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
