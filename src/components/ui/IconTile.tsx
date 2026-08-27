import type { LucideIcon } from "lucide-react";

/**
 * The icon tile used across the site's card sections.
 *
 * Three things give it weight without reaching for the purple gradient that
 * marks a template: a colour that rotates through the brand palette so a grid
 * reads as a set rather than six identical squares; an inset highlight and a
 * coloured glow that suggest a lit, solid object; and a sheen that sweeps
 * across on hover. Depth comes from light, not from a linear-gradient fill.
 */
const TONES = [
  { bg: "bg-china-red", glow: "shadow-[0_18px_34px_-16px_var(--color-china-red)]" },
  { bg: "bg-trust-blue", glow: "shadow-[0_18px_34px_-16px_var(--color-trust-blue)]" },
  { bg: "bg-jade", glow: "shadow-[0_18px_34px_-16px_var(--color-jade)]" },
  { bg: "bg-imperial-gold", glow: "shadow-[0_18px_34px_-16px_var(--color-imperial-gold)]" },
] as const;

export default function IconTile({
  Icon,
  index = 0,
  size = "md",
  className = "",
}: {
  Icon: LucideIcon;
  /** Position in the list — decides which brand colour this tile takes. */
  index?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const tone = TONES[index % TONES.length];
  const box = size === "sm" ? "h-12 w-12" : "h-14 w-14";
  const glyph = size === "sm" ? "h-5 w-5" : "h-6 w-6";

  return (
    <span
      aria-hidden="true"
      className={`icon-tile ${box} ${tone.bg} ${tone.glow} ${className}`}
    >
      <Icon className={`${glyph} relative z-10`} />
    </span>
  );
}
