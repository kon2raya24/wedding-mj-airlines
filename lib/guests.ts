// Guest list. The final list lives in lib/guest-list.json: one row per
// family representative — the person who checks in — with the companions
// travelling on their invitation named alongside. `seatsReserved` is
// derived (the representative plus their companions).
//
// When the Apps Script backend is configured the "Guests" tab of the Google
// Sheet is read instead (lib/apps-script.ts), columns:
//
//   A: First name   B: Last name   C: Seats reserved   D: Companions
//
// D is one name per line (or separated by ";"). If a sheet row has no
// companions column yet, the names from guest-list.json are used, so the
// RSVP form still shows who is travelling with the representative.
//
// Every invitation carries the SAME code (INVITATION_CODE in lib/config.ts).
// A guest still has to appear on this list by name to check in.
import "server-only";
import { INVITATION_CODE } from "./config";
import { guestKey } from "./rsvp-types";
import { callBackend, isBackendConfigured } from "./apps-script";
import guestList from "./guest-list.json";

export type Guest = {
  firstName: string;
  lastName: string;
  seatsReserved: number;
  companions: string[];
};

function withSeats(g: { firstName: string; lastName: string; companions: string[] }): Guest {
  return { ...g, seatsReserved: 1 + g.companions.length };
}

export const FINAL_GUESTS: Guest[] = guestList.map(withSeats);

// Local-development stand-in on top of the real list: two seats so the
// companion toggles can be exercised.
const devGuests: Guest[] = [
  ...FINAL_GUESTS,
  withSeats({ firstName: "Test", lastName: "Guest", companions: ["Plus One"] }),
];

// Check-in happens on nearly every request, so the list is cached rather
// than re-fetched each time. Short TTL: a guest added to the Sheet can
// check in within a minute.
const CACHE_MS = 60_000;
let cache: { at: number; guests: Guest[] } | null = null;

type SheetGuest = {
  firstName: string;
  lastName: string;
  seatsReserved: number;
  companions?: string[];
};

// Fill in companion names from the final list when the sheet doesn't carry
// them, and keep the seat count consistent with the names.
function reconcile(sheetGuests: SheetGuest[]): Guest[] {
  const known = new Map(FINAL_GUESTS.map((g) => [guestKey(g.firstName, g.lastName), g]));
  return sheetGuests.map((g) => {
    const fromList = known.get(guestKey(g.firstName, g.lastName));
    const companions = g.companions && g.companions.length ? g.companions : fromList?.companions ?? [];
    return {
      firstName: g.firstName,
      lastName: g.lastName,
      companions,
      seatsReserved: Math.max(g.seatsReserved || 1, 1 + companions.length),
    };
  });
}

export async function getGuests(): Promise<Guest[]> {
  if (!isBackendConfigured()) {
    return process.env.NODE_ENV === "production" ? FINAL_GUESTS : devGuests;
  }
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.guests;

  try {
    const { guests } = await callBackend<{ guests: SheetGuest[] }>("guests");
    cache = { at: Date.now(), guests: reconcile(guests) };
    return cache.guests;
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
