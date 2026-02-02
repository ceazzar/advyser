"use client"

import * as React from "react"
import Link from "next/link"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Building,
  HelpCircle,
} from "lucide-react"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const contactMethods = [
  {
    icon: <Mail className="size-6" />,
    title: "Email",
    description: "We typically respond within 24 hours",
    value: "support@advyser.com.au",
    href: "mailto:support@advyser.com.au",
  },
  {
    icon: <Phone className="size-6" />,
    title: "Phone",
    description: "Mon-Fri 9am-5pm AEST",
    value: "1300 123 456",
    href: "tel:1300123456",
  },
  {
    icon: <MapPin className="size-6" />,
    title: "Office",
    description: "Visit us in Sydney",
    value: "Level 10, 123 George St, Sydney NSW 2000",
    href: "https://maps.google.com",
  },
]

const inquiryTypes = [
  { value: "general", label: "General inquiry" },
  { value: "support", label: "Technical support" },
  { value: "advisor", label: "Advisor inquiry" },
  { value: "partnership", label: "Partnership opportunity" },
  { value: "media", label: "Media inquiry" },
  { value: "complaint", label: "Make a complaint" },
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mx-auto mb-6">
            <MessageSquare className="size-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Get in touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question or need help? We&apos;re here to assist you. Reach out through any of the methods below.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {contactMethods.map((method) => (
              <Card key={method.title}>
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                    {method.icon}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                  <a
                    href={method.href}
                    className="text-primary hover:underline font-medium"
                  >
                    {method.value}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Send us a message
              </h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and we&apos;ll get back to you as soon as possible.
              </p>

              {isSubmitted ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="flex items-center justify-center size-16 rounded-full bg-green-100 text-green-600 mx-auto mb-4">
                      <Send className="size-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Message sent!
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                    </p>
                    <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                      Send another message
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" required placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" required placeholder="Smith" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input id="phone" type="tel" placeholder="04XX XXX XXX" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inquiry">Type of inquiry</Label>
                    <Select required>
                      <SelectTrigger id="inquiry">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {inquiryTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      required
                      rows={5}
                      placeholder="How can we help you?"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send message"}
                  </Button>
                </form>
              )}
            </div>

            {/* Info */}
            <div className="space-y-8">
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
                    <strong className="text-foreground">Advyser Pty Ltd</strong>
                    <br />
                    ABN: XX XXX XXX XXX
                  </p>
                  <p>
                    Level 10, 123 George Street
                    <br />
                    Sydney NSW 2000
                    <br />
                    Australia
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="size-5" />
                    Quick Links
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
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
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
