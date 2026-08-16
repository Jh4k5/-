import { createPublicSupabase } from "./supabase/server";
import {
  DEFAULT_SECTIONS,
  SEED_DESTINATIONS,
  SEED_SERVICES,
  SEED_SETTINGS,
  SEED_STORIES,
  SEED_UNIVERSITIES,
} from "./seed-content";
import type {
  Admission,
  Article,
  DestinationMedia,
  GalleryItem,
  Service,
  SettingRow,
  SettingsMap,
  SiteSection,
  SuccessStory,
  University,
} from "./types";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export async function getServices(): Promise<Service[]> {
  return safe(async () => {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order", { ascending: true });
    if (error || !data || data.length === 0) return SEED_SERVICES;
    return data as Service[];
  }, SEED_SERVICES);
}

export async function getDestinations(): Promise<DestinationMedia[]> {
  return safe(async () => {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("destination_media")
      .select("*")
      .order("display_order", { ascending: true });
    if (error || !data || data.length === 0) return SEED_DESTINATIONS;
    return data as DestinationMedia[];
  }, SEED_DESTINATIONS);
}

export async function getHeroSlides(): Promise<DestinationMedia[]> {
  const all = await getDestinations();
  const featured = all.filter((d) => d.is_featured || d.category === "hero");
  return featured.length > 0 ? featured : all.slice(0, 3);
}

export async function getStories(limit?: number): Promise<SuccessStory[]> {
  const rows = await safe(async () => {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("success_stories")
      .select("*")
      .order("display_order", { ascending: true });
    if (error || !data || data.length === 0) return SEED_STORIES;
    return data as SuccessStory[];
  }, SEED_STORIES);
  return typeof limit === "number" ? rows.slice(0, limit) : rows;
}

export async function getArticles(limit?: number): Promise<Article[]> {
  return safe(async () => {
    const supabase = createPublicSupabase();
    let query = supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });
    if (typeof limit === "number") query = query.limit(limit);
    const { data, error } = await query;
    if (error || !data) return [];
    return data as Article[];
  }, []);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return safe(async () => {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (error || !data) return null;
    return data as Article;
  }, null);
}

export async function getGallery(): Promise<GalleryItem[]> {
  return safe(async () => {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("display_order", { ascending: true });
    if (error || !data) return [];
    return data as GalleryItem[];
  }, []);
}

export async function getSettings(): Promise<SettingsMap> {
  const rows = await safe(async () => {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase.from("settings").select("*");
    if (error || !data || data.length === 0) return SEED_SETTINGS;
    return data as SettingRow[];
  }, SEED_SETTINGS);

  const map: SettingsMap = {};
  for (const row of SEED_SETTINGS) map[row.key] = row;
  for (const row of rows) map[row.key] = { ...map[row.key], ...row };
  return map;
}

export { settingValue, settingText, settingNumber, whatsappLink } from "./settings-helpers";

export async function getUniversities(): Promise<University[]> {
  return safe(async () => {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("universities")
      .select("*")
      .order("display_order", { ascending: true });
    if (error || !data || data.length === 0) return SEED_UNIVERSITIES;
    return data as University[];
  }, SEED_UNIVERSITIES);
}

export async function getFeaturedUniversities(limit = 4): Promise<University[]> {
  const all = await getUniversities();
  const featured = all.filter((item) => item.is_featured);
  return (featured.length > 0 ? featured : all).slice(0, limit);
}

export async function getUniversityBySlug(slug: string): Promise<University | null> {
  const all = await getUniversities();
  return all.find((item) => item.slug === slug) ?? null;
}

export async function getAdmissions(): Promise<Admission[]> {
  return safe(async () => {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("admissions")
      .select("*")
      .eq("is_visible", true)
      .order("display_order", { ascending: true });
    if (error || !data) return [];
    return data as Admission[];
  }, []);
}

/** Home page sections, ordered and filtered by what the dashboard enables. */
export async function getSections(): Promise<SiteSection[]> {
  const rows = await safe(async () => {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("site_sections")
      .select("*")
      .order("display_order", { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_SECTIONS;
    return data as SiteSection[];
  }, DEFAULT_SECTIONS);

  const known = new Map(rows.map((row) => [row.key, row]));
  for (const fallback of DEFAULT_SECTIONS) {
    if (!known.has(fallback.key)) known.set(fallback.key, fallback);
  }

  return [...known.values()]
    .filter((row) => row.is_visible)
    .sort((a, b) => a.display_order - b.display_order);
}
