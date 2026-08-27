import Reveal from "@/components/motion/Reveal";

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
        <span className="seal-chip">{eyebrow}</span>
      )}
      <h2 className={`text-fluid-h2 font-extrabold ${titleColor}`}>{title}</h2>
      <span className="brand-rule" aria-hidden="true" />
      {subtitle && <p className={`text-base leading-relaxed sm:text-lg ${subColor}`}>{subtitle}</p>}
    </Reveal>
  );
}
