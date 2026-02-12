"use client"

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Shield,
  Sparkles,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { FormProgress } from "@/components/ui/form-progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Multi-step form state
interface FormData {
  // Step 1: What you need
  adviceType: string[]
  primaryGoal: string
  timeline: string

  // Step 2: About you
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string

  // Step 3: Your situation
  investableAssets: string
  employmentStatus: string
  additionalInfo: string

  // Consent
  privacyConsent: boolean
  marketingConsent: boolean
}

const adviceTypes = [
  { value: "retirement", label: "Retirement Planning" },
  { value: "wealth", label: "Wealth Management" },
  { value: "insurance", label: "Insurance & Risk" },
  { value: "property", label: "Property Investment" },
  { value: "tax", label: "Tax Planning" },
  { value: "estate", label: "Estate Planning" },
  { value: "debt", label: "Debt Management" },
  { value: "other", label: "Other" },
]

const timelines = [
  { value: "asap", label: "As soon as possible" },
  { value: "next_month", label: "Within 1 month" },
  { value: "next_3_months", label: "Within 3 months" },
  { value: "exploring", label: "Just exploring options" },
]

const assetRanges = [
  { value: "under-50k", label: "Under $50,000" },
  { value: "50k-100k", label: "$50,000 - $100,000" },
  { value: "100k-250k", label: "$100,000 - $250,000" },
  { value: "250k-500k", label: "$250,000 - $500,000" },
  { value: "500k-1m", label: "$500,000 - $1 million" },
  { value: "1m-plus", label: "Over $1 million" },
  { value: "prefer-not", label: "Prefer not to say" },
]

const employmentStatuses = [
  { value: "employed", label: "Employed" },
  { value: "self-employed", label: "Self-employed" },
  { value: "retired", label: "Retired" },
  { value: "not-working", label: "Not currently working" },
  { value: "other", label: "Other" },
]

const states = [
  { value: "nsw", label: "New South Wales" },
  { value: "vic", label: "Victoria" },
  { value: "qld", label: "Queensland" },
  { value: "wa", label: "Western Australia" },
  { value: "sa", label: "South Australia" },
  { value: "tas", label: "Tasmania" },
  { value: "act", label: "Australian Capital Territory" },
  { value: "nt", label: "Northern Territory" },
]

export default function RequestIntroPage() {
  const searchParams = useSearchParams()
  const listingId = searchParams.get("listingId") || ""
  const listingIds = (searchParams.get("listingIds") || "")
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .slice(0, 3)
  const isGuidedMode = listingIds.length > 0
  const targetListingIds = isGuidedMode ? listingIds : listingId ? [listingId] : []

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [selectedListings, setSelectedListings] = useState<Array<{ id: string; name: string }>>([])

  const [formData, setFormData] = useState<FormData>({
    adviceType: [],
    primaryGoal: "",
    timeline: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    investableAssets: "",
    employmentStatus: "",
    additionalInfo: "",
    privacyConsent: false,
    marketingConsent: false,
  })

  useEffect(() => {
    if (targetListingIds.length === 0) {
      setSelectedListings([])
      return
    }

    const controller = new AbortController()
    async function loadSelectedListings() {
      const results = await Promise.all(
        targetListingIds.map(async (id) => {
          const response = await fetch(`/api/listings/${id}`, {
            signal: controller.signal,
            cache: "no-store",
          })
          const payload = (await response.json()) as {
            success: boolean
            data?: { id: string; name: string }
          }
          if (!response.ok || !payload.success || !payload.data) return null
          return { id: payload.data.id, name: payload.data.name }
        })
      )
      setSelectedListings(results.filter(Boolean) as Array<{ id: string; name: string }>)
    }

    void loadSelectedListings()
    return () => controller.abort()
  }, [targetListingIds.join(",")])

  const updateFormData = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleAdviceType = (value: string) => {
    setFormData(prev => ({
      ...prev,
      adviceType: prev.adviceType.includes(value)
        ? prev.adviceType.filter(v => v !== value)
        : [...prev.adviceType, value]
    }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.adviceType.length > 0 &&
          !!formData.timeline &&
          formData.primaryGoal.trim().length >= 20
        )
      case 2:
        return formData.firstName && formData.lastName && formData.email && formData.location
      case 3:
        return formData.investableAssets && formData.privacyConsent
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (targetListingIds.length === 0) {
      setSubmitError("Please start from matched results or an advisor profile to submit a request.")
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitError(null)

      const problemSummary = [formData.primaryGoal, formData.additionalInfo]
        .filter((value) => value.trim().length > 0)
        .join("\n\n")

      if (problemSummary.trim().length < 20) {
        setSubmitError("Please include at least 20 characters about your situation.")
        return
      }

      const endpoint = isGuidedMode ? "/api/match-requests" : "/api/leads"
      const requestBody = isGuidedMode
        ? {
            listingIds: targetListingIds,
            problemSummary,
            goalTags: formData.adviceType,
            timeline: formData.timeline || null,
            budgetRange: formData.investableAssets || null,
            preferredMeetingMode: null,
            preferredTimes: formData.location ? `Preferred state: ${formData.location.toUpperCase()}` : null,
            idempotencyKey: crypto.randomUUID(),
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            privacyConsent: formData.privacyConsent,
            marketingConsent: formData.marketingConsent,
          }
        : {
            listingId: targetListingIds[0],
            problemSummary,
            goalTags: formData.adviceType,
            timeline: formData.timeline || null,
            budgetRange: formData.investableAssets || null,
            preferredMeetingMode: null,
            preferredTimes: formData.location ? `Preferred state: ${formData.location.toUpperCase()}` : null,
            idempotencyKey: crypto.randomUUID(),
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            privacyConsent: formData.privacyConsent,
            marketingConsent: formData.marketingConsent,
          }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const payload = await response.json()
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error?.message || "Unable to submit your request.")
      }

      setIsComplete(true)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to submit your request right now."
      setSubmitError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success state
  if (isComplete) {
    return (
      <PublicLayout>
        <section className="py-24 lg:py-32">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="size-10 text-green-600" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Request Submitted!
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              Thank you, {formData.firstName}! We&apos;ve received your request and
              {isGuidedMode
                ? " shared it with your selected matched advisors."
                : " sent it directly to the advisor you selected."}{" "}
              You&apos;ll hear from us within 24 hours.
            </p>

            <Card className="text-left mb-8">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">What happens next?</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium shrink-0">1</div>
                    <div>
                      <p className="font-medium">We review your request</p>
                      <p className="text-sm text-muted-foreground">Our team matches you with advisors who specialize in your needs.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium shrink-0">2</div>
                    <div>
                      <p className="font-medium">Advisors reach out</p>
                      <p className="text-sm text-muted-foreground">
                        {isGuidedMode
                          ? "Up to 3 matched advisors will contact you to introduce themselves."
                          : "The selected advisor will contact you to introduce themselves."}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium shrink-0">3</div>
                    <div>
                      <p className="font-medium">Book your consultation</p>
                      <p className="text-sm text-muted-foreground">Choose the advisor you&apos;d like to meet with for a free initial consultation.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/">Back to Home</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/resources">Browse Resources</Link>
              </Button>
            </div>
          </div>
        </section>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      {/* Progress Header */}
      <div className="bg-muted/30 border-b">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
              <ArrowLeft className="size-4" />
              Back to Home
            </Link>
          </div>

          {/* Progress Indicator */}
          <FormProgress
            currentStep={currentStep}
            totalSteps={3}
            labels={["Your Needs", "About You", "Situation"]}
          />
        </div>
      </div>

      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-6">
          {targetListingIds.length === 0 && (
            <Card className="mb-6 border-amber-200 bg-amber-50">
              <CardContent className="p-4 text-sm text-amber-900">
                Start this form from matched results or an advisor profile to submit your request.
              </CardContent>
            </Card>
          )}
          {targetListingIds.length > 0 && (
            <Card className="mb-6 border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-foreground mb-2">
                  {isGuidedMode
                    ? "Submitting to matched advisors"
                    : "Submitting to selected advisor"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(selectedListings.length > 0
                    ? selectedListings
                    : targetListingIds.map((id) => ({ id, name: "Loading advisor..." }))
                  ).map((listing) => (
                    <span
                      key={listing.id}
                      className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground"
                    >
                      {listing.name}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              {/* Step 1: What you need */}
              {currentStep === 1 && (
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    What type of advice are you looking for?
                  </h1>
                  <p className="text-muted-foreground mb-8">
                    Select all areas where you&apos;d like guidance from a financial advisor.
                  </p>

                  {/* Advice Type Selection */}
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base mb-4 block">Areas of advice (select all that apply)</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {adviceTypes.map((type) => (
                          <div
                            key={type.value}
                            className={`
                              flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                              ${formData.adviceType.includes(type.value)
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                              }
                            `}
                            onClick={() => toggleAdviceType(type.value)}
                          >
                            <Checkbox
                              id={`advice-${type.value}`}
                              aria-label={type.label}
                              checked={formData.adviceType.includes(type.value)}
                              onCheckedChange={() => toggleAdviceType(type.value)}
                            />
                            <Label htmlFor={`advice-${type.value}`} className="font-medium cursor-pointer">
                              {type.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Primary Goal */}
                    <div>
                      <Label htmlFor="primaryGoal" className="text-base mb-2 block">
                        Describe what you need help with (minimum 20 characters) *
                      </Label>
                      <Textarea
                        id="primaryGoal"
                        placeholder="e.g., I want to compare refinancing options and reduce repayments over the next 12 months."
                        value={formData.primaryGoal}
                        onChange={(e) => updateFormData("primaryGoal", e.target.value)}
                        className="min-h-[100px]"
                      />
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formData.primaryGoal.trim().length}/20 minimum
                      </p>
                    </div>

                    {/* Timeline */}
                    <div>
                      <Label className="text-base mb-4 block">When do you need advice?</Label>
                      <RadioGroup
                        value={formData.timeline}
                        onValueChange={(value) => updateFormData("timeline", value)}
                        className="grid grid-cols-2 gap-3"
                      >
                        {timelines.map((timeline) => (
                          <div key={timeline.value} className="flex items-center">
                            <RadioGroupItem
                              value={timeline.value}
                              id={timeline.value}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={timeline.value}
                              className={`
                                flex items-center justify-center w-full p-4 rounded-lg border-2 cursor-pointer transition-all
                                ${formData.timeline === timeline.value
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                                }
                              `}
                            >
                              {timeline.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: About you */}
              {currentStep === 2 && (
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Tell us about yourself
                  </h1>
                  <p className="text-muted-foreground mb-8">
                    We&apos;ll use this information to match you with the right advisors.
                  </p>

                  <div className="space-y-6">
                    {/* Name */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => updateFormData("firstName", e.target.value)}
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => updateFormData("lastName", e.target.value)}
                          placeholder="Smith"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email">Email address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        placeholder="john.smith@example.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <Label htmlFor="phone">Phone number (optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                        placeholder="0400 000 000"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Advisors may call you to introduce themselves
                      </p>
                    </div>

                    {/* Location */}
                    <div>
                      <Label htmlFor="location">State/Territory *</Label>
                      <Select
                        value={formData.location}
                        onValueChange={(value) => updateFormData("location", value)}
                      >
                        <SelectTrigger id="location" aria-label="State or territory">
                          <SelectValue placeholder="Select your state" />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Your situation */}
              {currentStep === 3 && (
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    A bit about your financial situation
                  </h1>
                  <p className="text-muted-foreground mb-8">
                    This helps us match you with advisors experienced with clients like you.
                  </p>

                  <div className="space-y-6">
                    {/* Investable Assets */}
                    <div>
                      <Label className="text-base mb-4 block">
                        Approximate investable assets (excluding home)
                      </Label>
                      <RadioGroup
                        value={formData.investableAssets}
                        onValueChange={(value) => updateFormData("investableAssets", value)}
                        className="space-y-2"
                      >
                        {assetRanges.map((range) => (
                          <div key={range.value} className="flex items-center">
                            <RadioGroupItem
                              value={range.value}
                              id={`assets-${range.value}`}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={`assets-${range.value}`}
                              className={`
                                flex items-center w-full p-4 rounded-lg border-2 cursor-pointer transition-all
                                ${formData.investableAssets === range.value
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                                }
                              `}
                            >
                              {range.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Employment Status */}
                    <div>
                      <Label htmlFor="employmentStatus">Employment status (optional)</Label>
                      <Select
                        value={formData.employmentStatus}
                        onValueChange={(value) => updateFormData("employmentStatus", value)}
                      >
                        <SelectTrigger id="employmentStatus" aria-label="Employment status">
                          <SelectValue placeholder="Select your status" />
                        </SelectTrigger>
                        <SelectContent>
                          {employmentStatuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Additional Info */}
                    <div>
                      <Label htmlFor="additionalInfo">
                        Anything else you&apos;d like advisors to know? (optional)
                      </Label>
                      <Textarea
                        id="additionalInfo"
                        placeholder="e.g., I'm planning to sell my business next year..."
                        value={formData.additionalInfo}
                        onChange={(e) => updateFormData("additionalInfo", e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>

                    {/* Consent */}
                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="privacyConsent"
                          checked={formData.privacyConsent}
                          onCheckedChange={(checked) => updateFormData("privacyConsent", checked as boolean)}
                        />
                        <Label htmlFor="privacyConsent" className="text-sm leading-relaxed">
                          I agree to the{" "}
                          <Link href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>{" "}
                          and consent to Advyser sharing my details with matched financial advisors. *
                        </Label>
                      </div>

                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="marketingConsent"
                          checked={formData.marketingConsent}
                          onCheckedChange={(checked) => updateFormData("marketingConsent", checked as boolean)}
                        />
                        <Label htmlFor="marketingConsent" className="text-sm leading-relaxed">
                          I&apos;d like to receive helpful financial tips and updates from Advyser (optional)
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t">
                {currentStep > 1 ? (
                  <Button variant="ghost" onClick={handleBack}>
                    <ArrowLeft className="mr-2 size-4" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <Button onClick={handleNext} disabled={!canProceed()}>
                    Continue
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                ) : (
                  <div className="flex flex-col items-end gap-2">
                    {submitError && (
                      <p className="text-sm text-destructive text-right max-w-sm">{submitError}</p>
                    )}
                    <Button
                      onClick={handleSubmit}
                      disabled={!canProceed() || isSubmitting}
                      loading={isSubmitting}
                      className="min-w-[160px]"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Why use Advyser?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-3">
                    <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary shrink-0">
                      <Users className="size-5" />
                    </div>
                    <div>
                      <p className="font-medium">Matched to your needs</p>
                      <p className="text-sm text-muted-foreground">We connect you with advisors who specialize in your situation</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary shrink-0">
                      <Shield className="size-5" />
                    </div>
                    <div>
                      <p className="font-medium">All advisors verified</p>
                      <p className="text-sm text-muted-foreground">Every advisor is ASIC-registered and background checked</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary shrink-0">
                      <Clock className="size-5" />
                    </div>
                    <div>
                      <p className="font-medium">Quick response</p>
                      <p className="text-sm text-muted-foreground">Advisors typically respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary shrink-0">
                      <Sparkles className="size-5" />
                    </div>
                    <div>
                      <p className="font-medium">100% free for you</p>
                      <p className="text-sm text-muted-foreground">No cost to search, compare, or request introductions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
