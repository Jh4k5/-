import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import FinalCTA from "@/components/site/FinalCTA";
import { getDictionary } from "@/i18n";
import { isLocale, pick, type Locale } from "@/i18n/config";
import {
  getArticles,
  getDestinations,
  getFaqs,
  getServices,
  getSettings,
  getStories,
  getStudyPaths,
  getUniversities,
} from "@/lib/data";
import { whatsappLink } from "@/lib/settings-helpers";
import { buildMetadata } from "@/lib/seo";
import { universityName } from "@/components/site/UniversityCard";

export const revalidate = 60;

type Hit = { title: string; excerpt: string; href: string; kind: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);
  const meta = buildMetadata({
    locale,
    path: "/search",
    title: dict.search.title,
    description: dict.search.subtitle,
  });
  // Result pages should never be indexed — only the content they point at.
  return { ...meta, robots: { index: false, follow: true } };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale: raw } = await params;
  const { q } = await searchParams;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);
  const query = (q ?? "").trim();

  const [settings, services, paths, universities, destinations, articles, stories, faqs] =
    await Promise.all([
      getSettings(),
      getServices(),
      getStudyPaths(),
      getUniversities(),
      getDestinations(),
      getArticles(),
      getStories(),
      getFaqs(),
    ]);

  let hits: Hit[] = [];

  if (query) {
    const needle = query.toLowerCase();
    const match = (...values: (string | null | undefined)[]) =>
      values.some((value) => (value ?? "").toLowerCase().includes(needle));

    const collect: Hit[] = [
      ...services
        .filter((s) => match(pick(s, "title", locale), pick(s, "description", locale)))
        .map((s) => ({
          title: pick(s, "title", locale),
          excerpt: pick(s, "description", locale),
          href: `/${locale}/services/${s.slug}`,
          kind: dict.nav.services,
        })),
      ...paths
        .filter((p) => match(pick(p, "title", locale), pick(p, "description", locale)))
        .map((p) => ({
          title: pick(p, "title", locale),
          excerpt: pick(p, "description", locale),
          href: `/${locale}/study-paths/${p.slug}`,
          kind: dict.studyPaths.title,
        })),
      ...universities
        .filter((u) => match(universityName(u, locale), u.name, pick(u, "description", locale)))
        .map((u) => ({
          title: universityName(u, locale),
          excerpt: pick(u, "description", locale),
          href: `/${locale}/universities/${u.slug}`,
          kind: dict.nav.universities,
        })),
      ...destinations
        .filter((d) => d.category === "city" && match(pick(d, "title", locale)))
        .map((d) => ({
          title: pick(d, "title", locale),
          excerpt: pick(d, "description", locale),
          href: `/${locale}/destinations/${d.slug}`,
          kind: dict.explore.cityLabel,
        })),
      ...articles
        .filter((a) => match(pick(a, "title", locale), pick(a, "excerpt", locale)))
        .map((a) => ({
          title: pick(a, "title", locale),
          excerpt: pick(a, "excerpt", locale),
          href: `/${locale}/blog/${a.slug}`,
          kind: dict.nav.blog,
        })),
      ...stories
        .filter((s) => match(s.student_name, pick(s, "achievement", locale)))
        .map((s) => ({
          title: s.student_name,
          excerpt: pick(s, "achievement", locale),
          href: `/${locale}/stories/${s.slug}`,
          kind: dict.nav.stories,
        })),
      ...faqs
        .filter((f) => match(pick(f, "question", locale), pick(f, "answer", locale)))
        .map((f) => ({
          title: pick(f, "question", locale),
          excerpt: pick(f, "answer", locale),
          href: `/${locale}/faq#${f.id}`,
          kind: dict.faq.title,
        })),
    ];

    hits = collect;
  }

  const trail = [
    { name: dict.nav.home, path: "/" },
    { name: dict.search.title, path: "/search" },
  ];

  return (
    <>
      <PageHero title={dict.search.title} subtitle={dict.search.subtitle} scene="campus-quad" />
      <Breadcrumbs locale={locale} trail={trail} />

      <section className="container-page py-14">
        <form action={`/${locale}/search`} className="mx-auto max-w-2xl">
          <div className="relative">
            <Search className="absolute top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/35 start-4" aria-hidden="true" />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder={dict.common.search}
              aria-label={dict.search.title}
              className="w-full rounded-full border border-trust-blue/15 bg-white py-4 pe-5 ps-12 text-base outline-none transition-colors focus:border-china-red/50"
            />
          </div>
        </form>

        <div className="mx-auto mt-10 max-w-2xl">
          {!query ? (
            <p className="text-center text-sm text-charcoal/55">{dict.search.prompt}</p>
          ) : hits.length === 0 ? (
            <p className="text-center text-sm text-charcoal/55">{dict.common.noResults}</p>
          ) : (
            <>
              <p className="text-sm text-charcoal/55">
                {dict.search.results}: {hits.length}
              </p>
              <ul className="mt-5 divide-y divide-trust-blue/10">
                {hits.map((hit) => (
                  <li key={hit.href + hit.title}>
                    <Link href={hit.href} className="block py-5 transition-colors hover:bg-white/60">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-imperial-gold">
                        {hit.kind}
                      </span>
                      <span className="mt-1 block font-extrabold text-trust-blue">{hit.title}</span>
                      {hit.excerpt && (
                        <span className="mt-1 block line-clamp-2 text-sm leading-relaxed text-charcoal/65">
                          {hit.excerpt}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <FinalCTA locale={locale} dict={dict} whatsapp={whatsappLink(settings, dict.meta.tagline)} />
    </>
  );
}
