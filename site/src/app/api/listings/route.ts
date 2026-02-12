import { NextRequest, NextResponse } from "next/server";

import { checkRateLimit, rateLimitHeaders,searchRatelimit } from "@/lib/ratelimit";
import { listingsQuerySchema } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

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

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (!forwarded) return "anonymous";
  return forwarded.split(",")[0]?.trim() || "anonymous";
}

const PUBLIC_CACHE_CONTROL = "public, s-maxage=60, stale-while-revalidate=300";

export async function GET(request: NextRequest) {
  const startTime = Date.now();

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
          headers: {
            ...rateLimitHeaders(rateLimitResult.remaining, rateLimitResult.reset),
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const parsedQuery = listingsQuerySchema.safeParse(
      Object.fromEntries(request.nextUrl.searchParams.entries())
    );

    if (!parsedQuery.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "INVALID_QUERY",
            message: "One or more query parameters are invalid.",
            details: parsedQuery.error.flatten().fieldErrors,
            statusCode: 400,
          },
          timestamp: new Date().toISOString(),
        },
        {
          status: 400,
          headers: {
            ...rateLimitHeaders(rateLimitResult.remaining, rateLimitResult.reset),
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const {
      advisor_type: advisorType,
      specialty,
      state,
      postcode,
      verified,
      accepting,
      service_mode: serviceMode,
      min_rating: minRating,
      fee_model: feeModel,
      q: query,
      sort,
      page,
      pageSize,
    } = parsedQuery.data;

    const supabase = await createClient();

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
        )
      `
      )
      .eq("is_active", true)
      .is("deleted_at", null);

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

    if (typeof minRating === "number") {
      dbQuery = dbQuery.gte("rating_avg", minRating);
    }

    if (feeModel) {
      dbQuery = dbQuery.eq("fee_model", feeModel);
    }

    if (query) {
      dbQuery = dbQuery.or(`headline.ilike.%${query}%,bio.ilike.%${query}%`);
    }

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

    const { data: listings, error } = await dbQuery;

    if (error) {
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
        {
          status: 500,
          headers: {
            ...rateLimitHeaders(rateLimitResult.remaining, rateLimitResult.reset),
            "Cache-Control": "no-store",
          },
        }
      );
    }

    let filteredListings = listings || [];

    if (specialty) {
      filteredListings = filteredListings.filter((listing: Record<string, unknown>) => {
        const specialties = listing.listing_specialty as Array<{ specialty: { slug: string } }> | null;
        return specialties?.some((item) => item.specialty?.slug === specialty);
      });
    }

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

    const totalItems = filteredListings.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const offset = (page - 1) * pageSize;
    const pagedListings = filteredListings.slice(offset, offset + pageSize);

    const items: ListingSearchResult[] = pagedListings.map((listing: Record<string, unknown>) => {
      const advisorProfile = listing.advisor_profile as {
        display_name?: string;
        avatar_url?: string;
      } | null;
      const business = listing.business as {
        trading_name?: string;
        location?: { suburb?: string; state?: string; postcode?: string } | null;
      } | null;
      const specialtiesList = listing.listing_specialty as Array<{ specialty: { name: string } }> | null;

      const credentialStrings =
        (listing.verification_level as string) === "licence_verified" ||
        (listing.verification_level as string) === "identity_verified"
          ? ["Verified"]
          : [];

      return {
        id: listing.id as string,
        name: advisorProfile?.display_name || business?.trading_name || "Unknown",
        credentials: credentialStrings,
        avatar: advisorProfile?.avatar_url || null,
        specialties: specialtiesList?.map((item) => item.specialty?.name).filter(Boolean) as string[] || [],
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
        verified: ["licence_verified", "identity_verified"].includes(listing.verification_level as string),
        verificationLevel: listing.verification_level as string,
        acceptingStatus: listing.accepting_status as string,
        freeConsultation: (listing.free_consultation as boolean) || false,
        responseTimeHours: listing.response_time_hours as number | null,
        feeModel: listing.fee_model as string | null,
        priceBand: listing.price_band as string | null,
        serviceMode: listing.service_mode as string,
      };
    });

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

    const headers = new Headers({
      ...rateLimitHeaders(rateLimitResult.remaining, rateLimitResult.reset),
      "X-Response-Time": `${Date.now() - startTime}ms`,
      "Cache-Control": PUBLIC_CACHE_CONTROL,
    });

    return NextResponse.json(response, { headers });
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
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
