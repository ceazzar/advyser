import { Shield } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import { LegalPageShell } from "@/components/composite/legal-page-shell"
import { policyMeta } from "@/lib/policy-meta"
import { publicBusiness } from "@/lib/public-business"

export const metadata: Metadata = {
  title: "Privacy Policy | Advyser",
  description:
    "How Advyser collects, uses, discloses, and safeguards personal information under Australian privacy requirements.",
}

const toc = [
  { id: "plain-english-summary", label: "Plain-English summary" },
  { id: "data-we-collect", label: "Data we collect" },
  { id: "how-we-use-data", label: "How we use data" },
  { id: "sharing-disclosure", label: "Sharing and disclosure" },
  { id: "retention-security", label: "Retention and security" },
  { id: "your-rights", label: "Your rights and requests" },
  { id: "contact", label: "Contact" },
]

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      summary="This policy explains how Advyser handles personal information in line with Australian Privacy Principles (APPs)."
      icon={Shield}
      policy={policyMeta.privacy}
      toc={toc}
    >
      <section id="plain-english-summary">
        <h2>Plain-English summary</h2>
        <ul>
          <li>
            We collect only the information needed to run accounts, support requests, and adviser
            matching features.
          </li>
          <li>
            We do not sell personal information. Data is shared only where needed to deliver the
            service or where required by law.
          </li>
          <li>
            Privacy requests are acknowledged within 5 business days and generally completed within
            30 calendar days.
          </li>
        </ul>
      </section>

      <section id="data-we-collect">
        <h2>Data we collect</h2>
        <p>
          {publicBusiness.legalName}
          {publicBusiness.abn ? ` (ABN ${publicBusiness.abn})` : ""} collects information you
          provide directly and information generated as you use our platform.
        </p>
        <h3>Information you provide</h3>
        <ul>
          <li>Account details such as name and email when signing up.</li>
          <li>Request-intro and lead details such as goals, timing, and communication preferences.</li>
          <li>Support submissions and complaint details provided via our contact pathways.</li>
        </ul>
        <h3>Information collected automatically</h3>
        <ul>
          <li>Basic technical information such as browser type and IP-derived location signals.</li>
          <li>Platform interaction data used to improve reliability and usability.</li>
          <li>
            Consent preference storage (see the{" "}
            <Link href="/cookies" className="text-primary hover:underline">
              Cookie Policy
            </Link>
            ).
          </li>
        </ul>
      </section>

      <section id="how-we-use-data">
        <h2>How we use data</h2>
        <p>We use personal information to:</p>
        <ul>
          <li>operate core platform features and maintain account security,</li>
          <li>route requests to relevant advisers when you initiate matching actions,</li>
          <li>respond to support, legal, and privacy requests, and</li>
          <li>meet legal and regulatory obligations.</li>
        </ul>
      </section>

      <section id="sharing-disclosure">
        <h2>Sharing and disclosure</h2>
        <ul>
          <li>
            <strong>With advisers:</strong> only when you use matching/request workflows that
            require introductions.
          </li>
          <li>
            <strong>With service providers:</strong> trusted vendors who help us host and operate
            the platform under contractual confidentiality controls.
          </li>
          <li>
            <strong>With regulators or courts:</strong> where required by applicable law.
          </li>
        </ul>
        <p>We do not sell your personal information to third parties.</p>
      </section>

      <section id="retention-security">
        <h2>Retention and security</h2>
        <p>
          We apply technical and organisational controls to protect data from unauthorised access,
          loss, or misuse. Access is restricted to authorised personnel and service providers with
          defined responsibilities.
        </p>
        <p>
          Retention periods depend on the data type, legal obligations, and operational needs. When
          data is no longer required, we delete or de-identify it where feasible.
        </p>
      </section>

      <section id="your-rights">
        <h2>Your rights and requests</h2>
        <p>
          Under Australian privacy law, you can request access to, correction of, or deletion of
          your personal information (subject to legal limits).
        </p>
        <ul>
          <li>Request acknowledgement target: within 5 business days.</li>
          <li>Standard response target: within 30 calendar days.</li>
          <li>
            If unresolved, you may lodge a complaint with the{" "}
            <a
              href="https://www.oaic.gov.au/privacy/privacy-complaints"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Office of the Australian Information Commissioner (OAIC)
            </a>
            .
          </li>
        </ul>
      </section>

      <section id="contact">
        <h2>Contact</h2>
        <p>For privacy requests or questions:</p>
        <ul>
          <li>
            Email:{" "}
            <a
              href={`mailto:${publicBusiness.privacyEmail}`}
              className="text-primary hover:underline"
            >
              {publicBusiness.privacyEmail}
            </a>
          </li>
          {publicBusiness.supportPhone ? <li>Phone: {publicBusiness.supportPhone}</li> : null}
          {publicBusiness.legalAddress ? <li>Post: {publicBusiness.legalAddress}</li> : null}
        </ul>
      </section>
    </LegalPageShell>
  )
}
