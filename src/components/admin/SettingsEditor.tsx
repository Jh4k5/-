"use client";

import { useState } from "react";
import { Plus, Save } from "lucide-react";
import { AdminHeading, Button, Card, Field, LangTabs, StatusNote, inputClass } from "./ui";
import MediaField from "./MediaField";
import { createClient } from "@/lib/supabase/client";
import type { SettingRow } from "@/lib/types";

const SHARED_FIELDS: { key: string; label: string; hint?: string; ltr?: boolean }[] = [
  { key: "whatsapp_number", label: "رقم واتساب", hint: "بصيغة دولية", ltr: true },
  { key: "contact_email", label: "البريد الإلكتروني", ltr: true },
  { key: "contact_phone", label: "رقم الهاتف", ltr: true },
];

const STATUS_OPTIONS = [
  { value: "active", label: "مفعّل" },
  { value: "coming_soon", label: "قريباً" },
  { value: "hidden", label: "مخفي" },
];

const SOCIAL_FIELDS: { urlKey: string; statusKey: string; label: string }[] = [
  { urlKey: "facebook_url", statusKey: "facebook_status", label: "فيسبوك" },
  { urlKey: "instagram_url", statusKey: "instagram_status", label: "إنستغرام" },
  { urlKey: "tiktok_url", statusKey: "tiktok_status", label: "تيك توك" },
  { urlKey: "youtube_url", statusKey: "youtube_status", label: "يوتيوب" },
];

const STAT_FIELDS: { key: string; label: string }[] = [
  { key: "stat_students_helped", label: "عدد الطلاب الذين تمت مساعدتهم" },
  { key: "stat_years_experience", label: "سنوات الخبرة" },
  { key: "stat_universities", label: "عدد الجامعات" },
  { key: "stat_satisfaction_rate", label: "نسبة رضا الطلاب (%)" },
];

const STAT_LABEL_FIELDS: { key: string; label: string }[] = [
  { key: "stat_students_helped_label", label: "تسمية عدد الطلاب" },
  { key: "stat_years_experience_label", label: "تسمية سنوات الخبرة" },
  { key: "stat_universities_label", label: "تسمية عدد الجامعات" },
  { key: "stat_satisfaction_rate_label", label: "تسمية نسبة الرضا" },
  { key: "stats_measured_at", label: "تاريخ/ملاحظة القياس" },
];

const HERO_FIELDS: { key: string; label: string }[] = [
  { key: "hero_headline", label: "العنوان الرئيسي" },
  { key: "hero_description", label: "الوصف" },
  { key: "hero_cta_primary", label: "زر الحجز الأساسي" },
  { key: "hero_cta_helper_text", label: "سطر الشرح أسفل زر الحجز" },
  { key: "hero_cta_secondary", label: "زر واتساب" },
  { key: "hero_services_link_label", label: "رابط الخدمات (نصي)" },
];

const FOOTER_FIELDS: { key: string; label: string }[] = [
  { key: "footer_about", label: "نبذة الفوتر" },
  { key: "footer_quick_links_title", label: "عنوان الروابط السريعة" },
  { key: "footer_contact_title", label: "عنوان التواصل" },
  { key: "footer_rights", label: "جملة حقوق النشر" },
  { key: "footer_builtwith", label: "الجملة الذهبية أسفل الوصف" },
];

const BRIDGE_PERK_FIELDS: { key: string; label: string }[] = [
  { key: "process_bridge_perk_title", label: "عنوان الميزة" },
  { key: "process_bridge_perk_duration", label: "المدة (مثال: شهران مجاناً)" },
  { key: "process_bridge_perk_text", label: "نص الميزة الكامل" },
];

const DISCLAIMER_FIELDS: { key: string; label: string }[] = [
  { key: "university_examples_disclaimer", label: "إخلاء مسؤولية أمثلة الجامعات" },
];

const CONTACT_FIELDS: { key: string; label: string }[] = [
  { key: "contact_submit_label", label: "نص زر الإرسال" },
  { key: "contact_after_submit_note", label: "ماذا يحدث بعد الإرسال" },
  { key: "contact_privacy_consent_text", label: "نص موافقة الخصوصية" },
  { key: "contact_success_message", label: "رسالة النجاح" },
  { key: "contact_error_message", label: "رسالة الخطأ" },
];

const LANGUAGE_PLATFORM_FIELDS: { key: string; label: string }[] = [
  { key: "language_platform_headline", label: "العنوان التسويقي" },
  { key: "language_platform_image_alt", label: "النص البديل للصورة" },
  { key: "language_platform_benefit_1_text", label: "الميزة الأولى" },
  { key: "language_platform_benefit_2_text", label: "الميزة الثانية" },
  { key: "language_platform_benefit_3_text", label: "الميزة الثالثة" },
  { key: "language_platform_audience_1_title", label: "الفئة 1 — العنوان" },
  { key: "language_platform_audience_1_text", label: "الفئة 1 — الوصف" },
  { key: "language_platform_audience_2_title", label: "الفئة 2 — العنوان" },
  { key: "language_platform_audience_2_text", label: "الفئة 2 — الوصف" },
  { key: "language_platform_audience_3_title", label: "الفئة 3 — العنوان" },
  { key: "language_platform_audience_3_text", label: "الفئة 3 — الوصف" },
  { key: "language_platform_integration_text", label: "كيف تتكامل مع رحلتك" },
  { key: "language_platform_terms", label: "شروط العرض" },
];

/**
 * Image slots that must be uploadable from the device, not pasted as a URL.
 * These render with <MediaField>, the same uploader the other editors use.
 */
const IMAGE_FIELDS: { key: string; label: string; hint: string }[] = [
  {
    key: "logo_url",
    label: "شعار الموقع",
    hint: "يظهر في الهيدر والتذييل. ارفع صورة شفافة (PNG/SVG) بجودة عالية.",
  },
  {
    key: "founder_photo",
    label: "صورة المؤسس",
    hint: "تظهر صغيرة بجانب اسم المؤسس في صفحة «من نحن».",
  },
  {
    key: "ceo_photo",
    label: "صورة الرئيس التنفيذي",
    hint: "لا يظهر قسم الرئيس التنفيذي إلا إذا كان مفعّلاً والاسم والصورة موجودين معاً.",
  },
  {
    key: "language_platform_image",
    label: "صورة منصة اللغة",
    hint: "لقطة من واجهة المنصة أو صورة معبّرة — تظهر في قسم المنصة وصفحتها.",
  },
  {
    key: "default_og_image",
    label: "صورة المشاركة الافتراضية (OG)",
    hint: "تظهر عند مشاركة رابط الموقع على واتساب وتويتر وفيسبوك. المقاس المفضّل 1200×630.",
  },
];

const FOUNDER_FIELDS: { key: string; label: string }[] = [
  { key: "company_intro", label: "نبذة الشركة" },
  { key: "company_founded_year", label: "سنة التأسيس" },
  { key: "about_team_title", label: "عنوان قسم الفريق" },
  { key: "founder_name", label: "اسم المؤسس" },
  { key: "founder_title", label: "منصب المؤسس" },
  { key: "founder_bio", label: "نبذة المؤسس" },
  { key: "ceo_name", label: "اسم الرئيس التنفيذي" },
  { key: "ceo_title", label: "منصب الرئيس التنفيذي" },
  { key: "ceo_bio", label: "نبذة الرئيس التنفيذي" },
];

const TRANSLATED_FIELDS: { key: string; label: string }[] = [
  { key: "office_location", label: "موقع المكتب" },
  ...HERO_FIELDS,
  ...STAT_LABEL_FIELDS,
  ...FOOTER_FIELDS,
  ...BRIDGE_PERK_FIELDS,
  ...DISCLAIMER_FIELDS,
  ...CONTACT_FIELDS,
  ...LANGUAGE_PLATFORM_FIELDS,
  ...FOUNDER_FIELDS,
];

const KNOWN_KEYS = [
  ...SHARED_FIELDS.map((field) => field.key),
  ...SOCIAL_FIELDS.flatMap((field) => [field.urlKey, field.statusKey]),
  ...STAT_FIELDS.map((field) => field.key),
  ...TRANSLATED_FIELDS.map((field) => field.key),
  ...IMAGE_FIELDS.map((field) => field.key),
  "language_platform_offer_status",
  "ceo_section_enabled",
  "site_url",
];

const KEY_PATTERN = /^[a-z][a-z0-9_]*$/;

type Values = Record<string, SettingRow>;

export default function SettingsEditor({ initial }: { initial: SettingRow[] }) {
  const [customKeys, setCustomKeys] = useState<string[]>(() =>
    initial.filter((row) => !KNOWN_KEYS.includes(row.key)).map((row) => row.key),
  );
  const [newKey, setNewKey] = useState("");
  const [keyError, setKeyError] = useState<string | null>(null);

  const [values, setValues] = useState<Values>(() => {
    const map: Values = {};
    for (const key of KNOWN_KEYS) {
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
    setValues((current) => ({
      ...current,
      [key]: { ...(current[key] ?? { key, value: "", value_ar: "", value_en: "", value_ru: "" }), [field]: value },
    }));

  function addCustomKey() {
    const key = newKey.trim();
    if (!KEY_PATTERN.test(key)) {
      setKeyError("استخدم حروفاً إنجليزية صغيرة وأرقاماً وشرطة سفلية فقط، تبدأ بحرف (مثال: my_new_key).");
      return;
    }
    if (KNOWN_KEYS.includes(key) || customKeys.includes(key)) {
      setKeyError("هذا المفتاح موجود بالفعل.");
      return;
    }
    setKeyError(null);
    setCustomKeys((current) => [...current, key]);
    setValues((current) => ({ ...current, [key]: { key, value: "", value_ar: "", value_en: "", value_ru: "" } }));
    setNewKey("");
  }

  async function saveAll() {
    setSaving(true);
    setNote(null);

    const allKeys = [...KNOWN_KEYS, ...customKeys];
    const payload = allKeys.map((key) => ({
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
        ? { type: "error", text: "تعذّر حفظ الإعدادات." }
        : { type: "ok", text: "تم حفظ الإعدادات بنجاح." },
    );
  }

  const translatedCard = (title: string, fields: { key: string; label: string }[], hint?: string) => (
    <Card>
      <h2 className="text-lg font-extrabold text-trust-blue">{title}</h2>
      {hint && <p className="mt-1 text-xs text-charcoal/50">{hint}</p>}
      <div className="mt-5">
        <LangTabs>
          {(lang) => (
            <div className="space-y-4">
              {fields.map((field) => (
                <Field key={field.key} label={`${field.label} (${lang})`}>
                  <textarea
                    rows={field.key.includes("description") || field.key.endsWith("_text") || field.key.endsWith("_note") ? 3 : 1}
                    className={`${inputClass} resize-y`}
                    value={(values[field.key]?.[`value_${lang}` as keyof SettingRow] as string) ?? ""}
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
  );

  return (
    <div>
      <AdminHeading
        title="إعدادات الموقع"
        subtitle="كل نص أو رقم يظهر للزوار — من الهيرو إلى نموذج التواصل — قابل للتعديل من هنا بثلاث لغات."
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
        <div className="space-y-6">
          {translatedCard("الهيرو (الصفحة الرئيسية)", HERO_FIELDS)}

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

          <Card>
            <h2 className="text-lg font-extrabold text-trust-blue">الروابط الاجتماعية</h2>
            <p className="mt-1 text-xs text-charcoal/50">
              اختر «مفعّل» لعرض الرابط، «قريباً» لعرض شارة غير قابلة للنقر، أو «مخفي» لإخفائه كلياً.
            </p>
            <div className="mt-5 space-y-4">
              {SOCIAL_FIELDS.map((field) => (
                <div key={field.urlKey} className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
                  <Field label={field.label}>
                    <input
                      dir="ltr"
                      className={inputClass}
                      value={values[field.urlKey]?.value ?? ""}
                      onChange={(event) => patch(field.urlKey, "value", event.target.value)}
                    />
                  </Field>
                  <Field label="الحالة">
                    <select
                      className={inputClass}
                      value={values[field.statusKey]?.value || "hidden"}
                      onChange={(event) => patch(field.statusKey, "value", event.target.value)}
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              ))}
            </div>
          </Card>

          {translatedCard("التذييل", [{ key: "office_location", label: "موقع المكتب" }, ...FOOTER_FIELDS])}

          {translatedCard("قسم الجامعات — إخلاء مسؤولية", DISCLAIMER_FIELDS)}
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-extrabold text-trust-blue">أرقام شريط الإحصائيات</h2>
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

          {translatedCard("تسميات الإحصائيات", STAT_LABEL_FIELDS)}

          {translatedCard(
            "اشتراك Bridge to Chinese",
            BRIDGE_PERK_FIELDS,
            "الميزة الإضافية المجانية المرافقة للتسجيل معنا.",
          )}

          {translatedCard("نموذج التواصل", CONTACT_FIELDS)}

          <Card>
            <h2 className="text-lg font-extrabold text-trust-blue">الصور</h2>
            <p className="mt-1 text-xs text-charcoal/50">
              ارفع كل صورة من جهازك مباشرة — لا حاجة لرابط خارجي.
            </p>
            <div className="mt-6 space-y-8">
              {IMAGE_FIELDS.map((field) => (
                <MediaField
                  key={field.key}
                  label={field.label}
                  hint={field.hint}
                  allowVideo={false}
                  showScenes={field.key === "language_platform_image"}
                  value={values[field.key]?.value ?? null}
                  onChange={(url) => patch(field.key, "value", url ?? "")}
                />
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-extrabold text-trust-blue">منصة اللغة — حالة العرض</h2>
            <div className="mt-5">
              <Field label="حالة عرض «شهران مجاناً»" hint="«مخفي» يخفي الختم بلا نص بديل.">
                <select
                  className={inputClass}
                  value={values.language_platform_offer_status?.value || "active"}
                  onChange={(event) =>
                    patch("language_platform_offer_status", "value", event.target.value)
                  }
                >
                  <option value="active">مفعّل</option>
                  <option value="hidden">مخفي</option>
                </select>
              </Field>
            </div>
          </Card>

          {translatedCard(
            "الشركة والمؤسس والرئيس التنفيذي",
            FOUNDER_FIELDS,
            "تظهر في صفحة «من نحن». صور المؤسس والرئيس التنفيذي تُرفع من بطاقة «الصور» أعلاه.",
          )}

          <Card>
            <h2 className="text-lg font-extrabold text-trust-blue">قسم الرئيس التنفيذي</h2>
            <div className="mt-5">
              <Field
                label="إظهار القسم"
                hint="لا يظهر إلا إذا كان مفعّلاً والاسم والصورة موجودين معاً."
              >
                <select
                  className={inputClass}
                  value={values.ceo_section_enabled?.value || "false"}
                  onChange={(event) => patch("ceo_section_enabled", "value", event.target.value)}
                >
                  <option value="false">مخفي</option>
                  <option value="true">ظاهر</option>
                </select>
              </Field>
            </div>
          </Card>

          {translatedCard("منصة اللغة الصينية — النصوص", LANGUAGE_PLATFORM_FIELDS)}

          <Card>
            <h2 className="text-lg font-extrabold text-trust-blue">إعداد مخصص</h2>
            <p className="mt-1 text-xs text-charcoal/50">
              أضف أي مفتاح إعداد جديد دون الحاجة لتعديل الكود — يظهر تلقائياً هنا لاحقاً للتعديل.
            </p>

            {customKeys.length > 0 && (
              <div className="mt-5 space-y-4">
                {customKeys.map((key) => (
                  <div key={key} className="rounded-xl border border-trust-blue/10 p-4">
                    <p className="mb-3 text-xs font-bold text-charcoal/60" dir="ltr">
                      {key}
                    </p>
                    <div className="space-y-3">
                      <Field label="قيمة عامة (اختياري)">
                        <input
                          className={inputClass}
                          value={values[key]?.value ?? ""}
                          onChange={(event) => patch(key, "value", event.target.value)}
                        />
                      </Field>
                      <LangTabs compact>
                        {(lang) => (
                          <Field label={`نص (${lang})`}>
                            <input
                              className={inputClass}
                              value={(values[key]?.[`value_${lang}` as keyof SettingRow] as string) ?? ""}
                              onChange={(event) =>
                                patch(key, `value_${lang}` as keyof SettingRow, event.target.value)
                              }
                            />
                          </Field>
                        )}
                      </LangTabs>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 flex flex-col gap-2 border-t border-trust-blue/10 pt-5 sm:flex-row sm:items-start">
              <div className="flex-1">
                <input
                  dir="ltr"
                  placeholder="my_new_key"
                  className={inputClass}
                  value={newKey}
                  onChange={(event) => {
                    setNewKey(event.target.value);
                    setKeyError(null);
                  }}
                />
                {keyError && <p className="mt-1.5 text-xs font-semibold text-china-red">{keyError}</p>}
              </div>
              <Button variant="soft" onClick={addCustomKey}>
                <Plus className="h-4 w-4" />
                إضافة مفتاح
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <div className="sticky bottom-4 mt-6 lg:hidden">
        <Button onClick={saveAll} loading={saving} className="w-full shadow-lg">
          <Save className="h-4 w-4" />
          حفظ الإعدادات
        </Button>
      </div>
    </div>
  );
}
