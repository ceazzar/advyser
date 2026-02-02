"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RefreshCw, Home, HelpCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Error boundary for the Consumer Dashboard section.
 * Catches errors specific to dashboard operations and provides
 * context-aware recovery options.
 */
export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Only log full details in development
    if (process.env.NODE_ENV === "development") {
      console.error("Dashboard error:", {
        message: error.message,
        digest: error.digest,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        location: "dashboard",
      })
    }
    // In production, you would send to error tracking service here
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 mb-4">
              <AlertTriangle className="size-7 text-destructive" />
            </div>

            {/* Heading */}
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Dashboard Error
            </h2>

            {/* Description */}
            <p className="text-muted-foreground mb-4 text-sm">
              We had trouble loading your dashboard. This might be a temporary
              issue with our servers.
            </p>

            {/* Error Reference */}
            {error.digest && (
              <div className="w-full mb-4 p-2 bg-muted rounded-md">
                <p className="text-xs text-muted-foreground font-mono">
                  Reference: {error.digest}
                </p>
              </div>
            )}

            {/* Primary Actions */}
            <div className="flex flex-col sm:flex-row gap-2 w-full mb-4">
              <Button onClick={reset} className="flex-1">
                <RefreshCw className="size-4" />
                Retry
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/">
                  <Home className="size-4" />
                  Home
                </Link>
              </Button>
            </div>

            {/* Help Link */}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/help">
                <HelpCircle className="size-4" />
                Get Help
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Things you can try:
        </p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>Refresh the page</li>
          <li>Check your internet connection</li>
          <li>Clear your browser cache</li>
        </ul>
      </div>
    </div>
  )
}
