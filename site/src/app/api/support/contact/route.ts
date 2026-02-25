import { NextRequest, NextResponse } from "next/server"

import { logger } from "@/lib/logger"
import type { SupportContactTopic } from "@/lib/support-contact"
import { supportContactSchema, supportTopicMeta } from "@/lib/support-contact"
import type { ApiResponse } from "@/types/api"

interface SupportContactRouteResponse {
  ticketId: string
  topic: SupportContactTopic
  responseWindow: string
}

export async function POST(request: NextRequest) {
  try {
    const payload = supportContactSchema.safeParse(await request.json())

    if (!payload.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Contact request payload is invalid.",
            details: payload.error.flatten().fieldErrors,
            statusCode: 400,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      )
    }

    const responseWindow = supportTopicMeta[payload.data.topic].responseWindow
    const ticketId = `SUP-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`

    logger.info("Support contact submitted", {
      ticketId,
      topic: payload.data.topic,
      emailDomain: payload.data.email.split("@")[1] || "unknown",
      hasName: Boolean(payload.data.name),
    })

    return NextResponse.json<ApiResponse<SupportContactRouteResponse>>(
      {
        success: true,
        data: {
          ticketId,
          topic: payload.data.topic,
          responseWindow,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    )
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to process your request right now.",
          statusCode: 500,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
