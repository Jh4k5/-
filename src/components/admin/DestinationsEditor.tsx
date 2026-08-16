"use client";

import { useState } from "react";
import { ChevronDown, Plus, Save, Star, Trash2 } from "lucide-react";
import { AdminHeading, Button, Card, Field, LangTabs, StatusNote, inputClass } from "./ui";
import ImageField from "./ImageField";
import MediaImage from "@/components/ui/MediaImage";
import { createClient } from "@/lib/supabase/client";
import type { DestinationCategory, DestinationMedia } from "@/lib/types";

type Row = DestinationMedia & { _new?: boolean };

const CATEGORY_LABEL: Record<DestinationCategory, string> = {
  city: "مدينة صينية",
  campus: "داخل الجامعة",
  hero: "خلفية الهيدر",
};

const emptyRow = (order: number): Row => ({
  id: `new-${Date.now()}`,
  image_url: "scene:shanghai",
  category: "city",
  title_ar: "",
  title_en: "",
  title_ru: "",
  display_order: order,
  is_featured: false,
  _new: true,
});

export default function DestinationsEditor({ initial }: { initial: DestinationMedia[] }) {
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
      setNote({ type: "error", text: "الصورة مطلوبة." });
      return;
    }

    setBusy(row.id);
    const payload = {
      image_url: row.image_url,
      category: row.category,
      title_ar: row.title_ar,
      title_en: row.title_en || null,
      title_ru: row.title_ru || null,
      display_order: Number(row.display_order) || 0,
      is_featured: row.is_featured,
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
    setNote({ type: "ok", text: "تم حفظ الصورة." });
  }

  async function remove(row: Row) {
    if (!window.confirm("حذف هذه الصورة من المعرض؟")) return;
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
        title="معرض الوجهات (المدن والجامعات)"
        subtitle="الصور المميّزة تظهر في خلفية الهيدر الرئيسي، والباقي في قسم «استكشف الصين معنا»."
        action={
          <Button
            onClick={() => {
              const row = emptyRow(rows.length + 1);
              setRows((current) => [...current, row]);
              setOpen(row.id);
            }}
          >
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
                <span className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-ivory">
                  <MediaImage src={row.image_url} alt="" />
                </span>
                <span className="flex-1">
                  <span className="block font-extrabold text-trust-blue">
                    {row.title_ar || "بدون عنوان"}
                  </span>
                  <span className="block text-xs text-charcoal/50">
                    {CATEGORY_LABEL[row.category]} · ترتيب {row.display_order}
                  </span>
                </span>
                {row.is_featured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-imperial-gold/20 px-2.5 py-1 text-xs font-bold text-[#8a6d12]">
                    <Star className="h-3 w-3" />
                    مميّزة
                  </span>
                )}
                <ChevronDown
                  className={`h-4 w-4 text-charcoal/40 transition-transform ${expanded ? "rotate-180" : ""}`}
                />
              </button>

              {expanded && (
                <div className="border-t border-trust-blue/8 p-5">
                  <ImageField
                    value={row.image_url}
                    onChange={(url) => patch(row.id, "image_url", url ?? "")}
                  />

                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <Field label="التصنيف">
                      <select
                        className={inputClass}
                        value={row.category}
                        onChange={(event) => patch(row.id, "category", event.target.value)}
                      >
                        {(Object.keys(CATEGORY_LABEL) as DestinationCategory[]).map((key) => (
                          <option key={key} value={key}>
                            {CATEGORY_LABEL[key]}
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

                    <Field label="صورة مميّزة" hint="تظهر في خلفية الهيدر">
                      <label className="flex h-11 items-center gap-2 rounded-xl border border-trust-blue/12 px-4">
                        <input
                          type="checkbox"
                          checked={row.is_featured}
                          onChange={(event) => patch(row.id, "is_featured", event.target.checked)}
                          className="h-4 w-4 accent-[#c8102e]"
                        />
                        <span className="text-sm font-semibold text-trust-blue">
                          {row.is_featured ? "مفعّلة" : "غير مفعّلة"}
                        </span>
                      </label>
                    </Field>
                  </div>

                  <div className="mt-6">
                    <LangTabs compact>
                      {(lang) => (
                        <Field label={`الاسم / التعليق (${lang})`}>
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
