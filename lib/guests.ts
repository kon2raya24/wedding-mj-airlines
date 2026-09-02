// Guest list. This is the source of truth for who can log in to the site
// and how many seats each guest has reserved.
import "server-only";
import { INVITATION_CODE } from "./config";

//
// Replace this seed data with the real guest list before launch.
//
// Every invitation card carries the SAME code (INVITATION_CODE below) — a
// guest still has to be on this list by name to check in, so seat counts
// and per-guest RSVP tracking keep working.
//
// Editing tips:
// - `firstName` + `lastName` matching is case-insensitive and trims spaces.
// - `code` matching is also case-insensitive.
// - `seatsReserved` includes the guest themselves (so 2 = guest + 1 plus-one).

export type Guest = {
  firstName: string;
  lastName: string;
  seatsReserved: number;
};

export const guests: Guest[] = [
  { firstName: "Joseph", lastName: "Santos", seatsReserved: 1 },
  { firstName: "Marjorie", lastName: "Dela Cruz", seatsReserved: 1 },
  { firstName: "Lola", lastName: "Pacing", seatsReserved: 4 },
  { firstName: "Tito", lastName: "Ben", seatsReserved: 2 },
  { firstName: "Andrea", lastName: "Reyes", seatsReserved: 2 },
  { firstName: "Mark", lastName: "Villanueva", seatsReserved: 1 },
  { firstName: "Sarah", lastName: "Lim", seatsReserved: 3 },
  // Sandbox account for quick demos
  { firstName: "Test", lastName: "Guest", seatsReserved: 2 },
];

function norm(s: string) {
  return s.trim().toLowerCase();
}

function normCode(s: string) {
  return s.trim().toUpperCase().replace(/\s+/g, "");
}

export function findGuest(
  firstName: string,
  lastName: string,
  code: string
): Guest | null {
  const fn = norm(firstName);
  const ln = norm(lastName);
  const c = normCode(code);
  if (!fn || !c) return null;
  if (c !== normCode(INVITATION_CODE)) return null;
  return (
    guests.find(
      (g) => norm(g.firstName) === fn && norm(g.lastName) === ln
    ) ?? null
  );
}
