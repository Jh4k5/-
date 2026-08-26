"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";
import type { AnalyticsEventName } from "@/lib/analytics-events";

/** Fires an analytics event once, the first time its children scroll into view. */
export default function ViewTracker({
  event,
  locale,
  children,
}: {
  event: AnalyticsEventName;
  locale?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || fired.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (fired.current) return;
        if (entries.some((entry) => entry.isIntersecting)) {
          fired.current = true;
          track(event, locale);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [event, locale]);

  return <div ref={ref}>{children}</div>;
}
