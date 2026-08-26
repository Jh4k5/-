"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

/** Thin client wrapper so server-component pages can still track WhatsApp clicks. */
export default function TrackedWhatsAppLink({
  href,
  locale,
  className,
  children,
}: {
  href: string;
  locale?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track(ANALYTICS_EVENTS.whatsappClick, locale)}
      className={className}
    >
      {children}
    </a>
  );
}
