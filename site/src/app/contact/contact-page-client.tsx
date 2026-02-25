"use client"

import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Gavel,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { publicBusiness } from "@/lib/public-business"
import {
  supportContactSchema,
  type SupportContactTopic,
  supportContactTopics,
  supportTopicMeta,
} from "@/lib/support-contact"
import type { ApiResponse } from "@/types/api"

interface SupportContactResponse {
  ticketId: string
  topic: SupportContactTopic
  responseWindow: string
}

type FormState = {
  topic: SupportContactTopic
  name: string
  email: string
  message: string
  consent: boolean
}

const INITIAL_FORM_STATE: FormState = {
  topic: "consumer_support",
  name: "",
  email: "",
  message: "",
  consent: false,
}

const pathwayCards: Array<{
  id: "consumer" | "adviser" | "media"
  title: string
  description: string
  topic: SupportContactTopic
  icon: React.ReactNode
}> = [
  {
    id: "consumer",
    title: "Consumers",
    description: "Help with finding advisers, requests, and account support.",
    topic: "consumer_support",
    icon: <UserRound className="size-5" />,
  },
  {
    id: "adviser",
    title: "Advisers",
    description: "Questions about adviser onboarding, listings, and profile updates.",
    topic: "adviser_support",
    icon: <Briefcase className="size-5" />,
  },
  {
    id: "media",
    title: "Media / Legal",
    description: "Press enquiries, partnership requests, and legal correspondence.",
    topic: "media_legal",
    icon: <Gavel className="size-5" />,
  },
]

function firstErrorMessage(
  details: Record<string, string[]> | undefined,
  key: keyof FormState
): string | undefined {
  return details?.[key]?.[0]
}

export function ContactPageClient() {
  const [form, setForm] = React.useState<FormState>(INITIAL_FORM_STATE)
  const [fieldErrors, setFieldErrors] = React.useState<Partial<Record<keyof FormState, string>>>(
    {}
  )
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState<SupportContactResponse | null>(null)

  const currentTopicMeta = supportTopicMeta[form.topic]

  const contactChannels: Array<{
    label: string
    value: string
    href: string
    icon: React.ReactNode
    helper: string
  }> = [
    {
      label: "Support email",
      value: publicBusiness.supportEmail,
      href: `mailto:${publicBusiness.supportEmail}`,
      icon: <Mail className="size-5" />,
      helper: "General consumer and adviser support",
    },
    ...(publicBusiness.supportPhone
      ? [
          {
            label: "Support phone",
            value: publicBusiness.supportPhone,
            href: `tel:${publicBusiness.supportPhone.replace(/\s+/g, "")}`,
            icon: <Phone className="size-5" />,
            helper: publicBusiness.supportHours,
          },
        ]
      : []),
    {
      label: "Privacy officer",
      value: publicBusiness.privacyEmail,
      href: `mailto:${publicBusiness.privacyEmail}`,
      icon: <ShieldCheck className="size-5" />,
      helper: "APP access, correction, and deletion requests",
    },
  ]

  const handlePathwaySelect = (topic: SupportContactTopic) => {
    setForm((previous) => ({
      ...previous,
      topic,
    }))
    setFieldErrors((previous) => ({
      ...previous,
      topic: undefined,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)
    setFieldErrors({})

    const payload = {
      topic: form.topic,
      email: form.email.trim(),
      message: form.message.trim(),
      consent: form.consent,
      ...(form.name.trim() ? { name: form.name.trim() } : {}),
    }

    const parsedPayload = supportContactSchema.safeParse(payload)
    if (!parsedPayload.success) {
      const flattened = parsedPayload.error.flatten().fieldErrors
      setFieldErrors({
        topic: firstErrorMessage(flattened, "topic"),
        name: firstErrorMessage(flattened, "name"),
        email: firstErrorMessage(flattened, "email"),
        message: firstErrorMessage(flattened, "message"),
        consent: firstErrorMessage(flattened, "consent"),
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/support/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedPayload.data),
      })

      const result = (await response.json()) as ApiResponse<SupportContactResponse>

      if (!response.ok || !result.success || !result.data) {
        setSubmitError(result.error?.message || "Unable to submit your request right now.")
        setFieldErrors({
          topic: firstErrorMessage(result.error?.details, "topic"),
          name: firstErrorMessage(result.error?.details, "name"),
          email: firstErrorMessage(result.error?.details, "email"),
          message: firstErrorMessage(result.error?.details, "message"),
          consent: firstErrorMessage(result.error?.details, "consent"),
        })
        return
      }

      setSubmitted(result.data)
      setForm({
        ...INITIAL_FORM_STATE,
        topic: form.topic,
      })
    } catch {
      setSubmitError("Unable to submit your request right now.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PublicLayout>
      <section className="border-b bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MessageSquare className="size-7" />
          </div>
          <h1 className="text-4xl font-bold text-foreground md:text-5xl">Contact Advyser</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Choose the pathway that matches your request. We route messages to the right team
            to reduce delays.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Support hours: {publicBusiness.supportHours}
          </p>
        </div>
      </section>

      <section className="bg-muted/20 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Choose your pathway</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {pathwayCards.map((pathway) => {
              const isActive = form.topic === pathway.topic

              return (
                <button
                  key={pathway.id}
                  type="button"
                  className={`rounded-lg border p-5 text-left transition-colors ${
                    isActive
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                  onClick={() => handlePathwaySelect(pathway.topic)}
                >
                  <div className="mb-2 flex items-center gap-2 text-foreground">
                    {pathway.icon}
                    <span className="font-semibold">{pathway.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{pathway.description}</p>
                  <p className="mt-3 text-xs font-medium text-primary">
                    {supportTopicMeta[pathway.topic].responseWindow}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Send a request</CardTitle>
              <p className="text-sm text-muted-foreground">
                Topic SLA: {currentTopicMeta.responseWindow}
              </p>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 className="size-5" />
                    <p className="font-semibold">Request received</p>
                  </div>
                  <p className="text-sm text-emerald-800">
                    Ticket {submitted.ticketId}. Expected response: {submitted.responseWindow}.
                  </p>
                  <Button
                    className="mt-4"
                    variant="outline"
                    onClick={() => setSubmitted(null)}
                  >
                    Send another request
                  </Button>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic</Label>
                    <Select
                      value={form.topic}
                      onValueChange={(value) =>
                        setForm((previous) => ({
                          ...previous,
                          topic: value as SupportContactTopic,
                        }))
                      }
                    >
                      <SelectTrigger id="topic" error={Boolean(fieldErrors.topic)}>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {supportContactTopics.map((topic) => (
                          <SelectItem key={topic} value={topic}>
                            {supportTopicMeta[topic].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldErrors.topic ? (
                      <p className="text-sm text-destructive">{fieldErrors.topic}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Name (optional)</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          name: event.target.value,
                        }))
                      }
                      error={Boolean(fieldErrors.name)}
                    />
                    {fieldErrors.name ? (
                      <p className="text-sm text-destructive">{fieldErrors.name}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          email: event.target.value,
                        }))
                      }
                      error={Boolean(fieldErrors.email)}
                    />
                    {fieldErrors.email ? (
                      <p className="text-sm text-destructive">{fieldErrors.email}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={form.message}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          message: event.target.value,
                        }))
                      }
                      placeholder="Share enough detail so we can help without follow-up delays."
                      maxLength={2000}
                      showCount
                      error={Boolean(fieldErrors.message)}
                    />
                    {fieldErrors.message ? (
                      <p className="text-sm text-destructive">{fieldErrors.message}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-start gap-3 text-sm">
                      <Checkbox
                        checked={form.consent}
                        onCheckedChange={(value) =>
                          setForm((previous) => ({
                            ...previous,
                            consent: value === true,
                          }))
                        }
                        aria-invalid={Boolean(fieldErrors.consent)}
                      />
                      <span className="pt-2 text-muted-foreground">
                        I consent to Advyser handling this request in line with the{" "}
                        <Link href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>{" "}
                        and{" "}
                        <Link href="/disclaimer" className="text-primary hover:underline">
                          Disclaimer
                        </Link>
                        .
                      </span>
                    </label>
                    {fieldErrors.consent ? (
                      <p className="text-sm text-destructive">{fieldErrors.consent}</p>
                    ) : null}
                  </div>

                  {submitError ? (
                    <Alert variant="destructive">
                      <AlertCircle className="size-4" />
                      <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                  ) : null}

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit request"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Direct channels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactChannels.map((channel) => (
                  <div key={channel.label} className="rounded-md border p-3">
                    <div className="mb-1 flex items-center gap-2 text-foreground">
                      {channel.icon}
                      <span className="font-medium">{channel.label}</span>
                    </div>
                    <a href={channel.href} className="text-primary hover:underline">
                      {channel.value}
                    </a>
                    <p className="mt-1 text-xs text-muted-foreground">{channel.helper}</p>
                  </div>
                ))}

                {publicBusiness.legalAddress ? (
                  <p className="text-sm text-muted-foreground">
                    Postal: {publicBusiness.legalAddress}
                  </p>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Complaint escalation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  If your issue relates to advice outcomes, first use the adviser&apos;s internal
                  dispute process.
                </p>
                <p>
                  If unresolved, email{" "}
                  <a
                    href={`mailto:${publicBusiness.complaintsEmail}`}
                    className="text-primary hover:underline"
                  >
                    {publicBusiness.complaintsEmail}
                  </a>{" "}
                  and include dates, adviser name, and supporting records.
                </p>
                <p>
                  You may also escalate externally via{" "}
                  <a
                    href="https://www.afca.org.au/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    AFCA
                  </a>{" "}
                  and report misconduct concerns to{" "}
                  <a
                    href="https://asic.gov.au/for-consumers/how-to-complain/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    ASIC
                  </a>
                  .
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
