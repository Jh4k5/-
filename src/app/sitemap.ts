import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getArticles, getUniversities } from "@/lib/data";

const PAGES = [
  "",
  "/about",
  "/services",
  "/universities",
  "/admissions",
  "/why-china",
  "/stories",
  "/blog",
  "/how-it-works",
  "/language-platform",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jisr-to-china.vercel.app";
  const [articles, universities] = await Promise.all([getArticles(), getUniversities()]);

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

  const universityEntries = locales.flatMap((locale) =>
    universities.map((university) => ({
      url: `${base}/${locale}/universities/${university.slug}`,
      lastModified: new Date(university.updated_at ?? university.created_at ?? Date.now()),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  );

  return [...staticEntries, ...articleEntries, ...universityEntries];
}
