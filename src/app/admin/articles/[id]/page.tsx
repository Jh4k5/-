import { notFound } from "next/navigation";
import ArticleEditor from "@/components/admin/ArticleEditor";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Article } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ArticleEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "new") return <ArticleEditor article={null} />;

  const supabase = await createServerSupabase();
  const { data } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return <ArticleEditor article={data as Article} />;
}
