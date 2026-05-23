import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { guests } from "@/lib/guests";

const LOG_PATH = path.join(process.cwd(), "data", "rsvps.json");

type RsvpPayload = {
  code?: string;
  firstName?: string;
  lastName?: string;
  seatsReserved?: number;
  attending?: "yes" | "no";
  seatsAttending?: number;
  companions?: string[];
  note?: string;
  submittedAt?: string;
};

async function appendToLog(entry: Record<string, unknown>) {
  // Vercel/serverless filesystems are read-only outside /tmp, and not
  // persistent across invocations. We try a local write for dev convenience
  // and always log to stdout so production submissions are captured in
  // platform logs.
  try {
    await fs.mkdir(path.dirname(LOG_PATH), { recursive: true });
    let existing: unknown[] = [];
    try {
      const raw = await fs.readFile(LOG_PATH, "utf8");
      existing = JSON.parse(raw);
      if (!Array.isArray(existing)) existing = [];
    } catch {
      existing = [];
    }
    existing.push(entry);
    await fs.writeFile(LOG_PATH, JSON.stringify(existing, null, 2), "utf8");
  } catch (err) {
    // swallow — fall back to stdout-only logging
    console.warn("[RSVP] could not persist to disk:", err);
  }
  console.log("[RSVP]", JSON.stringify(entry));
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as RsvpPayload;

    // Match the submission against the guest list — refuse if the code
    // doesn't exist. This prevents random POSTs from polluting the log.
    const code = (payload.code ?? "").trim().toUpperCase();
    const guest = guests.find(
      (g) => g.code.trim().toUpperCase() === code
    );
    if (!guest) {
      return NextResponse.json(
        { ok: false, error: "Unknown invitation code" },
        { status: 403 }
      );
    }

    const seatsAttending = Math.max(
      0,
      Math.min(guest.seatsReserved, Number(payload.seatsAttending ?? 0))
    );

    const entry = {
      submittedAt: payload.submittedAt ?? new Date().toISOString(),
      code: guest.code,
      firstName: guest.firstName,
      lastName: guest.lastName,
      seatsReserved: guest.seatsReserved,
      attending: payload.attending === "no" ? "no" : "yes",
      seatsAttending: payload.attending === "no" ? 0 : seatsAttending,
      companions: Array.isArray(payload.companions)
        ? payload.companions.filter((s) => typeof s === "string" && s.trim()).slice(0, guest.seatsReserved)
        : [],
      note: typeof payload.note === "string" ? payload.note.slice(0, 1000) : "",
    };

    await appendToLog(entry);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid payload" },
      { status: 400 }
    );
  }
}
