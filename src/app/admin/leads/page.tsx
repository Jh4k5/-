import LeadsTable from "@/components/admin/LeadsTable";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Lead } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  return <LeadsTable initial={(data ?? []) as Lead[]} />;
}
