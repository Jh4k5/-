"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Banknote,
  BarChart3,
  FileText,
  GalleryHorizontal,
  Globe2,
  HelpCircle,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LayoutList,
  ListChecks,
  LogOut,
  Map,
  Menu,
  Palette,
  School,
  Settings,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { LogoMark } from "@/components/site/Logo";
import { createClient } from "@/lib/supabase/client";

const LINKS = [
  { href: "/admin", label: "لوحة القيادة", Icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "الطلبات الواردة", Icon: Inbox },
  { href: "/admin/analytics", label: "التحليلات", Icon: BarChart3 },
  { href: "/admin/admissions", label: "نماذج القبولات", Icon: BadgeCheck },
  { href: "/admin/universities", label: "الجامعات", Icon: School },
  { href: "/admin/articles", label: "المقالات", Icon: FileText },
  { href: "/admin/services", label: "الخدمات", Icon: Sparkles },
  { href: "/admin/cost-factors", label: "عوامل التكلفة", Icon: Banknote },
  { href: "/admin/process", label: "خطوات العمل معنا", Icon: ListChecks },
  { href: "/admin/why-china", label: "لماذا الصين؟", Icon: Globe2 },
  { href: "/admin/stories", label: "قصص النجاح", Icon: Star },
  { href: "/admin/faq", label: "الأسئلة الشائعة", Icon: HelpCircle },
  { href: "/admin/hero", label: "شرائح الهيدر", Icon: GalleryHorizontal },
  { href: "/admin/destinations", label: "معرض الوجهات", Icon: Map },
  { href: "/admin/gallery", label: "معرض الصور", Icon: ImageIcon },
  { href: "/admin/sections", label: "أقسام الصفحة", Icon: LayoutList },
  { href: "/admin/theme", label: "الهوية والحركة", Icon: Palette },
  { href: "/admin/settings", label: "إعدادات الموقع", Icon: Settings },
];

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Keep the page behind the drawer from scrolling on touch devices.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const current = LINKS.find((link) => isActive(link.href, link.exact));

  return (
    <>
      {/* mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center gap-3 border-b border-trust-blue/10 bg-ivory/95 px-4 backdrop-blur-xl lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-trust-blue text-white"
          aria-label="القائمة"
          aria-expanded={open}
        >
          <Menu className="h-5 w-5" />
        </button>
        <LogoMark className="h-9 w-9 shrink-0" />
        <span className="min-w-0 flex-1 truncate font-[family-name:var(--font-display)] text-base font-extrabold text-trust-blue">
          {current?.label ?? "لوحة التحكم"}
        </span>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        data-open={open}
        className="admin-drawer fixed inset-y-0 z-50 flex w-[17rem] max-w-[85vw] flex-col bg-trust-blue-dark p-4 start-0"
      >
        <div className="flex items-center justify-between gap-2">
          <Link href="/admin" className="flex min-w-0 items-center gap-2.5">
            <LogoMark className="h-10 w-10 shrink-0" />
            <span className="truncate font-[family-name:var(--font-display)] text-base font-extrabold text-white">
              لوحة التحكم
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white/70 hover:bg-white/10 lg:hidden"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-5 flex flex-1 flex-col gap-1 overflow-y-auto overscroll-contain pb-2">
          {LINKS.map(({ href, label, Icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={`flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-all duration-300 ${
                isActive(href, exact)
                  ? "bg-china-red text-white shadow-[0_12px_25px_-14px_var(--color-china-red)]"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              <span className="truncate">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-safe-bottom border-t border-white/10 pt-3">
          <p className="truncate px-1 text-xs text-white/45" dir="ltr">
            {email}
          </p>
          <div className="mt-2.5 flex gap-2">
            <Link
              href="/ar"
              target="_blank"
              className="flex min-h-11 flex-1 items-center justify-center rounded-xl bg-white/10 px-3 text-xs font-bold text-white transition-colors hover:bg-white/20"
            >
              عرض الموقع
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-china-red px-4 text-xs font-bold text-white transition-colors hover:bg-china-red-dark"
            >
              <LogOut className="h-4 w-4" />
              خروج
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
