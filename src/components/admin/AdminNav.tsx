"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
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
  { href: "/admin/articles", label: "المقالات", Icon: FileText },
  { href: "/admin/services", label: "الخدمات", Icon: Sparkles },
  { href: "/admin/stories", label: "قصص النجاح", Icon: Star },
  { href: "/admin/destinations", label: "معرض الوجهات", Icon: Map },
  { href: "/admin/gallery", label: "معرض الصور", Icon: ImageIcon },
  { href: "/admin/settings", label: "إعدادات الموقع", Icon: Settings },
];

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const nav = (
    <nav className="flex flex-col gap-1">
      {LINKS.map(({ href, label, Icon, exact }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
            isActive(href, exact)
              ? "bg-china-red text-white shadow-[0_12px_25px_-14px_rgba(200,16,46,1)]"
              : "text-white/70 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Icon className="h-4.5 w-4.5" />
          {label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed top-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-trust-blue text-white shadow-lg lg:hidden start-4"
        aria-label="القائمة"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 z-50 flex w-72 flex-col bg-trust-blue-dark p-5 transition-transform duration-300 start-0 lg:translate-x-0 ${
          open ? "translate-x-0" : "translate-x-full lg:translate-x-0 rtl:-translate-x-full rtl:lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <LogoMark className="h-10 w-10" />
            <span className="font-[family-name:var(--font-display)] text-base font-extrabold text-white">
              لوحة التحكم
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-white/60 lg:hidden"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-7 flex-1 overflow-y-auto">{nav}</div>

        <div className="border-t border-white/10 pt-4">
          <p className="truncate px-2 text-xs text-white/45" dir="ltr">
            {email}
          </p>
          <div className="mt-3 flex gap-2">
            <Link
              href="/ar"
              target="_blank"
              className="flex-1 rounded-xl bg-white/10 px-3 py-2.5 text-center text-xs font-bold text-white transition-colors hover:bg-white/20"
            >
              عرض الموقع
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-xl bg-china-red px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-china-red-dark"
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
