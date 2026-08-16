"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";

export const LANGS = [
  { code: "ar", label: "عربي" },
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
] as const;

export type LangCode = (typeof LANGS)[number]["code"];

export function AdminHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold text-trust-blue">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-charcoal/60">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`surface-card p-6 ${className}`}>{children}</div>;
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-sm font-bold text-trust-blue">
        {label}
        {hint && <span className="text-xs font-normal text-charcoal/45">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-trust-blue/12 bg-white px-4 py-2.5 text-[15px] outline-none transition-all duration-300 focus:border-china-red/45 focus:shadow-[0_0_0_4px_rgba(200,16,46,0.08)]";

export function Button({
  children,
  variant = "primary",
  loading,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger" | "soft";
  loading?: boolean;
}) {
  const styles = {
    primary: "bg-china-red text-white hover:bg-china-red-dark",
    soft: "bg-trust-blue/10 text-trust-blue hover:bg-trust-blue/20",
    ghost: "border border-trust-blue/15 text-trust-blue hover:bg-trust-blue/8",
    danger: "bg-white text-china-red border border-china-red/30 hover:bg-china-red/10",
  }[variant];

  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${styles} ${className}`}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function StatusNote({ status }: { status: { type: "ok" | "error"; text: string } | null }) {
  if (!status) return null;
  return (
    <p
      role="status"
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${
        status.type === "ok" ? "bg-jade/10 text-jade" : "bg-china-red/10 text-china-red"
      }`}
    >
      {status.type === "ok" ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <TriangleAlert className="h-4 w-4" />
      )}
      {status.text}
    </p>
  );
}

export function LangTabs({
  children,
  compact = false,
}: {
  children: (lang: LangCode) => ReactNode;
  compact?: boolean;
}) {
  const [active, setActive] = useState<LangCode>("ar");

  return (
    <div>
      <div className="flex gap-1.5 rounded-full bg-trust-blue/8 p-1">
        {LANGS.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setActive(lang.code)}
            className={`flex-1 rounded-full px-3 py-2 text-sm font-bold transition-all duration-300 ${
              active === lang.code
                ? "bg-white text-china-red shadow-sm"
                : "text-trust-blue/65 hover:text-trust-blue"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
      <div
        className={compact ? "mt-4" : "mt-5"}
        dir={active === "ar" ? "rtl" : "ltr"}
        lang={active}
      >
        {children(active)}
      </div>
    </div>
  );
}

/** Minimal rich-text editor (contentEditable + document.execCommand). */
export function RichTextEditor({
  value,
  onChange,
  dir = "rtl",
}: {
  value: string;
  onChange: (html: string) => void;
  dir?: "rtl" | "ltr";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const lastValue = useRef(value);

  useEffect(() => {
    if (ref.current && value !== lastValue.current) {
      ref.current.innerHTML = value;
      lastValue.current = value;
    }
  }, [value]);

  useEffect(() => {
    if (ref.current && !ref.current.innerHTML) {
      ref.current.innerHTML = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exec = (command: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    if (ref.current) {
      lastValue.current = ref.current.innerHTML;
      onChange(ref.current.innerHTML);
    }
  };

  const tools: { label: string; run: () => void }[] = [
    { label: "B", run: () => exec("bold") },
    { label: "I", run: () => exec("italic") },
    { label: "U", run: () => exec("underline") },
    { label: "H2", run: () => exec("formatBlock", "<h2>") },
    { label: "H3", run: () => exec("formatBlock", "<h3>") },
    { label: "¶", run: () => exec("formatBlock", "<p>") },
    { label: "• قائمة", run: () => exec("insertUnorderedList") },
    { label: "1. قائمة", run: () => exec("insertOrderedList") },
    { label: "❝", run: () => exec("formatBlock", "<blockquote>") },
    {
      label: "🔗",
      run: () => {
        const url = window.prompt("رابط:");
        if (url) exec("createLink", url);
      },
    },
    { label: "✕ تنسيق", run: () => exec("removeFormat") },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-trust-blue/12 bg-white">
      <div className="flex flex-wrap gap-1 border-b border-trust-blue/10 bg-ivory p-2">
        {tools.map((tool) => (
          <button
            key={tool.label}
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={tool.run}
            className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-trust-blue transition-colors hover:bg-trust-blue/10"
          >
            {tool.label}
          </button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        dir={dir}
        suppressContentEditableWarning
        onInput={(event) => {
          const html = (event.target as HTMLDivElement).innerHTML;
          lastValue.current = html;
          onChange(html);
        }}
        className="rich-text min-h-64 px-5 py-4 text-[15px] leading-[1.9] outline-none"
      />
    </div>
  );
}
