"use client"

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import * as React from "react"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        // Touch target wrapper - min 44px hit area (WCAG 2.5.5)
        "relative min-h-11 min-w-11 flex items-center justify-center",
        // Visual radio styles (inner circle)
        "before:content-[''] before:absolute before:size-5 before:rounded-full before:border-2 before:border-border",
        "before:bg-background before:transition-all before:duration-200",
        // Selected state - Neutral
        "data-[state=checked]:before:border-primary",
        // Focus state - Visible ring (40% opacity for dark primary)
        "focus-visible:outline-none focus-visible:before:ring-2 focus-visible:before:ring-primary/40 focus-visible:before:border-primary",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Shrink behavior
        "shrink-0",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center z-10"
      >
        <div className="size-2.5 rounded-full bg-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
