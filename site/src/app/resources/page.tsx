"use client"

import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Calculator,
  ChevronRight,
  Clock,
  FileText,
  Heart,
  Home,
  PiggyBank,
  Search,
  Shield,
  TrendingUp,
  Video,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription,CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { publicBusiness } from "@/lib/public-business"

// Resource types
type ResourceType = "article" | "guide" | "calculator" | "video"

interface Resource {
  id: string
  title: string
  description: string
  type: ResourceType
  category: string
  readTime?: string
  featured?: boolean
  image?: string
  href: string
}

// Category icons
const categoryIcons: Record<string, React.ReactNode> = {
  "retirement": <TrendingUp className="size-5" />,
  "investing": <PiggyBank className="size-5" />,
  "insurance": <Shield className="size-5" />,
  "property": <Home className="size-5" />,
  "tax": <Briefcase className="size-5" />,
  "estate": <Heart className="size-5" />,
}

// Type icons
const typeIcons: Record<ResourceType, React.ReactNode> = {
  article: <FileText className="size-4" />,
  guide: <BookOpen className="size-4" />,
  calculator: <Calculator className="size-4" />,
  video: <Video className="size-4" />,
}

// Mock resources data
const resources: Resource[] = [
  {
    id: "1",
    title: "The Complete Guide to Australian Retirement Planning",
    description: "Everything you need to know about planning for retirement in Australia, from superannuation strategies to age pension eligibility.",
    type: "guide",
    category: "retirement",
    readTime: "15 min read",
    featured: true,
    href: "/contact",
  },
  {
    id: "2",
    title: "How Much Super Do You Need to Retire?",
    description: "Use our calculator to estimate how much superannuation you'll need for a comfortable retirement based on your lifestyle goals.",
    type: "calculator",
    category: "retirement",
    featured: true,
    href: "/contact",
  },
  {
    id: "3",
    title: "Understanding Investment Risk: A Beginner's Guide",
    description: "Learn about different types of investment risk and how to build a portfolio that matches your risk tolerance.",
    type: "article",
    category: "investing",
    readTime: "8 min read",
    href: "/contact",
  },
  {
    id: "4",
    title: "Life Insurance 101: What Cover Do You Actually Need?",
    description: "A comprehensive breakdown of life insurance, TPD, trauma, and income protection - and how to figure out what's right for you.",
    type: "guide",
    category: "insurance",
    readTime: "12 min read",
    featured: true,
    href: "/contact",
  },
  {
    id: "5",
    title: "First Home Buyer's Guide to Property Investment",
    description: "Should you buy your own home first or jump straight into investment property? We break down the pros and cons.",
    type: "article",
    category: "property",
    readTime: "10 min read",
    href: "/contact",
  },
  {
    id: "6",
    title: "Tax Deductions You Might Be Missing",
    description: "Common tax deductions that Australians often overlook, and how to make sure you're claiming everything you're entitled to.",
    type: "article",
    category: "tax",
    readTime: "6 min read",
    href: "/contact",
  },
  {
    id: "7",
    title: "Estate Planning Checklist",
    description: "A step-by-step checklist to ensure your estate plan covers all the essentials, from wills to superannuation nominations.",
    type: "guide",
    category: "estate",
    readTime: "8 min read",
    href: "/contact",
  },
  {
    id: "8",
    title: "Investment Portfolio Calculator",
    description: "See how different asset allocations could affect your long-term returns based on historical data.",
    type: "calculator",
    category: "investing",
    href: "/contact",
  },
  {
    id: "9",
    title: "SMSF vs Retail Super: Which Is Right for You?",
    description: "Self-managed super funds offer control but come with responsibilities. We compare the options so you can make an informed choice.",
    type: "article",
    category: "retirement",
    readTime: "9 min read",
    href: "/contact",
  },
  {
    id: "10",
    title: "Negative Gearing Explained",
    description: "What is negative gearing, how does it work, and is it still a good strategy? A plain-English explanation.",
    type: "article",
    category: "property",
    readTime: "7 min read",
    href: "/contact",
  },
  {
    id: "11",
    title: "How to Choose a Financial Advisor",
    description: "Tips for finding and evaluating financial advisors, including what questions to ask and red flags to watch for.",
    type: "guide",
    category: "investing",
    readTime: "10 min read",
    href: "/contact",
  },
  {
    id: "12",
    title: "Income Protection Insurance Calculator",
    description: "Calculate how much income protection cover you need based on your income, expenses, and existing coverage.",
    type: "calculator",
    category: "insurance",
    href: "/contact",
  },
]

// Categories for filtering
const categories = [
  { value: "all", label: "All Topics" },
  { value: "retirement", label: "Retirement", icon: <TrendingUp className="size-4" /> },
  { value: "investing", label: "Investing", icon: <PiggyBank className="size-4" /> },
  { value: "insurance", label: "Insurance", icon: <Shield className="size-4" /> },
  { value: "property", label: "Property", icon: <Home className="size-4" /> },
  { value: "tax", label: "Tax", icon: <Briefcase className="size-4" /> },
  { value: "estate", label: "Estate", icon: <Heart className="size-4" /> },
]

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Link href={resource.href}>
      <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all group">
        <CardContent className="p-6 flex flex-col h-full">
          {/* Type & Category */}
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
              {typeIcons[resource.type]}
              {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
            </Badge>
            {resource.readTime && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="size-3" />
                {resource.readTime}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {resource.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground flex-1 line-clamp-3 mb-4">
            {resource.description}
          </p>

          {/* Read More */}
          <div className="flex items-center text-sm font-medium text-primary">
            {resource.type === "calculator" ? "Try Calculator" : "Read More"}
            <ChevronRight className="size-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function FeaturedResourceCard({ resource }: { resource: Resource }) {
  return (
    <Link href={resource.href}>
      <Card className="overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all group h-full">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 flex items-center justify-center">
          <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            {categoryIcons[resource.category]}
          </div>
        </div>
        <CardContent className="p-6">
          {/* Type Badge */}
          <Badge className="bg-primary/10 text-primary border-primary/20 gap-1 mb-4">
            {typeIcons[resource.type]}
            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
          </Badge>

          {/* Title */}
          <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
            {resource.title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {resource.description}
          </p>

          {/* Meta */}
          {resource.readTime && (
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="size-4" />
              {resource.readTime}
            </span>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

export default function ResourcesPage() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const typeParam = searchParams.get("type")
  const activeType =
    typeParam === "article" || typeParam === "guide" || typeParam === "calculator" || typeParam === "video"
      ? typeParam
      : "all"

  const handleTypeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") {
      params.delete("type")
    } else {
      params.set("type", value)
    }

    const queryString = params.toString()
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
  }

  // Filter resources
  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || resource.category === activeCategory
    const matchesType = activeType === "all" || resource.type === activeType
    return matchesSearch && matchesCategory && matchesType
  })

  const featuredResources = resources.filter(r => r.featured)

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Financial Resources & Guides
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Free articles, guides, and calculators to help you make informed financial decisions.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-base rounded-full"
            />
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Featured</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredResources.map((resource) => (
              <FeaturedResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      </section>

      {/* All Resources */}
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Category Filter */}
                <div>
                  <h3 className="font-semibold mb-4">Topics</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.value}
                        onClick={() => setActiveCategory(category.value)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left
                          ${activeCategory === category.value
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                          }
                        `}
                      >
                        {category.icon}
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <h3 className="font-semibold mb-4">Content Type</h3>
                  <div className="space-y-2">
                    {[
                      { value: "all", label: "All Types" },
                      { value: "article", label: "Articles", icon: <FileText className="size-4" /> },
                      { value: "guide", label: "Guides", icon: <BookOpen className="size-4" /> },
                      { value: "calculator", label: "Calculators", icon: <Calculator className="size-4" /> },
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => handleTypeChange(type.value)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left
                          ${activeType === type.value
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                          }
                        `}
                      >
                        {type.icon}
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Resource Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredResources.length}</span> resources
                </p>
              </div>

              {filteredResources.length > 0 ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredResources.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Search className="size-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">No resources found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filters to find what you&apos;re looking for.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8 lg:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Get financial tips delivered to your inbox
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Join thousands of Australians who receive our weekly newsletter with practical financial tips, market updates, and new resources.
              </p>
              <Button asChild>
                <a href={`mailto:${publicBusiness.supportEmail}?subject=Resource%20updates`}>
                  Request updates by email
                  <ArrowRight className="ml-2 size-4" />
                </a>
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                No spam, unsubscribe anytime. Read our{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Still Need Help CTA */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Still have questions?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Sometimes you need personalized advice. Connect with a qualified financial advisor who can help with your specific situation.
          </p>
          <Button size="lg" className="rounded-full px-8" asChild>
            <Link href="/request-intro">
              Find an Advisor
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  )
}
