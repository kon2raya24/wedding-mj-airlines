// RSVP storage adapter. Prefers Vercel KV when configured (set up via the
// Vercel dashboard — env vars KV_REST_API_URL and KV_REST_API_TOKEN are
// auto-populated). Falls back to a JSON file under /data for local dev.
//
// When neither is available (e.g. on Vercel without KV enabled), entries
// are kept in-memory for the lifetime of the lambda and logged to stdout
// — visible in Vercel's project logs.
import { promises as fs } from "node:fs";
import path from "node:path";

export type RsvpEntry = {
  submittedAt: string;
  code: string;
  firstName: string;
  lastName: string;
  seatsReserved: number;
  attending: "yes" | "no";
  seatsAttending: number;
  companions: string[];
  email: string;
  note: string;
};

const KV_KEY = "mj:rsvps";
const LOG_PATH = path.join(process.cwd(), "data", "rsvps.json");

// In-memory cache for the "neither KV nor disk" fallback.
const memory: RsvpEntry[] = [];

function hasKv(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function readFromFile(): Promise<RsvpEntry[]> {
  try {
    const raw = await fs.readFile(LOG_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeToFile(entries: RsvpEntry[]): Promise<boolean> {
  try {
    await fs.mkdir(path.dirname(LOG_PATH), { recursive: true });
    await fs.writeFile(LOG_PATH, JSON.stringify(entries, null, 2), "utf8");
    return true;
  } catch {
    return false;
  }
}

export async function appendRsvp(entry: RsvpEntry): Promise<void> {
  // Always log to stdout — visible in Vercel logs even when no store is set up.
  console.log("[RSVP]", JSON.stringify(entry));

  if (hasKv()) {
    try {
      const { kv } = await import("@vercel/kv");
      // Append by reading + writing the whole list. This list is small
      // (guest count is in the dozens), so it's fine.
      const existing = ((await kv.get<RsvpEntry[]>(KV_KEY)) ?? []) as RsvpEntry[];
      existing.push(entry);
      await kv.set(KV_KEY, existing);
      return;
    } catch (err) {
      console.warn("[RSVP] KV write failed, falling back:", err);
    }
  }

  // Disk fallback (works in `next dev` and `next start`; on Vercel
  // serverless this fails silently because the filesystem is read-only).
  const existing = await readFromFile();
  existing.push(entry);
  const ok = await writeToFile(existing);
  if (!ok) {
    memory.push(entry);
  }
}

export async function readRsvps(): Promise<RsvpEntry[]> {
  if (hasKv()) {
    try {
      const { kv } = await import("@vercel/kv");
      const existing = ((await kv.get<RsvpEntry[]>(KV_KEY)) ?? []) as RsvpEntry[];
      return existing;
    } catch (err) {
      console.warn("[RSVP] KV read failed, falling back:", err);
    }
  }
  const fromDisk = await readFromFile();
  if (fromDisk.length > 0) return fromDisk;
  return memory.slice();
}

export async function deleteAllRsvps(): Promise<void> {
  if (hasKv()) {
    try {
      const { kv } = await import("@vercel/kv");
      await kv.del(KV_KEY);
    } catch (err) {
      console.warn("[RSVP] KV delete failed:", err);
    }
  }
  await writeToFile([]).catch(() => {});
  memory.length = 0;
}
