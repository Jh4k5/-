import SettingsGroupEditor from "@/components/admin/SettingsGroupEditor";
import { createServerSupabase } from "@/lib/supabase/server";
import type { SettingRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminLanguagePlatformPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("settings").select("*");

  return (
    <SettingsGroupEditor
      initial={(data ?? []) as SettingRow[]}
      title="منصة اللغة الصينية"
      description="كل ما يظهر في قسم المنصة على الرئيسية وفي صفحتها المستقلة /language-platform."
      images={[
        {
          key: "language_platform_image",
          label: "صورة المنصة",
          hint: "لقطة من واجهة المنصة أو صورة معبّرة — تظهر في القسم وفي الصفحة وعند مشاركة الرابط.",
        },
      ]}
      translated={[
        { key: "language_platform_headline", label: "العنوان التسويقي" },
        {
          key: "language_platform_seo_title",
          label: "عنوان محركات البحث",
          hint: "يظهر في نتيجة جوجل — اجعله يتضمن «تعلم اللغة الصينية».",
        },
        {
          key: "language_platform_seo_description",
          label: "وصف محركات البحث",
          long: true,
          hint: "سطران يشرحان المنصة لمن يبحث عن تعلّم الصينية.",
        },
        { key: "language_platform_image_alt", label: "النص البديل للصورة" },
        { key: "language_platform_benefit_1_text", label: "الميزة الأولى" },
        { key: "language_platform_benefit_2_text", label: "الميزة الثانية" },
        { key: "language_platform_benefit_3_text", label: "الميزة الثالثة" },
        { key: "language_platform_audience_1_title", label: "الفئة 1 — العنوان" },
        { key: "language_platform_audience_1_text", label: "الفئة 1 — الوصف", long: true },
        { key: "language_platform_audience_2_title", label: "الفئة 2 — العنوان" },
        { key: "language_platform_audience_2_text", label: "الفئة 2 — الوصف", long: true },
        { key: "language_platform_audience_3_title", label: "الفئة 3 — العنوان" },
        { key: "language_platform_audience_3_text", label: "الفئة 3 — الوصف", long: true },
        { key: "language_platform_integration_text", label: "كيف تتكامل مع رحلتك", long: true },
        { key: "language_platform_terms", label: "شروط العرض", long: true },
        { key: "process_bridge_perk_title", label: "عنوان الميزة المجانية" },
        { key: "process_bridge_perk_duration", label: "المدة (مثال: شهران مجاناً)" },
        { key: "process_bridge_perk_text", label: "نص الميزة الكامل", long: true },
      ]}
      choices={[
        {
          key: "language_platform_offer_status",
          label: "حالة العرض",
          hint: "«قريباً» تخفي مدة العرض دون إخفاء القسم.",
          options: [
            { value: "active", label: "مفعّل" },
            { value: "coming_soon", label: "قريباً" },
            { value: "hidden", label: "مخفي" },
          ],
        },
      ]}
    />
  );
}
