import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import SectionHeading from "@/components/site/SectionHeading";
import FinalCTA from "@/components/site/FinalCTA";
import Reveal from "@/components/ui/Reveal";
import MediaImage from "@/components/ui/MediaImage";
import { getDictionary } from "@/i18n";
import { isLocale, pick, type Locale } from "@/i18n/config";
import { getDestinations, getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/settings-helpers";
import { UNIVERSITY_NAMES } from "@/lib/seed-content";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "ar");
  return { title: dict.whyChina.title, description: dict.whyChina.subtitle };
}

export default async function WhyChinaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);
  const [destinations, settings] = await Promise.all([getDestinations(), getSettings()]);
  const showcase = destinations.filter((item) => item.category !== "hero").slice(0, 3);

  return (
    <>
      <PageHero title={dict.whyChina.title} subtitle={dict.whyChina.subtitle} scene="xian" />

      <section className="container-page py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dict.whyChina.points.map((point, index) => (
            <Reveal key={point.title} delay={index * 70}>
              <article className="surface-card h-full p-7 transition-transform duration-500 hover:-translate-y-1">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-china-red/10 text-china-red">
                  <CheckCircle2 className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-trust-blue">{point.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-charcoal/75">{point.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow={dict.nav.whyChina}
            title={dict.whyChina.universitiesTitle}
            subtitle={dict.whyChina.universitiesNote}
          />

          <Reveal delay={80}>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {UNIVERSITY_NAMES.map((name) => (
                <div
                  key={name}
                  dir="ltr"
                  className="rounded-2xl border border-trust-blue/10 bg-ivory px-4 py-5 text-center text-sm font-bold text-trust-blue/75 transition-all duration-300 hover:-translate-y-1 hover:border-china-red/30 hover:text-china-red"
                >
                  {name}
                </div>
              ))}
            </div>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {showcase.map((item, index) => (
              <Reveal key={item.id} delay={index * 90}>
                <figure className="group relative h-56 overflow-hidden rounded-3xl shadow-[var(--shadow-soft)]">
                  <div className="absolute inset-0 transition-transform duration-[1200ms] group-hover:scale-110">
                    <MediaImage src={item.image_url} alt={pick(item, "title", locale)} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-trust-blue-dark/85 to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-5 text-lg font-extrabold text-white">
                    {pick(item, "title", locale)}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA locale={locale} dict={dict} whatsapp={whatsappLink(settings, dict.meta.tagline)} />
    </>
  );
}
