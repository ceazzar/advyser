import type { Metadata } from "next"

import ResetPasswordPageClient from "./reset-password-page-client"

export const metadata: Metadata = {
  title: "Reset Password | Advyser",
  description: "Set a new password for your Advyser account.",
}

export default function ResetPasswordPage() {
  return <ResetPasswordPageClient />
}
