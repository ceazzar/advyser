import { afterEach, describe, expect, it } from "vitest";

import { checkRateLimit } from "@/lib/ratelimit";

const ORIGINAL_RATE_LIMIT_STRICT = process.env.RATE_LIMIT_STRICT;
const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

describe("checkRateLimit", () => {
  afterEach(() => {
    if (ORIGINAL_RATE_LIMIT_STRICT === undefined) {
      delete process.env.RATE_LIMIT_STRICT;
    } else {
      process.env.RATE_LIMIT_STRICT = ORIGINAL_RATE_LIMIT_STRICT;
    }

    if (ORIGINAL_NODE_ENV === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = ORIGINAL_NODE_ENV;
    }
  });

  it("allows requests when limiter is missing in non-strict mode", async () => {
    delete process.env.RATE_LIMIT_STRICT;
    process.env.NODE_ENV = "development";

    const result = await checkRateLimit(null, "test-ip");

    expect(result.success).toBe(true);
  });

  it("blocks requests when limiter is missing in strict mode", async () => {
    process.env.RATE_LIMIT_STRICT = "true";
    process.env.NODE_ENV = "development";

    const result = await checkRateLimit(null, "test-ip");

    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.reset).toBeTypeOf("number");
  });
});
