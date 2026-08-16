"use client";

import { Children, type ReactNode } from "react";

/**
 * Infinite horizontal strip. The children are rendered twice so the CSS
 * animation can loop seamlessly; it pauses on hover/focus so a visitor can
 * inspect a card, and it is direction-aware (RTL scrolls the other way).
 */
export default function Marquee({
  children,
  speed = 46,
  direction = "forward",
  className = "",
  fade = true,
}: {
  children: ReactNode;
  speed?: number;
  direction?: "forward" | "reverse";
  className?: string;
  fade?: boolean;
}) {
  const items = Children.toArray(children);
  if (items.length === 0) return null;

  return (
    <div
      className={`marquee-viewport relative overflow-hidden ${className}`}
      style={
        fade
          ? {
              maskImage:
                "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
            }
          : undefined
      }
    >
      <div
        className="marquee-track gap-5"
        data-direction={direction}
        style={{ ["--marquee-duration" as string]: `${speed}s` }}
      >
        {items.map((child, index) => (
          <div key={`a-${index}`} className="shrink-0">
            {child}
          </div>
        ))}
        {items.map((child, index) => (
          <div key={`b-${index}`} className="shrink-0" aria-hidden="true">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
