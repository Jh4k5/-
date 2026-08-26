"use client";

import { useState } from "react";
import { ClipboardCheck, MessageSquareText } from "lucide-react";
import ContactForm from "./ContactForm";
import EligibilityCheckForm from "./EligibilityCheckForm";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import type { SettingsMapLike } from "@/lib/settings-helpers";

export default function ContactFormSwitcher({
  locale,
  dict,
  settings,
  whatsapp,
}: {
  locale: Locale;
  dict: Dictionary;
  settings: SettingsMapLike;
  whatsapp?: string;
}) {
  const [mode, setMode] = useState<"contact" | "eligibility">("eligibility");

  return (
    <div>
      <div className="mb-5 inline-flex rounded-full border border-trust-blue/12 bg-white p-1">
        <button
          type="button"
          onClick={() => setMode("eligibility")}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
            mode === "eligibility" ? "bg-china-red text-white" : "text-charcoal/60 hover:text-trust-blue"
          }`}
        >
          <ClipboardCheck className="h-4 w-4" />
          {dict.eligibility.title}
        </button>
        <button
          type="button"
          onClick={() => setMode("contact")}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
            mode === "contact" ? "bg-china-red text-white" : "text-charcoal/60 hover:text-trust-blue"
          }`}
        >
          <MessageSquareText className="h-4 w-4" />
          {dict.contact.formTitle}
        </button>
      </div>

      {mode === "eligibility" ? (
        <EligibilityCheckForm locale={locale} dict={dict} settings={settings} whatsapp={whatsapp} />
      ) : (
        <ContactForm locale={locale} dict={dict} settings={settings} />
      )}
    </div>
  );
}
