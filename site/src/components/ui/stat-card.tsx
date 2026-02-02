import * as React from "react"
import { ArrowUp, ArrowDown } from "lucide-react"

import { cn } from "@/lib/utils"

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  change?: {
    value: number
    type: "increase" | "decrease"
  }
  icon?: React.ReactNode
}

function StatCard({
  label,
  value,
  change,
  icon,
  className,
  ...props
}: StatCardProps) {
  return (
    <div
      data-slot="stat-card"
      className={cn(
        "bg-card text-card-foreground rounded-md border p-6 shadow-md",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="text-3xl font-bold">{value}</span>
          {change && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                change.type === "increase"
                  ? "text-green-600"
                  : "text-red-600"
              )}
            >
              {change.type === "increase" ? (
                <ArrowUp className="size-4" />
              ) : (
                <ArrowDown className="size-4" />
              )}
              <span>{Math.abs(change.value)}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-muted-foreground">{icon}</div>
        )}
      </div>
    </div>
  )
}

export { StatCard }
export type { StatCardProps }
