import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api";

/**
 * Consumer profile response
 */
export interface ConsumerProfile {
  id: string;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  phone: string | null;
}

/**
 * Advisor profile extension
 */
export interface AdvisorProfileData {
  id: string;
  positionTitle: string | null;
  bio: string | null;
  linkedinUrl: string | null;
  yearsExperience: number | null;
  languages: string[];
  businessId: string | null;
}

/**
 * Advisor profile response (extends consumer profile)
 */
export interface AdvisorProfile extends ConsumerProfile {
  advisorProfile: AdvisorProfileData | null;
}

/**
 * Profile response type (union of consumer and advisor)
 */
export type ProfileResponse = ConsumerProfile | AdvisorProfile;

/**
 * GET /api/profile
 *
 * Get the current authenticated user's profile.
 * Returns extended profile data for advisors.
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Get current user from auth
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required",
            statusCode: 401,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    // Get user profile from users table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select(
        `
        id,
        email,
        role,
        first_name,
        last_name,
        display_name,
        avatar_url,
        phone
      `
      )
      .eq("id", authUser.id)
      .single();

    if (userError || !user) {
      console.error("User profile query error:", userError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "User profile not found",
            statusCode: 404,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Base profile for all users
    const baseProfile: ConsumerProfile = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name,
      displayName: user.display_name,
      avatarUrl: user.avatar_url,
      phone: user.phone,
    };

    // If user is an advisor, fetch advisor_profile
    if (user.role === "advisor") {
      const { data: advisorProfile } = await supabase
        .from("advisor_profile")
        .select(
          `
          id,
          position_title,
          bio,
          linkedin_url,
          years_experience,
          languages,
          business_id
        `
        )
        .eq("user_id", authUser.id)
        .maybeSingle();

      const response: AdvisorProfile = {
        ...baseProfile,
        advisorProfile: advisorProfile
          ? {
              id: advisorProfile.id,
              positionTitle: advisorProfile.position_title,
              bio: advisorProfile.bio,
              linkedinUrl: advisorProfile.linkedin_url,
              yearsExperience: advisorProfile.years_experience,
              languages: advisorProfile.languages || [],
              businessId: advisorProfile.business_id,
            }
          : null,
      };

      return NextResponse.json<ApiResponse<AdvisorProfile>>({
        success: true,
        data: response,
        timestamp: new Date().toISOString(),
      });
    }

    // Return consumer profile
    return NextResponse.json<ApiResponse<ConsumerProfile>>({
      success: true,
      data: baseProfile,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Profile GET API error:", error);
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

/**
 * Consumer profile update request body
 */
interface ConsumerProfileUpdate {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phone?: string;
}

/**
 * Advisor profile update request body (extends consumer)
 */
interface AdvisorProfileUpdate extends ConsumerProfileUpdate {
  bio?: string;
  positionTitle?: string;
  linkedinUrl?: string;
  yearsExperience?: number;
  languages?: string[];
}

/**
 * PATCH /api/profile
 *
 * Update the current authenticated user's profile.
 * Advisors can update additional fields in advisor_profile.
 *
 * Request body for consumer:
 * - firstName?: string
 * - lastName?: string
 * - displayName?: string
 * - phone?: string
 *
 * Request body for advisor (additional fields):
 * - bio?: string
 * - positionTitle?: string
 * - linkedinUrl?: string
 * - yearsExperience?: number
 * - languages?: string[]
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user from auth
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required",
            statusCode: 401,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    // Get current user to check role
    const { data: currentUser, error: userError } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", authUser.id)
      .single();

    if (userError || !currentUser) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "User profile not found",
            statusCode: 404,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Parse request body
    const body: AdvisorProfileUpdate = await request.json();

    // Extract user fields (common to all roles)
    const userFields: Record<string, string | undefined> = {};
    if (body.firstName !== undefined) userFields.first_name = body.firstName;
    if (body.lastName !== undefined) userFields.last_name = body.lastName;
    if (body.displayName !== undefined) userFields.display_name = body.displayName;
    if (body.phone !== undefined) userFields.phone = body.phone;

    // Update users table if there are user fields to update
    if (Object.keys(userFields).length > 0) {
      const { error: updateError } = await supabase
        .from("users")
        .update(userFields)
        .eq("id", authUser.id);

      if (updateError) {
        console.error("User update error:", updateError);
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: {
              code: "DATABASE_ERROR",
              message: "Failed to update profile",
              statusCode: 500,
            },
            timestamp: new Date().toISOString(),
          },
          { status: 500 }
        );
      }
    }

    // If user is an advisor, also update advisor_profile
    if (currentUser.role === "advisor") {
      // Extract advisor profile fields
      const advisorFields: Record<string, string | number | string[] | undefined> = {};
      if (body.bio !== undefined) advisorFields.bio = body.bio;
      if (body.positionTitle !== undefined) advisorFields.position_title = body.positionTitle;
      if (body.linkedinUrl !== undefined) advisorFields.linkedin_url = body.linkedinUrl;
      if (body.yearsExperience !== undefined) advisorFields.years_experience = body.yearsExperience;
      if (body.languages !== undefined) advisorFields.languages = body.languages;

      // Update advisor_profile if there are advisor fields to update
      if (Object.keys(advisorFields).length > 0) {
        // Check if advisor_profile exists
        const { data: existingProfile } = await supabase
          .from("advisor_profile")
          .select("id")
          .eq("user_id", authUser.id)
          .maybeSingle();

        if (existingProfile) {
          // Update existing profile
          const { error: advisorUpdateError } = await supabase
            .from("advisor_profile")
            .update(advisorFields)
            .eq("user_id", authUser.id);

          if (advisorUpdateError) {
            console.error("Advisor profile update error:", advisorUpdateError);
            return NextResponse.json<ApiResponse<null>>(
              {
                success: false,
                error: {
                  code: "DATABASE_ERROR",
                  message: "Failed to update advisor profile",
                  statusCode: 500,
                },
                timestamp: new Date().toISOString(),
              },
              { status: 500 }
            );
          }
        } else {
          // Create new advisor_profile
          const { error: advisorInsertError } = await supabase
            .from("advisor_profile")
            .insert({
              user_id: authUser.id,
              ...advisorFields,
            });

          if (advisorInsertError) {
            console.error("Advisor profile insert error:", advisorInsertError);
            return NextResponse.json<ApiResponse<null>>(
              {
                success: false,
                error: {
                  code: "DATABASE_ERROR",
                  message: "Failed to create advisor profile",
                  statusCode: 500,
                },
                timestamp: new Date().toISOString(),
              },
              { status: 500 }
            );
          }
        }
      }
    }

    // Fetch and return updated profile
    const { data: updatedUser, error: fetchError } = await supabase
      .from("users")
      .select(
        `
        id,
        email,
        role,
        first_name,
        last_name,
        display_name,
        avatar_url,
        phone
      `
      )
      .eq("id", authUser.id)
      .single();

    if (fetchError || !updatedUser) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "DATABASE_ERROR",
            message: "Failed to fetch updated profile",
            statusCode: 500,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    // Base profile response
    const baseProfile: ConsumerProfile = {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      displayName: updatedUser.display_name,
      avatarUrl: updatedUser.avatar_url,
      phone: updatedUser.phone,
    };

    // If advisor, include advisor profile
    if (currentUser.role === "advisor") {
      const { data: advisorProfile } = await supabase
        .from("advisor_profile")
        .select(
          `
          id,
          position_title,
          bio,
          linkedin_url,
          years_experience,
          languages,
          business_id
        `
        )
        .eq("user_id", authUser.id)
        .maybeSingle();

      const response: AdvisorProfile = {
        ...baseProfile,
        advisorProfile: advisorProfile
          ? {
              id: advisorProfile.id,
              positionTitle: advisorProfile.position_title,
              bio: advisorProfile.bio,
              linkedinUrl: advisorProfile.linkedin_url,
              yearsExperience: advisorProfile.years_experience,
              languages: advisorProfile.languages || [],
              businessId: advisorProfile.business_id,
            }
          : null,
      };

      return NextResponse.json<ApiResponse<AdvisorProfile>>({
        success: true,
        data: response,
        timestamp: new Date().toISOString(),
      });
    }

    // Return consumer profile
    return NextResponse.json<ApiResponse<ConsumerProfile>>({
      success: true,
      data: baseProfile,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Profile PATCH API error:", error);
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
