import type { Metadata } from "next"

import { ContactPageClient } from "./contact-page-client"

export const metadata: Metadata = {
  title: "Contact Advyser | Consumer, Adviser, and Legal Support",
  description:
    "Contact Advyser for consumer support, adviser enquiries, privacy requests, and legal correspondence.",
}

export default function ContactPage() {
  return <ContactPageClient />
}
