# Demo Authentication System

## Overview

The Advyser demo authentication system provides a lightweight, client-side authentication mechanism for testing user workflows before implementing production authentication. It allows developers and stakeholders to experience the full application flow across different user roles without requiring backend infrastructure.

This system is intentionally simple and should be replaced with a production-ready solution (Supabase Auth, NextAuth, etc.) before launch.

---

## Demo Credentials

```
┌─────────────────────┬──────────────┬──────────────┬─────────────────────────┐
│        Email        │   Password   │     Role     │   Default Redirect      │
├─────────────────────┼──────────────┼──────────────┼─────────────────────────┤
│ consumer@user.com   │ consumer123  │ consumer     │ /dashboard              │
├─────────────────────┼──────────────┼──────────────┼─────────────────────────┤
│ advisor@user.com    │ advisor123   │ advisor      │ /advisor                │
├─────────────────────┼──────────────┼──────────────┼─────────────────────────┤
│ admin@user.com      │ admin123     │ admin        │ /admin                  │
└─────────────────────┴──────────────┴──────────────┴─────────────────────────┘
```

**Note:** The advisor account includes a pre-populated profile (Sarah Mitchell, CFP) with firm details and specializations for testing advisor-specific features.

### Quick Login Buttons

The `/login` page includes one-click demo login buttons for instant access:

```
┌─────────────┬─────────────┬─────────────┐
│     👤      │     💼      │     🛡️      │
│  Consumer   │   Advisor   │    Admin    │
└─────────────┴─────────────┴─────────────┘
```

Click any button to instantly log in as that user type—no credentials needed.

---

## How It Works

### Core Components

**Auth Context** (`src/lib/auth-context.tsx`)
- Provides `AuthProvider` component that wraps the application
- Exposes `useAuth()` hook for accessing auth state and methods
- Manages user state with React Context

**Session Storage**
- Sessions are persisted in `localStorage` under the key `advyser_demo_auth`
- User data (excluding password) is stored as JSON
- Session restores automatically on page refresh

**Protected Route Hook**
```typescript
// Require authentication (any role)
const { user, isLoading } = useRequireAuth()

// Require specific roles
const { user, isLoading, isAuthorized } = useRequireAuth(["advisor", "admin"])
```

The `useRequireAuth` hook includes race condition protection via a ref that prevents duplicate redirects during rapid state changes.

**Redirect Security**
The `getPostLoginRedirect()` function validates redirect URLs to prevent open redirect attacks:
- Only allows relative paths starting with `/`
- Rejects protocol-relative URLs (`//`)
- Rejects path traversal attempts (`..`)
- Validates redirects against role-based allowed prefixes

**Login Flow**
1. User clicks a quick login button OR submits email/password on `/login`
2. Credentials are validated against `DEMO_USERS` constant
3. On success, user data is stored in context and localStorage
4. User is redirected to role-appropriate dashboard (or requested redirect URL)

**Logout Flow**
1. Call `logout()` from `useAuth()` hook
2. User state is cleared from context and localStorage
3. User is redirected to `/login`

---

## Protected Routes

```
┌─────────────────────┬─────────────────────────────────────────────────────────┐
│     Route Pattern   │                    Allowed Roles                        │
├─────────────────────┼─────────────────────────────────────────────────────────┤
│ /dashboard/*        │ consumer, admin                                         │
├─────────────────────┼─────────────────────────────────────────────────────────┤
│ /advisor/*          │ advisor, admin                                          │
├─────────────────────┼─────────────────────────────────────────────────────────┤
│ /admin/*            │ admin only                                              │
└─────────────────────┴─────────────────────────────────────────────────────────┘
```

**Behavior when unauthorized:**
- Unauthenticated users are redirected to `/login?redirect={original_path}`
- Users accessing routes outside their role are redirected to their default dashboard

---

## Limitations

This demo authentication system does **NOT** provide:

```
┌────────────────────────────┬────────────────────────────────────────────────────┐
│       Limitation           │                    Implication                     │
├────────────────────────────┼────────────────────────────────────────────────────┤
│ Real password hashing      │ Passwords stored as plaintext in code             │
├────────────────────────────┼────────────────────────────────────────────────────┤
│ Server-side validation     │ Auth can be bypassed by manipulating localStorage │
├────────────────────────────┼────────────────────────────────────────────────────┤
│ Session expiration         │ Sessions persist indefinitely until logout        │
├────────────────────────────┼────────────────────────────────────────────────────┤
│ OAuth/social login         │ Google/Apple buttons are UI placeholders only     │
├────────────────────────────┼────────────────────────────────────────────────────┤
│ Email verification         │ No email sending or verification flow             │
├────────────────────────────┼────────────────────────────────────────────────────┤
│ Password reset             │ Reset flow is UI only, not functional             │
├────────────────────────────┼────────────────────────────────────────────────────┤
│ Rate limiting              │ No protection against brute force                 │
├────────────────────────────┼────────────────────────────────────────────────────┤
│ CSRF protection            │ No cross-site request forgery protection          │
└────────────────────────────┴────────────────────────────────────────────────────┘
```

---

## Replacing with Real Auth

When implementing production authentication, the following changes are required:

### 1. Replace Demo Users
Remove the `DEMO_USERS` constant and connect to a real auth provider:
- **Supabase Auth** - Recommended for this stack
- **NextAuth.js** - Good for OAuth providers
- **Clerk** - Managed auth with UI components

### 2. Move Login Logic to API Routes
```typescript
// Current (client-side)
const login = async (email, password) => {
  const demoUser = DEMO_USERS[email]
  // ...
}

// Production (API route)
// POST /api/auth/login
export async function POST(req: Request) {
  const { email, password } = await req.json()
  const user = await supabase.auth.signInWithPassword({ email, password })
  // ...
}
```

### 3. Add Proper Session Management
- Use HTTP-only cookies for session tokens
- Implement session expiration and refresh
- Add server-side session validation on protected routes

### 4. Enable OAuth Providers
Wire up the existing Google/Apple buttons to real OAuth flows:
```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${origin}/auth/callback` }
})
```

### 5. Middleware Protection
Add Next.js middleware for server-side route protection:
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const session = await getSession(request)
  if (!session && isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
```

---

## Production Checklist

When deploying to production, ensure these items are addressed:

```
┌───┬────────────────────────────────────────────────────────────────────────────┐
│   │ Task                                                                       │
├───┼────────────────────────────────────────────────────────────────────────────┤
│ □ │ Replace DEMO_USERS with real auth provider (Supabase/NextAuth/Clerk)       │
├───┼────────────────────────────────────────────────────────────────────────────┤
│ □ │ Move auth logic to server-side API routes                                  │
├───┼────────────────────────────────────────────────────────────────────────────┤
│ □ │ Implement password hashing (bcrypt/argon2)                                 │
├───┼────────────────────────────────────────────────────────────────────────────┤
│ □ │ Add session expiration (24h recommended)                                   │
├───┼────────────────────────────────────────────────────────────────────────────┤
│ □ │ Use HTTP-only cookies instead of localStorage                              │
├───┼────────────────────────────────────────────────────────────────────────────┤
│ □ │ Wire up OAuth buttons (Google, Apple)                                      │
├───┼────────────────────────────────────────────────────────────────────────────┤
│ □ │ Implement email verification flow                                          │
├───┼────────────────────────────────────────────────────────────────────────────┤
│ □ │ Implement password reset with email                                        │
├───┼────────────────────────────────────────────────────────────────────────────┤
│ □ │ Add rate limiting to auth endpoints                                        │
├───┼────────────────────────────────────────────────────────────────────────────┤
│ □ │ Add CSRF protection                                                        │
├───┼────────────────────────────────────────────────────────────────────────────┤
│ □ │ Remove quick login buttons from login page                                  │
├───┼────────────────────────────────────────────────────────────────────────────┤
│ □ │ Add Next.js middleware for server-side route protection                    │
└───┴────────────────────────────────────────────────────────────────────────────┘
```

---

## Usage Example

```typescript
"use client"

import { useAuth, useRequireAuth } from "@/lib/auth-context"

export default function ProtectedPage() {
  // Require authentication with specific roles
  const { user, isLoading, isAuthorized } = useRequireAuth(["consumer", "admin"])

  // Get auth methods
  const { logout, isDemoMode } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (!isAuthorized) return null // Hook handles redirect

  return (
    <div>
      <p>Welcome, {user?.displayName}</p>
      {isDemoMode && <span>Demo Mode</span>}
      <button onClick={logout}>Sign Out</button>
    </div>
  )
}
```
