"use client"

import { ExternalLink,ShieldCheck } from "lucide-react"
import * as React from "react"

/**
 * Icon Optical Sizing:
 * - ShieldCheck (hybrid icon with fill): size-4/size-5 based on variant - no optical correction needed
 * - ExternalLink (stroke): size-3 (12px) for compact link context
 */
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export interface VerificationBadgeProps {
  /** ASIC license number to display */
  licenseNumber?: string
  /**
   * Display variant:
   * - compact: Icon only with tooltip
   * - full: Icon + text + tooltip (default)
   */
  variant?: "compact" | "full"
  /** Additional CSS classes */
  className?: string
}

const ASIC_REGISTER_URL =
  "https://moneysmart.gov.au/financial-advice/financial-advisers-register"

function VerificationBadge({
  licenseNumber,
  variant = "full",
  className,
}: VerificationBadgeProps) {
  const isCompact = variant === "compact"

  const badgeContent = (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 transition-all duration-200",
        "text-primary cursor-help",
        "hover:opacity-80",
        isCompact ? "p-1" : "px-2.5 py-1 rounded-full bg-primary/10",
        className
      )}
    >
      <ShieldCheck
        className={cn(
          "shrink-0 fill-primary/20",
          isCompact ? "size-5" : "size-4"
        )}
      />
      {!isCompact && (
        <>
          <span className="text-sm font-medium">ASIC Verified</span>
          {licenseNumber && (
            <span className="text-sm text-primary/70">#{licenseNumber}</span>
          )}
        </>
      )}
    </div>
  )

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 rounded-full"
          aria-label={
            isCompact
              ? `ASIC Verified${licenseNumber ? ` - License #${licenseNumber}` : ""}`
              : undefined
          }
        >
          {badgeContent}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={8}
        className="max-w-xs bg-background text-foreground border border-border shadow-lg p-3 rounded-lg"
      >
        <div className="space-y-2.5">
          <div className="flex items-start gap-2">
            <ShieldCheck className="size-5 text-primary fill-primary/20 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                ASIC Verified Advisor
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This advisor&apos;s license has been verified on the ASIC
                Financial Advisers Register.
              </p>
            </div>
          </div>
          {licenseNumber && (
            <div className="pl-7">
              <p className="text-xs text-muted-foreground">
                License Number:{" "}
                <span className="font-medium text-foreground">{licenseNumber}</span>
              </p>
            </div>
          )}
          <div className="pl-7 pt-1">
            <a
              href={ASIC_REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 hover:underline transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              View ASIC Register
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

export { VerificationBadge }
