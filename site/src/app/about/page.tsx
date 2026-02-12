"use client"

import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Shield,
  Target,
  Users,
} from "lucide-react"
import Link from "next/link"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Avatar, AvatarFallback, getInitials } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const values = [
  {
    icon: <Shield className="size-6" />,
    title: "Trust & Transparency",
    description: "We verify every advisor and provide clear, honest information to help you make informed decisions.",
  },
  {
    icon: <Users className="size-6" />,
    title: "Consumer First",
    description: "Our platform is built around your needs. We never compromise on what's best for consumers.",
  },
  {
    icon: <Target className="size-6" />,
    title: "Quality Matches",
    description: "We focus on finding the right fit, not just any fit. Quality over quantity, always.",
  },
  {
    icon: <Heart className="size-6" />,
    title: "Empowerment",
    description: "We believe everyone deserves access to quality financial advice to achieve their goals.",
  },
]

const team = [
  {
    name: "Sarah Mitchell",
    role: "CEO & Co-founder",
    bio: "Former financial planner with 15 years in the industry. Passionate about making advice accessible.",
  },
  {
    name: "David Chen",
    role: "CTO & Co-founder",
    bio: "Tech entrepreneur who previously built platforms in healthcare and education.",
  },
  {
    name: "Emma Roberts",
    role: "Head of Operations",
    bio: "Operations expert with experience scaling startups across Australia.",
  },
  {
    name: "Michael Thompson",
    role: "Head of Advisor Relations",
    bio: "Former practice manager who understands what advisors need to succeed.",
  },
]

const stats = [
  { value: "Public", label: "Marketplace access" },
  { value: "AU-wide", label: "Advisor discovery" },
  { value: "Transparent", label: "Comparison experience" },
  { value: "Independent", label: "Introducer model" },
]

export default function AboutPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Making financial advice{" "}
            <span className="text-primary">accessible to everyone</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Advyser was founded with a simple mission: help Australians find the right financial advisor, faster and with more confidence.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
          <div className="prose prose-gray max-w-none">
            <p>
              Advyser was born from a frustrating experience that many Australians share: trying to find a financial advisor who actually fits your needs.
            </p>
            <p>
              Our founders, having worked in both financial services and technology, saw an opportunity to bridge the gap between consumers seeking advice and qualified professionals who could help them.
            </p>
            <p>
              Our marketplace is built to help Australians connect with advisors who match their needs, whether they&apos;re planning for retirement, growing wealth, or navigating a major life change.
            </p>
            <p>
              We&apos;re proud to be an Australian company, built by Australians, for Australians. Our team is based in Sydney, and we&apos;re committed to supporting our local financial advice industry while making it more accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value) => (
              <Card key={value.title} className="border-0 shadow-none bg-card">
                <CardContent className="p-6 flex gap-4">
                  <div className="flex items-center justify-center size-14 rounded-xl bg-primary/10 text-primary shrink-0">
                    {value.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 lg:py-24 bg-primary/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Team</h2>
            <p className="text-lg text-muted-foreground">
              The people behind Advyser
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <Card key={member.name}>
                <CardContent className="p-6 text-center">
                  <Avatar className="size-20 mx-auto mb-4">
                    <AvatarFallback className="text-lg">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-primary mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to find your advisor?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start your search and compare advisor profiles in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link href="/request-intro">
                Get Started
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
              <Link href="/for-advisors">Join as an Advisor</Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-primary" />
              <span className="text-sm">100% free for consumers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-primary" />
              <span className="text-sm">Advisor credentials shown clearly</span>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
