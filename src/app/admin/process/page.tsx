import ProcessStepsEditor from "@/components/admin/ProcessStepsEditor";
import ProcessTrustBadgesEditor from "@/components/admin/ProcessTrustBadgesEditor";
import { AdminHeading } from "@/components/admin/ui";
import { createServerSupabase } from "@/lib/supabase/server";
import type { ProcessStep, ProcessTrustBadge } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminProcessPage() {
  const supabase = await createServerSupabase();
  const [steps, badges] = await Promise.all([
    supabase.from("process_steps").select("*").order("display_order", { ascending: true }),
    supabase.from("process_trust_badges").select("*").order("display_order", { ascending: true }),
  ]);

  return (
    <div>
      <AdminHeading
        title="خطوات العمل معنا"
        subtitle="بطاقات الثقة أعلى القسم، ثم الخط الزمني الكامل لرحلة الطالب معنا."
      />
      <div className="mb-10">
        <ProcessTrustBadgesEditor initial={(badges.data ?? []) as ProcessTrustBadge[]} />
      </div>
      <div className="border-t border-trust-blue/10 pt-8">
        <ProcessStepsEditor initial={(steps.data ?? []) as ProcessStep[]} />
      </div>
    </div>
  );
}
