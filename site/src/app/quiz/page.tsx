"use client"

import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Loader2,
  MapPin,
  Search,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

type QuizGoal = "investments" | "retirement" | "property" | "debt" | "insurance" | "other"
type QuizUrgency = "urgent" | "month" | "exploring" | "future"
type QuizSituation = "individual" | "couple" | "business" | "smsf"

type RecommendationItem = {
  listingId: string
  score: number
  reasons: Array<{ text: string; strength: "strong" | "moderate" }>
  listing: {
    id: string
    name: string
    headline: string | null
    advisorType: string
    location: string
    rating: number | null
    reviewCount: number
    responseTimeHours: number | null
    responseRate: number | null
    verified: boolean
    specialties: string[]
  }
}

type RecommendationResponse = {
  success: boolean
  data?: { items: RecommendationItem[] }
  error?: { message?: string }
}

const GOAL_OPTIONS: Array<{ value: QuizGoal; label: string }> = [
  { value: "investments", label: "Growing wealth / investments" },
  { value: "retirement", label: "Retirement planning" },
  { value: "property", label: "Property goals" },
  { value: "debt", label: "Debt and cashflow" },
  { value: "insurance", label: "Insurance and protection" },
  { value: "other", label: "Not sure yet" },
]

const URGENCY_OPTIONS: Array<{ value: QuizUrgency; label: string }> = [
  { value: "urgent", label: "Urgent (as soon as possible)" },
  { value: "month", label: "Within 1 month" },
  { value: "exploring", label: "Exploring options" },
  { value: "future", label: "Planning ahead" },
]

const SITUATION_OPTIONS: Array<{ value: QuizSituation; label: string }> = [
  { value: "individual", label: "Individual" },
  { value: "couple", label: "Couple / family" },
  { value: "business", label: "Business owner" },
  { value: "smsf", label: "SMSF trustee" },
]

function formatAdvisorType(value: string): string {
  return value.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase())
}

function QuestionCard({
  title,
  description,
  options,
  value,
  onChange,
}: {
  title: string
  description: string
  options: Array<{ value: string; label: string }>
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{title}</h1>
      <p className="text-muted-foreground mb-6">{description}</p>
      <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
        {options.map((option) => (
          <div key={option.value}>
            <RadioGroupItem id={option.value} value={option.value} className="peer sr-only" />
            <label
              htmlFor={option.value}
              className={cn(
                "flex cursor-pointer rounded-lg border-2 p-4 transition-colors",
                value === option.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              )}
            >
              {option.label}
            </label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default function QuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [goal, setGoal] = useState<QuizGoal | "">("")
  const [urgency, setUrgency] = useState<QuizUrgency | "">("")
  const [situation, setSituation] = useState<QuizSituation | "">("")
  const [location, setLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<RecommendationItem[] | null>(null)

  const canContinue =
    (step === 1 && !!goal) ||
    (step === 2 && !!urgency) ||
    (step === 3 && !!situation) ||
    step === 4

  async function submitForRecommendations() {
    if (!goal || !urgency || !situation) return

    try {
      setError(null)
      setIsLoading(true)
      const response = await fetch("/api/match/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal,
          urgency,
          situation,
          location: location.trim() || undefined,
          limit: 5,
        }),
      })

      const payload = (await response.json()) as RecommendationResponse
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error?.message || "Unable to generate matches")
      }

      setRecommendations(payload.data.items)
      setStep(5)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to generate recommendations right now."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const topThreeIds = (recommendations || []).slice(0, 3).map((item) => item.listingId)

  return (
    <PublicLayout>
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to Home
            </Link>
            <span className="text-sm text-muted-foreground">
              Step {Math.min(step, 4)} of 4
            </span>
          </div>

          <Progress
            value={Math.min((Math.min(step, 4) / 4) * 100, 100)}
            className="mb-8"
            aria-label="Quiz completion progress"
          />

          <Card>
            <CardContent className="p-6 md:p-8 space-y-8">
              {step === 1 && (
                <QuestionCard
                  title="What is your main financial goal?"
                  description="We use this to choose the right advisor type."
                  options={GOAL_OPTIONS}
                  value={goal}
                  onChange={(value) => setGoal(value as QuizGoal)}
                />
              )}

              {step === 2 && (
                <QuestionCard
                  title="How soon do you need help?"
                  description="Urgency helps us prioritize availability."
                  options={URGENCY_OPTIONS}
                  value={urgency}
                  onChange={(value) => setUrgency(value as QuizUrgency)}
                />
              )}

              {step === 3 && (
                <QuestionCard
                  title="Which best describes your situation?"
                  description="This helps us match relevant specialist experience."
                  options={SITUATION_OPTIONS}
                  value={situation}
                  onChange={(value) => setSituation(value as QuizSituation)}
                />
              )}

              {step === 4 && (
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Where are you located?
                  </h1>
                  <p className="text-muted-foreground mb-6">
                    Optional. Add your suburb/state so we can improve location matching.
                  </p>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      placeholder="e.g., Melbourne, VIC"
                      className="pl-9"
                    />
                  </div>
                  {error && (
                    <p className="mt-3 text-sm text-destructive">{error}</p>
                  )}
                </div>
              )}

              {step === 5 && (
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Your recommended advisors
                  </h1>
                  <p className="text-muted-foreground mb-6">
                    Ranked using your goals, urgency, situation, and location.
                  </p>

                  <div className="space-y-4">
                    {(recommendations || []).slice(0, 5).map((item) => (
                      <Card key={item.listingId} className="border-border/70">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{item.listing.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {formatAdvisorType(item.listing.advisorType)} • {item.listing.location}
                          </p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            <Badge className="border-border bg-background text-foreground">
                              Match score: {item.score.toFixed(1)}
                            </Badge>
                            {item.listing.verified && <Badge status="verified">Verified</Badge>}
                            <Badge className="border-border bg-background text-foreground">
                              Rating {(item.listing.rating ?? 0).toFixed(1)} ({item.listing.reviewCount})
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.listing.headline || "No headline available yet."}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {item.reasons.map((reason) => (
                              <Badge
                                key={reason.text}
                                className={
                                  reason.strength === "strong"
                                    ? "bg-slate-900 text-white border-slate-900"
                                    : "border-border bg-background text-foreground"
                                }
                              >
                                {reason.text}
                              </Badge>
                            ))}
                          </div>
                          <div className="pt-2">
                            <Button
                              variant="outline"
                              onClick={() => router.push(`/advisors/${item.listingId}`)}
                            >
                              View profile
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                {step > 1 && step < 5 ? (
                  <Button
                    variant="ghost"
                    onClick={() => setStep((current) => Math.max(1, current - 1))}
                  >
                    <ArrowLeft className="mr-2 size-4" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {step < 4 && (
                  <Button
                    onClick={() => setStep((current) => current + 1)}
                    disabled={!canContinue}
                  >
                    Continue
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                )}

                {step === 4 && (
                  <Button onClick={submitForRecommendations} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Finding matches...
                      </>
                    ) : (
                      <>
                        <Compass className="mr-2 size-4" />
                        Show recommendations
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {step === 5 && (
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                className="sm:flex-1"
                disabled={topThreeIds.length === 0}
                onClick={() =>
                  router.push(`/request-intro?listingIds=${encodeURIComponent(topThreeIds.join(","))}`)
                }
              >
                Request intros from top matches
              </Button>
              <Button
                variant="outline"
                className="sm:flex-1"
                onClick={() => router.push("/search")}
              >
                <Search className="mr-2 size-4" />
                Browse full directory
              </Button>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}
