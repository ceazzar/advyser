"use client"

import { use } from "react"
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
  Filter,
  MapPin,
  Star,
  BadgeCheck,
  ChevronRight,
} from "lucide-react"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { AdvisorCard } from "@/components/composite/advisor-card"
import { TrustStrip } from "@/components/composite/trust-strip"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Category metadata
const categoryData: Record<string, {
  title: string
  description: string
  longDescription: string
  icon: React.ReactNode
  keywords: string[]
  faqs: { question: string; answer: string }[]
}> = {
  "retirement-planning": {
    title: "Retirement Planning",
    description: "Expert advisors to help you plan for a comfortable retirement",
    longDescription: "Our retirement planning advisors specialize in helping Australians build, protect, and transition their wealth for retirement. From superannuation optimization to pension strategies, find the right expert for your retirement journey.",
    icon: <TrendingUp className="size-8" />,
    keywords: ["Superannuation", "Pension", "SMSF", "Retirement Income", "Age Pension"],
    faqs: [
      {
        question: "When should I start planning for retirement?",
        answer: "It's never too early to start. Even in your 20s, small contributions and smart strategies can significantly impact your retirement savings thanks to compound growth."
      },
      {
        question: "What's the difference between an SMSF and a regular super fund?",
        answer: "A Self-Managed Super Fund (SMSF) gives you direct control over your investment choices, but comes with more responsibility and compliance requirements. It's typically suited for those with larger balances."
      },
      {
        question: "How much do I need to retire comfortably?",
        answer: "The ASFA Retirement Standard suggests couples need around $640,000 and singles around $545,000 for a comfortable retirement, but your needs may vary based on lifestyle goals."
      },
    ],
  },
  "wealth-management": {
    title: "Wealth Management",
    description: "Grow and protect your wealth with expert investment strategies",
    longDescription: "Connect with wealth management advisors who can help you build a diversified investment portfolio, optimize your asset allocation, and work toward your long-term financial goals.",
    icon: <PiggyBank className="size-8" />,
    keywords: ["Investment", "Portfolio Management", "Asset Allocation", "Shares", "ETFs"],
    faqs: [
      {
        question: "What's the minimum investment to work with a wealth manager?",
        answer: "Many advisors work with clients starting from $50,000 in investable assets, though some specialize in higher net worth clients. Use our filters to find advisors matching your situation."
      },
      {
        question: "How are wealth managers different from financial planners?",
        answer: "Wealth managers typically focus more on investment management and portfolio construction, while financial planners take a broader view including insurance, estate planning, and cash flow."
      },
      {
        question: "What fees should I expect?",
        answer: "Fee structures vary. Common models include percentage of assets under management (typically 0.5-1.5%), flat fees, or hourly rates. Always ask for a clear fee disclosure."
      },
    ],
  },
  "insurance-risk": {
    title: "Insurance & Risk",
    description: "Protect what matters most with comprehensive risk advice",
    longDescription: "Our insurance advisors help you understand and manage life's uncertainties. From life insurance to income protection, get personalized advice on the coverage you need.",
    icon: <Shield className="size-8" />,
    keywords: ["Life Insurance", "Income Protection", "TPD", "Trauma Cover", "Health Insurance"],
    faqs: [
      {
        question: "What types of insurance should I consider?",
        answer: "Key covers include life insurance, total and permanent disability (TPD), income protection, and trauma/critical illness cover. Your needs depend on your circumstances."
      },
      {
        question: "Is insurance through super enough?",
        answer: "Super insurance can be cost-effective but often provides basic cover. A risk advisor can assess whether you need additional cover outside super."
      },
      {
        question: "How much life insurance do I need?",
        answer: "A common rule is 10-15 times your annual income, but the right amount depends on your debts, dependents, and lifestyle needs. An advisor can calculate your specific needs."
      },
    ],
  },
  "property-investment": {
    title: "Property Investment",
    description: "Navigate property markets with expert guidance",
    longDescription: "Find advisors who specialize in property investment strategies, from buying your first investment property to building a portfolio. Get guidance on financing, structuring, and tax optimization.",
    icon: <Home className="size-8" />,
    keywords: ["Property", "Real Estate", "Mortgage", "Negative Gearing", "Capital Growth"],
    faqs: [
      {
        question: "Is property still a good investment?",
        answer: "Property can be part of a diversified portfolio, but it's not right for everyone. An advisor can help assess if property suits your goals, timeline, and risk tolerance."
      },
      {
        question: "How much deposit do I need for an investment property?",
        answer: "Typically 10-20% for investment properties, plus costs. Some lenders offer lower deposits but may charge lenders mortgage insurance (LMI)."
      },
      {
        question: "What are the tax benefits of property investment?",
        answer: "Benefits include negative gearing (deducting losses against income), depreciation claims, and potential capital gains tax discounts. An advisor can explain what applies to you."
      },
    ],
  },
  "tax-planning": {
    title: "Tax Planning",
    description: "Optimize your tax position with strategic advice",
    longDescription: "Work with tax planning specialists who can help you legally minimize tax, structure your affairs efficiently, and ensure compliance while maximizing your wealth.",
    icon: <Briefcase className="size-8" />,
    keywords: ["Tax Minimization", "Tax Structures", "CGT", "Trusts", "Deductions"],
    faqs: [
      {
        question: "What's the difference between tax avoidance and tax evasion?",
        answer: "Tax avoidance is legally minimizing tax through legitimate strategies. Tax evasion is illegal. Our advisors only recommend compliant strategies."
      },
      {
        question: "When should I set up a trust?",
        answer: "Trusts can offer asset protection and tax benefits, but involve costs and complexity. They're typically considered when building significant wealth or a business."
      },
      {
        question: "Can a financial advisor help with my tax return?",
        answer: "Financial advisors provide tax planning strategies but typically don't lodge tax returns. They often work alongside your accountant for optimal outcomes."
      },
    ],
  },
  "estate-planning": {
    title: "Estate Planning",
    description: "Secure your legacy and protect your family's future",
    longDescription: "Plan for the future with advisors who specialize in wills, powers of attorney, and intergenerational wealth transfer. Ensure your wishes are carried out and your loved ones are protected.",
    icon: <Heart className="size-8" />,
    keywords: ["Wills", "Power of Attorney", "Succession", "Inheritance", "Family Trusts"],
    faqs: [
      {
        question: "Do I need an estate plan if I'm young?",
        answer: "Yes, if you have any assets or dependents. Even young adults should have a basic will and powers of attorney in case of unexpected events."
      },
      {
        question: "What happens if I die without a will?",
        answer: "Your estate is distributed according to intestacy laws, which may not reflect your wishes. The process is also more complex and expensive for your family."
      },
      {
        question: "How often should I update my estate plan?",
        answer: "Review it every 3-5 years or after major life events like marriage, divorce, having children, or significant changes in assets."
      },
    ],
  },
}

// Mock advisors for each category
const mockAdvisors = [
  {
    id: "1",
    name: "Sarah Chen",
    credentials: "CFP, AFP",
    specialties: ["Retirement Planning", "SMSF", "Superannuation"],
    rating: 4.9,
    reviewCount: 127,
    location: "Sydney, NSW",
    bio: "With over 15 years of experience in retirement planning, I help Australians create personalized strategies to achieve their retirement dreams. Specializing in SMSF administration and transition to retirement.",
    verified: true,
  },
  {
    id: "2",
    name: "James Wilson",
    credentials: "CFP",
    specialties: ["Retirement Planning", "Pension Strategies", "Age Pension"],
    rating: 4.8,
    reviewCount: 89,
    location: "Melbourne, VIC",
    bio: "I'm passionate about helping pre-retirees and retirees maximize their retirement income. I take a holistic approach that considers Centrelink benefits, tax efficiency, and lifestyle goals.",
    verified: true,
  },
  {
    id: "3",
    name: "Michelle Patel",
    credentials: "AFP, SSA",
    specialties: ["Retirement Planning", "SMSF", "Investment Strategy"],
    rating: 4.7,
    reviewCount: 64,
    location: "Brisbane, QLD",
    bio: "Specialist in self-managed super funds and retirement income strategies. I help clients take control of their super and build the retirement they deserve.",
    verified: false,
  },
  {
    id: "4",
    name: "David Thompson",
    credentials: "CFP, CPA",
    specialties: ["Retirement Planning", "Tax Planning", "Estate Planning"],
    rating: 4.9,
    reviewCount: 156,
    location: "Perth, WA",
    bio: "Combining financial planning expertise with accounting knowledge to deliver comprehensive retirement strategies. Focus on tax-effective income structures.",
    verified: true,
  },
  {
    id: "5",
    name: "Lisa Nguyen",
    credentials: "CFP",
    specialties: ["Retirement Planning", "Superannuation", "Insurance"],
    rating: 4.6,
    reviewCount: 42,
    location: "Adelaide, SA",
    bio: "Helping Australians prepare for retirement with personalized advice on super contributions, investment selection, and ensuring adequate insurance coverage.",
    verified: true,
  },
  {
    id: "6",
    name: "Robert Mitchell",
    credentials: "AFP",
    specialties: ["Retirement Planning", "Pension Strategies", "Centrelink"],
    rating: 4.8,
    reviewCount: 98,
    location: "Gold Coast, QLD",
    bio: "Centrelink and Age Pension specialist. I help retirees navigate the complex rules to maximize their entitlements while maintaining their lifestyle.",
    verified: false,
  },
]

export default function CategoryPage({
  params,
}: {
  params: Promise<{ type: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const category = categoryData[resolvedParams.type]

  // Fallback for unknown categories
  if (!category) {
    return (
      <PublicLayout>
        <div className="py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The category you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </PublicLayout>
    )
  }

  const handleViewProfile = (advisorId: string) => {
    router.push(`/advisors/${advisorId}`)
  }

  return (
    <PublicLayout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="size-4 text-muted-foreground" />
            <Link href="/search" className="text-muted-foreground hover:text-foreground">
              Find an Advisor
            </Link>
            <ChevronRight className="size-4 text-muted-foreground" />
            <span className="text-foreground font-medium">{category.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Icon */}
            <div className="flex items-center justify-center size-20 rounded-2xl bg-primary/10 text-primary shrink-0">
              {category.icon}
            </div>

            {/* Content */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                {category.title} Advisors
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mb-6">
                {category.longDescription}
              </p>

              {/* Keywords */}
              <div className="flex flex-wrap gap-2">
                {category.keywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    className="bg-primary/10 text-primary border-primary/20 px-3 py-1"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <TrustStrip
        advisorCount={mockAdvisors.length * 70}
        clientCount={mockAdvisors.length * 1500}
        showSecurityBadges={true}
        showPartnerLogos={false}
      />

      {/* Main Content */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-72 shrink-0">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Filter className="size-5 text-primary" />
                    <h2 className="font-semibold">Filter Results</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Location Filter */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Location
                      </label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <MapPin className="size-4 mr-2 text-muted-foreground" />
                          <SelectValue placeholder="All Locations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          <SelectItem value="nsw">New South Wales</SelectItem>
                          <SelectItem value="vic">Victoria</SelectItem>
                          <SelectItem value="qld">Queensland</SelectItem>
                          <SelectItem value="wa">Western Australia</SelectItem>
                          <SelectItem value="sa">South Australia</SelectItem>
                          <SelectItem value="tas">Tasmania</SelectItem>
                          <SelectItem value="act">ACT</SelectItem>
                          <SelectItem value="nt">Northern Territory</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Rating Filter */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Minimum Rating
                      </label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <Star className="size-4 mr-2 text-muted-foreground" />
                          <SelectValue placeholder="Any Rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any Rating</SelectItem>
                          <SelectItem value="4.5">4.5+ Stars</SelectItem>
                          <SelectItem value="4.0">4.0+ Stars</SelectItem>
                          <SelectItem value="3.5">3.5+ Stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Verified Only */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Verification
                      </label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <BadgeCheck className="size-4 mr-2 text-muted-foreground" />
                          <SelectValue placeholder="All Advisors" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Advisors</SelectItem>
                          <SelectItem value="verified">Verified Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Apply Filters */}
                    <Button className="w-full">Apply Filters</Button>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Advisor List */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{mockAdvisors.length}</span> {category.title.toLowerCase()} advisors
                </p>
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Most Relevant</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Advisor Cards */}
              <div className="space-y-4">
                {mockAdvisors.map((advisor) => (
                  <AdvisorCard
                    key={advisor.id}
                    id={advisor.id}
                    name={advisor.name}
                    credentials={advisor.credentials}
                    specialties={advisor.specialties}
                    rating={advisor.rating}
                    reviewCount={advisor.reviewCount}
                    location={advisor.location}
                    bio={advisor.bio}
                    verified={advisor.verified}
                    onViewProfile={handleViewProfile}
                  />
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Advisors
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {category.faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to find your {category.title.toLowerCase()} advisor?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Tell us about your goals and we&apos;ll match you with advisors who specialize in exactly what you need.
          </p>
          <Button size="lg" className="rounded-full px-8" asChild>
            <Link href="/request-intro">
              Request an Introduction
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  )
}
