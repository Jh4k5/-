import {
  Award,
  BookOpenCheck,
  Briefcase,
  Building2,
  FileCheck2,
  GraduationCap,
  Globe2,
  Headphones,
  Home,
  Languages,
  MessagesSquare,
  Plane,
  PlaneLanding,
  ShieldCheck,
  Sparkles,
  Stamp,
  type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  "graduation-cap": GraduationCap,
  languages: Languages,
  award: Award,
  "book-open-check": BookOpenCheck,
  "messages-square": MessagesSquare,
  "plane-landing": PlaneLanding,
  plane: Plane,
  "file-check": FileCheck2,
  stamp: Stamp,
  building: Building2,
  globe: Globe2,
  headphones: Headphones,
  home: Home,
  shield: ShieldCheck,
  sparkles: Sparkles,
  briefcase: Briefcase,
};

export const ICON_KEYS = Object.keys(ICONS);

export function iconFor(name: string | null | undefined): LucideIcon {
  return (name && ICONS[name]) || GraduationCap;
}
