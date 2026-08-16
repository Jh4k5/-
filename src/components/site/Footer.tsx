import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from "@/components/ui/BrandIcons";
import { LogoMark } from "./Logo";
import { getDictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { settingText, settingValue, type SettingsMapLike } from "@/lib/settings-helpers";

export default function Footer({
  locale,
  settings,
}: {
  locale: Locale;
  settings: SettingsMapLike;
}) {
  const dict = getDictionary(locale);
  const year = new Date().getFullYear();

  const links = [
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/services`, label: dict.nav.services },
    { href: `/${locale}/why-china`, label: dict.nav.whyChina },
    { href: `/${locale}/stories`, label: dict.nav.stories },
    { href: `/${locale}/blog`, label: dict.nav.blog },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  const socials = [
    { href: settingValue(settings, "facebook_url"), Icon: FacebookIcon, label: "Facebook" },
    { href: settingValue(settings, "instagram_url"), Icon: InstagramIcon, label: "Instagram" },
    { href: settingValue(settings, "youtube_url"), Icon: YoutubeIcon, label: "YouTube" },
    { href: settingValue(settings, "tiktok_url"), Icon: TiktokIcon, label: "TikTok" },
  ].filter((item) => item.href);

  const email = settingValue(settings, "contact_email", "info@bridgetochina.com");
  const phone = settingValue(settings, "contact_phone", "+86 138 0000 0000");
  const location = settingText(settings, "office_location", locale, "China");

  return (
    <footer className="relative mt-24 overflow-hidden bg-trust-blue-dark text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, #d4af37 0, transparent 45%), radial-gradient(circle at 85% 80%, #c8102e 0, transparent 45%)",
        }}
      />
      <div className="container-page relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <LogoMark className="h-12 w-12" />
            <div>
              <p className="font-[family-name:var(--font-display)] text-xl font-extrabold">
                {dict.meta.siteName}
              </p>
              <p className="text-xs tracking-[0.2em] text-white/60">{dict.meta.siteNameChinese}</p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">{dict.footer.about}</p>
          <p className="mt-5 text-sm font-semibold text-imperial-gold">
            {settingText(settings, "footer_note", locale, dict.footer.builtWith)}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-imperial-gold">
            {dict.footer.quickLinks}
          </h3>
          <ul className="mt-5 space-y-2.5">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-imperial-gold">
            {dict.footer.contactTitle}
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-china-red" />
              <a href={`mailto:${email}`} className="hover:text-white" dir="ltr">
                {email}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-china-red" />
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-white" dir="ltr">
                {phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 shrink-0 text-china-red" />
              <span>{location}</span>
            </li>
          </ul>

          {socials.length > 0 && (
            <div className="mt-5 flex gap-2">
              {socials.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 transition-all duration-300 hover:-translate-y-0.5 hover:border-imperial-gold hover:text-imperial-gold"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/55 sm:flex-row">
          <p>
            © {year} {dict.meta.siteName} — {dict.footer.rights}
          </p>
          <Link href="/admin/login" className="transition-colors hover:text-white/85">
            {dict.footer.adminLink}
          </Link>
        </div>
      </div>
    </footer>
  );
}
