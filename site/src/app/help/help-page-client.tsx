"use client"

import {
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  HelpCircle,
  Mail,
  Phone,
  Search,
  Shield,
} from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { PublicLayout } from "@/components/layouts/public-layout"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { publicBusiness } from "@/lib/public-business"

const helpCategories = [
  {
    id: "getting-started",
    title: "Getting started",
    icon: <Search className="size-5" />,
    items: [
      { title: "Find advisers by service type", href: "/search" },
      { title: "Submit a request intro", href: "/request-intro" },
      { title: "Read advisor scope and limits", href: "/disclaimer" },
    ],
  },
  {
    id: "consumer",
    title: "For consumers",
    icon: <HelpCircle className="size-5" />,
    items: [
      { title: "How matching works", href: "/about" },
      { title: "Privacy and your data", href: "/privacy" },
      { title: "Cookie preferences", href: "/cookies" },
    ],
  },
  {
    id: "adviser",
    title: "For advisers",
    icon: <Shield className="size-5" />,
    items: [
      { title: "Adviser marketplace overview", href: "/for-advisors" },
      { title: "Ask adviser support", href: "/contact" },
      { title: "Terms of platform use", href: "/terms" },
    ],
  },
]

const faqs = [
  {
    id: "faq-free",
    question: "Is Advyser free for consumers?",
    answer:
      "Yes. Searching and comparing advisor profiles is free for consumers. Individual advisers may charge for their own advice services.",
  },
  {
    id: "faq-verify",
    question: "How do I verify an adviser?",
    answer:
      "Use profile credentials as a starting point, then independently verify registration on ASIC's Financial Advisers Register before engagement.",
  },
  {
    id: "faq-match",
    question: "How does matching work?",
    answer:
      "You provide details about goals and preferences, and Advyser surfaces advisers with relevant service scope, location, and meeting mode fit.",
  },
  {
    id: "faq-response",
    question: "How quickly does support respond?",
    answer:
      "General support requests are typically handled within one business day. Privacy and legal requests have dedicated handling windows.",
  },
  {
    id: "faq-remove-data",
    question: "How do I request access, correction, or deletion of my data?",
    answer:
      "Contact our privacy team using the contact form topic 'Privacy request' or email the privacy address listed on this page.",
  },
  {
    id: "faq-cookies",
    question: "Can I change cookie preferences after accepting?",
    answer:
      "Yes. Visit the Cookie Policy page and update preferences at any time using the controls under 'Manage preferences'.",
  },
  {
    id: "faq-complaint",
    question: "How do I raise a complaint about an adviser?",
    answer:
      "Start with the adviser's internal dispute process, then escalate to Advyser support. If unresolved, you can lodge with AFCA or notify ASIC.",
  },
  {
    id: "faq-legal",
    question: "Where can I find legal and policy documents?",
    answer:
      "All legal pages are in the footer under Legal: Privacy Policy, Terms of Service, Cookie Policy, and Disclaimer.",
  },
  {
    id: "faq-no-advice",
    question: "Does Advyser provide financial advice?",
    answer:
      "No. Advyser is a directory and matching platform. Advice is provided by independent advisers, not by Advyser.",
  },
  {
    id: "faq-adviser-contact",
    question: "How can advisers contact the platform team?",
    answer:
      "Use the contact form and select 'Adviser support' for onboarding, profile, or operational queries.",
  },
]

export function HelpPageClient() {
  const [searchQuery, setSearchQuery] = React.useState("")

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredCategories = React.useMemo(() => {
    if (!normalizedQuery) return helpCategories

    return helpCategories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) =>
          item.title.toLowerCase().includes(normalizedQuery)
        ),
      }))
      .filter(
        (category) =>
          category.title.toLowerCase().includes(normalizedQuery) ||
          category.items.length > 0
      )
  }, [normalizedQuery])

  const filteredFaqs = React.useMemo(() => {
    if (!normalizedQuery) return faqs

    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(normalizedQuery) ||
        faq.answer.toLowerCase().includes(normalizedQuery)
    )
  }, [normalizedQuery])

  const hasNoResults = filteredCategories.length === 0 && filteredFaqs.length === 0

  return (
    <PublicLayout>
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <HelpCircle className="size-8" />
          </div>
          <h1 className="text-4xl font-bold text-foreground md:text-5xl">Help Centre</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Practical answers for consumers and advisers, with clear escalation steps when you
            need more support.
          </p>

          <div className="relative mx-auto mt-8 max-w-xl">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search help topics, policies, and complaints guidance..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-12 rounded-full pl-12"
            />
          </div>
        </div>
      </section>

      {hasNoResults ? (
        <section className="bg-muted/20 py-14">
          <div className="mx-auto max-w-3xl px-6">
            <Card>
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-semibold text-foreground">No results found</h2>
                <p className="mt-3 text-muted-foreground">
                  Try broader keywords, or contact support if you need a direct answer.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button asChild>
                    <Link href="/contact">Contact support</Link>
                  </Button>
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear search
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      ) : (
        <>
          <section className="bg-muted/20 py-12">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="mb-6 text-2xl font-bold text-foreground">Browse by category</h2>
              <div className="grid gap-5 md:grid-cols-3">
                {filteredCategories.map((category) => (
                  <Card key={category.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {category.icon}
                        {category.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {category.items.map((item) => (
                          <li key={item.title}>
                            <Link
                              href={item.href}
                              className="flex items-center justify-between text-sm text-muted-foreground transition-colors hover:text-foreground"
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

          <section className="py-14">
            <div className="mx-auto max-w-4xl px-6">
              <h2 className="mb-6 text-2xl font-bold text-foreground">
                Frequently asked questions
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="rounded-lg border bg-card px-6"
                  >
                    <AccordionTrigger className="py-5 text-left hover:no-underline">
                      <span className="font-semibold text-foreground">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </>
      )}

      <section className="bg-muted/20 py-14">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="size-5" />
                Complaint flow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>1. Use the adviser&apos;s internal dispute process first.</p>
              <p>
                2. If unresolved, contact{" "}
                <a
                  href={`mailto:${publicBusiness.complaintsEmail}`}
                  className="text-primary hover:underline"
                >
                  {publicBusiness.complaintsEmail}
                </a>{" "}
                with dates, adviser name, and supporting records.
              </p>
              <p>
                3. External escalation options:{" "}
                <a
                  href="https://www.afca.org.au/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  AFCA
                </a>{" "}
                and{" "}
                <a
                  href="https://asic.gov.au/for-consumers/how-to-complain/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  ASIC
                </a>
                .
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need direct support?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-3 text-sm">
                <p className="mb-1 flex items-center gap-2 font-medium text-foreground">
                  <Mail className="size-4" />
                  Email
                </p>
                <a
                  href={`mailto:${publicBusiness.supportEmail}`}
                  className="text-primary hover:underline"
                >
                  {publicBusiness.supportEmail}
                </a>
              </div>

              {publicBusiness.supportPhone ? (
                <div className="rounded-md border p-3 text-sm">
                  <p className="mb-1 flex items-center gap-2 font-medium text-foreground">
                    <Phone className="size-4" />
                    Phone
                  </p>
                  <a
                    href={`tel:${publicBusiness.supportPhone.replace(/\s+/g, "")}`}
                    className="text-primary hover:underline"
                  >
                    {publicBusiness.supportPhone}
                  </a>
                </div>
              ) : null}

              <p className="text-xs text-muted-foreground">{publicBusiness.supportHours}</p>

              <Button asChild>
                <Link href="/contact">
                  Contact support
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </PublicLayout>
  )
}
