"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { AdminHeading, Button, Card, Field, LangTabs, StatusNote, inputClass } from "./ui";
import MediaField from "./MediaField";
import { createClient } from "@/lib/supabase/client";
import type { SettingRow } from "@/lib/types";

export type GroupField = {
  key: string;
  label: string;
  hint?: string;
  /** Renders a taller textarea for long-form copy. */
  long?: boolean;
};

export type GroupImage = { key: string; label: string; hint: string };

export type GroupChoice = {
  key: string;
  label: string;
  hint?: string;
  options: { value: string; label: string }[];
};

/**
 * Edits one focused group of settings keys — the section-specific counterpart
 * to the catch-all SettingsEditor, so each part of the site has its own place
 * in the panel instead of one long page.
 *
 * Only the keys named in this group are written, so two group pages editing
 * neighbouring keys can never overwrite each other's values.
 */
export default function SettingsGroupEditor({
  initial,
  title,
  description,
  translated = [],
  images = [],
  plain = [],
  choices = [],
}: {
  initial: SettingRow[];
  title: string;
  description?: string;
  /** Keys with an Arabic/English/Russian value each. */
  translated?: GroupField[];
  /** Keys holding an uploaded image URL. */
  images?: GroupImage[];
  /** Single-value keys (numbers, identifiers) with no translation. */
  plain?: GroupField[];
  /** Single-value keys chosen from a fixed list. */
  choices?: GroupChoice[];
}) {
  const keys = [
    ...translated.map((f) => f.key),
    ...images.map((f) => f.key),
    ...plain.map((f) => f.key),
    ...choices.map((f) => f.key),
  ];

  const [values, setValues] = useState<Record<string, SettingRow>>(() => {
    const map: Record<string, SettingRow> = {};
    for (const key of keys) {
      map[key] = { key, value: "", value_ar: "", value_en: "", value_ru: "" };
    }
    for (const row of initial) {
      if (!keys.includes(row.key)) continue;
      map[row.key] = {
        key: row.key,
        value: row.value ?? "",
        value_ar: row.value_ar ?? "",
        value_en: row.value_en ?? "",
        value_ru: row.value_ru ?? "",
      };
    }
    return map;
  });

  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const patch = (key: string, field: keyof SettingRow, value: string) =>
    setValues((current) => ({
      ...current,
      [key]: {
        ...(current[key] ?? { key, value: "", value_ar: "", value_en: "", value_ru: "" }),
        [field]: value,
      },
    }));

  async function save() {
    setSaving(true);
    setNote(null);

    const payload = keys.map((key) => ({
      key,
      value: values[key]?.value || null,
      value_ar: values[key]?.value_ar || null,
      value_en: values[key]?.value_en || null,
      value_ru: values[key]?.value_ru || null,
      updated_at: new Date().toISOString(),
    }));

    const supabase = createClient();
    const { error } = await supabase.from("settings").upsert(payload, { onConflict: "key" });

    setSaving(false);
    setNote(
      error
        ? { type: "error", text: "تعذّر الحفظ. تحقّق من اتصالك وحاول مجدداً." }
        : { type: "ok", text: "تم الحفظ بنجاح." },
    );
  }

  return (
    <div className="space-y-6">
      <AdminHeading title={title} subtitle={description} />

      {images.length > 0 && (
        <Card>
          <h2 className="text-lg font-extrabold text-trust-blue">الصور</h2>
          <p className="mt-1 text-xs text-charcoal/50">
            ارفع الصورة من جهازك مباشرة — لا حاجة إلى رابط خارجي.
          </p>
          <div className="mt-5 space-y-6">
            {images.map((field) => (
              <MediaField
                key={field.key}
                label={field.label}
                hint={field.hint}
                allowVideo={false}
                value={values[field.key]?.value || null}
                onChange={(url) => patch(field.key, "value", url ?? "")}
              />
            ))}
          </div>
        </Card>
      )}

      {translated.length > 0 && (
        <Card>
          <h2 className="text-lg font-extrabold text-trust-blue">النصوص (بثلاث لغات)</h2>
          <div className="mt-5">
            <LangTabs>
              {(lang) => (
                <div className="space-y-4">
                  {translated.map((field) => (
                    <Field key={field.key} label={`${field.label} (${lang})`} hint={field.hint}>
                      <textarea
                        rows={field.long ? 4 : 1}
                        className={`${inputClass} resize-y`}
                        value={
                          (values[field.key]?.[`value_${lang}` as keyof SettingRow] as string) ?? ""
                        }
                        onChange={(event) =>
                          patch(field.key, `value_${lang}` as keyof SettingRow, event.target.value)
                        }
                      />
                    </Field>
                  ))}
                </div>
              )}
            </LangTabs>
          </div>
        </Card>
      )}

      {(plain.length > 0 || choices.length > 0) && (
        <Card>
          <h2 className="text-lg font-extrabold text-trust-blue">إعدادات عامة</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {plain.map((field) => (
              <Field key={field.key} label={field.label} hint={field.hint}>
                <input
                  className={inputClass}
                  value={values[field.key]?.value ?? ""}
                  onChange={(event) => patch(field.key, "value", event.target.value)}
                />
              </Field>
            ))}
            {choices.map((field) => (
              <Field key={field.key} label={field.label} hint={field.hint}>
                <select
                  className={inputClass}
                  value={values[field.key]?.value ?? ""}
                  onChange={(event) => patch(field.key, "value", event.target.value)}
                >
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
            ))}
          </div>
        </Card>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={saving}>
          <Save className="h-4 w-4" />
          {saving ? "جارٍ الحفظ…" : "حفظ"}
        </Button>
        <StatusNote status={note} />
      </div>
    </div>
  );
}
