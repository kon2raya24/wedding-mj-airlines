// Guest book storage. Mirrors lib/rsvp-store.ts — the "Guestbook" tab of
// the Google Sheet is the store. Columns:
//
//   A: Submitted at  B: Name  C: From  D: Message
//
// Falls back to a JSON file under /data when the Sheets env vars are
// absent, so `npm run dev` works without credentials.
import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { appendRow, isSheetsConfigured, readRows, TABS } from "./sheets";

export type GuestBookEntry = {
  submittedAt: string;
  name: string;
  message: string;
  from: string;
  code: string;
};

export const GUESTBOOK_HEADERS = ["Submitted at", "Name", "From", "Message"];

const LOG_PATH = path.join(process.cwd(), "data", "guestbook.json");

async function readFromFile(): Promise<GuestBookEntry[]> {
  try {
    const raw = await fs.readFile(LOG_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function appendGuestBook(entry: GuestBookEntry): Promise<void> {
  console.log("[GUESTBOOK]", JSON.stringify(entry));

  if (isSheetsConfigured()) {
    await appendRow(TABS.guestbook, [
      entry.submittedAt,
      entry.name,
      entry.from,
      entry.message,
    ]);
    return;
  }

  const existing = await readFromFile();
  existing.push(entry);
  await fs.mkdir(path.dirname(LOG_PATH), { recursive: true });
  await fs.writeFile(LOG_PATH, JSON.stringify(existing, null, 2), "utf8");
}

export async function readGuestBook(): Promise<GuestBookEntry[]> {
  if (isSheetsConfigured()) {
    const rows = await readRows(TABS.guestbook, GUESTBOOK_HEADERS.length);
    return rows
      .filter((r) => r[1] && r[3])
      .map((r) => ({
        submittedAt: r[0],
        name: r[1],
        from: r[2],
        message: r[3],
        code: "",
      }));
  }
  return readFromFile();
}
