"use client"

import {
  ArrowRight,
  Briefcase,
  Clock,
  Coffee,
  Heart,
  Laptop,
  MapPin,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"
import Link from "next/link"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const benefits = [
  {
    icon: <Laptop className="size-6" />,
    title: "Remote-First",
    description: "Work from anywhere in Australia. We believe in flexibility and trust.",
  },
  {
    icon: <TrendingUp className="size-6" />,
    title: "Equity Options",
    description: "Share in our success with meaningful equity as part of your package.",
  },
  {
    icon: <Heart className="size-6" />,
    title: "Health & Wellbeing",
    description: "Comprehensive health insurance and mental health support.",
  },
  {
    icon: <Coffee className="size-6" />,
    title: "Learning Budget",
    description: "$2,000 annual budget for courses, conferences, and books.",
  },
  {
    icon: <Users className="size-6" />,
    title: "Team Retreats",
    description: "Quarterly in-person gatherings to connect and collaborate.",
  },
  {
    icon: <Zap className="size-6" />,
    title: "Latest Tools",
    description: "Top-of-the-line equipment and software to do your best work.",
  },
]

const openings = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote (Australia)",
    type: "Full-time",
    description: "Build the platform that connects Australians with financial advisors. React, Node.js, PostgreSQL.",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote (Australia)",
    type: "Full-time",
    description: "Design intuitive experiences for consumers and advisors. Figma, user research, design systems.",
  },
  {
    title: "Growth Marketing Manager",
    department: "Marketing",
    location: "Sydney / Remote",
    type: "Full-time",
    description: "Drive user acquisition and advisor partnerships. SEO, paid media, content marketing.",
  },
  {
    title: "Customer Success Lead",
    department: "Operations",
    location: "Sydney",
    type: "Full-time",
    description: "Ensure advisors succeed on our platform. Onboarding, support, relationship management.",
  },
]

const values = [
  "Consumer-first thinking",
  "Transparency in everything",
  "Move fast, learn faster",
  "Own your outcomes",
  "Collaboration over competition",
]

export default function CareersPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            We&apos;re hiring!
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Help us make financial advice{" "}
            <span className="text-primary">accessible to everyone</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join a passionate team building the future of how Australians find and connect with financial advisors.
          </p>
          <Button size="lg" className="rounded-full px-8" asChild>
            <a href="#openings">
              View Open Roles
              <ArrowRight className="ml-2 size-4" />
            </a>
          </Button>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            What We Value
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {values.map((value) => (
              <span
                key={value}
                className="inline-flex items-center rounded-full border border-border bg-background px-4 py-2 text-base font-medium"
              >
                {value}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Work at Advyser?
            </h2>
            <p className="text-lg text-muted-foreground">
              We take care of our team so they can do their best work
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <Card key={benefit.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Open Positions
            </h2>
            <p className="text-lg text-muted-foreground">
              Find your next opportunity
            </p>
          </div>

          <div className="space-y-4">
            {openings.map((job) => (
              <Card key={job.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <span className="inline-flex items-center rounded-md border border-border bg-muted/50 px-2.5 py-0.5 text-sm font-medium">{job.department}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{job.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="size-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="size-4" />
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button asChild>
                      <Link href={`mailto:careers@advyser.com.au?subject=Application: ${job.title}`}>
                        Apply Now
                        <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Don&apos;t see a role that fits? We&apos;re always looking for talented people.
            </p>
            <Button variant="outline" asChild>
              <Link href="mailto:careers@advyser.com.au?subject=General Application">
                <Briefcase className="mr-2 size-4" />
                Send a General Application
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to make an impact?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join us in building a platform that helps Australians make better financial decisions.
          </p>
          <Button size="lg" className="rounded-full px-8" asChild>
            <a href="#openings">
              View Open Roles
              <ArrowRight className="ml-2 size-4" />
            </a>
          </Button>
        </div>
      </section>
    </PublicLayout>
  )
}
