"use client";

import { useState } from "react";
import { ChevronDown, Plus, Save, Trash2 } from "lucide-react";
import { Button, Card, Field, LangTabs, StatusNote, inputClass } from "./ui";
import { createClient } from "@/lib/supabase/client";
import { ICON_KEYS, iconFor } from "@/lib/icons";
import type { ProcessTrustBadge } from "@/lib/types";

type Row = ProcessTrustBadge & { _new?: boolean };

const emptyBadge = (order: number): Row => ({
  id: `new-${Date.now()}`,
  title_ar: "",
  title_en: "",
  title_ru: "",
  description_ar: "",
  description_en: "",
  description_ru: "",
  icon: "shield",
  display_order: order,
  _new: true,
});

export default function ProcessTrustBadgesEditor({ initial }: { initial: ProcessTrustBadge[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const patch = (id: string, key: keyof Row, value: unknown) =>
    setRows((current) =>
      current.map((row) => (row.id === id ? ({ ...row, [key]: value } as Row) : row)),
    );

  async function save(row: Row) {
    if (!row.title_ar.trim()) {
      setNote({ type: "error", text: "العنوان بالعربية مطلوب." });
      return;
    }

    setBusy(row.id);
    const payload = {
      title_ar: row.title_ar,
      title_en: row.title_en || null,
      title_ru: row.title_ru || null,
      description_ar: row.description_ar,
      description_en: row.description_en || null,
      description_ru: row.description_ru || null,
      icon: row.icon,
      display_order: Number(row.display_order) || 0,
    };

    const supabase = createClient();
    const result = row._new
      ? await supabase.from("process_trust_badges").insert(payload).select("*").single()
      : await supabase
          .from("process_trust_badges")
          .update(payload)
          .eq("id", row.id)
          .select("*")
          .single();

    setBusy(null);

    if (result.error) {
      setNote({ type: "error", text: "تعذّر الحفظ." });
      return;
    }

    setRows((current) =>
      current.map((item) => (item.id === row.id ? (result.data as Row) : item)),
    );
    setNote({ type: "ok", text: "تم حفظ بطاقة الثقة." });
  }

  async function remove(row: Row) {
    if (!window.confirm("حذف بطاقة الثقة هذه؟")) return;
    if (row._new) {
      setRows((current) => current.filter((item) => item.id !== row.id));
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from("process_trust_badges").delete().eq("id", row.id);
    if (error) {
      setNote({ type: "error", text: "تعذّر الحذف." });
      return;
    }
    setRows((current) => current.filter((item) => item.id !== row.id));
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-trust-blue">بطاقات الثقة</h2>
          <p className="mt-1 text-sm text-charcoal/60">
            البطاقات الأربع التي تظهر أعلى الخط الزمني (استشارة مجانية، عقود موثّقة، إلخ.).
          </p>
        </div>
        <Button
          onClick={() => {
            const row = emptyBadge(rows.length + 1);
            setRows((current) => [...current, row]);
            setOpen(row.id);
          }}
        >
          <Plus className="h-4 w-4" />
          بطاقة جديدة
        </Button>
      </div>

      {note && (
        <div className="mb-5">
          <StatusNote status={note} />
        </div>
      )}

      <div className="space-y-3">
        {rows.map((row) => {
          const Icon = iconFor(row.icon);
          const expanded = open === row.id;

          return (
            <Card key={row.id} className="p-0">
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : row.id)}
                className="flex w-full items-center gap-4 p-5 text-start"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-trust-blue/10 text-trust-blue">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block font-extrabold text-trust-blue">
                    {row.title_ar || "بطاقة بدون عنوان"}
                  </span>
                  <span className="block text-xs text-charcoal/50">
                    ترتيب العرض: {row.display_order}
                  </span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-charcoal/40 transition-transform ${expanded ? "rotate-180" : ""}`}
                />
              </button>

              {expanded && (
                <div className="border-t border-trust-blue/8 p-5">
                  <LangTabs>
                    {(lang) => (
                      <div className="space-y-4">
                        <Field label={`العنوان (${lang})`}>
                          <input
                            className={inputClass}
                            value={(row[`title_${lang}` as const] as string) ?? ""}
                            onChange={(event) =>
                              patch(row.id, `title_${lang}` as keyof Row, event.target.value)
                            }
                          />
                        </Field>
                        <Field label={`الوصف (${lang})`}>
                          <textarea
                            rows={3}
                            className={`${inputClass} resize-y`}
                            value={(row[`description_${lang}` as const] as string) ?? ""}
                            onChange={(event) =>
                              patch(row.id, `description_${lang}` as keyof Row, event.target.value)
                            }
                          />
                        </Field>
                      </div>
                    )}
                  </LangTabs>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Field label="الأيقونة">
                      <select
                        className={inputClass}
                        value={row.icon}
                        onChange={(event) => patch(row.id, "icon", event.target.value)}
                      >
                        {ICON_KEYS.map((key) => (
                          <option key={key} value={key}>
                            {key}
                          </option>
                        ))}
                      </select>
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
