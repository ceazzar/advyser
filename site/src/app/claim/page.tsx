"use client"

import * as React from "react"
import Link from "next/link"
import { Search, Shield, CheckCircle, ArrowRight, Building2, User } from "lucide-react"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for advisor search results
const mockAdvisors = [
  {
    id: "1",
    name: "Sarah Mitchell",
    company: "Mitchell Financial Services",
    afsLicense: "AFS001234",
    location: "Sydney, NSW",
    specialties: ["Retirement Planning", "Superannuation"],
    claimed: false,
  },
  {
    id: "2",
    name: "James Chen",
    company: "Chen Wealth Advisory",
    afsLicense: "AFS005678",
    location: "Melbourne, VIC",
    specialties: ["Investment", "Tax Planning"],
    claimed: true,
  },
  {
    id: "3",
    name: "Emily Thompson",
    company: "Thompson & Associates",
    afsLicense: "AFS009012",
    location: "Brisbane, QLD",
    specialties: ["Insurance", "Estate Planning"],
    claimed: false,
  },
]

interface Advisor {
  id: string
  name: string
  company: string
  afsLicense: string
  location: string
  specialties: string[]
  claimed: boolean
}

function AdvisorSearchCard({ advisor }: { advisor: Advisor }) {
  return (
    <Card className="transition-all duration-200 hover:shadow-lg hover:border-primary/30">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Avatar placeholder */}
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="size-6" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{advisor.name}</h3>
                {advisor.claimed && (
                  <Badge status="verified" size="sm">
                    <CheckCircle className="size-3" />
                    Claimed
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="size-4" />
                <span>{advisor.company}</span>
              </div>

              <p className="text-sm text-muted-foreground">{advisor.location}</p>

              <div className="flex flex-wrap gap-1 pt-2">
                {advisor.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              <p className="text-xs text-muted-foreground pt-1">
                AFSL: {advisor.afsLicense}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {advisor.claimed ? (
              <Button variant="outline" disabled size="sm">
                Already Claimed
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link href={`/claim/${advisor.id}`}>
                  Claim Profile
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ClaimEntryPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [searchResults, setSearchResults] = React.useState<Advisor[]>([])
  const [hasSearched, setHasSearched] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsLoading(true)
    // Simulate API search
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Filter mock data based on search query
    const filtered = mockAdvisors.filter(
      (advisor) =>
        advisor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        advisor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        advisor.afsLicense.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setSearchResults(filtered)
    setHasSearched(true)
    setIsLoading(false)
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Shield className="mr-2 size-4" />
            For Financial Advisors
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Claim Your Advisor Profile
          </h1>

          <p className="mt-4 text-lg text-muted-foreground">
            Take control of your online presence. Claim your profile to respond to reviews,
            update your information, and connect with potential clients.
          </p>
        </div>

        {/* Search Section */}
        <div className="mx-auto mt-10 max-w-2xl">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="search" className="text-sm font-medium text-foreground">
                    Search for your profile
                  </label>
                  <div className="flex gap-3">
                    <Input
                      id="search"
                      type="text"
                      placeholder="Search by name, company, or AFSL number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      leftIcon={<Search className="size-4" />}
                      className="flex-1"
                    />
                    <Button type="submit" loading={isLoading}>
                      Search
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="mx-auto mt-8 max-w-3xl">
            {searchResults.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Found {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
                </p>
                {searchResults.map((advisor) => (
                  <AdvisorSearchCard key={advisor.id} advisor={advisor} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                    <Search className="size-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">No profiles found</h3>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    We couldn&apos;t find a profile matching your search. This might mean your
                    profile hasn&apos;t been created yet.
                  </p>
                  <Button className="mt-6" variant="outline">
                    Request Profile Creation
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* How it Works Section */}
        <div className="mx-auto mt-16 max-w-4xl">
          <h2 className="text-center text-2xl font-semibold text-foreground">
            How Claiming Works
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-lg font-bold">1</span>
              </div>
              <h3 className="font-semibold text-foreground">Find Your Profile</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Search for your existing profile using your name, company, or AFSL number.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-lg font-bold">2</span>
              </div>
              <h3 className="font-semibold text-foreground">Verify Your Identity</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Complete our verification process to prove you&apos;re the advisor.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-lg font-bold">3</span>
              </div>
              <h3 className="font-semibold text-foreground">Take Control</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Manage your profile, respond to reviews, and connect with clients.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mx-auto mt-16 max-w-3xl">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-foreground">
                Benefits of Claiming Your Profile
              </h3>
              <ul className="mt-4 space-y-3">
                {[
                  "Respond to client reviews and build trust",
                  "Update your contact information and services",
                  "Showcase your credentials and specializations",
                  "Receive leads from potential clients",
                  "Access analytics and insights about your profile",
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mx-auto mt-16 max-w-xl text-center">
          <p className="text-muted-foreground">
            Don&apos;t have an account yet?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up as an advisor
            </Link>{" "}
            to get started.
          </p>
        </div>
      </div>
    </PublicLayout>
  )
}
