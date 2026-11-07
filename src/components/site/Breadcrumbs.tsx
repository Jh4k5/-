import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Locale } from "@/i18n/config";

/**
 * Visible breadcrumb trail. Pairs with breadcrumbJsonLd() in lib/seo.ts —
 * Google wants both the markup and a visible path on the page.
 */
export default function Breadcrumbs({
  locale,
  trail,
}: {
  locale: Locale;
  trail: { name: string; path: string }[];
}) {
  return (
    <nav aria-label="breadcrumb" className="container-page pt-6">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-charcoal/70">
        {trail.map((crumb, index) => {
          const last = index === trail.length - 1;
          const href = `/${locale}${crumb.path === "/" ? "" : crumb.path}`;
          return (
            <li key={href} className="flex items-center gap-1">
              {index > 0 && <ChevronLeft className="h-3 w-3 shrink-0 rtl:rotate-180" aria-hidden="true" />}
              {last ? (
                <span className="font-semibold text-trust-blue" aria-current="page">
                  {crumb.name}
                </span>
              ) : (
                <Link href={href} className="transition-colors hover:text-china-red">
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
