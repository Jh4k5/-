"use client";

import { useEffect } from "react";
import { dirOf, type Locale } from "@/i18n/config";

/**
 * `<html lang dir>` is set server-side in the root layout from a request
 * header, but the root layout sits above the `[locale]` segment so it does
 * not re-render on a client-side locale switch (only this layout does).
 * This keeps the two attributes correct immediately after such a switch,
 * without needing `router.refresh()` to force a full server re-render.
 */
export default function HtmlLangSync({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dirOf(locale);
  }, [locale]);

  return null;
}
