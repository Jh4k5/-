import type { CSSProperties } from "react";
import { settingValue, type SettingsMapLike } from "./settings-helpers";
import type { MotionIntensity } from "./types";

export const DEFAULT_THEME = {
  primary: "#b73535",
  gold: "#c6a15b",
  blue: "#0f2740",
  jade: "#1f7a68",
  motion: "cinematic" as MotionIntensity,
  overlay: 66,
};

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

function colorOr(value: string, fallback: string) {
  return HEX.test(value.trim()) ? value.trim() : fallback;
}

/**
 * Brand colours chosen in the dashboard are written onto <html> as the same
 * custom properties Tailwind reads, so every utility (bg-china-red, text-…)
 * and every derived shade follows without a rebuild.
 */
export function themeStyle(settings: SettingsMapLike): CSSProperties {
  return {
    ["--color-china-red" as string]: colorOr(
      settingValue(settings, "brand_primary", DEFAULT_THEME.primary),
      DEFAULT_THEME.primary,
    ),
    ["--color-imperial-gold" as string]: colorOr(
      settingValue(settings, "brand_gold", DEFAULT_THEME.gold),
      DEFAULT_THEME.gold,
    ),
    ["--color-trust-blue" as string]: colorOr(
      settingValue(settings, "brand_blue", DEFAULT_THEME.blue),
      DEFAULT_THEME.blue,
    ),
    ["--color-jade" as string]: colorOr(
      settingValue(settings, "brand_jade", DEFAULT_THEME.jade),
      DEFAULT_THEME.jade,
    ),
  };
}

export function motionIntensity(settings: SettingsMapLike): MotionIntensity {
  const value = settingValue(settings, "motion_intensity", DEFAULT_THEME.motion);
  return value === "calm" || value === "balanced" || value === "cinematic"
    ? value
    : DEFAULT_THEME.motion;
}

/** Hero overlay strength, 0–100, as a 0–1 multiplier. */
export function heroOverlay(settings: SettingsMapLike): number {
  const raw = Number.parseInt(settingValue(settings, "hero_overlay_opacity", String(DEFAULT_THEME.overlay)), 10);
  const clamped = Number.isFinite(raw) ? Math.min(95, Math.max(20, raw)) : DEFAULT_THEME.overlay;
  return clamped / 100;
}
