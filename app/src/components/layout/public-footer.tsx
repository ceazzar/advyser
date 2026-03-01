"use client"

import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { publicBusiness } from "@/lib/public-business"

const footerLinks = {
  marketplace: {
    title: "Marketplace",
    links: [
      { label: "Browse Advisors", href: "/search" },
      { label: "For Advisors", href: "/for-advisors" },
      { label: "Request an Intro", href: "/request-intro" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { label: "Resources Library", href: "/resources" },
      { label: "Help", href: "/help" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
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
  { label: "X", href: "https://x.com/advyser", icon: <Twitter className="size-5" /> },
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
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="text-xl font-bold text-foreground">
              Advyser
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Connecting Aussies with qualified financial advisors. Free to search, free to compare.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>

          </div>

          {/* Link Columns */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{footerLinks.marketplace.title}</h3>
            <ul className="space-y-3">
              {footerLinks.marketplace.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:underline focus-visible:underline-offset-4 focus-visible:outline-none"
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
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:underline focus-visible:underline-offset-4 focus-visible:outline-none"
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
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:underline focus-visible:underline-offset-4 focus-visible:outline-none"
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
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:underline focus-visible:underline-offset-4 focus-visible:outline-none"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Marketplace Notice */}
      <div className="border-t bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-xs text-muted-foreground space-y-4 leading-relaxed">
            <p>
              © {currentYear} {publicBusiness.legalName}.
            </p>
            <p>
              Find financial advisors across retirement planning, wealth management, insurance, property, tax planning, and estate advice.
              Browse advisor profiles, compare options, request introductions, and access financial guides and tools.
            </p>
            <p>
              Advyser is an introducer marketplace and does not provide personal financial advice.
              Advisors listed on the platform are independent and responsible for their own advice services.
              You should verify advisor credentials on the{" "}
              <a href="https://moneysmart.gov.au/financial-advice/financial-advisers-register" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm">
                ASIC Financial Advisers Register
              </a>.
            </p>
            <div className="pt-1">
              <p className="font-medium text-foreground">Acknowledgement of Country</p>
              <p className="mt-1">
                Advyser acknowledges the First Peoples of the land throughout Australia. We recognise and celebrate the enduring connection to land, sea, culture and community. We pay our respects to Elders past, present and emerging and extend that respect to all First Nations people today.
              </p>
            </div>
          </div>
        </div>
      </div>

    </footer>
  )
}
