import StudyPathsEditor from "@/components/admin/StudyPathsEditor";
import { createServerSupabase } from "@/lib/supabase/server";
import type { StudyPath } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminStudyPathsPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("study_paths")
    .select("*")
    .order("display_order", { ascending: true });

  return <StudyPathsEditor initial={(data ?? []) as StudyPath[]} />;
}
