import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from "@/components/ui/BrandIcons";
import PageHero from "@/components/site/PageHero";
import ContactFormSwitcher from "@/components/site/ContactFormSwitcher";
import TrackedWhatsAppLink from "@/components/site/TrackedWhatsAppLink";
import Reveal from "@/components/motion/Reveal";
import { getDictionary } from "@/i18n";
import { isLocale, type Locale } from "@/i18n/config";
import { getSettings } from "@/lib/data";
import { settingText, settingValue, whatsappLink } from "@/lib/settings-helpers";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "ar");
  return { title: dict.contact.title, description: dict.contact.subtitle };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);
  const settings = await getSettings();

  const whatsapp = whatsappLink(settings, dict.meta.tagline);
  const email = settingValue(settings, "contact_email", "info@bridgetochina.com");
  const phone = settingValue(settings, "contact_phone", "+86 138 0000 0000");
  const location = settingText(settings, "office_location", locale, "China");

  const socials = [
    {
      href: settingValue(settings, "facebook_url"),
      status: settingValue(settings, "facebook_status", "hidden"),
      Icon: FacebookIcon,
      label: "Facebook",
    },
    {
      href: settingValue(settings, "instagram_url"),
      status: settingValue(settings, "instagram_status", "hidden"),
      Icon: InstagramIcon,
      label: "Instagram",
    },
    {
      href: settingValue(settings, "youtube_url"),
      status: settingValue(settings, "youtube_status", "hidden"),
      Icon: YoutubeIcon,
      label: "YouTube",
    },
    {
      href: settingValue(settings, "tiktok_url"),
      status: settingValue(settings, "tiktok_status", "hidden"),
      Icon: TiktokIcon,
      label: "TikTok",
    },
  ].filter((item) => item.status === "active" && item.href);

  return (
    <>
      <PageHero title={dict.contact.title} subtitle={dict.contact.subtitle} scene="guangzhou" />

      <section className="container-page py-16">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <Reveal>
            <ContactFormSwitcher locale={locale} dict={dict} settings={settings} whatsapp={whatsapp} />
          </Reveal>

          <Reveal delay={120}>
            <aside className="flex h-full flex-col gap-5">
              <div className="surface-card p-7">
                <h2 className="text-xl font-extrabold text-trust-blue">{dict.contact.infoTitle}</h2>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                  {dict.contact.infoText}
                </p>

                <TrackedWhatsAppLink
                  href={whatsapp}
                  locale={locale}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-jade px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#008a60]"
                >
                  <MessageCircle className="h-5 w-5" />
                  {dict.finalCta.whatsapp}
                </TrackedWhatsAppLink>

                <ul className="mt-6 space-y-3.5 text-sm">
                  <li className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-china-red/10 text-china-red">
                      <Mail className="h-4 w-4" />
                    </span>
                    <a href={`mailto:${email}`} dir="ltr" className="hover:text-china-red">
                      {email}
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-china-red/10 text-china-red">
                      <Phone className="h-4 w-4" />
                    </span>
                    <a href={`tel:${phone.replace(/\s/g, "")}`} dir="ltr" className="hover:text-china-red">
                      {phone}
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-china-red/10 text-china-red">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <span>{location}</span>
                  </li>
                </ul>
              </div>

              {socials.length > 0 && (
                <div className="surface-card p-7">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-charcoal/50">
                    {dict.contact.followUs}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {socials.map(({ href, Icon, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-trust-blue/8 text-trust-blue transition-all duration-300 hover:-translate-y-0.5 hover:bg-trust-blue hover:text-white"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="relative overflow-hidden rounded-2xl bg-trust-blue p-7 text-white">
                <div
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 80% 20%, #d4af37 0, transparent 50%), radial-gradient(circle at 10% 90%, #c8102e 0, transparent 45%)",
                  }}
                />
                <p className="relative font-[family-name:var(--font-display)] text-lg font-extrabold">
                  {dict.meta.siteName}
                </p>
                <p className="relative mt-2 text-sm text-white/75">{dict.meta.tagline}</p>
                <p className="relative mt-4 text-xs tracking-[0.25em] text-imperial-gold">
                  {dict.meta.siteNameChinese}
                </p>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>
    </>
  );
}
