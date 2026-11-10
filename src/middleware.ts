import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, defaultLocale, isLocale, locales } from "@/i18n/config";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";

function detectLocale(request: NextRequest) {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  const header = request.headers.get("accept-language") ?? "";
  const preferred = header
    .split(",")
    .map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase());
  for (const code of preferred) {
    if (isLocale(code)) return code;
  }
  return defaultLocale;
}

function withLocaleHeader(request: NextRequest, locale: string) {
  const headers = new Headers(request.headers);
  headers.set("x-locale", locale);
  headers.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

async function guardAdmin(request: NextRequest) {
  const response = withLocaleHeader(request, "ar");

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, {
            ...options,
            secure: process.env.NODE_ENV === "production",
          }),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  if (!user && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return redirectWithCookies(url, response);
  }

  if (user && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return redirectWithCookies(url, response);
  }

  return response;
}

/**
 * Build a redirect that carries over any session cookies `getUser()` already
 * wrote onto `response` — otherwise a token refresh performed right before the
 * redirect would be silently dropped and the browser would keep the rotated-out
 * refresh token.
 */
function redirectWithCookies(url: URL, response: NextResponse) {
  const redirect = NextResponse.redirect(url);
  for (const cookie of response.headers.getSetCookie()) {
    redirect.headers.append("set-cookie", cookie);
  }
  return redirect;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return guardAdmin(request);
  }

  // Typed or shared uppercase locale prefixes (/AR, /En/…) used to miss the
  // lowercase lookup below and get re-prefixed into a 404 (/ar/AR/…).
  // Normalize them with a permanent redirect so links and search indexes
  // converge on the canonical lowercase form.
  const segments = pathname.split("/");
  const first = segments[1] ?? "";
  if (first !== first.toLowerCase() && isLocale(first.toLowerCase())) {
    const url = request.nextUrl.clone();
    segments[1] = first.toLowerCase();
    url.pathname = segments.join("/");
    return NextResponse.redirect(url, 308);
  }

  const active = locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (active) return withLocaleHeader(request, active);

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.redirect(url);
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
