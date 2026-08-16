import UniversitiesEditor from "@/components/admin/UniversitiesEditor";
import { createServerSupabase } from "@/lib/supabase/server";
import type { University } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminUniversitiesPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("universities")
    .select("*")
    .order("display_order", { ascending: true });

  return <UniversitiesEditor initial={(data ?? []) as University[]} />;
}
