"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import UniversityCard, { universityCity, universityName } from "./UniversityCard";
import Reveal from "@/components/motion/Reveal";
import type { Dictionary } from "@/i18n";
import { pick, type Locale } from "@/i18n/config";
import type { University } from "@/lib/types";

export default function UniversitiesExplorer({
  universities,
  locale,
  dict,
}: {
  universities: University[];
  locale: Locale;
  dict: Dictionary;
}) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");

  const cities = useMemo(() => {
    const set = new Set<string>();
    universities.forEach((university) => {
      const name = universityCity(university, locale);
      if (name) set.add(name);
    });
    return [...set];
  }, [universities, locale]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return universities.filter((university) => {
      if (city !== "all" && universityCity(university, locale) !== city) return false;
      if (!needle) return true;
      return `${universityName(university, locale)} ${university.name} ${universityCity(university, locale)} ${pick(university, "description", locale)}`
        .toLowerCase()
        .includes(needle);
    });
  }, [universities, query, city, locale]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCity("all")}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 ${
              city === "all"
                ? "bg-trust-blue text-white"
                : "bg-white text-trust-blue/70 hover:bg-trust-blue/8"
            }`}
          >
            {dict.universities.allCities}
          </button>
          {cities.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setCity(name)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 ${
                city === name
                  ? "bg-china-red text-white"
                  : "bg-white text-trust-blue/70 hover:bg-china-red/10"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        <label className="relative w-full lg:w-80">
          <Search className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40 start-4" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={dict.universities.searchPlaceholder}
            className="w-full rounded-full border border-trust-blue/12 bg-white py-3 text-sm outline-none transition-shadow duration-300 focus:border-china-red/40 focus:shadow-[0_0_0_4px_rgba(200,16,46,0.08)] ps-11 pe-4"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-charcoal/60">
          {universities.length === 0 ? dict.universities.empty : dict.common.noResults}
        </p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((university, index) => (
            <Reveal key={university.id} delay={index * 70} direction="scale">
              <UniversityCard university={university} locale={locale} dict={dict} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
