import ServicesEditor from "@/components/admin/ServicesEditor";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Service } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("services")
    .select("*")
    .order("display_order", { ascending: true });

  return <ServicesEditor initial={(data ?? []) as Service[]} />;
}
