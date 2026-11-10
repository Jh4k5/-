import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import {
  getArticles,
  getDestinations,
  getServices,
  getSettings,
  getStories,
  getStudyPaths,
  getUniversities,
} from "@/lib/data";
import { getSiteUrl } from "@/lib/site-url";

const PAGES = [
  "",
  "/about",
  "/services",
  "/study-paths",
  "/destinations",
  "/universities",
  "/admissions",
  "/why-china",
  "/stories",
  "/blog",
  "/faq",
  "/how-it-works",
  "/language-platform",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, articles, universities, services, studyPaths, destinations, stories] =
    await Promise.all([
      getSettings(),
      getArticles(),
      getUniversities(),
      getServices(),
      getStudyPaths(),
      getDestinations(),
      getStories(),
    ]);
  const base = getSiteUrl(settings);
  const now = new Date();

  // Static pages have no per-page timestamps in the database. Advertising
  // "right now" on every build tells crawlers every URL changed whenever the
  // site redeploys, which trains them to distrust lastModified. Instead,
  // date them from the newest content row across the fetched collections —
  // a defensible "the site's content last changed on" stamp — and only fall
  // back to now when there is no content at all.
  const contentTimestamps = [
    articles,
    universities,
    services,
    studyPaths,
    destinations,
    stories,
  ]
    .flat()
    .map((item) => item.updated_at ?? item.created_at)
    .filter((value): value is string => Boolean(value))
    .map((value) => new Date(value).getTime())
    .filter((time) => Number.isFinite(time));
  const lastContentChange = contentTimestamps.length
    ? new Date(Math.max(...contentTimestamps))
    : now;

  /** One entry per locale for a list of items that each carry a slug. */
  const entriesFor = <T extends { slug?: string; updated_at?: string | null; created_at?: string }>(
    prefix: string,
    items: T[],
    priority = 0.6,
  ) =>
    locales.flatMap((locale) =>
      items
        .filter((item) => item.slug)
        .map((item) => ({
          url: `${base}/${locale}${prefix}/${item.slug}`,
          lastModified: new Date(item.updated_at ?? item.created_at ?? now),
          changeFrequency: "monthly" as const,
          priority,
        })),
    );

  const staticEntries = locales.flatMap((locale) =>
    PAGES.map((page) => ({
      url: `${base}/${locale}${page}`,
      lastModified: page === "" ? now : lastContentChange,
      changeFrequency: "weekly" as const,
      priority: page === "" ? 1 : 0.7,
    })),
  );

  return [
    ...staticEntries,
    ...entriesFor("/blog", articles),
    ...entriesFor("/universities", universities),
    ...entriesFor("/services", services, 0.7),
    // Study paths are the highest-intent search terms we own.
    ...entriesFor("/study-paths", studyPaths, 0.8),
    ...entriesFor(
      "/destinations",
      destinations.filter((item) => item.category === "city"),
    ),
    // Placeholder stories stay on the site but are kept out of the index.
    ...entriesFor(
      "/stories",
      stories.filter((story) => !story.is_demo),
      0.5,
    ),
  ];
}
