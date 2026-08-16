import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, GraduationCap, MapPin, Trophy } from "lucide-react";
import MediaFrame from "@/components/ui/MediaFrame";
import type { Dictionary } from "@/i18n";
import { pick, type Locale } from "@/i18n/config";
import type { University } from "@/lib/types";

export function universityName(university: University, locale: Locale) {
  return pick(university, "name", locale) || university.name;
}

export function universityCity(university: University, locale: Locale) {
  return pick(university, "city", locale);
}

export function languageLabel(university: University, dict: Dictionary) {
  const key = university.programs_language ?? "en_zh";
  return dict.universities.languages[key] ?? dict.universities.languages.en_zh;
}

/** Card used by the home carousel and the universities grid. */
export default function UniversityCard({
  university,
  locale,
  dict,
  tall = false,
}: {
  university: University;
  locale: Locale;
  dict: Dictionary;
  tall?: boolean;
}) {
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const city = universityCity(university, locale);
  const description = pick(university, "description", locale);

  return (
    <article className="defer-offscreen group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[var(--shadow-card)] ring-1 ring-trust-blue/8">
      <div className={`relative overflow-hidden ${tall ? "h-56" : "h-44"}`}>
        <div className="absolute inset-0 transition-transform duration-[1400ms] group-hover:scale-110">
          <MediaFrame src={university.cover_media} alt={universityName(university, locale)} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-trust-blue-dark/90 via-trust-blue-dark/25 to-transparent" />

        {university.world_rank && (
          <span className="absolute top-4 inline-flex items-center gap-1.5 rounded-full bg-imperial-gold px-3 py-1 text-[11px] font-extrabold text-trust-blue-dark shadow-lg end-4">
            <Trophy className="h-3.5 w-3.5" />#{university.world_rank}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-5">
          {university.logo && (
            <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white/90 p-1">
              <MediaFrame src={university.logo} alt="" className="object-contain" />
            </span>
          )}
          <div className="min-w-0">
            <h3 className="truncate text-lg font-extrabold text-white" dir="auto">
              {universityName(university, locale)}
            </h3>
            {city && (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-white/75">
                <MapPin className="h-3 w-3" />
                {city}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-trust-blue/8 px-2.5 py-1 text-[11px] font-bold text-trust-blue">
            <GraduationCap className="h-3 w-3" />
            {languageLabel(university, dict)}
          </span>
          {university.founded_year && (
            <span className="inline-flex items-center gap-1 rounded-full bg-trust-blue/8 px-2.5 py-1 text-[11px] font-bold text-trust-blue">
              <Building2 className="h-3 w-3" />
              {university.founded_year}
            </span>
          )}
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-charcoal/70">{description}</p>

        <Link
          href={`/${locale}/universities/${university.slug}`}
          className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-bold text-china-red"
        >
          {dict.universities.exploreOne}
          <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
