import { sanitizeRichText } from "@/lib/sanitize";
import JsonLd from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, ListTree, RotateCcw, Tag } from "lucide-react";
import MediaFrame from "@/components/ui/MediaFrame";
import ArticleCard from "@/components/site/ArticleCard";
import Reveal from "@/components/motion/Reveal";
import { getDictionary } from "@/i18n";
import { isLocale, pick, type Locale } from "@/i18n/config";
import { getArticleBySlug, getArticles, getSettings } from "@/lib/data";
import { formatDate, plainExcerpt, readingMinutes } from "@/lib/format";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 60;

/** Pulls the h2 headings out of sanitized article HTML, gives each a stable
 *  anchor id, and returns both the patched HTML and the TOC entries. Long
 *  study guides become navigable without shipping a client component. */
function withToc(html: string): { html: string; toc: { id: string; text: string }[] } {
  const toc: { id: string; text: string }[] = [];
  let index = 0;
  const patched = html.replace(/<h2([^>]*)>(.*?)<\/h2>/g, (_match, attrs: string, inner: string) => {
    index += 1;
    const id = `section-${index}`;
    const text = inner.replace(/<[^>]*>/g, "").trim();
    if (text) toc.push({ id, text });
    return `<h2${attrs} id="${id}">${inner}</h2>`;
  });
  return { html: patched, toc };
}

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.filter((a) => a.slug).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const title = pick(article, "title", locale);
  const description =
    pick(article, "excerpt", locale) || plainExcerpt(pick(article, "content", locale), 155);
  const base = buildMetadata({
    locale,
    path: `/blog/${slug}`,
    title,
    description,
    image: article.cover_image,
  });

  return { ...base, openGraph: { ...base.openGraph, type: "article" } };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);
  const Arrow = locale === "ar" ? ArrowRight : ArrowLeft;

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  // Related reading prefers the same category, then tops up from the rest.
  const all = await getArticles();
  const others = all.filter((item) => item.id !== article.id);
  const related = [
    ...others.filter((item) => item.category === article.category),
    ...others.filter((item) => item.category !== article.category),
  ].slice(0, 3);

  // Stored article HTML is cleaned on the server before it is ever injected,
  // then heading anchors are added for the table of contents.
  const { html: content, toc } = withToc(sanitizeRichText(pick(article, "content", locale)));
  const minutes = readingMinutes(pick(article, "content", locale));
  const updated = article.updated_at && article.updated_at !== article.created_at;
  const localized =
    locale === "ar" ? article.content_ar : locale === "en" ? article.content_en : article.content_ru;
  const hasTranslation = Boolean(localized && localized.trim());

  const settings = await getSettings();
  const title = pick(article, "title", locale);
  const trail = [
    { name: dict.nav.home, path: "/" },
    { name: dict.nav.blog, path: "/blog" },
    { name: title, path: `/blog/${slug}` },
  ];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: pick(article, "excerpt", locale) || plainExcerpt(content, 155),
    datePublished: article.created_at,
    dateModified: article.updated_at ?? article.created_at,
    inLanguage: locale,
    ...(article.cover_image && !article.cover_image.startsWith("scene:")
      ? { image: [article.cover_image] }
      : {}),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${getSiteUrl(settings)}/${locale}/blog/${slug}`,
    },
    publisher: {
      "@type": "EducationalOrganization",
      name: dict.meta.siteName,
      url: getSiteUrl(settings),
    },
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd(locale, trail, settings)} />

      <section className="relative flex min-h-[24rem] items-end overflow-hidden bg-trust-blue-dark pt-28 pb-12">
        <div className="absolute inset-0">
          <div className="ken-burns h-full w-full">
            <MediaFrame src={article.cover_image} alt={pick(article, "title", locale)} priority />
          </div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(27,58,107,0.85)_0%,rgba(9,20,40,0.95)_100%)]" />

        <div className="container-page relative">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 transition-colors hover:text-white"
          >
            <Arrow className="h-4 w-4" aria-hidden="true" />
            {dict.blog.title}
          </Link>

          <h1 className="mt-4 max-w-4xl text-[clamp(1.8rem,4.4vw,3rem)] font-extrabold text-white">
            {pick(article, "title", locale)}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/70">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              {dict.common.publishedOn} {formatDate(article.created_at, locale)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-4 w-4" aria-hidden="true" />
              {minutes} {dict.blog.readingTime}
            </span>
            {updated && (
              <span className="inline-flex items-center gap-1.5">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                {dict.blog.updatedOn} {formatDate(article.updated_at, locale)}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-china-red px-3 py-1 text-xs font-bold text-white">
              <Tag className="h-3 w-3" aria-hidden="true" />
              {dict.blog.categories[article.category] ?? article.category}
            </span>
          </div>
        </div>
      </section>

      <article className="container-page section-pad">
        <div className="mx-auto max-w-3xl">
          {!hasTranslation && locale !== "ar" && (
            <p className="mb-8 rounded-2xl border border-imperial-gold/40 bg-imperial-gold/10 px-5 py-3 text-sm font-semibold text-charcoal/80">
              {locale === "en"
                ? "This article has not been translated yet — showing the Arabic original."
                : "Эта статья ещё не переведена — показан арабский оригинал."}
            </p>
          )}

          {/* Table of contents — anchors were injected server-side above. */}
          {toc.length >= 3 && (
            <nav
              aria-label={dict.blog.tocTitle}
              className="mb-10 rounded-2xl border border-trust-blue/10 bg-white p-4 shadow-[var(--shadow-soft)] sm:p-5"
            >
              <p className="flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-trust-blue/60 uppercase">
                <ListTree className="h-4 w-4" aria-hidden="true" />
                {dict.blog.tocTitle}
              </p>
              <ol className="mt-3 grid max-h-72 gap-0.5 overflow-y-auto sm:grid-cols-2 sm:gap-x-6">
                {toc.map((entry, i) => (
                  <li key={entry.id}>
                    <a
                      href={`#${entry.id}`}
                      className="flex items-baseline gap-2.5 rounded-lg px-2 py-1.5 text-sm leading-snug font-semibold text-charcoal/75 transition-colors hover:bg-trust-blue/6 hover:text-trust-blue"
                    >
                      <span className="shrink-0 font-[family-name:var(--font-display)] text-xs font-extrabold text-imperial-gold">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {entry.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div
            className="rich-text text-[1.0625rem] leading-[1.9] text-charcoal/85"
            // eslint-disable-next-line react/no-danger -- audited: sanitizeRichText strips scripts and unsafe schemes server-side
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-white section-pad">
          <div className="container-page">
            <h2 className="text-2xl font-extrabold text-trust-blue">{dict.blog.relatedTitle}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal key={item.id} delay={index * 80}>
                  <ArticleCard article={item} locale={locale} dict={dict} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
