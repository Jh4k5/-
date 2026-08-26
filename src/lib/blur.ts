import type { BlurLevel } from "./types";

export const BLUR_LEVEL_PX: Record<BlurLevel, number> = {
  none: 0,
  light: 4,
  medium: 9,
  heavy: 16,
};

/** Admissions saved before Prompt 2 only have blur_enabled; treat that as "medium". */
export function resolveBlurLevel(admission: { blur_level?: BlurLevel | null; blur_enabled: boolean }): BlurLevel {
  if (admission.blur_level) return admission.blur_level;
  return admission.blur_enabled ? "medium" : "none";
}
