import GalleryEditor from "@/components/admin/GalleryEditor";
import { createServerSupabase } from "@/lib/supabase/server";
import type { GalleryItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("gallery")
    .select("*")
    .order("display_order", { ascending: true });

  return <GalleryEditor initial={(data ?? []) as GalleryItem[]} />;
}
