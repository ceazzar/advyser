import type { Metadata } from "next"

import ForgotPasswordPageClient from "./forgot-password-page-client"

export const metadata: Metadata = {
  title: "Forgot Password | Advyser",
  description: "Request a secure password reset link for your Advyser account.",
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageClient />
}
