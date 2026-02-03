import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api";

/**
 * Full listing detail type
 */
export interface ListingDetail {
  id: string;
  // Profile
  name: string;
  headline: string | null;
  bio: string | null;
  whatIHelpWith: string | null;
  whoIDontWorkWith: string | null;
  approachToAdvice: string | null;
  avatar: string | null;
  yearsExperience: number | null;
  languages: string[];

  // Business
  businessName: string | null;
  abn: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: {
    line1: string | null;
    line2: string | null;
    suburb: string | null;
    state: string | null;
    postcode: string | null;
  } | null;

  // Classification
  advisorType: string;
  serviceMode: string;
  feeModel: string | null;
  priceBand: string | null;
  minimumInvestment: number | null;
  freeConsultation: boolean;

  // Availability
  acceptingStatus: string;
  responseTimeHours: number | null;

  // Trust signals
  verified: boolean;
  verificationLevel: string;
  lastVerifiedAt: string | null;

  // Ratings
  rating: number | null;
  reviewCount: number;

  // Credentials (AFSL/AR numbers)
  credentials: {
    afslNumber: string | null;
    asicRepNumber: string | null;
    verificationStatus: string;
    asicRegisterUrl: string | null;
  }[];

  // Qualifications
  qualifications: {
    name: string;
    abbreviation: string;
    issuingBody: string | null;
  }[];

  // Specialties
  specialties: {
    name: string;
    slug: string;
    description: string | null;
  }[];

  // Service offerings
  services: {
    name: string;
    slug: string;
    description: string | null;
    priceText: string | null;
    durationMinutes: number | null;
  }[];

  // Service areas
  serviceAreas: {
    suburb: string | null;
    state: string | null;
    postcode: string | null;
    isNationwide: boolean;
  }[];

  // Recent reviews (top 3)
  recentReviews: {
    id: string;
    rating: number;
    title: string | null;
    body: string | null;
    createdAt: string;
    consumerDisplayName: string | null;
  }[];
}

/**
 * GET /api/listings/[id]
 *
 * Get full details for a single listing.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Listing ID is required",
            statusCode: 400,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch listing with all related data
    const { data: listing, error } = await supabase
      .from("listing")
      .select(
        `
        id,
        headline,
        bio,
        what_i_help_with,
        who_i_dont_work_with,
        approach_to_advice,
        advisor_type,
        service_mode,
        fee_model,
        price_band,
        minimum_investment,
        free_consultation,
        accepting_status,
        response_time_hours,
        verification_level,
        last_verified_at,
        rating_avg,
        review_count,
        advisor_profile (
          display_name,
          avatar_url,
          years_experience,
          languages
        ),
        business (
          trading_name,
          legal_name,
          abn,
          website,
          contact_email,
          contact_phone,
          primary_location_id,
          location:primary_location_id (
            address_line_1,
            address_line_2,
            suburb,
            state,
            postcode
          )
        ),
        listing_specialty (
          specialty (
            name,
            slug,
            description
          )
        ),
        listing_service_offering (
          price_text,
          duration_minutes,
          description,
          service_offering (
            name,
            slug
          )
        ),
        listing_service_area (
          is_nationwide,
          state,
          postcode,
          location:location_id (
            suburb,
            state,
            postcode
          )
        ),
        credential (
          afsl_number,
          asic_rep_number,
          verification_status,
          verified_at
        ),
        advisor_qualification (
          qualification (
            name,
            abbreviation,
            issuing_body
          )
        )
      `
      )
      .eq("id", id)
      .eq("is_active", true)
      .is("deleted_at", null)
      .single();

    if (error || !listing) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Listing not found",
            statusCode: 404,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Fetch recent published reviews
    const { data: reviews } = await supabase
      .from("review")
      .select(
        `
        id,
        rating,
        title,
        body,
        created_at,
        consumer:consumer_user_id (
          display_name
        )
      `
      )
      .eq("listing_id", id)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(3);

    // Type assertions for nested data - use unknown first then cast
    const advisorProfile = listing.advisor_profile as unknown as {
      display_name?: string;
      avatar_url?: string;
      years_experience?: number;
      languages?: string[];
    } | null;

    const business = listing.business as unknown as {
      trading_name?: string;
      legal_name?: string;
      abn?: string;
      website?: string;
      contact_email?: string;
      contact_phone?: string;
      location?: {
        address_line_1?: string;
        address_line_2?: string;
        suburb?: string;
        state?: string;
        postcode?: string;
      } | null;
    } | null;

    const listingSpecialties = listing.listing_specialty as unknown as Array<{
      specialty: { name: string; slug: string; description?: string } | null;
    }> | null;

    const listingServices = listing.listing_service_offering as unknown as Array<{
      price_text?: string;
      duration_minutes?: number;
      description?: string;
      service_offering: { name: string; slug: string } | null;
    }> | null;

    const serviceAreas = listing.listing_service_area as unknown as Array<{
      is_nationwide?: boolean;
      state?: string;
      postcode?: string;
      location?: { suburb?: string; state?: string; postcode?: string } | null;
    }> | null;

    const credentials = listing.credential as unknown as Array<{
      afsl_number?: string;
      asic_rep_number?: string;
      verification_status?: string;
      verified_at?: string;
    }> | null;

    const qualifications = listing.advisor_qualification as unknown as Array<{
      qualification: { name: string; abbreviation: string; issuing_body?: string } | null;
    }> | null;

    // Transform to API response
    const detail: ListingDetail = {
      id: listing.id,
      name: advisorProfile?.display_name || business?.trading_name || "Unknown",
      headline: listing.headline,
      bio: listing.bio,
      whatIHelpWith: listing.what_i_help_with,
      whoIDontWorkWith: listing.who_i_dont_work_with,
      approachToAdvice: listing.approach_to_advice,
      avatar: advisorProfile?.avatar_url || null,
      yearsExperience: advisorProfile?.years_experience || null,
      languages: advisorProfile?.languages || [],

      businessName: business?.trading_name || null,
      abn: business?.abn || null,
      website: business?.website || null,
      email: business?.contact_email || null,
      phone: business?.contact_phone || null,
      address: business?.location
        ? {
            line1: business.location.address_line_1 || null,
            line2: business.location.address_line_2 || null,
            suburb: business.location.suburb || null,
            state: business.location.state || null,
            postcode: business.location.postcode || null,
          }
        : null,

      advisorType: listing.advisor_type,
      serviceMode: listing.service_mode,
      feeModel: listing.fee_model,
      priceBand: listing.price_band,
      minimumInvestment: listing.minimum_investment,
      freeConsultation: listing.free_consultation || false,

      acceptingStatus: listing.accepting_status,
      responseTimeHours: listing.response_time_hours,

      verified: ["licence_verified", "identity_verified"].includes(listing.verification_level),
      verificationLevel: listing.verification_level,
      lastVerifiedAt: listing.last_verified_at,

      rating: listing.rating_avg,
      reviewCount: listing.review_count || 0,

      credentials:
        credentials?.map((c) => ({
          afslNumber: c.afsl_number || null,
          asicRepNumber: c.asic_rep_number || null,
          verificationStatus: c.verification_status || "pending",
          asicRegisterUrl: c.asic_rep_number
            ? `https://moneysmart.gov.au/financial-advice/find-an-adviser?adviserId=${c.asic_rep_number}`
            : null,
        })) || [],

      qualifications:
        qualifications
          ?.filter((q) => q.qualification)
          .map((q) => ({
            name: q.qualification!.name,
            abbreviation: q.qualification!.abbreviation,
            issuingBody: q.qualification!.issuing_body || null,
          })) || [],

      specialties:
        listingSpecialties
          ?.filter((s) => s.specialty)
          .map((s) => ({
            name: s.specialty!.name,
            slug: s.specialty!.slug,
            description: s.specialty!.description || null,
          })) || [],

      services:
        listingServices
          ?.filter((s) => s.service_offering)
          .map((s) => ({
            name: s.service_offering!.name,
            slug: s.service_offering!.slug,
            description: s.description || null,
            priceText: s.price_text || null,
            durationMinutes: s.duration_minutes || null,
          })) || [],

      serviceAreas:
        serviceAreas?.map((sa) => ({
          suburb: sa.location?.suburb || null,
          state: sa.state || sa.location?.state || null,
          postcode: sa.postcode || sa.location?.postcode || null,
          isNationwide: sa.is_nationwide || false,
        })) || [],

      recentReviews:
        reviews?.map((r) => {
          const consumer = r.consumer as { display_name?: string } | null;
          return {
            id: r.id,
            rating: r.rating,
            title: r.title,
            body: r.body,
            createdAt: r.created_at,
            consumerDisplayName: consumer?.display_name || "Anonymous",
          };
        }) || [],
    };

    return NextResponse.json<ApiResponse<ListingDetail>>({
      success: true,
      data: detail,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Listing detail API error:", error);
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
