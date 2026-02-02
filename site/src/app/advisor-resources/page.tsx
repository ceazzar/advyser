"use client"

import Link from "next/link"
import {
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  Download,
  ArrowRight,
  Play,
  ChevronRight,
} from "lucide-react"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const resourceCategories = [
  {
    icon: <BookOpen className="size-6" />,
    title: "Getting Started",
    description: "Everything you need to set up and optimize your Advyser profile",
    resources: [
      { title: "Creating your advisor profile", type: "Guide" },
      { title: "Verification requirements", type: "Checklist" },
      { title: "Profile optimization tips", type: "Guide" },
    ],
  },
  {
    icon: <Video className="size-6" />,
    title: "Video Tutorials",
    description: "Step-by-step video guides for using the platform",
    resources: [
      { title: "Platform walkthrough", type: "Video", duration: "8 min" },
      { title: "Responding to leads", type: "Video", duration: "5 min" },
      { title: "Managing your calendar", type: "Video", duration: "6 min" },
    ],
  },
  {
    icon: <FileText className="size-6" />,
    title: "Best Practices",
    description: "Tips and strategies to get the most from Advyser",
    resources: [
      { title: "Writing compelling profile copy", type: "Guide" },
      { title: "Converting leads to clients", type: "Guide" },
      { title: "Building reviews and social proof", type: "Guide" },
    ],
  },
]

const popularGuides = [
  {
    title: "Complete Profile Setup Guide",
    description: "A step-by-step walkthrough of creating and optimizing your Advyser profile for maximum visibility.",
    readTime: "10 min read",
    category: "Getting Started",
  },
  {
    title: "Lead Response Best Practices",
    description: "Learn how top advisors on our platform respond to leads and convert them into long-term clients.",
    readTime: "7 min read",
    category: "Best Practices",
  },
  {
    title: "Understanding Your Analytics",
    description: "Make data-driven decisions with our guide to interpreting your profile and lead analytics.",
    readTime: "5 min read",
    category: "Analytics",
  },
]

const downloadableResources = [
  {
    title: "Profile Checklist",
    description: "Ensure your profile is complete and optimized",
    format: "PDF",
  },
  {
    title: "Lead Response Templates",
    description: "Professional email templates for responding to leads",
    format: "DOCX",
  },
  {
    title: "Client Onboarding Guide",
    description: "Best practices for onboarding new clients",
    format: "PDF",
  },
]

export default function AdvisorResourcesPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            For Advisors
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Advisor Resource Centre
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Guides, tutorials, and best practices to help you succeed on Advyser
          </p>
          <Button size="lg" className="rounded-full px-8" asChild>
            <Link href="/for-advisors">
              Join Advyser
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Browse Resources
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {resourceCategories.map((category) => (
              <Card key={category.title}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
                      {category.icon}
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.resources.map((resource) => (
                      <li key={resource.title}>
                        <Link
                          href="#"
                          className="flex items-center justify-between text-sm hover:text-primary transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {resource.type === "Video" ? (
                              <Play className="size-4 text-muted-foreground" />
                            ) : (
                              <FileText className="size-4 text-muted-foreground" />
                            )}
                            <span>{resource.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {"duration" in resource && (
                              <span className="text-xs text-muted-foreground">
                                {resource.duration}
                              </span>
                            )}
                            <ChevronRight className="size-4" />
                          </div>
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

      {/* Popular Guides */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Popular Guides
          </h2>

          <div className="space-y-6">
            {popularGuides.map((guide) => (
              <Card key={guide.title} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-sm font-medium">{guide.category}</span>
                    <span className="text-sm text-muted-foreground">
                      {guide.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {guide.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">{guide.description}</p>
                  <Button variant="link" className="p-0 h-auto">
                    Read guide
                    <ArrowRight className="ml-1 size-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Downloadable Resources */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Downloadable Resources
          </h2>

          <div className="grid sm:grid-cols-3 gap-6">
            {downloadableResources.map((resource) => (
              <Card key={resource.title}>
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary mx-auto mb-4">
                    <Download className="size-6" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {resource.description}
                  </p>
                  <Button variant="outline" size="sm">
                    Download {resource.format}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mx-auto mb-6">
            <HelpCircle className="size-8" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Need More Help?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our advisor success team is here to help you get the most out of Advyser
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/help">Visit Help Centre</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-primary/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Not yet on Advyser?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of advisors connecting with new clients every day
          </p>
          <Button size="lg" className="rounded-full px-8" asChild>
            <Link href="/for-advisors">
              Learn More About Advyser for Advisors
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  )
}
