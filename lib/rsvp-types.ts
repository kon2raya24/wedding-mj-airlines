// Shared between the server-only RSVP store and the client-side admin
// table, so it must not import anything Node-specific.

export type Companion = {
  name: string;
  attending: boolean;
};

export function formatCompanion(c: Companion): string {
  return c.attending ? c.name : `${c.name} (not boarding)`;
}

// Identity key for a guest. The invitation code is shared by everyone, so
// RSVPs are matched back to the guest list by name instead.
export function guestKey(firstName: string, lastName: string): string {
  return `${firstName.trim().toLowerCase()}|${lastName.trim().toLowerCase()}`;
}
