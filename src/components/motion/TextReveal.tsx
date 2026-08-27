"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Headline that arrives word by word, with an optional gold sweep. */
export default function TextReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.07,
  as: Tag = "h1",
  calm = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "p" | "span";
  /** Skips the per-word blur/rotateX stagger in favour of one plain
   * opacity+y reveal — cheaper to composite on phones, where a filter:blur()
   * on several simultaneous elements is a real source of scroll/paint jank. */
  calm?: boolean;
}) {
  const MotionTag = motion[Tag];

  if (calm) {
    return (
      <MotionTag
        className={className}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay }}
      >
        {text}
      </MotionTag>
    );
  }

  const words = text.split(" ").filter(Boolean);

  return (
    <MotionTag
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block whitespace-pre"
          variants={{
            hidden: { opacity: 0, y: "0.6em", rotateX: 55, filter: "blur(6px)" },
            show: {
              opacity: 1,
              y: 0,
              rotateX: 0,
              filter: "blur(0px)",
              transition: { duration: 0.85, ease: EASE },
            },
          }}
        >
          {word}
          {index < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </MotionTag>
  );
}
