import Link from "next/link";
import { getDictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";

export function LogoMark({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="logo-arc" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#c8102e" />
          <stop offset="100%" stopColor="#d4af37" />
        </linearGradient>
      </defs>
      <path d="M8 44 Q32 12 56 44" fill="none" stroke="url(#logo-arc)" strokeWidth="6" strokeLinecap="round" />
      <path d="M10 48 Q32 20 54 48" fill="none" stroke="#d4af37" strokeWidth="2.4" strokeLinecap="round" opacity="0.85" />
      <g stroke="#c8102e" strokeWidth="3.2" strokeLinecap="round">
        <line x1="18" y1="38.5" x2="18" y2="50" />
        <line x1="32" y1="32" x2="32" y2="50" />
        <line x1="46" y1="38.5" x2="46" y2="50" />
      </g>
      <rect x="8" y="50" width="48" height="4" rx="2" fill="#d4af37" />
    </svg>
  );
}

export default function Logo({
  locale,
  variant = "dark",
}: {
  locale: Locale;
  variant?: "dark" | "light";
}) {
  const dict = getDictionary(locale);
  const titleColor = variant === "light" ? "text-white" : "text-trust-blue";
  const subColor = variant === "light" ? "text-white/70" : "text-charcoal/60";

  return (
    <Link href={`/${locale}`} className="group flex items-center gap-3">
      <LogoMark className="h-11 w-11 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:scale-105" />
      <span className="flex flex-col leading-tight">
        <span className={`font-[family-name:var(--font-display)] text-lg font-extrabold ${titleColor}`}>
          {dict.meta.siteName}
        </span>
        <span className={`text-[11px] tracking-[0.18em] ${subColor}`}>
          {locale === "ar" ? "BRIDGE TO CHINA" : dict.meta.siteNameChinese}
        </span>
      </span>
    </Link>
  );
}
