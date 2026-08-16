"use client";

import { useState } from "react";
import { ChevronDown, Plus, Save, Trash2 } from "lucide-react";
import { AdminHeading, Button, Card, Field, LangTabs, StatusNote, inputClass } from "./ui";
import MediaField from "./MediaField";
import MediaFrame from "@/components/ui/MediaFrame";
import { createClient } from "@/lib/supabase/client";
import type { DestinationMedia } from "@/lib/types";

type Row = DestinationMedia & { _new?: boolean };

const emptyRow = (order: number): Row => ({
  id: `new-${Date.now()}`,
  image_url: "scene:shanghai",
  category: "hero",
  title_ar: "",
  title_en: "",
  title_ru: "",
  display_order: order,
  is_featured: true,
  _new: true,
});

/**
 * Dedicated hero-slide manager: every save is forced to category="hero" +
 * is_featured=true, so the slide always shows up in the home hero without
 * the admin needing to touch a dropdown or checkbox.
 */
export default function HeroSlidesEditor({ initial }: { initial: DestinationMedia[] }) {
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
      setNote({ type: "error", text: "الصورة أو الفيديو مطلوب." });
      return;
    }

    setBusy(row.id);
    const payload = {
      image_url: row.image_url,
      category: "hero" as const,
      title_ar: row.title_ar,
      title_en: row.title_en || null,
      title_ru: row.title_ru || null,
      display_order: Number(row.display_order) || 0,
      is_featured: true,
    };

    const supabase = createClient();
    const result = row._new
      ? await supabase.from("destination_media").insert(payload).select("*").single()
      : await supabase
          .from("destination_media")
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
    setNote({ type: "ok", text: "تم حفظ شريحة الهيدر." });
  }

  async function remove(row: Row) {
    if (!window.confirm("حذف هذه الشريحة من الهيدر؟")) return;
    if (row._new) {
      setRows((current) => current.filter((item) => item.id !== row.id));
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.from("destination_media").delete().eq("id", row.id);
    if (error) {
      setNote({ type: "error", text: "تعذّر الحذف." });
      return;
    }
    setRows((current) => current.filter((item) => item.id !== row.id));
  }

  return (
    <div>
      <AdminHeading
        title="شرائح الهيدر"
        subtitle="ارفع صورة أو فيديو حقيقياً ليظهر خلف الطبقات المتحركة في الهيدر الرئيسي، وعدّل العبارة المرافقة له بثلاث لغات. كل شريحة تُحفظ تلقائياً كخلفية هيدر — لا حاجة لضبط أي تصنيف يدوياً."
        action={
          <Button
            onClick={() => {
              const row = emptyRow(rows.length + 1);
              setRows((current) => [...current, row]);
              setOpen(row.id);
            }}
          >
            <Plus className="h-4 w-4" />
            شريحة جديدة
          </Button>
        }
      />

      {note && (
        <div className="mb-5">
          <StatusNote status={note} />
        </div>
      )}

      {rows.length === 0 && (
        <p className="mb-4 text-sm text-charcoal/60">
          لا توجد شرائح مخصّصة بعد — الهيدر يعرض حالياً رسمة الهوية الافتراضية.
        </p>
      )}

      <div className="space-y-3">
        {rows.map((row) => {
          const expanded = open === row.id;
          return (
            <Card key={row.id} className="p-0">
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : row.id)}
                className="flex w-full items-center gap-4 p-4 text-start"
              >
                <span className="h-14 w-24 shrink-0 overflow-hidden rounded-xl bg-ivory">
                  <MediaFrame src={row.image_url} alt="" />
                </span>
                <span className="flex-1">
                  <span className="block font-extrabold text-trust-blue">
                    {row.title_ar || "بدون عبارة"}
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
                  <MediaField
                    label="صورة أو فيديو الهيدر"
                    hint="هذه الصورة تظهر خلف الطبقات المتحركة (الجسر، الجزيئات، الشعار العائم) — رفع صورة حقيقية لا يزيل تلك الطبقات."
                    value={row.image_url}
                    onChange={(url) => patch(row.id, "image_url", url ?? "")}
                  />

                  <div className="mt-5">
                    <Field label="ترتيب العرض">
                      <input
                        type="number"
                        className={inputClass}
                        value={row.display_order}
                        onChange={(event) => patch(row.id, "display_order", event.target.value)}
                      />
                    </Field>
                  </div>

                  <div className="mt-6">
                    <LangTabs compact>
                      {(lang) => (
                        <Field label={`العبارة المرافقة (${lang})`}>
                          <input
                            className={inputClass}
                            value={(row[`title_${lang}` as const] as string) ?? ""}
                            onChange={(event) =>
                              patch(row.id, `title_${lang}` as keyof Row, event.target.value)
                            }
                          />
                        </Field>
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
