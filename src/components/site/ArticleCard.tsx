import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Star } from "lucide-react";
import MediaFrame from "@/components/ui/MediaFrame";
import Tilt3D from "@/components/motion/Tilt3D";
import type { Dictionary } from "@/i18n";
import { pick, type Locale } from "@/i18n/config";
import type { Article } from "@/lib/types";
import { formatDate, plainExcerpt } from "@/lib/format";

export default function ArticleCard({
  article,
  locale,
  dict,
}: {
  article: Article;
  locale: Locale;
  dict: Dictionary;
}) {
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const excerpt =
    pick(article, "excerpt", locale) || plainExcerpt(pick(article, "content", locale), 150);

  return (
    <Tilt3D intensity={5} className="h-full">
      <article className="card-3d defer-offscreen surface-card group flex h-full flex-col overflow-hidden">
        <Link href={`/${locale}/blog/${article.slug}`} className="relative block h-48 overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-[1200ms] group-hover:scale-110">
            <MediaFrame src={article.cover_image} alt={pick(article, "title", locale)} />
          </div>
          <span className="absolute top-4 rounded-full bg-china-red px-3 py-1 text-[0.6875rem] font-bold text-white start-4">
            {dict.blog.categories[article.category] ?? article.category}
          </span>
          {article.is_featured && (
            <span className="absolute top-4 inline-flex items-center gap-1 rounded-full bg-imperial-gold px-3 py-1 text-[0.6875rem] font-extrabold text-trust-blue-dark shadow-lg end-4">
              <Star className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          )}
        </Link>

        <div className="flex flex-1 flex-col p-6">
          <p className="flex items-center gap-1.5 text-xs text-charcoal/55">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDate(article.created_at, locale)}
          </p>

          <h3 className="mt-2 text-lg font-extrabold text-trust-blue transition-colors group-hover:text-china-red">
            <Link href={`/${locale}/blog/${article.slug}`}>{pick(article, "title", locale)}</Link>
          </h3>

          <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-charcoal/70">{excerpt}</p>

          <Link
            href={`/${locale}/blog/${article.slug}`}
            className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-bold text-china-red"
          >
            {dict.common.readMore}
            <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </article>
    </Tilt3D>
  );
}
