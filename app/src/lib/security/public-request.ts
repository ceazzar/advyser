import type { NextRequest } from "next/server";

export interface PublicRequestValidationError {
  code: string;
  message: string;
  statusCode: number;
}

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function validatePublicPostOrigin(
  request: NextRequest
): { success: true } | { success: false; error: PublicRequestValidationError } {
  const origin = request.headers.get("origin");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!origin) {
    return {
      success: false,
      error: {
        code: "FORBIDDEN_ORIGIN",
        message: "Origin header is required.",
        statusCode: 403,
      },
    };
  }

  if (!siteUrl) {
    if (isProduction()) {
      return {
        success: false,
        error: {
          code: "ORIGIN_CONFIGURATION_ERROR",
          message: "Server origin policy is not configured.",
          statusCode: 500,
        },
      };
    }

    return { success: true };
  }

  const allowedOrigin = new URL(siteUrl).origin;
  if (origin !== allowedOrigin) {
    return {
      success: false,
      error: {
        code: "FORBIDDEN_ORIGIN",
        message: "Request origin is not allowed.",
        statusCode: 403,
      },
    };
  }

  return { success: true };
}

export async function validateTurnstileCaptcha(
  captchaToken: string | undefined
): Promise<{ success: true } | { success: false; error: PublicRequestValidationError }> {
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;

  if (!turnstileSecret) {
    if (isProduction()) {
      return {
        success: false,
        error: {
          code: "CAPTCHA_CONFIGURATION_ERROR",
          message: "Captcha protection is required in production.",
          statusCode: 500,
        },
      };
    }

    return { success: true };
  }

  if (!captchaToken) {
    return {
      success: false,
      error: {
        code: "CAPTCHA_REQUIRED",
        message: "Captcha verification is required.",
        statusCode: 400,
      },
    };
  }

  const verificationBody = new URLSearchParams({
    secret: turnstileSecret,
    response: captchaToken,
  });

  const captchaResponse = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: verificationBody,
    }
  );

  const captchaResult = (await captchaResponse.json()) as { success?: boolean };

  if (!captchaResult.success) {
    return {
      success: false,
      error: {
        code: "CAPTCHA_FAILED",
        message: "Captcha validation failed. Please try again.",
        statusCode: 400,
      },
    };
  }

  return { success: true };
}

