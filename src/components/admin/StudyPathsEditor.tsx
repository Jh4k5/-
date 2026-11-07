"use client";

import { useState } from "react";
import { ChevronDown, Save } from "lucide-react";
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
import type { StudyPath } from "@/lib/types";

const PATH_LABELS: Record<string, string> = {
  language: "اللغة الصينية",
  bachelor: "البكالوريوس",
  master: "الماجستير",
  phd: "الدكتوراه",
};

export default function StudyPathsEditor({ initial }: { initial: StudyPath[] }) {
  const [rows, setRows] = useState<StudyPath[]>(initial);
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const patch = (id: string, key: keyof StudyPath, value: unknown) =>
    setRows((current) =>
      current.map((row) => (row.id === id ? ({ ...row, [key]: value } as StudyPath) : row)),
    );

  async function toggleStatus(row: StudyPath) {
    const current = row.status ?? "draft";
    const next: "draft" | "published" = current === "published" ? "draft" : "published";
    patch(row.id, "status", next);
    const failure = await persistRowStatus("study_paths", row.id, next);
    if (failure) {
      patch(row.id, "status", current);
      setNote({ type: "error", text: failure });
    } else {
      setNote({ type: "ok", text: next === "published" ? "تم النشر." : "تم التحويل إلى مسودة." });
    }
  }

  async function save(row: StudyPath) {
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
    const result = await supabase
      .from("study_paths")
      .update(payload)
      .eq("id", row.id)
      .select("*")
      .single();

    setBusy(null);

    if (result.error) {
      setNote({ type: "error", text: "تعذّر الحفظ." });
      return;
    }

    setRows((current) => current.map((item) => (item.id === row.id ? (result.data as StudyPath) : item)));
    setNote({ type: "ok", text: "تم حفظ المسار." });
  }

  return (
    <div>
      <AdminHeading
        title="اختر مسارك"
        subtitle="المسارات الأربعة الثابتة (لغة، بكالوريوس، ماجستير، دكتوراه) — عدّل النص والأيقونة والترتيب والحالة، لا يمكن إضافة أو حذف مسار."
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
                      {row.title_ar || PATH_LABELS[row.path_key]}
                    </span>
                    <span className="block text-xs text-charcoal/50">
                      المفتاح: {row.path_key} · ترتيب العرض: {row.display_order}
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
                              patch(row.id, `title_${lang}` as keyof StudyPath, event.target.value)
                            }
                          />
                        </Field>
                        <Field label={`الوصف (${lang})`}>
                          <textarea
                            rows={4}
                            className={`${inputClass} resize-y`}
                            value={(row[`description_${lang}` as const] as string) ?? ""}
                            onChange={(event) =>
                              patch(row.id, `description_${lang}` as keyof StudyPath, event.target.value)
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
