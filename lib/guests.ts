// Guest list. The source of truth is the "Guests" tab of the Google Sheet
// (see lib/sheets.ts) — columns:
//
//   A: First name   B: Last name   C: Seats reserved
//
// Row 1 is a header and is skipped. `seatsReserved` includes the guest
// themselves, so 2 = guest + 1 companion.
//
// Every invitation carries the SAME code (INVITATION_CODE in lib/config.ts).
// A guest still has to appear on this list by name to check in, which is
// what keeps per-guest seat counts meaningful.
//
// When the Sheets env vars are absent (local dev, or a misconfigured
// deploy) we fall back to the seed list below so `npm run dev` works
// without credentials.
import "server-only";
import { INVITATION_CODE } from "./config";
import { guestKey } from "./rsvp-types";
import { isSheetsConfigured, readRows, TABS } from "./sheets";

export type Guest = {
  firstName: string;
  lastName: string;
  seatsReserved: number;
};

// Local-development stand-in. Never used when the Sheet is configured.
export const devGuests: Guest[] = [
  { firstName: "Joseph", lastName: "Santos", seatsReserved: 1 },
  { firstName: "Marjorie", lastName: "Dela Cruz", seatsReserved: 1 },
  { firstName: "Lola", lastName: "Pacing", seatsReserved: 4 },
  { firstName: "Tito", lastName: "Ben", seatsReserved: 2 },
  { firstName: "Sarah", lastName: "Lim", seatsReserved: 3 },
  { firstName: "Test", lastName: "Guest", seatsReserved: 2 },
];

// Check-in happens on nearly every request, so the list is cached rather
// than re-fetched each time. Short TTL: a guest added to the Sheet becomes
// able to check in within a minute.
const CACHE_MS = 60_000;
let cache: { at: number; guests: Guest[] } | null = null;

function parseRows(rows: string[][]): Guest[] {
  return rows
    .map((r) => ({
      firstName: r[0].trim(),
      lastName: r[1].trim(),
      seatsReserved: Math.max(1, Number.parseInt(r[2], 10) || 1),
    }))
    .filter((g) => g.firstName || g.lastName);
}

export async function getGuests(): Promise<Guest[]> {
  if (!isSheetsConfigured()) return devGuests;

  if (cache && Date.now() - cache.at < CACHE_MS) return cache.guests;

  try {
    const guests = parseRows(await readRows(TABS.guests, 3));
    cache = { at: Date.now(), guests };
    return guests;
  } catch (err) {
    // Serve a stale list rather than locking every guest out over a blip.
    if (cache) {
      console.warn("[Guests] Sheets read failed, serving cached list:", err);
      return cache.guests;
    }
    throw err;
  }
}

function normCode(s: string) {
  return s.trim().toUpperCase().replace(/\s+/g, "");
}

export async function findGuest(
  firstName: string,
  lastName: string,
  code: string,
): Promise<Guest | null> {
  const c = normCode(code);
  if (!firstName.trim() || !c) return null;
  if (c !== normCode(INVITATION_CODE)) return null;

  const key = guestKey(firstName, lastName);
  const guests = await getGuests();
  return guests.find((g) => guestKey(g.firstName, g.lastName) === key) ?? null;
}
