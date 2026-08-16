import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getArticles } from "@/lib/data";

const PAGES = [
  "",
  "/about",
  "/services",
  "/universities",
  "/admissions",
  "/why-china",
  "/stories",
  "/blog",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jisr-to-china.vercel.app";
  const articles = await getArticles();

  const staticEntries = locales.flatMap((locale) =>
    PAGES.map((page) => ({
      url: `${base}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: page === "" ? 1 : 0.7,
    })),
  );

  const articleEntries = locales.flatMap((locale) =>
    articles.map((article) => ({
      url: `${base}/${locale}/blog/${article.slug}`,
      lastModified: new Date(article.updated_at ?? article.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  );

  return [...staticEntries, ...articleEntries];
}
