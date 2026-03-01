import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { resolve } from "path"

// Load .env.local manually (no dotenv dependency needed)
const envPath = resolve(__dirname, "../.env.local")
const envContent = readFileSync(envPath, "utf-8")
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) {
    const key = match[1].trim()
    const value = match[2].trim().replace(/^["']|["']$/g, "")
    process.env[key] = value
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
  process.exit(1)
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const DEMO_USERS = [
  {
    email: "consumer@user.com",
    password: "consumer123",
    role: "consumer" as const,
    first_name: "Demo",
    last_name: "Consumer",
    display_name: "Demo Consumer",
  },
  {
    email: "advisor@user.com",
    password: "advisor123",
    role: "advisor" as const,
    first_name: "Sarah",
    last_name: "Mitchell",
    display_name: "Sarah Mitchell",
  },
  {
    email: "admin@user.com",
    password: "admin123",
    role: "admin" as const,
    first_name: "Demo",
    last_name: "Admin",
    display_name: "Demo Admin",
  },
]

async function seedDemoUsers() {
  console.log("Seeding demo users into Supabase...\n")

  for (const user of DEMO_USERS) {
    // 1. Create or find user in Supabase Auth
    let userId: string

    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        display_name: user.display_name,
      },
    })

    if (authError) {
      if (authError.message.includes("already been registered")) {
        // Look up existing user
        const { data: listData } = await admin.auth.admin.listUsers()
        const existing = listData?.users.find((u) => u.email === user.email)
        if (!existing) {
          console.error(`✗  ${user.email} — exists in Auth but couldn't find ID`)
          continue
        }
        userId = existing.id
        console.log(`⏭  ${user.email} — already in Auth (${userId})`)
      } else {
        console.error(`✗  ${user.email} — Auth error: ${authError.message}`)
        continue
      }
    } else {
      userId = authData.user.id
      console.log(`✓  ${user.email} — created in Auth (${userId})`)
    }

    // 2. Insert into public.users via SQL (bypasses RLS and table grants)
    const { error: rpcError } = await admin.rpc("exec_sql", {
      query: `
        INSERT INTO public.users (id, email, role, first_name, last_name, display_name, email_verified_at)
        VALUES ('${userId}', '${user.email}', '${user.role}', '${user.first_name}', '${user.last_name}', '${user.display_name}', NOW())
        ON CONFLICT (id) DO UPDATE SET
          role = EXCLUDED.role,
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          display_name = EXCLUDED.display_name
      `,
    })

    if (rpcError) {
      // Fallback: try direct insert (might work with correct service role setup)
      const { error: dbError } = await admin.from("users").upsert({
        id: userId,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        display_name: user.display_name,
        email_verified_at: new Date().toISOString(),
      })

      if (dbError) {
        console.error(`   ⚠ ${user.email} — DB error: ${dbError.message}`)
        console.log(`   ℹ  Run this SQL manually in Supabase SQL Editor:`)
        console.log(`      INSERT INTO public.users (id, email, role, first_name, last_name, display_name, email_verified_at)`)
        console.log(`      VALUES ('${userId}', '${user.email}', '${user.role}', '${user.first_name}', '${user.last_name}', '${user.display_name}', NOW())`)
        console.log(`      ON CONFLICT (id) DO NOTHING;`)
      } else {
        console.log(`   ✓ ${user.email} — inserted into public.users`)
      }
    } else {
      console.log(`   ✓ ${user.email} — inserted into public.users via SQL`)
    }
  }

  console.log("\nDone!")
}

seedDemoUsers()
