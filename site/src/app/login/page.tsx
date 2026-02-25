import type { Metadata } from "next"
import { Suspense } from "react"

import LoginPageClient from "./login-page-client"

export const metadata: Metadata = {
  title: "Log In | Advyser",
  description: "Sign in to your Advyser account to continue your adviser matching journey.",
}

function LoginPageLoading() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        Loading login...
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageLoading />}>
      <LoginPageClient />
    </Suspense>
  )
}
