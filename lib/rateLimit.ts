/**
 * lib/rateLimit.ts
 *
 * In-memory IP-based rate limiter.
 * No Redis required — suitable for a single-process Next.js deployment.
 *
 * Usage:
 *   const result = checkRateLimit("login", ip);
 *   if (!result.allowed) return NextResponse.json({ error: result.message }, { status: 429 });
 */

interface RateLimitEntry {
  count: number;
  firstRequestAt: number;
  lockedUntil?: number;
}

// Keyed as "prefix:ip" → entry
const store = new Map<string, RateLimitEntry>();

// Purge stale entries every 30 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    const maxWindow = 15 * 60 * 1000; // 15 min is the longest window
    if (now - entry.firstRequestAt > maxWindow && (!entry.lockedUntil || now > entry.lockedUntil)) {
      store.delete(key);
    }
  }
}, 30 * 60 * 1000);

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxAttempts: number;
  /** Sliding window duration in milliseconds */
  windowMs: number;
  /** How long to lock out after maxAttempts is reached (ms). Defaults to windowMs. */
  lockoutMs?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  attemptsRemaining: number;
  /** Seconds until lockout lifts (only set when allowed=false) */
  retryAfterSeconds?: number;
  message?: string;
}

// Preset configs ---------------------------------------------------------
export const LOGIN_LIMIT: RateLimitConfig = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,   // 15-minute window
  lockoutMs: 15 * 60 * 1000,  // 15-minute lockout after 5 failures
};

export const PUBLIC_API_LIMIT: RateLimitConfig = {
  maxAttempts: 10,
  windowMs: 10 * 60 * 1000,   // 10-minute window
  lockoutMs: 10 * 60 * 1000,
};
// ------------------------------------------------------------------------

/**
 * Check and record a rate-limit hit.
 * @param prefix  Logical bucket name, e.g. "login" | "booking" | "review"
 * @param ip      Client IP string
 * @param config  Rate-limit configuration (use LOGIN_LIMIT or PUBLIC_API_LIMIT)
 */
export function checkRateLimit(
  prefix: string,
  ip: string,
  config: RateLimitConfig
): RateLimitResult {
  const key = `${prefix}:${ip}`;
  const now = Date.now();
  const { maxAttempts, windowMs, lockoutMs = windowMs } = config;

  let entry = store.get(key);

  // Reset window if it has expired and no active lockout
  if (entry && now - entry.firstRequestAt > windowMs && (!entry.lockedUntil || now > entry.lockedUntil)) {
    store.delete(key);
    entry = undefined;
  }

  // Check existing lockout
  if (entry?.lockedUntil && now < entry.lockedUntil) {
    const retryAfterSeconds = Math.ceil((entry.lockedUntil - now) / 1000);
    return {
      allowed: false,
      attemptsRemaining: 0,
      retryAfterSeconds,
      message: `Too many attempts. Try again in ${Math.ceil(retryAfterSeconds / 60)} minute(s).`,
    };
  }

  if (!entry) {
    entry = { count: 0, firstRequestAt: now };
    store.set(key, entry);
  }

  entry.count += 1;

  if (entry.count > maxAttempts) {
    // Initiate lockout
    entry.lockedUntil = now + lockoutMs;
    const retryAfterSeconds = Math.ceil(lockoutMs / 1000);
    return {
      allowed: false,
      attemptsRemaining: 0,
      retryAfterSeconds,
      message: `Too many attempts. Account locked for ${Math.ceil(retryAfterSeconds / 60)} minute(s).`,
    };
  }

  return {
    allowed: true,
    attemptsRemaining: maxAttempts - entry.count,
  };
}

/**
 * Extract a real client IP from Next.js request headers.
 * Falls back to "unknown" if headers are absent.
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}
