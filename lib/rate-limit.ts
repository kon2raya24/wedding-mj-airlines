// Naive in-memory rate limit. Per-lambda scope — fine for a single small
// wedding site, but won't survive lambda recycles or scale across
// concurrent regions. Good enough to block casual spam.
type Bucket = { count: number; windowStart: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60_000; // 1 minute
const LIMIT = 10;          // 10 submissions per minute per key

export function rateLimit(key: string): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now });
    return { allowed: true, retryAfterSec: 0 };
  }
  if (bucket.count >= LIMIT) {
    const retryAfterSec = Math.ceil((WINDOW_MS - (now - bucket.windowStart)) / 1000);
    return { allowed: false, retryAfterSec };
  }
  bucket.count += 1;
  return { allowed: true, retryAfterSec: 0 };
}
