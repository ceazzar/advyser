"use client"

import { AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function DisclaimerPage() {
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
            <div className="flex items-center justify-center size-12 rounded-full bg-amber-100 text-amber-600">
              <AlertTriangle className="size-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Disclaimer</h1>
              <p className="text-muted-foreground">Last updated: 1 February 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Alert className="mb-8">
            <AlertTriangle className="size-4" />
            <AlertDescription>
              <strong>Important:</strong> Advyser does not provide financial advice. We are a directory and matching service only. Please read this disclaimer carefully.
            </AlertDescription>
          </Alert>

          <div className="prose prose-gray max-w-none">
            <h2>No Financial Advice</h2>
            <p>
              The information provided on the Advyser website and platform is for general informational purposes only. Nothing on this website constitutes, or is intended to constitute, financial advice, investment advice, taxation advice, or any other professional advice.
            </p>
            <p>
              Advyser Pty Ltd is not a financial services licensee and does not hold an Australian Financial Services Licence (AFSL). We do not provide personal financial product advice.
            </p>

            <h2>Directory Service Only</h2>
            <p>
              Advyser operates as a directory and matching service. We help connect consumers with financial advisors who may be able to assist with their needs. The advisors listed on our platform are independent professionals who operate their own businesses.
            </p>
            <p>
              We do not:
            </p>
            <ul>
              <li>Provide financial advice or recommendations</li>
              <li>Endorse or guarantee any particular advisor</li>
              <li>Take responsibility for advice given by advisors</li>
              <li>Act as an intermediary in the advice process</li>
            </ul>

            <h2>Advisor Verification</h2>
            <p>
              While we verify that advisors listed on our platform are registered with ASIC&apos;s Financial Advisers Register at the time of listing, we cannot guarantee:
            </p>
            <ul>
              <li>The ongoing registration status of any advisor</li>
              <li>The quality or suitability of advice provided</li>
              <li>The accuracy of information provided by advisors</li>
              <li>The outcomes of any engagement with an advisor</li>
            </ul>
            <p>
              We strongly recommend that you independently verify any advisor&apos;s credentials through <a href="https://asic.gov.au/online-services/search-asics-registers/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ASIC&apos;s Financial Advisers Register</a> before engaging their services.
            </p>

            <h2>Your Responsibility</h2>
            <p>
              Before engaging any financial advisor, you should:
            </p>
            <ul>
              <li>Verify their registration status with ASIC</li>
              <li>Check their professional memberships and qualifications</li>
              <li>Request and review their Financial Services Guide (FSG)</li>
              <li>Understand their fee structure and how they are paid</li>
              <li>Assess whether they are appropriate for your specific needs</li>
              <li>Seek independent advice if you are unsure</li>
            </ul>

            <h2>Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Advyser Pty Ltd disclaims all liability for:
            </p>
            <ul>
              <li>Any loss or damage arising from the use of our website or services</li>
              <li>Any decisions made based on information on our platform</li>
              <li>Any acts or omissions of financial advisors listed on our platform</li>
              <li>Any advice given by financial advisors found through our service</li>
              <li>Any investment losses or poor financial outcomes</li>
            </ul>

            <h2>Information Accuracy</h2>
            <p>
              While we endeavour to keep the information on our website accurate and up-to-date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information contained on the website.
            </p>
            <p>
              Information about advisors, including their qualifications, services, and fees, is provided by the advisors themselves. We do not independently verify this information.
            </p>

            <h2>Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. These links are provided for your convenience and information only. We do not endorse, control, or assume any responsibility for the content or practices of these websites.
            </p>

            <h2>Regulatory Information</h2>
            <p>
              Financial advice in Australia is regulated by the Australian Securities and Investments Commission (ASIC). If you have concerns about a financial advisor or the advice you have received, you can:
            </p>
            <ul>
              <li>Contact the advisor&apos;s complaints handling team</li>
              <li>Lodge a complaint with the Australian Financial Complaints Authority (AFCA)</li>
              <li>Report concerns to ASIC</li>
            </ul>

            <h2>Changes to This Disclaimer</h2>
            <p>
              We may update this disclaimer from time to time. We encourage you to review this page periodically for any changes. Your continued use of our website following the posting of changes constitutes your acceptance of those changes.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this disclaimer, please contact us:
            </p>
            <ul>
              <li>Email: <a href="mailto:legal@advyser.com.au" className="text-primary hover:underline">legal@advyser.com.au</a></li>
              <li>Address: Level 10, 123 George Street, Sydney NSW 2000</li>
            </ul>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
