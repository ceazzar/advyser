import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          data-slot="input"
          className={cn(
            // Base styles - Bordered Dark (h-11 = 44px touch target)
            "h-11 w-full rounded-md px-4 text-sm",
            "bg-transparent border-2 border-foreground/20",
            "text-foreground placeholder:text-muted-foreground",
            "transition-colors duration-200 outline-none",
            // Focus state - Visible ring (40% opacity for dark primary)
            "focus:border-primary focus:ring-2 focus:ring-primary/40",
            // Error state
            error && "border-destructive focus:border-destructive focus:ring-destructive/20",
            // Disabled state
            "disabled:cursor-not-allowed disabled:opacity-50",
            // File input styles
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
            // Icon padding
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
