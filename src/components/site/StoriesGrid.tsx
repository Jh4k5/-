"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Quote } from "lucide-react";
import MediaFrame from "@/components/ui/MediaFrame";
import HorizontalRail from "@/components/motion/HorizontalRail";
import Reveal from "@/components/motion/Reveal";
import type { Dictionary } from "@/i18n";
import { pick, type Locale } from "@/i18n/config";
import type { SuccessStory } from "@/lib/types";
import { track } from "@/lib/analytics";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

const Lightbox = dynamic(() => import("@/components/motion/Lightbox"));

export default function StoriesGrid({
  stories,
  locale,
  dict,
  variant = "rail",
}: {
  stories: SuccessStory[];
  locale: Locale;
  dict: Dictionary;
  /**
   * "rail" keeps the homepage teaser to a single scrolling row; "grid" is for
   * the dedicated /stories page, where visitors came to scan every story and a
   * wrapping grid reads better than a row they have to push through.
   */
  variant?: "rail" | "grid";
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (stories.length === 0) {
    return <p className="text-center text-charcoal/60">{dict.stories.empty}</p>;
  }

  const active = stories[index];

  const card = (story: SuccessStory, i: number) => {
    const quote = pick(story, "quote", locale);
    return (
      <button
        type="button"
        onClick={() => {
          setIndex(i);
          setOpen(true);
          track(ANALYTICS_EVENTS.storyOpen, locale);
        }}
        className="defer-offscreen surface-card group relative flex h-full w-full flex-col overflow-hidden p-7 text-start"
      >
        <span className="absolute -end-6 -top-6 text-[7rem] leading-none text-china-red/8">
          <Quote className="h-24 w-24" />
        </span>

        <div className="flex items-center gap-4">
          <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-trust-blue text-white ring-2 ring-imperial-gold/40">
            {story.photo ? (
              <MediaFrame src={story.photo} alt={story.student_name} sizes="80px" />
            ) : (
              <span className="flex h-full w-full items-center justify-center font-[family-name:var(--font-display)] text-3xl font-extrabold">
                {story.student_name.trim().charAt(0)}
              </span>
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-extrabold text-trust-blue" dir="auto">
              {story.student_name}
            </p>
            <p className="text-[11px] font-bold uppercase tracking-widest text-china-red">
              {dict.stories.achievement}
            </p>
            {(story.university_name || story.country) && (
              <p className="mt-1 flex flex-wrap gap-1.5">
                {story.university_name && (
                  <span
                    dir="ltr"
                    className="rounded-full bg-trust-blue/8 px-2 py-0.5 text-[11px] font-semibold text-trust-blue"
                  >
                    {story.university_name}
                  </span>
                )}
                {story.country && (
                  <span className="rounded-full bg-imperial-gold/15 px-2 py-0.5 text-[11px] font-semibold text-[#8a6d12]">
                    {story.country}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        <p className="mt-4 rounded-2xl bg-ivory px-4 py-3 text-sm font-semibold text-trust-blue">
          {pick(story, "achievement", locale)}
        </p>

        {quote && (
          <p className="relative mt-4 text-[15px] leading-relaxed text-charcoal/75">“{quote}”</p>
        )}

        <span className="mt-auto block h-1 w-12 rounded-full bg-imperial-gold/70 pt-5 transition-all duration-500 group-hover:w-24" />
      </button>
    );
  };

  // Card heights vary with quote length, so rail items are flex containers that
  // stretch every card to the tallest in the row.
  return (
    <>
      {variant === "rail" ? (
        <HorizontalRail
          ariaLabel={dict.stories.title}
          prevLabel={dict.common.previous}
          nextLabel={dict.common.next}
          itemClassName="flex w-[82vw] max-w-sm sm:w-[24rem]"
          items={stories.map((story, i) => ({ id: story.id, node: card(story, i) }))}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story, i) => (
            <Reveal key={story.id} delay={i * 80}>
              {card(story, i)}
            </Reveal>
          ))}
        </div>
      )}

      <Lightbox
        open={open}
        index={index}
        onIndexChange={setIndex}
        onClose={() => setOpen(false)}
        caption={
          active && (
            <span dir="auto">
              <span className="block text-base font-extrabold text-white">
                {active.student_name}
              </span>
              {[active.university_name, active.country].filter(Boolean).join(" · ")}
            </span>
          )
        }
        slides={stories.map((story) => (
          <div key={`story-slide-${story.id}`} className="relative max-h-[78vh] w-full max-w-md">
            <div className="overflow-hidden rounded-2xl bg-white p-7">
              <span className="relative mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-trust-blue text-white ring-2 ring-imperial-gold/40">
                {story.photo ? (
                  <MediaFrame src={story.photo} alt={story.student_name} sizes="96px" />
                ) : (
                  <span className="font-[family-name:var(--font-display)] text-3xl font-extrabold">
                    {story.student_name.trim().charAt(0)}
                  </span>
                )}
              </span>
              <p className="mt-4 text-center text-sm font-semibold text-trust-blue">
                {pick(story, "achievement", locale)}
              </p>
              {pick(story, "quote", locale) && (
                <p className="mt-3 text-center text-[15px] leading-relaxed text-charcoal/75">
                  “{pick(story, "quote", locale)}”
                </p>
              )}
            </div>
          </div>
        ))}
      />
    </>
  );
}
