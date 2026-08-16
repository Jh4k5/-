import ThemeEditor from "@/components/admin/ThemeEditor";
import { createServerSupabase } from "@/lib/supabase/server";
import type { DestinationMedia, SettingRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminThemePage() {
  const supabase = await createServerSupabase();
  const [settings, hero] = await Promise.all([
    supabase.from("settings").select("*"),
    supabase
      .from("destination_media")
      .select("*")
      .or("is_featured.eq.true,category.eq.hero")
      .order("display_order", { ascending: true }),
  ]);

  return (
    <ThemeEditor
      settings={(settings.data ?? []) as SettingRow[]}
      heroSlides={(hero.data ?? []) as DestinationMedia[]}
    />
  );
}
