// Guest book storage adapter. Mirrors lib/rsvp-store.ts: prefers Vercel
// KV when configured, falls back to /data on disk, then to an in-memory
// list. The whole list is small (a few dozen entries at most), so we
// read/write it whole.
import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

export type GuestBookEntry = {
  submittedAt: string;
  name: string;
  message: string;
  from: string;
  code: string;
};

const KV_KEY = "mj:guestbook";
const LOG_PATH = path.join(process.cwd(), "data", "guestbook.json");
const memory: GuestBookEntry[] = [];

function hasKv(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function readFromFile(): Promise<GuestBookEntry[]> {
  try {
    const raw = await fs.readFile(LOG_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeToFile(entries: GuestBookEntry[]): Promise<boolean> {
  try {
    await fs.mkdir(path.dirname(LOG_PATH), { recursive: true });
    await fs.writeFile(LOG_PATH, JSON.stringify(entries, null, 2), "utf8");
    return true;
  } catch {
    return false;
  }
}

export async function appendGuestBook(entry: GuestBookEntry): Promise<void> {
  console.log("[GUESTBOOK]", JSON.stringify(entry));

  if (hasKv()) {
    try {
      const { kv } = await import("@vercel/kv");
      const existing = ((await kv.get<GuestBookEntry[]>(KV_KEY)) ?? []) as GuestBookEntry[];
      existing.push(entry);
      await kv.set(KV_KEY, existing);
      return;
    } catch (err) {
      console.warn("[GUESTBOOK] KV write failed, falling back:", err);
    }
  }

  const existing = await readFromFile();
  existing.push(entry);
  const ok = await writeToFile(existing);
  if (!ok) memory.push(entry);
}

export async function readGuestBook(): Promise<GuestBookEntry[]> {
  if (hasKv()) {
    try {
      const { kv } = await import("@vercel/kv");
      const existing = ((await kv.get<GuestBookEntry[]>(KV_KEY)) ?? []) as GuestBookEntry[];
      return existing;
    } catch (err) {
      console.warn("[GUESTBOOK] KV read failed, falling back:", err);
    }
  }
  const fromDisk = await readFromFile();
  if (fromDisk.length > 0) return fromDisk;
  return memory.slice();
}
