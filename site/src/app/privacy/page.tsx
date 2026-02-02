"use client"

import Link from "next/link"
import { Shield, ArrowLeft } from "lucide-react"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
  return (
    <PublicLayout>
      {/* Header */}
      <section className="bg-white py-16 lg:py-20 border-b">
        <div className="max-w-4xl mx-auto px-6">
          <Button variant="ghost" size="sm" className="mb-6" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 size-4" />
              Back to home
            </Link>
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary">
              <Shield className="size-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: 1 February 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-gray max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Advyser Pty Ltd (ABN XX XXX XXX XXX) (&quot;Advyser&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our website and services.
            </p>
            <p>
              We are bound by the Australian Privacy Principles (APPs) contained in the Privacy Act 1988 (Cth) and applicable state and territory privacy legislation.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>2.1 Information You Provide</h3>
            <p>We collect information you provide directly to us, including:</p>
            <ul>
              <li>Name, email address, phone number, and postal address</li>
              <li>Financial information relevant to your advisor search (investment amounts, goals, etc.)</li>
              <li>Account credentials (username and password)</li>
              <li>Communications you send to us or through our platform</li>
              <li>Survey responses and feedback</li>
            </ul>

            <h3>2.2 Information Collected Automatically</h3>
            <p>When you use our services, we automatically collect:</p>
            <ul>
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages visited, time spent, clicks)</li>
              <li>Location data (based on IP address)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Match you with suitable financial advisors</li>
              <li>Process transactions and send related information</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyse trends, usage, and activities</li>
              <li>Detect, investigate, and prevent fraudulent transactions</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>4. Information Sharing</h2>
            <p>We may share your information with:</p>
            <ul>
              <li><strong>Financial Advisors:</strong> When you submit a request, we share relevant information with matched advisors to facilitate introductions</li>
              <li><strong>Service Providers:</strong> Companies that provide services on our behalf (hosting, analytics, payment processing)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>

            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. These include encryption, secure servers, and access controls.
            </p>

            <h2>6. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services and fulfil the purposes outlined in this policy, unless a longer retention period is required by law.
            </p>

            <h2>7. Your Rights</h2>
            <p>Under Australian privacy law, you have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information (subject to legal requirements)</li>
              <li>Opt out of marketing communications</li>
              <li>Lodge a complaint with the Office of the Australian Information Commissioner (OAIC)</li>
            </ul>

            <h2>8. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to collect and track information about your use of our services. You can control cookies through your browser settings. For more information, see our <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link>.
            </p>

            <h2>9. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the privacy practices of these websites. We encourage you to read the privacy policies of any website you visit.
            </p>

            <h2>10. Children&apos;s Privacy</h2>
            <p>
              Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.
            </p>

            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>

            <h2>12. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <ul>
              <li>Email: <a href="mailto:privacy@advyser.com.au" className="text-primary hover:underline">privacy@advyser.com.au</a></li>
              <li>Post: Privacy Officer, Advyser Pty Ltd, Level 10, 123 George Street, Sydney NSW 2000</li>
              <li>Phone: 1300 123 456</li>
            </ul>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
