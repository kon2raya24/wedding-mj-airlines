import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";
import { isSameOrigin } from "@/lib/csrf";

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
