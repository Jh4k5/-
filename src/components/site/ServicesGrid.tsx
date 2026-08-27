import IconTile from "@/components/ui/IconTile";
import Link from "next/link";
import { Check, X } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import Tilt3D from "@/components/motion/Tilt3D";
import { iconFor } from "@/lib/icons";
import { pick, type Locale } from "@/i18n/config";
import type { Service } from "@/lib/types";

function lines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function ServicesGrid({
  services,
  locale,
  detailed = false,
}: {
  services: Service[];
  locale: Locale;
  detailed?: boolean;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service, index) => {
        const Icon = iconFor(service.icon);
        const description = pick(service, "description", locale);
        const includes = detailed ? lines(pick(service, "includes", locale)) : [];
        const excludes = detailed ? lines(pick(service, "excludes", locale)) : [];
        const ctaLabel = detailed ? pick(service, "cta_label", locale) : "";
        const ctaLink = service.cta_link?.trim();

        return (
          <Reveal key={service.id} delay={index * 70}>
            <Tilt3D className="group h-full">
              <article className="defer-offscreen surface-card relative flex h-full flex-col overflow-hidden p-7 transition-shadow duration-500 hover:shadow-[var(--shadow-card)]">
                <span className="absolute inset-x-0 top-0 h-1 bg-china-red opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <IconTile Icon={Icon} index={index} />

                <h3 className="mt-5 text-xl font-extrabold text-trust-blue">
                  {pick(service, "title", locale)}
                </h3>

                <p
                  className={`mt-3 text-base leading-relaxed text-charcoal/75 ${detailed ? "" : "line-clamp-4"}`}
                >
                  {description}
                </p>

                {(includes.length > 0 || excludes.length > 0) && (
                  <div className="mt-5 space-y-3 border-t border-trust-blue/8 pt-4">
                    {includes.length > 0 && (
                      <ul className="space-y-1.5">
                        {includes.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-charcoal/80">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-jade" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {excludes.length > 0 && (
                      <ul className="space-y-1.5">
                        {excludes.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-charcoal/60">
                            <X className="mt-0.5 h-4 w-4 shrink-0 text-china-red/70" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                <span className="mt-5 inline-block h-1 w-12 rounded-full bg-imperial-gold/70 transition-all duration-500 group-hover:w-20" />

                {detailed && ctaLabel && ctaLink && (
                  <Link
                    href={ctaLink}
                    target={ctaLink.startsWith("/") ? undefined : "_blank"}
                    rel={ctaLink.startsWith("/") ? undefined : "noopener noreferrer"}
                    className="mt-4 inline-flex items-center justify-center rounded-full bg-china-red px-5 py-2.5 text-sm font-bold text-white transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    {ctaLabel}
                  </Link>
                )}
              </article>
            </Tilt3D>
          </Reveal>
        );
      })}
    </div>
  );
}
