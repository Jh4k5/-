"use client";

import { useState } from "react";
import { ChevronDown, Plus, Save, Trash2 } from "lucide-react";
import { AdminHeading, Button, Card, Field, LangTabs, StatusNote, inputClass } from "./ui";
import MediaField from "./MediaField";
import { createClient } from "@/lib/supabase/client";
import type { SuccessStory } from "@/lib/types";

type Row = SuccessStory & { _new?: boolean };

const emptyStory = (order: number): Row => ({
  id: `new-${Date.now()}`,
  student_name: "",
  photo: null,
  achievement_ar: "",
  achievement_en: "",
  achievement_ru: "",
  quote_ar: "",
  quote_en: "",
  quote_ru: "",
  display_order: order,
  _new: true,
});

export default function StoriesEditor({ initial }: { initial: SuccessStory[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const patch = (id: string, key: keyof Row, value: unknown) =>
    setRows((current) =>
      current.map((row) => (row.id === id ? ({ ...row, [key]: value } as Row) : row)),
    );

  async function save(row: Row) {
    if (!row.student_name.trim()) {
      setNote({ type: "error", text: "اسم الطالب مطلوب." });
      return;
    }

    setBusy(row.id);
    const payload = {
      student_name: row.student_name,
      photo: row.photo,
      achievement_ar: row.achievement_ar,
      achievement_en: row.achievement_en || null,
      achievement_ru: row.achievement_ru || null,
      quote_ar: row.quote_ar || null,
      quote_en: row.quote_en || null,
      quote_ru: row.quote_ru || null,
      display_order: Number(row.display_order) || 0,
    };

    const supabase = createClient();
    const result = row._new
      ? await supabase.from("success_stories").insert(payload).select("*").single()
      : await supabase
          .from("success_stories")
          .update(payload)
          .eq("id", row.id)
          .select("*")
          .single();

    setBusy(null);

    if (result.error) {
      setNote({ type: "error", text: "تعذّر الحفظ." });
      return;
    }

    setRows((current) => current.map((item) => (item.id === row.id ? (result.data as Row) : item)));
    setNote({ type: "ok", text: "تم حفظ القصة." });
  }

  async function remove(row: Row) {
    if (!window.confirm("حذف هذه القصة؟")) return;
    if (row._new) {
      setRows((current) => current.filter((item) => item.id !== row.id));
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.from("success_stories").delete().eq("id", row.id);
    if (error) {
      setNote({ type: "error", text: "تعذّر الحذف." });
      return;
    }
    setRows((current) => current.filter((item) => item.id !== row.id));
  }

  return (
    <div>
      <AdminHeading
        title="قصص النجاح"
        subtitle="اسم الطالب يبقى كما هو دون ترجمة، أما الإنجاز والاقتباس فيُكتبان بثلاث لغات."
        action={
          <Button
            onClick={() => {
              const row = emptyStory(rows.length + 1);
              setRows((current) => [...current, row]);
              setOpen(row.id);
            }}
          >
            <Plus className="h-4 w-4" />
            قصة جديدة
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
          return (
            <Card key={row.id} className="p-0">
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : row.id)}
                className="flex w-full items-center gap-4 p-5 text-start"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-trust-blue to-china-red text-lg font-extrabold text-white">
                  {row.student_name.trim().charAt(0) || "?"}
                </span>
                <span className="flex-1">
                  <span className="block font-extrabold text-trust-blue" dir="auto">
                    {row.student_name || "قصة جديدة"}
                  </span>
                  <span className="block text-xs text-charcoal/50">{row.achievement_ar}</span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-charcoal/40 transition-transform ${expanded ? "rotate-180" : ""}`}
                />
              </button>

              {expanded && (
                <div className="border-t border-trust-blue/8 p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="اسم الطالب" hint="بدون ترجمة">
                      <input
                        className={inputClass}
                        value={row.student_name}
                        onChange={(event) => patch(row.id, "student_name", event.target.value)}
                      />
                    </Field>
                    <Field label="ترتيب العرض">
                      <input
                        type="number"
                        className={inputClass}
                        value={row.display_order}
                        onChange={(event) => patch(row.id, "display_order", event.target.value)}
                      />
                    </Field>
                  </div>

                  <div className="mt-5">
                    <MediaField
                      label="صورة الطالب"
                      hint="اختيارية — يظهر الحرف الأول من الاسم إن لم توجد صورة."
                      value={row.photo}
                      onChange={(url) => patch(row.id, "photo", url)}
                    />
                  </div>

                  <div className="mt-6">
                    <LangTabs>
                      {(lang) => (
                        <div className="space-y-4">
                          <Field label={`الإنجاز (${lang})`}>
                            <input
                              className={inputClass}
                              value={(row[`achievement_${lang}` as const] as string) ?? ""}
                              onChange={(event) =>
                                patch(row.id, `achievement_${lang}` as keyof Row, event.target.value)
                              }
                            />
                          </Field>
                          <Field label={`الاقتباس (${lang})`}>
                            <textarea
                              rows={3}
                              className={`${inputClass} resize-y`}
                              value={(row[`quote_${lang}` as const] as string) ?? ""}
                              onChange={(event) =>
                                patch(row.id, `quote_${lang}` as keyof Row, event.target.value)
                              }
                            />
                          </Field>
                        </div>
                      )}
                    </LangTabs>
                  </div>

                  <div className="mt-5 flex gap-2">
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
    </div>
  );
}
