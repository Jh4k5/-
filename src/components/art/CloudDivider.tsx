/**
 * A thin band of 祥云 (auspicious cloud) scrollwork used to separate sections,
 * replacing the plain horizontal rule. The motif repeats along the width and is
 * purely decorative, so it is hidden from assistive technology.
 */
export default function CloudDivider({
  tone = "gold",
  flip = false,
  className = "",
}: {
  tone?: "gold" | "red" | "light";
  /** Mirrors the curl vertically, for the foot of a section. */
  flip?: boolean;
  className?: string;
}) {
  const stroke =
    tone === "gold"
      ? "var(--color-imperial-gold)"
      : tone === "red"
        ? "var(--color-china-red)"
        : "rgba(255,255,255,0.5)";

  // Two dividers of the same tone are interchangeable, so keying the pattern id
  // by tone keeps ids unique per distinct rendering without needing a hook.
  const patternId = `cloud-motif-${tone}`;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none w-full overflow-hidden ${className}`}
      style={{ transform: flip ? "scaleY(-1)" : undefined }}
    >
      <svg
        viewBox="0 0 120 12"
        preserveAspectRatio="xMidYMid meet"
        className="h-3 w-full opacity-45"
        role="presentation"
        focusable="false"
      >
        <defs>
          <pattern id={patternId} width="40" height="12" patternUnits="userSpaceOnUse">
            {/* One curl: a rising spiral that settles into the baseline. */}
            <path
              d="M0 9 h6 a4 4 0 0 1 4-4 a3 3 0 0 1 3 3 a2 2 0 0 1-2 2 a1.2 1.2 0 0 1-1.2-1.2
                 M16 9 h5 a5 5 0 0 1 5-5 a3.6 3.6 0 0 1 3.6 3.6 a2.2 2.2 0 0 1-2.2 2.2 a1.4 1.4 0 0 1-1.4-1.4
                 M31 9 h9"
              fill="none"
              stroke={stroke}
              strokeWidth="0.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </pattern>
        </defs>
        <rect width="120" height="12" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
