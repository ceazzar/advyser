"use client"

import Link from "next/link"
import { FileX, ArrowLeft, Inbox } from "lucide-react"

import { Button } from "@/components/ui/button"

/**
 * 404 Not Found page for lead details.
 * Displayed when a lead ID does not match any existing lead.
 * Provides navigation back to the leads inbox.
 */
export default function LeadNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* Icon */}
      <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-6">
        <FileX className="size-8 text-muted-foreground" />
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Lead Not Found
      </h1>

      {/* Description */}
      <p className="text-muted-foreground mb-8 max-w-sm">
        This lead could not be found. It may have been deleted, archived, or 
        the link might be incorrect.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild>
          <Link href="/advisor/leads">
            <Inbox className="size-4" />
            View All Leads
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/advisor">
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Additional Help */}
      <p className="text-sm text-muted-foreground mt-8">
        If you believe this is an error, please{" "}
        <Link href="/contact" className="text-primary hover:underline">
          contact support
        </Link>
      </p>
    </div>
  )
}
