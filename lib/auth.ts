// Client-side gate. Not real auth — guests share a single confirmation code
// printed on their invitation. Easily inspectable; do not put anything
// truly private behind it.
export const DEFAULT_GUEST_CODE = "MJ1212";

export const AUTH_STORAGE_KEY = "mj-airlines-auth-v1";

export type GuestAuth = {
  name: string;
  checkedInAt: number;
};

export function readAuth(): GuestAuth | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GuestAuth;
    if (!parsed?.name) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeAuth(auth: GuestAuth) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
