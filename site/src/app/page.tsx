"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  TrendingUp,
  PiggyBank,
  Shield,
  Home,
  Briefcase,
  Heart,
  ArrowRight,
  CheckCircle2,
  Star,
  Quote,
} from "lucide-react"

import { PublicLayout } from "@/components/layouts/public-layout"

/**
 * Icon Optical Sizing Guide:
 * --------------------------
 * - Category icons (TrendingUp, PiggyBank, etc.): size-6 (24px) for tile context
 * - Inline check icons (CheckCircle2): size-[18px] for optical parity with text
 * - Star icons (filled): size-4 (16px) baseline
 * - Decorative icons (Quote): size-8 (32px) for visual emphasis
 * - Button icons (ArrowRight): size-4 (16px) standard
 */
import { Button } from "@/components/ui/button"
import { HeroSearchBar } from "@/components/composite/hero-search-bar"
import { TrustStrip } from "@/components/composite/trust-strip"
import { CategoryTile } from "@/components/composite/category-tile"
import { SavingsCalculator } from "@/components/composite/savings-calculator"
import { TransparencyBlock } from "@/components/composite/transparency-block"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback, getInitials } from "@/components/ui/avatar"

// Mock data for categories
const categories = [
  {
    icon: <TrendingUp className="size-6" />,
    name: "Retirement Planning",
    description: "Plan for your future with expert guidance on superannuation, pensions, and retirement income strategies.",
    advisorCount: 428,
    href: "/category/retirement-planning",
  },
  {
    icon: <PiggyBank className="size-6" />,
    name: "Wealth Management",
    description: "Grow and protect your wealth with personalized investment strategies and portfolio management.",
    advisorCount: 356,
    href: "/category/wealth-management",
  },
  {
    icon: <Shield className="size-6" />,
    name: "Insurance & Risk",
    description: "Protect what matters most with life insurance, income protection, and risk management advice.",
    advisorCount: 289,
    href: "/category/insurance-risk",
  },
  {
    icon: <Home className="size-6" />,
    name: "Property Investment",
    description: "Navigate property markets with expert advice on purchasing, financing, and building equity.",
    advisorCount: 234,
    href: "/category/property-investment",
  },
  {
    icon: <Briefcase className="size-6" />,
    name: "Tax Planning",
    description: "Optimize your tax position with strategic planning and compliance support from registered advisors.",
    advisorCount: 312,
    href: "/category/tax-planning",
  },
  {
    icon: <Heart className="size-6" />,
    name: "Estate Planning",
    description: "Secure your legacy with comprehensive estate planning, wills, and intergenerational wealth transfer.",
    advisorCount: 178,
    href: "/category/estate-planning",
  },
]

// V.1.1.6: Testimonials with specific outcomes (not generic quotes)
const testimonials = [
  {
    id: "1",
    name: "Sarah Mitchell",
    role: "Small Business Owner",
    avatar: null,
    quote: "My advisor restructured my super strategy and found $4,200/year in tax savings I was missing. Within 6 months, my retirement projection increased by $180,000.",
    rating: 5,
    location: "Sydney, NSW",
    outcome: "$4,200/yr saved",
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "IT Professional",
    avatar: null,
    quote: "I was paying 1.8% in hidden fund fees. My new advisor moved me to a portfolio that performs better and costs 0.4%. That's an extra $12,000 over the next decade.",
    rating: 5,
    location: "Melbourne, VIC",
    outcome: "$12,000 saved",
  },
  {
    id: "3",
    name: "Emma Thompson",
    role: "Healthcare Worker",
    avatar: null,
    quote: "I thought I was 15 years from retirement. My advisor showed me how salary sacrifice and debt restructuring could get me there in 10. Life-changing advice.",
    rating: 5,
    location: "Brisbane, QLD",
    outcome: "5 years earlier",
  },
]

// V.1.2.6: How it works steps with specifics
const howItWorksSteps = [
  {
    number: 1,
    title: "Answer 5 quick questions",
    description: "Tell us your goals, budget, and preferences. Takes under 2 minutes — no account required.",
  },
  {
    number: 2,
    title: "Review 3 matched advisors",
    description: "We'll show you up to 3 ASIC-verified advisors who specialise in your exact needs, with ratings and fees upfront.",
  },
  {
    number: 3,
    title: "Book a free consultation",
    description: "Choose your advisor and schedule a no-obligation call. 94% of users book within 48 hours.",
  },
]

function TestimonialCard({
  name,
  role,
  avatar,
  quote,
  rating,
  location,
  outcome,
}: {
  name: string
  role: string
  avatar: string | null
  quote: string
  rating: number
  location: string
  outcome?: string
}) {
  return (
    <Card className="h-full">
      <CardContent className="p-6 flex flex-col h-full">
        {/* V.1.1.6: Outcome Badge */}
        {outcome && (
          <div className="inline-flex self-start items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-4">
            <CheckCircle2 className="size-3.5" />
            {outcome}
          </div>
        )}

        {/* Quote Icon */}
        <Quote className="size-8 text-primary/20 mb-4" />

        {/* Quote Text */}
        <p className="text-muted-foreground flex-1 mb-6 leading-relaxed">
          &quot;{quote}&quot;
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
          ))}
        </div>

        {/* Author */}
        <div className="flex items-center gap-3">
          <Avatar>
            {avatar && <AvatarImage src={avatar} alt={name} />}
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{name}</p>
            <p className="text-sm text-muted-foreground">{role}, {location}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function HomePage() {
  const router = useRouter()

  const handleSearch = (query: { category?: string; location?: string; keyword?: string }) => {
    const params = new URLSearchParams()
    if (query.category) params.set("category", query.category)
    if (query.location) params.set("location", query.location)
    if (query.keyword) params.set("q", query.keyword)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-[1.08] tracking-[-0.02em]">
              Find the right financial advisor for{" "}
              <span className="text-foreground font-semibold">your goals</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Connect with qualified, ASIC-registered financial advisors who specialize in what you need.
              Free to search, free to compare.
            </p>
          </div>

          {/* Hero Search Bar */}
          <HeroSearchBar
            onSearch={handleSearch}
            categories={[
              { value: "retirement-planning", label: "Retirement Planning" },
              { value: "wealth-management", label: "Wealth Management" },
              { value: "insurance-risk", label: "Insurance & Risk" },
              { value: "property-investment", label: "Property Investment" },
              { value: "tax-planning", label: "Tax Planning" },
              { value: "estate-planning", label: "Estate Planning" },
            ]}
          />

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <span className="text-sm text-muted-foreground">Popular:</span>
            {["Retirement Planning", "Wealth Management", "Tax Planning"].map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="text-sm text-foreground font-medium hover:underline"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Savings Calculator Section */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Are you paying too much for financial advice?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-lg">
                Many Australians overpay for advisory services. Use our calculator to see
                how much you could save by finding a better-priced advisor.
              </p>
              {/* CheckCircle2 uses 18px for optical parity with text (stroke+fill hybrid icon) */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-[18px] text-primary" />
                  <span>No obligation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-[18px] text-primary" />
                  <span>Takes 30 seconds</span>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full max-w-lg">
              <SavingsCalculator onCTAClick={() => router.push('/search')} />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Find an advisor by specialty
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whatever your financial goals, we have advisors ready to help you achieve them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <CategoryTile
                key={category.name}
                icon={category.icon}
                name={category.name}
                description={category.description}
                advisorCount={category.advisorCount}
                href={category.href}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <Button variant="outline" size="lg" asChild>
              <Link href="/search">
                View all categories
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How Advyser works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get connected with the right advisor in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {howItWorksSteps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connector Line (hidden on mobile) */}
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border" />
                )}

                <div className="relative flex flex-col items-center text-center">
                  {/* Step Number */}
                  <div className="w-16 h-16 rounded-full border-2 border-gray-200 text-gray-900 bg-white flex items-center justify-center text-2xl font-bold mb-6 relative z-10">
                    {step.number}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link href="/search">
                Find an Advisor
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* V.1.1.2: Trust Strip moved below How It Works - earn trust after explaining value */}
      <TrustStrip
        advisorCount={2500}
        clientCount={75000}
        showSecurityBadges={true}
        showPartnerLogos={true}
      />

      {/* Testimonials Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What our clients say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Thousands of Australians have found their perfect financial advisor through Advyser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                name={testimonial.name}
                role={testimonial.role}
                avatar={testimonial.avatar}
                quote={testimonial.quote}
                rating={testimonial.rating}
                location={testimonial.location}
                outcome={testimonial.outcome}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Transparency Block */}
      <TransparencyBlock />

      {/* Final CTA Section */}
      <section className="py-24 lg:py-32 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to take control of your financial future?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join over 75,000 Australians who have found their perfect financial advisor through Advyser. It&apos;s free to search and compare.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="xl"
              className="bg-white text-gray-900 hover:bg-white/90 rounded-full px-8"
              asChild
            >
              <Link href="/search">
                Find an Advisor
              </Link>
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="border-white text-white hover:bg-white/10 rounded-full px-8"
              asChild
            >
              <Link href="/how-it-works">
                Learn How It Works
              </Link>
            </Button>
          </div>

          {/* Trust Points - CheckCircle2 at 20px for larger text context */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5" />
              <span className="text-sm">100% free for consumers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5" />
              <span className="text-sm">ASIC-registered advisors</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5" />
              <span className="text-sm">No obligations</span>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
