import { describe, expect, it } from "vitest";

import { scoreMatchCandidate } from "@/lib/matching/score";

describe("match scoring", () => {
  it("ranks stronger property match above weaker fit", () => {
    const input = {
      goal: "property" as const,
      urgency: "urgent" as const,
      situation: "couple" as const,
      location: "Melbourne, VIC",
    };

    const strong = scoreMatchCandidate(input, {
      listingId: "11111111-1111-4111-8111-111111111111",
      advisorType: "mortgage_broker",
      specialtySlugs: ["first-home-buyers", "refinance"],
      suburb: "Melbourne",
      state: "VIC",
      acceptingStatus: "taking_clients",
      responseTimeHours: 4,
      verificationLevel: "licence_verified",
      rating: 4.8,
      responseRate: 95,
      profileCompletenessScore: 92,
    });

    const weak = scoreMatchCandidate(input, {
      listingId: "22222222-2222-4222-8222-222222222222",
      advisorType: "financial_adviser",
      specialtySlugs: ["tax-planning"],
      suburb: "Perth",
      state: "WA",
      acceptingStatus: "waitlist",
      responseTimeHours: 72,
      verificationLevel: "none",
      rating: 3.9,
      responseRate: 40,
      profileCompletenessScore: 55,
    });

    expect(strong.score).toBeGreaterThan(weak.score);
    expect(strong.reasons.length).toBeGreaterThan(0);
  });
});

