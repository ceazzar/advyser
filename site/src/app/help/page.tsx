"use client"

import Link from "next/link"
import {
  HelpCircle,
  Search,
  MessageSquare,
  Phone,
  Mail,
  ArrowRight,
  ChevronRight,
} from "lucide-react"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const helpCategories = [
  {
    title: "Getting Started",
    icon: <Search className="size-5" />,
    items: [
      { title: "How to find an advisor", href: "/how-it-works" },
      { title: "Creating an account", href: "/signup" },
      { title: "Understanding advisor profiles", href: "/search" },
    ],
  },
  {
    title: "For Consumers",
    icon: <MessageSquare className="size-5" />,
    items: [
      { title: "Submitting a request", href: "/request-intro" },
      { title: "Comparing advisors", href: "/search" },
      { title: "Booking a consultation", href: "/how-it-works" },
    ],
  },
  {
    title: "For Advisors",
    icon: <HelpCircle className="size-5" />,
    items: [
      { title: "Claiming your profile", href: "/claim" },
      { title: "Managing your listing", href: "/for-advisors" },
      { title: "Responding to leads", href: "/for-advisors" },
    ],
  },
]

const faqs = [
  {
    question: "Is Advyser free to use?",
    answer: "Yes, Advyser is completely free for consumers. You can search for advisors, compare profiles, and submit requests at no cost. Advisors pay a subscription to be listed on the platform.",
  },
  {
    question: "How are advisors verified?",
    answer: "All advisors on Advyser are verified through ASIC's Financial Advisers Register. We check their credentials, professional memberships, and current registration status before they can appear on our platform.",
  },
  {
    question: "How do I contact an advisor?",
    answer: "You can contact advisors directly through their profile page or submit a request to be matched with suitable advisors. Once matched, you can communicate via our messaging system or book a consultation.",
  },
  {
    question: "What if I have a complaint about an advisor?",
    answer: "If you have concerns about an advisor, please contact us immediately. We take all complaints seriously and will investigate. For regulatory matters, you can also contact ASIC or the advisor's professional body directly.",
  },
  {
    question: "How do I reset my password?",
    answer: "Click on 'Log in' and then 'Forgot password'. Enter your email address and we'll send you a link to reset your password. The link expires after 24 hours for security.",
  },
]

export default function HelpPage() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mx-auto mb-6">
            <HelpCircle className="size-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How can we help?
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find answers to common questions or get in touch with our support team
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for help..."
              className="pl-12 h-14 text-lg rounded-full"
            />
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Browse by category
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {helpCategories.map((category) => (
              <Card key={category.title}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
                      {category.icon}
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3">
                    {category.items.map((item) => (
                      <li key={item.title}>
                        <Link
                          href={item.href}
                          className="flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <span>{item.title}</span>
                          <ChevronRight className="size-4" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Frequently asked questions
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="bg-card rounded-lg border px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-foreground">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Still need help?
          </h2>
          <p className="text-muted-foreground mb-8">
            Our support team is here to help you with any questions
          </p>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                  <Mail className="size-6" />
                </div>
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We typically respond within 24 hours
                </p>
                <Button variant="outline" asChild>
                  <Link href="mailto:support@advyser.com.au">
                    support@advyser.com.au
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                  <Phone className="size-6" />
                </div>
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Mon-Fri 9am-5pm AEST
                </p>
                <Button variant="outline" asChild>
                  <Link href="tel:1300123456">
                    1300 123 456
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <Button size="lg" className="rounded-full" asChild>
              <Link href="/contact">
                Contact Us
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
