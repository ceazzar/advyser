"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  Building2,
  User,
  Mail,
  Phone,
  FileText,
  Shield,
  AlertCircle,
  Loader2,
} from "lucide-react"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FileUpload } from "@/components/ui/file-upload"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

// Mock advisor data (would come from API)
const mockAdvisorData = {
  id: "1",
  name: "Sarah Mitchell",
  company: "Mitchell Financial Services",
  afsLicense: "AFS001234",
  email: "sarah@mitchell-financial.com.au",
  location: "Sydney, NSW",
}

const steps = [
  { id: 1, name: "Confirm Identity", description: "Verify your details" },
  { id: 2, name: "Upload Documents", description: "Provide verification" },
  { id: 3, name: "Review & Submit", description: "Complete your claim" },
]

interface FormData {
  // Step 1 - Identity
  fullName: string
  email: string
  phone: string
  jobTitle: string
  companyName: string
  afsLicenseNumber: string
  // Step 2 - Documents
  documents: File[]
  // Step 3 - Review
  acceptTerms: boolean
  acceptPrivacy: boolean
  confirmAccuracy: boolean
  additionalNotes: string
}

interface FormErrors {
  fullName?: string
  email?: string
  phone?: string
  jobTitle?: string
  companyName?: string
  afsLicenseNumber?: string
  documents?: string
  acceptTerms?: string
  acceptPrivacy?: string
  confirmAccuracy?: string
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-center gap-2 md:gap-4">
        {steps.map((step, index) => (
          <li key={step.id} className="flex items-center">
            <div
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors md:px-4",
                currentStep === step.id
                  ? "bg-primary text-primary-foreground"
                  : currentStep > step.id
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-xs",
                  currentStep > step.id ? "bg-primary text-primary-foreground" : ""
                )}
              >
                {currentStep > step.id ? (
                  <Check className="size-4" />
                ) : (
                  step.id
                )}
              </span>
              <span className="hidden md:inline">{step.name}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 w-8 md:w-12",
                  currentStep > step.id ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default function ClaimFormPage() {
  const router = useRouter()
  const params = useParams()
  const advisorId = params.id as string

  const [currentStep, setCurrentStep] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState<FormData>({
    fullName: mockAdvisorData.name,
    email: "",
    phone: "",
    jobTitle: "",
    companyName: mockAdvisorData.company,
    afsLicenseNumber: mockAdvisorData.afsLicense,
    documents: [],
    acceptTerms: false,
    acceptPrivacy: false,
    confirmAccuracy: false,
    additionalNotes: "",
  })
  const [errors, setErrors] = React.useState<FormErrors>({})

  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Please enter a valid email address"
    return undefined
  }

  const validatePhone = (phone: string): string | undefined => {
    if (!phone) return "Phone number is required"
    const phoneRegex = /^[\d\s\-+()]{8,}$/
    if (!phoneRegex.test(phone)) return "Please enter a valid phone number"
    return undefined
  }

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    newErrors.email = validateEmail(formData.email)
    newErrors.phone = validatePhone(formData.phone)
    if (!formData.jobTitle.trim()) newErrors.jobTitle = "Job title is required"
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required"
    if (!formData.afsLicenseNumber.trim()) newErrors.afsLicenseNumber = "AFSL number is required"

    setErrors(newErrors)
    return !Object.values(newErrors).some(Boolean)
  }

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {}

    if (formData.documents.length === 0) {
      newErrors.documents = "Please upload at least one verification document"
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(Boolean)
  }

  const validateStep3 = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.acceptTerms) newErrors.acceptTerms = "You must accept the terms of service"
    if (!formData.acceptPrivacy) newErrors.acceptPrivacy = "You must accept the privacy policy"
    if (!formData.confirmAccuracy) newErrors.confirmAccuracy = "You must confirm the accuracy of information"

    setErrors(newErrors)
    return !Object.values(newErrors).some(Boolean)
  }

  const handleNext = () => {
    let isValid = false

    if (currentStep === 1) isValid = validateStep1()
    else if (currentStep === 2) isValid = validateStep2()
    else if (currentStep === 3) isValid = validateStep3()

    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1)
      setErrors({})
    } else if (isValid && currentStep === 3) {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setErrors({})
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect to pending page
    router.push("/claim/pending")
  }

  const updateFormData = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user updates field
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Back Link */}
        <Link
          href="/claim"
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to search
        </Link>

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Claim Your Profile
          </h1>
          <p className="mt-2 text-muted-foreground">
            Complete the verification process to claim {mockAdvisorData.name}&apos;s profile
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mx-auto mt-6 max-w-md">
          <Progress value={(currentStep / 3) * 100} className="h-2" />
        </div>

        {/* Step Indicator */}
        <div className="mt-6">
          <StepIndicator currentStep={currentStep} />
        </div>

        {/* Form Card */}
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].name}</CardTitle>
              <CardDescription>{steps[currentStep - 1].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Confirm Identity */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <Alert>
                    <Shield className="size-4" />
                    <AlertTitle>Profile Information</AlertTitle>
                    <AlertDescription>
                      We&apos;ve pre-filled some details from the existing profile. Please verify and complete the remaining information.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => updateFormData("fullName", e.target.value)}
                        leftIcon={<User className="size-4" />}
                        error={!!errors.fullName}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-destructive">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title *</Label>
                      <Input
                        id="jobTitle"
                        placeholder="e.g., Financial Advisor"
                        value={formData.jobTitle}
                        onChange={(e) => updateFormData("jobTitle", e.target.value)}
                        error={!!errors.jobTitle}
                      />
                      {errors.jobTitle && (
                        <p className="text-sm text-destructive">{errors.jobTitle}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Professional Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.name@company.com.au"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      leftIcon={<Mail className="size-4" />}
                      error={!!errors.email}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Use your professional email to help verify your identity
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+61 XXX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      leftIcon={<Phone className="size-4" />}
                      error={!!errors.phone}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone}</p>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => updateFormData("companyName", e.target.value)}
                        leftIcon={<Building2 className="size-4" />}
                        error={!!errors.companyName}
                      />
                      {errors.companyName && (
                        <p className="text-sm text-destructive">{errors.companyName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="afsLicenseNumber">AFSL Number *</Label>
                      <Input
                        id="afsLicenseNumber"
                        value={formData.afsLicenseNumber}
                        onChange={(e) => updateFormData("afsLicenseNumber", e.target.value)}
                        leftIcon={<FileText className="size-4" />}
                        error={!!errors.afsLicenseNumber}
                      />
                      {errors.afsLicenseNumber && (
                        <p className="text-sm text-destructive">{errors.afsLicenseNumber}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Upload Documents */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <Alert>
                    <FileText className="size-4" />
                    <AlertTitle>Verification Documents</AlertTitle>
                    <AlertDescription>
                      Upload documents to verify your identity and authorization to represent this advisor profile.
                      Accepted documents include government ID, AFSL certificate, or company letterhead.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label>Upload Verification Documents *</Label>
                    <FileUpload
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                      maxSize={10}
                      onChange={(files) => updateFormData("documents", files)}
                      placeholder="Drag and drop your documents here, or click to browse"
                    />
                    {errors.documents && (
                      <p className="text-sm text-destructive">{errors.documents}</p>
                    )}
                    <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
                      <h4 className="text-sm font-medium text-foreground mb-2">Accepted Documents:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <Check className="size-4 text-primary" />
                          Valid government-issued photo ID (Driver&apos;s license, Passport)
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="size-4 text-primary" />
                          AFSL certificate or representative authorization
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="size-4 text-primary" />
                          Company letterhead confirming employment
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="size-4 text-primary" />
                          Professional membership certificate
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Submit */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <h4 className="font-medium text-foreground mb-4">Review Your Information</h4>
                    <dl className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Full Name</dt>
                        <dd className="font-medium">{formData.fullName}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Email</dt>
                        <dd className="font-medium">{formData.email}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Phone</dt>
                        <dd className="font-medium">{formData.phone}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Job Title</dt>
                        <dd className="font-medium">{formData.jobTitle}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Company</dt>
                        <dd className="font-medium">{formData.companyName}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">AFSL Number</dt>
                        <dd className="font-medium">{formData.afsLicenseNumber}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Documents</dt>
                        <dd className="font-medium">{formData.documents.length} file(s) uploaded</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="additionalNotes"
                      placeholder="Any additional information to support your claim..."
                      value={formData.additionalNotes}
                      onChange={(e) => updateFormData("additionalNotes", e.target.value)}
                      rows={4}
                    />
                  </div>

                  {/* Agreements */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="acceptTerms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) => updateFormData("acceptTerms", checked === true)}
                        className="mt-0.5"
                      />
                      <div>
                        <Label htmlFor="acceptTerms" className="font-normal leading-relaxed">
                          I accept the{" "}
                          <Link href="/terms" className="text-primary hover:underline">
                            Terms of Service
                          </Link>{" "}
                          for claiming advisor profiles
                        </Label>
                        {errors.acceptTerms && (
                          <p className="text-sm text-destructive mt-1">{errors.acceptTerms}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="acceptPrivacy"
                        checked={formData.acceptPrivacy}
                        onCheckedChange={(checked) => updateFormData("acceptPrivacy", checked === true)}
                        className="mt-0.5"
                      />
                      <div>
                        <Label htmlFor="acceptPrivacy" className="font-normal leading-relaxed">
                          I accept the{" "}
                          <Link href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>{" "}
                          and consent to document verification
                        </Label>
                        {errors.acceptPrivacy && (
                          <p className="text-sm text-destructive mt-1">{errors.acceptPrivacy}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="confirmAccuracy"
                        checked={formData.confirmAccuracy}
                        onCheckedChange={(checked) => updateFormData("confirmAccuracy", checked === true)}
                        className="mt-0.5"
                      />
                      <div>
                        <Label htmlFor="confirmAccuracy" className="font-normal leading-relaxed">
                          I confirm that all information provided is accurate and I am authorized to claim this profile
                        </Label>
                        {errors.confirmAccuracy && (
                          <p className="text-sm text-destructive mt-1">{errors.confirmAccuracy}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertCircle className="size-4 text-yellow-600" />
                    <AlertTitle className="text-yellow-800">Verification Notice</AlertTitle>
                    <AlertDescription className="text-yellow-700">
                      Your claim will be reviewed by our team within 2-3 business days. You will receive an email notification once the review is complete.
                    </AlertDescription>
                  </Alert>
                </div>
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
                  loading={isLoading}
                >
                  {currentStep === 3 ? (
                    isLoading ? "Submitting..." : "Submit Claim"
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
      </div>
    </PublicLayout>
  )
}
