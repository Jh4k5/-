"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, ArrowRight, Building2 } from "lucide-react";

import KanjiWatermark from "@/components/art/KanjiWatermark";
import CloudDivider from "@/components/art/CloudDivider";
import Reveal from "@/components/motion/Reveal";
import UniversityCard from "./UniversityCard";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import type { University } from "@/lib/types";

const Coverflow3D = dynamic(() => import("@/components/motion/Coverflow3D"));

/** Home page showcase: universities rotating through a 3D depth carousel. */
export default function UniversitiesShowcase({
  universities,
  locale,
  dict,
  title,
  subtitle,
}: {
  universities: University[];
  locale: Locale;
  dict: Dictionary;
  title?: string;
  subtitle?: string;
}) {
  if (universities.length === 0) return null;
  const rtl = locale === "ar";
  const Arrow = rtl ? ArrowLeft : ArrowRight;

  return (
    <section className="surface-deep relative overflow-hidden section-pad">
      <KanjiWatermark char="study" className="top-6 end-6 hidden lg:block" />
      <div className="container-page relative">
        <Reveal>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
            <span className="seal-chip">
              <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
              {dict.nav.universities}
            </span>
            <h2 className="text-fluid-h2 font-extrabold text-trust-blue">
              {title || dict.universities.title}
            </h2>
            <span className="brand-rule" aria-hidden="true" />
            <p className="text-charcoal/70">{subtitle || dict.universities.subtitle}</p>
          </div>
        </Reveal>

        <div className="mt-8 sm:mt-12">
          {/* Phones get a native snap rail — the 3D coverflow needs width a
              390px viewport cannot spare, and a gesture-scrolling rail feels
              faster and more certain than animated depth on touch. */}
          <div className="rail-track -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:hidden">
            {universities.map((university) => (
              <div
                key={university.id}
                className="w-[82vw] max-w-[21rem] shrink-0 snap-center"
              >
                <UniversityCard university={university} locale={locale} dict={dict} tall />
              </div>
            ))}
          </div>

          <div className="hidden md:block">
            <Coverflow3D
              rtl={rtl}
              ariaLabel={title || dict.universities.title}
              prevLabel={dict.common.previous}
              nextLabel={dict.common.next}
              items={universities.map((university) => ({
                id: university.id,
                node: <UniversityCard university={university} locale={locale} dict={dict} tall />,
              }))}
            />
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Link href={`/${locale}/universities`} className="btn-seal group">
            {dict.universities.viewAll}
            <Arrow
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>

      <CloudDivider tone="red" className="absolute inset-x-0 bottom-0" />
    </section>
  );
}
