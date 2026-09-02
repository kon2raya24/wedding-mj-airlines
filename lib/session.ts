// Signed-cookie session helpers. We don't have user accounts — the cookie
// just attests "this browser successfully looked up a guest in lib/guests.ts".
// It's an HMAC over the guest code so a curious visitor can't forge one.
//
// Uses Web Crypto API so this module can run in both Edge (middleware) and
// Node (server actions / route handlers).
import { INVITATION_CODE } from "./config";
import type { Guest } from "./guests";

export const SESSION_COOKIE = "mj_pass";

// 30 days, matching the cookie's browser-side maxAge so we also reject
// stolen/replayed values past the same window.
export const SESSION_MAX_MS = 30 * 24 * 60 * 60 * 1000;

// Resolved lazily so this module can be imported during Next.js static
// page-data collection (e.g. /_not-found) without SESSION_SECRET being
// present in that build step. The check still fires before any cookie
// is ever signed or verified at runtime.
let _secret: string | null = null;
function getSecret(): string {
  if (_secret) return _secret;
  const s = process.env.SESSION_SECRET;
  if (s && s.length >= 16) {
    _secret = s;
    return _secret;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET is required in production (>=16 chars). " +
        "Set it in your Vercel project env vars and redeploy.",
    );
  }
  _secret = "mj-airways-dev-secret-please-change-me";
  return _secret;
}

const enc = new TextEncoder();

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
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

// Labeled sign/verify — prefixing the HMAC input with a domain label gives
// us key separation so an admin token forgery oracle can't be replayed as
// a guest token (and vice versa), even though both use the same SECRET.
export async function signLabeled(label: string, payload: unknown): Promise<string> {
  const raw = b64urlEncode(JSON.stringify(payload));
  const sig = await hmac(`${label}.${raw}`);
  return `${raw}.${sig}`;
}

export async function verifyLabeled<T>(
  label: string,
  token: string | undefined,
): Promise<T | null> {
  if (!token) return null;
  const dot = token.indexOf(".");
  if (dot <= 0 || dot === token.length - 1) return null;
  const raw = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = await hmac(`${label}.${raw}`);
  if (!safeEqual(sig, expected)) return null;
  try {
    return JSON.parse(b64urlDecode(raw)) as T;
  } catch {
    return null;
  }
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
    code: INVITATION_CODE,
    firstName: guest.firstName,
    lastName: guest.lastName,
    seatsReserved: guest.seatsReserved,
    ts: Date.now(),
  };
  return signLabeled("session", payload);
}

// Invitation links emailed to guests carry a signed token so clicking
// through logs them straight in — no name, no code, no re-typing.
// Long-lived on purpose: invitations go out months before the day.
export const INVITE_MAX_MS = 400 * 24 * 60 * 60 * 1000;

export async function encodeInvite(guest: Guest): Promise<string> {
  const payload: SessionPayload = {
    code: INVITATION_CODE,
    firstName: guest.firstName,
    lastName: guest.lastName,
    seatsReserved: guest.seatsReserved,
    ts: Date.now(),
  };
  return signLabeled("invite", payload);
}

export async function decodeInvite(
  token: string | undefined,
): Promise<SessionPayload | null> {
  const decoded = await verifyLabeled<SessionPayload>("invite", token);
  if (!decoded?.code || typeof decoded.seatsReserved !== "number") return null;
  if (typeof decoded.ts !== "number" || Date.now() - decoded.ts > INVITE_MAX_MS) {
    return null;
  }
  return decoded;
}

export async function decodeSession(
  token: string | undefined,
): Promise<SessionPayload | null> {
  const decoded = await verifyLabeled<SessionPayload>("session", token);
  if (!decoded?.code || typeof decoded.seatsReserved !== "number") return null;
  if (typeof decoded.ts !== "number" || Date.now() - decoded.ts > SESSION_MAX_MS) {
    return null;
  }
  return decoded;
}
