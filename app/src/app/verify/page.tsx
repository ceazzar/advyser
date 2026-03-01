import type { Metadata } from "next"

import VerifyPageClient from "./verify-page-client"

export const metadata: Metadata = {
  title: "Verify Email | Advyser",
  description: "Verify your email address to finish activating your Advyser account.",
}

export default function VerifyPage() {
  return <VerifyPageClient />
}
