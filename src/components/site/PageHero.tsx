import SceneArt, { type SceneKey } from "@/components/art/SceneArt";

export default function PageHero({
  title,
  subtitle,
  scene = "shanghai",
}: {
  title: string;
  subtitle?: string;
  scene?: SceneKey;
}) {
  return (
    <section className="relative flex min-h-[22rem] items-end overflow-hidden bg-trust-blue-dark pt-28 pb-14">
      <div className="absolute inset-0">
        <div className="ken-burns h-full w-full">
          <SceneArt scene={scene} detail="full" className="h-full w-full object-cover" />
        </div>
      </div>
      <div className="animated-gradient absolute inset-0 bg-[linear-gradient(120deg,color-mix(in_srgb,var(--color-china-red)_52%,transparent)_0%,color-mix(in_srgb,var(--color-trust-blue-dark)_86%,transparent)_58%,rgba(4,10,24,0.92)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_0%,transparent_42%,rgba(4,10,24,0.5)_100%)]" />

      <div className="container-page relative">
        <h1 className="text-[clamp(2rem,5vw,3.4rem)] font-extrabold text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
          {title}
        </h1>
        <span className="mt-4 block h-1 w-28 rounded-full bg-gradient-to-r from-china-red via-imperial-gold to-white/70" />
        {subtitle && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ivory to-transparent" />
    </section>
  );
}
