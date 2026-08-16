"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, MousePointerClick } from "lucide-react";
import MediaImage from "@/components/ui/MediaImage";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { pick } from "@/i18n/config";
import type { DestinationMedia } from "@/lib/types";

export default function Hero({
  locale,
  dict,
  slides,
  rtl,
}: {
  locale: Locale;
  dict: Dictionary;
  slides: DestinationMedia[];
  rtl: boolean;
}) {
  const [index, setIndex] = useState(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0, scroll: 0 });
  const Arrow = rtl ? ArrowLeft : ArrowRight;

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      setOffset((prev) => ({ ...prev, x, y }));
    };
    const onScroll = () => setOffset((prev) => ({ ...prev, scroll: window.scrollY }));

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const layer = (depth: number, scrollDepth = 0) => ({
    transform: `translate3d(${(offset.x * depth).toFixed(2)}px, ${(offset.y * depth + offset.scroll * scrollDepth).toFixed(2)}px, 0)`,
  });

  return (
    <section
      ref={wrapRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-trust-blue-dark"
    >
      {/* layer 1 — photographic / painted background with Ken Burns */}
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-[1600ms] ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <div className="ken-burns h-full w-full">
              <MediaImage
                src={slide.image_url}
                alt={pick(slide, "title", locale)}
                priority={i === 0}
              />
            </div>
          </div>
        ))}
      </div>

      {/* layer 2 — brand gradient wash */}
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(200,16,46,0.72)_0%,rgba(27,58,107,0.86)_52%,rgba(9,20,40,0.94)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(212,175,55,0.28)_0%,transparent_60%)]" />

      {/* layer 3 — parallax bridge silhouette */}
      <div
        className="hero-layer pointer-events-none absolute inset-x-0 bottom-0 h-[42%] opacity-90"
        style={layer(38, -0.12)}
      >
        <svg viewBox="0 0 1600 400" preserveAspectRatio="none" className="h-full w-full">
          <path d="M0 330 Q 400 90 800 200 Q 1200 310 1600 120 L1600 400 L0 400 Z" fill="rgba(6,14,30,0.55)" />
          <path
            d="M-40 300 Q 800 20 1640 300"
            fill="none"
            stroke="rgba(212,175,55,0.55)"
            strokeWidth="5"
          />
          <path
            d="M-40 330 Q 800 50 1640 330"
            fill="none"
            stroke="rgba(200,16,46,0.65)"
            strokeWidth="10"
          />
          {Array.from({ length: 17 }).map((_, i) => {
            const x = -40 + i * 105;
            const t = (x - 800) / 840;
            const y = 330 - 280 * (1 - t * t);
            return (
              <line
                key={i}
                x1={x}
                y1={y}
                x2={x}
                y2={400}
                stroke="rgba(212,175,55,0.35)"
                strokeWidth="3"
              />
            );
          })}
        </svg>
      </div>

      {/* layer 4 — floating light motes */}
      <div className="pointer-events-none absolute inset-0" style={layer(-22)}>
        {[
          { top: "18%", left: "12%", size: 10, delay: "0s" },
          { top: "30%", left: "78%", size: 14, delay: "1.4s" },
          { top: "62%", left: "22%", size: 8, delay: "2.6s" },
          { top: "48%", left: "60%", size: 12, delay: "0.8s" },
        ].map((mote, i) => (
          <span
            key={i}
            className="float-slow absolute rounded-full bg-imperial-gold/70 blur-[1px]"
            style={{
              top: mote.top,
              left: mote.left,
              width: mote.size,
              height: mote.size,
              animationDelay: mote.delay,
            }}
          />
        ))}
      </div>

      {/* layer 5 — content */}
      <div className="container-page relative z-10 pt-28 pb-24" style={layer(-10)}>
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-wide text-white backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-imperial-gold" />
            {dict.hero.badge}
          </span>

          <h1 className="mt-6 text-[clamp(2.6rem,7vw,5.2rem)] font-extrabold leading-[1.08] text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
            {dict.hero.title}
          </h1>

          <p className="mt-3 text-lg font-semibold tracking-[0.3em] text-imperial-gold">
            {dict.meta.siteNameChinese}
          </p>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">
            {dict.hero.subtitle}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href={`/${locale}/contact`}
              className="group inline-flex items-center gap-2 rounded-full bg-china-red px-7 py-3.5 text-base font-bold text-white shadow-[0_20px_45px_-18px_rgba(200,16,46,1)] transition-all duration-300 hover:-translate-y-1 hover:bg-china-red-dark"
            >
              {dict.hero.ctaPrimary}
              <Arrow className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </Link>
            <Link
              href={`/${locale}/services`}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-base font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
            >
              {dict.hero.ctaSecondary}
            </Link>
          </div>

          {slides.length > 1 && (
            <div className="mt-10 flex items-center gap-2">
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
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center">
        <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60">
          <MousePointerClick className="h-3.5 w-3.5" />
          {dict.common.scrollHint}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ivory to-transparent" />
    </section>
  );
}
