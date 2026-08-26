import FaqEditor from "@/components/admin/FaqEditor";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Faq } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminFaqPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .order("display_order", { ascending: true });

  return <FaqEditor initial={(data ?? []) as Faq[]} />;
}
