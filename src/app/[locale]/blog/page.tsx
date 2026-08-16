import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import BlogExplorer from "@/components/site/BlogExplorer";
import { getDictionary } from "@/i18n";
import { isLocale, type Locale } from "@/i18n/config";
import { getArticles } from "@/lib/data";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "ar");
  return { title: dict.blog.title, description: dict.blog.subtitle };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);
  const articles = await getArticles();

  return (
    <>
      <PageHero title={dict.blog.title} subtitle={dict.blog.subtitle} scene="hangzhou" />
      <section className="container-page py-16">
        <BlogExplorer articles={articles} locale={locale} dict={dict} />
      </section>
    </>
  );
}
