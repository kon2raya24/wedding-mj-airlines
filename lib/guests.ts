// Guest list. This is the source of truth for who can log in to the site
// and how many seats each guest has reserved.
//
// Replace this seed data with the real guest list before launch. Codes are
// per-guest — print each one on that guest's physical invitation.
//
// Editing tips:
// - `firstName` + `lastName` matching is case-insensitive and trims spaces.
// - `code` matching is also case-insensitive.
// - `seatsReserved` includes the guest themselves (so 2 = guest + 1 plus-one).

export type Guest = {
  firstName: string;
  lastName: string;
  code: string;
  seatsReserved: number;
};

export const guests: Guest[] = [
  { firstName: "Marjorie", lastName: "Dela Cruz", code: "MJ-BRIDE", seatsReserved: 1 },
  { firstName: "Joseph", lastName: "Santos", code: "MJ-GROOM", seatsReserved: 1 },
  { firstName: "Lola", lastName: "Pacing", code: "MJ-1A2B", seatsReserved: 4 },
  { firstName: "Tito", lastName: "Ben", code: "MJ-3C4D", seatsReserved: 2 },
  { firstName: "Andrea", lastName: "Reyes", code: "MJ-5E6F", seatsReserved: 2 },
  { firstName: "Mark", lastName: "Villanueva", code: "MJ-7G8H", seatsReserved: 1 },
  { firstName: "Sarah", lastName: "Lim", code: "MJ-9J0K", seatsReserved: 3 },
  // Sandbox account for quick demos
  { firstName: "Test", lastName: "Guest", code: "MJ1126", seatsReserved: 2 },
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
  return (
    guests.find(
      (g) =>
        norm(g.firstName) === fn &&
        norm(g.lastName) === ln &&
        normCode(g.code) === c
    ) ?? null
  );
}
