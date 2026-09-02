// RSVP storage. The "RSVPs" tab of the Google Sheet is the store, reached
// through the Apps Script backend (lib/apps-script.ts). Columns are
// RSVP_HEADERS, in order.
//
// `submitRsvp` is a single backend call that takes a script lock, refuses a
// duplicate, appends the row and sends the emails — so two guests
// submitting at the same instant cannot race, and a guest cannot end up
// with two rows.
//
// Without the backend env vars (local dev) this falls back to a JSON file
// under /data so `npm run dev` works with no setup.
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
import { callBackend, isBackendConfigured, type Mail } from "./apps-script";

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

async function writeToFile(entries: RsvpEntry[]): Promise<void> {
  await fs.mkdir(path.dirname(LOG_PATH), { recursive: true });
  await fs.writeFile(LOG_PATH, JSON.stringify(entries, null, 2), "utf8");
}

export type SubmitResult =
  | { ok: true; mail: { to: string; sent: boolean; error?: string }[] }
  | { ok: false; alreadySubmitted: true; rsvp: RsvpEntry };

/** Saves the RSVP and sends its emails. Refuses a second submission. */
export async function submitRsvp(
  entry: RsvpEntry,
  emails: Mail[],
): Promise<SubmitResult> {
  // Always log to stdout — a durable trail even if the write below fails.
  console.log("[RSVP]", JSON.stringify(entry));

  if (isBackendConfigured()) {
    const res = await callBackend<{
      ok: boolean;
      alreadySubmitted?: boolean;
      row?: string[];
      mail?: { to: string; sent: boolean; error?: string }[];
    }>("rsvp", { row: toRow(entry), emails });

    if (res.alreadySubmitted && res.row) {
      return { ok: false, alreadySubmitted: true, rsvp: fromRow(res.row, "") };
    }
    return { ok: true, mail: res.mail ?? [] };
  }

  // Local dev: same duplicate rule, against the JSON file.
  const existing = await readFromFile();
  const key = guestKey(entry.firstName, entry.lastName);
  const dupe = existing.find((e) => guestKey(e.firstName, e.lastName) === key);
  if (dupe) return { ok: false, alreadySubmitted: true, rsvp: dupe };

  existing.push(entry);
  await writeToFile(existing);
  console.log(
    "[Email] backend not configured, would have sent to:",
    emails.map((m) => m.to).join(", "),
  );
  return { ok: true, mail: emails.map((m) => ({ to: m.to, sent: false })) };
}

export async function readRsvps(): Promise<RsvpEntry[]> {
  if (isBackendConfigured()) {
    const { rows } = await callBackend<{ rows: string[][] }>("rsvps");
    return latestPerGuest(rows.map((r) => fromRow(r, "")));
  }
  return latestPerGuest(await readFromFile());
}

/** The guest's existing answer, or null if they haven't responded yet. */
export async function findRsvpForGuest(
  firstName: string,
  lastName: string,
): Promise<RsvpEntry | null> {
  const key = guestKey(firstName, lastName);
  const all = await readRsvps();
  return all.find((e) => guestKey(e.firstName, e.lastName) === key) ?? null;
}
