"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { settingText, type SettingsMapLike } from "@/lib/settings-helpers";

type Status = "idle" | "sending" | "success" | "error";

const QUALIFICATIONS = ["high_school", "bachelor", "master"] as const;
const LEVELS = ["none", "beginner", "hsk1_2", "hsk3_4", "hsk5_6"] as const;
const CONTACT_METHODS = ["whatsapp", "email", "phone"] as const;

const COUNTRY_CODES = [
  { code: "+20", label: "مصر +20" },
  { code: "+966", label: "السعودية +966" },
  { code: "+971", label: "الإمارات +971" },
  { code: "+965", label: "الكويت +965" },
  { code: "+974", label: "قطر +974" },
  { code: "+973", label: "البحرين +973" },
  { code: "+968", label: "عُمان +968" },
  { code: "+962", label: "الأردن +962" },
  { code: "+964", label: "العراق +964" },
  { code: "+212", label: "المغرب +212" },
  { code: "+213", label: "الجزائر +213" },
  { code: "+216", label: "تونس +216" },
  { code: "+218", label: "ليبيا +218" },
  { code: "+249", label: "السودان +249" },
  { code: "+967", label: "اليمن +967" },
  { code: "+86", label: "الصين +86" },
  { code: "+7", label: "روسيا / كازاخستان +7" },
  { code: "", label: "أخرى (اكتب الرمز يدوياً)" },
] as const;

export default function ContactForm({
  locale,
  dict,
  settings,
}: {
  locale: Locale;
  dict: Dictionary;
  settings: SettingsMapLike;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [countryCode, setCountryCode] = useState<string>(COUNTRY_CODES[0].code);
  const [consented, setConsented] = useState(false);

  const submitLabel = settingText(settings, "contact_submit_label", locale, dict.contact.submit);
  const afterSubmitNote = settingText(settings, "contact_after_submit_note", locale, "");
  const privacyConsentText = settingText(settings, "contact_privacy_consent_text", locale, "");
  const successMessage = settingText(settings, "contact_success_message", locale, dict.contact.success);
  const errorMessage = settingText(settings, "contact_error_message", locale, dict.contact.error);

  const fieldClass =
    "w-full rounded-xl border border-trust-blue/12 bg-white px-4 py-3 text-[15px] outline-none transition-all duration-300 focus:border-china-red/45 focus:shadow-[0_0_0_4px_rgba(200,16,46,0.08)]";
  const labelClass = "mb-1.5 block text-sm font-bold text-trust-blue";
  const errorClass = "mt-1.5 text-xs font-semibold text-china-red";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const phoneNumber = String(data.phone_number ?? "").trim();
    const phone = `${countryCode}${phoneNumber}`;

    const errors: Record<string, string> = {};
    if (!data.full_name || !String(data.full_name).trim()) errors.full_name = dict.contact.requiredError;
    if (!data.country || !String(data.country).trim()) errors.country = dict.contact.requiredError;
    if (!data.current_qualification) errors.current_qualification = dict.contact.requiredError;
    if (!phoneNumber) errors.phone_number = dict.contact.requiredError;
    if (privacyConsentText && !consented) errors.consent = dict.contact.requiredError;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus("error");
      setMessage("");
      return;
    }

    setFieldErrors({});
    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, phone, language: locale }),
      });

      if (!response.ok) throw new Error("request failed");

      form.reset();
      setConsented(false);
      setStatus("success");
      setMessage(successMessage);
    } catch {
      setStatus("error");
      setMessage(errorMessage);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card relative p-7 sm:p-9" noValidate>
      <h2 className="text-2xl font-extrabold text-trust-blue">{dict.contact.formTitle}</h2>
      <span className="mt-3 block h-1 w-20 rounded-full bg-gradient-to-r from-china-red to-imperial-gold" />

      {/* honeypot — hidden from humans and assistive tech, catches naive spam bots */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="full_name">
            {dict.contact.fields.fullName} <span className="text-china-red">*</span>
          </label>
          <input
            id="full_name"
            name="full_name"
            autoComplete="name"
            aria-invalid={Boolean(fieldErrors.full_name)}
            className={fieldClass}
            placeholder={dict.contact.placeholders.fullName}
          />
          {fieldErrors.full_name && <p className={errorClass}>{fieldErrors.full_name}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="country">
            {dict.contact.fields.country} <span className="text-china-red">*</span>
          </label>
          <input
            id="country"
            name="country"
            autoComplete="country-name"
            aria-invalid={Boolean(fieldErrors.country)}
            className={fieldClass}
            placeholder={dict.contact.placeholders.country}
          />
          {fieldErrors.country && <p className={errorClass}>{fieldErrors.country}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="current_qualification">
            {dict.contact.fields.qualification} <span className="text-china-red">*</span>
          </label>
          <select
            id="current_qualification"
            name="current_qualification"
            aria-invalid={Boolean(fieldErrors.current_qualification)}
            className={fieldClass}
            defaultValue=""
          >
            <option value="" disabled>
              {dict.contact.fields.choose}
            </option>
            {QUALIFICATIONS.map((key) => (
              <option key={key} value={key}>
                {dict.options.qualification[key]}
              </option>
            ))}
          </select>
          {fieldErrors.current_qualification && (
            <p className={errorClass}>{fieldErrors.current_qualification}</p>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="desired_major">
            {dict.contact.fields.major}{" "}
            <span className="text-xs font-normal text-charcoal/45">({dict.common.optional})</span>
          </label>
          <input
            id="desired_major"
            name="desired_major"
            className={fieldClass}
            placeholder={dict.contact.placeholders.major}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="chinese_level">
            {dict.contact.fields.chineseLevel}{" "}
            <span className="text-xs font-normal text-charcoal/45">({dict.common.optional})</span>
          </label>
          <select id="chinese_level" name="chinese_level" className={fieldClass} defaultValue="">
            <option value="">{dict.contact.fields.choose}</option>
            {LEVELS.map((key) => (
              <option key={key} value={key}>
                {dict.options.chineseLevel[key]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="preferred_contact">
            {dict.contact.fields.preferredContact} <span className="text-china-red">*</span>
          </label>
          <select
            id="preferred_contact"
            name="preferred_contact"
            className={fieldClass}
            defaultValue="whatsapp"
          >
            {CONTACT_METHODS.map((key) => (
              <option key={key} value={key}>
                {dict.options.preferredContact[key]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="phone_number">
            {dict.contact.fields.phone} <span className="text-china-red">*</span>
          </label>
          <div className="flex gap-2" dir="ltr">
            <select
              aria-label="رمز الدولة"
              value={countryCode}
              onChange={(event) => setCountryCode(event.target.value)}
              className={`${fieldClass} w-[40%] shrink-0`}
            >
              {COUNTRY_CODES.map((item) => (
                <option key={item.label} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
            <input
              id="phone_number"
              name="phone_number"
              autoComplete="tel"
              inputMode="tel"
              aria-invalid={Boolean(fieldErrors.phone_number)}
              className={fieldClass}
              placeholder={dict.contact.placeholders.phone}
            />
          </div>
          {fieldErrors.phone_number && <p className={errorClass}>{fieldErrors.phone_number}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="email">
            {dict.contact.fields.email}{" "}
            <span className="text-xs font-normal text-charcoal/45">({dict.common.optional})</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            dir="ltr"
            autoComplete="email"
            className={fieldClass}
            placeholder={dict.contact.placeholders.email}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="message">
            {dict.contact.fields.message}{" "}
            <span className="text-xs font-normal text-charcoal/45">({dict.common.optional})</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className={`${fieldClass} resize-y`}
            placeholder={dict.contact.placeholders.message}
          />
        </div>
      </div>

      {privacyConsentText && (
        <div className="mt-6">
          <label className="flex items-start gap-2.5 text-sm text-charcoal/75">
            <input
              type="checkbox"
              checked={consented}
              onChange={(event) => setConsented(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-trust-blue/30 accent-[var(--color-china-red)]"
            />
            <span>{privacyConsentText}</span>
          </label>
          {fieldErrors.consent && <p className={errorClass}>{fieldErrors.consent}</p>}
        </div>
      )}

      {afterSubmitNote && (
        <p className="mt-4 text-xs leading-relaxed text-charcoal/50">{afterSubmitNote}</p>
      )}

      {status !== "idle" && message && (
        <p
          role="status"
          className={`mt-6 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
            status === "success" ? "bg-jade/10 text-jade" : "bg-china-red/10 text-china-red"
          }`}
        >
          {status === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-china-red px-8 py-4 text-base font-bold text-white shadow-[0_10px_24px_-12px_var(--color-china-red)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-china-red-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        <Send className="h-5 w-5" />
        {status === "sending" ? dict.contact.sending : submitLabel}
      </button>
    </form>
  );
}
