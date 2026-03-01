"use client"

import { X } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TagInputProps {
  value?: string[]
  onChange?: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  className?: string
  disabled?: boolean
  error?: boolean
}

const TagInput = React.forwardRef<HTMLDivElement, TagInputProps>(
  (
    {
      value = [],
      onChange,
      placeholder = "Add tag...",
      maxTags,
      className,
      disabled,
      error,
    },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState("")
    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        addTag()
      } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
        removeTag(value.length - 1)
      }
    }

    const addTag = () => {
      const trimmed = inputValue.trim()
      if (!trimmed) return
      if (value.includes(trimmed)) {
        setInputValue("")
        return
      }
      if (maxTags && value.length >= maxTags) return

      onChange?.([...value, trimmed])
      setInputValue("")
    }

    const removeTag = (index: number) => {
      const newTags = value.filter((_, i) => i !== index)
      onChange?.(newTags)
    }

    const handleContainerClick = () => {
      inputRef.current?.focus()
    }

    const canAddMore = !maxTags || value.length < maxTags

    return (
      <div
        ref={ref}
        onClick={handleContainerClick}
        className={cn(
          "flex flex-wrap gap-2 min-h-10 w-full rounded-md px-3 py-2",
          "bg-transparent border-2 border-foreground/20",
          "transition-all duration-200 cursor-text",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          error && "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        {value.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-2.5 py-0.5",
              "bg-primary/10 text-primary text-sm font-medium",
              "border border-primary/20"
            )}
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeTag(index)
                }}
                className="hover:bg-primary/20 rounded-sm p-0.5 transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </span>
        ))}
        {canAddMore && !disabled && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={addTag}
            placeholder={value.length === 0 ? placeholder : ""}
            disabled={disabled}
            className={cn(
              "flex-1 min-w-[120px] bg-transparent outline-none focus:ring-2 focus:ring-ring text-sm",
              "text-foreground placeholder:text-muted-foreground"
            )}
          />
        )}
      </div>
    )
  }
)
TagInput.displayName = "TagInput"

export { TagInput }
