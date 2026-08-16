"use client";

import { useState } from "react";
import { ChevronDown, Eye, EyeOff, Plus, Save, Trash2 } from "lucide-react";
import { AdminHeading, Button, Card, Field, LangTabs, StatusNote, inputClass } from "./ui";
import MediaField from "./MediaField";
import BlurBoxEditor from "./BlurBoxEditor";
import MediaFrame from "@/components/ui/MediaFrame";
import { createClient } from "@/lib/supabase/client";
import type { Admission, BlurBox } from "@/lib/types";

type Row = Admission & { _new?: boolean };

const DEFAULT_BOX: BlurBox = { x: 6, y: 22, w: 52, h: 12 };

const emptyRow = (order: number): Row => ({
  id: `new-${Date.now()}`,
  image_url: "",
  university_name: "",
  major_ar: "",
  major_en: "",
  major_ru: "",
  year: new Date().getFullYear(),
  blur_enabled: true,
  blur_box: DEFAULT_BOX,
  display_order: order,
  is_visible: true,
  _new: true,
});

export default function AdmissionsEditor({ initial }: { initial: Admission[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const patch = (id: string, key: keyof Row, value: unknown) =>
    setRows((current) =>
      current.map((row) => (row.id === id ? ({ ...row, [key]: value } as Row) : row)),
    );

  async function save(row: Row) {
    if (!row.image_url) {
      setNote({ type: "error", text: "ارفع صورة القبول أولاً." });
      return;
    }

    setBusy(row.id);
    const payload = {
      image_url: row.image_url,
      university_name: row.university_name || null,
      major_ar: row.major_ar || null,
      major_en: row.major_en || null,
      major_ru: row.major_ru || null,
      year: row.year ? Number(row.year) : null,
      blur_enabled: row.blur_enabled,
      blur_box: row.blur_box ?? DEFAULT_BOX,
      display_order: Number(row.display_order) || 0,
      is_visible: row.is_visible,
    };

    const supabase = createClient();
    const result = row._new
      ? await supabase.from("admissions").insert(payload).select("*").single()
      : await supabase.from("admissions").update(payload).eq("id", row.id).select("*").single();

    setBusy(null);

    if (result.error) {
      setNote({ type: "error", text: "تعذّر الحفظ." });
      return;
    }

    setRows((current) => current.map((item) => (item.id === row.id ? (result.data as Row) : item)));
    setNote({ type: "ok", text: "تم حفظ نموذج القبول." });
  }

  async function remove(row: Row) {
    if (!window.confirm("حذف هذا النموذج؟")) return;
    if (row._new) {
      setRows((current) => current.filter((item) => item.id !== row.id));
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from("admissions").delete().eq("id", row.id);
    if (error) {
      setNote({ type: "error", text: "تعذّر الحذف." });
      return;
    }
    setRows((current) => current.filter((item) => item.id !== row.id));
  }

  return (
    <div>
      <AdminHeading
        title="نماذج القبولات"
        subtitle="ارفع صور القبولات فقط — يوضع تمويه تلقائي على اسم الطالب، ويمكنك سحب المستطيل لضبط موضعه."
        action={
          <Button
            onClick={() => {
              const row = emptyRow(rows.length + 1);
              setRows((current) => [...current, row]);
              setOpen(row.id);
            }}
          >
            <Plus className="h-4 w-4" />
            نموذج جديد
          </Button>
        }
      />

      {note && (
        <div className="mb-5">
          <StatusNote status={note} />
        </div>
      )}

      {rows.length === 0 ? (
        <div className="surface-card p-12 text-center text-sm text-charcoal/55">
          لم تُضف نماذج قبولات بعد.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => {
            const expanded = open === row.id;
            const box = row.blur_box ?? DEFAULT_BOX;

            return (
              <Card key={row.id} className="p-0">
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? null : row.id)}
                  className="flex w-full items-center gap-3 p-4 text-start"
                >
                  <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-ivory">
                    <MediaFrame src={row.image_url} alt="" />
                    {row.blur_enabled && (
                      <span
                        className="absolute bg-white/30"
                        style={{
                          left: `${box.x}%`,
                          top: `${box.y}%`,
                          width: `${box.w}%`,
                          height: `${box.h}%`,
                          backdropFilter: "blur(4px)",
                        }}
                      />
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-extrabold text-trust-blue" dir="auto">
                      {row.university_name || "نموذج قبول"}
                    </span>
                    <span className="block truncate text-xs text-charcoal/50">
                      {[row.major_ar, row.year].filter(Boolean).join(" · ") || "بدون تفاصيل"}
                    </span>
                  </span>

                  {!row.is_visible && (
                    <span className="shrink-0 rounded-full bg-charcoal/8 px-2 py-1 text-[10px] font-bold text-charcoal/55">
                      مخفي
                    </span>
                  )}

                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-charcoal/40 transition-transform ${expanded ? "rotate-180" : ""}`}
                  />
                </button>

                {expanded && (
                  <div className="border-t border-trust-blue/8 p-4 sm:p-5">
                    <MediaField
                      label="صورة القبول"
                      hint="صورة أو مسح ضوئي لخطاب القبول. لا تُرفع أي بيانات أخرى."
                      value={row.image_url}
                      onChange={(url) => patch(row.id, "image_url", url ?? "")}
                      allowVideo={false}
                      showScenes={false}
                    />

                    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
                      <div>
                        <p className="mb-2 text-sm font-bold text-trust-blue">تمويه اسم الطالب</p>
                        <BlurBoxEditor
                          image={row.image_url}
                          box={box}
                          enabled={row.blur_enabled}
                          onChange={(next) => patch(row.id, "blur_box", next)}
                        />

                        <label className="mt-3 flex min-h-11 items-center gap-2 rounded-xl border border-trust-blue/12 px-4">
                          <input
                            type="checkbox"
                            checked={row.blur_enabled}
                            onChange={(event) =>
                              patch(row.id, "blur_enabled", event.target.checked)
                            }
                            className="h-4 w-4 accent-[var(--color-china-red)]"
                          />
                          <span className="text-sm font-semibold text-trust-blue">
                            {row.blur_enabled ? "التمويه مفعّل" : "التمويه متوقف"}
                          </span>
                        </label>
                      </div>

                      <div className="min-w-0 space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="اسم الجامعة" hint="اختياري">
                            <input
                              className={inputClass}
                              value={row.university_name ?? ""}
                              onChange={(event) =>
                                patch(row.id, "university_name", event.target.value)
                              }
                              placeholder="Tsinghua University"
                            />
                          </Field>
                          <Field label="سنة القبول" hint="اختياري">
                            <input
                              type="number"
                              className={inputClass}
                              value={row.year ?? ""}
                              onChange={(event) => patch(row.id, "year", event.target.value)}
                            />
                          </Field>
                        </div>

                        <LangTabs compact>
                          {(lang) => (
                            <Field label={`التخصص (${lang})`} hint="اختياري">
                              <input
                                className={inputClass}
                                value={(row[`major_${lang}` as const] as string) ?? ""}
                                onChange={(event) =>
                                  patch(row.id, `major_${lang}` as keyof Row, event.target.value)
                                }
                              />
                            </Field>
                          )}
                        </LangTabs>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="ترتيب العرض">
                            <input
                              type="number"
                              className={inputClass}
                              value={row.display_order}
                              onChange={(event) =>
                                patch(row.id, "display_order", event.target.value)
                              }
                            />
                          </Field>

                          <Field label="الظهور في الموقع">
                            <button
                              type="button"
                              onClick={() => patch(row.id, "is_visible", !row.is_visible)}
                              className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-colors ${
                                row.is_visible
                                  ? "bg-jade/12 text-jade"
                                  : "bg-charcoal/8 text-charcoal/60"
                              }`}
                            >
                              {row.is_visible ? (
                                <Eye className="h-4 w-4" />
                              ) : (
                                <EyeOff className="h-4 w-4" />
                              )}
                              {row.is_visible ? "ظاهر" : "مخفي"}
                            </button>
                          </Field>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button onClick={() => save(row)} loading={busy === row.id}>
                        <Save className="h-4 w-4" />
                        حفظ
                      </Button>
                      <Button variant="danger" onClick={() => remove(row)}>
                        <Trash2 className="h-4 w-4" />
                        حذف
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
