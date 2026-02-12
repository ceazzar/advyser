import { NextRequest, NextResponse } from "next/server";

import { checkRateLimit, leadRatelimit, rateLimitHeaders } from "@/lib/ratelimit";
import { matchRequestBatchSchema } from "@/lib/schemas";
import { validatePublicPostOrigin, validateTurnstileCaptcha } from "@/lib/security/public-request";
import { createPublicLead, resolvePublicLeadIdentity } from "@/lib/services/public-lead-intake";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api";

interface MatchRequestBatchResponse {
  matchBatchId: string;
  createdLeadIds: string[];
  skipped: Array<{
    listingId: string;
    code: string;
    message: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const originValidation = validatePublicPostOrigin(request);
    if (!originValidation.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: originValidation.error,
          timestamp: new Date().toISOString(),
        },
        { status: originValidation.error.statusCode }
      );
    }

    const payload = matchRequestBatchSchema.safeParse(await request.json());
    if (!payload.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Match request payload is invalid.",
            details: payload.error.flatten().fieldErrors,
            statusCode: 400,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const captchaValidation = await validateTurnstileCaptcha(payload.data.captchaToken);
    if (!captchaValidation.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: captchaValidation.error,
          timestamp: new Date().toISOString(),
        },
        { status: captchaValidation.error.statusCode }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const identity = await resolvePublicLeadIdentity({
      userId: user?.id,
      firstName: payload.data.firstName,
      lastName: payload.data.lastName,
      email: payload.data.email,
      phone: payload.data.phone || undefined,
    });

    if ("error" in identity) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: identity.error.code,
            message: identity.error.message,
            statusCode: 500,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    const rateLimitResult = await checkRateLimit(leadRatelimit, identity.rateLimitIdentifier);
    if (!rateLimitResult.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "You have sent too many requests. Please try again later.",
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

    const matchBatchId = crypto.randomUUID();
    const createdLeadIds: string[] = [];
    const skipped: MatchRequestBatchResponse["skipped"] = [];

    for (const listingId of payload.data.listingIds) {
      const listingKey = payload.data.idempotencyKey
        ? `${payload.data.idempotencyKey}:${listingId}`
        : undefined;

      const leadResult = await createPublicLead({
        actor: identity.actor,
        consumerUserId: identity.consumerUserId,
        listingId,
        problemSummary: payload.data.problemSummary,
        goalTags: payload.data.goalTags,
        timeline: payload.data.timeline,
        budgetRange: payload.data.budgetRange,
        preferredMeetingMode: payload.data.preferredMeetingMode,
        preferredTimes: payload.data.preferredTimes,
        idempotencyKey: listingKey,
        consentData: {
          source: "guided_match_v1",
          matchBatchId,
          listingIds: payload.data.listingIds,
          privacyConsent: payload.data.privacyConsent,
          marketingConsent: payload.data.marketingConsent || false,
        },
      });

      if (leadResult.kind === "created" || leadResult.kind === "idempotent") {
        createdLeadIds.push(leadResult.leadId);
        continue;
      }

      if (leadResult.kind === "duplicate" || leadResult.kind === "not_found") {
        skipped.push({
          listingId,
          code: leadResult.kind.toUpperCase(),
          message: leadResult.message,
        });
        continue;
      }

      skipped.push({
        listingId,
        code: leadResult.code,
        message: leadResult.message,
      });
    }

    const response: MatchRequestBatchResponse = {
      matchBatchId,
      createdLeadIds,
      skipped,
    };

    return NextResponse.json<ApiResponse<MatchRequestBatchResponse>>(
      {
        success: true,
        data: response,
        timestamp: new Date().toISOString(),
      },
      {
        status: createdLeadIds.length > 0 ? 201 : 200,
        headers: rateLimitHeaders(rateLimitResult.remaining, rateLimitResult.reset),
      }
    );
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
