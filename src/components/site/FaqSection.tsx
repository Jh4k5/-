"use client";

import KanjiWatermark from "@/components/art/KanjiWatermark";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "./SectionHeading";
import type { Dictionary } from "@/i18n";
import { pick, type Locale } from "@/i18n/config";
import type { Faq } from "@/lib/types";

export default function FaqSection({
  items,
  locale,
  dict,
  title,
  subtitle,
  limit,
}: {
  items: Faq[];
  locale: Locale;
  dict: Dictionary;
  title?: string;
  subtitle?: string;
  /** Homepage shows only a taste; the rest live on /faq. */
  limit?: number;
}) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  if (items.length === 0) return null;

  const shown = typeof limit === "number" ? items.slice(0, limit) : items;
  const hasMore = shown.length < items.length;

  return (
    <section className="surface-deep relative overflow-hidden py-24">
      <KanjiWatermark char="bridge" className="top-6 end-6 hidden lg:block" />
      <div className="container-page">
        <SectionHeading title={title || dict.faq.title} subtitle={subtitle || dict.faq.subtitle} />

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {shown.map((item, index) => {
            const expanded = open === item.id;
            return (
              <Reveal key={item.id} delay={index * 40}>
                <div className="surface-card overflow-hidden p-0">
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : item.id)}
                    aria-expanded={expanded}
                    className="flex w-full items-center gap-3 p-5 text-start"
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-trust-blue/10 text-trust-blue">
                      <HelpCircle className="h-4.5 w-4.5" aria-hidden="true" />
                    </span>
                    <span className="flex-1 font-extrabold text-trust-blue">
                      {pick(item, "question", locale)}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-charcoal/40 transition-transform ${expanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expanded && (
                    <p className="border-t border-trust-blue/8 px-5 py-4 text-sm leading-relaxed text-charcoal/75 ps-[3.75rem]">
                      {pick(item, "answer", locale)}
                    </p>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        {hasMore && (
          <div className="mt-10 flex justify-center">
            <Link
              href={`/${locale}/faq`}
              className="inline-flex items-center gap-2 rounded-[10px] border border-trust-blue px-6 py-3 text-sm font-bold text-trust-blue transition-colors duration-300 hover:bg-trust-blue hover:text-white"
            >
              {dict.faq.viewAll}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
