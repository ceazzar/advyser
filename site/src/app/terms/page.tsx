import { FileText } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import { LegalPageShell } from "@/components/composite/legal-page-shell"
import { policyMeta } from "@/lib/policy-meta"
import { publicBusiness } from "@/lib/public-business"

export const metadata: Metadata = {
  title: "Terms of Service | Advyser",
  description:
    "Read the terms that govern use of the Advyser platform, including scope, responsibilities, and dispute handling.",
}

const toc = [
  { id: "key-points", label: "Key points" },
  { id: "service-scope", label: "Service scope" },
  { id: "user-obligations", label: "User obligations" },
  { id: "liability", label: "Liability and disclaimers" },
  { id: "changes", label: "Changes and versioning" },
  { id: "contact", label: "Contact" },
]

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Terms of Service"
      summary="These terms apply when you access or use Advyser. Please read them before using matching or account features."
      icon={FileText}
      policy={policyMeta.terms}
      toc={toc}
    >
      <section id="key-points">
        <h2>Key points</h2>
        <ul>
          <li>Advyser is an introducer and directory platform, not a financial advice provider.</li>
          <li>You must verify adviser suitability independently before engagement.</li>
          <li>You must provide accurate information when using account or request workflows.</li>
          <li>Advice services are provided by independent advisers, not by Advyser.</li>
        </ul>
      </section>

      <section id="service-scope">
        <h2>Service scope</h2>
        <p>
          Advyser helps consumers discover and compare adviser options. Our service may include
          search, profile discovery, and introduction workflows.
        </p>
        <p>
          We do not provide personal financial advice or recommendations. Adviser services are
          delivered by independent professionals who remain responsible for their own advice and
          conduct.
        </p>
        <p>
          Please also read our{" "}
          <Link href="/disclaimer" className="text-primary hover:underline">
            Disclaimer
          </Link>{" "}
          for important scope and verification information.
        </p>
      </section>

      <section id="user-obligations">
        <h2>User obligations</h2>
        <h3>For all users</h3>
        <ul>
          <li>Provide truthful and up-to-date information.</li>
          <li>Do not use the platform for unlawful or misleading conduct.</li>
          <li>Do not interfere with service integrity, availability, or security.</li>
        </ul>
        <h3>For consumers</h3>
        <ul>
          <li>Review adviser credentials and fit independently before engagement.</li>
          <li>Use platform information as an input to decision-making, not a sole determinant.</li>
        </ul>
        <h3>For advisers</h3>
        <ul>
          <li>Maintain accurate profile and professional information.</li>
          <li>Comply with applicable Australian regulatory obligations.</li>
        </ul>
      </section>

      <section id="liability">
        <h2>Liability and disclaimers</h2>
        <p>
          The platform is provided on an &quot;as is&quot; and &quot;as available&quot; basis to the extent
          permitted by law.
        </p>
        <p>
          To the maximum extent permitted by law, Advyser is not liable for indirect or
          consequential losses arising from use of the platform, adviser decisions, or third-party
          services.
        </p>
        <p>
          Nothing in these terms excludes rights that cannot be excluded under Australian Consumer
          Law.
        </p>
      </section>

      <section id="changes">
        <h2>Changes and versioning</h2>
        <p>
          We may update these terms from time to time. Material updates will be published on this
          page with an updated version and date.
        </p>
        <p>
          Continued use of the platform after an update constitutes acceptance of the updated
          terms.
        </p>
      </section>

      <section id="contact">
        <h2>Contact</h2>
        <ul>
          <li>
            Email:{" "}
            <a href={`mailto:${publicBusiness.legalEmail}`} className="text-primary hover:underline">
              {publicBusiness.legalEmail}
            </a>
          </li>
          {publicBusiness.legalAddress ? <li>Post: {publicBusiness.legalAddress}</li> : null}
        </ul>
      </section>
    </LegalPageShell>
  )
}
