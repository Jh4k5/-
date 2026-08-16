"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, ArrowRight, Building2 } from "lucide-react";

const Coverflow3D = dynamic(() => import("@/components/motion/Coverflow3D"));
import Reveal from "@/components/motion/Reveal";
import UniversityCard from "./UniversityCard";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import type { University } from "@/lib/types";

/** Home page carousel: three or four universities rotating in 3D. */
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
    <section className="relative overflow-hidden py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, color-mix(in srgb, var(--color-imperial-gold) 16%, transparent) 0, transparent 40%), radial-gradient(circle at 85% 75%, color-mix(in srgb, var(--color-trust-blue) 14%, transparent) 0, transparent 45%)",
        }}
      />

      <div className="container-page relative">
        <Reveal>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-china-red/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-china-red">
              <Building2 className="h-3.5 w-3.5" />
              {dict.nav.universities}
            </span>
            <h2 className="text-[clamp(1.9rem,4vw,3rem)] font-extrabold text-trust-blue">
              {title || dict.universities.title}
            </h2>
            <span className="h-1 w-24 rounded-full bg-gradient-to-r from-china-red via-imperial-gold to-trust-blue" />
            <p className="text-charcoal/70">{subtitle || dict.universities.subtitle}</p>
          </div>
        </Reveal>

        <div className="mt-12">
          <Coverflow3D
            rtl={rtl}
            items={universities.map((university) => ({
              id: university.id,
              node: <UniversityCard university={university} locale={locale} dict={dict} tall />,
            }))}
          />
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href={`/${locale}/universities`}
            className="group inline-flex items-center gap-2 rounded-full bg-trust-blue px-8 py-3.5 text-sm font-bold text-white shadow-[0_18px_40px_-20px_var(--color-trust-blue)] transition-all duration-300 hover:-translate-y-1 hover:bg-china-red"
          >
            {dict.universities.viewAll}
            <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
