"use client"

import * as React from "react"
import { AlertTriangle, AlertCircle, Info } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type IconVariant = "warning" | "danger" | "info"

interface ConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "default" | "destructive"
  icon?: IconVariant
  onConfirm: () => void
}

const iconConfig: Record<
  IconVariant,
  { icon: React.ElementType; className: string; bgClassName: string }
> = {
  warning: {
    icon: AlertTriangle,
    className: "text-amber-600",
    bgClassName: "bg-amber-100",
  },
  danger: {
    icon: AlertCircle,
    className: "text-destructive",
    bgClassName: "bg-destructive/10",
  },
  info: {
    icon: Info,
    className: "text-primary",
    bgClassName: "bg-primary/10",
  },
}

function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  icon,
  onConfirm,
}: ConfirmationModalProps) {
  // Determine icon based on variant if not explicitly provided
  const resolvedIcon = icon ?? (variant === "destructive" ? "danger" : "info")
  const { icon: IconComponent, className: iconClassName, bgClassName } = iconConfig[resolvedIcon]

  const handleConfirm = React.useCallback(() => {
    onConfirm()
    onOpenChange(false)
  }, [onConfirm, onOpenChange])

  const handleCancel = React.useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  // Handle keyboard events for accessibility
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false)
      }
    },
    [onOpenChange]
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md backdrop-blur-sm"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader className="items-center sm:items-center text-center">
          {/* Icon */}
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-full mb-2",
              bgClassName
            )}
          >
            <IconComponent className={cn("size-6", iconClassName)} />
          </div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-center">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center gap-3 mt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="min-w-[100px]"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={handleConfirm}
            className="min-w-[100px]"
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ConfirmationModal }
export type { ConfirmationModalProps }
