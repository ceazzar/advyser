"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

/**
 * Booking mode enum
 */
export type BookingMode = "online" | "in_person";

/**
 * Booking status enum
 */
export type BookingStatus = "proposed" | "confirmed" | "cancelled" | "completed";

/**
 * Create booking input
 */
export interface CreateBookingInput {
  leadId: string;
  startsAt: string; // ISO datetime
  endsAt: string; // ISO datetime
  timezone?: string;
  mode: BookingMode;
  locationText?: string;
  meetingLink?: string;
  advisorNotes?: string;
}

/**
 * Create booking result
 */
export interface CreateBookingResult {
  success: boolean;
  bookingId?: string;
  error?: string;
}

/**
 * Generic action result
 */
export interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Create a new booking (advisor proposes a meeting time)
 */
export async function createBooking(
  input: CreateBookingInput
): Promise<CreateBookingResult> {
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

    // Get lead details to find business_id and verify access
    const { data: lead, error: leadError } = await supabase
      .from("lead")
      .select("id, business_id, consumer_user_id")
      .eq("id", input.leadId)
      .single();

    if (leadError || !lead) {
      return { success: false, error: "Lead not found" };
    }

    // Verify user is active business member
    const { data: role } = await supabase
      .from("advisor_business_role")
      .select("id")
      .eq("user_id", user.id)
      .eq("business_id", lead.business_id)
      .eq("status", "active")
      .maybeSingle();

    if (!role) {
      return { success: false, error: "Access denied. You must be an active advisor for this business." };
    }

    // Validate datetime inputs
    const startsAt = new Date(input.startsAt);
    const endsAt = new Date(input.endsAt);

    if (isNaN(startsAt.getTime()) || isNaN(endsAt.getTime())) {
      return { success: false, error: "Invalid date format" };
    }

    if (endsAt <= startsAt) {
      return { success: false, error: "End time must be after start time" };
    }

    if (startsAt < new Date()) {
      return { success: false, error: "Cannot schedule booking in the past" };
    }

    // Create the booking
    const { data: booking, error: createError } = await supabase
      .from("booking")
      .insert({
        business_id: lead.business_id,
        advisor_user_id: user.id,
        lead_id: input.leadId,
        starts_at: input.startsAt,
        ends_at: input.endsAt,
        timezone: input.timezone || "Australia/Sydney",
        mode: input.mode,
        location_text: input.locationText,
        meeting_link: input.meetingLink,
        advisor_notes: input.advisorNotes,
        status: "proposed",
        version: 1,
      })
      .select("id")
      .single();

    if (createError) {
      console.error("Booking creation error:", createError);
      return { success: false, error: "Failed to create booking" };
    }

    revalidatePath("/advisor/bookings");
    revalidatePath("/dashboard/bookings");
    revalidatePath(`/advisor/leads/${input.leadId}`);

    return { success: true, bookingId: booking.id };
  } catch (error) {
    console.error("Create booking error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Confirm a proposed booking (consumer action)
 */
export async function confirmBooking(bookingId: string): Promise<ActionResult> {
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

    // Get booking with lead info to verify ownership
    const { data: booking, error: fetchError } = await supabase
      .from("booking")
      .select(`
        id,
        status,
        version,
        lead:lead_id (
          id,
          consumer_user_id
        )
      `)
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) {
      return { success: false, error: "Booking not found" };
    }

    // Type assertion for lead data (Supabase returns object for single relation)
    const lead = booking.lead as unknown as { id: string; consumer_user_id: string } | null;

    if (!lead) {
      return { success: false, error: "Associated lead not found" };
    }

    // Verify user owns the lead (is the consumer)
    if (lead.consumer_user_id !== user.id) {
      return { success: false, error: "Access denied. Only the consumer can confirm this booking." };
    }

    // Verify booking is in proposed status
    if (booking.status !== "proposed") {
      return { success: false, error: `Cannot confirm a booking with status: ${booking.status}` };
    }

    // Update with optimistic locking
    const { error: updateError, count } = await supabase
      .from("booking")
      .update({
        status: "confirmed",
        version: booking.version + 1,
      })
      .eq("id", bookingId)
      .eq("version", booking.version);

    if (updateError) {
      console.error("Confirm booking error:", updateError);
      return { success: false, error: "Failed to confirm booking" };
    }

    if (count === 0) {
      return {
        success: false,
        error: "Booking was modified. Please refresh and try again.",
      };
    }

    revalidatePath("/advisor/bookings");
    revalidatePath("/dashboard/bookings");
    revalidatePath(`/dashboard/bookings/${bookingId}`);

    return { success: true };
  } catch (error) {
    console.error("Confirm booking error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Cancel a booking (either party can cancel)
 */
export async function cancelBooking(
  bookingId: string,
  reason?: string
): Promise<ActionResult> {
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

    // Get booking with lead and business info
    const { data: booking, error: fetchError } = await supabase
      .from("booking")
      .select(`
        id,
        status,
        version,
        business_id,
        lead:lead_id (
          id,
          consumer_user_id
        )
      `)
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) {
      return { success: false, error: "Booking not found" };
    }

    // Type assertion for lead data (Supabase returns object for single relation)
    const lead = booking.lead as unknown as { id: string; consumer_user_id: string } | null;

    // Check if user is the consumer (via lead)
    const isConsumer = lead?.consumer_user_id === user.id;

    // Check if user is an active business member
    let isBusinessMember = false;
    if (!isConsumer) {
      const { data: role } = await supabase
        .from("advisor_business_role")
        .select("id")
        .eq("user_id", user.id)
        .eq("business_id", booking.business_id)
        .eq("status", "active")
        .maybeSingle();

      isBusinessMember = !!role;
    }

    if (!isConsumer && !isBusinessMember) {
      return { success: false, error: "Access denied. You are not a participant in this booking." };
    }

    // Verify booking can be cancelled
    if (booking.status === "cancelled") {
      return { success: false, error: "Booking is already cancelled" };
    }

    if (booking.status === "completed") {
      return { success: false, error: "Cannot cancel a completed booking" };
    }

    // Update with optimistic locking
    const updateData: Record<string, unknown> = {
      status: "cancelled",
      version: booking.version + 1,
    };

    // Store cancellation reason in advisor_notes if provided
    if (reason) {
      updateData.advisor_notes = reason;
    }

    const { error: updateError, count } = await supabase
      .from("booking")
      .update(updateData)
      .eq("id", bookingId)
      .eq("version", booking.version);

    if (updateError) {
      console.error("Cancel booking error:", updateError);
      return { success: false, error: "Failed to cancel booking" };
    }

    if (count === 0) {
      return {
        success: false,
        error: "Booking was modified. Please refresh and try again.",
      };
    }

    revalidatePath("/advisor/bookings");
    revalidatePath("/dashboard/bookings");
    revalidatePath(`/dashboard/bookings/${bookingId}`);

    return { success: true };
  } catch (error) {
    console.error("Cancel booking error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Mark a booking as completed (advisor action)
 */
export async function completeBooking(bookingId: string): Promise<ActionResult> {
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

    // Get booking details
    const { data: booking, error: fetchError } = await supabase
      .from("booking")
      .select("id, status, version, business_id")
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) {
      return { success: false, error: "Booking not found" };
    }

    // Verify user is active business member
    const { data: role } = await supabase
      .from("advisor_business_role")
      .select("id")
      .eq("user_id", user.id)
      .eq("business_id", booking.business_id)
      .eq("status", "active")
      .maybeSingle();

    if (!role) {
      return { success: false, error: "Access denied. You must be an active advisor for this business." };
    }

    // Verify booking is in confirmed status
    if (booking.status !== "confirmed") {
      return { success: false, error: `Cannot complete a booking with status: ${booking.status}` };
    }

    // Update with optimistic locking
    const { error: updateError, count } = await supabase
      .from("booking")
      .update({
        status: "completed",
        version: booking.version + 1,
      })
      .eq("id", bookingId)
      .eq("version", booking.version);

    if (updateError) {
      console.error("Complete booking error:", updateError);
      return { success: false, error: "Failed to complete booking" };
    }

    if (count === 0) {
      return {
        success: false,
        error: "Booking was modified. Please refresh and try again.",
      };
    }

    revalidatePath("/advisor/bookings");
    revalidatePath("/dashboard/bookings");
    revalidatePath(`/advisor/bookings/${bookingId}`);

    return { success: true };
  } catch (error) {
    console.error("Complete booking error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Reschedule a booking (either party can reschedule)
 */
export async function rescheduleBooking(
  bookingId: string,
  newStartsAt: string,
  newEndsAt: string
): Promise<ActionResult> {
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

    // Get booking with lead and business info
    const { data: booking, error: fetchError } = await supabase
      .from("booking")
      .select(`
        id,
        status,
        version,
        business_id,
        lead:lead_id (
          id,
          consumer_user_id
        )
      `)
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) {
      return { success: false, error: "Booking not found" };
    }

    // Type assertion for lead data (Supabase returns object for single relation)
    const lead = booking.lead as unknown as { id: string; consumer_user_id: string } | null;

    // Check if user is the consumer (via lead)
    const isConsumer = lead?.consumer_user_id === user.id;

    // Check if user is an active business member
    let isBusinessMember = false;
    if (!isConsumer) {
      const { data: role } = await supabase
        .from("advisor_business_role")
        .select("id")
        .eq("user_id", user.id)
        .eq("business_id", booking.business_id)
        .eq("status", "active")
        .maybeSingle();

      isBusinessMember = !!role;
    }

    if (!isConsumer && !isBusinessMember) {
      return { success: false, error: "Access denied. You are not a participant in this booking." };
    }

    // Verify booking can be rescheduled
    if (booking.status === "cancelled") {
      return { success: false, error: "Cannot reschedule a cancelled booking" };
    }

    if (booking.status === "completed") {
      return { success: false, error: "Cannot reschedule a completed booking" };
    }

    // Validate datetime inputs
    const startsAt = new Date(newStartsAt);
    const endsAt = new Date(newEndsAt);

    if (isNaN(startsAt.getTime()) || isNaN(endsAt.getTime())) {
      return { success: false, error: "Invalid date format" };
    }

    if (endsAt <= startsAt) {
      return { success: false, error: "End time must be after start time" };
    }

    if (startsAt < new Date()) {
      return { success: false, error: "Cannot schedule booking in the past" };
    }

    // Update with optimistic locking - reset status to proposed
    const { error: updateError, count } = await supabase
      .from("booking")
      .update({
        starts_at: newStartsAt,
        ends_at: newEndsAt,
        status: "proposed",
        version: booking.version + 1,
      })
      .eq("id", bookingId)
      .eq("version", booking.version);

    if (updateError) {
      console.error("Reschedule booking error:", updateError);
      return { success: false, error: "Failed to reschedule booking" };
    }

    if (count === 0) {
      return {
        success: false,
        error: "Booking was modified. Please refresh and try again.",
      };
    }

    revalidatePath("/advisor/bookings");
    revalidatePath("/dashboard/bookings");
    revalidatePath(`/dashboard/bookings/${bookingId}`);

    return { success: true };
  } catch (error) {
    console.error("Reschedule booking error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
