import StoriesEditor from "@/components/admin/StoriesEditor";
import { createServerSupabase } from "@/lib/supabase/server";
import type { SuccessStory } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminStoriesPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("success_stories")
    .select("*")
    .order("display_order", { ascending: true });

  return <StoriesEditor initial={(data ?? []) as SuccessStory[]} />;
}
