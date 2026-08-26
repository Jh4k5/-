"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Depth carousel: the active card faces the visitor while its neighbours rotate
 * away in 3D. Works with mouse drag, touch swipe, arrow keys and the buttons,
 * and mirrors itself for RTL.
 */
export default function Coverflow3D({
  items,
  rtl = false,
  autoPlayMs = 6500,
  className = "",
  cardClassName = "",
}: {
  items: { id: string; node: ReactNode }[];
  rtl?: boolean;
  autoPlayMs?: number;
  className?: string;
  cardClassName?: string;
}) {
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const startX = useRef<number | null>(null);
  const hovering = useRef(false);
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

  useEffect(() => {
    if (count < 2 || autoPlayMs <= 0 || reducedMotion) return;
    const timer = setInterval(() => {
      if (!hovering.current && !dragging) go(1);
    }, autoPlayMs);
    return () => clearInterval(timer);
  }, [autoPlayMs, count, dragging, go, reducedMotion]);

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

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
    >
      <div
        className="stage-3d relative h-[26rem] touch-pan-y select-none sm:h-[30rem]"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          startX.current = null;
          setDragging(false);
        }}
        role="group"
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
                transform: `translate3d(${offset * direction * 42}%, 0, ${-distance * 190}px) rotateY(${-offset * direction * 26}deg) scale(${1 - distance * 0.06})`,
                opacity: visible ? 1 - distance * 0.32 : 0,
                zIndex: 20 - distance,
                transition:
                  dragging || reducedMotion
                    ? "none"
                    : "transform 0.75s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease",
                pointerEvents: offset === 0 ? "auto" : "none",
                filter: distance > 0 ? `blur(${distance * 1.4}px)` : undefined,
              }}
            >
              {item.node}
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(rtl ? 1 : -1)}
            aria-label="previous"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-trust-blue/15 bg-white text-trust-blue shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:bg-trust-blue hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-1.5">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === active
                    ? "w-8 bg-china-red"
                    : "w-3 bg-trust-blue/25 hover:bg-trust-blue/50"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(rtl ? -1 : 1)}
            aria-label="next"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-trust-blue/15 bg-white text-trust-blue shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:bg-trust-blue hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
