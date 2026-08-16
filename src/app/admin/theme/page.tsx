import ThemeEditor from "@/components/admin/ThemeEditor";
import { createServerSupabase } from "@/lib/supabase/server";
import { getHeroSlides } from "@/lib/data";
import type { SettingRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminThemePage() {
  const supabase = await createServerSupabase();
  const [settings, heroSlides] = await Promise.all([
    supabase.from("settings").select("*"),
    getHeroSlides(),
  ]);

  return (
    <ThemeEditor settings={(settings.data ?? []) as SettingRow[]} heroSlides={heroSlides} />
  );
}
