"use client";

import { useState } from "react";
import { ChevronDown, Plus, Save, Star, Trash2, X } from "lucide-react";
import {
  AdminHeading,
  Button,
  Card,
  Field,
  LangTabs,
  StatusNote,
  StatusToggle,
  UpdatedAtLabel,
  inputClass,
} from "./ui";
import MediaField from "./MediaField";
import MediaFrame from "@/components/ui/MediaFrame";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/format";
import type { ProgramsLanguage, University } from "@/lib/types";

type Row = University & { _new?: boolean };

const LANGUAGE_OPTIONS: { value: ProgramsLanguage; label: string }[] = [
  { value: "en_zh", label: "إنجليزي وصيني" },
  { value: "en", label: "إنجليزي" },
  { value: "zh", label: "صيني" },
];

const emptyRow = (order: number): Row => ({
  id: `new-${Date.now()}`,
  slug: "",
  name: "",
  name_ar: "",
  name_en: "",
  name_ru: "",
  city_ar: "",
  city_en: "",
  city_ru: "",
  logo: null,
  cover_media: "scene:campus-library",
  gallery: [],
  description_ar: "",
  description_en: "",
  description_ru: "",
  highlights_ar: "",
  highlights_en: "",
  highlights_ru: "",
  world_rank: null,
  world_rank_source: "",
  world_rank_year: null,
  world_rank_link: "",
  founded_year: null,
  students_count: null,
  international_students: null,
  programs_language: "en_zh",
  tuition_range: "",
  is_featured: false,
  display_order: order,
  status: "draft",
  _new: true,
});

export default function UniversitiesEditor({ initial }: { initial: University[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const patch = (id: string, key: keyof Row, value: unknown) =>
    setRows((current) =>
      current.map((row) => (row.id === id ? ({ ...row, [key]: value } as Row) : row)),
    );

  const number = (value: unknown) => {
    const parsed = Number.parseInt(String(value ?? ""), 10);
    return Number.isFinite(parsed) ? parsed : null;
  };

  async function save(row: Row) {
    if (!row.name.trim()) {
      setNote({ type: "error", text: "الاسم اللاتيني للجامعة مطلوب." });
      return;
    }
    if (row.world_rank && !row.world_rank_source?.trim()) {
      setNote({ type: "error", text: "أدخلت ترتيباً عالمياً بلا مصدر — أضف اسم المصدر أو احذف الترتيب." });
      return;
    }

    setBusy(row.id);
    const payload = {
      slug: slugify(row.slug) || slugify(row.name) || `university-${Date.now()}`,
      name: row.name.trim(),
      name_ar: row.name_ar || null,
      name_en: row.name_en || null,
      name_ru: row.name_ru || null,
      city_ar: row.city_ar || null,
      city_en: row.city_en || null,
      city_ru: row.city_ru || null,
      logo: row.logo,
      cover_media: row.cover_media,
      gallery: row.gallery ?? [],
      description_ar: row.description_ar ?? "",
      description_en: row.description_en || null,
      description_ru: row.description_ru || null,
      highlights_ar: row.highlights_ar || null,
      highlights_en: row.highlights_en || null,
      highlights_ru: row.highlights_ru || null,
      world_rank: number(row.world_rank),
      world_rank_source: row.world_rank_source || null,
      world_rank_year: number(row.world_rank_year),
      world_rank_link: row.world_rank_link || null,
      founded_year: number(row.founded_year),
      students_count: number(row.students_count),
      international_students: number(row.international_students),
      programs_language: row.programs_language ?? "en_zh",
      tuition_range: row.tuition_range || null,
      is_featured: row.is_featured,
      display_order: number(row.display_order) ?? 0,
      status: row.status ?? "draft",
    };

    const supabase = createClient();
    const result = row._new
      ? await supabase.from("universities").insert(payload).select("*").single()
      : await supabase.from("universities").update(payload).eq("id", row.id).select("*").single();

    setBusy(null);

    if (result.error) {
      setNote({
        type: "error",
        text:
          result.error.code === "23505"
            ? "الرابط (slug) مستخدم لجامعة أخرى — اختر رابطاً مختلفاً."
            : "تعذّر الحفظ.",
      });
      return;
    }

    setRows((current) => current.map((item) => (item.id === row.id ? (result.data as Row) : item)));
    setNote({ type: "ok", text: "تم حفظ الجامعة." });
  }

  async function remove(row: Row) {
    if (!window.confirm(`حذف «${row.name}» نهائياً؟`)) return;
    if (row._new) {
      setRows((current) => current.filter((item) => item.id !== row.id));
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from("universities").delete().eq("id", row.id);
    if (error) {
      setNote({ type: "error", text: "تعذّر الحذف." });
      return;
    }
    setRows((current) => current.filter((item) => item.id !== row.id));
  }

  return (
    <div>
      <AdminHeading
        title="الجامعات"
        subtitle="كل جامعة لها صورة غلاف ومعرض صور وفيديوهات ونبذة ومعلومات دقيقة بثلاث لغات. المميّزة تظهر في الصفحة الرئيسية."
        action={
          <Button
            onClick={() => {
              const row = emptyRow(rows.length + 1);
              setRows((current) => [...current, row]);
              setOpen(row.id);
            }}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            جامعة جديدة
          </Button>
        }
      />

      {note && (
        <div className="mb-5">
          <StatusNote status={note} />
        </div>
      )}

      <div className="space-y-3">
        {rows.map((row) => {
          const expanded = open === row.id;
          const gallery = Array.isArray(row.gallery) ? row.gallery : [];

          return (
            <Card key={row.id} className="p-0">
              <div className="flex w-full items-center gap-3 p-4">
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? null : row.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-start"
                >
                  <span className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-ivory">
                    <MediaFrame src={row.cover_media} alt="" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-extrabold text-trust-blue" dir="auto">
                      {row.name_ar || row.name || "جامعة جديدة"}
                    </span>
                    <span className="block truncate text-xs text-charcoal/50" dir="ltr">
                      {row.name} · {row.city_ar || row.city_en || ""}
                    </span>
                  </span>
                  {row.is_featured && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-imperial-gold/20 px-2.5 py-1 text-[0.625rem] font-bold text-[#6b5410]">
                      <Star className="h-3 w-3" aria-hidden="true" />
                      مميّزة
                    </span>
                  )}
                </button>
                <StatusToggle
                  status={row.status ?? "published"}
                  onToggle={() =>
                    patch(row.id, "status", row.status === "published" ? "draft" : "published")
                  }
                />
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? null : row.id)}
                  aria-label={expanded ? "طي" : "توسيع"}
                  className="shrink-0 rounded-full p-1.5 hover:bg-trust-blue/8"
                >
                  <ChevronDown
                    className={`h-4 w-4 text-charcoal/40 transition-transform ${expanded ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              {expanded && (
                <div className="space-y-6 border-t border-trust-blue/8 p-4 sm:p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="الاسم اللاتيني" hint="مطلوب">
                      <input
                        dir="ltr"
                        className={inputClass}
                        value={row.name}
                        onChange={(event) => patch(row.id, "name", event.target.value)}
                        placeholder="Tsinghua University"
                      />
                    </Field>
                    <Field label="الرابط (slug)" hint="يُولَّد تلقائياً إن تُرك فارغاً">
                      <input
                        dir="ltr"
                        className={inputClass}
                        value={row.slug}
                        onChange={(event) => patch(row.id, "slug", event.target.value)}
                        placeholder="tsinghua-university"
                      />
                    </Field>
                  </div>

                  <LangTabs>
                    {(lang) => (
                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label={`اسم الجامعة (${lang})`}>
                            <input
                              className={inputClass}
                              value={(row[`name_${lang}` as const] as string) ?? ""}
                              onChange={(event) =>
                                patch(row.id, `name_${lang}` as keyof Row, event.target.value)
                              }
                            />
                          </Field>
                          <Field label={`المدينة (${lang})`}>
                            <input
                              className={inputClass}
                              value={(row[`city_${lang}` as const] as string) ?? ""}
                              onChange={(event) =>
                                patch(row.id, `city_${lang}` as keyof Row, event.target.value)
                              }
                            />
                          </Field>
                        </div>

                        <Field label={`النبذة (${lang})`}>
                          <textarea
                            rows={5}
                            className={`${inputClass} resize-y`}
                            value={(row[`description_${lang}` as const] as string) ?? ""}
                            onChange={(event) =>
                              patch(row.id, `description_${lang}` as keyof Row, event.target.value)
                            }
                          />
                        </Field>

                        <Field label={`نقاط مميزة (${lang})`} hint="سطر لكل نقطة">
                          <textarea
                            rows={4}
                            className={`${inputClass} resize-y`}
                            value={(row[`highlights_${lang}` as const] as string) ?? ""}
                            onChange={(event) =>
                              patch(row.id, `highlights_${lang}` as keyof Row, event.target.value)
                            }
                          />
                        </Field>
                      </div>
                    )}
                  </LangTabs>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Field
                      label="الترتيب العالمي"
                      hint="لن يظهر الرقم في الموقع بلا اسم مصدر — إلزامي إن أدخلت ترتيباً."
                    >
                      <input
                        type="number"
                        className={inputClass}
                        value={row.world_rank ?? ""}
                        onChange={(event) => patch(row.id, "world_rank", event.target.value)}
                      />
                    </Field>
                    <Field label="مصدر الترتيب" hint="مثال: QS World University Rankings">
                      <input
                        className={inputClass}
                        value={row.world_rank_source ?? ""}
                        onChange={(event) => patch(row.id, "world_rank_source", event.target.value)}
                      />
                    </Field>
                    <Field label="سنة الترتيب">
                      <input
                        type="number"
                        className={inputClass}
                        value={row.world_rank_year ?? ""}
                        onChange={(event) => patch(row.id, "world_rank_year", event.target.value)}
                      />
                    </Field>
                    <Field label="رابط المصدر" hint="اختياري">
                      <input
                        dir="ltr"
                        className={inputClass}
                        value={row.world_rank_link ?? ""}
                        onChange={(event) => patch(row.id, "world_rank_link", event.target.value)}
                        placeholder="https://..."
                      />
                    </Field>
                    <Field label="سنة التأسيس">
                      <input
                        type="number"
                        className={inputClass}
                        value={row.founded_year ?? ""}
                        onChange={(event) => patch(row.id, "founded_year", event.target.value)}
                      />
                    </Field>
                    <Field label="عدد الطلاب">
                      <input
                        type="number"
                        className={inputClass}
                        value={row.students_count ?? ""}
                        onChange={(event) => patch(row.id, "students_count", event.target.value)}
                      />
                    </Field>
                    <Field label="الطلاب الدوليون">
                      <input
                        type="number"
                        className={inputClass}
                        value={row.international_students ?? ""}
                        onChange={(event) =>
                          patch(row.id, "international_students", event.target.value)
                        }
                      />
                    </Field>
                    <Field label="لغة الدراسة">
                      <select
                        className={inputClass}
                        value={row.programs_language ?? "en_zh"}
                        onChange={(event) => patch(row.id, "programs_language", event.target.value)}
                      >
                        {LANGUAGE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="الرسوم السنوية">
                      <input
                        dir="ltr"
                        className={inputClass}
                        value={row.tuition_range ?? ""}
                        onChange={(event) => patch(row.id, "tuition_range", event.target.value)}
                        placeholder="20,000 – 40,000 CNY"
                      />
                    </Field>
                  </div>

                  <MediaField
                    label="صورة أو فيديو الغلاف"
                    value={row.cover_media}
                    onChange={(url) => patch(row.id, "cover_media", url)}
                  />

                  <MediaField
                    label="شعار الجامعة"
                    hint="اختياري — يظهر بجانب الاسم."
                    value={row.logo}
                    onChange={(url) => patch(row.id, "logo", url)}
                    allowVideo={false}
                    showScenes={false}
                  />

                  <div>
                    <p className="mb-1.5 text-sm font-bold text-trust-blue">
                      معرض الجامعة ({gallery.length})
                    </p>
                    <p className="mb-3 text-xs text-charcoal/50">
                      عدة صور أو فيديوهات تظهر داخل صفحة الجامعة.
                    </p>

                    {gallery.length > 0 && (
                      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {gallery.map((item, index) => (
                          <div
                            key={`${item}-${index}`}
                            className="relative h-24 overflow-hidden rounded-xl border border-trust-blue/12 bg-ivory"
                          >
                            <MediaFrame src={item} alt="" />
                            <button
                              type="button"
                              onClick={() =>
                                patch(
                                  row.id,
                                  "gallery",
                                  gallery.filter((_, i) => i !== index),
                                )
                              }
                              className="absolute top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white end-1.5"
                              aria-label="حذف"
                            >
                              <X className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <MediaField
                      label="إضافة إلى المعرض"
                      hint="اختر أو ارفع ملفاً ليُضاف إلى المعرض مباشرة."
                      value={null}
                      onChange={(url) => {
                        if (url) patch(row.id, "gallery", [...gallery, url]);
                      }}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="ترتيب العرض">
                      <input
                        type="number"
                        className={inputClass}
                        value={row.display_order}
                        onChange={(event) => patch(row.id, "display_order", event.target.value)}
                      />
                    </Field>
                    <Field label="جامعة مميّزة" hint="تظهر في الصفحة الرئيسية">
                      <label className="flex min-h-11 items-center gap-2 rounded-xl border border-trust-blue/12 px-4">
                        <input
                          type="checkbox"
                          checked={row.is_featured}
                          onChange={(event) => patch(row.id, "is_featured", event.target.checked)}
                          className="h-4 w-4 accent-[var(--color-china-red)]"
                        />
                        <span className="text-sm font-semibold text-trust-blue">
                          {row.is_featured ? "مميّزة" : "غير مميّزة"}
                        </span>
                      </label>
                    </Field>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button onClick={() => save(row)} loading={busy === row.id}>
                      <Save className="h-4 w-4" aria-hidden="true" />
                      حفظ
                    </Button>
                    <Button variant="danger" onClick={() => remove(row)}>
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      حذف
                    </Button>
                    <UpdatedAtLabel value={row.updated_at} />
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
