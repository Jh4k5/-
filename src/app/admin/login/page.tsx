"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useState } from "react";
import { AlertCircle, LogIn } from "lucide-react";
import { LogoMark } from "@/components/site/Logo";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("بيانات الدخول غير صحيحة. تحقق من البريد وكلمة المرور.");
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
      <div className="flex flex-col items-center text-center">
        <LogoMark className="h-14 w-14" />
        <h1 className="mt-4 text-2xl font-extrabold text-trust-blue">لوحة تحكم جسر إلى الصين</h1>
        <p className="mt-1 text-sm text-charcoal/60">تسجيل دخول المدير</p>
      </div>

      <div className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-bold text-trust-blue">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            type="email"
            required
            dir="ltr"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-trust-blue/12 px-4 py-3 outline-none transition-all focus:border-china-red/45 focus:shadow-[0_0_0_4px_rgba(200,16,46,0.08)]"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-bold text-trust-blue">
            كلمة المرور
          </label>
          <input
            id="password"
            type="password"
            required
            dir="ltr"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-trust-blue/12 px-4 py-3 outline-none transition-all focus:border-china-red/45 focus:shadow-[0_0_0_4px_rgba(200,16,46,0.08)]"
            placeholder="••••••••"
          />
        </div>
      </div>

      {error && (
        <p className="mt-5 flex items-center gap-2 rounded-xl bg-china-red/10 px-4 py-3 text-sm font-semibold text-china-red">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-china-red px-6 py-3.5 font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-china-red-dark disabled:opacity-60"
      >
        <LogIn className="h-5 w-5" />
        {loading ? "جارٍ الدخول…" : "تسجيل الدخول"}
      </button>

      <Link
        href="/ar"
        className="mt-5 block text-center text-sm text-charcoal/55 transition-colors hover:text-china-red"
      >
        العودة إلى الموقع
      </Link>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-trust-blue-dark px-5 py-16">
      <div
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #1b3a6b 0, transparent 45%), radial-gradient(circle at 80% 80%, #c8102e 0, transparent 45%)",
        }}
      />
      <div className="relative w-full max-w-md">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
