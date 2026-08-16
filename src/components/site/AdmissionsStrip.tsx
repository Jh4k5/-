"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import MediaFrame from "@/components/ui/MediaFrame";
import Marquee from "@/components/motion/Marquee";
import ParticleField from "@/components/motion/ParticleField";
import Reveal from "@/components/motion/Reveal";
import Tilt3D from "@/components/motion/Tilt3D";
import type { Dictionary } from "@/i18n";
import { pick, type Locale } from "@/i18n/config";
import type { Admission } from "@/lib/types";

const Lightbox = dynamic(() => import("@/components/motion/Lightbox"));

/** The blur patch that hides the student's name, positioned in image %. */
function PrivacyMask({ admission }: { admission: Admission }) {
  if (!admission.blur_enabled) return null;
  const box = admission.blur_box ?? { x: 6, y: 22, w: 52, h: 12 };

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute rounded-md bg-white/25"
      style={{
        left: `${box.x}%`,
        top: `${box.y}%`,
        width: `${box.w}%`,
        height: `${box.h}%`,
        backdropFilter: "blur(9px)",
        WebkitBackdropFilter: "blur(9px)",
      }}
    />
  );
}

function AdmissionCard({
  admission,
  locale,
  dict,
  onOpen,
  compact = false,
}: {
  admission: Admission;
  locale: Locale;
  dict: Dictionary;
  onOpen: () => void;
  compact?: boolean;
}) {
  const major = pick(admission, "major", locale);

  return (
    <Tilt3D intensity={10} className={compact ? "w-[15rem] sm:w-[17rem]" : "w-full"}>
      <button
        type="button"
        onClick={onOpen}
        className="gold-frame group block w-full overflow-hidden bg-white text-start"
      >
        <span className="relative block aspect-3/4 overflow-hidden">
          <span className="absolute inset-0 block transition-transform duration-[1200ms] group-hover:scale-105">
            <MediaFrame src={admission.image_url} alt={dict.admissions.badge} />
          </span>
          <PrivacyMask admission={admission} />

          <span className="absolute top-3 inline-flex items-center gap-1 rounded-full bg-china-red px-2.5 py-1 text-[10px] font-bold text-white shadow-lg start-3">
            <BadgeCheck className="h-3 w-3" />
            {dict.admissions.badge}
          </span>
        </span>

        <span className="block bg-gradient-to-b from-white to-ivory px-4 py-3">
          <span className="block truncate text-sm font-extrabold text-trust-blue" dir="auto">
            {admission.university_name || dict.admissions.university}
          </span>
          <span className="mt-0.5 block truncate text-xs text-charcoal/60" dir="auto">
            {[major, admission.year ? String(admission.year) : null].filter(Boolean).join(" · ") ||
              dict.admissions.badge}
          </span>
        </span>
      </button>
    </Tilt3D>
  );
}

export default function AdmissionsStrip({
  items,
  locale,
  dict,
  title,
  subtitle,
  showAllLink = true,
}: {
  items: Admission[];
  locale: Locale;
  dict: Dictionary;
  title?: string;
  subtitle?: string;
  showAllLink?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const rows = useMemo(() => {
    if (items.length <= 3) return [items];
    const middle = Math.ceil(items.length / 2);
    return [items.slice(0, middle), items.slice(middle)];
  }, [items]);

  if (items.length === 0) return null;

  const slides = items.map((admission) => (
    <div key={admission.id} className="relative max-h-[78vh] w-auto">
      <div className="relative">
        <MediaFrame
          src={admission.image_url}
          alt={dict.admissions.badge}
          className="max-h-[78vh] w-auto rounded-2xl object-contain"
          priority
        />
        <PrivacyMask admission={admission} />
      </div>
    </div>
  ));

  const active = items[index];

  return (
    <section className="relative overflow-hidden bg-trust-blue-dark py-20 text-white">
      <div className="brand-pattern pointer-events-none absolute inset-0 opacity-40" />
      <ParticleField density={0.7} />

      <div className="container-page relative">
        <Reveal>
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-widest text-imperial-gold uppercase">
              <ShieldCheck className="h-3.5 w-3.5" />
              {dict.nav.admissions}
            </span>
            <h2 className="text-[clamp(1.9rem,4vw,3rem)] font-extrabold text-white">
              {title || dict.admissions.title}
            </h2>
            <span className="h-1 w-24 rounded-full bg-gradient-to-r from-china-red via-imperial-gold to-white/60" />
            <p className="max-w-2xl text-white/75">{subtitle || dict.admissions.subtitle}</p>
          </div>
        </Reveal>
      </div>

      <div className="relative mt-12 space-y-5">
        {rows.map((row, rowIndex) => (
          <Marquee
            key={rowIndex}
            speed={rowIndex % 2 === 0 ? 52 : 64}
            direction={rowIndex % 2 === 0 ? "forward" : "reverse"}
          >
            {row.map((admission) => (
              <AdmissionCard
                key={admission.id}
                admission={admission}
                locale={locale}
                dict={dict}
                compact
                onOpen={() => {
                  setIndex(items.findIndex((item) => item.id === admission.id));
                  setOpen(true);
                }}
              />
            ))}
          </Marquee>
        ))}
      </div>

      <div className="container-page relative mt-10 flex flex-wrap items-center justify-center gap-4">
        <p className="text-xs text-white/55">{dict.admissions.privacyNote}</p>
        {showAllLink && (
          <Link
            href={`/${locale}/admissions`}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-2.5 text-sm font-bold text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
          >
            {dict.admissions.viewAll}
          </Link>
        )}
      </div>

      <Lightbox
        open={open}
        slides={slides}
        index={index}
        onIndexChange={setIndex}
        onClose={() => setOpen(false)}
        caption={
          active && (
            <span dir="auto">
              {[
                active.university_name,
                pick(active, "major", locale),
                active.year ? String(active.year) : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </span>
          )
        }
      />
    </section>
  );
}
