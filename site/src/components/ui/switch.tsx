"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // Base styles
        "inline-flex h-6 w-11 shrink-0 items-center rounded-full",
        "border-2 border-transparent transition-all duration-200 outline-none",
        // Unchecked state
        "bg-muted",
        // Checked state - Teal
        "data-[state=checked]:bg-primary",
        // Focus state - Teal ring
        "focus-visible:ring-2 focus-visible:ring-primary/20",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-5 rounded-full bg-white shadow-md",
          "transition-transform duration-200",
          "data-[state=unchecked]:translate-x-0",
          "data-[state=checked]:translate-x-5"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
