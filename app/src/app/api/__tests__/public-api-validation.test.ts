import { describe, expect, it } from "vitest";

import {
  listingsQuerySchema,
  matchRecommendationRequestSchema,
  matchRequestBatchSchema,
  publicLeadRequestSchema,
  uuidParamSchema,
} from "@/lib/schemas";

describe("public API validation", () => {
  it("rejects unsafe listings query text that previously caused PostgREST 500s", () => {
    const result = listingsQuerySchema.safeParse({ q: "a,b.(test)", page: "1", pageSize: "20" });
    expect(result.success).toBe(false);
  });

  it("accepts sanitized listings query text", () => {
    const parsed = listingsQuerySchema.parse({ q: "retirement planner", page: "1", pageSize: "20" });
    expect(parsed.q).toBe("retirement planner");
    expect(parsed.page).toBe(1);
    expect(parsed.pageSize).toBe(20);
  });

  it("rejects invalid listing id values", () => {
    const result = uuidParamSchema.safeParse({ id: "not-a-uuid" });
    expect(result.success).toBe(false);
  });

  it("accepts valid public lead payload", () => {
    const result = publicLeadRequestSchema.safeParse({
      listingId: "11111111-1111-4111-8111-111111111111",
      problemSummary: "I need help reviewing my super strategy and fee structure.",
      timeline: "next_month",
      preferredMeetingMode: "online",
      email: "person@example.com",
      privacyConsent: true,
      captchaToken: "abcdefghijklmnopqrstuvwxyz1234567890",
    });

    expect(result.success).toBe(true);
  });

  it("rejects public lead payload without consent", () => {
    const result = publicLeadRequestSchema.safeParse({
      listingId: "11111111-1111-4111-8111-111111111111",
      problemSummary: "I need help reviewing my super strategy and fee structure.",
      email: "person@example.com",
      privacyConsent: false,
    });

    expect(result.success).toBe(false);
  });

  it("accepts valid match recommendation payload", () => {
    const result = matchRecommendationRequestSchema.safeParse({
      goal: "property",
      urgency: "urgent",
      situation: "couple",
      location: "Melbourne, VIC",
      limit: 3,
    });

    expect(result.success).toBe(true);
  });

  it("accepts valid match request batch payload", () => {
    const result = matchRequestBatchSchema.safeParse({
      listingIds: [
        "11111111-1111-4111-8111-111111111111",
        "22222222-2222-4222-8222-222222222222",
      ],
      problemSummary: "I need help comparing refinancing options and structuring our next steps.",
      timeline: "next_month",
      email: "person@example.com",
      privacyConsent: true,
      captchaToken: "abcdefghijklmnopqrstuvwxyz1234567890",
    });

    expect(result.success).toBe(true);
  });
});
