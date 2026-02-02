"use client"

import Link from "next/link"
import {
  Users,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle2,
  ArrowRight,
  Star,
  Zap,
  Target,
  BarChart3,
  Calendar,
  MessageSquare,
  Quote,
  Sparkles,
  BadgeCheck,
  Building2,
} from "lucide-react"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, getInitials } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Stats
const stats = [
  { value: "75,000+", label: "Consumers helped" },
  { value: "2,500+", label: "Verified advisors" },
  { value: "92%", label: "Client satisfaction" },
  { value: "24hr", label: "Average response time" },
]

// Benefits for advisors
const benefits = [
  {
    icon: <Users className="size-6" />,
    title: "Qualified Leads",
    description: "Connect with consumers actively seeking financial advice. No cold calling - these are people ready to talk.",
  },
  {
    icon: <Target className="size-6" />,
    title: "Targeted Matching",
    description: "Only receive leads that match your specialties and client preferences. Focus on clients you can truly help.",
  },
  {
    icon: <Shield className="size-6" />,
    title: "Build Trust & Credibility",
    description: "Verified profiles with reviews help you stand out. Let your reputation and expertise speak for themselves.",
  },
  {
    icon: <TrendingUp className="size-6" />,
    title: "Grow Your Practice",
    description: "Scale your client acquisition without scaling your marketing spend. Predictable cost, measurable results.",
  },
  {
    icon: <Clock className="size-6" />,
    title: "Save Time",
    description: "No more networking events or expensive advertising. We bring pre-qualified prospects directly to you.",
  },
  {
    icon: <BarChart3 className="size-6" />,
    title: "Track Performance",
    description: "Dashboard analytics show your profile views, inquiry rates, and conversion metrics. Know what's working.",
  },
]

// Features
const features = [
  {
    icon: <BadgeCheck className="size-5" />,
    title: "Verified Profile",
    description: "Stand out with a verified badge showing your ASIC registration and credentials.",
  },
  {
    icon: <Star className="size-5" />,
    title: "Client Reviews",
    description: "Collect and display authentic client testimonials to build social proof.",
  },
  {
    icon: <Calendar className="size-5" />,
    title: "Calendar Integration",
    description: "Let prospects book consultations directly through your calendar.",
  },
  {
    icon: <MessageSquare className="size-5" />,
    title: "Secure Messaging",
    description: "Communicate with prospects through our compliant messaging system.",
  },
  {
    icon: <Zap className="size-5" />,
    title: "Instant Notifications",
    description: "Get notified immediately when a matched consumer wants to connect.",
  },
  {
    icon: <Building2 className="size-5" />,
    title: "Practice Branding",
    description: "Showcase your practice, team, and services with a comprehensive profile.",
  },
]

// Pricing tiers
const pricingTiers = [
  {
    name: "Starter",
    price: "$149",
    period: "/month",
    description: "Perfect for solo practitioners just getting started",
    features: [
      "Verified advisor profile",
      "Up to 10 leads per month",
      "Client review collection",
      "Basic analytics",
      "Email support",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$299",
    period: "/month",
    description: "For established advisors looking to grow",
    features: [
      "Everything in Starter, plus:",
      "Unlimited leads",
      "Priority matching",
      "Calendar booking integration",
      "Advanced analytics",
      "Phone support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For practices with multiple advisors",
    features: [
      "Everything in Professional, plus:",
      "Multiple advisor profiles",
      "Practice branding",
      "API integrations",
      "Dedicated account manager",
      "Custom reporting",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
]

// Testimonials from advisors
const testimonials = [
  {
    name: "Michael Stevens",
    credentials: "CFP, AFP",
    practice: "Stevens Financial Planning",
    location: "Sydney, NSW",
    quote: "Advyser has transformed how I grow my practice. The leads are high quality - people who actually need advice and are ready to engage. My conversion rate is over 40%.",
    avatar: null,
  },
  {
    name: "Jennifer Walsh",
    credentials: "CFP",
    practice: "Walsh Wealth Advisory",
    location: "Melbourne, VIC",
    quote: "I used to spend thousands on Google ads with mixed results. Advyser delivers better quality leads at a fraction of the cost. The matching is excellent.",
    avatar: null,
  },
  {
    name: "David Chen",
    credentials: "CFP, SSA",
    practice: "Prosperity SMSF",
    location: "Brisbane, QLD",
    quote: "As an SMSF specialist, I need clients with specific needs. Advyser's targeting means I only hear from people who actually need SMSF expertise. Game changer.",
    avatar: null,
  },
]

// FAQs for advisors
const faqs = [
  {
    question: "How does the matching process work?",
    answer: "Consumers submit their requirements through our platform, including the type of advice they need, their location, and financial situation. Our algorithm matches them with advisors who specialize in their specific needs. You'll only receive leads that align with your expertise and preferences.",
  },
  {
    question: "What are the eligibility requirements?",
    answer: "You must be registered on ASIC's Financial Advisers Register, hold appropriate professional indemnity insurance, and be in good standing with your licensee. We verify all credentials before activating profiles.",
  },
  {
    question: "Is there a lock-in contract?",
    answer: "No. All our plans are month-to-month with no long-term commitment. You can upgrade, downgrade, or cancel at any time. We believe in earning your business every month.",
  },
  {
    question: "How do client reviews work?",
    answer: "After you complete work with a client you met through Advyser, we send them a review request. Reviews are verified to ensure authenticity. You can respond to reviews and showcase them on your profile.",
  },
  {
    question: "Can I control which leads I receive?",
    answer: "Yes. You set your preferences including specialties, minimum investable assets, geographic area, and availability. You'll only be matched with consumers who meet your criteria.",
  },
  {
    question: "What's the average lead quality?",
    answer: "Our leads are consumers who have actively sought out financial advice - not cold contacts. On average, advisors report a 30-40% conversion rate from initial inquiry to paid engagement.",
  },
  {
    question: "Do you offer a free trial?",
    answer: "Yes! All plans include a 14-day free trial so you can experience the platform risk-free. No credit card required to start.",
  },
  {
    question: "How do I get started?",
    answer: "Click 'Join as an Advisor' to create your profile. We'll verify your credentials (usually within 24-48 hours), and then your profile goes live. Most advisors receive their first leads within the first week.",
  },
]

export default function ForAdvisorsPage() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <Badge className="bg-gray-100 text-gray-600 border-gray-200 mb-6">
                <Sparkles className="size-3 mr-1" />
                For Financial Advisors
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Grow your practice with{" "}
                <span className="text-primary">qualified leads</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Connect with Australians actively seeking financial advice. No cold calling, no expensive advertising - just pre-qualified prospects ready to engage.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="xl" className="rounded-full px-8" asChild>
                  <Link href="/signup?type=advisor">
                    Join as an Advisor
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline" className="rounded-full px-8" asChild>
                  <Link href="#pricing">
                    View Pricing
                  </Link>
                </Button>
              </div>

              {/* Trust Points */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" />
                  14-day free trial
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" />
                  No lock-in contract
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" />
                  Cancel anytime
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="lg:pl-8">
              <Card className="bg-gray-900 text-white">
                <CardContent className="p-8">
                  <div className="grid grid-cols-2 gap-6">
                    {stats.map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div className="text-3xl md:text-4xl font-bold mb-1">
                          {stat.value}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why advisors choose Advyser
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We help you focus on what you do best - providing great advice
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="border-0 shadow-none bg-muted/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center size-14 rounded-xl bg-gray-100 text-gray-600 mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Everything you need to attract and convert clients
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our platform gives you all the tools to showcase your expertise and connect with the right clients.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {features.map((feature) => (
                  <div key={feature.title} className="flex gap-3">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-gray-100 text-gray-600 shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="lg:pl-8">
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-br from-gray-100 to-gray-50 p-8">
                  <div className="bg-card rounded-lg shadow-lg p-6">
                    {/* Mock Profile Preview */}
                    <div className="flex items-start gap-4 mb-6">
                      <Avatar size="lg">
                        <AvatarFallback size="lg">JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">John Davidson</h3>
                          <BadgeCheck className="size-5 fill-primary text-white" />
                        </div>
                        <p className="text-sm text-muted-foreground">CFP, AFP - Sydney, NSW</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="text-sm text-muted-foreground ml-1">4.9 (87 reviews)</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-3 bg-muted rounded w-4/5" />
                      <div className="h-3 bg-muted rounded w-3/5" />
                    </div>
                    <div className="flex gap-2 mt-6">
                      <Badge className="bg-gray-100 text-gray-700">Retirement</Badge>
                      <Badge className="bg-gray-100 text-gray-700">SMSF</Badge>
                      <Badge className="bg-gray-100 text-gray-700">Wealth</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by leading advisors
            </h2>
            <p className="text-lg text-muted-foreground">
              Hear from advisors who are growing their practices with Advyser
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
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.credentials}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.practice}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              No hidden fees, no per-lead costs. Choose the plan that fits your practice.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.name}
                className={tier.highlighted ? "border-primary shadow-lg relative" : ""}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                    <span className="text-muted-foreground">{tier.period}</span>
                  </div>
                  <CardDescription className="mt-2">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="size-5 text-primary mt-0.5 shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${tier.highlighted ? "" : "variant-outline"}`}
                    variant={tier.highlighted ? "default" : "outline"}
                    asChild
                  >
                    <Link href={tier.name === "Enterprise" ? "/contact" : "/signup?type=advisor"}>
                      {tier.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently asked questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about joining Advyser
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
      <section className="py-24 lg:py-32 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to grow your practice?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join over 2,500 advisors who are attracting new clients through Advyser. Start your free trial today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="xl"
              className="bg-primary text-white hover:bg-primary/90 rounded-full px-8"
              asChild
            >
              <Link href="/signup?type=advisor">
                Start Free Trial
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="border-white text-white hover:bg-white/10 rounded-full px-8"
              asChild
            >
              <Link href="/contact">
                Talk to Sales
              </Link>
            </Button>
          </div>

          <p className="text-gray-400 text-sm mt-6">
            No credit card required. Setup takes less than 10 minutes.
          </p>
        </div>
      </section>
    </PublicLayout>
  )
}
