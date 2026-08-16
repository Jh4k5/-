"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

type Direction = "up" | "down" | "start" | "end" | "scale" | "none";

function offsetFor(direction: Direction, distance: number) {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "start":
      return { x: distance };
    case "end":
      return { x: -distance };
    default:
      return {};
  }
}

/**
 * Scroll-triggered entrance. Runs on every device — the effect is purely
 * transform/opacity so it stays cheap on phones as well.
 */
export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  distance = 32,
  duration = 0.8,
  className,
  once = true,
}: {
  children: ReactNode;
  /** Delay in milliseconds, matching the rest of the codebase. */
  delay?: number;
  direction?: Direction;
  distance?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        scale: direction === "scale" ? 0.94 : 1,
        ...offsetFor(direction, distance),
      }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once, amount: 0.18, margin: "0px 0px -60px 0px" }}
      transition={{ duration, delay: delay / 1000, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Container that staggers its RevealItem children. */
export function RevealGroup({
  children,
  className,
  stagger = 0.09,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  /** Delay in milliseconds. */
  delay?: number;
}) {
  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay / 1000 } },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  distance = 26,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const variants: Variants = {
    hidden: { opacity: 0, y: distance, scale: 0.97 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.75, ease: EASE } },
  };

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
