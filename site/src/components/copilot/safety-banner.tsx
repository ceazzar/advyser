"use client"

import * as React from "react"
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type ComplianceStatus = "compliant" | "review-required" | "warning"

export interface CopilotSafetyBannerProps {
  /** Whether to show the banner (controlled) */
  showWarning?: boolean
  /** Compliance status indicator */
  complianceStatus?: ComplianceStatus
  /** Whether the banner can be dismissed for the session */
  dismissable?: boolean
  /** Callback when banner is dismissed */
  onDismiss?: () => void
  /** Custom warning message */
  message?: string
  /** Custom description */
  description?: string
  className?: string
}

const STATUS_CONFIG: Record<
  ComplianceStatus,
  {
    icon: React.ReactNode
    label: string
    className: string
  }
> = {
  compliant: {
    icon: <CheckCircle className="size-4" />,
    label: "Passed",
    className: "text-green-600",
  },
  "review-required": {
    icon: <Info className="size-4" />,
    label: "Needs Review",
    className: "text-blue-600",
  },
  warning: {
    icon: <AlertTriangle className="size-4" />,
    label: "Attention",
    className: "text-amber-600",
  },
}

function CopilotSafetyBanner({
  showWarning = true,
  complianceStatus = "review-required",
  dismissable = true,
  onDismiss,
  message = "AI-Generated Draft - Requires Your Review Before Use",
  description = "This output is for advisor reference only. Do not share directly with clients without review.",
  className,
}: CopilotSafetyBannerProps) {
  const [isDismissed, setIsDismissed] = React.useState(false)

  // Reset dismissed state on page reload (handled by React state reset)
  if (!showWarning || isDismissed) return null

  const statusConfig = STATUS_CONFIG[complianceStatus]

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
  }

  return (
    <div
      data-slot="copilot-safety-banner"
      role="alert"
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-md",
        "bg-amber-500/10 border border-amber-500/20",
        className
      )}
    >
      {/* Warning Icon */}
      <AlertTriangle className="size-5 text-amber-600 shrink-0" />

      {/* Main Message */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">
          {message}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {description}
        </p>
      </div>

      {/* Compliance Status Indicator */}
      <div
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0",
          "bg-background border border-border",
          statusConfig.className
        )}
      >
        {statusConfig.icon}
        <span>{statusConfig.label}</span>
      </div>

      {/* Dismiss Button */}
      {dismissable && (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleDismiss}
          className="shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Dismiss warning"
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  )
}

export { CopilotSafetyBanner }
