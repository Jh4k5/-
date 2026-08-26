"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { BadgeCheck, Expand } from "lucide-react";
import MediaFrame from "@/components/ui/MediaFrame";
import Reveal from "@/components/motion/Reveal";
import Tilt3D from "@/components/motion/Tilt3D";
import type { Dictionary } from "@/i18n";
import { pick, type Locale } from "@/i18n/config";
import { BLUR_LEVEL_PX, resolveBlurLevel } from "@/lib/blur";
import type { Admission } from "@/lib/types";
import { track } from "@/lib/analytics";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

const Lightbox = dynamic(() => import("@/components/motion/Lightbox"));

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

/** Full grid of admission letters, used on the dedicated admissions page. */
export default function AdmissionsGrid({
  items,
  locale,
  dict,
  disclaimer,
}: {
  items: Admission[];
  locale: Locale;
  dict: Dictionary;
  disclaimer?: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (items.length === 0) {
    return <p className="text-center text-charcoal/60">{dict.admissions.empty}</p>;
  }

  const active = items[index];

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((admission, i) => (
          <Reveal key={admission.id} delay={i * 60} direction="scale">
            <Tilt3D intensity={8} glare>
              <button
                type="button"
                onClick={() => {
                  setIndex(i);
                  setOpen(true);
                  track(ANALYTICS_EVENTS.admissionOpen, locale);
                }}
                className="gold-frame defer-offscreen group block w-full overflow-hidden bg-white text-start"
              >
                <span className="relative block aspect-3/4 overflow-hidden">
                  <span className="absolute inset-0 block transition-transform duration-[1300ms] group-hover:scale-105">
                    <MediaFrame src={admission.image_url} alt={dict.admissions.badge} />
                  </span>
                  <PrivacyMask admission={admission} />
                  <span className="absolute top-3 inline-flex items-center gap-1 rounded-full bg-china-red px-2.5 py-1 text-[10px] font-bold text-white start-3">
                    <BadgeCheck className="h-3 w-3" />
                    {dict.admissions.badge}
                  </span>
                  <span className="absolute bottom-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-trust-blue-dark/70 text-white transition-transform duration-500 group-hover:scale-110 end-3">
                    <Expand className="h-4 w-4" />
                  </span>
                </span>

                <span className="block px-4 py-3">
                  <span className="block truncate text-sm font-extrabold text-trust-blue" dir="auto">
                    {admission.university_name || dict.admissions.university}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-charcoal/60" dir="auto">
                    {[pick(admission, "major", locale), admission.year ? String(admission.year) : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
              </button>
            </Tilt3D>
          </Reveal>
        ))}
      </div>

      <div className="mt-8 space-y-1.5 text-center">
        <p className="text-xs text-charcoal/50">{dict.admissions.privacyNote}</p>
        {disclaimer && <p className="text-xs text-charcoal/40">{disclaimer}</p>}
      </div>

      <Lightbox
        open={open}
        index={index}
        onIndexChange={setIndex}
        onClose={() => setOpen(false)}
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
        slides={items.map((admission) => (
          <div key={`slide-${admission.id}`} className="relative max-h-[78vh]">
            <MediaFrame
              src={admission.image_url}
              alt={dict.admissions.badge}
              priority
              className="max-h-[78vh] w-auto rounded-2xl object-contain"
            />
            <PrivacyMask admission={admission} />
          </div>
        ))}
      />
    </>
  );
}
