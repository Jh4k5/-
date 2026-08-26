"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

/** Fires scroll_50 / scroll_90 once per page view when the reader reaches that depth. */
export default function ScrollDepthTracker({ locale }: { locale?: string }) {
  const pathname = usePathname();
  const fired = useRef<{ half: boolean; ninety: boolean }>({ half: false, ninety: false });

  useEffect(() => {
    fired.current = { half: false, ninety: false };

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) return;
      const depth = (window.scrollY / scrollable) * 100;

      if (!fired.current.half && depth >= 50) {
        fired.current.half = true;
        track(ANALYTICS_EVENTS.scroll50, locale);
      }
      if (!fired.current.ninety && depth >= 90) {
        fired.current.ninety = true;
        track(ANALYTICS_EVENTS.scroll90, locale);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname, locale]);

  return null;
}
