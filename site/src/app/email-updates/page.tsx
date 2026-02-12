"use client"

import { Bell, ChevronDown, Mail } from "lucide-react"
import { useState } from "react"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { publicBusiness } from "@/lib/public-business"

export default function EmailUpdatesPage() {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [interest, setInterest] = useState("")
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.trim()) {
      setError("Please enter your email address.")
      return
    }

    if (!interest) {
      setError("Please choose what you're interested in.")
      return
    }

    if (!consent) {
      setError("Please confirm consent before signing up.")
      return
    }

    setError(null)

    const subject = "Email updates sign up"
    const body = [
      "Please sign me up for email updates.",
      "",
      `Email: ${email.trim()}`,
      `First name: ${firstName.trim() || "-"}`,
      `Last name: ${lastName.trim() || "-"}`,
      `Interested in: ${interest}`,
      `Consent provided: ${consent ? "Yes" : "No"}`,
    ].join("\n")

    window.location.href = `mailto:${publicBusiness.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <PublicLayout>
      <section className="py-20 lg:py-28 bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-stretch">
            <Card className="border-border/80 shadow-md">
              <CardContent className="p-8 md:p-10">
                <div className="mb-8">
                  <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <Bell className="size-3.5" />
                    Email updates
                  </p>
                  <h1 className="mt-4 text-3xl md:text-4xl font-semibold text-foreground">
                    Receive the latest news and tips
                  </h1>
                  <p className="mt-3 text-muted-foreground max-w-xl">
                    Get practical financial guides, marketplace updates, and useful advice content for Aussies.
                  </p>
                </div>

                <form className="space-y-4" onSubmit={onSubmit}>
                  <div>
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="mt-1 h-12"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName">First name</Label>
                      <Input
                        id="firstName"
                        placeholder="First name"
                        autoComplete="given-name"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        className="mt-1 h-12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last name</Label>
                      <Input
                        id="lastName"
                        placeholder="Last name"
                        autoComplete="family-name"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        className="mt-1 h-12"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <Label htmlFor="interest">I&apos;m interested in</Label>
                    <select
                      id="interest"
                      value={interest}
                      onChange={(event) => setInterest(event.target.value)}
                      className="mt-1 h-12 w-full appearance-none rounded-md border border-input bg-background px-3 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                    >
                      <option value="">Select a topic</option>
                      <option value="retirement planning">Retirement planning</option>
                      <option value="wealth management">Wealth management</option>
                      <option value="mortgage and property">Mortgage and property</option>
                      <option value="tax and business">Tax and business</option>
                      <option value="general financial tips">General financial tips</option>
                    </select>
                    <ChevronDown
                      aria-hidden="true"
                      className="pointer-events-none absolute right-3 top-[calc(50%+0.7rem)] size-4 -translate-y-1/2 text-muted-foreground"
                    />
                  </div>

                  <label className="flex items-start gap-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(event) => setConsent(event.target.checked)}
                      className="mt-1 size-4 rounded border-border bg-background"
                    />
                    <span>
                      I consent to Advyser storing and processing my data in accordance with the{" "}
                      <a className="underline underline-offset-4 hover:text-foreground" href="/privacy">
                        privacy policy
                      </a>.
                    </span>
                  </label>

                  {error ? <p className="text-sm text-destructive">{error}</p> : null}

                  <Button type="submit" size="lg" className="h-12 w-full sm:w-auto">
                    <Mail className="size-4" />
                    Sign up
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    This opens your email app to send your signup request. You can withdraw consent any time by contacting{" "}
                    <a
                      className="underline underline-offset-4 hover:text-foreground"
                      href={`mailto:${publicBusiness.supportEmail}`}
                    >
                      {publicBusiness.supportEmail}
                    </a>.
                  </p>
                </form>
              </CardContent>
            </Card>

            <Card className="border-border/80 shadow-sm bg-muted/30">
              <CardContent className="h-full p-8 md:p-10 flex flex-col justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">What you&apos;ll receive</p>
                  <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                    <li>New guides and practical explainers</li>
                    <li>Market and category updates from the marketplace</li>
                    <li>Tips to prepare for your first advisor conversation</li>
                  </ul>
                </div>

                <div className="mt-8 rounded-xl border border-border bg-background p-5">
                  <p className="text-sm font-medium text-foreground">No spam promise</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We send useful updates only. Unsubscribe anytime via email footer links.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
