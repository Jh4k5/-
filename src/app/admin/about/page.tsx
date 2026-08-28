import SettingsGroupEditor from "@/components/admin/SettingsGroupEditor";
import { createServerSupabase } from "@/lib/supabase/server";
import type { SettingRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("settings").select("*");

  return (
    <SettingsGroupEditor
      initial={(data ?? []) as SettingRow[]}
      title="من نحن"
      description="نبذة الشركة، المؤسس، والرئيس التنفيذي — كما تظهر في صفحة «من نحن». لا تظهر بطاقة أي شخص إلا بعد تعبئة الاسم ورفع الصورة معاً (وتفعيل الخيار في حالة الرئيس التنفيذي) — هذا يمنع ظهور بطاقة نصف فارغة على الموقع."
      images={[
        {
          key: "about_image_1",
          label: "صورة القسم الرئيسية",
          hint: "الصورة الكبيرة أعلى قصة الشركة. اتركها فارغة لاستخدام رسمة الهوية.",
        },
        {
          key: "about_image_2",
          label: "الصورة الثانية (المتداخلة)",
          hint: "تظهر أصغر ومتداخلة فوق الصورة الأولى لإعطاء عمق.",
        },
        {
          key: "founder_photo",
          label: "صورة المؤسس",
          hint: "مطلوبة لظهور البطاقة. تظهر صغيرة ودائرية بجانب الاسم مباشرة، وصورة مربعة تعطي أفضل نتيجة.",
        },
        {
          key: "ceo_photo",
          label: "صورة الرئيس التنفيذي",
          hint: "لا تظهر البطاقة إلا إذا كان القسم مفعّلاً والاسم والصورة موجودين معاً.",
        },
      ]}
      translated={[
        { key: "about_image_1_alt", label: "النص البديل للصورة الأولى" },
        { key: "about_image_2_alt", label: "النص البديل للصورة الثانية" },
        {
          key: "company_legal_name",
          label: "الاسم الرسمي للجهة",
          hint: "يظهر تحت نبذة الشركة، ويُستخدم في بيانات SEO المهيكلة ليتعرّف جوجل على الموقع تحت هذا الاسم أيضاً.",
        },
        { key: "company_intro", label: "نبذة الشركة", long: true },
        { key: "about_team_title", label: "عنوان قسم الفريق" },
        { key: "about_story_text", label: "قصتنا", long: true },
        { key: "about_vision_text", label: "الرؤية", long: true },
        { key: "about_mission_text", label: "الرسالة", long: true },
        { key: "about_why_exclusive_text", label: "لماذا الصين حصراً؟", long: true },
        { key: "founder_name", label: "اسم المؤسس", hint: "مطلوب لظهور البطاقة" },
        { key: "founder_title", label: "منصب المؤسس" },
        { key: "founder_bio", label: "نبذة المؤسس", long: true },
        { key: "ceo_name", label: "اسم الرئيس التنفيذي", hint: "مطلوب لظهور البطاقة" },
        { key: "ceo_title", label: "منصب الرئيس التنفيذي" },
        { key: "ceo_bio", label: "نبذة الرئيس التنفيذي", long: true },
      ]}
      plain={[{ key: "company_founded_year", label: "سنة التأسيس", hint: "مثال: 2019" }]}
      choices={[
        {
          key: "ceo_section_enabled",
          label: "إظهار الرئيس التنفيذي",
          hint: "اجعله «ظاهر» بعد تعبئة الاسم والصورة، وإلا يبقى القسم مخفياً.",
          options: [
            { value: "false", label: "مخفي" },
            { value: "true", label: "ظاهر" },
          ],
        },
      ]}
    />
  );
}
