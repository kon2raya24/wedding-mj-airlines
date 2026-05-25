// Cheap CSRF defense for state-changing API routes. We don't need a token
// system because we already require a session cookie — this just confirms
// the request was actually initiated from our own origin and not via a
// cross-site form POST (which `SameSite=Lax` doesn't fully block for
// top-level POSTs).
import "server-only";

export function isSameOrigin(req: Request): boolean {
  const host = req.headers.get("host");
  if (!host) return false;

  const origin = req.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }

  // Fall back to Referer when Origin is missing (some legitimate clients
  // strip it). If both are missing, refuse — we'd rather break an unusual
  // client than accept a forgery.
  const referer = req.headers.get("referer");
  if (!referer) return false;
  try {
    return new URL(referer).host === host;
  } catch {
    return false;
  }
}
