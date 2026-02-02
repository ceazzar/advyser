import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border border-transparent px-2.5 py-0.5 font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors",
  {
    variants: {
      status: {
        pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
        active: "bg-green-100 text-green-800 border-green-200",
        inactive: "bg-gray-100 text-gray-600 border-gray-200",
        verified: "bg-emerald-50 text-emerald-700 border-emerald-200",  /* softer green, differentiated from active */
      },
      userRole: {
        admin: "bg-purple-100 text-purple-800 border-purple-200",
        advisor: "bg-blue-100 text-blue-800 border-blue-200",
        consumer: "bg-slate-100 text-slate-700 border-slate-200",
      },
      leadStatus: {
        new: "bg-blue-100 text-blue-800 border-blue-200",
        contacted: "bg-yellow-100 text-yellow-800 border-yellow-200",
        converted: "bg-green-100 text-green-800 border-green-200",
        declined: "bg-red-100 text-red-800 border-red-200",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        default: "text-sm px-2.5 py-0.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'role'>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

function Badge({
  className,
  status,
  userRole,
  leadStatus,
  size,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ status, userRole, leadStatus, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
