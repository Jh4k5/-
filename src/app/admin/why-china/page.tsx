import WhyChinaPointsEditor from "@/components/admin/WhyChinaPointsEditor";
import { createServerSupabase } from "@/lib/supabase/server";
import type { WhyChinaPoint } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminWhyChinaPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("why_china_points")
    .select("*")
    .order("display_order", { ascending: true });

  return <WhyChinaPointsEditor initial={(data ?? []) as WhyChinaPoint[]} />;
}
