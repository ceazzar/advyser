"use client"

import { Button } from "@/components/ui/button"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Global error boundary for the application.
 * Catches unhandled errors and provides recovery options.
 */
export default function GlobalError({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center text-center max-w-md">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Something went wrong
        </h1>

        <p className="text-muted-foreground mb-4">
          We encountered an unexpected error. Please try again.
        </p>

        {process.env.NODE_ENV === "development" && error.message && (
          <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded mb-4 font-mono">
            {error.message}
          </p>
        )}

        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}
