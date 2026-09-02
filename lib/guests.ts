// Guest list. The source of truth is the "Guests" tab of the Google Sheet,
// read through the Apps Script backend (lib/apps-script.ts) — columns:
//
//   A: First name   B: Last name   C: Seats reserved
//
// `seatsReserved` includes the guest themselves, so 2 = guest + 1 companion.
//
// Every invitation carries the SAME code (INVITATION_CODE in lib/config.ts).
// A guest still has to appear on this list by name to check in, which is
// what keeps per-guest seat counts meaningful.
//
// Without the backend env vars (local dev) we fall back to the seed list
// below so `npm run dev` works with no setup.
import "server-only";
import { INVITATION_CODE } from "./config";
import { guestKey } from "./rsvp-types";
import { callBackend, isBackendConfigured } from "./apps-script";

export type Guest = {
  firstName: string;
  lastName: string;
  seatsReserved: number;
};

// Local-development stand-in. Never used when the backend is configured.
export const devGuests: Guest[] = [
  { firstName: "Joseph", lastName: "Castañeda", seatsReserved: 1 },
  { firstName: "Marjorie", lastName: "Teñido", seatsReserved: 1 },
  { firstName: "Johncel", lastName: "Castañeda", seatsReserved: 1 },
  { firstName: "Rence", lastName: "De Guzman", seatsReserved: 1 },
  { firstName: "Test", lastName: "Guest", seatsReserved: 2 },
];

// Check-in happens on nearly every request, so the list is cached rather
// than re-fetched each time. Short TTL: a guest added to the Sheet can
// check in within a minute.
const CACHE_MS = 60_000;
let cache: { at: number; guests: Guest[] } | null = null;

export async function getGuests(): Promise<Guest[]> {
  if (!isBackendConfigured()) return devGuests;
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.guests;

  try {
    const { guests } = await callBackend<{ guests: Guest[] }>("guests");
    cache = { at: Date.now(), guests };
    return guests;
  } catch (err) {
    // Serve a stale list rather than locking every guest out over a blip.
    if (cache) {
      console.warn("[Guests] backend read failed, serving cached list:", err);
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
