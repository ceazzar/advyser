"use client"

import { ArrowRight, BookOpen, HelpCircle, Mail } from "lucide-react"
import Link from "next/link"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { publicBusiness } from "@/lib/public-business"

const availableNow = [
  "Public advisor discovery visibility via marketplace pages",
  "Advisor enquiries through contact and support channels",
  "Compliance and trust guidance for public listing presentation",
]

const comingNext = [
  "Advisor onboarding portal",
  "Lead handling workflows",
  "Advisor analytics and profile controls",
]

export default function AdvisorResourcesPage() {
  return (
    <PublicLayout>
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            For Advisors
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Advisor Resource Centre</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Current guidance for advisors interested in participating in the Advyser marketplace.
          </p>
          <Button size="lg" className="rounded-full px-8" asChild>
            <Link href="/for-advisors">
              View advisor overview
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <BookOpen className="size-5" />
                Available now
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                {availableNow.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <HelpCircle className="size-5" />
                Planned next
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                {comingNext.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mx-auto mb-6">
            <Mail className="size-8" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Need advisor support?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Reach out and we&apos;ll help with marketplace participation questions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href={`mailto:${publicBusiness.supportEmail}`}>{publicBusiness.supportEmail}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Open contact page</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
