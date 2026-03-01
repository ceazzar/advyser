"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface DateTimePickerProps {
  value?: Date | null
  onChange?: (date: Date | null) => void
  minDate?: Date
  maxDate?: Date
  className?: string
  disabled?: boolean
  error?: boolean
}

function formatDateForInput(date: Date | null | undefined): string {
  if (!date) return ""
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function formatTimeForInput(date: Date | null | undefined): string {
  if (!date) return ""
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${hours}:${minutes}`
}

function formatDateDisplay(date: Date | null | undefined): string {
  if (!date) return ""
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const DateTimePicker = React.forwardRef<HTMLDivElement, DateTimePickerProps>(
  ({ value, onChange, minDate, maxDate, className, disabled, error }, ref) => {
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const dateStr = e.target.value
      if (!dateStr) {
        onChange?.(null)
        return
      }

      const [year, month, day] = dateStr.split("-").map(Number)
      const newDate = new Date(value || new Date())
      newDate.setFullYear(year, month - 1, day)
      onChange?.(newDate)
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const timeStr = e.target.value
      if (!timeStr) return

      const [hours, minutes] = timeStr.split(":").map(Number)
      const newDate = new Date(value || new Date())
      newDate.setHours(hours, minutes, 0, 0)
      onChange?.(newDate)
    }

    const inputBaseStyles = cn(
      "h-10 rounded-md px-3 text-sm",
      "bg-transparent border-2 border-foreground/20",
      "text-foreground placeholder:text-muted-foreground",
      "transition-all duration-200 outline-none",
      "focus:border-primary focus:ring-2 focus:ring-primary/20",
      error && "border-destructive focus:border-destructive focus:ring-destructive/20",
      disabled && "cursor-not-allowed opacity-50"
    )

    return (
      <div ref={ref} className={cn("flex flex-row gap-2", className)}>
        <div className="relative flex-1">
          <input
            type="date"
            value={formatDateForInput(value)}
            onChange={handleDateChange}
            min={minDate ? formatDateForInput(minDate) : undefined}
            max={maxDate ? formatDateForInput(maxDate) : undefined}
            disabled={disabled}
            className={cn(inputBaseStyles, "w-full")}
            aria-label="Date"
          />
          {value && (
            <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
              {formatDateDisplay(value)}
            </span>
          )}
        </div>
        <input
          type="time"
          value={formatTimeForInput(value)}
          onChange={handleTimeChange}
          disabled={disabled}
          className={cn(inputBaseStyles, "w-28")}
          aria-label="Time"
        />
      </div>
    )
  }
)
DateTimePicker.displayName = "DateTimePicker"

export { DateTimePicker }
