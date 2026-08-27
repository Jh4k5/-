import KanjiWatermark from "@/components/art/KanjiWatermark";
import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "./SectionHeading";
import { iconFor } from "@/lib/icons";
import type { Dictionary } from "@/i18n";
import { pick, type Locale } from "@/i18n/config";
import type { ProcessStage } from "@/lib/types";
import TrackedWhatsAppLink from "./TrackedWhatsAppLink";
import { MessageCircle } from "lucide-react";

/** "كيف نعمل معك؟" — a single timeline (not a card grid), one stage per step. */
export default function ProcessSection({
  stages,
  locale,
  dict,
  title,
  subtitle,
  whatsapp,
}: {
  stages: ProcessStage[];
  locale: Locale;
  dict: Dictionary;
  title?: string;
  subtitle?: string;
  whatsapp?: string;
}) {
  if (stages.length === 0) return null;

  return (
    <section className="surface-deep relative overflow-hidden py-24">
      <KanjiWatermark char="path" className="top-6 end-6 hidden lg:block" />
      <div className="container-page">
        <SectionHeading
          title={title || dict.process.title}
          subtitle={subtitle || dict.process.subtitle}
        />

        <div className="relative mx-auto mt-16 max-w-2xl lg:max-w-none">
          {/* connecting line: vertical on mobile, horizontal on desktop */}
          <div className="absolute top-0 bottom-0 w-px bg-imperial-gold/50 start-[1.1rem] lg:top-[1.1rem] lg:bottom-auto lg:start-0 lg:h-px lg:w-full" />

          <ol className="space-y-10 lg:flex lg:gap-8 lg:space-y-0">
            {stages.map((stage, index) => {
              const Icon = iconFor(stage.icon);
              return (
                <Reveal
                  key={stage.id}
                  delay={index * 90}
                  as="li"
                  className="relative flex gap-5 ps-0 lg:flex-1 lg:flex-col lg:gap-0 lg:ps-0"
                >
                    <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white lg:mb-5">
                      <span className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-imperial-gold">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </span>
                    <div className="min-w-0 pb-1 lg:pe-4">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 shrink-0 text-trust-blue/50" aria-hidden="true" />
                        <h3 className="text-base font-extrabold text-trust-blue">
                          {pick(stage, "title", locale)}
                        </h3>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-charcoal/70">
                        {pick(stage, "description", locale)}
                      </p>
                    </div>
                </Reveal>
              );
            })}
          </ol>
        </div>

        <Reveal delay={80}>
          <div className="mt-10 flex justify-center">
            <Link
              href={`/${locale}/how-it-works`}
              className="text-sm font-bold text-trust-blue underline underline-offset-4 transition-colors hover:text-china-red"
            >
              {dict.process.viewAllSteps}
            </Link>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href={`/${locale}/contact#booking`}
              className="inline-flex items-center gap-2 rounded-full bg-china-red px-7 py-3.5 text-base font-bold text-white shadow-[0_8px_18px_-10px_var(--color-china-red)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              {dict.process.cta}
            </Link>
            {whatsapp && (
              <TrackedWhatsAppLink
                href={whatsapp}
                locale={locale}
                className="inline-flex items-center gap-2 rounded-full bg-jade px-7 py-3.5 text-base font-bold text-white transition-transform duration-300 hover:-translate-y-0.5"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                {dict.common.whatsapp}
              </TrackedWhatsAppLink>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
