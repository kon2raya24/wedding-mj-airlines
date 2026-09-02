// RSVP storage adapter. Prefers Vercel KV when configured (set up via the
// Vercel dashboard — env vars KV_REST_API_URL and KV_REST_API_TOKEN are
// auto-populated). Falls back to a JSON file under /data for local dev.
//
// When neither is available (e.g. on Vercel without KV enabled), entries
// are kept in-memory for the lifetime of the lambda and logged to stdout
// — visible in Vercel's project logs.
//
// Entries are keyed by guest, so re-submitting replaces the previous
// answer instead of appending a duplicate. On KV that write is a single
// atomic HSET, so two guests submitting at the same moment can't clobber
// each other (a read-modify-write of one big array could).
import { promises as fs } from "node:fs";
import path from "node:path";
import { guestKey, type Companion } from "./rsvp-types";

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

const KV_KEY = "mj:rsvps";
const LOG_PATH = path.join(process.cwd(), "data", "rsvps.json");

// In-memory cache for the "neither KV nor disk" fallback.
const memory = new Map<string, RsvpEntry>();

function hasKv(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function keyOf(e: RsvpEntry): string {
  return guestKey(e.firstName, e.lastName);
}

// Entries written before companions carried a per-person boarding flag
// stored them as plain strings. Normalise on read so nothing downstream
// has to care.
function normalise(e: RsvpEntry): RsvpEntry {
  const companions = Array.isArray(e.companions)
    ? e.companions.map((c) =>
        typeof c === "string"
          ? { name: c as string, attending: true }
          : { name: c?.name ?? "", attending: c?.attending !== false },
      )
    : [];
  return { ...e, companions };
}

async function readFromFile(): Promise<RsvpEntry[]> {
  try {
    const raw = await fs.readFile(LOG_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalise) : [];
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
      // Single-field write: atomic, and an upsert by guest.
      await kv.hset(KV_KEY, { [keyOf(entry)]: entry });
      return;
    } catch (err) {
      console.warn("[RSVP] KV write failed, falling back:", err);
    }
  }

  // Disk fallback (works in `next dev` and `next start`; on Vercel
  // serverless this fails silently because the filesystem is read-only).
  const existing = await readFromFile();
  const merged = existing.filter((e) => keyOf(e) !== keyOf(entry));
  merged.push(entry);
  const ok = await writeToFile(merged);
  if (!ok) {
    memory.set(keyOf(entry), entry);
  }
}

export async function readRsvps(): Promise<RsvpEntry[]> {
  if (hasKv()) {
    try {
      const { kv } = await import("@vercel/kv");
      const all = await kv.hgetall<Record<string, RsvpEntry>>(KV_KEY);
      return Object.values(all ?? {}).map(normalise);
    } catch (err) {
      console.warn("[RSVP] KV read failed, falling back:", err);
    }
  }
  const fromDisk = await readFromFile();
  if (fromDisk.length > 0) return fromDisk;
  return [...memory.values()];
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
  memory.clear();
}
