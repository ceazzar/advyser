import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-8 text-center",
        className
      )}
    >
      {icon && (
        <div className="text-muted-foreground [&_svg]:size-12">{icon}</div>
      )}
      <div className="flex flex-col items-center gap-2">
        <h3 className="font-medium text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
        )}
      </div>
      {action && (
        <Button
          onClick={action.onClick}
          className="mt-2 rounded-md"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}

export { EmptyState, type EmptyStateProps }
