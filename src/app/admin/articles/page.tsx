import ArticlesList from "@/components/admin/ArticlesList";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Article } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  return <ArticlesList initial={(data ?? []) as Article[]} />;
}
