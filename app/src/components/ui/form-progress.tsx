"use client"

import { Check } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

interface FormProgressProps {
  currentStep: number
  totalSteps: number
  labels?: string[]
  className?: string
}

export function FormProgress({ currentStep, totalSteps, labels, className }: FormProgressProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Text indicator */}
      <p className="text-sm text-muted-foreground mb-3">
        Step {currentStep} of {totalSteps}
      </p>

      {/* Visual progress bar */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1
          const isComplete = stepNum < currentStep
          const isCurrent = stepNum === currentStep

          return (
            <React.Fragment key={stepNum}>
              {/* Step circle */}
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  isComplete && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2",
                  !isComplete && !isCurrent && "bg-muted text-muted-foreground"
                )}
              >
                {isComplete ? <Check className="size-4" /> : stepNum}
              </div>

              {/* Connector line */}
              {stepNum < totalSteps && (
                <div
                  className={cn(
                    "h-0.5 flex-1",
                    stepNum < currentStep ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Optional labels */}
      {labels && labels.length === totalSteps && (
        <div className="flex justify-between mt-2">
          {labels.map((label, index) => (
            <span
              key={label}
              className={cn(
                "text-xs",
                index + 1 <= currentStep ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
