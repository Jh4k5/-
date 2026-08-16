import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Tag } from "lucide-react";
import MediaFrame from "@/components/ui/MediaFrame";
import ArticleCard from "@/components/site/ArticleCard";
import Reveal from "@/components/motion/Reveal";
import { getDictionary } from "@/i18n";
import { isLocale, pick, type Locale } from "@/i18n/config";
import { getArticleBySlug, getArticles } from "@/lib/data";
import { formatDate, plainExcerpt } from "@/lib/format";

export const revalidate = 60;

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
  return {
    title,
    description:
      pick(article, "excerpt", locale) || plainExcerpt(pick(article, "content", locale), 155),
    openGraph: { title, type: "article" },
  };
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
  const content = pick(article, "content", locale);
  const localized =
    locale === "ar" ? article.content_ar : locale === "en" ? article.content_en : article.content_ru;
  const hasTranslation = Boolean(localized && localized.trim());

  return (
    <>
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
            <Arrow className="h-4 w-4" />
            {dict.blog.title}
          </Link>

          <h1 className="mt-4 max-w-4xl text-[clamp(1.8rem,4.4vw,3rem)] font-extrabold text-white">
            {pick(article, "title", locale)}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/70">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {dict.common.publishedOn} {formatDate(article.created_at, locale)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-china-red px-3 py-1 text-xs font-bold text-white">
              <Tag className="h-3 w-3" />
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
