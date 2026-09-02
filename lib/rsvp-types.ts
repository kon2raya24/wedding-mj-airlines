// Types and pure helpers shared between the server-only stores and the
// client-side admin table, so nothing here may import anything
// Node-specific.

export type Companion = {
  name: string;
  attending: boolean;
};

export type RsvpEntry = {
  submittedAt: string;
  code: string;
  firstName: string;
  lastName: string;
  seatsReserved: number;
  attending: "yes" | "no";
  seatsAttending: number;
  companions: Companion[];
  email: string;
  note: string;
};

export const RSVP_HEADERS = [
  "Submitted at",
  "First name",
  "Last name",
  "Seats reserved",
  "Attending",
  "Seats attending",
  "Companions",
  "Email",
  "Note",
];

export function formatCompanion(c: Companion): string {
  return c.attending ? c.name : `${c.name} (not boarding)`;
}

// Identity key for a guest. The invitation code is shared by everyone, so
// RSVPs are matched back to the guest list by name instead.
export function guestKey(firstName: string, lastName: string): string {
  return `${firstName.trim().toLowerCase()}|${lastName.trim().toLowerCase()}`;
}

// "Ana Cruz, Ben Cruz (not boarding)" — round-trips through the sheet so a
// human can read the cell and we can still parse it back.
const NOT_BOARDING = " (not boarding)";

function decodeCompanions(cell: string): Companion[] {
  return cell
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) =>
      s.endsWith(NOT_BOARDING)
        ? { name: s.slice(0, -NOT_BOARDING.length).trim(), attending: false }
        : { name: s, attending: true },
    );
}

export function toRow(e: RsvpEntry): string[] {
  return [
    e.submittedAt,
    e.firstName,
    e.lastName,
    String(e.seatsReserved),
    e.attending === "yes" ? "Yes" : "No",
    String(e.seatsAttending),
    e.companions.map(formatCompanion).join(", "),
    e.email,
    e.note,
  ];
}

export function fromRow(r: string[], code: string): RsvpEntry {
  return {
    submittedAt: r[0],
    code,
    firstName: r[1],
    lastName: r[2],
    seatsReserved: Number.parseInt(r[3], 10) || 0,
    attending: r[4].trim().toLowerCase().startsWith("y") ? "yes" : "no",
    seatsAttending: Number.parseInt(r[5], 10) || 0,
    companions: decodeCompanions(r[6]),
    email: r[7],
    note: r[8],
  };
}

// Collapses the append-only log to one current answer per guest. Later
// rows win, so a hand-edited correction in the sheet takes effect.
export function latestPerGuest(entries: RsvpEntry[]): RsvpEntry[] {
  const byGuest = new Map<string, RsvpEntry>();
  for (const e of entries) {
    byGuest.set(guestKey(e.firstName, e.lastName), e);
  }
  return [...byGuest.values()];
}
