"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { track } from "@/lib/analytics";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

const FOCUSABLE_FORM_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

export default function WhatsAppFloat({ href, label }: { href: string; label: string }) {
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname() || "";
  // The booking form already has a static, non-floating WhatsApp CTA in its
  // sidebar — a floating button here would risk covering the form itself.
  const onContactPage = /\/contact\/?$/.test(pathname);

  useEffect(() => {
    const isFormField = (target: EventTarget | null) =>
      target instanceof HTMLElement && FOCUSABLE_FORM_TAGS.has(target.tagName);

    const onFocusIn = (event: FocusEvent) => {
      if (isFormField(event.target)) setHidden(true);
    };
    const onFocusOut = (event: FocusEvent) => {
      if (isFormField(event.target)) setHidden(false);
    };

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  if (onContactPage) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={() => track(ANALYTICS_EVENTS.whatsappClick)}
      className={`group fixed z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-jade text-sm font-bold text-white shadow-[0_14px_30px_-12px_rgba(0,161,112,0.75)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#008a60] end-5 sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-3.5 sm:end-6 ${
        hidden ? "pointer-events-none translate-y-24 opacity-0" : "translate-y-0 opacity-100"
      }`}
      style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
      tabIndex={hidden ? -1 : undefined}
    >
      {/* A quiet halo behind the button — one scale-and-fade ring, disabled
          under reduced motion, that draws the eye without vibrating. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-jade/50 pulse-ring"
      />
      <span className="relative flex h-8 w-8 items-center justify-center sm:h-5 sm:w-5">
        <MessageCircle className="h-5.5 w-5.5 sm:h-5 sm:w-5" aria-hidden="true" />
      </span>
      <span className="hidden pe-1 sm:inline">{label}</span>
    </a>
  );
}
