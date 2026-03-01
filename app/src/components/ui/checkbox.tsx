"use client"

import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Touch target wrapper - min 44px hit area (WCAG 2.5.5)
        "relative min-h-11 min-w-11 flex items-center justify-center",
        // Visual checkbox styles (inner square)
        "before:content-[''] before:absolute before:size-5 before:rounded before:border-2 before:border-border",
        "before:bg-background before:transition-all before:duration-200",
        // Checked state - Neutral
        "data-[state=checked]:before:bg-primary data-[state=checked]:before:border-primary",
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
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-primary-foreground z-10"
      >
        <CheckIcon className="size-3.5 stroke-[3]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
