"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  error?: boolean
  maxLength?: number
  showCount?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, maxLength, showCount, ...props }, ref) => {
    const [count, setCount] = React.useState(
      typeof props.defaultValue === "string" ? props.defaultValue.length : 0
    )

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCount(e.target.value.length)
      props.onChange?.(e)
    }

    return (
      <div className="relative">
        <textarea
          ref={ref}
          data-slot="textarea"
          maxLength={maxLength}
          className={cn(
            // Base styles - Filled (matching Input)
            "min-h-[100px] w-full rounded-md px-4 py-3 text-sm",
            "bg-input border border-transparent",
            "text-foreground placeholder:text-muted-foreground",
            "transition-all duration-200 outline-none resize-y",
            // Focus state - Visible ring (40% opacity for dark primary)
            "focus:border-primary focus:ring-2 focus:ring-primary/40",
            // Error state
            error && "border-destructive focus:border-destructive focus:ring-destructive/20",
            // Disabled state
            "disabled:cursor-not-allowed disabled:opacity-50",
            // Add padding for count
            showCount && maxLength && "pb-8",
            className
          )}
          onChange={handleChange}
          {...props}
        />
        {showCount && maxLength && (
          <span className="absolute bottom-3 right-3 text-xs text-muted-foreground">
            {count}/{maxLength}
          </span>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
