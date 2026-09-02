import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, decodeSession } from "@/lib/session";
import { isSameOrigin } from "@/lib/csrf";
import { guestKey } from "@/lib/rsvp-types";
import { rateLimit } from "@/lib/rate-limit";
import {
  appendGuestBook,
  readGuestBook,
  type GuestBookEntry,
} from "@/lib/guestbook-store";

type GuestBookPayload = {
  name?: string;
  message?: string;
  from?: string;
};

// Seed entries shown when the store is empty so the section never looks
// abandoned for the first few guests.
const SEED: GuestBookEntry[] = [
  {
    submittedAt: "2026-01-01T00:00:00.000Z",
    name: "Lola Pacing",
    message: "Maraming bless sa inyong dalawa. Safe travels, mga anak.",
    from: "Manila",
    code: "seed",
  },
  {
    submittedAt: "2026-01-02T00:00:00.000Z",
    name: "Tito Ben",
    message: "From the day you met to today — what a beautiful itinerary. Bon voyage!",
    from: "Cebu",
    code: "seed",
  },
  {
    submittedAt: "2026-01-03T00:00:00.000Z",
    name: "Sarah",
    message: "Best layover crew ever. Can't wait to dance the night away with you both!",
    from: "Singapore",
    code: "seed",
  },
];

export async function GET() {
  const entries = await readGuestBook();
  const all = entries.length ? entries : SEED;
  // Newest first.
  const sorted = [...all].sort((a, b) =>
    a.submittedAt < b.submittedAt ? 1 : -1,
  );
  return NextResponse.json({ entries: sorted });
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

  const rl = rateLimit(`guestbook:${guestKey(session.firstName, session.lastName)}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions — please wait." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  let payload: GuestBookPayload;
  try {
    payload = (await req.json()) as GuestBookPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const name = (payload.name ?? "").trim().slice(0, 80);
  const message = (payload.message ?? "").trim().slice(0, 600);
  const from = (payload.from ?? "").trim().slice(0, 60);

  if (!name || !message) {
    return NextResponse.json(
      { ok: false, error: "Name and message are required." },
      { status: 400 },
    );
  }

  const entry: GuestBookEntry = {
    submittedAt: new Date().toISOString(),
    name,
    message,
    from,
    code: session.code,
  };

  await appendGuestBook(entry);
  return NextResponse.json({ ok: true, entry });
}
