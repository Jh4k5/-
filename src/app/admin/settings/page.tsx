import SettingsEditor from "@/components/admin/SettingsEditor";
import { createServerSupabase } from "@/lib/supabase/server";
import type { SettingRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("settings").select("*");

  return <SettingsEditor initial={(data ?? []) as SettingRow[]} />;
}
