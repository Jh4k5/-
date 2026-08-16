import HeroSlidesEditor from "@/components/admin/HeroSlidesEditor";
import { createServerSupabase } from "@/lib/supabase/server";
import type { DestinationMedia } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("destination_media")
    .select("*")
    .eq("category", "hero")
    .order("display_order", { ascending: true });

  return <HeroSlidesEditor initial={(data ?? []) as DestinationMedia[]} />;
}
