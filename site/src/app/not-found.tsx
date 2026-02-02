import Link from "next/link"

import { Button } from "@/components/ui/button"

/**
 * Global 404 Not Found page.
 * Displayed when a route does not match any existing page.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center text-center max-w-md">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Page not found
        </h1>

        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Button asChild>
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </div>
  )
}
