// Client-side gate keyed off the per-guest list in lib/guests.ts. Not real
// auth — the guest list ships in the client bundle, so anyone could read
// every code from devtools. Good enough to keep the casual public out of
// what is meant to be a private wedding site.
import type { Guest } from "./guests";

export const AUTH_STORAGE_KEY = "mj-airways-auth-v1";

export type GuestAuth = Guest & {
  checkedInAt: number;
};

export function readAuth(): GuestAuth | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GuestAuth;
    if (!parsed?.firstName || !parsed?.code) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeAuth(guest: Guest) {
  if (typeof window === "undefined") return;
  const record: GuestAuth = { ...guest, checkedInAt: Date.now() };
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(record));
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
