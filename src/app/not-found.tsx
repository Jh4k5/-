import Link from "next/link";
import { LogoMark } from "@/components/site/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-trust-blue-dark px-6 text-center text-white">
      <LogoMark className="h-16 w-16" />
      <p className="font-[family-name:var(--font-display)] text-6xl font-extrabold text-imperial-gold">
        404
      </p>
      <div className="space-y-2">
        <p className="text-xl font-bold">الصفحة غير موجودة · Page not found · Страница не найдена</p>
        <p className="text-white/65">
          الرابط الذي تبحث عنه غير متاح، لكن الجسر ما زال مفتوحاً.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/ar"
          className="rounded-full bg-china-red px-6 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5"
        >
          العربية
        </Link>
        <Link
          href="/en"
          className="rounded-full border border-white/25 px-6 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5"
        >
          English
        </Link>
        <Link
          href="/ru"
          className="rounded-full border border-white/25 px-6 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5"
        >
          Русский
        </Link>
      </div>
    </div>
  );
}
