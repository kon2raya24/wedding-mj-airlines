import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { guests } from "@/lib/guests";
import { appendRsvp, RsvpEntry } from "@/lib/rsvp-store";
import { rateLimit } from "@/lib/rate-limit";
import { sendRsvpConfirmation } from "@/lib/email";
import { SESSION_COOKIE, decodeSession } from "@/lib/session";
import { isSameOrigin } from "@/lib/csrf";

type RsvpPayload = {
  attending?: "yes" | "no";
  seatsAttending?: number;
  companions?: string[];
  email?: string;
  note?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const cookieStore = await cookies();
  const session = await decodeSession(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Please check in first." },
      { status: 401 },
    );
  }

  // Look up the guest by the session's code, not anything from the body.
  const guest = guests.find(
    (g) => g.code.trim().toUpperCase() === session.code.trim().toUpperCase(),
  );
  if (!guest) {
    return NextResponse.json(
      { ok: false, error: "Reservation no longer valid." },
      { status: 401 },
    );
  }

  // Rate-limit per guest code so a hostile actor with one valid session
  // can't spam-update endlessly.
  const rl = rateLimit(`rsvp:${guest.code}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions — please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  let payload: RsvpPayload;
  try {
    payload = (await req.json()) as RsvpPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const seatsAttending = Math.max(
    0,
    Math.min(guest.seatsReserved, Number(payload.seatsAttending ?? 0)),
  );

  const email = (payload.email ?? "").trim().slice(0, 254);
  const validEmail =
    email && EMAIL_RE.test(email) && !/[\r\n]/.test(email) ? email : "";

  const entry: RsvpEntry = {
    submittedAt: new Date().toISOString(),
    code: guest.code,
    firstName: guest.firstName,
    lastName: guest.lastName,
    seatsReserved: guest.seatsReserved,
    attending: payload.attending === "no" ? "no" : "yes",
    seatsAttending: payload.attending === "no" ? 0 : seatsAttending,
    companions: Array.isArray(payload.companions)
      ? payload.companions
          .filter((s) => typeof s === "string" && s.trim())
          .map((s) => s.trim().slice(0, 80))
          .slice(0, guest.seatsReserved)
      : [],
    email: validEmail,
    note: typeof payload.note === "string" ? payload.note.slice(0, 1000) : "",
  };

  await appendRsvp(entry);

  // Fire-and-forget the email — never block the response on it.
  sendRsvpConfirmation(entry).catch((err) =>
    console.warn("[RSVP] email send failed:", err),
  );

  return NextResponse.json({ ok: true });
}
