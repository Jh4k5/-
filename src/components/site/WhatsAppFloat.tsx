"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { track } from "@/lib/analytics";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

const FOCUSABLE_FORM_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

export default function WhatsAppFloat({ href, label }: { href: string; label: string }) {
  const [hidden, setHidden] = useState(false);

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

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={() => track(ANALYTICS_EVENTS.whatsappClick)}
      className={`fixed z-50 inline-flex items-center gap-2 rounded-full bg-jade px-4 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_-12px_rgba(0,161,112,0.7)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#008a60] end-6 ${
        hidden ? "pointer-events-none translate-y-24 opacity-0" : "translate-y-0 opacity-100"
      }`}
      style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
      tabIndex={hidden ? -1 : undefined}
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}
