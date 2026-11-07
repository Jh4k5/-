"use client";

import { useState } from "react";
import { ChevronDown, Plus, Save, Trash2 } from "lucide-react";
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
  persistRowStatus,
} from "./ui";
import { createClient } from "@/lib/supabase/client";
import type { Faq } from "@/lib/types";

type Row = Faq & { _new?: boolean };

const emptyFaq = (order: number): Row => ({
  id: `new-${Date.now()}`,
  question_ar: "",
  question_en: "",
  question_ru: "",
  answer_ar: "",
  answer_en: "",
  answer_ru: "",
  category: "",
  display_order: order,
  status: "draft",
  _new: true,
});

export default function FaqEditor({ initial }: { initial: Faq[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const patch = (id: string, key: keyof Row, value: unknown) =>
    setRows((current) =>
      current.map((row) => (row.id === id ? ({ ...row, [key]: value } as Row) : row)),
    );

  async function toggleStatus(row: Row) {
    const current = row.status ?? "draft";
    const next: "draft" | "published" = current === "published" ? "draft" : "published";
    patch(row.id, "status", next);
    if (row._new) return; // not yet in the database — will be saved with the row
    const failure = await persistRowStatus("faqs", row.id, next);
    if (failure) {
      patch(row.id, "status", current);
      setNote({ type: "error", text: failure });
    } else {
      setNote({ type: "ok", text: next === "published" ? "تم النشر." : "تم التحويل إلى مسودة." });
    }
  }

  async function save(row: Row) {
    if (!row.question_ar.trim()) {
      setNote({ type: "error", text: "نص السؤال بالعربية مطلوب." });
      return;
    }
    if (!row.answer_ar.trim()) {
      setNote({ type: "error", text: "نص الإجابة بالعربية مطلوب." });
      return;
    }

    setBusy(row.id);
    const payload = {
      question_ar: row.question_ar,
      question_en: row.question_en || null,
      question_ru: row.question_ru || null,
      answer_ar: row.answer_ar,
      answer_en: row.answer_en || null,
      answer_ru: row.answer_ru || null,
      category: row.category || null,
      display_order: Number(row.display_order) || 0,
      status: row.status ?? "draft",
    };

    const supabase = createClient();
    const result = row._new
      ? await supabase.from("faqs").insert(payload).select("*").single()
      : await supabase.from("faqs").update(payload).eq("id", row.id).select("*").single();

    setBusy(null);

    if (result.error) {
      setNote({ type: "error", text: "تعذّر الحفظ." });
      return;
    }

    setRows((current) => current.map((item) => (item.id === row.id ? (result.data as Row) : item)));
    setNote({ type: "ok", text: "تم حفظ السؤال." });
  }

  async function remove(row: Row) {
    if (!window.confirm("حذف هذا السؤال؟")) return;
    if (row._new) {
      setRows((current) => current.filter((item) => item.id !== row.id));
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from("faqs").delete().eq("id", row.id);
    if (error) {
      setNote({ type: "error", text: "تعذّر الحذف." });
      return;
    }
    setRows((current) => current.filter((item) => item.id !== row.id));
  }

  return (
    <div>
      <AdminHeading
        title="الأسئلة الشائعة"
        subtitle="أدر أسئلة الصفحة الرئيسية وأجوبتها بثلاث لغات. لا تعرض إجابة تعِد بنتيجة مضمونة."
        action={
          <Button
            onClick={() => {
              const row = emptyFaq(rows.length + 1);
              setRows((current) => [...current, row]);
              setOpen(row.id);
            }}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            سؤال جديد
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
          لم تُضف أسئلة بعد.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => {
            const expanded = open === row.id;

            return (
              <Card key={row.id} className="p-0">
                <div className="flex w-full items-center gap-4 p-5">
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : row.id)}
                    className="flex flex-1 items-center gap-4 text-start"
                  >
                    <span className="flex-1">
                      <span className="block font-extrabold text-trust-blue" dir="auto">
                        {row.question_ar || "سؤال بدون نص"}
                      </span>
                      <span className="block text-xs text-charcoal/50">
                        ترتيب العرض: {row.display_order}
                      </span>
                    </span>
                  </button>
                  <StatusToggle
                    status={row.status ?? "published"}
                    onToggle={() => toggleStatus(row)}
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
                  <div className="border-t border-trust-blue/8 p-5">
                    <LangTabs>
                      {(lang) => (
                        <div className="space-y-4">
                          <Field label={`السؤال (${lang})`}>
                            <input
                              className={inputClass}
                              value={(row[`question_${lang}` as const] as string) ?? ""}
                              onChange={(event) =>
                                patch(row.id, `question_${lang}` as keyof Row, event.target.value)
                              }
                            />
                          </Field>
                          <Field label={`الإجابة (${lang})`}>
                            <textarea
                              rows={4}
                              className={`${inputClass} resize-y`}
                              value={(row[`answer_${lang}` as const] as string) ?? ""}
                              onChange={(event) =>
                                patch(row.id, `answer_${lang}` as keyof Row, event.target.value)
                              }
                            />
                          </Field>
                        </div>
                      )}
                    </LangTabs>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <Field label="تصنيف" hint="اختياري — لتنظيمك الداخلي فقط">
                        <input
                          className={inputClass}
                          value={row.category ?? ""}
                          onChange={(event) => patch(row.id, "category", event.target.value)}
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

                    <div className="mt-5 flex flex-wrap items-center gap-3">
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
      )}
    </div>
  );
}
