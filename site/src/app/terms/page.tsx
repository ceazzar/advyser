"use client"

import Link from "next/link"
import { FileText, ArrowLeft } from "lucide-react"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
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
              <FileText className="size-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: 1 February 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-gray max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Advyser website and services (the &quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use our Service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              Advyser is an online platform that connects consumers with financial advisors. We provide a matching service to help users find suitable financial professionals based on their needs and preferences.
            </p>
            <p>
              <strong>Important:</strong> Advyser does not provide financial advice. We are a directory and matching service only. Any advice you receive comes from independent financial advisors who are responsible for their own services.
            </p>

            <h2>3. User Accounts</h2>
            <h3>3.1 Account Creation</h3>
            <p>To use certain features of our Service, you must create an account. You agree to:</p>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information as necessary</li>
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorised access</li>
            </ul>

            <h3>3.2 Account Responsibility</h3>
            <p>
              You are responsible for all activities that occur under your account. We are not liable for any loss or damage arising from your failure to protect your account credentials.
            </p>

            <h2>4. Consumer Terms</h2>
            <p>As a consumer using our Service, you agree that:</p>
            <ul>
              <li>The information you provide is accurate and not misleading</li>
              <li>You will not use the Service for any unlawful purpose</li>
              <li>You understand that advisor matching is based on the information you provide</li>
              <li>Advyser does not guarantee the quality, suitability, or outcomes of any advisor engagement</li>
              <li>You are responsible for conducting your own due diligence on any advisor</li>
            </ul>

            <h2>5. Advisor Terms</h2>
            <p>Financial advisors using our Service agree to:</p>
            <ul>
              <li>Maintain current registration with ASIC and comply with all regulatory requirements</li>
              <li>Provide accurate and up-to-date profile information</li>
              <li>Respond to consumer inquiries in a timely and professional manner</li>
              <li>Not engage in misleading or deceptive conduct</li>
              <li>Maintain appropriate professional indemnity insurance</li>
              <li>Pay all applicable subscription fees</li>
            </ul>

            <h2>6. Intellectual Property</h2>
            <p>
              All content, features, and functionality of the Service, including but not limited to text, graphics, logos, and software, are the property of Advyser and are protected by copyright, trademark, and other intellectual property laws.
            </p>

            <h2>7. User Content</h2>
            <p>
              By submitting content to our Service (reviews, comments, profile information), you grant Advyser a non-exclusive, royalty-free, worldwide licence to use, display, and distribute such content in connection with our Service.
            </p>

            <h2>8. Prohibited Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Impersonate any person or entity</li>
              <li>Submit false, misleading, or fraudulent information</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Attempt to gain unauthorised access to any part of the Service</li>
              <li>Use automated systems to access the Service without permission</li>
              <li>Harass, abuse, or harm other users</li>
            </ul>

            <h2>9. Disclaimer of Warranties</h2>
            <p>
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, secure, or error-free.
            </p>
            <p>
              We do not endorse or guarantee any financial advisor on our platform. Users should independently verify advisor credentials through ASIC&apos;s Financial Advisers Register.
            </p>

            <h2>10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Advyser shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses, arising from your use of the Service.
            </p>
            <p>
              Our total liability for any claims arising from or related to the Service shall not exceed the amount you paid to us, if any, in the twelve months preceding the claim.
            </p>

            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Advyser and its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Service or violation of these Terms.
            </p>

            <h2>12. Termination</h2>
            <p>
              We may terminate or suspend your access to the Service immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the Service will immediately cease.
            </p>

            <h2>13. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page. Your continued use of the Service after such changes constitutes acceptance of the new Terms.
            </p>

            <h2>14. Governing Law</h2>
            <p>
              These Terms are governed by the laws of New South Wales, Australia. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of New South Wales.
            </p>

            <h2>15. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us:
            </p>
            <ul>
              <li>Email: <a href="mailto:legal@advyser.com.au" className="text-primary hover:underline">legal@advyser.com.au</a></li>
              <li>Post: Advyser Pty Ltd, Level 10, 123 George Street, Sydney NSW 2000</li>
            </ul>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
