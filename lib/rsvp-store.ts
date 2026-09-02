// RSVP storage. The "RSVPs" tab of the Google Sheet is the store — see
// lib/sheets.ts. Columns are RSVP_HEADERS, in order.
//
// The tab is append-only: a correction made by hand in the sheet leaves
// both rows, and `readRsvps` takes the later one. The API refuses a second
// submission from the same guest, so in normal use there is one row each.
//
// Without the Sheets env vars (local dev) this falls back to a JSON file
// under /data so `npm run dev` works without credentials.
import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  fromRow,
  guestKey,
  latestPerGuest,
  toRow,
  RSVP_HEADERS,
  type RsvpEntry,
} from "./rsvp-types";
import { appendRow, isSheetsConfigured, readRows, TABS } from "./sheets";

export type { RsvpEntry };
export { RSVP_HEADERS };

const LOG_PATH = path.join(process.cwd(), "data", "rsvps.json");

async function readFromFile(): Promise<RsvpEntry[]> {
  try {
    const raw = await fs.readFile(LOG_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function appendRsvp(entry: RsvpEntry): Promise<void> {
  // Always log to stdout — a durable trail even if the write below fails.
  console.log("[RSVP]", JSON.stringify(entry));

  if (isSheetsConfigured()) {
    await appendRow(TABS.rsvps, toRow(entry));
    return;
  }

  const existing = await readFromFile();
  existing.push(entry);
  await fs.mkdir(path.dirname(LOG_PATH), { recursive: true });
  await fs.writeFile(LOG_PATH, JSON.stringify(existing, null, 2), "utf8");
}

export async function readRsvps(): Promise<RsvpEntry[]> {
  if (isSheetsConfigured()) {
    const rows = await readRows(TABS.rsvps, RSVP_HEADERS.length);
    return latestPerGuest(rows.filter((r) => r[1] || r[2]).map((r) => fromRow(r, "")));
  }
  return latestPerGuest(await readFromFile());
}

// The guest's existing answer, or null if they haven't responded yet.
export async function findRsvpForGuest(
  firstName: string,
  lastName: string,
): Promise<RsvpEntry | null> {
  const key = guestKey(firstName, lastName);
  const all = await readRsvps();
  return all.find((e) => guestKey(e.firstName, e.lastName) === key) ?? null;
}
