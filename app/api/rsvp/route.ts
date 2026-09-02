import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { INVITATION_CODE } from "@/lib/config";
import { getGuests } from "@/lib/guests";
import { appendRsvp, findRsvpForGuest, RsvpEntry } from "@/lib/rsvp-store";
import { guestKey, type Companion } from "@/lib/rsvp-types";
import { rateLimit } from "@/lib/rate-limit";
import { sendRsvpConfirmation, sendRsvpNotification } from "@/lib/email";
import { SESSION_COOKIE, decodeSession } from "@/lib/session";
import { isSameOrigin } from "@/lib/csrf";

type RsvpPayload = {
  attending?: "yes" | "no";
  companions?: { name?: unknown; attending?: unknown }[];
  email?: string;
  note?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  const cookieStore = await cookies();
  const session = await decodeSession(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Please check in first." }, { status: 401 });
  }

  try {
    const rsvp = await findRsvpForGuest(session.firstName, session.lastName);
    return NextResponse.json({ ok: true, rsvp });
  } catch (err) {
    // Don't block the page on a read failure — the form still works, and
    // the POST below is the real guard against a duplicate.
    console.warn("[RSVP] lookup failed:", err);
    return NextResponse.json({ ok: true, rsvp: null });
  }
}

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

  // Look up the guest by the session's name, not anything from the body.
  // The invitation code is shared by every guest, so it can't identify one.
  const key = guestKey(session.firstName, session.lastName);
  const guest = (await getGuests()).find(
    (g) => guestKey(g.firstName, g.lastName) === key,
  );
  if (!guest) {
    return NextResponse.json(
      { ok: false, error: "Reservation no longer valid." },
      { status: 401 },
    );
  }

  // Rate-limit per guest so a hostile actor with one valid session
  // can't spam-update endlessly.
  const rl = rateLimit(`rsvp:${key}`);
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

  // One RSVP per guest. Checked server-side so it holds even if someone
  // re-opens the form in another tab or after signing in again.
  const existing = await findRsvpForGuest(guest.firstName, guest.lastName);
  if (existing) {
    return NextResponse.json(
      {
        ok: false,
        alreadySubmitted: true,
        rsvp: existing,
        error:
          "You've already confirmed your RSVP. Message Joseph or Marjorie if you need to change it.",
      },
      { status: 409 },
    );
  }

  const attending: "yes" | "no" = payload.attending === "no" ? "no" : "yes";

  // Companions are capped at the seats actually reserved for this guest.
  // Anything past that is dropped rather than trusted.
  const companions: Companion[] =
    attending === "no" || !Array.isArray(payload.companions)
      ? []
      : payload.companions
          .filter((c) => c && typeof c.name === "string" && c.name.trim())
          .map((c) => ({
            name: (c.name as string).trim().slice(0, 80),
            attending: c.attending === true,
          }))
          .slice(0, Math.max(0, guest.seatsReserved - 1));

  // Derived, never taken from the client: the guest's own seat plus each
  // companion who is boarding.
  const seatsAttending =
    attending === "no" ? 0 : 1 + companions.filter((c) => c.attending).length;

  const email = (payload.email ?? "").trim().slice(0, 254);
  const validEmail =
    email && EMAIL_RE.test(email) && !/[\r\n]/.test(email) ? email : "";

  const entry: RsvpEntry = {
    submittedAt: new Date().toISOString(),
    code: INVITATION_CODE,
    firstName: guest.firstName,
    lastName: guest.lastName,
    seatsReserved: guest.seatsReserved,
    attending,
    seatsAttending,
    companions,
    email: validEmail,
    note: typeof payload.note === "string" ? payload.note.slice(0, 1000) : "",
  };

  // The sheet IS the store, so this must succeed before we tell the guest
  // they are booked. If it fails they see an error and can retry, rather
  // than a success screen for an RSVP that was never recorded.
  try {
    await appendRsvp(entry);
  } catch (err) {
    console.error("[RSVP] could not save:", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "We couldn't save your RSVP just now. Please try again in a moment.",
      },
      { status: 503 },
    );
  }

  // Emails are awaited rather than fired-and-forgotten (a serverless
  // function can be frozen the moment it responds), but a mail failure
  // must never cost the guest their RSVP — it is already saved above.
  const results = await Promise.allSettled([
    sendRsvpNotification(entry),
    sendRsvpConfirmation(entry),
  ]);
  const labels = ["notify", "confirm"];
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.warn(`[RSVP] ${labels[i]} failed:`, r.reason);
    }
  });

  return NextResponse.json({ ok: true });
}
