import JsonLd from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GraduationCap, MapPin, Quote } from "lucide-react";
import MediaFrame from "@/components/ui/MediaFrame";
import PageHero from "@/components/site/PageHero";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import FinalCTA from "@/components/site/FinalCTA";
import Reveal from "@/components/motion/Reveal";
import { getDictionary } from "@/i18n";
import { isLocale, pick, type Locale } from "@/i18n/config";
import { getSettings, getStories, getStoryBySlug } from "@/lib/data";
import { whatsappLink } from "@/lib/settings-helpers";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateStaticParams() {
  const stories = await getStories();
  return stories.filter((s) => s.slug).map((s) => ({ slug: s.slug as string }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const story = await getStoryBySlug(slug);
  if (!story) return { title: "404" };

  const meta = buildMetadata({
    locale,
    path: `/stories/${slug}`,
    title: `${story.student_name} — ${pick(story, "achievement", locale)}`,
    description: pick(story, "achievement", locale).slice(0, 155),
    image: story.photo,
  });

  // Seeded placeholder students must never be indexed as real testimonials.
  return story.is_demo ? { ...meta, robots: { index: false, follow: false } } : meta;
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);

  const [story, settings, all] = await Promise.all([
    getStoryBySlug(slug),
    getSettings(),
    getStories(),
  ]);

  if (!story) notFound();

  const achievement = pick(story, "achievement", locale);
  const quote = pick(story, "quote", locale);
  const body = pick(story, "body", locale);
  const others = all.filter((item) => item.slug && item.slug !== slug).slice(0, 3);

  const trail = [
    { name: dict.nav.home, path: "/" },
    { name: dict.nav.stories, path: "/stories" },
    { name: story.student_name, path: `/stories/${slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(locale, trail, settings)} />

      <PageHero title={story.student_name} subtitle={achievement} scene="campus-library" />
      <Breadcrumbs locale={locale} trail={trail} />

      <section className="container-page py-14">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="flex flex-wrap items-center gap-4">
              {story.photo && (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                  <MediaFrame src={story.photo} alt={story.student_name} />
                </div>
              )}
              <div>
                <p className="text-lg font-extrabold text-trust-blue">{story.student_name}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-3 text-sm text-charcoal/60">
                  {story.university_name && (
                    <span className="inline-flex items-center gap-1">
                      <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
                      {story.university_name}
                    </span>
                  )}
                  {story.country && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      {story.country}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <p className="mt-8 text-base font-bold text-china-red">{achievement}</p>
          </Reveal>

          {quote && (
            <Reveal delay={120}>
              <blockquote className="mt-6 border-s-4 border-imperial-gold ps-5 text-lg leading-relaxed text-charcoal/80 italic">
                <Quote className="mb-2 h-5 w-5 text-imperial-gold" aria-hidden="true" />
                {quote}
              </blockquote>
            </Reveal>
          )}

          {body && (
            <Reveal delay={160}>
              <div className="mt-8 space-y-4 text-base leading-relaxed text-charcoal/80">
                {body.split("\n").filter(Boolean).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          )}

          <Reveal delay={200}>
            <Link
              href={`/${locale}/contact#booking`}
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-china-red px-7 py-3.5 text-base font-bold text-white transition-transform duration-300 hover:-translate-y-0.5"
            >
              {dict.hero.ctaPrimary}
            </Link>
          </Reveal>

          {others.length > 0 && (
            <div className="mt-16 border-t border-trust-blue/10 pt-8">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-charcoal/45">
                {dict.stories.title}
              </h2>
              <ul className="mt-4 divide-y divide-trust-blue/10">
                {others.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/${locale}/stories/${item.slug}`}
                      className="block py-3.5 text-sm font-bold text-trust-blue transition-colors hover:text-china-red"
                    >
                      {item.student_name} — {pick(item, "achievement", locale)}
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
