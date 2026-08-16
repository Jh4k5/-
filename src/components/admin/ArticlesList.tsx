"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { AdminHeading, Button, StatusNote } from "./ui";
import MediaFrame from "@/components/ui/MediaFrame";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/format";
import type { Article } from "@/lib/types";

const CATEGORY_LABEL: Record<string, string> = {
  about_china: "عن الصين",
  universities: "الجامعات",
  student_life: "الحياة الطلابية",
  tips: "نصائح HSK والتقديم",
};

export default function ArticlesList({ initial }: { initial: Article[] }) {
  const [articles, setArticles] = useState(initial);
  const [note, setNote] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  async function toggleStatus(article: Article) {
    const next = article.status === "published" ? "draft" : "published";
    const previous = articles;
    setArticles((rows) =>
      rows.map((row) => (row.id === article.id ? { ...row, status: next } : row)),
    );

    const supabase = createClient();
    const { error } = await supabase.from("articles").update({ status: next }).eq("id", article.id);
    if (error) {
      setArticles(previous);
      setNote({ type: "error", text: "تعذّر تغيير حالة النشر." });
    } else {
      setNote({ type: "ok", text: next === "published" ? "تم نشر المقال." : "تم تحويله لمسودة." });
    }
  }

  async function remove(article: Article) {
    if (!window.confirm(`حذف المقال «${article.title_ar}» نهائياً؟`)) return;
    const previous = articles;
    setArticles((rows) => rows.filter((row) => row.id !== article.id));

    const supabase = createClient();
    const { error } = await supabase.from("articles").delete().eq("id", article.id);
    if (error) {
      setArticles(previous);
      setNote({ type: "error", text: "تعذّر حذف المقال." });
    }
  }

  return (
    <div>
      <AdminHeading
        title="إدارة المقالات"
        subtitle="كل مقال يُكتب بثلاث لغات عبر تبويبات منفصلة — يمكنك حفظ العربية أولاً وإضافة الترجمات لاحقاً."
        action={
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-2 rounded-full bg-china-red px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-china-red-dark"
          >
            <Plus className="h-4 w-4" />
            مقال جديد
          </Link>
        }
      />

      {note && (
        <div className="mb-5">
          <StatusNote status={note} />
        </div>
      )}

      {articles.length === 0 ? (
        <div className="surface-card p-12 text-center text-sm text-charcoal/55">
          لا توجد مقالات بعد. ابدأ بإضافة أول مقال.
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <article key={article.id} className="surface-card flex flex-wrap items-center gap-4 p-4">
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-ivory">
                <MediaFrame src={article.cover_image} alt="" />
              </div>

              <div className="min-w-48 flex-1">
                <p className="flex items-center gap-1.5 font-extrabold text-trust-blue">
                  {article.title_ar}
                  {article.is_featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-imperial-gold/20 px-2 py-0.5 text-[10px] font-bold text-[#8a6d12]">
                      <Star className="h-3 w-3" />
                      مميّز
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-xs text-charcoal/55">
                  {CATEGORY_LABEL[article.category] ?? article.category} ·{" "}
                  {formatDate(article.created_at, "ar")} · /{article.slug}
                </p>
                <div className="mt-1.5 flex gap-1.5">
                  {(["ar", "en", "ru"] as const).map((lang) => {
                    const filled = Boolean(
                      lang === "ar"
                        ? article.title_ar
                        : lang === "en"
                          ? article.title_en
                          : article.title_ru,
                    );
                    return (
                      <span
                        key={lang}
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                          filled ? "bg-jade/12 text-jade" : "bg-charcoal/8 text-charcoal/40"
                        }`}
                      >
                        {lang}
                      </span>
                    );
                  })}
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  article.status === "published"
                    ? "bg-jade/10 text-jade"
                    : "bg-charcoal/8 text-charcoal/55"
                }`}
              >
                {article.status === "published" ? "منشور" : "مسودة"}
              </span>

              <div className="flex gap-2">
                <Button variant="soft" onClick={() => toggleStatus(article)}>
                  {article.status === "published" ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  {article.status === "published" ? "إخفاء" : "نشر"}
                </Button>

                <Link
                  href={`/admin/articles/${article.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-trust-blue/15 px-5 py-2.5 text-sm font-bold text-trust-blue transition-colors hover:bg-trust-blue/8"
                >
                  <Pencil className="h-4 w-4" />
                  تعديل
                </Link>

                <Button variant="danger" onClick={() => remove(article)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
