import type { Metadata } from "next"

import { HelpPageClient } from "./help-page-client"

export const metadata: Metadata = {
  title: "Help Centre | Advyser Support and Complaint Pathways",
  description:
    "Find support answers, complaint escalation guidance, and policy links for Advyser consumers and advisers.",
}

export default function HelpPage() {
  return <HelpPageClient />
}
