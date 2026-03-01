import { NextRequest, NextResponse } from "next/server";

import { listingsQuerySchema } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api";

type FacetListingRow = {
  advisor_type: string;
  accepting_status: string;
  verification_level: string;
  rating_avg: number | null;
  fee_model: string | null;
  service_mode: string;
  headline: string | null;
  bio: string | null;
  business: {
    location?: {
      suburb?: string | null;
      state?: string | null;
      postcode?: string | null;
    } | null;
  } | null;
  listing_specialty: Array<{
    specialty: {
      slug?: string | null;
      name?: string | null;
    } | null;
  }> | null;
  listing_service_area: Array<{
    state?: string | null;
    postcode?: string | null;
    location?: {
      suburb?: string | null;
      state?: string | null;
      postcode?: string | null;
    } | null;
  }> | null;
};

interface ListingFacetsResponse {
  advisorType: Array<{ value: string; count: number }>;
  specialty: Array<{ slug: string; name: string; count: number }>;
  state: Array<{ value: string; count: number }>;
  acceptingStatus: Array<{ value: string; count: number }>;
}

function normalize(value: string | null | undefined): string {
  return (value || "").trim().toLowerCase();
}

function hasLocationMatch(
  listing: FacetListingRow,
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

function matchesSearchQuery(listing: FacetListingRow, query: string): boolean {
  const q = normalize(query);
  if (!q) return true;

  const specialtyNames = (listing.listing_specialty || [])
    .map((entry) => normalize(entry.specialty?.name))
    .filter(Boolean);
  const haystack = [normalize(listing.headline), normalize(listing.bio), ...specialtyNames]
    .join(" ")
    .trim();

  return haystack.includes(q);
}

export async function GET(request: NextRequest) {
  try {
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
        { status: 400 }
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
    } = parsedQuery.data;

    const supabase = await createClient();
    const { data: listings, error } = await supabase
      .from("listing")
      .select(
        `
        advisor_type,
        accepting_status,
        verification_level,
        rating_avg,
        fee_model,
        service_mode,
        headline,
        bio,
        business!inner (
          location:primary_location_id (
            suburb,
            state,
            postcode
          )
        ),
        listing_specialty (
          specialty (
            slug,
            name
          )
        ),
        listing_service_area (
          state,
          postcode,
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
            message: "Failed to fetch listing facets",
            statusCode: 500,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    const filteredListings = ((listings || []) as unknown as FacetListingRow[]).filter((listing) => {
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

    const advisorTypeCounts = new Map<string, number>();
    const specialtyCounts = new Map<string, { slug: string; name: string; count: number }>();
    const stateCounts = new Map<string, number>();
    const acceptingStatusCounts = new Map<string, number>();

    for (const listing of filteredListings) {
      advisorTypeCounts.set(listing.advisor_type, (advisorTypeCounts.get(listing.advisor_type) || 0) + 1);
      acceptingStatusCounts.set(
        listing.accepting_status,
        (acceptingStatusCounts.get(listing.accepting_status) || 0) + 1
      );

      const listingStates = new Set<string>();
      const businessState = listing.business?.location?.state;
      if (businessState) listingStates.add(businessState);
      for (const area of listing.listing_service_area || []) {
        if (area.state) listingStates.add(area.state);
        if (area.location?.state) listingStates.add(area.location.state);
      }
      for (const listingState of listingStates) {
        stateCounts.set(listingState, (stateCounts.get(listingState) || 0) + 1);
      }

      for (const entry of listing.listing_specialty || []) {
        const slug = entry.specialty?.slug;
        const name = entry.specialty?.name;
        if (!slug || !name) continue;
        const existing = specialtyCounts.get(slug);
        if (existing) {
          existing.count += 1;
        } else {
          specialtyCounts.set(slug, { slug, name, count: 1 });
        }
      }
    }

    const response: ListingFacetsResponse = {
      advisorType: [...advisorTypeCounts.entries()]
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count),
      specialty: [...specialtyCounts.values()].sort((a, b) => b.count - a.count),
      state: [...stateCounts.entries()]
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count),
      acceptingStatus: [...acceptingStatusCounts.entries()]
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count),
    };

    return NextResponse.json<ApiResponse<ListingFacetsResponse>>({
      success: true,
      data: response,
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

