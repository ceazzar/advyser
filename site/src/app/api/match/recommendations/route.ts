import { NextRequest, NextResponse } from "next/server";

import { ADVISOR_TYPE_OPTIONS, type AdvisorType } from "@/lib/constants/marketplace-taxonomy";
import { scoreMatchCandidate } from "@/lib/matching/score";
import { checkRateLimit, rateLimitHeaders, searchRatelimit } from "@/lib/ratelimit";
import { matchRecommendationRequestSchema } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api";

interface MatchRecommendationItem {
  listingId: string;
  score: number;
  reasons: Array<{ text: string; strength: "strong" | "moderate" }>;
  listing: {
    id: string;
    name: string;
    headline: string | null;
    advisorType: string;
    location: string;
    rating: number | null;
    reviewCount: number;
    responseTimeHours: number | null;
    responseRate: number | null;
    verified: boolean;
    specialties: string[];
    specialtySlugs: string[];
  };
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (!forwarded) return "anonymous";
  return forwarded.split(",")[0]?.trim() || "anonymous";
}

function formatLocation(
  location: { suburb?: string | null; state?: string | null } | null | undefined
): string {
  if (!location) return "Australia";
  if (location.suburb && location.state) return `${location.suburb}, ${location.state}`;
  return location.state || location.suburb || "Australia";
}

const ADVISOR_TYPE_SET = new Set<string>(ADVISOR_TYPE_OPTIONS.map((option) => option.value));

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimitResult = await checkRateLimit(searchRatelimit, ip);

    if (!rateLimitResult.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Too many requests. Please try again later.",
            statusCode: 429,
          },
          timestamp: new Date().toISOString(),
        },
        {
          status: 429,
          headers: rateLimitHeaders(rateLimitResult.remaining, rateLimitResult.reset),
        }
      );
    }

    const payload = matchRecommendationRequestSchema.safeParse(await request.json());
    if (!payload.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Match recommendation payload is invalid.",
            details: payload.error.flatten().fieldErrors,
            statusCode: 400,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: listings, error } = await supabase
      .from("listing")
      .select(
        `
        id,
        headline,
        advisor_type,
        accepting_status,
        response_time_hours,
        response_rate,
        profile_completeness_score,
        verification_level,
        rating_avg,
        review_count,
        advisor_profile (
          display_name
        ),
        business (
          trading_name,
          location:primary_location_id (
            suburb,
            state
          )
        ),
        listing_specialty (
          specialty (
            name,
            slug
          )
        )
      `
      )
      .eq("is_active", true)
      .is("deleted_at", null);

    if (error) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "DATABASE_ERROR",
            message: "Failed to fetch candidates for matching.",
            statusCode: 500,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    const input = payload.data;
    const ranked = (listings || [])
      .map((listing) => {
        if (!ADVISOR_TYPE_SET.has(listing.advisor_type)) return null;

        const business = listing.business as unknown as {
          trading_name?: string;
          location?: { suburb?: string; state?: string } | null;
        } | null;
        const advisorProfile = listing.advisor_profile as unknown as {
          display_name?: string;
        } | null;
        const specialtyEntries = (listing.listing_specialty as unknown as Array<{
          specialty: { slug?: string; name?: string } | null;
        }> | null) || [];

        const specialtySlugs = specialtyEntries
          .map((entry) => entry.specialty?.slug)
          .filter(Boolean) as string[];
        const specialties = specialtyEntries
          .map((entry) => entry.specialty?.name)
          .filter(Boolean) as string[];

        const scored = scoreMatchCandidate(input, {
          listingId: listing.id,
          advisorType: listing.advisor_type as AdvisorType,
          specialtySlugs,
          suburb: business?.location?.suburb || null,
          state: business?.location?.state || null,
          acceptingStatus: listing.accepting_status,
          responseTimeHours: listing.response_time_hours,
          verificationLevel: listing.verification_level,
          rating: listing.rating_avg,
          responseRate: listing.response_rate,
          profileCompletenessScore: listing.profile_completeness_score,
        });

        const result: MatchRecommendationItem = {
          listingId: listing.id,
          score: scored.score,
          reasons: scored.reasons,
          listing: {
            id: listing.id,
            name:
              advisorProfile?.display_name || business?.trading_name || "Unknown advisor",
            headline: listing.headline,
            advisorType: listing.advisor_type,
            location: formatLocation(business?.location),
            rating: listing.rating_avg,
            reviewCount: listing.review_count || 0,
            responseTimeHours: listing.response_time_hours,
            responseRate: listing.response_rate,
            verified: ["licence_verified", "identity_verified"].includes(
              listing.verification_level
            ),
            specialties,
            specialtySlugs,
          },
        };

        return result;
      })
      .filter(Boolean)
      .map((item) => item as MatchRecommendationItem)
      .sort((a, b) => b.score - a.score)
      .slice(0, input.limit);

    return NextResponse.json<ApiResponse<{ items: MatchRecommendationItem[] }>>({
      success: true,
      data: { items: ranked },
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
          statusCode: 500,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
