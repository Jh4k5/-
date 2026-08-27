import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/data";
import { getSiteUrl } from "@/lib/site-url";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSettings();
  const base = getSiteUrl(settings);

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
