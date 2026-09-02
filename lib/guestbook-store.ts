// Guest book storage. Mirrors lib/rsvp-store.ts — the "Guestbook" tab of
// the Google Sheet, via the Apps Script backend. Columns:
//
//   A: Submitted at  B: Name  C: From  D: Message
//
// Falls back to a JSON file under /data when the backend env vars are
// absent, so `npm run dev` works with no setup.
import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { callBackend, isBackendConfigured } from "./apps-script";

export type GuestBookEntry = {
  submittedAt: string;
  name: string;
  message: string;
  from: string;
  code: string;
};

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

  if (isBackendConfigured()) {
    await callBackend("guestbook.add", {
      row: [entry.submittedAt, entry.name, entry.from, entry.message],
    });
    return;
  }

  const existing = await readFromFile();
  existing.push(entry);
  await fs.mkdir(path.dirname(LOG_PATH), { recursive: true });
  await fs.writeFile(LOG_PATH, JSON.stringify(existing, null, 2), "utf8");
}

export async function readGuestBook(): Promise<GuestBookEntry[]> {
  if (isBackendConfigured()) {
    const { entries } = await callBackend<{
      entries: { submittedAt: string; name: string; from: string; message: string }[];
    }>("guestbook");
    return entries.map((e) => ({ ...e, code: "" }));
  }
  return readFromFile();
}
