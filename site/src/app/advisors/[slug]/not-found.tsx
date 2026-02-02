import Link from "next/link"
import { UserX, Search, ArrowLeft } from "lucide-react"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"

/**
 * 404 Not Found page for advisor profiles.
 * Displayed when an advisor slug does not match any existing advisor.
 * Provides helpful navigation options back to search.
 */
export default function AdvisorNotFound() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
          {/* Icon */}
          <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-6">
            <UserX className="size-8 text-muted-foreground" />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Advisor Not Found
          </h1>

          {/* Description */}
          <p className="text-muted-foreground mb-8">
            We could not find the advisor you are looking for. They may have moved
            or the link might be incorrect. Try searching for advisors instead.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button asChild>
              <Link href="/search">
                <Search className="size-4" />
                Search Advisors
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="size-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-sm text-muted-foreground mt-8">
            Need help?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </PublicLayout>
  )
}
