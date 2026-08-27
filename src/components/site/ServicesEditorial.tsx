import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import { pick, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import type { Service } from "@/lib/types";

/** Homepage "خدماتنا" — a numbered editorial list, not a grid of matching cards. */
export default function ServicesEditorial({
  services,
  locale,
  dict,
}: {
  services: Service[];
  locale: Locale;
  dict: Dictionary;
}) {
  if (services.length === 0) return null;

  return (
    <div className="mx-auto max-w-3xl">
      <ol className="divide-y divide-trust-blue/10 border-y border-trust-blue/10">
        {services.slice(0, 6).map((service, index) => (
          <Reveal key={service.id} delay={index * 60} as="li" className="flex gap-5 py-6">
              <span className="shrink-0 font-[family-name:var(--font-display)] text-2xl font-extrabold text-imperial-gold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-extrabold text-trust-blue">
                  {pick(service, "title", locale)}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-charcoal/70">
                  {pick(service, "description", locale)}
                </p>
              </div>
          </Reveal>
        ))}
      </ol>

      <div className="mt-10 flex justify-center">
        <Link
          href={`/${locale}/services`}
          className="inline-flex items-center gap-2 rounded-[10px] border border-trust-blue px-6 py-3 text-sm font-bold text-trust-blue transition-colors duration-300 hover:bg-trust-blue hover:text-white"
        >
          {dict.services.viewAll}
        </Link>
      </div>
    </div>
  );
}
