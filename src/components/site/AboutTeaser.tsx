import KanjiWatermark from "@/components/art/KanjiWatermark";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "./SectionHeading";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { settingText, settingValue, type SettingsMapLike } from "@/lib/settings-helpers";

/** Short homepage teaser for "من نحن" — the full story lives on /about. */
export default function AboutTeaser({
  locale,
  dict,
  settings,
  title,
}: {
  locale: Locale;
  dict: Dictionary;
  settings: SettingsMapLike;
  title?: string;
}) {
  const storyText = settingText(settings, "about_story_text", locale, dict.about.storyText);
  const excerpt = storyText.split(/(?<=[.؟!])\s+/).slice(0, 2).join(" ");

  const ceoEnabled = settingValue(settings, "ceo_section_enabled") === "true";
  const ceoName = settingValue(settings, "ceo_name");
  const ceoPhoto = settingValue(settings, "ceo_photo");
  const ceoTitle = settingText(settings, "ceo_title", locale);
  const showCeo = ceoEnabled && Boolean(ceoName) && Boolean(ceoPhoto);

  return (
    <section className="surface-deep relative overflow-hidden py-20">
      <KanjiWatermark char="bridge" className="top-6 end-6 hidden lg:block" />
      <div className="container-page relative">
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeading eyebrow={dict.nav.about} title={title || dict.about.title} />
        <Reveal delay={80}>
          <p className="mt-6 text-base leading-relaxed text-charcoal/75">{excerpt}</p>
        </Reveal>

        {showCeo && (
          <Reveal delay={130}>
            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full">
                <Image src={ceoPhoto} alt={ceoName} fill sizes="48px" className="object-cover" />
              </div>
              <div className="text-start">
                <p className="text-sm font-extrabold text-trust-blue">{ceoName}</p>
                {ceoTitle && <p className="text-xs text-charcoal/60">{ceoTitle}</p>}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal delay={160}>
          <Link
            href={`/${locale}/about`}
            className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold text-china-red underline underline-offset-4"
          >
            {dict.common.readMore}
          </Link>
        </Reveal>
      </div>
    </div>
    </section>
  );
}
