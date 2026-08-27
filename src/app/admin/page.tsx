import Link from "next/link";
import { BadgeCheck, FileText, Inbox, School } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import type { Lead } from "@/lib/types";

export const dynamic = "force-dynamic";

const LEAD_STATUS_LABEL: Record<string, string> = {
  new: "جديد",
  contacted: "تم التواصل",
  completed: "مكتمل",
};

export default async function AdminDashboard() {
  const supabase = await createServerSupabase();

  const [newLeads, allLeads, articles, published, admissions, universities, latest] =
    await Promise.all([
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase.from("articles").select("id", { count: "exact", head: true }),
      supabase
        .from("articles")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),
      supabase.from("admissions").select("id", { count: "exact", head: true }),
      supabase.from("universities").select("id", { count: "exact", head: true }),
      supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

  const cards = [
    {
      label: "طلبات جديدة",
      value: newLeads.count ?? 0,
      hint: `من إجمالي ${allLeads.count ?? 0} طلب`,
      href: "/admin/leads",
      Icon: Inbox,
      accent: "from-china-red to-china-red-dark",
    },
    {
      label: "المقالات",
      value: articles.count ?? 0,
      hint: `${published.count ?? 0} منشور`,
      href: "/admin/articles",
      Icon: FileText,
      accent: "from-trust-blue to-trust-blue-light",
    },
    {
      label: "نماذج القبولات",
      value: admissions.count ?? 0,
      hint: "شريط القبولات في الرئيسية",
      href: "/admin/admissions",
      Icon: BadgeCheck,
      accent: "from-imperial-gold to-[#b8952c]",
    },
    {
      label: "الجامعات",
      value: universities.count ?? 0,
      hint: "بطاقات وصفحات الجامعات",
      href: "/admin/universities",
      Icon: School,
      accent: "from-jade to-[#007954]",
    },
  ];

  const recent = (latest.data ?? []) as Lead[];

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-trust-blue">لوحة القيادة</h1>
      <p className="mt-1.5 text-sm text-charcoal/60">
        ملخص سريع لحالة المنصة وآخر الطلبات الواردة من نموذج التواصل.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, hint, href, Icon, accent }) => (
          <Link key={label} href={href} className="surface-card group p-6 transition-transform duration-300 hover:-translate-y-1">
            <span
              className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-4 font-[family-name:var(--font-display)] text-3xl font-extrabold text-trust-blue">
              {value}
            </p>
            <p className="text-sm font-bold text-charcoal/70">{label}</p>
            <p className="mt-1 text-xs text-charcoal/45">{hint}</p>
          </Link>
        ))}
      </div>

      <div className="surface-card mt-8 overflow-hidden">
        <div className="flex items-center justify-between border-b border-trust-blue/8 px-6 py-4">
          <h2 className="text-lg font-extrabold text-trust-blue">آخر الطلبات</h2>
          <Link href="/admin/leads" className="text-sm font-bold text-china-red hover:underline">
            عرض الكل
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-charcoal/55">
            لا توجد طلبات بعد. ستظهر هنا فور إرسال أول نموذج تواصل.
          </p>
        ) : (
          <ul className="divide-y divide-trust-blue/6">
            {recent.map((lead) => (
              <li key={lead.id} className="flex flex-wrap items-center gap-3 px-5 py-4 sm:px-6">
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold text-trust-blue">{lead.full_name}</span>
                  <span className="block truncate text-xs text-charcoal/55">
                    {lead.country} · <span dir="ltr">{lead.phone}</span> ·{" "}
                    {lead.language.toUpperCase()}
                  </span>
                </span>

                <span className="shrink-0 text-xs text-charcoal/55">
                  {formatDate(lead.created_at, "ar")}
                </span>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                    lead.status === "new"
                      ? "bg-china-red/10 text-china-red"
                      : lead.status === "contacted"
                        ? "bg-imperial-gold/20 text-[#6b5410]"
                        : "bg-jade/10 text-jade"
                  }`}
                >
                  {LEAD_STATUS_LABEL[lead.status] ?? lead.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
