"use client";

import { useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
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
import { createClient } from "@/lib/supabase/client";
import type { GalleryItem } from "@/lib/types";

type Row = GalleryItem & { _new?: boolean };

const emptyRow = (order: number): Row => ({
  id: `new-${Date.now()}`,
  image_url: "scene:campus-quad",
  caption_ar: "",
  caption_en: "",
  caption_ru: "",
  alt_text: "",
  display_order: order,
  status: "draft",
  _new: true,
});

export default function GalleryEditor({ initial }: { initial: GalleryItem[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const patch = (id: string, key: keyof Row, value: unknown) =>
    setRows((current) =>
      current.map((row) => (row.id === id ? ({ ...row, [key]: value } as Row) : row)),
    );

  async function save(row: Row) {
    setBusy(row.id);
    const payload = {
      image_url: row.image_url,
      caption_ar: row.caption_ar || null,
      caption_en: row.caption_en || null,
      caption_ru: row.caption_ru || null,
      alt_text: row.alt_text || null,
      display_order: Number(row.display_order) || 0,
      status: row.status ?? "draft",
    };

    const supabase = createClient();
    const result = row._new
      ? await supabase.from("gallery").insert(payload).select("*").single()
      : await supabase.from("gallery").update(payload).eq("id", row.id).select("*").single();

    setBusy(null);

    if (result.error) {
      setNote({ type: "error", text: "تعذّر الحفظ." });
      return;
    }
    setRows((current) => current.map((item) => (item.id === row.id ? (result.data as Row) : item)));
    setNote({ type: "ok", text: "تم حفظ الصورة." });
  }

  async function remove(row: Row) {
    if (!window.confirm("حذف هذه الصورة؟")) return;
    if (row._new) {
      setRows((current) => current.filter((item) => item.id !== row.id));
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.from("gallery").delete().eq("id", row.id);
    if (error) {
      setNote({ type: "error", text: "تعذّر الحذف." });
      return;
    }
    setRows((current) => current.filter((item) => item.id !== row.id));
  }

  return (
    <div>
      <AdminHeading
        title="معرض الصور العام"
        subtitle="صور عامة يمكن استخدامها في أنحاء الموقع، مع تعليق اختياري بثلاث لغات."
        action={
          <Button onClick={() => setRows((current) => [...current, emptyRow(current.length + 1)])}>
            <Plus className="h-4 w-4" />
            صورة جديدة
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
          المعرض فارغ حالياً.
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {rows.map((row) => (
            <Card key={row.id} className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <StatusToggle
                  status={row.status ?? "published"}
                  onToggle={() =>
                    patch(row.id, "status", row.status === "published" ? "draft" : "published")
                  }
                />
                <UpdatedAtLabel value={row.updated_at} />
              </div>

              <MediaField
                value={row.image_url}
                onChange={(url) => patch(row.id, "image_url", url ?? "")}
              />

              <LangTabs compact>
                {(lang) => (
                  <Field label={`التعليق (${lang})`}>
                    <input
                      className={inputClass}
                      value={(row[`caption_${lang}` as const] as string) ?? ""}
                      onChange={(event) =>
                        patch(row.id, `caption_${lang}` as keyof Row, event.target.value)
                      }
                    />
                  </Field>
                )}
              </LangTabs>

              <Field label="النص البديل (alt)" hint="لقارئ الشاشة">
                <input
                  className={inputClass}
                  value={row.alt_text ?? ""}
                  onChange={(event) => patch(row.id, "alt_text", event.target.value)}
                />
              </Field>

              <div className="flex items-end gap-3">
                <Field label="ترتيب العرض">
                  <input
                    type="number"
                    className={`${inputClass} w-28`}
                    value={row.display_order}
                    onChange={(event) => patch(row.id, "display_order", event.target.value)}
                  />
                </Field>
                <Button onClick={() => save(row)} loading={busy === row.id}>
                  <Save className="h-4 w-4" />
                  حفظ
                </Button>
                <Button variant="danger" onClick={() => remove(row)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
