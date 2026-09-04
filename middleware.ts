import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, decodeSession } from "@/lib/session";

// Public paths that don't require the guest cookie.
const PUBLIC_PATHS = [
  "/login",
  "/i",
  "/api/logout",
  "/api/calendar.ics",
  // Share cards / icons, fetched by link previews with no cookie.
  "/opengraph-image",
  "/twitter-image",
  "/icon",
  "/apple-icon",
];

export const config = {
  // Skip Next internals and common static asset extensions.
  matcher: [
    "/((?!_next/|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff2?|ttf|mp4|webm|mp3|m4a)$).*)",
  ],
};

// Link-preview crawlers (Messenger,   /facebookexternalhit|Facebot|meta-external|WhatsApp, iMessage, Viber, Telegram, X,
// Slack, Discord, LinkedIn…). Several of them will not follow a redirect,
// so instead of bouncing them to /login they are served the login page in
// place, with a 200 and the share-card metadata in its <head>.
const PREVIEW_BOT =
  /facebookexternalhit|Facebot|WhatsApp|Twitterbot|TelegramBot|Slackbot|Discordbot|LinkedInBot|Pinterest|Viber|SkypeUriPreview|Snapchat|Applebot|Googlebot|bingbot|kakaotalk-scrap|Line\/|Iframely|Embedly|redditbot|vkShare|W3C_Validator/i;

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

  // The root is the URL people share. Show the check-in page there in place
  // (200, same URL) rather than redirecting: no crawler has to follow a hop
  // to find the share card, and guests still land on the form.
  if (pathname === "/") {
    const home = req.nextUrl.clone();
    home.pathname = "/login";
    home.search = "";
    return NextResponse.rewrite(home);
  }

  if (PREVIEW_BOT.test(req.headers.get("user-agent") ?? "")) {
    const preview = req.nextUrl.clone();
    preview.pathname = "/login";
    preview.search = "";
    return NextResponse.rewrite(preview);
  }

  // Send unauthed visitors to the login page, preserving the original URL
  // so we can bounce them back after they check in.
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}
