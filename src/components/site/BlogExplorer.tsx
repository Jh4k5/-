"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ArticleCard from "./ArticleCard";
import Reveal from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n";
import { pick, type Locale } from "@/i18n/config";
import type { Article, ArticleCategory } from "@/lib/types";
import { plainExcerpt } from "@/lib/format";

const CATEGORIES: ArticleCategory[] = ["about_china", "universities", "student_life", "tips"];

export default function BlogExplorer({
  articles,
  locale,
  dict,
}: {
  articles: Article[];
  locale: Locale;
  dict: Dictionary;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ArticleCategory | "all">("all");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return articles.filter((article) => {
      if (category !== "all" && article.category !== category) return false;
      if (!needle) return true;
      const haystack = `${pick(article, "title", locale)} ${pick(article, "excerpt", locale)} ${plainExcerpt(
        pick(article, "content", locale),
        600,
      )}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [articles, category, locale, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 ${
              category === "all"
                ? "bg-trust-blue text-white"
                : "bg-white text-trust-blue/70 hover:bg-trust-blue/8"
            }`}
          >
            {dict.blog.allCategories}
          </button>
          {CATEGORIES.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 ${
                category === key
                  ? "bg-china-red text-white"
                  : "bg-white text-trust-blue/70 hover:bg-china-red/10"
              }`}
            >
              {dict.blog.categories[key]}
            </button>
          ))}
        </div>

        <label className="relative w-full lg:w-80">
          <Search className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40 start-4" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={dict.blog.searchPlaceholder}
            className="w-full rounded-full border border-trust-blue/12 bg-white py-3 text-sm outline-none transition-shadow duration-300 focus:border-china-red/40 focus:shadow-[0_0_0_4px_rgba(200,16,46,0.08)] ps-11 pe-4"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-charcoal/60">
          {articles.length === 0 ? dict.blog.empty : dict.common.noResults}
        </p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article, index) => (
            <Reveal key={article.id} delay={index * 60}>
              <ArticleCard article={article} locale={locale} dict={dict} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
