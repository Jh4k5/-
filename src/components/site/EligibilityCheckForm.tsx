"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, MessageCircle, Send } from "lucide-react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { COUNTRY_CODES } from "@/lib/country-codes";
import { settingText, settingValue, type SettingsMapLike } from "@/lib/settings-helpers";

type Status = "idle" | "sending" | "success" | "error";

const QUALIFICATIONS = ["high_school", "bachelor", "master", "phd"] as const;
const LEVELS = ["none", "beginner", "hsk1_2", "hsk3_4", "hsk5_6"] as const;
const CONTACT_METHODS = ["whatsapp", "email", "phone"] as const;

export default function EligibilityCheckForm({
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
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [countryCode, setCountryCode] = useState<string>(COUNTRY_CODES[0].code);
  const [wantsScholarship, setWantsScholarship] = useState<"" | "yes" | "no">("");

  const title = settingText(settings, "eligibility_title", locale, dict.eligibility.title);
  const subtitle = settingText(settings, "eligibility_subtitle", locale, dict.eligibility.subtitle);
  const successMessage = settingText(
    settings,
    "eligibility_success_message",
    locale,
    dict.eligibility.success,
  );
  const whatsappVisible = settingValue(settings, "eligibility_whatsapp_status", "active") === "active";

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
    if (!data.full_name || !String(data.full_name).trim()) errors.full_name = dict.eligibility.requiredError;
    if (!data.country || !String(data.country).trim()) errors.country = dict.eligibility.requiredError;
    if (!data.current_qualification) errors.current_qualification = dict.eligibility.requiredError;
    if (!phoneNumber) errors.phone_number = dict.eligibility.requiredError;

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
        body: JSON.stringify({
          ...data,
          phone,
          language: locale,
          source: "eligibility_check",
          wants_scholarship: wantsScholarship === "" ? null : wantsScholarship === "yes",
        }),
      });

      if (!response.ok) throw new Error("request failed");

      form.reset();
      setWantsScholarship("");
      setStatus("success");
      setMessage(successMessage);
    } catch {
      setStatus("error");
      setMessage(dict.eligibility.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card relative p-7 sm:p-9" noValidate>
      <h2 className="text-2xl font-extrabold text-trust-blue">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-charcoal/65">{subtitle}</p>
      <span className="mt-3 block h-1 w-20 rounded-full bg-gradient-to-r from-china-red to-imperial-gold" />

      {/* honeypot */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="elig_full_name">
            {dict.contact.fields.fullName} <span className="text-china-red">*</span>
          </label>
          <input
            id="elig_full_name"
            name="full_name"
            autoComplete="name"
            aria-invalid={Boolean(fieldErrors.full_name)}
            className={fieldClass}
            placeholder={dict.contact.placeholders.fullName}
          />
          {fieldErrors.full_name && <p className={errorClass}>{fieldErrors.full_name}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="elig_country">
            {dict.eligibility.fields.country} <span className="text-china-red">*</span>
          </label>
          <input
            id="elig_country"
            name="country"
            autoComplete="country-name"
            aria-invalid={Boolean(fieldErrors.country)}
            className={fieldClass}
            placeholder={dict.eligibility.placeholders.country}
          />
          {fieldErrors.country && <p className={errorClass}>{fieldErrors.country}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="elig_qualification">
            {dict.eligibility.fields.stage} <span className="text-china-red">*</span>
          </label>
          <select
            id="elig_qualification"
            name="current_qualification"
            aria-invalid={Boolean(fieldErrors.current_qualification)}
            className={fieldClass}
            defaultValue=""
          >
            <option value="" disabled>
              {dict.eligibility.fields.choose}
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
          <label className={labelClass} htmlFor="elig_major">
            {dict.eligibility.fields.major}{" "}
            <span className="text-xs font-normal text-charcoal/45">({dict.common.optional})</span>
          </label>
          <input
            id="elig_major"
            name="desired_major"
            className={fieldClass}
            placeholder={dict.eligibility.placeholders.major}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="elig_start_year">
            {dict.eligibility.fields.startYear}{" "}
            <span className="text-xs font-normal text-charcoal/45">({dict.common.optional})</span>
          </label>
          <input
            id="elig_start_year"
            name="desired_start_year"
            type="number"
            inputMode="numeric"
            min={2024}
            max={2035}
            className={fieldClass}
            placeholder={dict.eligibility.placeholders.startYear}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="elig_chinese_level">
            {dict.eligibility.fields.chineseLevel}{" "}
            <span className="text-xs font-normal text-charcoal/45">({dict.common.optional})</span>
          </label>
          <select id="elig_chinese_level" name="chinese_level" className={fieldClass} defaultValue="">
            <option value="">{dict.eligibility.fields.choose}</option>
            {LEVELS.map((key) => (
              <option key={key} value={key}>
                {dict.options.chineseLevel[key]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className={labelClass}>
            {dict.eligibility.fields.wantsScholarship}{" "}
            <span className="text-xs font-normal text-charcoal/45">({dict.common.optional})</span>
          </span>
          <div className="flex gap-2">
            {(["yes", "no"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setWantsScholarship(wantsScholarship === option ? "" : option)}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-bold transition-colors ${
                  wantsScholarship === option
                    ? "border-china-red bg-china-red/10 text-china-red"
                    : "border-trust-blue/12 bg-white text-charcoal/70"
                }`}
              >
                {option === "yes" ? dict.eligibility.yes : dict.eligibility.no}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="elig_preferred_contact">
            {dict.eligibility.fields.preferredContact}
          </label>
          <select
            id="elig_preferred_contact"
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

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="elig_phone_number">
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
              id="elig_phone_number"
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
      </div>

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

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-china-red px-8 py-4 text-base font-bold text-white shadow-[0_10px_24px_-12px_var(--color-china-red)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-china-red-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="h-5 w-5" />
          {status === "sending" ? dict.eligibility.sending : dict.eligibility.submit}
        </button>

        {whatsappVisible && whatsapp && (
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-jade px-8 py-4 text-base font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#008a60]"
          >
            <MessageCircle className="h-5 w-5" />
            {dict.eligibility.whatsappCta}
          </a>
        )}
      </div>
    </form>
  );
}
