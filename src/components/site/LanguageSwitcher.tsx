"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { LOCALE_COOKIE, locales, localeConfig, type Locale } from "@/i18n/config";

export default function LanguageSwitcher({
  locale,
  variant = "dark",
  size = "sm",
}: {
  locale: Locale;
  variant?: "dark" | "light";
  /** "lg" gives each option a ≥44px tap target for mobile drawers. */
  size?: "sm" | "lg";
}) {
  const pathname = usePathname() || `/${locale}`;
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const targetFor = (next: Locale) => {
    const segments = pathname.split("/");
    segments[1] = next;
    return segments.join("/") || `/${next}`;
  };

  // Warm the RSC payload for the other two locales so the switch below feels
  // instant instead of waiting on a fresh fetch after the click.
  useEffect(() => {
    for (const code of locales) {
      if (code !== locale) router.prefetch(targetFor(code));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, pathname]);

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    startTransition(() => {
      router.push(targetFor(next));
    });
  };

  const base =
    variant === "light"
      ? "border-white/30 bg-white/15 text-white"
      : "border-trust-blue/12 bg-white/70 text-trust-blue";

  return (
    <div
      className={`flex items-center gap-0.5 rounded-full border p-0.5 backdrop-blur-md sm:p-1 ${base} ${pending ? "opacity-70" : ""}`}
      role="group"
      aria-label={localeConfig[locale].label}
    >
      {locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchTo(code)}
            aria-current={active ? "true" : undefined}
            title={localeConfig[code].nativeLabel}
            className={`flex items-center justify-center rounded-full font-bold tracking-wide transition-all duration-300 focus-visible:ring-2 focus-visible:ring-china-red focus-visible:outline-none ${
              size === "lg" ? "min-h-11 min-w-11 px-4 py-2.5 text-sm" : "px-2 py-1 text-[0.6875rem] sm:px-2.5 sm:text-xs"
            } ${
              active
                ? "bg-china-red text-white shadow-[0_6px_16px_-6px_rgba(200,16,46,0.9)]"
                : variant === "light"
                  ? "text-white/75 hover:bg-white/15"
                  : "text-trust-blue/70 hover:bg-trust-blue/10"
            }`}
          >
            {localeConfig[code].short}
          </button>
        );
      })}
    </div>
  );
}
