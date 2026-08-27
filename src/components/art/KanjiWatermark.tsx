/**
 * A single Chinese character set very faintly behind a section heading.
 *
 * The characters carry the meaning of the section they sit behind, so the
 * identity reads as deliberate rather than decorative: 学 study, 桥 bridge,
 * 语 language, 门 gate, 信 trust, 路 path.
 *
 * No web font is loaded for these. Every current desktop and mobile OS ships a
 * Simplified Chinese face (PingFang SC, Microsoft YaHei, Noto Sans CJK), and
 * pulling a CJK font over the wire for three glyphs would cost far more than
 * the effect is worth. `aria-hidden` keeps it out of the accessibility tree —
 * it is texture, not content.
 */
export const KANJI = {
  study: "学",
  bridge: "桥",
  language: "语",
  gate: "门",
  trust: "信",
  path: "路",
} as const;

export type KanjiKey = keyof typeof KANJI;

export default function KanjiWatermark({
  char,
  tone = "dark",
  size = "lg",
  className = "",
}: {
  char: KanjiKey;
  /** "light" for red or navy backgrounds, "dark" for pale ones. */
  tone?: "dark" | "light";
  /** "sm" fits a compact strip; "lg" sits behind a full section heading. */
  size?: "sm" | "lg";
  className?: string;
}) {
  const color = tone === "light" ? "text-white/[0.07]" : "text-china-red/[0.06]";
  const scale = size === "sm" ? "kanji-watermark--sm" : "kanji-watermark--lg";

  return (
    <span
      aria-hidden="true"
      className={`kanji-watermark ${scale} pointer-events-none absolute select-none leading-none font-black ${color} ${className}`}
    >
      {KANJI[char]}
    </span>
  );
}
