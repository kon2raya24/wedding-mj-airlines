import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, decodeSession } from "@/lib/session";

// Public paths that don't require the guest cookie.
const PUBLIC_PATHS = [
  "/login",
  "/api/logout",
  "/api/calendar.ics",
];

export const config = {
  // Skip Next internals and common static asset extensions.
  matcher: [
    "/((?!_next/|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff2?|ttf)$).*)",
  ],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // Admin routes are gated separately by ADMIN_PASSWORD (handled in the
  // admin page itself), so middleware lets them through.
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await decodeSession(token);
  if (session) return NextResponse.next();

  // Send unauthed visitors to the login page, preserving the original URL
  // so we can bounce them back after they check in.
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}
