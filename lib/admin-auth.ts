// Tiny admin auth using a signed cookie. Password lives in the
// ADMIN_PASSWORD env var. If ADMIN_PASSWORD isn't set, the admin page
// is effectively disabled (any attempt to log in will fail).
const SECRET =
  process.env.SESSION_SECRET ?? "mj-airways-dev-secret-please-change-me";

export const ADMIN_COOKIE = "mj_admin";

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
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function expectedAdminCookieValue(): Promise<string> {
  return hmac("admin");
}

export async function isAdminCookieValid(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  const expected = await expectedAdminCookieValue();
  return safeEqual(value, expected);
}

export function isAdminConfigured(): boolean {
  return !!process.env.ADMIN_PASSWORD;
}

export function checkAdminPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  if (input.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < input.length; i++) diff |= input.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}
