import { Cookie } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import { CookiePreferencesControls } from "@/components/composite/cookie-preferences-controls"
import { LegalPageShell } from "@/components/composite/legal-page-shell"
import { policyMeta } from "@/lib/policy-meta"
import { publicBusiness } from "@/lib/public-business"

export const metadata: Metadata = {
  title: "Cookie Policy | Advyser",
  description:
    "Learn how Advyser uses browser storage and authentication cookies, and manage your consent preferences.",
}

const toc = [
  { id: "plain-english-summary", label: "Plain-English summary" },
  { id: "storage-we-use", label: "Storage we use" },
  { id: "manage-preferences", label: "Manage preferences" },
  { id: "contact", label: "Contact" },
]

export default function CookiesPage() {
  return (
    <LegalPageShell
      title="Cookie Policy"
      summary="This page describes browser storage used by Advyser and how to manage your preferences."
      icon={Cookie}
      policy={policyMeta.cookies}
      toc={toc}
    >
      <section id="plain-english-summary">
        <h2>Plain-English summary</h2>
        <ul>
          <li>
            We use a small amount of browser storage to remember your consent preference and keep
            signed-in sessions working.
          </li>
          <li>
            We do not currently run optional third-party advertising or social tracking tags on
            public pages.
          </li>
          <li>You can update your preference at any time from this page.</li>
        </ul>
      </section>

      <section id="storage-we-use">
        <h2>Storage we use</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse">
            <thead>
              <tr>
                <th className="border-b px-3 py-2 text-left">Name / Pattern</th>
                <th className="border-b px-3 py-2 text-left">Type</th>
                <th className="border-b px-3 py-2 text-left">Purpose</th>
                <th className="border-b px-3 py-2 text-left">Typical duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b px-3 py-2 align-top">
                  <code>advyser-cookie-consent</code>
                </td>
                <td className="border-b px-3 py-2 align-top">Local storage</td>
                <td className="border-b px-3 py-2 align-top">
                  Stores whether you selected essential-only mode or optional storage.
                </td>
                <td className="border-b px-3 py-2 align-top">
                  Until changed or cleared by the user
                </td>
              </tr>
              <tr>
                <td className="border-b px-3 py-2 align-top">
                  <code>sb-*-auth-token*</code>
                </td>
                <td className="border-b px-3 py-2 align-top">Cookie</td>
                <td className="border-b px-3 py-2 align-top">
                  Authentication session cookies used by Supabase when a user signs in.
                </td>
                <td className="border-b px-3 py-2 align-top">Session / provider managed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="manage-preferences">
        <h2>Manage preferences</h2>
        <p>
          Use the controls below to choose between essential-only mode and optional storage. This
          updates the same preference used by our cookie banner.
        </p>
        <CookiePreferencesControls />
        <p className="mt-4">
          You can also clear browser storage directly from your browser settings. Doing so may sign
          you out of authenticated sessions.
        </p>
      </section>

      <section id="contact">
        <h2>Contact</h2>
        <p>
          For questions about this policy or browser storage usage, contact{" "}
          <a
            href={`mailto:${publicBusiness.privacyEmail}`}
            className="text-primary hover:underline"
          >
            {publicBusiness.privacyEmail}
          </a>
          .
        </p>
        {publicBusiness.legalAddress ? <p>Postal: {publicBusiness.legalAddress}</p> : null}
        <p>
          For broader data handling details, see our{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </LegalPageShell>
  )
}
