const bucket = new Map<string, { count: number; resetAt: number }>();

export function enforceRateLimit(key: string, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const existing = bucket.get(key);

  if (!existing || existing.resetAt < now) {
    bucket.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (existing.count >= limit) return false;
  existing.count += 1;
  return true;
}
