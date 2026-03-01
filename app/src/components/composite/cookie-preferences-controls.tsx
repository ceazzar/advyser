"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  type CookieConsentChoice,
  readCookieConsent,
  writeCookieConsent,
} from "@/lib/cookie-consent"

const choiceLabel: Record<CookieConsentChoice, string> = {
  accepted: "Accepted all optional storage",
  essential: "Essential-only mode",
}

export function CookiePreferencesControls() {
  const [choice, setChoice] = React.useState<CookieConsentChoice | null>(null)

  React.useEffect(() => {
    setChoice(readCookieConsent()?.choice ?? null)
  }, [])

  const updateChoice = (nextChoice: CookieConsentChoice) => {
    writeCookieConsent(nextChoice)
    setChoice(nextChoice)
  }

  return (
    <div className="rounded-lg border bg-muted/20 p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-foreground">Current preference:</span>
        <Badge className="border border-border bg-background text-foreground">
          {choice ? choiceLabel[choice] : "No preference selected yet"}
        </Badge>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        You can update your cookie preference at any time. Essential storage keeps the site
        secure and remembers your consent choice.
      </p>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={choice === "essential" ? "default" : "outline"}
          onClick={() => updateChoice("essential")}
        >
          Essential only
        </Button>
        <Button
          type="button"
          variant={choice === "accepted" ? "default" : "outline"}
          onClick={() => updateChoice("accepted")}
        >
          Accept optional storage
        </Button>
      </div>
    </div>
  )
}
