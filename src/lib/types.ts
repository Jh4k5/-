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

export interface SuccessStory {
  id: string;
  student_name: string;
  photo: string | null;
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
  caption_ar: string | null;
  caption_en: string | null;
  caption_ru: string | null;
  display_order: number;
  created_at?: string;
}

export interface DestinationMedia {
  id: string;
  image_url: string;
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
