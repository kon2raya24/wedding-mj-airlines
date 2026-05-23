// Signed-cookie session helpers. We don't have user accounts — the cookie
// just attests "this browser successfully looked up a guest in lib/guests.ts".
// It's an HMAC over the guest code so a curious visitor can't forge one.
//
// Uses Web Crypto API so this module can run in both Edge (middleware) and
// Node (server actions / route handlers).
import type { Guest } from "./guests";

export const SESSION_COOKIE = "mj_pass";

// In production set SESSION_SECRET in Vercel project settings — anything
// random and long. The dev fallback keeps local development working.
const SECRET =
  process.env.SESSION_SECRET ?? "mj-airways-dev-secret-please-change-me";

const enc = new TextEncoder();

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return bufToHex(new Uint8Array(sig));
}

function bufToHex(buf: Uint8Array): string {
  let s = "";
  for (let i = 0; i < buf.length; i++) {
    s += buf[i].toString(16).padStart(2, "0");
  }
  return s;
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// base64url encode/decode that works in both Edge and Node runtimes.
function b64urlEncode(s: string): string {
  // btoa handles latin-1; encode unicode safely.
  const bytes = enc.encode(s);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  const b64 = (typeof btoa === "function" ? btoa(bin) : Buffer.from(bin, "binary").toString("base64"));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): string {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const bin = typeof atob === "function" ? atob(padded) : Buffer.from(padded, "base64").toString("binary");
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export type SessionPayload = {
  code: string;
  firstName: string;
  lastName: string;
  seatsReserved: number;
  ts: number;
};

export async function encodeSession(guest: Guest): Promise<string> {
  const payload: SessionPayload = {
    code: guest.code,
    firstName: guest.firstName,
    lastName: guest.lastName,
    seatsReserved: guest.seatsReserved,
    ts: Date.now(),
  };
  const raw = b64urlEncode(JSON.stringify(payload));
  const sig = await hmac(raw);
  return `${raw}.${sig}`;
}

export async function decodeSession(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  const [raw, sig] = token.split(".");
  if (!raw || !sig) return null;
  const expected = await hmac(raw);
  if (!safeEqual(sig, expected)) return null;
  try {
    const decoded = JSON.parse(b64urlDecode(raw)) as SessionPayload;
    if (!decoded?.code || typeof decoded.seatsReserved !== "number") return null;
    return decoded;
  } catch {
    return null;
  }
}
