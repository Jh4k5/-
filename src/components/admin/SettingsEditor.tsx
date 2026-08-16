"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { AdminHeading, Button, Card, Field, LangTabs, StatusNote, inputClass } from "./ui";
import { createClient } from "@/lib/supabase/client";
import type { SettingRow } from "@/lib/types";

const SHARED_FIELDS: { key: string; label: string; hint?: string; ltr?: boolean }[] = [
  { key: "whatsapp_number", label: "رقم واتساب", hint: "بصيغة دولية", ltr: true },
  { key: "contact_email", label: "البريد الإلكتروني", ltr: true },
  { key: "contact_phone", label: "رقم الهاتف", ltr: true },
  { key: "facebook_url", label: "رابط فيسبوك", ltr: true },
  { key: "instagram_url", label: "رابط إنستغرام", ltr: true },
  { key: "tiktok_url", label: "رابط تيك توك", ltr: true },
  { key: "youtube_url", label: "رابط يوتيوب", ltr: true },
];

const STAT_FIELDS: { key: string; label: string }[] = [
  { key: "stat_students_helped", label: "عدد الطلاب الذين تمت مساعدتهم" },
  { key: "stat_years_experience", label: "سنوات الخبرة" },
  { key: "stat_universities", label: "عدد الجامعات" },
  { key: "stat_satisfaction_rate", label: "نسبة رضا الطلاب (%)" },
];

const TRANSLATED_FIELDS: { key: string; label: string }[] = [
  { key: "office_location", label: "موقع المكتب" },
  { key: "footer_note", label: "جملة الفوتر" },
];

const ALL_KEYS = [
  ...SHARED_FIELDS.map((field) => field.key),
  ...STAT_FIELDS.map((field) => field.key),
  ...TRANSLATED_FIELDS.map((field) => field.key),
];

type Values = Record<string, SettingRow>;

export default function SettingsEditor({ initial }: { initial: SettingRow[] }) {
  const [values, setValues] = useState<Values>(() => {
    const map: Values = {};
    for (const key of ALL_KEYS) {
      map[key] = { key, value: "", value_ar: "", value_en: "", value_ru: "" };
    }
    for (const row of initial) {
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
    setValues((current) => ({ ...current, [key]: { ...current[key], [field]: value } }));

  async function saveAll() {
    setSaving(true);
    setNote(null);

    const payload = ALL_KEYS.map((key) => ({
      key,
      value: values[key].value || null,
      value_ar: values[key].value_ar || null,
      value_en: values[key].value_en || null,
      value_ru: values[key].value_ru || null,
      updated_at: new Date().toISOString(),
    }));

    const supabase = createClient();
    const { error } = await supabase.from("settings").upsert(payload, { onConflict: "key" });

    setSaving(false);
    setNote(
      error
        ? { type: "error", text: "تعذّر حفظ الإعدادات." }
        : { type: "ok", text: "تم حفظ الإعدادات بنجاح." },
    );
  }

  return (
    <div>
      <AdminHeading
        title="إعدادات الموقع"
        subtitle="روابط التواصل، الأرقام الظاهرة في شريط الإحصائيات، والنصوص الثابتة بثلاث لغات."
        action={
          <Button onClick={saveAll} loading={saving}>
            <Save className="h-4 w-4" />
            حفظ كل الإعدادات
          </Button>
        }
      />

      {note && (
        <div className="mb-5">
          <StatusNote status={note} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-extrabold text-trust-blue">وسائل التواصل</h2>
          <div className="mt-5 space-y-4">
            {SHARED_FIELDS.map((field) => (
              <Field key={field.key} label={field.label} hint={field.hint}>
                <input
                  className={inputClass}
                  dir={field.ltr ? "ltr" : undefined}
                  value={values[field.key]?.value ?? ""}
                  onChange={(event) => patch(field.key, "value", event.target.value)}
                />
              </Field>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-extrabold text-trust-blue">شريط الإحصائيات</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {STAT_FIELDS.map((field) => (
                <Field key={field.key} label={field.label}>
                  <input
                    type="number"
                    className={inputClass}
                    value={values[field.key]?.value ?? ""}
                    onChange={(event) => patch(field.key, "value", event.target.value)}
                  />
                </Field>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-extrabold text-trust-blue">نصوص ثابتة (ثلاث لغات)</h2>
            <div className="mt-5">
              <LangTabs>
                {(lang) => (
                  <div className="space-y-4">
                    {TRANSLATED_FIELDS.map((field) => (
                      <Field key={field.key} label={`${field.label} (${lang})`}>
                        <input
                          className={inputClass}
                          value={
                            (values[field.key]?.[`value_${lang}` as keyof SettingRow] as string) ??
                            ""
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
        </div>
      </div>
    </div>
  );
}
