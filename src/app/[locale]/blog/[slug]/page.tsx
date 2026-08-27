import { sanitizeRichText } from "@/lib/sanitize";
import JsonLd from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Tag } from "lucide-react";
import MediaFrame from "@/components/ui/MediaFrame";
import ArticleCard from "@/components/site/ArticleCard";
import Reveal from "@/components/motion/Reveal";
import { getDictionary } from "@/i18n";
import { isLocale, pick, type Locale } from "@/i18n/config";
import { getArticleBySlug, getArticles, getSettings } from "@/lib/data";
import { formatDate, plainExcerpt } from "@/lib/format";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 60;

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
  if (!article) return { title: "404" };

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

  const all = await getArticles(4);
  const related = all.filter((item) => item.id !== article.id).slice(0, 3);
  // Stored article HTML is cleaned on the server before it is ever injected.
  const content = sanitizeRichText(pick(article, "content", locale));
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

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/70">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              {dict.common.publishedOn} {formatDate(article.created_at, locale)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-china-red px-3 py-1 text-xs font-bold text-white">
              <Tag className="h-3 w-3" aria-hidden="true" />
              {dict.blog.categories[article.category] ?? article.category}
            </span>
          </div>
        </div>
      </section>

      <article className="container-page py-16">
        <div className="mx-auto max-w-3xl">
          {!hasTranslation && locale !== "ar" && (
            <p className="mb-8 rounded-2xl border border-imperial-gold/40 bg-imperial-gold/10 px-5 py-3 text-sm font-semibold text-charcoal/80">
              {locale === "en"
                ? "This article has not been translated yet — showing the Arabic original."
                : "Эта статья ещё не переведена — показан арабский оригинал."}
            </p>
          )}

          <div
            className="rich-text text-[17px] leading-[1.9] text-charcoal/85"
            // eslint-disable-next-line react/no-danger -- audited: sanitizeRichText strips scripts and unsafe schemes server-side
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-white py-16">
          <div className="container-page">
            <h2 className="text-2xl font-extrabold text-trust-blue">{dict.blog.relatedTitle}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
