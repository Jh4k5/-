"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";

export default function Header({
  locale,
  dict,
  whatsapp,
  logoUrl,
}: {
  locale: Locale;
  dict: Dictionary;
  whatsapp: string;
  logoUrl?: string;
}) {
  const pathname = usePathname() || "";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const links = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/services`, label: dict.nav.services },
    { href: `/${locale}/universities`, label: dict.nav.universities },
    { href: `/${locale}/admissions`, label: dict.nav.admissions },
    { href: `/${locale}/why-china`, label: dict.nav.whyChina },
    { href: `/${locale}/stories`, label: dict.nav.stories },
    { href: `/${locale}/blog`, label: dict.nav.blog },
  ];

  const isActive = (href: string) =>
    href === `/${locale}` ? pathname === href : pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-ivory/90 shadow-[0_10px_40px_-24px_rgba(27,58,107,0.6)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <div className={scrolled ? "" : "drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]"}>
          <Logo locale={locale} variant={scrolled ? "dark" : "light"} logoUrl={logoUrl} />
        </div>

        <nav className="hidden items-center gap-0.5 xl:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative rounded-full px-3.5 py-2 text-sm font-semibold transition-all duration-300 ${
                scrolled ? "text-trust-blue hover:bg-trust-blue/8" : "text-white/90 hover:bg-white/12"
              } ${isActive(link.href) ? "after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-china-red" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} variant={scrolled ? "dark" : "light"} />

          <Link
            href={`/${locale}/contact`}
            className="hidden items-center gap-2 rounded-full bg-china-red px-5 py-2.5 text-sm font-bold text-white shadow-[0_14px_30px_-14px_rgba(200,16,46,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-china-red-dark md:inline-flex"
          >
            <MessageCircle className="h-4 w-4" />
            {dict.nav.cta}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? dict.nav.close : dict.nav.menu}
            aria-expanded={open}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors xl:hidden ${
              scrolled
                ? "border-trust-blue/15 bg-white text-trust-blue"
                : "border-white/25 bg-white/10 text-white"
            }`}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden bg-ivory/98 backdrop-blur-xl transition-[max-height,opacity] duration-500 xl:hidden ${
          open ? "max-h-[40rem] opacity-100 shadow-xl" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="container-page flex flex-col gap-1 py-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                isActive(link.href)
                  ? "bg-trust-blue text-white"
                  : "text-trust-blue hover:bg-trust-blue/8"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Link
              href={`/${locale}/contact`}
              className="rounded-xl bg-china-red px-4 py-3 text-center text-sm font-bold text-white"
            >
              {dict.nav.cta}
            </Link>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-jade px-4 py-3 text-center text-sm font-bold text-white"
            >
              {dict.common.whatsapp}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
