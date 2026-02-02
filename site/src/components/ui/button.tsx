import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        // Primary: Solid teal (your selection)
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        // Secondary: Soft teal
        secondary:
          "bg-primary/10 text-primary hover:bg-primary/20 active:bg-primary/25",
        // Outline: Teal border
        outline:
          "border-2 border-primary bg-transparent text-primary hover:bg-primary/5 active:bg-primary/10",
        // Ghost: No background
        ghost:
          "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground active:bg-muted/80",
        // Destructive: Red
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 active:bg-destructive/80",
        // Link style
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 min-h-11 px-4 py-2 rounded-md",
        xs: "h-11 min-h-11 px-2 text-xs rounded-md",
        sm: "h-11 min-h-11 px-3 text-xs rounded-md",
        lg: "h-12 min-h-12 px-6 text-base rounded-md",
        xl: "h-14 min-h-14 px-8 text-lg rounded-md",
        icon: "size-11 min-h-11 rounded-md",
        "icon-xs": "size-11 min-h-11 rounded-md [&_svg]:size-3",
        "icon-sm": "size-11 min-h-11 rounded-md",
        "icon-lg": "size-12 min-h-12 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    // When using asChild, we cannot add loader as a sibling
    // because Slot expects only one child
    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      )
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
