"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import MediaFrame from "@/components/ui/MediaFrame";
import HorizontalRail from "@/components/motion/HorizontalRail";
import Reveal from "@/components/motion/Reveal";
import type { Dictionary } from "@/i18n";
import { pick, type Locale } from "@/i18n/config";
import { BLUR_LEVEL_PX, resolveBlurLevel } from "@/lib/blur";
import type { Admission } from "@/lib/types";
import { track } from "@/lib/analytics";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

const Lightbox = dynamic(() => import("@/components/motion/Lightbox"));

/** The blur patch that hides the student's name, positioned in image %. */
function PrivacyMask({ admission }: { admission: Admission }) {
  const level = resolveBlurLevel(admission);
  if (level === "none") return null;
  const box = admission.blur_box ?? { x: 6, y: 22, w: 52, h: 12 };
  const blurPx = BLUR_LEVEL_PX[level];

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute rounded-md bg-white/25"
      style={{
        left: `${box.x}%`,
        top: `${box.y}%`,
        width: `${box.w}%`,
        height: `${box.h}%`,
        backdropFilter: `blur(${blurPx}px)`,
        WebkitBackdropFilter: `blur(${blurPx}px)`,
      }}
    />
  );
}

function AdmissionCard({
  admission,
  locale,
  dict,
  onOpen,
}: {
  admission: Admission;
  locale: Locale;
  dict: Dictionary;
  onOpen: () => void;
}) {
  const major = pick(admission, "major", locale);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="card-3d gold-frame defer-offscreen group block w-full overflow-hidden bg-white text-start focus-visible:ring-2 focus-visible:ring-imperial-gold focus-visible:outline-none"
    >
      <span className="relative block aspect-3/4 overflow-hidden">
        <span className="absolute inset-0 block transition-transform duration-700 group-hover:scale-105">
          <MediaFrame
            src={admission.image_url}
            alt={dict.admissions.badge}
            sizes="(min-width: 640px) 20rem, 70vw"
          />
        </span>
        <PrivacyMask admission={admission} />

        <span className="absolute top-3 inline-flex items-center gap-1 rounded-full bg-china-red px-2.5 py-1 text-[0.625rem] font-bold text-white shadow-lg start-3">
          <BadgeCheck className="h-3 w-3" aria-hidden="true" />
          {dict.admissions.badge}
        </span>
      </span>

      <span className="block bg-ivory px-4 py-3">
        <span className="block truncate text-sm font-extrabold text-trust-blue" dir="auto">
          {admission.university_name || dict.admissions.university}
        </span>
        <span className="mt-0.5 block truncate text-xs text-charcoal/60" dir="auto">
          {[major, admission.year ? String(admission.year) : null].filter(Boolean).join(" · ") ||
            dict.admissions.badge}
        </span>
      </span>
    </button>
  );
}

export default function AdmissionsStrip({
  items,
  locale,
  dict,
  title,
  subtitle,
  showAllLink = true,
  disclaimer,
}: {
  items: Admission[];
  locale: Locale;
  dict: Dictionary;
  title?: string;
  subtitle?: string;
  showAllLink?: boolean;
  disclaimer?: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // Fewer than 3 real examples reads as an empty section rather than proof —
  // hide it on the homepage teaser; the full gallery at /admissions always
  // shows whatever is published, regardless of count.
  if (items.length < 3) return null;

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
    <section className="surface-deep-dark relative overflow-hidden py-20 text-white">
      <div className="brand-pattern pointer-events-none absolute inset-0 opacity-40" />

      <div className="container-page relative">
        <Reveal>
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="seal-chip">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {dict.nav.admissions}
            </span>
            <h2 className="text-fluid-h2 font-extrabold text-white">
              {title || dict.admissions.title}
            </h2>
            <span className="brand-rule" aria-hidden="true" />
            <p className="max-w-2xl text-white/75">{subtitle || dict.admissions.subtitle}</p>
          </div>
        </Reveal>

        <HorizontalRail
          className="mt-12"
          ariaLabel={title || dict.admissions.title}
          prevLabel={dict.common.previous}
          nextLabel={dict.common.next}
          itemClassName="w-[70vw] max-w-xs sm:w-[20rem]"
          items={items.map((admission, i) => ({
            id: admission.id,
            node: (
              <AdmissionCard
                admission={admission}
                locale={locale}
                dict={dict}
                onOpen={() => {
                  setIndex(i);
                  setOpen(true);
                  track(ANALYTICS_EVENTS.admissionOpen, locale);
                }}
              />
            ),
          }))}
        />

        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="max-w-2xl space-y-1.5 text-center">
            <p className="text-xs text-white/55">{dict.admissions.privacyNote}</p>
            {disclaimer && <p className="text-xs text-white/70">{disclaimer}</p>}
          </div>
          {showAllLink && (
            <Link
              href={`/${locale}/admissions`}
              className="btn-seal-ghost"
            >
              {dict.admissions.viewAll}
            </Link>
          )}
        </div>
      </div>

      <Lightbox
        open={open}
        slides={slides}
        index={index}
        onIndexChange={setIndex}
        onClose={() => setOpen(false)}
        locale={locale}
        caption={
          active && (
            <span dir="auto" className="block space-y-1">
              <span className="block">
                {[
                  active.university_name,
                  pick(active, "city", locale) || null,
                  pick(active, "major", locale),
                  active.year ? String(active.year) : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
              {pick(active, "office_role", locale) && (
                <span className="block text-xs opacity-75">{pick(active, "office_role", locale)}</span>
              )}
            </span>
          )
        }
      />
    </section>
  );
}
