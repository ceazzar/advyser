"use client"

import {
  Building,
  Clock,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react"
import Link from "next/link"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { publicBusiness, publicMessaging } from "@/lib/public-business"

const contactMethods = [
  {
    icon: <Mail className="size-6" />,
    title: "Email",
    description: "We typically respond within 1 business day",
    value: publicBusiness.supportEmail,
    href: `mailto:${publicBusiness.supportEmail}`,
  },
  ...(publicBusiness.supportPhone
    ? [
        {
          icon: <Phone className="size-6" />,
          title: "Phone",
          description: "Mon-Fri 9am-5pm AEST",
          value: publicBusiness.supportPhone,
          href: `tel:${publicBusiness.supportPhone.replace(/\s+/g, "")}`,
        },
      ]
    : []),
  ...(publicBusiness.postalAddress
    ? [
        {
          icon: <MapPin className="size-6" />,
          title: "Postal",
          description: "Written correspondence",
          value: publicBusiness.postalAddress,
          href: "/privacy",
        },
      ]
    : []),
]

export default function ContactPage() {
  return (
    <PublicLayout>
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mx-auto mb-6">
            <MessageSquare className="size-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Get in touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Need help with advisor discovery, legal/privacy requests, or platform questions? Contact us directly.
          </p>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {contactMethods.map((method) => (
              <Card key={method.title}>
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                    {method.icon}
                  </div>
                  <h2 className="font-semibold text-foreground mb-1">{method.title}</h2>
                  <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                  <a href={method.href} className="text-primary hover:underline font-medium">
                    {method.value}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="size-5" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium text-foreground">9:00 AM - 5:00 PM AEST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday - Sunday</span>
                    <span className="font-medium text-foreground">Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="size-5" />
                  Company Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  <strong className="text-foreground">{publicBusiness.legalName}</strong>
                  <br />
                  {publicBusiness.abn ? `ABN: ${publicBusiness.abn}` : publicMessaging.noPlaceholderLegalCopy}
                </p>
                <p>{publicBusiness.postalAddress || "Postal address is provided for verified legal requests."}</p>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="size-5" />
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid sm:grid-cols-2 gap-2">
                  <li>
                    <Link href="/help" className="text-primary hover:underline">
                      Help Centre
                    </Link>
                  </li>
                  <li>
                    <Link href="/how-it-works" className="text-primary hover:underline">
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link href="/for-advisors" className="text-primary hover:underline">
                      For Advisors
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <a href={`mailto:${publicBusiness.supportEmail}`}>Email Support</a>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
