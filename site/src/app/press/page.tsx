"use client"

import Link from "next/link"
import {
  Newspaper,
  Download,
  Mail,
  ExternalLink,
  Calendar,
  ArrowRight,
} from "lucide-react"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const pressReleases = [
  {
    date: "15 January 2026",
    title: "Advyser Reaches 10,000 Verified Advisors",
    excerpt: "Advyser announces milestone of 10,000 verified financial advisors on its platform, covering all major advice categories across Australia.",
  },
  {
    date: "1 December 2025",
    title: "Advyser Launches Consumer Matching Service",
    excerpt: "New feature allows consumers to submit their requirements and get matched with suitable advisors within 24 hours.",
  },
  {
    date: "15 September 2025",
    title: "Advyser Secures $5M Seed Funding",
    excerpt: "Australian fintech Advyser closes seed round led by Blackbird Ventures to accelerate platform development and market expansion.",
  },
  {
    date: "1 July 2025",
    title: "Advyser Launches in Australia",
    excerpt: "New platform aims to make finding a financial advisor as easy as booking a restaurant, with all advisors verified through ASIC.",
  },
]

const mediaFeatures = [
  {
    outlet: "Australian Financial Review",
    title: "The startup making financial advice accessible",
    date: "20 January 2026",
  },
  {
    outlet: "The Australian",
    title: "Tech platform connects Aussies with advisors",
    date: "5 December 2025",
  },
  {
    outlet: "Smart Company",
    title: "Advyser: The Canva of financial advice",
    date: "18 September 2025",
  },
]

const stats = [
  { value: "10,000+", label: "Verified Advisors" },
  { value: "50,000+", label: "Consumer Connections" },
  { value: "4.8/5", label: "Platform Rating" },
  { value: "2023", label: "Founded" },
]

export default function PressPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mx-auto mb-6">
            <Newspaper className="size-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Press & Media
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            News, updates, and resources for journalists covering Advyser
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-foreground mb-8">Press Releases</h2>

          <div className="space-y-6">
            {pressReleases.map((release) => (
              <Card key={release.title}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="size-4" />
                    <span>{release.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {release.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">{release.excerpt}</p>
                  <Button variant="link" className="p-0 h-auto">
                    Read more
                    <ArrowRight className="ml-1 size-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-foreground mb-8">In the Media</h2>

          <div className="space-y-4">
            {mediaFeatures.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="p-6 flex items-center justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-sm font-medium mb-2">
                      {feature.outlet}
                    </span>
                    <h3 className="font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{feature.date}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="size-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Assets */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-foreground mb-4">Brand Assets</h2>
          <p className="text-muted-foreground mb-8">
            Download our logos, screenshots, and brand guidelines for use in media coverage.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Logo Pack</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Primary logo, wordmark, and icon in various formats (SVG, PNG).
                </p>
                <Button variant="outline">
                  <Download className="mr-2 size-4" />
                  Download Logos
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Brand Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Colors, typography, and usage guidelines for our brand.
                </p>
                <Button variant="outline">
                  <Download className="mr-2 size-4" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Product Screenshots</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  High-resolution screenshots of the Advyser platform.
                </p>
                <Button variant="outline">
                  <Download className="mr-2 size-4" />
                  Download Screenshots
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Founder Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Professional headshots of our leadership team.
                </p>
                <Button variant="outline">
                  <Download className="mr-2 size-4" />
                  Download Photos
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Media Inquiries</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            For interview requests, story pitches, or additional information, please contact our communications team.
          </p>

          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                <Mail className="size-6" />
              </div>
              <h3 className="font-semibold mb-2">Press Contact</h3>
              <p className="text-muted-foreground mb-4">
                We typically respond within 24 hours
              </p>
              <Button asChild>
                <Link href="mailto:press@advyser.com.au">
                  press@advyser.com.au
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </PublicLayout>
  )
}
