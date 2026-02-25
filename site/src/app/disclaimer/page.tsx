import { AlertTriangle } from "lucide-react"
import type { Metadata } from "next"

import { LegalPageShell } from "@/components/composite/legal-page-shell"
import { policyMeta } from "@/lib/policy-meta"
import { publicBusiness } from "@/lib/public-business"

export const metadata: Metadata = {
  title: "Disclaimer | Advyser",
  description:
    "Important limitations about Advyser's role as an introducer platform and your responsibilities when selecting advisers.",
}

const toc = [
  { id: "platform-scope", label: "Platform scope" },
  { id: "verification-boundaries", label: "Verification boundaries" },
  { id: "liability", label: "Liability limits" },
  { id: "complaints", label: "Complaints and escalation" },
  { id: "contact", label: "Contact" },
]

export default function DisclaimerPage() {
  return (
    <LegalPageShell
      title="Disclaimer"
      summary="Advyser is a directory and introducer platform. We do not provide personal financial advice."
      icon={AlertTriangle}
      policy={policyMeta.disclaimer}
      toc={toc}
    >
      <section id="platform-scope">
        <h2>Platform scope</h2>
        <p>
          Information on Advyser is general in nature and is provided to support adviser discovery
          and comparison. It is not personal financial advice, tax advice, or legal advice.
        </p>
        <p>
          Advisers listed on the platform are independent professionals and remain responsible for
          advice they provide.
        </p>
      </section>

      <section id="verification-boundaries">
        <h2>Verification boundaries</h2>
        <p>
          The table below clarifies what Advyser checks versus what users should verify before
          engagement.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr>
                <th className="border-b px-3 py-2 text-left">Advyser verifies</th>
                <th className="border-b px-3 py-2 text-left">You should verify</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b px-3 py-2 align-top">
                  Profile completeness checks and platform policy compliance.
                </td>
                <td className="border-b px-3 py-2 align-top">
                  Current ASIC registration status and disciplinary history.
                </td>
              </tr>
              <tr>
                <td className="border-b px-3 py-2 align-top">
                  That listings provide clear scope and contact pathways.
                </td>
                <td className="border-b px-3 py-2 align-top">
                  Service suitability, fee structure, and adviser-client fit.
                </td>
              </tr>
              <tr>
                <td className="border-b px-3 py-2 align-top">
                  Complaint intake pathways for platform-related concerns.
                </td>
                <td className="border-b px-3 py-2 align-top">
                  External escalation options where adviser disputes remain unresolved.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="liability">
        <h2>Liability limits</h2>
        <p>
          To the extent permitted by law, Advyser is not liable for losses resulting from adviser
          recommendations, advice outcomes, or third-party content linked from this platform.
        </p>
        <p>
          Users should make independent assessments and obtain appropriate professional advice
          before acting.
        </p>
      </section>

      <section id="complaints">
        <h2>Complaints and escalation</h2>
        <ul>
          <li>Start with the adviser&apos;s internal dispute process where advice has been given.</li>
          <li>Contact Advyser for platform concerns or unresolved conduct issues.</li>
          <li>
            External escalation options include{" "}
            <a
              href="https://www.afca.org.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              AFCA
            </a>{" "}
            and{" "}
            <a
              href="https://asic.gov.au/for-consumers/how-to-complain/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              ASIC
            </a>
            .
          </li>
        </ul>
      </section>

      <section id="contact">
        <h2>Contact</h2>
        <ul>
          <li>
            Legal:{" "}
            <a href={`mailto:${publicBusiness.legalEmail}`} className="text-primary hover:underline">
              {publicBusiness.legalEmail}
            </a>
          </li>
          <li>
            Complaints:{" "}
            <a
              href={`mailto:${publicBusiness.complaintsEmail}`}
              className="text-primary hover:underline"
            >
              {publicBusiness.complaintsEmail}
            </a>
          </li>
          {publicBusiness.legalAddress ? <li>Post: {publicBusiness.legalAddress}</li> : null}
        </ul>
      </section>
    </LegalPageShell>
  )
}
