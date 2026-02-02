"use client"

import * as React from "react"
import { BadgeCheck, ExternalLink } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface VerificationBadgeProps {
  licenseNumber?: string
  variant?: "default" | "prominent"
  className?: string
}

const ASIC_REGISTER_URL =
  "https://moneysmart.gov.au/financial-advice/financial-advisers-register"

function VerificationBadge({
  licenseNumber,
  variant = "default",
  className,
}: VerificationBadgeProps) {
  const isProminent = variant === "prominent"

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          status="verified"
          size={isProminent ? "default" : "sm"}
          className={cn(
            "cursor-help transition-all duration-200",
            "hover:scale-105 hover:shadow-sm",
            isProminent && "px-3 py-1.5 text-sm gap-1.5",
            className
          )}
        >
          <BadgeCheck
            className={cn(
              "shrink-0",
              isProminent ? "size-4" : "size-3"
            )}
          />
          <span>ASIC Verified</span>
          {licenseNumber && isProminent && (
            <span className="text-primary/80 font-normal">
              #{licenseNumber}
            </span>
          )}
        </Badge>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-xs bg-background text-foreground border border-border shadow-lg p-3"
      >
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground leading-relaxed">
            This advisor&apos;s credentials have been verified against the ASIC
            Financial Adviser Register.
          </p>
          {licenseNumber && (
            <p className="text-xs text-muted-foreground">
              License Number: <span className="font-medium">{licenseNumber}</span>
            </p>
          )}
          <a
            href={ASIC_REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 hover:underline transition-colors"
          >
            View ASIC Register
            <ExternalLink className="size-3" />
          </a>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

export { VerificationBadge }
