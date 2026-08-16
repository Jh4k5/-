"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";

type Status = "idle" | "sending" | "success" | "error";

const QUALIFICATIONS = ["high_school", "bachelor", "master"] as const;
const LEVELS = ["none", "beginner", "hsk1_2", "hsk3_4", "hsk5_6"] as const;
const CONTACT_METHODS = ["whatsapp", "email", "phone"] as const;

export default function ContactForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const fieldClass =
    "w-full rounded-xl border border-trust-blue/12 bg-white px-4 py-3 text-[15px] outline-none transition-all duration-300 focus:border-china-red/45 focus:shadow-[0_0_0_4px_rgba(200,16,46,0.08)]";
  const labelClass = "mb-1.5 block text-sm font-bold text-trust-blue";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.full_name || !data.country || !data.current_qualification || !data.phone) {
      setStatus("error");
      setMessage(dict.contact.requiredError);
      return;
    }

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, language: locale }),
      });

      if (!response.ok) throw new Error("request failed");

      form.reset();
      setStatus("success");
      setMessage(dict.contact.success);
    } catch {
      setStatus("error");
      setMessage(dict.contact.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card p-7 sm:p-9" noValidate>
      <h2 className="text-2xl font-extrabold text-trust-blue">{dict.contact.formTitle}</h2>
      <span className="mt-3 block h-1 w-20 rounded-full bg-gradient-to-r from-china-red to-imperial-gold" />

      {/* honeypot — hidden from humans, catches naive spam bots */}
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
            required
            className={fieldClass}
            placeholder={dict.contact.placeholders.fullName}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="country">
            {dict.contact.fields.country} <span className="text-china-red">*</span>
          </label>
          <input
            id="country"
            name="country"
            required
            className={fieldClass}
            placeholder={dict.contact.placeholders.country}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="current_qualification">
            {dict.contact.fields.qualification} <span className="text-china-red">*</span>
          </label>
          <select id="current_qualification" name="current_qualification" required className={fieldClass} defaultValue="">
            <option value="" disabled>
              {dict.contact.fields.choose}
            </option>
            {QUALIFICATIONS.map((key) => (
              <option key={key} value={key}>
                {dict.options.qualification[key]}
              </option>
            ))}
          </select>
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
            required
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
          <label className={labelClass} htmlFor="phone">
            {dict.contact.fields.phone} <span className="text-china-red">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            required
            dir="ltr"
            inputMode="tel"
            className={fieldClass}
            placeholder={dict.contact.placeholders.phone}
          />
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

      {status !== "idle" && message && (
        <p
          role="status"
          className={`mt-6 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
            status === "success"
              ? "bg-jade/10 text-jade"
              : "bg-china-red/10 text-china-red"
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
        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-china-red px-8 py-4 text-base font-bold text-white shadow-[0_20px_40px_-20px_rgba(200,16,46,1)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-china-red-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        <Send className="h-5 w-5" />
        {status === "sending" ? dict.contact.sending : dict.contact.submit}
      </button>
    </form>
  );
}
