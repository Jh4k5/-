import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "@fontsource/cairo/400.css";
import "@fontsource/cairo/600.css";
import "@fontsource/cairo/700.css";
import "@fontsource/cairo/800.css";
import "@fontsource/tajawal/400.css";
import "@fontsource/tajawal/500.css";
import "@fontsource/tajawal/700.css";
import "@fontsource-variable/inter";
import "./globals.css";
import { defaultLocale, dirOf, isLocale } from "@/i18n/config";
import { getSettings } from "@/lib/data";
import { motionIntensity, themeStyle } from "@/lib/theme";

export const metadata: Metadata = {
  title: {
    default: "جسر إلى الصين | Bridge to China | Мост в Китай",
    template: "%s | جسر إلى الصين",
  },
  description:
    "مكتب استشارات تعليمية متخصص حصرياً في الدراسة بالصين — قبول جامعي، منح دراسية، لغة صينية، واستقبال الطالب.",
  icons: {
    icon: [{ url: "/logo-mark.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#1b3a6b",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headerList = await headers();
  const headerLocale = headerList.get("x-locale");
  const locale = isLocale(headerLocale) ? headerLocale : defaultLocale;

  // Brand colours and motion strength are dashboard-controlled.
  const settings = await getSettings();

  return (
    <html
      lang={locale}
      dir={dirOf(locale)}
      data-motion={motionIntensity(settings)}
      style={themeStyle(settings)}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-ivory text-charcoal antialiased">{children}</body>
    </html>
  );
}
