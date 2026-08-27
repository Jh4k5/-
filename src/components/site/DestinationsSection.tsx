import KanjiWatermark from "@/components/art/KanjiWatermark";
import MediaFrame from "@/components/ui/MediaFrame";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "./SectionHeading";
import Tilt3D from "@/components/motion/Tilt3D";
import type { Dictionary } from "@/i18n";
import { pick, type Locale } from "@/i18n/config";
import type { DestinationMedia } from "@/lib/types";

export default function DestinationsSection({
  items,
  locale,
  dict,
  title,
  subtitle,
}: {
  items: DestinationMedia[];
  locale: Locale;
  dict: Dictionary;
  title?: string;
  subtitle?: string;
}) {
  const gallery = items.filter((item) => item.category !== "hero");
  if (gallery.length === 0) return null;

  const [lead, ...rest] = gallery;

  const label = (item: DestinationMedia) =>
    item.category === "campus" ? dict.explore.campusLabel : dict.explore.cityLabel;

  return (
    <section className="surface-deep relative overflow-hidden py-24">
      <KanjiWatermark char="gate" className="-top-10 end-0 hidden lg:block" />
      <div className="container-page relative">
      <SectionHeading
        eyebrow={dict.nav.whyChina}
        title={title || dict.explore.title}
        subtitle={subtitle || dict.explore.subtitle}
      />

      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <Tilt3D intensity={5} className="h-full">
            <figure className="defer-offscreen group relative h-[22rem] overflow-hidden rounded-2xl shadow-[var(--shadow-card)] lg:h-full lg:min-h-[26rem]">
              <div className="absolute inset-0 transition-transform duration-[1200ms] group-hover:scale-105">
                <MediaFrame src={lead.image_url} alt={pick(lead, "title", locale)} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-trust-blue-dark/90 via-trust-blue-dark/25 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-7">
                <span className="inline-flex rounded-full bg-china-red px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-widest text-white">
                  {label(lead)}
                </span>
                <p className="mt-3 font-[family-name:var(--font-display)] text-2xl font-extrabold text-white sm:text-3xl">
                  {pick(lead, "title", locale)}
                </p>
              </figcaption>
            </figure>
          </Tilt3D>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          {rest.slice(0, 2).map((item, index) => (
            <Reveal key={item.id} delay={(index + 1) * 90}>
              <Tilt3D intensity={7}>
                <figure className="defer-offscreen group relative h-52 overflow-hidden rounded-2xl shadow-[var(--shadow-soft)]">
                  <div className="absolute inset-0 transition-transform duration-[1200ms] group-hover:scale-110">
                    <MediaFrame
                      src={item.image_url}
                      poster={item.poster}
                      alt={pick(item, "title", locale)}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-trust-blue-dark/85 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-5">
                    <span className="text-[0.625rem] font-bold uppercase tracking-widest text-imperial-gold">
                      {label(item)}
                    </span>
                    <p className="mt-1 text-lg font-extrabold text-white">
                      {pick(item, "title", locale)}
                    </p>
                  </figcaption>
                </figure>
              </Tilt3D>
            </Reveal>
          ))}
        </div>
      </div>

      {rest.length > 2 && (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {rest.slice(2, 6).map((item, index) => (
            <Reveal key={item.id} delay={index * 80}>
              <Tilt3D intensity={7}>
                <figure className="defer-offscreen group relative h-48 overflow-hidden rounded-2xl shadow-[var(--shadow-soft)]">
                  <div className="absolute inset-0 transition-transform duration-[1200ms] group-hover:scale-110">
                    <MediaFrame
                      src={item.image_url}
                      poster={item.poster}
                      alt={pick(item, "title", locale)}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-trust-blue-dark/85 via-trust-blue-dark/20 to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-5">
                    <span className="text-[0.625rem] font-bold uppercase tracking-widest text-imperial-gold">
                      {label(item)}
                    </span>
                    <p className="mt-1 text-base font-extrabold text-white">
                      {pick(item, "title", locale)}
                    </p>
                  </figcaption>
                </figure>
              </Tilt3D>
            </Reveal>
          ))}
        </div>
      )}
    </div>
    </section>
  );
}
