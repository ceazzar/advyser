import type { Metadata } from "next"
import { Suspense } from "react"

import RequestIntroPageClient from "./request-intro-page-client"

export const metadata: Metadata = {
  title: "Request an Introduction | Advyser",
  description:
    "Create an account and submit your request to be introduced to advisers that match your goals.",
}

function RequestIntroLoading() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        Loading request form...
      </div>
    </div>
  )
}

export default function RequestIntroPage() {
  return (
    <Suspense fallback={<RequestIntroLoading />}>
      <RequestIntroPageClient />
    </Suspense>
  )
}
