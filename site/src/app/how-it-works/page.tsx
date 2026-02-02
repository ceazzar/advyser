"use client"

import Link from "next/link"
import {
  Search,
  Users,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Shield,
  Clock,
  DollarSign,
  BadgeCheck,
  Star,
  Quote,
  HelpCircle,
} from "lucide-react"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, getInitials } from "@/components/ui/avatar"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Process steps with detailed info
const steps = [
  {
    number: 1,
    icon: <Search className="size-8" />,
    title: "Tell us what you need",
    subtitle: "2 minutes",
    description: "Answer a few simple questions about your financial goals, timeline, and preferences. We use this to find advisors who specialize in exactly what you're looking for.",
    details: [
      "Select the type of advice you need (retirement, investments, insurance, etc.)",
      "Tell us about your financial situation and goals",
      "Choose your preferred location and communication style",
    ],
  },
  {
    number: 2,
    icon: <Users className="size-8" />,
    title: "Get matched with advisors",
    subtitle: "Within 24 hours",
    description: "We carefully match you with up to 3 qualified advisors based on your specific needs. Each advisor is verified and experienced in helping people like you.",
    details: [
      "Our algorithm considers your needs, location, and preferences",
      "Advisors review your request and confirm their interest",
      "You receive profiles of advisors who are a great fit",
    ],
  },
  {
    number: 3,
    icon: <MessageSquare className="size-8" />,
    title: "Connect and choose",
    subtitle: "Free consultation",
    description: "Review advisor profiles, read reviews, and book a free initial consultation with the advisor you like best. There's no obligation to proceed.",
    details: [
      "Compare credentials, specialties, and client reviews",
      "Ask questions before committing to any advisor",
      "Book a free first meeting to see if they're right for you",
    ],
  },
]

// Benefits
const benefits = [
  {
    icon: <Shield className="size-6" />,
    title: "All Advisors Verified",
    description: "Every advisor on Advyser is ASIC-registered and has been background checked. We verify their credentials so you don't have to.",
  },
  {
    icon: <DollarSign className="size-6" />,
    title: "100% Free for You",
    description: "There's no cost to use Advyser. Search, compare, and connect with advisors without paying a cent. Advisors pay a subscription to be listed.",
  },
  {
    icon: <Clock className="size-6" />,
    title: "Fast Response Times",
    description: "Matched advisors typically respond within 24 hours. No waiting weeks to hear back or chasing down busy practices.",
  },
  {
    icon: <BadgeCheck className="size-6" />,
    title: "No Obligation",
    description: "Getting matched doesn't commit you to anything. You're free to explore options and choose the advisor that feels right.",
  },
]

// Testimonials
const testimonials = [
  {
    name: "David Roberts",
    role: "Business Owner",
    location: "Sydney",
    quote: "I was overwhelmed trying to find a financial advisor on my own. Advyser made it simple - I had three great options within a day.",
    rating: 5,
  },
  {
    name: "Jennifer Lee",
    role: "Medical Professional",
    location: "Melbourne",
    quote: "The matching was spot-on. The advisor I chose understood my specific situation as a doctor and helped me optimize my super and investments.",
    rating: 5,
  },
  {
    name: "Mark Thompson",
    role: "Pre-retiree",
    location: "Brisbane",
    quote: "At 58, I needed someone who specialized in retirement planning. Advyser connected me with exactly the right person.",
    rating: 5,
  },
]

// FAQs
const faqs = [
  {
    question: "Is Advyser really free?",
    answer: "Yes, Advyser is completely free for consumers. We earn revenue from advisors who pay a subscription to be listed on our platform. You'll never be charged for using our matching service.",
  },
  {
    question: "How are advisors selected for me?",
    answer: "Our matching algorithm considers your specific needs (retirement, investments, etc.), your location, your financial situation, and your preferences. We only show you advisors who have confirmed they can help with your specific requirements.",
  },
  {
    question: "Are all advisors on Advyser qualified?",
    answer: "Yes. Every advisor on Advyser must be registered with ASIC's Financial Advisers Register. We also verify their qualifications, professional memberships, and insurance. You can check any advisor's credentials on ASIC's public register.",
  },
  {
    question: "What if I don't like the advisors I'm matched with?",
    answer: "There's no obligation to work with any advisor. If none of the matches feel right, you can request new matches or continue searching on your own. Many clients also use Advyser to compare options before making a decision.",
  },
  {
    question: "How long does it take to get matched?",
    answer: "Most users receive their advisor matches within 24 hours. In some cases, particularly for specialized needs or regional locations, it may take up to 48 hours.",
  },
  {
    question: "What happens after I submit a request?",
    answer: "We send your (anonymized) request to suitable advisors who can then express interest. Once we have matches, we'll send you their profiles. You can then review and decide who to contact. Advisors may also reach out to you directly via email or phone.",
  },
  {
    question: "Do advisors pay to contact me?",
    answer: "No, advisors don't pay per lead. They pay a subscription to be listed on Advyser, which means they're not incentivized to be pushy. They genuinely want to help clients who are a good fit.",
  },
  {
    question: "Can I search for advisors without submitting a request?",
    answer: "Absolutely! You can browse and search advisor profiles freely. The matching service just helps if you want personalized recommendations or prefer advisors to come to you.",
  },
]

export default function HowItWorksPage() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Finding the right advisor,{" "}
            <span className="text-primary">made simple</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Advyser takes the stress out of finding a financial advisor. Tell us what you need, and we&apos;ll connect you with qualified professionals who can help.
          </p>
          <Button size="lg" className="rounded-full px-8" asChild>
            <Link href="/request-intro">
              Get Started
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How it works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to find your perfect financial advisor
            </p>
          </div>

          <div className="space-y-12 lg:space-y-16">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`flex flex-col lg:flex-row gap-8 lg:gap-16 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Visual */}
                <div className="lg:w-1/2">
                  <div className="relative">
                    <div className="bg-gray-50 rounded-2xl p-8 lg:p-12">
                      <div className="flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                          {step.icon}
                        </div>
                      </div>
                    </div>
                    {/* Step Number Badge */}
                    <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full border-2 border-gray-200 bg-white text-gray-900 flex items-center justify-center text-xl font-bold shadow-lg">
                      {step.number}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:w-1/2">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-2xl font-bold text-foreground">
                      {step.title}
                    </h3>
                    <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-600 rounded-full">
                      {step.subtitle}
                    </span>
                  </div>
                  <p className="text-lg text-muted-foreground mb-6">
                    {step.description}
                  </p>
                  <ul className="space-y-3">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="size-5 text-primary mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why use Advyser?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We make finding the right advisor easier, faster, and more reliable
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="border-0 shadow-none bg-card">
                <CardContent className="p-6 flex gap-4">
                  <div className="flex items-center justify-center size-14 rounded-xl bg-gray-100 text-gray-600 shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What our users say
            </h2>
            <p className="text-lg text-muted-foreground">
              Real experiences from people who found their advisor through Advyser
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name}>
                <CardContent className="p-6">
                  <Quote className="size-8 text-primary/20 mb-4" />
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}, {testimonial.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center size-16 rounded-full bg-gray-100 text-gray-600 mx-auto mb-6">
              <HelpCircle className="size-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently asked questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about using Advyser
            </p>
          </div>

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

      {/* Final CTA */}
      <section className="py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to find your advisor?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            It only takes 2 minutes to get started. Tell us what you need, and we&apos;ll find advisors who can help.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="xl" className="rounded-full px-8" asChild>
              <Link href="/request-intro">
                Request an Introduction
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" className="rounded-full px-8" asChild>
              <Link href="/search">
                Browse Advisors
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-primary" />
              <span className="text-sm">100% free</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-primary" />
              <span className="text-sm">No obligation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-primary" />
              <span className="text-sm">Response within 24 hours</span>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
