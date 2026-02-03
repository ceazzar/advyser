/**
 * Rate Limiting Configuration
 *
 * Uses Upstash Redis for serverless rate limiting.
 *
 * SETUP REQUIRED:
 * 1. Create an Upstash Redis database at https://upstash.com
 * 2. Add to .env.local:
 *    UPSTASH_REDIS_REST_URL=your_url
 *    UPSTASH_REDIS_REST_TOKEN=your_token
 * 3. Install: npm install @upstash/ratelimit @upstash/redis
 */

// Type definitions for when packages aren't installed
type RatelimitInstance = {
  limit: (identifier: string) => Promise<{ success: boolean; remaining: number; reset: number }>;
};

// Dynamic imports to handle missing packages gracefully
let Ratelimit: {
  new (config: { redis: unknown; limiter: unknown; analytics?: boolean; prefix?: string }): RatelimitInstance;
  slidingWindow: (requests: number, window: string) => unknown;
} | null = null;

let Redis: { new (config: { url: string; token: string }): unknown } | null = null;

// Try to load packages if available
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const upstashRatelimit = require("@upstash/ratelimit");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const upstashRedis = require("@upstash/redis");
  Ratelimit = upstashRatelimit.Ratelimit;
  Redis = upstashRedis.Redis;
} catch {
  // Packages not installed - rate limiting will be disabled
  console.warn("Upstash packages not installed. Rate limiting disabled.");
}

// Initialize Redis client (fails gracefully if not configured)
const redis =
  Redis && process.env.UPSTASH_REDIS_REST_URL
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      })
    : null;

/**
 * Search rate limit: 60 requests per minute per IP
 * Protects against scraping and abuse
 */
export const searchRatelimit: RatelimitInstance | null =
  redis && Ratelimit
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(60, "1 m"),
        analytics: true,
        prefix: "ratelimit:search",
      })
    : null;

/**
 * Lead creation rate limit: 5 per hour per user
 * Prevents spam requests to advisors
 */
export const leadRatelimit: RatelimitInstance | null =
  redis && Ratelimit
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "1 h"),
        analytics: true,
        prefix: "ratelimit:lead",
      })
    : null;

/**
 * Message rate limit: 30 per minute per user
 * Prevents message flooding
 */
export const messageRatelimit: RatelimitInstance | null =
  redis && Ratelimit
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(30, "1 m"),
        analytics: true,
        prefix: "ratelimit:message",
      })
    : null;

/**
 * Auth rate limit: 5 attempts per minute per IP
 * Protects against brute force attacks
 */
export const authRatelimit: RatelimitInstance | null =
  redis && Ratelimit
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "1 m"),
        analytics: true,
        prefix: "ratelimit:auth",
      })
    : null;

/**
 * Helper to check rate limit and return appropriate response
 */
export async function checkRateLimit(
  limiter: RatelimitInstance | null,
  identifier: string
): Promise<{ success: boolean; remaining?: number; reset?: number }> {
  if (!limiter) {
    // In production, fail closed if rate limiter not configured
    if (process.env.NODE_ENV === "production") {
      console.error("Rate limiter not configured in production - blocking request");
      return { success: false, remaining: 0, reset: Date.now() + 60000 };
    }
    // In development, allow requests but log warning
    console.warn("Rate limiting disabled (Upstash not configured)");
    return { success: true };
  }

  const result = await limiter.limit(identifier);

  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}

/**
 * Rate limit headers for API responses
 */
export function rateLimitHeaders(remaining?: number, reset?: number): HeadersInit {
  const headers: HeadersInit = {};

  if (remaining !== undefined) {
    headers["X-RateLimit-Remaining"] = String(remaining);
  }

  if (reset !== undefined) {
    headers["X-RateLimit-Reset"] = String(reset);
  }

  return headers;
}
