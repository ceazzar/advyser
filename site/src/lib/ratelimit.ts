import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type RatelimitInstance = {
  limit: (identifier: string) => Promise<{ success: boolean; remaining: number; reset: number }>;
};

function createRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return new Redis({ url, token });
}

const redis = createRedisClient();

function createLimiter(
  requests: number,
  window: `${number} ${"s" | "m" | "h" | "d"}`,
  prefix: string
): RatelimitInstance | null {
  if (!redis) {
    return null;
  }

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: true,
    prefix,
  });
}

/**
 * Search rate limit: 60 requests per minute per IP
 */
export const searchRatelimit = createLimiter(60, "1 m", "ratelimit:search");

/**
 * Lead creation rate limit: 5 per hour per user
 */
export const leadRatelimit = createLimiter(5, "1 h", "ratelimit:lead");

/**
 * Message rate limit: 30 per minute per user
 */
export const messageRatelimit = createLimiter(30, "1 m", "ratelimit:message");

/**
 * Auth rate limit: 5 attempts per minute per IP
 */
export const authRatelimit = createLimiter(5, "1 m", "ratelimit:auth");

export async function checkRateLimit(
  limiter: RatelimitInstance | null,
  identifier: string
): Promise<{ success: boolean; remaining?: number; reset?: number }> {
  if (!limiter) {
    const strictMode = process.env.RATE_LIMIT_STRICT === "true" || process.env.NODE_ENV === "production";

    if (strictMode) {
      console.error("Rate limiter unavailable in strict mode - blocking request", {
        identifier,
      });
      return { success: false, remaining: 0, reset: Date.now() + 60_000 };
    }

    console.warn("Rate limiter unavailable in non-strict mode - allowing request", {
      identifier,
    });
    return { success: true };
  }

  const result = await limiter.limit(identifier);

  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}

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
