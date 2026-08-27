import ProcessStagesEditor from "@/components/admin/ProcessStagesEditor";
import { createServerSupabase } from "@/lib/supabase/server";
import type { ProcessStage } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminProcessStagesPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("process_stages")
    .select("*")
    .order("display_order", { ascending: true });

  return <ProcessStagesEditor initial={(data ?? []) as ProcessStage[]} />;
}
