"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Save } from "lucide-react";
import {
  AdminHeading,
  Button,
  Card,
  Field,
  LangTabs,
  RichTextEditor,
  StatusNote,
  inputClass,
} from "./ui";
import ImageField from "./ImageField";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/format";
import type { Article, ArticleCategory, ArticleStatus } from "@/lib/types";

const CATEGORIES: { value: ArticleCategory; label: string }[] = [
  { value: "about_china", label: "عن الصين" },
  { value: "universities", label: "الجامعات" },
  { value: "student_life", label: "الحياة الطلابية" },
  { value: "tips", label: "نصائح HSK والتقديم" },
];

type Draft = {
  slug: string;
  category: ArticleCategory;
  status: ArticleStatus;
  cover_image: string | null;
  title_ar: string;
  title_en: string;
  title_ru: string;
  excerpt_ar: string;
  excerpt_en: string;
  excerpt_ru: string;
  content_ar: string;
  content_en: string;
  content_ru: string;
};

export default function ArticleEditor({ article }: { article: Article | null }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const [draft, setDraft] = useState<Draft>({
    slug: article?.slug ?? "",
    category: article?.category ?? "about_china",
    status: article?.status ?? "draft",
    cover_image: article?.cover_image ?? null,
    title_ar: article?.title_ar ?? "",
    title_en: article?.title_en ?? "",
    title_ru: article?.title_ru ?? "",
    excerpt_ar: article?.excerpt_ar ?? "",
    excerpt_en: article?.excerpt_en ?? "",
    excerpt_ru: article?.excerpt_ru ?? "",
    content_ar: article?.content_ar ?? "",
    content_en: article?.content_en ?? "",
    content_ru: article?.content_ru ?? "",
  });

  const set = (key: keyof Draft, value: unknown) =>
    setDraft((current) => ({ ...current, [key]: value }) as Draft);

  async function save() {
    if (!draft.title_ar.trim()) {
      setNote({ type: "error", text: "العنوان بالعربية مطلوب (اللغة الأساسية)." });
      return;
    }

    setSaving(true);
    setNote(null);

    const slug =
      slugify(draft.slug) || slugify(draft.title_en || draft.title_ar) || `post-${Date.now()}`;

    const payload = {
      slug,
      category: draft.category,
      status: draft.status,
      cover_image: draft.cover_image,
      title_ar: draft.title_ar.trim(),
      title_en: draft.title_en.trim() || null,
      title_ru: draft.title_ru.trim() || null,
      excerpt_ar: draft.excerpt_ar.trim() || null,
      excerpt_en: draft.excerpt_en.trim() || null,
      excerpt_ru: draft.excerpt_ru.trim() || null,
      content_ar: draft.content_ar,
      content_en: draft.content_en || null,
      content_ru: draft.content_ru || null,
    };

    const supabase = createClient();
    const result = article
      ? await supabase.from("articles").update(payload).eq("id", article.id).select("id").single()
      : await supabase.from("articles").insert(payload).select("id").single();

    setSaving(false);

    if (result.error) {
      setNote({
        type: "error",
        text:
          result.error.code === "23505"
            ? "الرابط (slug) مستخدم في مقال آخر — اختر رابطاً مختلفاً."
            : "تعذّر الحفظ. حاول مرة أخرى.",
      });
      return;
    }

    setNote({ type: "ok", text: "تم حفظ المقال بنجاح." });
    router.refresh();
    if (!article) router.push(`/admin/articles/${result.data.id}`);
  }

  return (
    <div>
      <AdminHeading
        title={article ? "تعديل مقال" : "مقال جديد"}
        subtitle="املأ اللغة العربية أولاً، ثم أضف الإنجليزية والروسية من التبويبات. المحتوى غير المترجم يُعرض بالعربية تلقائياً."
        action={
          <Link
            href="/admin/articles"
            className="inline-flex items-center gap-2 rounded-full border border-trust-blue/15 px-5 py-2.5 text-sm font-bold text-trust-blue transition-colors hover:bg-trust-blue/8"
          >
            <ArrowRight className="h-4 w-4" />
            رجوع
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <Card>
          <LangTabs>
            {(lang) => (
              <div className="space-y-5">
                <Field
                  label={`العنوان (${lang})`}
                  hint={lang === "ar" ? "مطلوب" : "اختياري — يُستبدل بالعربية إن تُرك فارغاً"}
                >
                  <input
                    className={inputClass}
                    value={draft[`title_${lang}` as const]}
                    onChange={(event) => set(`title_${lang}` as keyof Draft, event.target.value)}
                  />
                </Field>

                <Field label={`مقتطف قصير (${lang})`} hint="يظهر في بطاقة المقال">
                  <textarea
                    rows={2}
                    className={`${inputClass} resize-y`}
                    value={draft[`excerpt_${lang}` as const]}
                    onChange={(event) => set(`excerpt_${lang}` as keyof Draft, event.target.value)}
                  />
                </Field>

                <div>
                  <p className="mb-1.5 text-sm font-bold text-trust-blue">المحتوى ({lang})</p>
                  <RichTextEditor
                    key={lang}
                    dir={lang === "ar" ? "rtl" : "ltr"}
                    value={draft[`content_${lang}` as const]}
                    onChange={(html) => set(`content_${lang}` as keyof Draft, html)}
                  />
                </div>
              </div>
            )}
          </LangTabs>
        </Card>

        <div className="space-y-5">
          <Card className="space-y-5">
            <Field label="الرابط (slug)" hint="يُولَّد تلقائياً إن تُرك فارغاً">
              <input
                dir="ltr"
                className={inputClass}
                value={draft.slug}
                onChange={(event) => set("slug", event.target.value)}
                placeholder="study-in-china-guide"
              />
            </Field>

            <Field label="التصنيف">
              <select
                className={inputClass}
                value={draft.category}
                onChange={(event) => set("category", event.target.value as ArticleCategory)}
              >
                {CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="الحالة">
              <select
                className={inputClass}
                value={draft.status}
                onChange={(event) => set("status", event.target.value as ArticleStatus)}
              >
                <option value="draft">مسودة</option>
                <option value="published">منشور</option>
              </select>
            </Field>
          </Card>

          <Card>
            <ImageField
              label="صورة الغلاف"
              value={draft.cover_image}
              onChange={(url) => set("cover_image", url)}
            />
          </Card>

          <div className="space-y-3">
            {note && <StatusNote status={note} />}
            <Button onClick={save} loading={saving} className="w-full">
              <Save className="h-4 w-4" />
              حفظ المقال
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
