import AdmissionsEditor from "@/components/admin/AdmissionsEditor";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Admission } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminAdmissionsPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("admissions")
    .select("*")
    .order("display_order", { ascending: true });

  return <AdmissionsEditor initial={(data ?? []) as Admission[]} />;
}
