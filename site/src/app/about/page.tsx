import { ArrowRight, CheckCircle2, Search, ShieldCheck, SlidersHorizontal } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { aboutSnapshotDate, formatPolicyDate } from "@/lib/policy-meta"

export const metadata: Metadata = {
  title: "About Advyser | How Matching and Trust Checks Work",
  description:
    "Learn how Advyser helps Australians compare advisers with transparent matching steps, trust checks, and clear platform scope.",
}

const trustPillars = [
  {
    title: "Transparent matching inputs",
    description:
      "We show service scope, meeting mode, and profile context so consumers can compare fit before contacting an adviser.",
    icon: <SlidersHorizontal className="size-5" />,
  },
  {
    title: "Trust-first profile framing",
    description:
      "Adviser profiles are presented with verification context and links that support independent credential checks.",
    icon: <ShieldCheck className="size-5" />,
  },
  {
    title: "Consumer control throughout",
    description:
      "Consumers choose who to contact and when. Advyser is an introducer platform and does not provide personal financial advice.",
    icon: <Search className="size-5" />,
  },
]

const howItWorks = [
  {
    step: "1",
    title: "Share what you need",
    description:
      "Tell us your advice goal, urgency, and meeting preference so we can surface relevant advisers.",
  },
  {
    step: "2",
    title: "Compare adviser options",
    description:
      "Review profile fit, service scope, and trust context side by side before deciding who to contact.",
  },
  {
    step: "3",
    title: "Choose your next step",
    description:
      "Reach out to an adviser directly or submit a request intro. You stay in control of contact decisions.",
  },
]

const evidence = [
  {
    value: "3",
    label: "Core steps from need to contact",
  },
  {
    value: "0",
    label: "Platform search fees for consumers",
  },
  {
    value: "1",
    label: "Place to compare fit and trust context",
  },
]

export default function AboutPage() {
  return (
    <PublicLayout>
      <section className="border-b bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h1 className="text-4xl font-bold text-foreground md:text-5xl">
            Helping Australians find advice with more clarity
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-muted-foreground">
            Advyser was built to reduce guesswork in adviser discovery. We focus on
            transparent comparison and clear boundaries about what our platform does and does
            not do.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Capability snapshot last updated {formatPolicyDate(aboutSnapshotDate)}.
          </p>
        </div>
      </section>

      <section className="bg-muted/20 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-6 text-2xl font-semibold text-foreground">Trust framing</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {trustPillars.map((pillar) => (
              <Card key={pillar.title} className="h-full">
                <CardContent className="p-6">
                  <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {pillar.icon}
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-foreground">{pillar.title}</h3>
                  <p className="text-sm text-muted-foreground">{pillar.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-6 text-2xl font-semibold text-foreground">How it works</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {howItWorks.map((item) => (
              <Card key={item.step}>
                <CardContent className="p-6">
                  <p className="mb-3 text-2xl font-bold text-primary">{item.step}</p>
                  <h3 className="mb-2 text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary/5 py-14">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">Founder mission</h2>
          <p className="max-w-4xl text-muted-foreground">
            Advyser exists to make adviser discovery less opaque. Instead of asking consumers to
            rely on marketing claims alone, we prioritise transparent profile context, clear
            matching signals, and links that support independent verification.
          </p>
          <p className="mt-4 max-w-4xl text-muted-foreground">
            We are building this as an Australian-first platform. That means local regulatory
            references, practical complaint pathways, and plain-English policy content that users
            can actually understand.
          </p>
        </div>
      </section>

      <section className="py-14 lg:py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {evidence.map((item) => (
              <Card key={item.label}>
                <CardContent className="p-6 text-center">
                  <p className="text-4xl font-bold text-primary">{item.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/20 py-14">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-foreground">Ready to compare advisers?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Start with search, then decide who to contact. Advyser remains free for consumer
            discovery and comparison.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link href="/search">
                Find an adviser
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
              <Link href="/contact">Contact support</Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-primary" />
              Introducer model only
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-primary" />
              AU trust and policy references
            </span>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
