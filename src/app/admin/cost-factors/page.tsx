import CostFactorsEditor from "@/components/admin/CostFactorsEditor";
import { createServerSupabase } from "@/lib/supabase/server";
import type { CostFactor } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminCostFactorsPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("cost_factors")
    .select("*")
    .order("display_order", { ascending: true });

  return <CostFactorsEditor initial={(data ?? []) as CostFactor[]} />;
}
