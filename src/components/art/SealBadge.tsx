import type { ReactNode } from "react";

/**
 * A badge shaped like a Chinese seal (印章): a square red stamp with a lighter
 * inner keyline, rather than the rounded pill that shows up on every template.
 * Used where the site needs to mark something as verified or official.
 */
export default function SealBadge({
  children,
  icon,
  tone = "solid",
  className = "",
}: {
  children: ReactNode;
  icon?: ReactNode;
  /** "solid" stamps in china red; "outline" suits an already-red background. */
  tone?: "solid" | "outline";
  className?: string;
}) {
  const styles =
    tone === "solid"
      ? "bg-china-red text-white ring-china-red/30"
      : "bg-transparent text-white ring-white/40";

  return (
    <span
      className={`relative inline-flex items-center gap-1.5 rounded-[4px] px-3 py-1.5 text-xs font-bold tracking-wide ring-1 ${styles} ${className}`}
    >
      {/* The inner keyline is what makes it read as a stamp. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[3px] rounded-[2px] border border-current opacity-30"
      />
      {icon}
      {children}
    </span>
  );
}
