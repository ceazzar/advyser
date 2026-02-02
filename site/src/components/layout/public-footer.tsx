"use client"

import Link from "next/link"
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

const footerLinks = {
  findAdvisor: {
    title: "Find an Advisor",
    links: [
      { label: "Browse Advisors", href: "/search" },
      { label: "Retirement Planning", href: "/category/retirement-planning" },
      { label: "Wealth Management", href: "/category/wealth-management" },
      { label: "Insurance & Risk", href: "/category/insurance-risk" },
      { label: "Property Investment", href: "/category/property-investment" },
      { label: "Tax Planning", href: "/category/tax-planning" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { label: "All Resources", href: "/resources" },
      { label: "Guides & Articles", href: "/resources?type=guide" },
      { label: "Calculators", href: "/resources?type=calculator" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "FAQ", href: "/how-it-works#faq" },
    ],
  },
  forAdvisors: {
    title: "For Advisors",
    links: [
      { label: "Join Advyser", href: "/for-advisors" },
      { label: "Pricing", href: "/for-advisors#pricing" },
      { label: "Advisor Login", href: "/login?type=advisor" },
      { label: "Advisor Resources", href: "/advisor-resources" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
}

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com/advyser", icon: <Facebook className="size-5" /> },
  { label: "Twitter", href: "https://twitter.com/advyser", icon: <Twitter className="size-5" /> },
  { label: "LinkedIn", href: "https://linkedin.com/company/advyser", icon: <Linkedin className="size-5" /> },
  { label: "Instagram", href: "https://instagram.com/advyser", icon: <Instagram className="size-5" /> },
]

export function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/50 border-t">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="text-xl font-bold text-foreground">
              Advyser
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Connecting Australians with qualified financial advisors. Free to search, free to compare.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{footerLinks.findAdvisor.title}</h3>
            <ul className="space-y-3">
              {footerLinks.findAdvisor.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">{footerLinks.resources.title}</h3>
            <ul className="space-y-3">
              {footerLinks.resources.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">{footerLinks.forAdvisors.title}</h3>
            <ul className="space-y-3">
              {footerLinks.forAdvisors.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">{footerLinks.company.title}</h3>
            <ul className="space-y-3">
              {footerLinks.company.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">{footerLinks.legal.title}</h3>
            <ul className="space-y-3">
              {footerLinks.legal.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Regulatory Disclaimer */}
      <div className="border-t bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-xs text-muted-foreground space-y-2">
            <p>
              <strong>Important:</strong> Advyser Pty Ltd (ABN: XX XXX XXX XXX) is an introducer service only and does not hold an Australian Financial Services Licence (AFSL).
              We do not provide financial advice, credit assistance, or any other financial services.
            </p>
            <p>
              All financial advisors listed on this platform are independently licensed under their own AFSL or as authorised representatives.
              Verify credentials on the{" "}
              <a href="https://moneysmart.gov.au/financial-advice/financial-advisers-register" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                ASIC Financial Advisers Register
              </a>.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              <p>&copy; {currentYear} Advyser Pty Ltd. All rights reserved.</p>
              <p className="mt-1">ABN: XX XXX XXX XXX</p>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-right max-w-xl">
              Advyser is an introducer service only. We do not provide financial advice.
              All advisors listed are independently licensed and regulated by ASIC.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
