import KanjiWatermark from "@/components/art/KanjiWatermark";
import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import SectionHeading from "./SectionHeading";
import { iconFor } from "@/lib/icons";
import type { Dictionary } from "@/i18n";
import { pick, type Locale } from "@/i18n/config";
import type { StudyPath } from "@/lib/types";

export default function StudyPathsSection({
  paths,
  locale,
  dict,
  title,
  subtitle,
}: {
  paths: StudyPath[];
  locale: Locale;
  dict: Dictionary;
  title?: string;
  subtitle?: string;
}) {
  if (paths.length === 0) return null;

  return (
    <section className="surface-deep relative overflow-hidden section-pad">
      <KanjiWatermark char="path" className="top-6 end-6 hidden lg:block" />
      <div className="container-page relative">
      <SectionHeading
        title={title || dict.studyPaths.title}
        subtitle={subtitle || dict.studyPaths.subtitle}
      />

      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {paths.map((path) => {
          const Icon = iconFor(path.icon);
          return (
            <RevealItem key={path.id}>
              <Link
                href={`/${locale}/contact?stage=${path.path_key}#booking`}
                className="card-3d surface-card group flex h-full flex-col p-6"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-trust-blue/10 text-trust-blue transition-colors duration-300 group-hover:bg-china-red group-hover:text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-trust-blue">
                  {pick(path, "title", locale)}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/70">
                  {pick(path, "description", locale)}
                </p>
                <span className="mt-4 text-sm font-bold text-china-red">
                  {dict.studyPaths.cta}
                </span>
              </Link>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </div>
    </section>
  );
}
