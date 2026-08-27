"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Depth carousel: the active card faces the visitor while its neighbours rotate
 * away in 3D. Works with mouse drag, touch swipe, arrow keys and the buttons,
 * and mirrors itself for RTL.
 *
 * Motion is deliberately strong here — this is the showcase the whole homepage
 * builds toward — but it still yields completely to `prefers-reduced-motion`,
 * and autoplay pauses on hover, on drag, and whenever the tab is hidden so it
 * never animates against a visitor who is reading or away.
 */
export default function Coverflow3D({
  items,
  rtl = false,
  autoPlayMs = 6500,
  className = "",
  cardClassName = "",
  ariaLabel,
  prevLabel = "السابق",
  nextLabel = "التالي",
}: {
  items: { id: string; node: ReactNode }[];
  rtl?: boolean;
  autoPlayMs?: number;
  className?: string;
  cardClassName?: string;
  ariaLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
}) {
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const startX = useRef<number | null>(null);
  const hovering = useRef(false);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  const go = useCallback(
    (delta: number) => {
      setActive((current) => (current + delta + count) % count);
    },
    [count],
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // A carousel spinning in a hidden tab is wasted work and a battery cost.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (count < 2 || autoPlayMs <= 0 || reducedMotion || paused) return;
    const timer = setInterval(() => {
      if (!hovering.current && !dragging) go(1);
    }, autoPlayMs);
    return () => clearInterval(timer);
  }, [autoPlayMs, count, dragging, go, reducedMotion, paused]);

  if (count === 0) return null;

  const onPointerDown = (event: React.PointerEvent) => {
    startX.current = event.clientX;
    setDragging(true);
  };

  const onPointerUp = (event: React.PointerEvent) => {
    if (startX.current === null) return;
    const delta = event.clientX - startX.current;
    startX.current = null;
    setDragging(false);
    if (Math.abs(delta) > 45) {
      const forward = rtl ? delta > 0 : delta < 0;
      go(forward ? 1 : -1);
    }
  };

  const arrowClass =
    "inline-flex h-12 w-12 items-center justify-center rounded-[6px] border border-china-red/25 bg-white text-china-red shadow-[0_10px_26px_-14px_rgba(200,16,46,0.65)] transition-[transform,background-color,color] duration-300 hover:-translate-y-0.5 hover:bg-china-red hover:text-white focus-visible:ring-2 focus-visible:ring-china-red focus-visible:ring-offset-2 focus-visible:outline-none";

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
    >
      <div
        className="stage-3d relative h-[24rem] touch-pan-y select-none sm:h-[26rem]"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          startX.current = null;
          setDragging(false);
        }}
        role="group"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") go(rtl ? -1 : 1);
          if (event.key === "ArrowLeft") go(rtl ? 1 : -1);
        }}
      >
        {items.map((item, index) => {
          let offset = index - active;
          if (offset > count / 2) offset -= count;
          if (offset < -count / 2) offset += count;

          const direction = rtl ? -1 : 1;
          const distance = Math.abs(offset);
          const visible = distance <= 2;

          return (
            <div
              key={item.id}
              aria-hidden={offset !== 0}
              className={`absolute inset-x-0 mx-auto w-[min(88vw,32rem)] ${cardClassName}`}
              style={{
                transform: `translate3d(${offset * direction * 44}%, 0, ${-distance * 210}px) rotateY(${-offset * direction * 30}deg) scale(${1 - distance * 0.06})`,
                opacity: visible ? 1 - distance * 0.3 : 0,
                zIndex: 20 - distance,
                transition:
                  dragging || reducedMotion
                    ? "none"
                    : "transform 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease",
                pointerEvents: offset === 0 ? "auto" : "none",
                filter: distance > 0 ? `blur(${distance * 1.5}px)` : undefined,
              }}
            >
              {item.node}
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <div className="mt-7 flex items-center justify-center gap-4">
          <button type="button" onClick={() => go(rtl ? 1 : -1)} aria-label={prevLabel} className={arrowClass}>
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="flex items-center gap-2">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`${index + 1} / ${count}`}
                aria-current={index === active}
                className={`h-2 rounded-[2px] transition-all duration-500 focus-visible:ring-2 focus-visible:ring-china-red focus-visible:ring-offset-2 focus-visible:outline-none ${
                  index === active ? "w-9 bg-china-red" : "w-3 bg-trust-blue/25 hover:bg-china-red/60"
                }`}
              />
            ))}
          </div>

          <button type="button" onClick={() => go(rtl ? -1 : 1)} aria-label={nextLabel} className={arrowClass}>
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
