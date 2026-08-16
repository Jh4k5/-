import ProcessStepsEditor from "@/components/admin/ProcessStepsEditor";
import { createServerSupabase } from "@/lib/supabase/server";
import type { ProcessStep } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminProcessPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("process_steps")
    .select("*")
    .order("display_order", { ascending: true });

  return <ProcessStepsEditor initial={(data ?? []) as ProcessStep[]} />;
}
