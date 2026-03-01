import type { Metadata } from "next"
import { Suspense } from "react"

import SignupPageClient from "./signup-page-client"

export const metadata: Metadata = {
  title: "Sign Up | Advyser",
  description: "Create your Advyser account to unlock adviser contact details and request introductions.",
}

function SignupPageLoading() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        Loading signup...
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupPageLoading />}>
      <SignupPageClient />
    </Suspense>
  )
}
