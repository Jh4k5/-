import Reveal from "@/components/ui/Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "dark",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "start";
  tone?: "dark" | "light";
}) {
  const alignment = align === "center" ? "mx-auto text-center items-center" : "text-start items-start";
  const titleColor = tone === "light" ? "text-white" : "text-trust-blue";
  const subColor = tone === "light" ? "text-white/75" : "text-charcoal/70";

  return (
    <Reveal className={`flex max-w-3xl flex-col gap-3 ${alignment}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full bg-china-red/10 px-4 py-1.5 text-xs font-bold tracking-widest text-china-red uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-imperial-gold" />
          {eyebrow}
        </span>
      )}
      <h2 className={`text-[clamp(1.9rem,4vw,3rem)] font-extrabold ${titleColor}`}>{title}</h2>
      <span className="h-1 w-24 rounded-full bg-gradient-to-r from-china-red via-imperial-gold to-trust-blue" />
      {subtitle && <p className={`text-base leading-relaxed sm:text-lg ${subColor}`}>{subtitle}</p>}
    </Reveal>
  );
}
