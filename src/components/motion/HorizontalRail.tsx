"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * One row of cards that scrolls sideways instead of stacking downwards, so a
 * section of any length keeps the same vertical footprint.
 *
 * Native scrolling does the work — touch and trackpad gestures, keyboard focus
 * and screen readers all behave as they normally would, and the arrows are just
 * a desktop convenience on top. Scrolling is contained here: `overflow-x` lives
 * on the track, never on the page.
 *
 * RTL note: browsers report `scrollLeft` as negative when the direction is RTL,
 * so every position check goes through `Math.abs()` and every programmatic
 * scroll is mirrored by `dir`.
 */
export default function HorizontalRail({
  items,
  ariaLabel,
  prevLabel,
  nextLabel,
  itemClassName = "w-[80vw] max-w-sm sm:w-[22rem]",
  className = "",
}: {
  items: { id: string; node: ReactNode }[];
  ariaLabel: string;
  /** Translated arrow labels — the rail itself holds no copy. */
  prevLabel: string;
  nextLabel: string;
  /** Width of a single card. Cards keep a fixed width so the row never wraps. */
  itemClassName?: string;
  className?: string;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [overflows, setOverflows] = useState(false);

  const syncEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const offset = Math.abs(track.scrollLeft);
    const max = track.scrollWidth - track.clientWidth;
    setOverflows(max > 4);
    setAtStart(offset <= 4);
    setAtEnd(offset >= max - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    syncEdges();
    // The row's own resize matters as much as the window's: a card that reflows
    // changes scrollWidth without any scroll or window event firing.
    const observer = new ResizeObserver(syncEdges);
    observer.observe(track);
    return () => observer.disconnect();
  }, [syncEdges, items.length]);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const rtl = getComputedStyle(track).direction === "rtl";
    const step = track.clientWidth * 0.8;
    track.scrollBy({ left: step * direction * (rtl ? -1 : 1), behavior: "smooth" });
  };

  if (items.length === 0) return null;

  const arrowBase =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-current/15 bg-white text-trust-blue shadow-sm transition-opacity duration-300 hover:bg-trust-blue hover:text-white disabled:pointer-events-none disabled:opacity-30";

  return (
    <div className={`relative ${className}`}>
      <ul
        ref={trackRef}
        onScroll={syncEdges}
        aria-label={ariaLabel}
        className="rail-track flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-4"
      >
        {items.map((item) => (
          <li key={item.id} className={`shrink-0 snap-start ${itemClassName}`}>
            {item.node}
          </li>
        ))}
      </ul>

      {/* Arrows only earn their space when the row actually has somewhere to go —
          on a wide screen showing every card they would be permanently dead. */}
      {overflows && (
        <div className="mt-2 hidden items-center justify-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={atStart}
            aria-label={prevLabel}
            className={arrowBase}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={atEnd}
            aria-label={nextLabel}
            className={arrowBase}
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
