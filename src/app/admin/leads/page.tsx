import LeadsTable from "@/components/admin/LeadsTable";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Lead } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Server-side pagination: the inbox never materialises the full PII table. */
const PAGE_SIZE = 50;

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const requested = Number.parseInt(params.page ?? "1", 10);
  const page = Number.isFinite(requested) && requested > 0 ? requested : 1;

  const supabase = await createServerSupabase();
  const from = (page - 1) * PAGE_SIZE;

  const [pageQuery, countQuery] = await Promise.all([
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1),
    supabase.from("leads").select("id", { count: "exact", head: true }),
  ]);

  const total = countQuery.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <LeadsTable
      initial={(pageQuery.data ?? []) as Lead[]}
      page={page}
      totalPages={totalPages}
      total={total}
    />
  );
}
