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
import { ICON_KEYS, iconFor } from "@/lib/icons";
import type { WhyChinaPoint } from "@/lib/types";

type Row = WhyChinaPoint & { _new?: boolean };

const emptyPoint = (order: number): Row => ({
  id: `new-${Date.now()}`,
  title_ar: "",
  title_en: "",
  title_ru: "",
  description_ar: "",
  description_en: "",
  description_ru: "",
  icon: "sparkles",
  display_order: order,
  status: "draft",
  _new: true,
});

export default function WhyChinaPointsEditor({ initial }: { initial: WhyChinaPoint[] }) {
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
    const failure = await persistRowStatus("why_china_points", row.id, next);
    if (failure) {
      patch(row.id, "status", current);
      setNote({ type: "error", text: failure });
    } else {
      setNote({ type: "ok", text: next === "published" ? "تم النشر." : "تم التحويل إلى مسودة." });
    }
  }

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
      status: row.status ?? "draft",
    };

    const supabase = createClient();
    const result = row._new
      ? await supabase.from("why_china_points").insert(payload).select("*").single()
      : await supabase.from("why_china_points").update(payload).eq("id", row.id).select("*").single();

    setBusy(null);

    if (result.error) {
      setNote({ type: "error", text: "تعذّر الحفظ." });
      return;
    }

    setRows((current) =>
      current.map((item) => (item.id === row.id ? (result.data as Row) : item)),
    );
    setNote({ type: "ok", text: "تم حفظ الميزة." });
  }

  async function remove(row: Row) {
    if (!window.confirm("حذف هذه الميزة؟")) return;
    if (row._new) {
      setRows((current) => current.filter((item) => item.id !== row.id));
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from("why_china_points").delete().eq("id", row.id);
    if (error) {
      setNote({ type: "error", text: "تعذّر الحذف." });
      return;
    }
    setRows((current) => current.filter((item) => item.id !== row.id));
  }

  return (
    <div>
      <AdminHeading
        title="لماذا الصين؟"
        subtitle="عدّل عنوان ووصف كل ميزة بثلاث لغات، واختر الأيقونة وترتيب العرض."
        action={
          <Button
            onClick={() => {
              const row = emptyPoint(rows.length + 1);
              setRows((current) => [...current, row]);
              setOpen(row.id);
            }}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            ميزة جديدة
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
          const Icon = iconFor(row.icon);
          const expanded = open === row.id;

          return (
            <Card key={row.id} className="p-0">
              <div className="flex w-full items-center gap-4 p-5">
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? null : row.id)}
                  className="flex flex-1 items-center gap-4 text-start"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-trust-blue/10 text-trust-blue">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-extrabold text-trust-blue">
                      {row.title_ar || "ميزة بدون عنوان"}
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
                            rows={5}
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
    </div>
  );
}
