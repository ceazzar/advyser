"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Building2,
  MapPin,
  DollarSign,
  FileText,
  Camera,
  Plus,
  X,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FileUpload } from "@/components/ui/file-upload"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const steps = [
  { id: 1, name: "Personal Info", icon: User },
  { id: 2, name: "Practice Details", icon: Building2 },
  { id: 3, name: "Services & Fees", icon: DollarSign },
  { id: 4, name: "About You", icon: FileText },
  { id: 5, name: "Profile Photo", icon: Camera },
]

const specializations = [
  "Retirement Planning",
  "Superannuation",
  "Investment Management",
  "Tax Planning",
  "Estate Planning",
  "Insurance",
  "Debt Management",
  "Aged Care",
  "Self-Managed Super Funds (SMSF)",
  "Centrelink & Social Security",
  "Business Succession",
  "Property Investment",
]

const feeStructures = [
  { value: "fee-for-service", label: "Fee for Service" },
  { value: "flat-fee", label: "Flat Fee" },
  { value: "hourly", label: "Hourly Rate" },
  { value: "percentage", label: "Percentage of Assets" },
  { value: "hybrid", label: "Hybrid" },
]

const australianStates = [
  { value: "nsw", label: "New South Wales" },
  { value: "vic", label: "Victoria" },
  { value: "qld", label: "Queensland" },
  { value: "wa", label: "Western Australia" },
  { value: "sa", label: "South Australia" },
  { value: "tas", label: "Tasmania" },
  { value: "act", label: "Australian Capital Territory" },
  { value: "nt", label: "Northern Territory" },
]

interface FormData {
  // Step 1 - Personal Info
  displayName: string
  qualifications: string[]
  yearsExperience: string
  // Step 2 - Practice Details
  practiceType: string
  firmName: string
  streetAddress: string
  suburb: string
  state: string
  postcode: string
  phoneNumber: string
  websiteUrl: string
  // Step 3 - Services & Fees
  selectedSpecializations: string[]
  feeStructure: string
  minimumInvestment: string
  initialConsultationFee: string
  // Step 4 - About You
  bio: string
  approachToAdvice: string
  // Step 5 - Profile Photo
  profilePhoto: File | null
}

export default function AdvisorOnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(false)
  const [newQualification, setNewQualification] = React.useState("")

  const [formData, setFormData] = React.useState<FormData>({
    displayName: "",
    qualifications: [],
    yearsExperience: "",
    practiceType: "",
    firmName: "",
    streetAddress: "",
    suburb: "",
    state: "",
    postcode: "",
    phoneNumber: "",
    websiteUrl: "",
    selectedSpecializations: [],
    feeStructure: "",
    minimumInvestment: "",
    initialConsultationFee: "",
    bio: "",
    approachToAdvice: "",
    profilePhoto: null,
  })

  const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddQualification = () => {
    if (newQualification.trim() && !formData.qualifications.includes(newQualification.trim())) {
      updateFormData("qualifications", [...formData.qualifications, newQualification.trim()])
      setNewQualification("")
    }
  }

  const handleRemoveQualification = (qual: string) => {
    updateFormData(
      "qualifications",
      formData.qualifications.filter((q) => q !== qual)
    )
  }

  const toggleSpecialization = (spec: string) => {
    if (formData.selectedSpecializations.includes(spec)) {
      updateFormData(
        "selectedSpecializations",
        formData.selectedSpecializations.filter((s) => s !== spec)
      )
    } else if (formData.selectedSpecializations.length < 6) {
      updateFormData("selectedSpecializations", [...formData.selectedSpecializations, spec])
    }
  }

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return formData.displayName.trim().length > 0 && formData.yearsExperience.length > 0
      case 2:
        return (
          formData.practiceType.length > 0 &&
          formData.firmName.trim().length > 0 &&
          formData.state.length > 0 &&
          formData.postcode.length > 0
        )
      case 3:
        return formData.selectedSpecializations.length > 0 && formData.feeStructure.length > 0
      case 4:
        return formData.bio.trim().length >= 100
      case 5:
        return true // Photo is optional
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // Redirect to dashboard
    router.push("/advisor")
  }

  const handleSkip = () => {
    router.push("/advisor")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Minimal Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-primary">
            Advyser
          </Link>
          <Button variant="ghost" size="sm" onClick={handleSkip}>
            Skip for now
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        {currentStep === 1 && (
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <div className="mb-4 inline-flex size-16 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="size-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome to Advyser!
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Let&apos;s set up your advisor profile. This helps clients find and connect with you.
            </p>
          </div>
        )}

        {/* Progress Section */}
        <div className="mx-auto max-w-3xl">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Step {currentStep} of {steps.length}</span>
            <span className="text-muted-foreground">{Math.round((currentStep / steps.length) * 100)}% complete</span>
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="mx-auto mt-6 max-w-3xl">
          <nav className="flex items-center justify-center gap-2 overflow-x-auto py-2">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                disabled={step.id > currentStep}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors",
                  currentStep === step.id
                    ? "bg-primary text-primary-foreground"
                    : currentStep > step.id
                      ? "bg-primary/20 text-primary cursor-pointer hover:bg-primary/30"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="size-4" />
                ) : (
                  <step.icon className="size-4" />
                )}
                <span className="hidden sm:inline">{step.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Form Content */}
        <div className="mx-auto mt-8 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {React.createElement(steps[currentStep - 1].icon, { className: "size-5" })}
                {steps[currentStep - 1].name}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Tell us about yourself and your professional background."}
                {currentStep === 2 && "Provide details about your practice and location."}
                {currentStep === 3 && "What services do you offer and how do you charge?"}
                {currentStep === 4 && "Help clients get to know you better."}
                {currentStep === 5 && "Add a professional photo to build trust with clients."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name *</Label>
                    <Input
                      id="displayName"
                      placeholder="e.g., Sarah Mitchell, CFP"
                      value={formData.displayName}
                      onChange={(e) => updateFormData("displayName", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      This is how clients will see your name on your profile
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearsExperience">Years of Experience *</Label>
                    <Select
                      value={formData.yearsExperience}
                      onValueChange={(value) => updateFormData("yearsExperience", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select years of experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="4-7">4-7 years</SelectItem>
                        <SelectItem value="8-15">8-15 years</SelectItem>
                        <SelectItem value="15-25">15-25 years</SelectItem>
                        <SelectItem value="25+">25+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Qualifications & Certifications</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., CFP, CPA, FChFP"
                        value={newQualification}
                        onChange={(e) => setNewQualification(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddQualification())}
                      />
                      <Button type="button" onClick={handleAddQualification} size="icon">
                        <Plus className="size-4" />
                      </Button>
                    </div>
                    {formData.qualifications.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.qualifications.map((qual) => (
                          <span
                            key={qual}
                            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                          >
                            {qual}
                            <button
                              type="button"
                              onClick={() => handleRemoveQualification(qual)}
                              className="hover:text-destructive"
                            >
                              <X className="size-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Step 2: Practice Details */}
              {currentStep === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="practiceType">Practice Type *</Label>
                    <Select
                      value={formData.practiceType}
                      onValueChange={(value) => updateFormData("practiceType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select practice type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="independent">Independent Practice</SelectItem>
                        <SelectItem value="licensee">Licensee Group</SelectItem>
                        <SelectItem value="bank">Bank or Institution</SelectItem>
                        <SelectItem value="accounting">Accounting Firm</SelectItem>
                        <SelectItem value="boutique">Boutique Firm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="firmName">Firm/Practice Name *</Label>
                    <Input
                      id="firmName"
                      placeholder="Your firm or practice name"
                      value={formData.firmName}
                      onChange={(e) => updateFormData("firmName", e.target.value)}
                      leftIcon={<Building2 className="size-4" />}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="streetAddress">Street Address</Label>
                    <Input
                      id="streetAddress"
                      placeholder="123 Business Street, Suite 100"
                      value={formData.streetAddress}
                      onChange={(e) => updateFormData("streetAddress", e.target.value)}
                      leftIcon={<MapPin className="size-4" />}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="suburb">Suburb</Label>
                      <Input
                        id="suburb"
                        placeholder="Sydney"
                        value={formData.suburb}
                        onChange={(e) => updateFormData("suburb", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Select
                        value={formData.state}
                        onValueChange={(value) => updateFormData("state", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="State" />
                        </SelectTrigger>
                        <SelectContent>
                          {australianStates.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postcode">Postcode *</Label>
                      <Input
                        id="postcode"
                        placeholder="2000"
                        value={formData.postcode}
                        onChange={(e) => updateFormData("postcode", e.target.value)}
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="+61 XXX XXX XXX"
                        value={formData.phoneNumber}
                        onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="websiteUrl">Website URL</Label>
                      <Input
                        id="websiteUrl"
                        type="url"
                        placeholder="https://yourwebsite.com.au"
                        value={formData.websiteUrl}
                        onChange={(e) => updateFormData("websiteUrl", e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Step 3: Services & Fees */}
              {currentStep === 3 && (
                <>
                  <div className="space-y-3">
                    <Label>Specializations * (Select up to 6)</Label>
                    <p className="text-sm text-muted-foreground">
                      {formData.selectedSpecializations.length}/6 selected
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {specializations.map((spec) => (
                        <button
                          key={spec}
                          type="button"
                          onClick={() => toggleSpecialization(spec)}
                          className={cn(
                            "flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition-all",
                            formData.selectedSpecializations.includes(spec)
                              ? "border-primary bg-primary/5 text-foreground"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <div
                            className={cn(
                              "flex size-5 shrink-0 items-center justify-center rounded-full border",
                              formData.selectedSpecializations.includes(spec)
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted-foreground/30"
                            )}
                          >
                            {formData.selectedSpecializations.includes(spec) && (
                              <Check className="size-3" />
                            )}
                          </div>
                          {spec}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feeStructure">Fee Structure *</Label>
                    <Select
                      value={formData.feeStructure}
                      onValueChange={(value) => updateFormData("feeStructure", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="How do you charge for services?" />
                      </SelectTrigger>
                      <SelectContent>
                        {feeStructures.map((fee) => (
                          <SelectItem key={fee.value} value={fee.value}>
                            {fee.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="minimumInvestment">Minimum Investment Amount</Label>
                      <Input
                        id="minimumInvestment"
                        placeholder="e.g., $100,000"
                        value={formData.minimumInvestment}
                        onChange={(e) => updateFormData("minimumInvestment", e.target.value)}
                        leftIcon={<DollarSign className="size-4" />}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="initialConsultationFee">Initial Consultation Fee</Label>
                      <Input
                        id="initialConsultationFee"
                        placeholder="e.g., Free or $200"
                        value={formData.initialConsultationFee}
                        onChange={(e) => updateFormData("initialConsultationFee", e.target.value)}
                        leftIcon={<DollarSign className="size-4" />}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Step 4: About You */}
              {currentStep === 4 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio * (min 100 characters)</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell potential clients about your background, experience, and what drives you as an advisor..."
                      value={formData.bio}
                      onChange={(e) => updateFormData("bio", e.target.value)}
                      rows={5}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.bio.length}/100 characters minimum
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="approachToAdvice">Your Approach to Financial Advice</Label>
                    <Textarea
                      id="approachToAdvice"
                      placeholder="Describe your philosophy and approach to working with clients..."
                      value={formData.approachToAdvice}
                      onChange={(e) => updateFormData("approachToAdvice", e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <h4 className="font-medium text-foreground mb-2">Tips for a Great Bio</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>- Be authentic and let your personality shine through</li>
                      <li>- Highlight what makes you unique as an advisor</li>
                      <li>- Mention your ideal client or who you work best with</li>
                      <li>- Keep it professional but approachable</li>
                    </ul>
                  </div>
                </>
              )}

              {/* Step 5: Profile Photo */}
              {currentStep === 5 && (
                <>
                  <div className="space-y-4">
                    <div className="flex flex-col items-center gap-4">
                      {formData.profilePhoto ? (
                        <div className="relative">
                          <div className="size-32 overflow-hidden rounded-full border-4 border-primary/20">
                            <img
                              src={URL.createObjectURL(formData.profilePhoto)}
                              alt="Profile preview"
                              className="size-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => updateFormData("profilePhoto", null)}
                            className="absolute -right-1 -top-1 flex size-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex size-32 items-center justify-center rounded-full border-2 border-dashed border-border bg-muted">
                          <Camera className="size-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <FileUpload
                      accept=".jpg,.jpeg,.png"
                      maxSize={5}
                      onChange={(files) => updateFormData("profilePhoto", files[0] || null)}
                      placeholder="Upload a professional headshot"
                    />

                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <h4 className="font-medium text-foreground mb-2">Photo Guidelines</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <Check className="size-4 text-primary" />
                          Use a recent, professional headshot
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="size-4 text-primary" />
                          Ensure good lighting and a neutral background
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="size-4 text-primary" />
                          Face should be clearly visible and centered
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="size-4 text-primary" />
                          Recommended size: 400x400 pixels or larger
                        </li>
                      </ul>
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 1 || isLoading}
                >
                  <ArrowLeft className="mr-2 size-4" />
                  Back
                </Button>

                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed() || isLoading}
                  loading={isLoading}
                >
                  {currentStep === 5 ? (
                    isLoading ? "Completing..." : "Complete Setup"
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="ml-2 size-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Text */}
        <div className="mx-auto mt-6 max-w-2xl text-center">
          <p className="text-sm text-muted-foreground">
            You can always update this information later from your profile settings.{" "}
            <Link href="/help" className="text-primary hover:underline">
              Need help?
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
