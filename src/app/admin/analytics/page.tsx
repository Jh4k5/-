import Link from "next/link";
import { AdminHeading, Card } from "@/components/admin/ui";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const EVENT_LABELS: Record<string, string> = {
  hero_primary_click: "نقر زر الهيرو الأساسي",
  whatsapp_click: "نقر واتساب",
  services_view: "مشاهدة قسم الخدمات",
  process_expand: "التفاعل مع خطوة عمل",
  eligibility_start: "بدء فحص الأهلية",
  eligibility_complete: "إتمام فحص الأهلية",
  form_start: "بدء تعبئة نموذج",
  form_error: "خطأ في نموذج",
  form_submit: "إرسال نموذج",
  admission_open: "فتح نموذج قبول",
  story_open: "فتح قصة نجاح",
  scroll_50: "وصول 50% من الصفحة",
  scroll_90: "وصول 90% من الصفحة",
};

type Row = {
  event_name: string;
  page_path: string;
  locale: string | null;
  device_type: string | null;
  created_at: string;
};

function countBy<T extends string>(rows: Row[], key: keyof Row): [T, number][] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const value = (row[key] as string | null) ?? "—";
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]) as [T, number][];
}

function AggregateTable({
  title,
  rows,
  labelFor,
}: {
  title: string;
  rows: [string, number][];
  labelFor?: (key: string) => string;
}) {
  return (
    <Card>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-charcoal/50">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-charcoal/50">لا توجد بيانات بعد.</p>
      ) : (
        <ul className="space-y-2">
          {rows.slice(0, 12).map(([key, count]) => (
            <li key={key} className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 truncate text-charcoal/75" dir="auto">
                {labelFor ? labelFor(key) : key}
              </span>
              <span className="shrink-0 rounded-full bg-trust-blue/8 px-2.5 py-0.5 text-xs font-bold text-trust-blue">
                {count}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: rawRange } = await searchParams;
  const days = rawRange === "7" ? 7 : 30;

  const since = new Date();
  since.setDate(since.getDate() - days);

  const supabase = await createServerSupabase();
  const { data, count } = await supabase
    .from("analytics_events")
    .select("event_name, page_path, locale, device_type, created_at", { count: "exact" })
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false })
    .limit(20000);

  const rows = (data ?? []) as Row[];

  return (
    <div>
      <AdminHeading
        title="التحليلات"
        subtitle="عدد الأحداث المسجّلة خلال الفترة المختارة، مجمّعة حسب النوع والصفحة واللغة والجهاز. لا يوجد أي بيانات شخصية هنا."
        action={
          <div className="inline-flex rounded-full border border-trust-blue/12 bg-white p-1">
            {(["7", "30"] as const).map((value) => (
              <Link
                key={value}
                href={`/admin/analytics?range=${value}`}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  String(days) === value
                    ? "bg-trust-blue text-white"
                    : "text-charcoal/60 hover:text-trust-blue"
                }`}
              >
                آخر {value} يوم
              </Link>
            ))}
          </div>
        }
      />

      <p className="mb-6 text-sm text-charcoal/55">
        إجمالي الأحداث خلال آخر {days} يوم: <span className="font-bold text-trust-blue">{count ?? rows.length}</span>
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        <AggregateTable
          title="حسب نوع الحدث"
          rows={countBy(rows, "event_name")}
          labelFor={(key) => EVENT_LABELS[key] ?? key}
        />
        <AggregateTable title="حسب الصفحة" rows={countBy(rows, "page_path")} />
        <AggregateTable
          title="حسب اللغة"
          rows={countBy(rows, "locale")}
          labelFor={(key) => ({ ar: "العربية", en: "English", ru: "Русский" }[key] ?? key)}
        />
        <AggregateTable
          title="حسب الجهاز"
          rows={countBy(rows, "device_type")}
          labelFor={(key) => ({ mobile: "جوال", tablet: "لوحي", desktop: "حاسوب" }[key] ?? key)}
        />
      </div>
    </div>
  );
}
