"use client";

import { useEffect, useRef } from "react";

/**
 * Golden motes drifting upward — the "living painting" layer behind the hero
 * and the dark sections. Canvas based, density derived from the viewport so a
 * phone gets the same look at a fraction of the cost, and paused whenever the
 * section scrolls out of view.
 */
export default function ParticleField({
  className = "",
  color = "212, 175, 55",
  density = 1,
}: {
  className?: string;
  color?: string;
  density?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let running = true;
    let frame = 0;

    type Mote = { x: number; y: number; r: number; vy: number; vx: number; a: number; t: number };
    let motes: Mote[] = [];

    const seed = () => {
      const area = width * height;
      const count = Math.round(Math.min(90, Math.max(18, (area / 26000) * density)));
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.7 + Math.random() * 2.1,
        vy: -(0.08 + Math.random() * 0.34),
        vx: (Math.random() - 0.5) * 0.16,
        a: 0.18 + Math.random() * 0.5,
        t: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = () => {
      if (!running) return;
      context.clearRect(0, 0, width, height);

      for (const mote of motes) {
        mote.t += 0.012;
        mote.y += mote.vy;
        mote.x += mote.vx + Math.sin(mote.t) * 0.18;

        if (mote.y < -12) {
          mote.y = height + 12;
          mote.x = Math.random() * width;
        }
        if (mote.x < -12) mote.x = width + 12;
        if (mote.x > width + 12) mote.x = -12;

        const twinkle = mote.a * (0.65 + 0.35 * Math.sin(mote.t * 1.7));
        const gradient = context.createRadialGradient(
          mote.x,
          mote.y,
          0,
          mote.x,
          mote.y,
          mote.r * 4,
        );
        gradient.addColorStop(0, `rgba(${color}, ${twinkle})`);
        gradient.addColorStop(1, `rgba(${color}, 0)`);
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(mote.x, mote.y, mote.r * 4, 0, Math.PI * 2);
        context.fill();
      }

      frame = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          frame = requestAnimationFrame(draw);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(frame);
        }
      },
      { threshold: 0 },
    );

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);
    observer.observe(parent);
    resize();
    frame = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, [color, density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
