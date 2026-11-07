import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { isOptimizableSrc } from "@/components/ui/MediaFrame";

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
  logoUrl,
}: {
  locale: Locale;
  variant?: "dark" | "light";
  logoUrl?: string;
}) {
  const dict = getDictionary(locale);
  const titleColor = variant === "light" ? "text-white" : "text-trust-blue";
  const subColor = variant === "light" ? "text-white/70" : "text-charcoal/60";

  return (
    <Link href={`/${locale}`} className="group flex min-w-0 items-center gap-2 sm:gap-3">
      {logoUrl ? (
        isOptimizableSrc(logoUrl) ? (
          <Image
            src={logoUrl}
            alt={dict.meta.siteName}
            width={96}
            height={96}
            className="h-9 w-9 shrink-0 object-contain transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:scale-105 sm:h-11 sm:w-11"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={dict.meta.siteName}
            className="h-9 w-9 shrink-0 object-contain transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:scale-105 sm:h-11 sm:w-11"
          />
        )
      ) : (
        <LogoMark className="h-9 w-9 shrink-0 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:scale-105 sm:h-11 sm:w-11" aria-hidden="true" />
      )}
      <span className="flex min-w-0 flex-col leading-tight">
        <span
          className={`truncate font-[family-name:var(--font-display)] text-[0.9375rem] font-extrabold sm:text-lg ${titleColor}`}
        >
          {dict.meta.siteName}
        </span>
        <span className={`truncate text-[0.5625rem] tracking-[0.14em] sm:text-[0.6875rem] sm:tracking-[0.16em] ${subColor}`}>
          {locale === "ar" ? "BRIDGE TO CHINA EDU" : dict.meta.siteNameChinese}
        </span>
      </span>
    </Link>
  );
}
