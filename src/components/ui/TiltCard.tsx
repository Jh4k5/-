"use client";

import { useRef, type ReactNode } from "react";

/**
 * Light-weight 3D tilt: pointer position drives rotateX/rotateY on a
 * perspective wrapper. Pointer-only, so touch devices keep native scrolling,
 * and disabled entirely under prefers-reduced-motion (see globals.css).
 */
export default function TiltCard({
  children,
  className = "",
  intensity = 8,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.transform = `perspective(900px) rotateX(${(-py * intensity).toFixed(2)}deg) rotateY(${(px * intensity).toFixed(2)}deg) translateY(-6px) scale(1.015)`;
  };

  const reset = () => {
    const node = ref.current;
    if (node) node.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      className={`tilt-card ${className}`}
    >
      {children}
    </div>
  );
}
