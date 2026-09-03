import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { bazinga } from "./i18n/routing";

const intlMiddleware = createMiddleware(bazinga);

function getLocaleCookie(pathname: string) {
  if (pathname.startsWith("/auth")) return null;
  return pathname.startsWith("/dashboard") || pathname.startsWith("/recovery") || pathname.startsWith("/recovery-history") || pathname.startsWith("/return-to-learn") || pathname.startsWith("/return-to-activity") || pathname.startsWith("/summary") || pathname.startsWith("/safety") || pathname.startsWith("/evidence") || pathname.startsWith("/check-in") || pathname.startsWith("/insights") || pathname.startsWith("/diary") || pathname.startsWith("/novagame") || pathname.startsWith("/settings") || pathname.startsWith("/profile") || pathname.startsWith("/security")
    ? "nova-private-locale"
    : "nova-landing-locale";
}

export default function proxy(request: Parameters<typeof intlMiddleware>[0]) {
  const pathname = request.nextUrl.pathname;
  const prefixedLocale = pathname.match(/^\/(en|pt)(?=\/|$)/)?.[1];
  const cookieName = getLocaleCookie(pathname.replace(/^\/(en|pt)(?=\/|$)/, "") || "/");

  if (prefixedLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/(en|pt)(?=\/|$)/, "") || "/";
    const response = NextResponse.redirect(url);
    if (cookieName) response.cookies.set(cookieName, prefixedLocale, { path: "/" });
    return response;
  }

  const scopedLocale = cookieName ? request.cookies.get(cookieName)?.value : undefined;
  if (scopedLocale && bazinga.locales.includes(scopedLocale as "en" | "pt")) {
    request.cookies.set("NEXT_LOCALE", scopedLocale);
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
