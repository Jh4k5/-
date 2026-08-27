import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import FinalCTA from "@/components/site/FinalCTA";
import Reveal from "@/components/motion/Reveal";
import { iconFor } from "@/lib/icons";
import { getDictionary } from "@/i18n";
import { isLocale, pick, type Locale } from "@/i18n/config";
import {
  getProcessStages,
  getSettings,
  getStudyPathBySlug,
  getStudyPaths,
} from "@/lib/data";
import { whatsappLink } from "@/lib/settings-helpers";
import { breadcrumbJsonLd, buildMetadata, jsonLdScript } from "@/lib/seo";

export const revalidate = 60;

export async function generateStaticParams() {
  const paths = await getStudyPaths();
  return paths.filter((p) => p.slug).map((p) => ({ slug: p.slug as string }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const path = await getStudyPathBySlug(slug);
  if (!path) return { title: "404" };

  return buildMetadata({
    locale,
    path: `/study-paths/${slug}`,
    title: pick(path, "title", locale),
    description: pick(path, "description", locale).slice(0, 155),
  });
}

export default async function StudyPathPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);

  const [path, settings, all, stages] = await Promise.all([
    getStudyPathBySlug(slug),
    getSettings(),
    getStudyPaths(),
    getProcessStages(),
  ]);

  if (!path) notFound();

  const title = pick(path, "title", locale);
  const description = pick(path, "description", locale);
  const Icon = iconFor(path.icon);
  const others = all.filter((item) => item.slug && item.slug !== slug);

  const trail = [
    { name: dict.nav.home, path: "/" },
    { name: dict.studyPaths.title, path: "/study-paths" },
    { name: title, path: `/study-paths/${slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd(locale, trail, settings))}
      />

      <PageHero title={title} subtitle={description} scene="campus-quad" />
      <Breadcrumbs locale={locale} trail={trail} />

      <section className="container-page py-14">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-china-red/10 text-china-red">
              <Icon className="h-6 w-6" />
            </span>
            <p className="mt-6 text-base leading-relaxed text-charcoal/80">{description}</p>
          </Reveal>

          {stages.length > 0 && (
            <Reveal delay={90}>
              <div className="mt-12">
                <h2 className="text-lg font-extrabold text-trust-blue">{dict.process.title}</h2>
                <ol className="mt-5 space-y-5">
                  {stages.map((stage, index) => (
                    <li key={stage.id} className="flex gap-4">
                      <span className="shrink-0 font-[family-name:var(--font-display)] text-xl font-extrabold text-imperial-gold">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="font-extrabold text-trust-blue">
                          {pick(stage, "title", locale)}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-charcoal/70">
                          {pick(stage, "description", locale)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
                <Link
                  href={`/${locale}/how-it-works`}
                  className="mt-6 inline-block text-sm font-bold text-trust-blue underline underline-offset-4 hover:text-china-red"
                >
                  {dict.process.viewAllSteps}
                </Link>
              </div>
            </Reveal>
          )}

          <Reveal delay={140}>
            <div className="mt-12 flex flex-wrap gap-3">
              <Link
                href={`/${locale}/contact?stage=${path.path_key}#booking`}
                className="inline-flex items-center gap-2 rounded-full bg-china-red px-7 py-3.5 text-base font-bold text-white transition-transform duration-300 hover:-translate-y-0.5"
              >
                {dict.hero.ctaPrimary}
              </Link>
              <a
                href={whatsappLink(settings, title)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[10px] border border-jade px-6 py-3 text-sm font-bold text-jade transition-colors hover:bg-jade hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
                {dict.common.whatsapp}
              </a>
            </div>
          </Reveal>

          {others.length > 0 && (
            <div className="mt-16 border-t border-trust-blue/10 pt-8">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-charcoal/45">
                {dict.studyPaths.title}
              </h2>
              <ul className="mt-4 divide-y divide-trust-blue/10">
                {others.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/${locale}/study-paths/${item.slug}`}
                      className="block py-3.5 text-sm font-bold text-trust-blue transition-colors hover:text-china-red"
                    >
                      {pick(item, "title", locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <FinalCTA locale={locale} dict={dict} whatsapp={whatsappLink(settings, dict.meta.tagline)} />
    </>
  );
}
