type Bucket = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 15 * 60 * 1000;
const LIMIT = 5;

const buckets = new Map<string, Bucket>();

function nowMs() {
  return Date.now();
}

export function isRateLimited(key: string) {
  const current = nowMs();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= current) {
    buckets.set(key, { count: 1, resetAt: current + WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  if (bucket.count > LIMIT) {
    return true;
  }

  return false;
}
