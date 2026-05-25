// Tiny admin auth using a signed cookie. Password lives in the
// ADMIN_PASSWORD env var. If ADMIN_PASSWORD isn't set, the admin page
// is effectively disabled (any attempt to log in will fail).
import "server-only";
import { signLabeled, verifyLabeled } from "./session";

export const ADMIN_COOKIE = "mj_admin";
const ADMIN_MAX_MS = 12 * 60 * 60 * 1000; // 12 hours

type AdminPayload = { ts: number; nonce: string };

function randomNonce(): string {
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  let s = "";
  for (let i = 0; i < buf.length; i++) s += buf[i].toString(16).padStart(2, "0");
  return s;
}

export async function mintAdminCookieValue(): Promise<string> {
  const payload: AdminPayload = { ts: Date.now(), nonce: randomNonce() };
  return signLabeled("admin", payload);
}

export async function isAdminCookieValid(value: string | undefined): Promise<boolean> {
  const payload = await verifyLabeled<AdminPayload>("admin", value);
  if (!payload) return false;
  if (typeof payload.ts !== "number") return false;
  if (Date.now() - payload.ts > ADMIN_MAX_MS) return false;
  return true;
}

export function isAdminConfigured(): boolean {
  return !!process.env.ADMIN_PASSWORD;
}

// Constant-time password comparison via HMAC of the input — avoids
// leaking the expected password length via the early-return on
// length mismatch.
export async function checkAdminPassword(input: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const inputDigest = await sha256(input);
  const expectedDigest = await sha256(expected);
  let diff = 0;
  for (let i = 0; i < inputDigest.length; i++) {
    diff |= inputDigest[i] ^ expectedDigest[i];
  }
  return diff === 0;
}

async function sha256(s: string): Promise<Uint8Array> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return new Uint8Array(buf);
}
