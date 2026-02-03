import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, searchRatelimit, rateLimitHeaders } from "@/lib/ratelimit";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

/**
 * Listing search result type
 */
export interface ListingSearchResult {
  id: string;
  name: string;
  credentials: string[];
  avatar: string | null;
  specialties: string[];
  rating: number | null;
  reviewCount: number;
  location: {
    suburb: string | null;
    state: string | null;
    postcode: string | null;
  } | null;
  bio: string | null;
  verified: boolean;
  verificationLevel: string;
  acceptingStatus: string;
  freeConsultation: boolean;
  responseTimeHours: number | null;
  feeModel: string | null;
  priceBand: string | null;
  serviceMode: string;
}

/**
 * GET /api/listings
 *
 * Search and filter advisor listings.
 *
 * Query Parameters:
 * - advisor_type: Filter by type (financial_adviser, mortgage_broker, etc.)
 * - specialty: Filter by specialty slug
 * - state: Filter by AU state (NSW, VIC, etc.)
 * - postcode: Filter by postcode
 * - verified: Only verified advisors (true/false)
 * - accepting: Availability filter (taking_clients, waitlist, not_taking)
 * - service_mode: online | in_person | both
 * - min_rating: Minimum star rating (1-5)
 * - fee_model: Filter by fee model
 * - q: Text search (name, bio, specialties)
 * - sort: Sort order (rating_desc, reviews_desc, newest)
 * - page: Page number (default: 1)
 * - pageSize: Items per page (default: 20, max: 50)
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
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

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const advisorType = searchParams.get("advisor_type");
    const specialty = searchParams.get("specialty");
    const state = searchParams.get("state");
    const postcode = searchParams.get("postcode");
    const verified = searchParams.get("verified");
    const accepting = searchParams.get("accepting");
    const serviceMode = searchParams.get("service_mode");
    const minRating = searchParams.get("min_rating");
    const feeModel = searchParams.get("fee_model");
    const query = searchParams.get("q");
    const sort = searchParams.get("sort") || "rating_desc";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10)));

    // Create Supabase client
    const supabase = await createClient();

    // Build query
    let dbQuery = supabase
      .from("listing")
      .select(
        `
        id,
        headline,
        bio,
        advisor_type,
        service_mode,
        fee_model,
        price_band,
        verification_level,
        rating_avg,
        review_count,
        accepting_status,
        free_consultation,
        response_time_hours,
        advisor_profile!inner (
          display_name,
          avatar_url,
          years_experience
        ),
        business!inner (
          trading_name,
          location:primary_location_id (
            suburb,
            state,
            postcode
          )
        ),
        listing_specialty (
          specialty (
            name,
            slug
          )
        ),
        credential (
          afsl_number,
          asic_rep_number,
          verification_status
        )
      `,
        { count: "exact" }
      )
      .eq("is_active", true)
      .is("deleted_at", null);

    // Apply filters
    if (advisorType) {
      dbQuery = dbQuery.eq("advisor_type", advisorType);
    }

    if (verified === "true") {
      dbQuery = dbQuery.in("verification_level", ["licence_verified", "identity_verified"]);
    }

    if (accepting) {
      dbQuery = dbQuery.eq("accepting_status", accepting);
    }

    if (serviceMode && serviceMode !== "both") {
      dbQuery = dbQuery.or(`service_mode.eq.${serviceMode},service_mode.eq.both`);
    }

    if (minRating) {
      const rating = parseFloat(minRating);
      if (!isNaN(rating)) {
        dbQuery = dbQuery.gte("rating_avg", rating);
      }
    }

    if (feeModel) {
      dbQuery = dbQuery.eq("fee_model", feeModel);
    }

    // Text search (if search_vector exists, use full-text; otherwise use ilike)
    if (query) {
      dbQuery = dbQuery.or(
        `headline.ilike.%${query}%,bio.ilike.%${query}%`
      );
    }

    // Sorting
    switch (sort) {
      case "reviews_desc":
        dbQuery = dbQuery.order("review_count", { ascending: false, nullsFirst: false });
        break;
      case "newest":
        dbQuery = dbQuery.order("created_at", { ascending: false });
        break;
      case "rating_desc":
      default:
        dbQuery = dbQuery
          .order("search_boost", { ascending: false, nullsFirst: false })
          .order("rating_avg", { ascending: false, nullsFirst: false });
        break;
    }

    // Pagination
    const offset = (page - 1) * pageSize;
    dbQuery = dbQuery.range(offset, offset + pageSize - 1);

    // Execute query
    const { data: listings, error, count } = await dbQuery;

    if (error) {
      console.error("Listings query error:", error);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "DATABASE_ERROR",
            message: "Failed to fetch listings",
            statusCode: 500,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    // Filter by specialty (post-query since it's a junction table)
    let filteredListings = listings || [];
    if (specialty) {
      filteredListings = filteredListings.filter((listing: Record<string, unknown>) => {
        const specialties = listing.listing_specialty as Array<{ specialty: { slug: string } }> | null;
        return specialties?.some((s) => s.specialty?.slug === specialty);
      });
    }

    // Filter by location (post-query for nested relation)
    if (state) {
      filteredListings = filteredListings.filter((listing: Record<string, unknown>) => {
        const business = listing.business as { location?: { state?: string } } | null;
        return business?.location?.state === state;
      });
    }

    if (postcode) {
      filteredListings = filteredListings.filter((listing: Record<string, unknown>) => {
        const business = listing.business as { location?: { postcode?: string } } | null;
        return business?.location?.postcode === postcode;
      });
    }

    // Transform to API response shape
    const items: ListingSearchResult[] = filteredListings.map((listing: Record<string, unknown>) => {
      const advisorProfile = listing.advisor_profile as { display_name?: string; avatar_url?: string } | null;
      const business = listing.business as { trading_name?: string; location?: { suburb?: string; state?: string; postcode?: string } | null } | null;
      const specialtiesList = listing.listing_specialty as Array<{ specialty: { name: string } }> | null;
      const credentials = listing.credential as Array<{ afsl_number?: string; verification_status?: string }> | null;

      // Build credentials string array
      const credentialStrings: string[] = [];
      if (credentials?.some((c) => c.verification_status === "verified")) {
        credentialStrings.push("CFP"); // Placeholder - should come from qualifications table
      }

      return {
        id: listing.id as string,
        name: advisorProfile?.display_name || business?.trading_name || "Unknown",
        credentials: credentialStrings,
        avatar: advisorProfile?.avatar_url || null,
        specialties: specialtiesList?.map((s) => s.specialty?.name).filter(Boolean) as string[] || [],
        rating: listing.rating_avg as number | null,
        reviewCount: (listing.review_count as number) || 0,
        location: business?.location
          ? {
              suburb: business.location.suburb || null,
              state: business.location.state || null,
              postcode: business.location.postcode || null,
            }
          : null,
        bio: listing.bio as string | null,
        verified: ["licence_verified", "identity_verified"].includes(
          listing.verification_level as string
        ),
        verificationLevel: listing.verification_level as string,
        acceptingStatus: listing.accepting_status as string,
        freeConsultation: (listing.free_consultation as boolean) || false,
        responseTimeHours: listing.response_time_hours as number | null,
        feeModel: listing.fee_model as string | null,
        priceBand: listing.price_band as string | null,
        serviceMode: listing.service_mode as string,
      };
    });

    // Build pagination info
    const totalItems = count || filteredListings.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const response: ApiResponse<PaginatedResponse<ListingSearchResult>> = {
      success: true,
      data: {
        items,
        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      timestamp: new Date().toISOString(),
    };

    // Add performance header
    const headers = new Headers(rateLimitHeaders(rateLimitResult.remaining, rateLimitResult.reset));
    headers.set("X-Response-Time", `${Date.now() - startTime}ms`);

    return NextResponse.json(response, { headers });
  } catch (error) {
    console.error("Listings API error:", error);
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
