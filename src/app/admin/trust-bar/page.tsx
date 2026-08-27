import SettingsGroupEditor from "@/components/admin/SettingsGroupEditor";
import { createServerSupabase } from "@/lib/supabase/server";
import type { SettingRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminTrustBarPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("settings").select("*");

  return (
    <SettingsGroupEditor
      initial={(data ?? []) as SettingRow[]}
      title="شريط الثقة"
      description="الشريط الأحمر أسفل الهيدر في الصفحة الرئيسية. اترك نقطة فارغة لإخفائها، وإذا فرغت النقاط الثلاث اختفى الشريط كاملاً."
      translated={[
        { key: "trust_bar_point_1_text", label: "النقطة الأولى" },
        { key: "trust_bar_point_2_text", label: "النقطة الثانية" },
        { key: "trust_bar_point_3_text", label: "النقطة الثالثة" },
      ]}
    />
  );
}
