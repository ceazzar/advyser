"use server";

import { revalidatePath } from "next/cache";

import {
  isValidTransition,
  type LeadStatus,
} from "@/lib/constants/lead-states";
import { createClient } from "@/lib/supabase/server";

/**
 * Lead creation input
 */
export interface CreateLeadInput {
  listingId: string;
  problemSummary?: string;
  goalTags?: string[];
  timeline?: string;
  budgetRange?: string;
  preferredMeetingMode?: "online" | "in_person" | "both";
  preferredTimes?: string;
  idempotencyKey?: string;
}

/**
 * Lead creation result
 */
export interface CreateLeadResult {
  success: boolean;
  leadId?: string;
  error?: string;
}

/**
 * Create a new lead (consumer requests intro to advisor)
 */
export async function createLead(input: CreateLeadInput): Promise<CreateLeadResult> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "You must be logged in to request an introduction" };
    }

    // Check idempotency
    if (input.idempotencyKey) {
      const { data: existing } = await supabase
        .from("lead")
        .select("id")
        .eq("idempotency_key", input.idempotencyKey)
        .maybeSingle();

      if (existing) {
        return { success: true, leadId: existing.id };
      }
    }

    // Get listing details to find business_id
    const { data: listing, error: listingError } = await supabase
      .from("listing")
      .select("id, business_id")
      .eq("id", input.listingId)
      .eq("is_active", true)
      .single();

    if (listingError || !listing) {
      return { success: false, error: "Advisor listing not found" };
    }

    // Check if user already has an active lead with this business
    const { data: existingLead } = await supabase
      .from("lead")
      .select("id, status")
      .eq("consumer_user_id", user.id)
      .eq("business_id", listing.business_id)
      .not("status", "eq", "declined")
      .not("status", "eq", "converted")
      .maybeSingle();

    if (existingLead) {
      return {
        success: false,
        error: "You already have an active request with this advisor",
      };
    }

    // Create the lead
    const { data: lead, error: createError } = await supabase
      .from("lead")
      .insert({
        consumer_user_id: user.id,
        business_id: listing.business_id,
        listing_id: input.listingId,
        problem_summary: input.problemSummary,
        goal_tags: input.goalTags,
        timeline: input.timeline,
        budget_range: input.budgetRange,
        preferred_meeting_mode: input.preferredMeetingMode,
        preferred_times: input.preferredTimes,
        idempotency_key: input.idempotencyKey,
        status: "new",
      })
      .select("id")
      .single();

    if (createError) {
      console.error("Lead creation error:", createError);
      return { success: false, error: "Failed to create request" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/requests");

    return { success: true, leadId: lead.id };
  } catch (error) {
    console.error("Create lead error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Accept a lead (advisor responds positively)
 * Creates a conversation for messaging
 */
export async function acceptLead(
  leadId: string
): Promise<{ success: boolean; conversationId?: string; error?: string }> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required" };
    }

    // Call the database function that handles the transaction
    const { data, error } = await supabase.rpc("accept_lead", {
      p_lead_id: leadId,
      p_user_id: user.id,
    });

    if (error) {
      console.error("Accept lead error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/advisor/leads");
    revalidatePath("/advisor/messages");

    return { success: true, conversationId: data };
  } catch (error) {
    console.error("Accept lead error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Decline a lead
 */
export async function declineLead(
  leadId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required" };
    }

    // Call the database function
    const { error } = await supabase.rpc("decline_lead", {
      p_lead_id: leadId,
      p_user_id: user.id,
      p_reason: reason || null,
    });

    if (error) {
      console.error("Decline lead error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/advisor/leads");

    return { success: true };
  } catch (error) {
    console.error("Decline lead error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Update lead status (generic transition)
 */
export async function updateLeadStatus(
  leadId: string,
  newStatus: LeadStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required" };
    }

    // Get current lead status
    const { data: lead, error: fetchError } = await supabase
      .from("lead")
      .select("id, status, version, business_id")
      .eq("id", leadId)
      .single();

    if (fetchError || !lead) {
      return { success: false, error: "Lead not found" };
    }

    // Verify user has access (is business member)
    const { data: role } = await supabase
      .from("advisor_business_role")
      .select("id")
      .eq("user_id", user.id)
      .eq("business_id", lead.business_id)
      .eq("status", "active")
      .maybeSingle();

    if (!role) {
      return { success: false, error: "Access denied" };
    }

    // Validate state transition
    if (!isValidTransition(lead.status as LeadStatus, newStatus)) {
      return {
        success: false,
        error: `Cannot transition from ${lead.status} to ${newStatus}`,
      };
    }

    // Update with optimistic locking
    const { error: updateError } = await supabase
      .from("lead")
      .update({
        status: newStatus,
        version: lead.version + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", leadId)
      .eq("version", lead.version);

    if (updateError) {
      if (updateError.code === "PGRST116") {
        return {
          success: false,
          error: "Lead was modified. Please refresh and try again.",
        };
      }
      return { success: false, error: "Failed to update lead" };
    }

    revalidatePath("/advisor/leads");
    revalidatePath(`/advisor/leads/${leadId}`);

    return { success: true };
  } catch (error) {
    console.error("Update lead status error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
