import SectionsEditor from "@/components/admin/SectionsEditor";
import { createServerSupabase } from "@/lib/supabase/server";
import { DEFAULT_SECTIONS } from "@/lib/seed-content";
import type { SiteSection } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminSectionsPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("site_sections")
    .select("*")
    .order("display_order", { ascending: true });

  const rows = (data ?? []) as SiteSection[];
  const merged = rows.length > 0 ? rows : DEFAULT_SECTIONS;

  return <SectionsEditor initial={merged} />;
}
