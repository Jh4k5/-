"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Eye, EyeOff, Save } from "lucide-react";
import { AdminHeading, Button, Card, Field, LangTabs, StatusNote, inputClass } from "./ui";
import { createClient } from "@/lib/supabase/client";
import type { SiteSection } from "@/lib/types";

const LABELS: Record<string, { title: string; hint: string }> = {
  process: { title: "خطوات العمل معنا", hint: "شريط الثقة والخط الزمني لخطوات الرحلة مع الطالب" },
  stats: { title: "شريط الإحصائيات", hint: "الأرقام المتحركة أسفل الواجهة" },
  admissions: { title: "نماذج القبولات", hint: "الشريط المتحرك لصور القبولات" },
  universities: { title: "الجامعات", hint: "العرض ثلاثي الأبعاد للجامعات المميّزة" },
  destinations: { title: "استكشف الصين معنا", hint: "معرض المدن والحرم الجامعي" },
  services: { title: "الخدمات", hint: "بطاقات الخدمات الست" },
  why_china: { title: "لماذا الصين؟", hint: "نقاط التميّز وشريط أسماء الجامعات" },
  stories: { title: "قصص النجاح", hint: "بطاقات قصص الطلاب" },
  blog: { title: "المدونة", hint: "أحدث المقالات" },
  faq: { title: "الأسئلة الشائعة", hint: "الأسئلة والأجوبة المعروضة قبل قسم التواصل" },
  final_cta: { title: "دعوة التواصل", hint: "القسم الأخير قبل الفوتر" },
};

export default function SectionsEditor({ initial }: { initial: SiteSection[] }) {
  const [rows, setRows] = useState(
    [...initial].sort((a, b) => a.display_order - b.display_order),
  );
  const [open, setOpen] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const patch = (key: string, field: keyof SiteSection, value: unknown) =>
    setRows((current) =>
      current.map((row) => (row.key === key ? ({ ...row, [field]: value } as SiteSection) : row)),
    );

  const move = (index: number, delta: number) => {
    setRows((current) => {
      const next = [...current];
      const target = index + delta;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((row, i) => ({ ...row, display_order: i + 1 }));
    });
  };

  async function saveAll() {
    setSaving(true);
    setNote(null);

    const supabase = createClient();
    const payload = rows.map((row, index) => ({
      key: row.key,
      is_visible: row.is_visible,
      display_order: index + 1,
      title_ar: row.title_ar || null,
      title_en: row.title_en || null,
      title_ru: row.title_ru || null,
      subtitle_ar: row.subtitle_ar || null,
      subtitle_en: row.subtitle_en || null,
      subtitle_ru: row.subtitle_ru || null,
      eyebrow_ar: row.eyebrow_ar || null,
      eyebrow_en: row.eyebrow_en || null,
      eyebrow_ru: row.eyebrow_ru || null,
      cta_label_ar: row.cta_label_ar || null,
      cta_label_en: row.cta_label_en || null,
      cta_label_ru: row.cta_label_ru || null,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("site_sections").upsert(payload, { onConflict: "key" });

    setSaving(false);
    setNote(
      error
        ? { type: "error", text: "تعذّر حفظ ترتيب الأقسام." }
        : { type: "ok", text: "تم حفظ الأقسام. حدّث الصفحة الرئيسية لرؤية النتيجة." },
    );
  }

  return (
    <div>
      <AdminHeading
        title="أقسام الصفحة الرئيسية"
        subtitle="تحكّم في ظهور كل قسم وترتيبه، وعدّل عنوانه ووصفه بثلاث لغات. اترك الحقل فارغاً لاستخدام النص الافتراضي."
        action={
          <Button onClick={saveAll} loading={saving}>
            <Save className="h-4 w-4" aria-hidden="true" />
            حفظ الترتيب والنصوص
          </Button>
        }
      />

      {note && (
        <div className="mb-5">
          <StatusNote status={note} />
        </div>
      )}

      <div className="space-y-3">
        {rows.map((row, index) => {
          const meta = LABELS[row.key] ?? { title: row.key, hint: "" };
          const expanded = open === row.key;

          return (
            <Card key={row.key} className="p-0">
              <div className="flex flex-wrap items-center gap-3 p-4">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-trust-blue/10 text-sm font-extrabold text-trust-blue">
                  {index + 1}
                </span>

                <button
                  type="button"
                  onClick={() => setOpen(expanded ? null : row.key)}
                  className="min-w-0 flex-1 text-start"
                >
                  <span className="block truncate font-extrabold text-trust-blue">
                    {meta.title}
                  </span>
                  <span className="block truncate text-xs text-charcoal/50">{meta.hint}</span>
                </button>

                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label="أعلى"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-trust-blue/8 text-trust-blue disabled:opacity-35"
                  >
                    <ChevronUp className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === rows.length - 1}
                    aria-label="أسفل"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-trust-blue/8 text-trust-blue disabled:opacity-35"
                  >
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => patch(row.key, "is_visible", !row.is_visible)}
                    aria-label="الظهور"
                    className={`inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-bold ${
                      row.is_visible ? "bg-jade/12 text-jade" : "bg-charcoal/8 text-charcoal/55"
                    }`}
                  >
                    {row.is_visible ? <Eye className="h-4 w-4" aria-hidden="true" /> : <EyeOff className="h-4 w-4" aria-hidden="true" />}
                    {row.is_visible ? "ظاهر" : "مخفي"}
                  </button>
                </div>
              </div>

              {expanded && (
                <div className="border-t border-trust-blue/8 p-4 sm:p-5">
                  <LangTabs>
                    {(lang) => (
                      <div className="space-y-4">
                        <Field label={`عنوان القسم (${lang})`} hint="اتركه فارغاً للنص الافتراضي">
                          <input
                            className={inputClass}
                            value={(row[`title_${lang}` as const] as string) ?? ""}
                            onChange={(event) =>
                              patch(row.key, `title_${lang}` as keyof SiteSection, event.target.value)
                            }
                          />
                        </Field>
                        <Field label={`وصف القسم (${lang})`}>
                          <textarea
                            rows={2}
                            className={`${inputClass} resize-y`}
                            value={(row[`subtitle_${lang}` as const] as string) ?? ""}
                            onChange={(event) =>
                              patch(
                                row.key,
                                `subtitle_${lang}` as keyof SiteSection,
                                event.target.value,
                              )
                            }
                          />
                        </Field>
                        <Field
                          label={`التسمية الصغيرة فوق العنوان (${lang})`}
                          hint="اتركها فارغة للنص الافتراضي"
                        >
                          <input
                            className={inputClass}
                            value={(row[`eyebrow_${lang}` as const] as string) ?? ""}
                            onChange={(event) =>
                              patch(
                                row.key,
                                `eyebrow_${lang}` as keyof SiteSection,
                                event.target.value,
                              )
                            }
                          />
                        </Field>
                        <Field
                          label={`نص زر القسم (${lang})`}
                          hint="يظهر في الأقسام التي تحتوي زراً أسفلها"
                        >
                          <input
                            className={inputClass}
                            value={(row[`cta_label_${lang}` as const] as string) ?? ""}
                            onChange={(event) =>
                              patch(
                                row.key,
                                `cta_label_${lang}` as keyof SiteSection,
                                event.target.value,
                              )
                            }
                          />
                        </Field>
                      </div>
                    )}
                  </LangTabs>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="sticky bottom-4 mt-6 lg:hidden">
        <Button onClick={saveAll} loading={saving} className="w-full shadow-lg">
          <Save className="h-4 w-4" aria-hidden="true" />
          حفظ الترتيب والنصوص
        </Button>
      </div>
    </div>
  );
}
