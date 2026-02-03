"use client"

import * as React from "react"
import { PublicLayout } from "@/components/layouts/public-layout"
import { Avatar, AvatarImage, AvatarFallback, getInitials } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { StickyMobileCTA, AdvisorMiniCard } from "@/components/composite"
import {
  BadgeCheck,
  Star,
  MapPin,
  Clock,
  Users,
  Mail,
  Phone,
  Calendar,
  Award,
  Briefcase,
  GraduationCap,
  ExternalLink,
} from "lucide-react"

// Mock advisor data
const mockAdvisor = {
  id: "1",
  slug: "sarah-mitchell-cfp",
  name: "Sarah Mitchell",
  credentials: "CFP, CFA, ChFC",
  avatar: "/avatars/sarah-mitchell.jpg",
  verified: true,
  rating: 4.9,
  reviewCount: 127,
  yearsExperience: 15,
  clientsHelped: 500,
  location: "Sydney, NSW",
  email: "sarah@advyser.com",
  phone: "+61 2 9876 5432",
  bio: `Sarah Mitchell is a Certified Financial Planner with over 15 years of experience helping individuals and families achieve their financial goals. She specializes in comprehensive financial planning, retirement strategies, and investment management.

Her approach combines deep technical expertise with a genuine understanding of each client's unique circumstances and aspirations. Sarah believes in building long-term relationships based on trust, transparency, and personalized guidance.

Prior to founding her practice, Sarah spent 8 years at Morgan Stanley where she managed portfolios for high-net-worth clients. She holds a Master's degree in Finance from Stanford University and maintains her CFP, CFA, and ChFC designations.`,
  specialties: [
    "Retirement Planning",
    "Investment Management",
    "Tax Planning",
    "Estate Planning",
    "Superannuation Optimization",
    "Wealth Management",
    "Age Pension Strategy",
    "Insurance Planning",
  ],
  services: [
    {
      name: "Comprehensive Financial Plan",
      description: "A complete analysis of your financial situation with actionable recommendations",
      price: "$1,500",
    },
    {
      name: "Retirement Readiness Review",
      description: "Evaluate your retirement savings and create a strategy to meet your goals",
      price: "$750",
    },
    {
      name: "Investment Portfolio Review",
      description: "Analyze your current investments and optimize for your risk tolerance",
      price: "$500",
    },
    {
      name: "Ongoing Advisory Services",
      description: "Monthly check-ins and continuous portfolio management",
      price: "$250/month",
    },
  ],
  reviews: [
    {
      id: "r1",
      author: "Michael Chen",
      rating: 5,
      date: "2025-12-15",
      content:
        "Sarah helped me create a comprehensive retirement plan that gave me confidence about my financial future. Her expertise and attention to detail are exceptional. Highly recommend!",
    },
    {
      id: "r2",
      author: "Jennifer Adams",
      rating: 5,
      date: "2025-11-28",
      content:
        "Working with Sarah has been transformative for our family's finances. She took the time to understand our goals and created a plan that actually works for us. Very grateful!",
    },
    {
      id: "r3",
      author: "David Thompson",
      rating: 4,
      date: "2025-10-10",
      content:
        "Great experience overall. Sarah is knowledgeable and professional. She provided clear explanations and helped me optimize my investment portfolio. Would definitely work with her again.",
    },
  ],
  education: [
    { degree: "M.S. Finance", institution: "Stanford University", year: "2009" },
    { degree: "B.A. Economics", institution: "UC Berkeley", year: "2007" },
  ],
  certifications: [
    { name: "Certified Financial Planner (CFP)", year: "2010" },
    { name: "Chartered Financial Analyst (CFA)", year: "2012" },
    { name: "Chartered Financial Consultant (ChFC)", year: "2014" },
  ],
  // Third-party review platform data (placeholders)
  thirdPartyReviews: [
    {
      platform: "Trustpilot",
      rating: 4.8,
      reviewCount: 23,
      url: "https://www.trustpilot.com/review/example-advisor",
    },
    {
      platform: "Google",
      rating: 4.7,
      reviewCount: 45,
      url: "https://www.google.com/maps/place/example-advisor",
    },
  ],
}

// Mock similar advisors data - matched by specialties and location
const mockSimilarAdvisors = [
  {
    id: "2",
    slug: "james-wilson-cfp",
    name: "James Wilson",
    avatar: "/avatars/james-wilson.jpg",
    rating: 4.8,
    reviewCount: 89,
    location: "Sydney, NSW",
    primarySpecialty: "Retirement Planning",
    specialties: ["Retirement Planning", "Superannuation Optimization", "Investment Management"],
    matchReason: "Same location, shares 3 specialties",
  },
  {
    id: "3",
    slug: "emily-chen-cfa",
    name: "Emily Chen",
    avatar: "/avatars/emily-chen.jpg",
    rating: 4.9,
    reviewCount: 156,
    location: "Melbourne, VIC",
    primarySpecialty: "Investment Management",
    specialties: ["Investment Management", "Wealth Management", "Tax Planning"],
    matchReason: "Highly rated, shares 3 specialties",
  },
  {
    id: "4",
    slug: "david-nguyen-cfp",
    name: "David Nguyen",
    avatar: "/avatars/david-nguyen.jpg",
    rating: 4.7,
    reviewCount: 64,
    location: "Sydney, NSW",
    primarySpecialty: "Tax Planning",
    specialties: ["Tax Planning", "Estate Planning", "Retirement Planning"],
    matchReason: "Same location, tax planning expert",
  },
  {
    id: "5",
    slug: "lisa-thompson-chfc",
    name: "Lisa Thompson",
    avatar: "/avatars/lisa-thompson.jpg",
    rating: 4.8,
    reviewCount: 112,
    location: "Brisbane, QLD",
    primarySpecialty: "Estate Planning",
    specialties: ["Estate Planning", "Wealth Management", "Insurance Planning"],
    matchReason: "Shares 3 specialties",
  },
]

/**
 * Get similar advisors based on matching criteria
 * In production, this would call an API with actual matching logic
 */
function getSimilarAdvisors(
  currentAdvisor: typeof mockAdvisor,
  allAdvisors: typeof mockSimilarAdvisors
) {
  // Filter out current advisor and sort by match criteria
  return allAdvisors
    .filter((a) => a.id !== currentAdvisor.id)
    .map((advisor) => {
      // Calculate match score based on shared specialties and location
      const sharedSpecialties = advisor.specialties.filter((s) =>
        currentAdvisor.specialties.includes(s)
      ).length
      const sameLocation = advisor.location === currentAdvisor.location
      const matchScore = sharedSpecialties * 2 + (sameLocation ? 3 : 0) + advisor.rating

      return { ...advisor, matchScore }
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4) // Return top 4 matches
}

function StarRating({ rating, size = "default" }: { rating: number; size?: "default" | "lg" }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  const starSize = size === "lg" ? "size-5" : "size-4"

  return (
    <div
      className="flex items-center"
      role="img"
      aria-label={`Rating: ${rating} out of 5 stars`}
    >
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className={`${starSize} fill-amber-400 text-amber-400`} />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star className={`${starSize} text-muted-foreground/30`} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={`${starSize} fill-amber-400 text-amber-400`} />
          </div>
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className={`${starSize} text-muted-foreground/30`} />
      ))}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col items-center gap-1 p-4 text-center">
      <Icon className="size-5 text-primary mb-1" />
      <span className="text-2xl font-bold text-foreground">{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )
}

function ReviewCard({
  author,
  rating,
  date,
  content,
}: {
  author: string
  rating: number
  date: string
  content: string
}) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar size="sm">
              <AvatarFallback size="sm">{getInitials(author)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{author}</p>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
          <StarRating rating={rating} />
        </div>
        <p className="mt-4 text-muted-foreground leading-relaxed">{content}</p>
      </CardContent>
    </Card>
  )
}

function ThirdPartyReviewCard({
  platform,
  rating,
  reviewCount,
  url,
}: {
  platform: string
  rating: number
  reviewCount: number
  url: string
}) {
  // Platform-specific styling
  const platformStyles: Record<string, { bg: string; text: string; border: string }> = {
    Trustpilot: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
    Google: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
  }

  const style = platformStyles[platform] || {
    bg: "bg-muted/50",
    text: "text-muted-foreground",
    border: "border-border",
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-4 px-4 py-3 rounded-lg border ${style.border} ${style.bg} hover:shadow-sm transition-shadow group`}
    >
      {/* Platform Logo Placeholder */}
      <div className={`flex items-center justify-center px-3 py-1.5 rounded-md bg-white border ${style.border}`}>
        <span className={`text-sm font-semibold ${style.text}`}>{platform}</span>
      </div>

      {/* Rating Info */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
        </span>
      </div>

      {/* Link indicator */}
      <span className="ml-auto flex items-center gap-1 text-sm text-muted-foreground group-hover:text-primary transition-colors">
        Read reviews
        <ExternalLink className="size-3.5" />
      </span>
    </a>
  )
}

export default function AdvisorProfilePage() {
  const advisor = mockAdvisor
  const mainCtaRef = React.useRef<HTMLButtonElement>(null)

  // Get similar advisors based on matching criteria
  const similarAdvisors = getSimilarAdvisors(advisor, mockSimilarAdvisors)

  const handleRequestIntro = () => {
    // TODO: Implement request intro modal/flow
  }

  return (
    <PublicLayout>
      <div className="bg-muted/30">
        {/* Header Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Main Content */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Large Avatar */}
                  <div className="relative shrink-0 self-center sm:self-start">
                    <Avatar className="size-32 md:size-40">
                      {advisor.avatar && <AvatarImage src={advisor.avatar} alt={advisor.name} />}
                      <AvatarFallback className="text-4xl">{getInitials(advisor.name)}</AvatarFallback>
                    </Avatar>
                    {advisor.verified && (
                      <div className="absolute -bottom-2 -right-2 rounded-full bg-background p-1 shadow-md">
                        <BadgeCheck className="size-8 fill-primary text-white" />
                      </div>
                    )}
                  </div>

                  {/* Name and Basic Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h1 className="text-3xl md:text-4xl font-bold text-foreground">{advisor.name}</h1>
                      {advisor.verified && (
                        <Badge status="verified" className="hidden sm:inline-flex">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-lg text-muted-foreground">{advisor.credentials}</p>

                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                      <StarRating rating={advisor.rating} size="lg" />
                      <span className="text-lg font-medium">{advisor.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">({advisor.reviewCount} reviews)</span>
                    </div>

                    <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-3 text-muted-foreground">
                      <MapPin className="size-5" />
                      <span>{advisor.location}</span>
                    </div>

                    {/* Mobile verified badge */}
                    {advisor.verified && (
                      <div className="mt-4 sm:hidden">
                        <Badge status="verified">Verified Advisor</Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats Section */}
                <Card className="mt-8">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border">
                      <StatCard icon={Star} label="Rating" value={advisor.rating.toFixed(1)} />
                      <StatCard icon={Users} label="Reviews" value={advisor.reviewCount.toString()} />
                      <StatCard icon={Clock} label="Years Experience" value={advisor.yearsExperience.toString()} />
                      <StatCard icon={Briefcase} label="Clients Helped" value={`${advisor.clientsHelped}+`} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* CTA Sidebar */}
              <div className="lg:w-80 xl:w-96">
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Connect with {advisor.name.split(" ")[0]}</h3>
                    <Button
                      ref={mainCtaRef}
                      className="w-full"
                      size="lg"
                      onClick={handleRequestIntro}
                    >
                      <Calendar className="size-5 mr-2" />
                      Request Introduction
                    </Button>
                    <p className="mt-3 text-sm text-muted-foreground text-center">
                      Free consultation - No obligation
                    </p>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="size-5 text-primary shrink-0" />
                        <a href={`mailto:${advisor.email}`} className="text-foreground hover:text-primary transition-colors">
                          {advisor.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="size-5 text-primary shrink-0" />
                        <a href={`tel:${advisor.phone}`} className="text-foreground hover:text-primary transition-colors">
                          {advisor.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="size-5 text-primary shrink-0" />
                        <span className="text-muted-foreground">{advisor.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Sections */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Main Column */}
              <div className="flex-1 space-y-12">
                {/* About Section */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">About</h2>
                  <div className="prose prose-gray max-w-none">
                    {advisor.bio.split("\n\n").map((paragraph, i) => (
                      <p key={i} className="text-muted-foreground leading-relaxed mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Specialties Section */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Specialties</h2>
                  <div className="flex flex-wrap gap-2">
                    {advisor.specialties.map((specialty) => (
                      <Badge
                        key={specialty}
                        className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Services Section */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Services</h2>
                  <div className="grid gap-4">
                    {advisor.services.map((service) => (
                      <Card key={service.name}>
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div>
                              <h3 className="font-semibold text-foreground">{service.name}</h3>
                              <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
                            </div>
                            <span className="text-lg font-semibold text-primary whitespace-nowrap">
                              {service.price}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Education & Certifications */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <GraduationCap className="size-6" />
                      Education
                    </h2>
                    <div className="space-y-3">
                      {advisor.education.map((edu) => (
                        <div key={edu.degree} className="flex items-start gap-3">
                          <div className="size-2 rounded-full bg-primary mt-2 shrink-0" />
                          <div>
                            <p className="font-medium text-foreground">{edu.degree}</p>
                            <p className="text-sm text-muted-foreground">
                              {edu.institution} - {edu.year}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <Award className="size-6" />
                      Certifications
                    </h2>
                    <div className="space-y-3">
                      {advisor.certifications.map((cert) => (
                        <div key={cert.name} className="flex items-start gap-3">
                          <div className="size-2 rounded-full bg-primary mt-2 shrink-0" />
                          <div>
                            <p className="font-medium text-foreground">{cert.name}</p>
                            <p className="text-sm text-muted-foreground">Since {cert.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reviews Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-foreground">Reviews</h2>
                    <Button variant="ghost" size="sm">
                      View all {advisor.reviewCount} reviews
                    </Button>
                  </div>
                  <div className="grid gap-4">
                    {advisor.reviews.map((review) => (
                      <ReviewCard
                        key={review.id}
                        author={review.author}
                        rating={review.rating}
                        date={review.date}
                        content={review.content}
                      />
                    ))}
                  </div>
                </div>

                {/* Third-Party Reviews Section */}
                {advisor.thirdPartyReviews && advisor.thirdPartyReviews.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Also reviewed on</h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                      {advisor.thirdPartyReviews.map((review) => (
                        <ThirdPartyReviewCard
                          key={review.platform}
                          platform={review.platform}
                          rating={review.rating}
                          reviewCount={review.reviewCount}
                          url={review.url}
                        />
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Reviews collected from third-party platforms. Ratings may differ from Advyser reviews.
                    </p>
                  </div>
                )}

                {/* Similar Advisors Section */}
                {similarAdvisors.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">More Like This</h2>
                    <p className="text-muted-foreground mb-6">
                      Advisors with similar specialties who might be a good fit for you
                    </p>

                    {/* Mobile: Horizontal scrollable list */}
                    <div className="lg:hidden -mx-4 px-4">
                      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                        {similarAdvisors.map((similar) => (
                          <div key={similar.id} className="snap-start shrink-0 w-[280px]">
                            <AdvisorMiniCard
                              id={similar.id}
                              slug={similar.slug}
                              name={similar.name}
                              avatar={similar.avatar}
                              rating={similar.rating}
                              reviewCount={similar.reviewCount}
                              location={similar.location}
                              primarySpecialty={similar.primarySpecialty}
                              matchReason={similar.matchReason}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Desktop: Grid layout */}
                    <div className="hidden lg:grid lg:grid-cols-2 gap-4">
                      {similarAdvisors.map((similar) => (
                        <AdvisorMiniCard
                          key={similar.id}
                          id={similar.id}
                          slug={similar.slug}
                          name={similar.name}
                          avatar={similar.avatar}
                          rating={similar.rating}
                          reviewCount={similar.reviewCount}
                          location={similar.location}
                          primarySpecialty={similar.primarySpecialty}
                          matchReason={similar.matchReason}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Empty column for layout balance on desktop (sidebar is sticky in header) */}
              <div className="hidden lg:block lg:w-80 xl:w-96" aria-hidden="true" />
            </div>
          </div>
        </section>
      </div>

      {/* Sticky Mobile CTA - appears when main CTA scrolls out of view */}
      <StickyMobileCTA
        advisorName={advisor.name}
        advisorImage={advisor.avatar}
        onRequestIntro={handleRequestIntro}
        ctaText="Request Intro"
        targetRef={mainCtaRef}
      />
    </PublicLayout>
  )
}
