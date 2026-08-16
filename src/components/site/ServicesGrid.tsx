import Reveal from "@/components/motion/Reveal";
import Tilt3D from "@/components/motion/Tilt3D";
import { iconFor } from "@/lib/icons";
import { pick, type Locale } from "@/i18n/config";
import type { Service } from "@/lib/types";

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

        return (
          <Reveal key={service.id} delay={index * 70}>
            <Tilt3D className="group h-full">
              <article className="surface-card relative flex h-full flex-col overflow-hidden p-7 transition-shadow duration-500 hover:shadow-[var(--shadow-card)]">
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-china-red via-imperial-gold to-trust-blue opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-trust-blue to-trust-blue-light text-white shadow-[0_16px_30px_-16px_rgba(27,58,107,0.95)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:from-china-red group-hover:to-china-red-dark">
                  <Icon className="h-6 w-6" />
                </span>

                <h3 className="mt-5 text-xl font-extrabold text-trust-blue">
                  {pick(service, "title", locale)}
                </h3>

                <p
                  className={`mt-3 text-[15px] leading-relaxed text-charcoal/75 ${detailed ? "" : "line-clamp-4"}`}
                >
                  {description}
                </p>

                <span className="mt-5 inline-block h-1 w-12 rounded-full bg-imperial-gold/70 transition-all duration-500 group-hover:w-20" />
              </article>
            </Tilt3D>
          </Reveal>
        );
      })}
    </div>
  );
}
