"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { logger } from "@/lib/logger"

export async function signUp(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string
  const accountType = formData.get("accountType") as "consumer" | "advisor"

  const [firstName, ...lastParts] = fullName.trim().split(" ")
  const lastName = lastParts.join(" ")

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        role: accountType,
        first_name: firstName,
        last_name: lastName,
        display_name: fullName.trim(),
      },
    },
  })

  if (error) return { success: false, error: error.message }

  // Insert into public.users with admin client (bypasses RLS)
  // If this fails, the DB trigger on auth.users will create the row as a safety net
  const admin = createAdminClient()
  const { error: dbError } = await admin.from("users").insert({
    id: data.user!.id,
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

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  })

  if (error) return { success: false, error: error.message }

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

  const { error } = await supabase.auth.resetPasswordForEmail(
    formData.get("email") as string,
    { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password` }
  )

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: formData.get("password") as string,
  })

  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  redirect("/login?reset=true")
}
