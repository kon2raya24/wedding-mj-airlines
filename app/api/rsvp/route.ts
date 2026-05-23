import { NextResponse } from "next/server";
import { guests } from "@/lib/guests";
import { appendRsvp, RsvpEntry } from "@/lib/rsvp-store";
import { rateLimit } from "@/lib/rate-limit";
import { sendRsvpConfirmation } from "@/lib/email";

type RsvpPayload = {
  code?: string;
  firstName?: string;
  lastName?: string;
  seatsReserved?: number;
  attending?: "yes" | "no";
  seatsAttending?: number;
  companions?: string[];
  email?: string;
  note?: string;
  submittedAt?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as RsvpPayload;

    const code = (payload.code ?? "").trim().toUpperCase();
    const guest = guests.find((g) => g.code.trim().toUpperCase() === code);
    if (!guest) {
      return NextResponse.json(
        { ok: false, error: "Unknown invitation code" },
        { status: 403 }
      );
    }

    // Rate-limit per guest code so a hostile actor with one code can't
    // spam-update endlessly.
    const rl = rateLimit(`rsvp:${guest.code}`);
    if (!rl.allowed) {
      return NextResponse.json(
        { ok: false, error: "Too many submissions — please wait a moment and try again." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    const seatsAttending = Math.max(
      0,
      Math.min(guest.seatsReserved, Number(payload.seatsAttending ?? 0))
    );

    const email = (payload.email ?? "").trim();
    const validEmail = email && EMAIL_RE.test(email) ? email : "";

    const entry: RsvpEntry = {
      submittedAt: payload.submittedAt ?? new Date().toISOString(),
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
      console.warn("[RSVP] email send failed:", err)
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid payload" },
      { status: 400 }
    );
  }
}
