"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Depth on every device.
 *
 * - Desktop: the pointer drives rotateX / rotateY.
 * - Touch devices: the card's position in the viewport drives a gentle tilt as
 *   the page scrolls, and device orientation adds a live parallax when the
 *   phone is moved, so the 3D effect is never desktop-only.
 */
export default function Tilt3D({
  children,
  className = "",
  intensity = 9,
  scale = 1.015,
  glare = false,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
  scale?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const pointerActive = useRef(false);

  const apply = (rx: number, ry: number, lift: number, boost = 1) => {
    const node = ref.current;
    if (!node) return;
    node.style.transform = `perspective(1100px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(${lift.toFixed(2)}px) scale(${boost})`;
  };

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = ref.current;
    if (!node) return;
    pointerActive.current = true;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.setProperty("--glare-x", `${(px + 0.5) * 100}%`);
    node.style.setProperty("--glare-y", `${(py + 0.5) * 100}%`);
    apply(-py * intensity, px * intensity, -6, scale);
  };

  const reset = () => {
    pointerActive.current = false;
    const node = ref.current;
    if (node) node.style.transform = "";
  };

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: hover)").matches) return;

    let frame = 0;
    let orientation = 0;

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (pointerActive.current) return;
        const rect = node.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        // -0.5 (below the fold) .. 0.5 (above it)
        const progress = 0.5 - (rect.top + rect.height / 2) / window.innerHeight;
        apply(progress * intensity * 0.8, orientation * intensity * 0.5, 0, 1);
      });
    };

    const onOrientation = (event: DeviceOrientationEvent) => {
      if (typeof event.gamma !== "number") return;
      orientation = Math.max(-1, Math.min(1, event.gamma / 35));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("deviceorientation", onOrientation, true);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("deviceorientation", onOrientation, true);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [intensity]);

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      className={`tilt-card relative ${className}`}
    >
      {children}
      {glare && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.35) 0%, transparent 55%)",
          }}
        />
      )}
    </div>
  );
}
