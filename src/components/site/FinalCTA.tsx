import Link from "next/link";
import { MessageCircle, Send } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";

export default function FinalCTA({
  locale,
  dict,
  whatsapp,
}: {
  locale: Locale;
  dict: Dictionary;
  whatsapp: string;
}) {
  return (
    <section className="container-page py-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-trust-blue px-8 py-16 text-center shadow-[var(--shadow-card)] sm:px-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 12% 20%, #c8102e 0, transparent 42%), radial-gradient(circle at 88% 78%, #d4af37 0, transparent 45%)",
            }}
          />
          <svg
            viewBox="0 0 1200 200"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28 w-full opacity-25"
            aria-hidden="true"
          >
            <path d="M-20 180 Q 600 20 1220 180" fill="none" stroke="#d4af37" strokeWidth="6" />
            {Array.from({ length: 13 }).map((_, i) => {
              const x = -20 + i * 103;
              const t = (x - 600) / 620;
              const y = 180 - 160 * (1 - t * t);
              return <line key={i} x1={x} y1={y} x2={x} y2="200" stroke="#d4af37" strokeWidth="3" />;
            })}
          </svg>

          <div className="relative">
            <h2 className="mx-auto max-w-3xl text-[clamp(1.7rem,3.6vw,2.8rem)] font-extrabold text-white">
              {dict.finalCta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              {dict.finalCta.subtitle}
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 rounded-full bg-china-red px-8 py-4 text-base font-bold text-white shadow-[0_22px_45px_-20px_rgba(200,16,46,1)] transition-all duration-300 hover:-translate-y-1 hover:bg-china-red-dark"
              >
                <Send className="h-5 w-5" />
                {dict.finalCta.button}
              </Link>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-jade px-8 py-4 text-base font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#008a60]"
              >
                <MessageCircle className="h-5 w-5" />
                {dict.finalCta.whatsapp}
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
