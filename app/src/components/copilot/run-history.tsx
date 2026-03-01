"use client"

import { ChevronRight, Clock, FileText, RotateCcw,Trash2 } from "lucide-react"
import * as React from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface CopilotRun {
  id: string
  date: Date | string  // Accept both Date objects and ISO strings from API
  meetingType: string
  clientName?: string
  preview?: string
  outputTypes?: string[]
}

export interface CopilotRunHistoryProps {
  /** List of previous runs */
  runs: CopilotRun[]
  /** Callback when a run is selected to view/restore */
  onSelect: (run: CopilotRun) => void
  /** Callback when a run is deleted */
  onDelete: (runId: string) => void
  /** Currently selected run ID */
  selectedId?: string
  /** Whether the history is loading */
  isLoading?: boolean
  className?: string
}

function formatRelativeDate(date: Date | string): string {
  const now = new Date()
  const dateObj = date instanceof Date ? date : new Date(date)

  // Validate the date is valid
  if (isNaN(dateObj.getTime())) {
    return "Unknown date"
  }

  const diffMs = now.getTime() - dateObj.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return dateObj.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
  })
}

function getMeetingTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    "initial-consultation": "Initial Consultation",
    "initial-consult": "Initial Consultation",
    "review-meeting": "Review Meeting",
    "strategy-session": "Strategy Session",
    "ad-hoc": "Ad-hoc",
    "fact-find": "Fact Find",
    "soa-presentation": "SOA Presentation",
    "other": "Other",
  }
  return labels[type] || type
}

function CopilotRunHistory({
  runs,
  onSelect,
  onDelete,
  selectedId,
  isLoading = false,
  className,
}: CopilotRunHistoryProps) {
  // Empty state
  if (runs.length === 0 && !isLoading) {
    return (
      <div
        data-slot="copilot-run-history"
        className={cn(
          "flex flex-col items-center justify-center gap-3 p-6 text-center",
          className
        )}
      >
        <div className="size-12 rounded-full bg-muted flex items-center justify-center">
          <Clock className="size-6 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">No history yet</p>
          <p className="text-xs text-muted-foreground max-w-[200px]">
            Your previous AI copilot runs will appear here for quick access
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      data-slot="copilot-run-history"
      className={cn("flex flex-col h-full", className)}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <Clock className="size-4" />
          Recent Runs
          {runs.length > 0 && (
            <span className="text-xs text-muted-foreground">({runs.length})</span>
          )}
        </h3>
      </div>

      {/* Run List */}
      <div className="flex-1 overflow-auto">
        {runs.map((run) => (
          <div
            key={run.id}
            className={cn(
              "group relative border-b border-border last:border-0",
              selectedId === run.id && "bg-primary/5"
            )}
          >
            {/* Selection indicator */}
            {selectedId === run.id && (
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />
            )}

            <button
              type="button"
              onClick={() => onSelect(run)}
              className="w-full flex items-start gap-3 p-3 pl-4 text-left hover:bg-muted/50 transition-colors"
            >
              {/* Icon */}
              <div className="size-9 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="size-4 text-muted-foreground" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pr-8">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate">
                    {run.clientName || "Unnamed Client"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">
                    {getMeetingTypeLabel(run.meetingType)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeDate(run.date)}
                  </span>
                </div>
                {run.preview && (
                  <p className="text-xs text-muted-foreground truncate mt-1.5 leading-relaxed">
                    {run.preview}
                  </p>
                )}
              </div>

              {/* Restore indicator */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <RotateCcw className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            </button>

            {/* Delete button with confirmation */}
            <div className="absolute right-12 top-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="size-3.5 text-muted-foreground hover:text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this run?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this copilot run and its outputs.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(run.id)}
                      className="bg-destructive text-white hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { CopilotRunHistory }
