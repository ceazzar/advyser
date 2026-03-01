"use client"

import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  X,
  XCircle,
} from "lucide-react"
import { toast as sonnerToast, Toaster as Sonner, type ToasterProps } from "sonner"

import { cn } from "@/lib/utils"

/**
 * Toast Component (0.35)
 *
 * A notification system built on Sonner with Advyser styling.
 *
 * Features:
 * - Success, error, warning, info variants
 * - Icon on left
 * - Message text
 * - Optional action button
 * - Close button
 * - Auto-dismiss after 5 seconds
 * - Stacks in bottom-right corner
 * - Slide-in animation
 */

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="bottom-right"
      duration={5000}
      gap={12}
      closeButton
      icons={{
        success: <CheckCircle2 className="size-5 text-green-600" />,
        error: <XCircle className="size-5 text-red-600" />,
        warning: <AlertTriangle className="size-5 text-yellow-600" />,
        info: <Info className="size-5 text-blue-600" />,
        loading: <Loader2 className="size-5 animate-spin text-primary" />,
        close: <X className="size-4" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: cn(
            // Base styles
            "group flex items-start gap-3 p-4 rounded-md shadow-md border w-[356px]",
            // Background
            "bg-popover text-popover-foreground",
            // Animation: slide in from right
            "data-[state=open]:animate-in data-[state=open]:slide-in-from-right-full",
            "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-full",
            "data-[state=closed]:fade-out-80",
            "duration-300"
          ),
          title: "text-sm font-medium text-foreground",
          description: "text-sm text-muted-foreground mt-1",
          actionButton: cn(
            "ml-auto shrink-0 rounded-md px-3 py-1.5 text-sm font-medium",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          ),
          cancelButton: cn(
            "ml-auto shrink-0 rounded-md px-3 py-1.5 text-sm font-medium",
            "bg-muted text-muted-foreground hover:bg-muted/80",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          ),
          closeButton: cn(
            "absolute right-2 top-2 rounded-md p-1",
            "text-muted-foreground hover:text-foreground",
            "opacity-0 group-hover:opacity-100 transition-opacity",
            "focus:outline-none focus:ring-2 focus:ring-ring"
          ),
          success: "border-green-200 bg-green-50",
          error: "border-red-200 bg-red-50",
          warning: "border-yellow-200 bg-yellow-50",
          info: "border-blue-200 bg-blue-50",
          loading: "border-border bg-popover",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

/**
 * Toast helper functions
 *
 * Usage:
 * ```tsx
 * import { toast } from "@/components/ui/sonner"
 *
 * // Simple usage
 * toast.success("Changes saved successfully")
 * toast.error("Something went wrong")
 * toast.warning("Please review your input")
 * toast.info("New updates available")
 *
 * // With description
 * toast.success("Profile updated", {
 *   description: "Your changes have been saved."
 * })
 *
 * // With action button
 * toast.error("Failed to save", {
 *   action: {
 *     label: "Retry",
 *     onClick: () => handleRetry()
 *   }
 * })
 *
 * // With custom duration
 * toast.info("Processing...", { duration: 10000 })
 *
 * // Promise-based toast
 * toast.promise(saveData(), {
 *   loading: "Saving...",
 *   success: "Data saved!",
 *   error: "Failed to save"
 * })
 * ```
 */
const toast = {
  /**
   * Show a success toast
   */
  success: (message: string, options?: Parameters<typeof sonnerToast.success>[1]) => {
    return sonnerToast.success(message, options)
  },

  /**
   * Show an error toast
   */
  error: (message: string, options?: Parameters<typeof sonnerToast.error>[1]) => {
    return sonnerToast.error(message, options)
  },

  /**
   * Show a warning toast
   */
  warning: (message: string, options?: Parameters<typeof sonnerToast.warning>[1]) => {
    return sonnerToast.warning(message, options)
  },

  /**
   * Show an info toast
   */
  info: (message: string, options?: Parameters<typeof sonnerToast.info>[1]) => {
    return sonnerToast.info(message, options)
  },

  /**
   * Show a loading toast
   */
  loading: (message: string, options?: Parameters<typeof sonnerToast.loading>[1]) => {
    return sonnerToast.loading(message, options)
  },

  /**
   * Show a promise-based toast that updates based on promise state
   */
  promise: <T,>(
    promise: Promise<T> | (() => Promise<T>),
    options: Parameters<typeof sonnerToast.promise<T>>[1]
  ) => {
    return sonnerToast.promise(promise, options)
  },

  /**
   * Show a default toast (neutral styling)
   */
  message: (message: string, options?: Parameters<typeof sonnerToast>[1]) => {
    return sonnerToast(message, options)
  },

  /**
   * Dismiss a specific toast or all toasts
   */
  dismiss: (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId)
  },

  /**
   * Show a custom toast with full control over content
   */
  custom: (jsx: React.ReactElement, options?: Parameters<typeof sonnerToast.custom>[1]) => {
    return sonnerToast.custom(() => jsx, options)
  },
}

export { toast,Toaster }
