"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, MessageCircle, MousePointerClick } from "lucide-react";
import MediaFrame from "@/components/ui/MediaFrame";
import TextReveal from "@/components/motion/TextReveal";
import { LogoMark } from "./Logo";
import type { Dictionary } from "@/i18n";
import { pick, type Locale } from "@/i18n/config";
import type { DestinationMedia, SettingsMap } from "@/lib/types";
import { settingText } from "@/lib/settings-helpers";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero({
  locale,
  dict,
  slides,
  rtl,
  overlay = 0.66,
  whatsapp,
  settings,
}: {
  locale: Locale;
  dict: Dictionary;
  slides: DestinationMedia[];
  rtl: boolean;
  overlay?: number;
  whatsapp?: string;
  settings: SettingsMap;
}) {
  const [index, setIndex] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));
  const [tilt, setTilt] = useState({ x: 0, y: 0, scroll: 0 });
  const Arrow = rtl ? ArrowLeft : ArrowRight;

  const headline = settingText(settings, "hero_headline", locale, dict.hero.title);
  const description = settingText(settings, "hero_description", locale, dict.hero.subtitle);
  const ctaPrimary = settingText(settings, "hero_cta_primary", locale, dict.hero.ctaPrimary);
  const ctaWhatsapp = settingText(settings, "hero_cta_secondary", locale, dict.common.whatsapp);
  const servicesLinkLabel = settingText(
    settings,
    "hero_services_link_label",
    locale,
    dict.hero.ctaSecondary,
  );
  const trustLine = settingText(settings, "hero_trust_line", locale, "");

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 7500);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Only fetch a slide's image once it has actually been shown — avoids
  // eagerly loading every hero photo on first paint just because they're
  // geometrically stacked (opacity alone doesn't stop the browser from
  // fetching an absolutely-positioned, in-viewport <img>).
  useEffect(() => {
    setVisited((prev) => (prev.has(index) ? prev : new Set(prev).add(index)));
  }, [index]);

  // Parallax input: pointer on desktop, device tilt + scroll on phones, so the
  // depth effect is present on every device.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const schedule = (next: Partial<{ x: number; y: number; scroll: number }>) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setTilt((prev) => ({ ...prev, ...next }));
      });
    };

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      schedule({
        x: event.clientX / window.innerWidth - 0.5,
        y: event.clientY / window.innerHeight - 0.5,
      });
    };

    const onOrientation = (event: DeviceOrientationEvent) => {
      if (typeof event.gamma !== "number" || typeof event.beta !== "number") return;
      schedule({
        x: Math.max(-0.5, Math.min(0.5, event.gamma / 60)),
        y: Math.max(-0.5, Math.min(0.5, (event.beta - 45) / 90)),
      });
    };

    const onScroll = () => schedule({ scroll: window.scrollY });

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("deviceorientation", onOrientation, true);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onOrientation, true);
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const layer = (depth: number, scrollDepth = 0, z = 0) => ({
    transform: `translate3d(${(tilt.x * depth).toFixed(2)}px, ${(tilt.y * depth + tilt.scroll * scrollDepth).toFixed(2)}px, ${z}px)`,
  });

  return (
    <section className="stage-3d relative flex min-h-[100svh] items-center overflow-hidden bg-trust-blue-dark">
      {/* layer 1 — media backdrop with slow zoom */}
      <div className="absolute inset-0" style={layer(14, 0.06)}>
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-[1800ms] ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <div
              className="ken-burns h-full w-full"
              style={{ animationPlayState: i === index ? "running" : "paused" }}
            >
              {(i === index || visited.has(i)) && (
                <MediaFrame
                  src={slide.image_url}
                  poster={slide.poster}
                  alt={pick(slide, "title", locale)}
                  priority={i === 0}
                  sceneDetail="full"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* layer 2 — a single calm dark wash for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(6,14,28,0.72) 0%, rgba(6,14,28,0.5) 42%, rgba(6,14,28,0.86) 100%)",
          opacity: overlay,
        }}
      />

      {/* layer 3 — parallax bridge */}
      <div
        className="hero-layer pointer-events-none absolute inset-x-0 bottom-0 h-[26%] opacity-55"
        style={layer(46, -0.14)}
      >
        <svg viewBox="0 0 1600 400" preserveAspectRatio="none" className="h-full w-full">
          <motion.path
            d="M-40 300 Q 800 20 1640 300"
            fill="none"
            stroke="color-mix(in srgb, var(--color-imperial-gold) 70%, transparent)"
            strokeWidth="5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.4, ease: EASE, delay: 0.3 }}
          />
          <motion.path
            d="M-40 330 Q 800 50 1640 330"
            fill="none"
            stroke="color-mix(in srgb, var(--color-china-red) 80%, transparent)"
            strokeWidth="10"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.6, ease: EASE }}
          />
          {Array.from({ length: 11 }).map((_, i) => {
            const x = -40 + i * 165;
            const t = (x - 800) / 840;
            const y = 330 - 280 * (1 - t * t);
            return (
              <motion.line
                key={i}
                x1={x}
                y1={y}
                x2={x}
                y2={Math.min(400, y + 120)}
                stroke="color-mix(in srgb, var(--color-imperial-gold) 45%, transparent)"
                strokeWidth="3"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                style={{ transformOrigin: `${x}px 400px` }}
                transition={{ duration: 0.7, delay: 1 + i * 0.05, ease: EASE }}
              />
            );
          })}
        </svg>
      </div>

      {/* layer 4 — floating brand emblem (solid surface, no glass blur) */}
      <motion.div
        className="pointer-events-none absolute top-[18%] hidden lg:block end-[8%]"
        style={layer(-70, 0.05, 60)}
        initial={{ opacity: 0, scale: 0.7, rotateY: -40 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.6 }}
      >
        <div className="float-slow rounded-[1.5rem] border border-white/15 bg-white/10 p-8">
          <LogoMark className="h-28 w-28 drop-shadow-[0_10px_24px_rgba(0,0,0,0.4)]" />
        </div>
      </motion.div>

      {/* layer 5 — content */}
      <div
        className="container-page relative z-10 pt-24 pb-14 sm:pt-28 sm:pb-20 lg:pb-24"
        style={layer(-16, 0.03)}
      >
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-wide text-white"
          >
            <span className="h-2 w-2 rounded-full bg-imperial-gold" />
            {dict.hero.badge}
          </motion.span>

          <TextReveal
            text={headline}
            delay={0.15}
            className="mt-6 text-[clamp(1.9rem,5.2vw,3.6rem)] font-extrabold leading-[1.2] text-white drop-shadow-[0_8px_28px_rgba(0,0,0,0.4)]"
          />

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
            className="mt-5 max-w-2xl text-[clamp(1rem,1.4vw,1.2rem)] leading-relaxed text-white/85"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.65 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <Link
              href={`/${locale}/contact`}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-china-red px-7 py-3.5 text-base font-bold text-white shadow-[0_10px_24px_-10px_var(--color-china-red)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              {ctaPrimary}
              <Arrow className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </Link>

            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-jade px-7 py-3.5 text-base font-bold text-white transition-transform duration-300 hover:-translate-y-0.5"
              >
                <MessageCircle className="h-5 w-5" />
                {ctaWhatsapp}
              </a>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.8 }}
            className="mt-4"
          >
            <Link
              href={`/${locale}/services`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/75 underline underline-offset-4 transition-colors hover:text-white"
            >
              {servicesLinkLabel}
              <Arrow className="h-3.5 w-3.5" />
            </Link>
          </motion.div>

          {trustLine && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.95 }}
              className="mt-6 max-w-xl text-sm leading-relaxed text-white/65"
            >
              {trustLine}
            </motion.p>
          )}

          {slides.length > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="mt-8 flex flex-wrap items-center gap-2"
            >
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={pick(slide, "title", locale) || `${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === index ? "w-10 bg-imperial-gold" : "w-4 bg-white/35 hover:bg-white/60"
                  }`}
                />
              ))}
              <span className="ms-3 text-xs font-semibold text-white/70">
                {pick(slides[index], "title", locale)}
              </span>
            </motion.div>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="pointer-events-none absolute inset-x-0 bottom-6 z-10 hidden justify-center sm:flex"
      >
        <span className="float-slow flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60">
          <MousePointerClick className="h-3.5 w-3.5" />
          {dict.common.scrollHint}
        </span>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ivory to-transparent" />
    </section>
  );
}
