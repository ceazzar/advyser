"use client"

import { ArrowLeft,Cookie } from "lucide-react"
import Link from "next/link"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { publicBusiness, publicMessaging } from "@/lib/public-business"

export default function CookiesPage() {
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
              <Cookie className="size-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Cookie Policy</h1>
              <p className="text-muted-foreground">Last updated: 1 February 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-gray max-w-none">
            <h2>What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.
            </p>

            <h2>How We Use Cookies</h2>
            <p>Advyser uses cookies for the following purposes:</p>

            <h3>Essential Cookies</h3>
            <p>
              These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt out of these cookies.
            </p>
            <ul>
              <li><strong>Session cookies:</strong> Keep you logged in during your visit</li>
              <li><strong>Security cookies:</strong> Help protect against fraudulent activity</li>
              <li><strong>Load balancing:</strong> Distribute traffic across our servers</li>
            </ul>

            <h3>Performance Cookies</h3>
            <p>
              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website.
            </p>
            <ul>
              <li><strong>Analytics cookies:</strong> Track page views, time on site, and navigation</li>
              <li><strong>Error tracking:</strong> Help us identify and fix issues</li>
            </ul>

            <h3>Functionality Cookies</h3>
            <p>
              These cookies allow the website to remember choices you make (such as your username, language, or region) and provide enhanced, more personal features.
            </p>
            <ul>
              <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Feature cookies:</strong> Enable specific features you&apos;ve requested</li>
            </ul>

            <h3>Marketing Cookies</h3>
            <p>
              These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.
            </p>
            <ul>
              <li><strong>Advertising cookies:</strong> Deliver targeted advertising</li>
              <li><strong>Social media cookies:</strong> Enable sharing on social platforms</li>
            </ul>

            <h2>Cookies We Use</h2>
            <table className="w-full">
              <thead>
                <tr>
                  <th>Cookie Name</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>advyser_session</td>
                  <td>User session management</td>
                  <td>Session</td>
                </tr>
                <tr>
                  <td>advyser_auth</td>
                  <td>Authentication token</td>
                  <td>7 days</td>
                </tr>
                <tr>
                  <td>_ga</td>
                  <td>Google Analytics</td>
                  <td>2 years</td>
                </tr>
                <tr>
                  <td>_gid</td>
                  <td>Google Analytics</td>
                  <td>24 hours</td>
                </tr>
                <tr>
                  <td>advyser_consent</td>
                  <td>Cookie consent preferences</td>
                  <td>1 year</td>
                </tr>
              </tbody>
            </table>

            <h2>Third-Party Cookies</h2>
            <p>
              We may also use third-party cookies from the following services:
            </p>
            <ul>
              <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
              <li><strong>Google Ads:</strong> For advertising measurement and remarketing</li>
              <li><strong>Facebook:</strong> For social sharing and advertising</li>
              <li><strong>Intercom:</strong> For customer support chat functionality</li>
            </ul>

            <h2>Managing Cookies</h2>
            <p>
              You can control and manage cookies in several ways. Please note that removing or blocking cookies may impact your user experience and some functionality may no longer be available.
            </p>

            <h3>Browser Settings</h3>
            <p>
              Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so vary from browser to browser:
            </p>
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Firefox</a></li>
              <li><a href="https://support.apple.com/en-au/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Edge</a></li>
            </ul>

            <h3>Opt-Out Links</h3>
            <p>
              You can opt out of certain third-party cookies:
            </p>
            <ul>
              <li><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics Opt-Out</a></li>
              <li><a href="https://www.youronlinechoices.com.au/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Your Online Choices (Australia)</a></li>
            </ul>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about our use of cookies, please contact us:
            </p>
            <ul>
              <li>Email: <a href={`mailto:${publicBusiness.privacyEmail}`} className="text-primary hover:underline">{publicBusiness.privacyEmail}</a></li>
              <li>Address: {publicBusiness.postalAddress || publicMessaging.noPlaceholderLegalCopy}</li>
            </ul>

            <p>
              For more information about how we handle your personal information, please see our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
