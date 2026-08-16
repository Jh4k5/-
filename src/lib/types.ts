export type ArticleCategory = "about_china" | "universities" | "student_life" | "tips";
export type ArticleStatus = "draft" | "published";
export type DestinationCategory = "city" | "campus" | "hero";
export type Qualification = "high_school" | "bachelor" | "master";
export type ChineseLevel = "none" | "beginner" | "hsk1_2" | "hsk3_4" | "hsk5_6";
export type PreferredContact = "whatsapp" | "email" | "phone";
export type LeadStatus = "new" | "contacted" | "completed";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
  created_at: string;
}

export interface Article {
  id: string;
  slug: string;
  title_ar: string;
  title_en: string | null;
  title_ru: string | null;
  excerpt_ar: string | null;
  excerpt_en: string | null;
  excerpt_ru: string | null;
  content_ar: string;
  content_en: string | null;
  content_ru: string | null;
  cover_image: string | null;
  category: ArticleCategory;
  status: ArticleStatus;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title_ar: string;
  title_en: string | null;
  title_ru: string | null;
  description_ar: string;
  description_en: string | null;
  description_ru: string | null;
  icon: string;
  display_order: number;
  created_at?: string;
}

/** Same shape as Service — the admin-editable "how we work" timeline. */
export interface ProcessStep {
  id: string;
  title_ar: string;
  title_en: string | null;
  title_ru: string | null;
  description_ar: string;
  description_en: string | null;
  description_ru: string | null;
  icon: string;
  display_order: number;
  created_at?: string;
}

export interface SuccessStory {
  id: string;
  student_name: string;
  photo: string | null;
  university_name: string | null;
  country: string | null;
  achievement_ar: string;
  achievement_en: string | null;
  achievement_ru: string | null;
  quote_ar: string | null;
  quote_en: string | null;
  quote_ru: string | null;
  display_order: number;
  created_at?: string;
}

export interface GalleryItem {
  id: string;
  image_url: string;
  media_type?: "image" | "video" | "scene";
  poster?: string | null;
  caption_ar: string | null;
  caption_en: string | null;
  caption_ru: string | null;
  display_order: number;
  created_at?: string;
}

export interface DestinationMedia {
  id: string;
  image_url: string;
  media_type?: "image" | "video" | "scene";
  poster?: string | null;
  category: DestinationCategory;
  title_ar: string;
  title_en: string | null;
  title_ru: string | null;
  display_order: number;
  is_featured: boolean;
  created_at?: string;
}

export interface Lead {
  id: string;
  full_name: string;
  country: string;
  current_qualification: Qualification;
  desired_major: string | null;
  chinese_level: ChineseLevel | null;
  preferred_contact: PreferredContact;
  phone: string;
  email: string | null;
  message: string | null;
  language: "ar" | "en" | "ru";
  status: LeadStatus;
  created_at: string;
}

export interface SettingRow {
  key: string;
  value: string | null;
  value_ar: string | null;
  value_en: string | null;
  value_ru: string | null;
  updated_at?: string;
}

export type SettingsMap = Record<string, SettingRow>;

export type MediaType = "image" | "video" | "scene";
export type ProgramsLanguage = "en" | "zh" | "en_zh";

export interface University {
  id: string;
  slug: string;
  name: string;
  name_ar: string | null;
  name_en: string | null;
  name_ru: string | null;
  city_ar: string | null;
  city_en: string | null;
  city_ru: string | null;
  logo: string | null;
  cover_media: string | null;
  gallery: string[];
  description_ar: string;
  description_en: string | null;
  description_ru: string | null;
  highlights_ar: string | null;
  highlights_en: string | null;
  highlights_ru: string | null;
  world_rank: number | null;
  founded_year: number | null;
  students_count: number | null;
  international_students: number | null;
  programs_language: ProgramsLanguage | null;
  tuition_range: string | null;
  is_featured: boolean;
  display_order: number;
  created_at?: string;
}

export interface BlurBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Admission {
  id: string;
  image_url: string;
  university_name: string | null;
  major_ar: string | null;
  major_en: string | null;
  major_ru: string | null;
  year: number | null;
  blur_enabled: boolean;
  blur_box: BlurBox;
  display_order: number;
  is_visible: boolean;
  created_at?: string;
}

export type SectionKey =
  | "process"
  | "stats"
  | "admissions"
  | "universities"
  | "destinations"
  | "services"
  | "why_china"
  | "stories"
  | "blog"
  | "final_cta";

export interface SiteSection {
  key: SectionKey;
  is_visible: boolean;
  display_order: number;
  title_ar: string | null;
  title_en: string | null;
  title_ru: string | null;
  subtitle_ar: string | null;
  subtitle_en: string | null;
  subtitle_ru: string | null;
}

export type MotionIntensity = "calm" | "balanced" | "cinematic";
