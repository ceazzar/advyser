"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { canRoleAccessPath, getDefaultRouteForRole, sanitizeRedirectPath } from "@/lib/auth-routing"
import { isLikelyEmail, normalizeEmail } from "@/lib/email"
import { logger } from "@/lib/logger"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

const AUTH_SERVICE_UNAVAILABLE_MESSAGE =
  "Unable to reach authentication service right now. Please try again in a moment."
const AUTH_INVALID_EMAIL_MESSAGE = "Please enter a valid email address."

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const cause =
      error.cause && typeof error.cause === "object" && "message" in error.cause
        ? String((error.cause as { message: unknown }).message)
        : ""
    return [error.message, cause].filter(Boolean).join(" ")
  }
  return String(error || "Unknown error")
}

function isTransientNetworkError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase()
  return (
    message.includes("fetch failed") ||
    message.includes("enotfound") ||
    message.includes("econnreset") ||
    message.includes("etimedout") ||
    message.includes("eai_again") ||
    message.includes("network")
  )
}

function normalizeAuthErrorMessage(message?: string): string {
  if (!message) return "Authentication failed"
  const normalized = message.toLowerCase()
  if (normalized.includes("email address") && normalized.includes("invalid")) {
    return AUTH_INVALID_EMAIL_MESSAGE
  }
  if (normalized.includes("rate limit")) {
    return "Too many attempts right now. Please try again later or sign in with an existing account."
  }
  if (
    normalized.includes("fetch failed") ||
    normalized.includes("enotfound") ||
    normalized.includes("network")
  ) {
    return AUTH_SERVICE_UNAVAILABLE_MESSAGE
  }
  return message
}

async function runWithTransientRetry<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (!isTransientNetworkError(error)) throw error
    await new Promise((resolve) => setTimeout(resolve, 250))
    return operation()
  }
}

export async function signUp(formData: FormData) {
  const supabase = await createClient()
  const email = normalizeEmail((formData.get("email") as string) || "")
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string
  const accountType = formData.get("accountType") as "consumer" | "advisor"
  if (!isLikelyEmail(email)) return { success: false, error: AUTH_INVALID_EMAIL_MESSAGE }
  const requestedRedirect = formData.get("redirect") as string | null
  const safeRequestedRedirect = sanitizeRedirectPath(requestedRedirect)
  const fallbackRedirect = getDefaultRouteForRole(accountType)
  const postVerifyRedirect =
    safeRequestedRedirect && canRoleAccessPath(accountType, safeRequestedRedirect)
      ? safeRequestedRedirect
      : fallbackRedirect
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const emailRedirectTo = new URL(
    `/auth/callback?next=${encodeURIComponent(postVerifyRedirect)}`,
    siteUrl
  ).toString()

  const [firstName, ...lastParts] = fullName.trim().split(" ")
  const lastName = lastParts.join(" ")

  let data: { user: { id: string } | null } | null = null
  let error: { message: string } | null = null
  try {
    const signupResult = await runWithTransientRetry(() =>
      supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo,
          data: {
            role: accountType,
            first_name: firstName,
            last_name: lastName,
            display_name: fullName.trim(),
          },
        },
      })
    )
    data = signupResult.data as typeof data
    error = signupResult.error as typeof error
  } catch (signupException) {
    logger.error("Signup request failed before response", {
      error: getErrorMessage(signupException),
    })
    return { success: false, error: AUTH_SERVICE_UNAVAILABLE_MESSAGE }
  }

  if (error) return { success: false, error: normalizeAuthErrorMessage(error.message) }
  if (!data?.user?.id) return { success: false, error: "Unable to create account right now." }

  // Insert into public.users with admin client (bypasses RLS)
  // If this fails, the DB trigger on auth.users will create the row as a safety net
  const admin = createAdminClient()
  const { error: dbError } = await admin.from("users").insert({
    id: data.user.id,
    email,
    role: accountType,
    first_name: firstName,
    last_name: lastName,
    display_name: fullName.trim(),
  })

  if (dbError) {
    logger.error("Failed to create user profile", { error: dbError.message })
    // Don't fail signup — the DB trigger will create the row from auth metadata
  }

  return { success: true }
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()
  const email = normalizeEmail((formData.get("email") as string) || "")
  const password = (formData.get("password") as string) || ""
  if (!isLikelyEmail(email)) return { success: false, error: AUTH_INVALID_EMAIL_MESSAGE }
  let error: { message: string } | null = null

  try {
    const signInResult = await runWithTransientRetry(() =>
      supabase.auth.signInWithPassword({
        email,
        password,
      })
    )
    error = signInResult.error as typeof error
  } catch (signInException) {
    logger.error("Sign in request failed before response", {
      error: getErrorMessage(signInException),
    })
    return { success: false, error: AUTH_SERVICE_UNAVAILABLE_MESSAGE }
  }

  if (error) return { success: false, error: normalizeAuthErrorMessage(error.message) }

  revalidatePath("/", "layout")
  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const email = normalizeEmail((formData.get("email") as string) || "")
  if (!isLikelyEmail(email)) return { success: false, error: AUTH_INVALID_EMAIL_MESSAGE }
  let error: { message: string } | null = null

  try {
    const resetResult = await runWithTransientRetry(() =>
      supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password` }
      )
    )
    error = resetResult.error as typeof error
  } catch (resetException) {
    logger.error("Password reset request failed before response", {
      error: getErrorMessage(resetException),
    })
    return { success: false, error: AUTH_SERVICE_UNAVAILABLE_MESSAGE }
  }

  if (error) return { success: false, error: normalizeAuthErrorMessage(error.message) }
  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  let error: { message: string } | null = null

  try {
    const updateResult = await runWithTransientRetry(() =>
      supabase.auth.updateUser({
        password: formData.get("password") as string,
      })
    )
    error = updateResult.error as typeof error
  } catch (updateException) {
    logger.error("Password update request failed before response", {
      error: getErrorMessage(updateException),
    })
    return { success: false, error: AUTH_SERVICE_UNAVAILABLE_MESSAGE }
  }

  if (error) return { success: false, error: normalizeAuthErrorMessage(error.message) }

  revalidatePath("/", "layout")
  redirect("/login?reset=true")
}
