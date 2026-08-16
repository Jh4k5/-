import DestinationsEditor from "@/components/admin/DestinationsEditor";
import { createServerSupabase } from "@/lib/supabase/server";
import type { DestinationMedia } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminDestinationsPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("destination_media")
    .select("*")
    .order("display_order", { ascending: true });

  return <DestinationsEditor initial={(data ?? []) as DestinationMedia[]} />;
}
