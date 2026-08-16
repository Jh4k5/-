"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, MessageCircle, MousePointerClick } from "lucide-react";
import MediaFrame from "@/components/ui/MediaFrame";
import ParticleField from "@/components/motion/ParticleField";
import TextReveal from "@/components/motion/TextReveal";
import { LogoMark } from "./Logo";
import type { Dictionary } from "@/i18n";
import { pick, type Locale } from "@/i18n/config";
import type { DestinationMedia } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero({
  locale,
  dict,
  slides,
  rtl,
  overlay = 0.66,
  whatsapp,
}: {
  locale: Locale;
  dict: Dictionary;
  slides: DestinationMedia[];
  rtl: boolean;
  overlay?: number;
  whatsapp?: string;
}) {
  const [index, setIndex] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0, scroll: 0 });
  const Arrow = rtl ? ArrowLeft : ArrowRight;

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 7500);
    return () => clearInterval(timer);
  }, [slides.length]);

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
            <div className="ken-burns h-full w-full">
              <MediaFrame
                src={slide.image_url}
                poster={slide.poster}
                alt={pick(slide, "title", locale)}
                priority={i === 0}
              />
            </div>
          </div>
        ))}
      </div>

      {/* layer 2 — brand wash */}
      <div
        className="animated-gradient absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(118deg, color-mix(in srgb, var(--color-china-red) 62%, transparent) 0%, color-mix(in srgb, var(--color-trust-blue-dark) 88%, transparent) 46%, rgba(4,10,24,0.92) 100%)",
          opacity: overlay,
        }}
      />
      {/* vignette keeps the centre of the artwork readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_0%,transparent_38%,rgba(4,10,24,0.55)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_118%,color-mix(in_srgb,var(--color-imperial-gold)_30%,transparent)_0%,transparent_58%)]" />

      {/* layer 3 — drifting aurora */}
      <div
        className="aurora pointer-events-none absolute -inset-[20%] opacity-45 blur-3xl"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 35%, color-mix(in srgb, var(--color-china-red) 55%, transparent) 0, transparent 45%), radial-gradient(circle at 75% 60%, color-mix(in srgb, var(--color-imperial-gold) 45%, transparent) 0, transparent 45%)",
        }}
      />

      {/* layer 4 — golden motes */}
      <ParticleField density={1.15} />

      {/* layer 5 — parallax bridge */}
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

      {/* layer 6 — floating brand emblem */}
      <motion.div
        className="pointer-events-none absolute top-[18%] hidden lg:block end-[8%]"
        style={layer(-70, 0.05, 60)}
        initial={{ opacity: 0, scale: 0.7, rotateY: -40 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.6 }}
      >
        <div className="float-slow rounded-[2rem] border border-white/15 bg-white/5 p-8 backdrop-blur-md">
          <LogoMark className="h-28 w-28 drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)]" />
        </div>
      </motion.div>

      {/* layer 7 — content */}
      <div className="container-page relative z-10 pt-28 pb-24" style={layer(-16, 0.03)}>
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-wide text-white backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-imperial-gold opacity-70 [animation:pulse-ring_2.4s_ease-out_infinite]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-imperial-gold" />
            </span>
            {dict.hero.badge}
          </motion.span>

          <TextReveal
            text={dict.hero.title}
            delay={0.15}
            className="mt-6 text-[clamp(2.6rem,7vw,5.4rem)] font-extrabold leading-[1.08] text-white drop-shadow-[0_14px_50px_rgba(0,0,0,0.5)]"
          />

          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.6em" }}
            animate={{ opacity: 1, letterSpacing: "0.3em" }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.8 }}
            className="mt-3 text-lg font-semibold text-imperial-gold"
          >
            {dict.meta.siteNameChinese}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
            className="mt-6 max-w-2xl text-[clamp(1rem,1.4vw,1.3rem)] leading-relaxed text-white/85"
          >
            {dict.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 1.05 }}
            className="mt-9 grid gap-3 sm:flex sm:flex-wrap sm:items-center"
          >
            <Link
              href={`/${locale}/contact`}
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-china-red px-7 py-3.5 text-base font-bold text-white shadow-[0_20px_45px_-18px_var(--color-china-red)] transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="shine absolute inset-0 overflow-hidden rounded-full" aria-hidden="true" />
              <span className="relative">{dict.hero.ctaPrimary}</span>
              <Arrow className="relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </Link>

            <Link
              href={`/${locale}/services`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-base font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
            >
              {dict.hero.ctaSecondary}
            </Link>

            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-jade/90 px-6 py-3.5 text-base font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-jade sm:hidden"
              >
                <MessageCircle className="h-5 w-5" />
                {dict.common.whatsapp}
              </a>
            )}
          </motion.div>

          {slides.length > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="mt-10 flex flex-wrap items-center gap-2"
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
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute inset-x-0 bottom-6 z-10 flex justify-center"
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
