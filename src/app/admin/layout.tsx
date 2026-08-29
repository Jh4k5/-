import type { Metadata } from "next";
import AdminNav from "@/components/admin/AdminNav";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "لوحة التحكم | جسر الصين التعليمية",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The login screen renders standalone; the middleware guards every other route.
  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-ivory">
      <AdminNav email={user.email ?? ""} />
      <div className="lg:ps-[17rem]">
        <div className="admin-safe-bottom mx-auto w-full max-w-6xl px-4 pt-20 pb-8 sm:px-6 lg:pt-8">
          {children}
        </div>
      </div>
    </div>
  );
}
