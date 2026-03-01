import { NextRequest, NextResponse } from "next/server";

import { checkRateLimit, rateLimitHeaders, searchRatelimit } from "@/lib/ratelimit";
import { listingsQuerySchema } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

export interface ListingSearchResult {
  id: string;
  name: string;
  credentials: string[];
  avatar: string | null;
  specialties: string[];
  specialtySlugs: string[];
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
  responseRate: number | null;
  profileCompletenessScore: number | null;
  feeModel: string | null;
  priceBand: string | null;
  serviceMode: string;
  advisorType: string;
}

type ListingRow = {
  id: string;
  headline: string | null;
  bio: string | null;
  advisor_type: string;
  service_mode: string;
  fee_model: string | null;
  price_band: string | null;
  verification_level: string;
  rating_avg: number | null;
  review_count: number | null;
  accepting_status: string;
  free_consultation: boolean | null;
  response_time_hours: number | null;
  response_rate: number | null;
  profile_completeness_score: number | null;
  search_boost: number | null;
  created_at: string;
  advisor_profile: {
    display_name?: string;
    avatar_url?: string;
  } | null;
  business: {
    trading_name?: string;
    location?: {
      suburb?: string;
      state?: string;
      postcode?: string;
    } | null;
  } | null;
  listing_specialty: Array<{
    specialty: {
      name?: string;
      slug?: string;
    } | null;
  }> | null;
  listing_service_area: Array<{
    state?: string | null;
    postcode?: string | null;
    is_nationwide?: boolean | null;
    location?: {
      suburb?: string | null;
      state?: string | null;
      postcode?: string | null;
    } | null;
  }> | null;
};

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (!forwarded) return "anonymous";
  return forwarded.split(",")[0]?.trim() || "anonymous";
}

function normalize(value: string | null | undefined): string {
  return (value || "").trim().toLowerCase();
}

function hasLocationMatch(
  listing: ListingRow,
  filters: { state?: string; postcode?: string; suburb?: string }
): boolean {
  const businessLocation = listing.business?.location;
  const serviceAreas = listing.listing_service_area || [];

  const suburbs = [businessLocation?.suburb, ...serviceAreas.map((area) => area.location?.suburb)].map(normalize);
  const states = [businessLocation?.state, ...serviceAreas.map((area) => area.state || area.location?.state)].map(normalize);
  const postcodes = [businessLocation?.postcode, ...serviceAreas.map((area) => area.postcode || area.location?.postcode)].map(normalize);

  if (filters.state && !states.includes(normalize(filters.state))) return false;
  if (filters.postcode && !postcodes.includes(normalize(filters.postcode))) return false;
  if (filters.suburb && !suburbs.some((suburb) => suburb.includes(normalize(filters.suburb!)))) return false;

  return true;
}

function matchesSearchQuery(listing: ListingRow, query: string): boolean {
  const q = normalize(query);
  if (!q) return true;

  const specialtyNames = (listing.listing_specialty || [])
    .map((entry) => normalize(entry.specialty?.name))
    .filter(Boolean);
  const haystack = [
    normalize(listing.headline),
    normalize(listing.bio),
    normalize(listing.advisor_profile?.display_name),
    normalize(listing.business?.trading_name),
    ...specialtyNames,
  ]
    .join(" ")
    .trim();

  return haystack.includes(q);
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
      suburb,
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

    const { data: listings, error } = await supabase
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
        response_rate,
        profile_completeness_score,
        search_boost,
        created_at,
        advisor_profile!inner (
          display_name,
          avatar_url
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
        listing_service_area (
          state,
          postcode,
          is_nationwide,
          location:location_id (
            suburb,
            state,
            postcode
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

    let filteredListings = (listings || []) as unknown as ListingRow[];

    filteredListings = filteredListings.filter((listing) => {
      if (advisorType && listing.advisor_type !== advisorType) return false;
      if (verified === "true" && !["licence_verified", "identity_verified"].includes(listing.verification_level)) {
        return false;
      }
      if (accepting && listing.accepting_status !== accepting) return false;
      if (serviceMode && serviceMode !== "both") {
        if (!(listing.service_mode === serviceMode || listing.service_mode === "both")) return false;
      }
      if (typeof minRating === "number" && (listing.rating_avg ?? 0) < minRating) return false;
      if (feeModel && listing.fee_model !== feeModel) return false;
      if (specialty) {
        const slugs = (listing.listing_specialty || [])
          .map((entry) => entry.specialty?.slug)
          .filter(Boolean)
          .map((slug) => normalize(slug!));
        if (!slugs.includes(normalize(specialty))) return false;
      }
      if ((state || postcode || suburb) && !hasLocationMatch(listing, { state, postcode, suburb })) {
        return false;
      }
      if (query && !matchesSearchQuery(listing, query)) return false;
      return true;
    });

    switch (sort) {
      case "reviews_desc":
        filteredListings.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
        break;
      case "newest":
        filteredListings.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
        break;
      case "rating_desc":
      default:
        filteredListings.sort((a, b) => {
          const boostDiff = (b.search_boost || 0) - (a.search_boost || 0);
          if (boostDiff !== 0) return boostDiff;
          return (b.rating_avg || 0) - (a.rating_avg || 0);
        });
        break;
    }

    const totalItems = filteredListings.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const offset = (page - 1) * pageSize;
    const pagedListings = filteredListings.slice(offset, offset + pageSize);

    const items: ListingSearchResult[] = pagedListings.map((listing) => {
      const specialties = (listing.listing_specialty || [])
        .map((entry) => entry.specialty?.name)
        .filter(Boolean) as string[];
      const specialtySlugs = (listing.listing_specialty || [])
        .map((entry) => entry.specialty?.slug)
        .filter(Boolean) as string[];

      const verifiedListing = ["licence_verified", "identity_verified"].includes(
        listing.verification_level
      );

      return {
        id: listing.id,
        name:
          listing.advisor_profile?.display_name ||
          listing.business?.trading_name ||
          "Unknown",
        credentials: verifiedListing ? ["Verified"] : [],
        avatar: listing.advisor_profile?.avatar_url || null,
        specialties,
        specialtySlugs,
        rating: listing.rating_avg,
        reviewCount: listing.review_count || 0,
        location: listing.business?.location
          ? {
              suburb: listing.business.location.suburb || null,
              state: listing.business.location.state || null,
              postcode: listing.business.location.postcode || null,
            }
          : null,
        bio: listing.bio,
        verified: verifiedListing,
        verificationLevel: listing.verification_level,
        acceptingStatus: listing.accepting_status,
        freeConsultation: listing.free_consultation || false,
        responseTimeHours: listing.response_time_hours,
        responseRate: listing.response_rate,
        profileCompletenessScore: listing.profile_completeness_score,
        feeModel: listing.fee_model,
        priceBand: listing.price_band,
        serviceMode: listing.service_mode,
        advisorType: listing.advisor_type,
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

