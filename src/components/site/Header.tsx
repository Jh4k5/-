"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Award,
  BookOpen,
  Building2,
  CircleHelp,
  Compass,
  FileCheck2,
  GraduationCap,
  Info,
  Languages,
  ListChecks,
  Map,
  Menu,
  MessageCircle,
  Newspaper,
  Route,
  Search as SearchIcon,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";

type NavItem = {
  href: string;
  label: string;
  Icon: LucideIcon;
};

/** Every indexable destination. Shared by the desktop bar (subset), the
 *  mobile quick grid (top four) and the mobile explore list (the rest). */
function navItems(locale: Locale, dict: Dictionary): NavItem[] {
  return [
    { href: `/${locale}`, label: dict.nav.home, Icon: Compass },
    { href: `/${locale}/services`, label: dict.nav.services, Icon: GraduationCap },
    { href: `/${locale}/universities`, label: dict.nav.universities, Icon: Building2 },
    { href: `/${locale}/study-paths`, label: dict.studyPaths.title, Icon: Route },
    { href: `/${locale}/blog`, label: dict.nav.blog, Icon: Newspaper },
    { href: `/${locale}/about`, label: dict.nav.about, Icon: Info },
    { href: `/${locale}/language-platform`, label: dict.languagePlatform.title, Icon: Languages },
    { href: `/${locale}/destinations`, label: dict.explore.cityLabel, Icon: Map },
    { href: `/${locale}/how-it-works`, label: dict.process.title, Icon: ListChecks },
    { href: `/${locale}/admissions`, label: dict.nav.admissions, Icon: FileCheck2 },
    { href: `/${locale}/why-china`, label: dict.nav.whyChina, Icon: Sparkles },
    { href: `/${locale}/stories`, label: dict.nav.stories, Icon: Award },
    { href: `/${locale}/faq`, label: dict.faq.title, Icon: CircleHelp },
  ];
}

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

  // Keep the page behind the sheet from scrolling on touch devices.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape closes the sheet — thumb-reach alternatives stay available.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const links = navItems(locale, dict);

  /** The four highest-intent destinations become the quick grid. */
  const quickHrefs = new Set([
    `/${locale}/services`,
    `/${locale}/universities`,
    `/${locale}/study-paths`,
    `/${locale}/blog`,
  ]);
  const quickLinks = links.filter((link) => quickHrefs.has(link.href));
  const exploreLinks = links.filter((link) => !quickHrefs.has(link.href));

  /** The desktop bar only has room for the highest-intent destinations. */
  const primaryHrefs = new Set([
    `/${locale}`,
    `/${locale}/services`,
    `/${locale}/study-paths`,
    `/${locale}/language-platform`,
    `/${locale}/universities`,
    `/${locale}/about`,
  ]);
  const primaryLinks = links.filter((link) => primaryHrefs.has(link.href));

  const isActive = (href: string) =>
    href === `/${locale}` ? pathname === href : pathname.startsWith(href);

  /** Glass surface once the visitor scrolls; the sheet borrows it when open
   *  so the panel reads as one continuous chrome element. */
  const barSolid = scrolled || open;

  const iconButton = (solid: boolean) =>
    `inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:ring-china-red focus-visible:ring-offset-2 focus-visible:outline-none sm:h-11 sm:w-11 ${
      solid
        ? "border-trust-blue/12 bg-white/70 text-trust-blue hover:bg-white"
        : "border-white/30 bg-white/15 text-white backdrop-blur-md hover:bg-white/25"
    }`;

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-500 ${
        barSolid
          ? "border-b border-trust-blue/8 bg-ivory/85 shadow-[0_6px_24px_-18px_rgba(15,39,64,0.55)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="container-page flex h-14 items-center justify-between gap-2 sm:h-16 sm:gap-4 xl:h-20">
        <div className={`min-w-0 flex-1 xl:flex-none ${scrolled || open ? "" : "drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]"}`}>
          <Logo locale={locale} variant={barSolid ? "dark" : "light"} logoUrl={logoUrl} />
        </div>

        <nav aria-label={dict.a11y.mainNav} className="hidden items-center gap-0.5 xl:flex">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative rounded-full px-3.5 py-2 text-sm font-semibold transition-all duration-300 ${
                barSolid ? "text-trust-blue hover:bg-trust-blue/8" : "text-white/90 hover:bg-white/12"
              } ${isActive(link.href) ? "after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-china-red" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* Search and language sit together as one control cluster, visible at
              every width — switching language is a top-level action here, not
              something buried in the mobile sheet. */}
          <div className="flex items-center gap-1.5">
            <Link
              href={`/${locale}/search`}
              aria-label={dict.search.title}
              className={iconButton(barSolid)}
            >
              <SearchIcon className="h-4.5 w-4.5" aria-hidden="true" />
            </Link>

            <LanguageSwitcher locale={locale} variant={barSolid ? "dark" : "light"} />
          </div>

          <Link
            href={`/${locale}/contact`}
            className="hidden items-center gap-2 rounded-full bg-china-red px-5 py-2.5 text-sm font-bold text-white shadow-[0_14px_30px_-14px_rgba(200,16,46,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-china-red-dark md:inline-flex"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            {dict.nav.cta}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? dict.nav.close : dict.nav.menu}
            aria-expanded={open}
            className={`${iconButton(barSolid)} xl:hidden`}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>

    {open && (
      <div
        className="fixed inset-0 top-14 z-40 sm:top-16 xl:hidden"
        role="presentation"
      >
        {/* Scrim — a tap anywhere outside the links dismisses the sheet. */}
        <button
          type="button"
          aria-label={dict.nav.close}
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className="sheet-scrim absolute inset-0 h-full w-full cursor-default bg-trust-blue-dark/45 backdrop-blur-[2px]"
        />

        {/* The sheet itself. Slides from under the bar; the quick grid leads,
            the full list follows, actions stay pinned within thumb reach. */}
        <div
          className="sheet-panel surface-deep absolute inset-x-0 top-0 bottom-0 overflow-y-auto overscroll-contain border-t border-trust-blue/8"
          role="dialog"
          aria-label={dict.nav.menu}
        >
          <nav
            aria-label={dict.a11y.mobileNav}
            className="container-page flex min-h-full flex-col pt-5 safe-bottom"
          >
              {/* Quick destinations — the four paths students look for first. */}
              <div className="grid grid-cols-2 gap-2.5">
                {quickLinks.map(({ href, label, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`group flex items-center gap-3 rounded-2xl border bg-white p-3 transition-[transform,box-shadow] duration-300 active:scale-[0.98] ${
                      isActive(href)
                        ? "border-china-red/30 shadow-[inset_0_0_0_1px_rgba(200,16,46,0.18)]"
                        : "border-trust-blue/10 shadow-[var(--shadow-soft)]"
                    }`}
                  >
                    <span
                      className={`icon-tile h-10 w-10 shrink-0 ${
                        href.endsWith("/services")
                          ? "bg-china-red"
                          : href.endsWith("/universities")
                            ? "bg-trust-blue"
                            : href.endsWith("/study-paths")
                              ? "bg-jade"
                              : "bg-imperial-gold"
                      }`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span
                      className={`min-w-0 text-sm leading-tight font-bold ${
                        isActive(href) ? "text-china-red-dark" : "text-trust-blue"
                      }`}
                    >
                      {label}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Everything else, one calm list. */}
              <div className="mt-4 flex flex-col gap-1">
                {exploreLinks.map(({ href, label, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    data-active={isActive(href)}
                    className="mobile-nav-row"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-trust-blue/7 text-trust-blue">
                      <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 truncate">{label}</span>
                  </Link>
                ))}
              </div>

              {/* Language + primary actions ride at the bottom of the sheet —
                  within thumb reach even when the list above is long. */}
              <div aria-hidden="true" className="flex-1" />
              <div className="mt-6 flex flex-col gap-3 border-t border-trust-blue/10 pt-5 pb-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-trust-blue/60">{dict.nav.language}</span>
                  <LanguageSwitcher locale={locale} variant="dark" size="lg" />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    href={`/${locale}/contact`}
                    className="btn-seal justify-center px-5 py-3.5 text-sm"
                  >
                    {dict.nav.cta}
                  </Link>
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[6px] bg-jade px-5 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_-18px_rgba(31,122,104,0.9)] transition-transform duration-300 active:scale-[0.98]"
                  >
                    <MessageCircle className="h-4.5 w-4.5" aria-hidden="true" />
                    {dict.common.whatsapp}
                  </a>
                </div>

                <p className="flex items-center justify-center gap-1.5 pt-1 text-[0.6875rem] font-semibold tracking-[0.18em] text-trust-blue/45 uppercase">
                  <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                  {dict.meta.siteNameChinese}
                </p>
              </div>
          </nav>
        </div>
      </div>
    )}
    </>
  );
}
