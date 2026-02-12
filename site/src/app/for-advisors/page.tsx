"use client"

import { ArrowRight, CheckCircle2, Mail, Shield } from "lucide-react"
import Link from "next/link"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { publicBusiness } from "@/lib/public-business"

const currentScopeItems = [
  "Public advisor discovery pages",
  "Category and search visibility",
  "Consumer request-intro flow",
  "Compliance-first legal and trust copy",
]

const futureItems = [
  "Advisor account onboarding",
  "Lead inbox and notifications",
  "Profile and analytics management",
]

export default function ForAdvisorsPage() {
  return (
    <PublicLayout>
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm text-muted-foreground mb-6">
            <Shield className="size-4 mr-2" />
            Marketplace MVP1
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            For financial advisors
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Advyser is currently operating with a public marketplace scope. Advisor portal features are not enabled yet.
            If you want to be included as advisor features roll out, contact our team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link href="/contact">
                Register interest
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
              <Link href="/search">See the marketplace</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Current scope</h2>
              <ul className="space-y-3">
                {currentScopeItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle2 className="size-4 mt-0.5 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Planned next</h2>
              <ul className="space-y-3">
                {futureItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle2 className="size-4 mt-0.5 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary mx-auto mb-4">
            <Mail className="size-6" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Advisor enquiries</h2>
          <p className="text-muted-foreground mb-6">
            Email us at <a className="text-primary hover:underline" href={`mailto:${publicBusiness.supportEmail}`}>{publicBusiness.supportEmail}</a> and include your name, practice, and specialties.
          </p>
          <Button variant="outline" asChild>
            <Link href="/contact">Open contact page</Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  )
}
