// Magic invitation link. Emailed to guests as /i?t=<signed token> so a
// tap takes them straight into their invitation — no name, no code, no
// typing. The token is an HMAC over the guest's row, so it can't be
// forged, and it only ever grants what checking in normally would.
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, decodeInvite, encodeSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("t") ?? undefined;
  const invite = await decodeInvite(token);

  // Expired or tampered with — fall back to the normal check-in rather
  // than a dead end.
  if (!invite) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }

  const res = NextResponse.redirect(new URL("/#rsvp", req.nextUrl.origin));
  res.cookies.set(
    SESSION_COOKIE,
    await encodeSession({
      firstName: invite.firstName,
      lastName: invite.lastName,
      seatsReserved: invite.seatsReserved,
      companions: invite.companions,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    },
  );
  return res;
}
