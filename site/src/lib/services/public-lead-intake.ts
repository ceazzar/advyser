import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;
type SupabaseAdminClient = ReturnType<typeof createAdminClient>;
type IntakeActor = SupabaseServerClient | SupabaseAdminClient;

export interface PublicLeadIdentityInput {
  userId?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
}

export interface PublicLeadIdentityContext {
  actor: IntakeActor;
  consumerUserId: string;
  rateLimitIdentifier: string;
}

export interface PublicLeadCreateInput {
  actor: IntakeActor;
  consumerUserId: string;
  listingId: string;
  problemSummary: string;
  goalTags?: string[];
  timeline?: string;
  budgetRange?: string;
  preferredMeetingMode?: "online" | "in_person" | "both";
  preferredTimes?: string;
  idempotencyKey?: string;
  consentData?: Record<string, unknown>;
}

export type PublicLeadCreateResult =
  | { kind: "created"; leadId: string }
  | { kind: "idempotent"; leadId: string }
  | { kind: "duplicate"; message: string }
  | { kind: "not_found"; message: string }
  | { kind: "error"; code: string; message: string };

export async function resolvePublicLeadIdentity(
  input: PublicLeadIdentityInput
): Promise<PublicLeadIdentityContext | { error: { code: string; message: string } }> {
  if (input.userId) {
    return {
      actor: await createClient(),
      consumerUserId: input.userId,
      rateLimitIdentifier: input.userId,
    };
  }

  const normalizedEmail = input.email.trim().toLowerCase();
  const admin = createAdminClient();

  const { data: existingConsumer, error: lookupError } = await admin
    .from("users")
    .select("id")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (lookupError) {
    return {
      error: {
        code: "DATABASE_ERROR",
        message: "Unable to verify consumer profile.",
      },
    };
  }

  let consumerUserId = existingConsumer?.id;
  const displayName = [input.firstName, input.lastName]
    .filter((value) => typeof value === "string" && value.trim().length > 0)
    .join(" ")
    .trim();

  if (!consumerUserId) {
    const generatedPassword = `${crypto.randomUUID()}A1a!`;
    const { data: createdAuth, error: createAuthError } = await admin.auth.admin.createUser({
      email: normalizedEmail,
      password: generatedPassword,
      email_confirm: true,
      user_metadata: {
        first_name: input.firstName || null,
        last_name: input.lastName || null,
        display_name: displayName || null,
      },
    });

    if (createAuthError || !createdAuth.user?.id) {
      return {
        error: {
          code: "IDENTITY_PROVISIONING_FAILED",
          message: "Unable to provision a secure consumer identity for this request.",
        },
      };
    }

    consumerUserId = createdAuth.user.id;
  }

  const { error: createConsumerError } = await admin.from("users").upsert({
    id: consumerUserId,
    email: normalizedEmail,
    role: "consumer",
    first_name: input.firstName?.trim() || null,
    last_name: input.lastName?.trim() || null,
    display_name: displayName || null,
    phone: input.phone?.trim() || null,
  });

  if (createConsumerError) {
    return {
      error: {
        code: "DATABASE_ERROR",
        message: "Unable to create consumer profile for request.",
      },
    };
  }

  return {
    actor: admin,
    consumerUserId,
    rateLimitIdentifier: `guest:${normalizedEmail}`,
  };
}

export async function createPublicLead(
  input: PublicLeadCreateInput
): Promise<PublicLeadCreateResult> {
  try {
    if (input.idempotencyKey) {
      const { data: existing } = await input.actor
        .from("lead")
        .select("id")
        .eq("idempotency_key", input.idempotencyKey)
        .maybeSingle();

      if (existing?.id) {
        return { kind: "idempotent", leadId: existing.id };
      }
    }

    const { data: listing, error: listingError } = await input.actor
      .from("listing")
      .select("id, business_id")
      .eq("id", input.listingId)
      .eq("is_active", true)
      .single();

    if (listingError || !listing) {
      return { kind: "not_found", message: "Advisor listing not found" };
    }

    const { data: existingLead } = await input.actor
      .from("lead")
      .select("id")
      .eq("consumer_user_id", input.consumerUserId)
      .eq("business_id", listing.business_id)
      .not("status", "eq", "declined")
      .not("status", "eq", "converted")
      .maybeSingle();

    if (existingLead?.id) {
      return {
        kind: "duplicate",
        message: "You already have an active request with this advisor",
      };
    }

    const { data: lead, error: createError } = await input.actor
      .from("lead")
      .insert({
        consumer_user_id: input.consumerUserId,
        business_id: listing.business_id,
        listing_id: input.listingId,
        problem_summary: input.problemSummary.trim(),
        goal_tags: input.goalTags,
        timeline: input.timeline,
        budget_range: input.budgetRange,
        preferred_meeting_mode: input.preferredMeetingMode,
        preferred_times: input.preferredTimes,
        idempotency_key: input.idempotencyKey,
        consent_data: input.consentData || {},
        status: "new",
      })
      .select("id")
      .single();

    if (createError || !lead?.id) {
      return {
        kind: "error",
        code: "DATABASE_ERROR",
        message: "Failed to create request",
      };
    }

    return { kind: "created", leadId: lead.id };
  } catch {
    return {
      kind: "error",
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    };
  }
}

