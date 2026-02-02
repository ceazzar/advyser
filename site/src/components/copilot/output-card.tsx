"use client"

import * as React from "react"
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Pencil,
  Save,
  X,
  ListTodo,
  FileText,
  Mail,
  User,
  Target,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export type CopilotOutputType =
  | "summary"
  | "goals"
  | "action-items"
  | "follow-up"
  | "follow-up-draft"
  | "client-brief-update"
  | "notes"
  | "custom"

export interface CopilotOutputCardProps {
  /** Title of the output card */
  title: string
  /** Content/output text */
  content: string
  /** Type of output for icon selection */
  type: CopilotOutputType
  /** Callback when content is copied */
  onCopy?: (content: string) => void
  /** Callback when content is edited and saved */
  onEdit?: (content: string) => void
  /** Callback when content is saved to notes */
  onSave?: (content: string) => void
  /** Callback for creating tasks from action items */
  onCreateTask?: (content: string) => void
  /** Whether the card is expanded by default */
  isExpanded?: boolean
  /** Callback when expansion state changes */
  onExpandChange?: (expanded: boolean) => void
  className?: string
}

const OUTPUT_TYPE_ICONS: Record<CopilotOutputType, React.ReactNode> = {
  summary: <FileText className="size-4" />,
  goals: <Target className="size-4" />,
  "action-items": <ListTodo className="size-4" />,
  "follow-up": <Mail className="size-4" />,
  "follow-up-draft": <Mail className="size-4" />,
  "client-brief-update": <User className="size-4" />,
  notes: <FileText className="size-4" />,
  custom: <FileText className="size-4" />,
}

const OUTPUT_TYPE_LABELS: Record<CopilotOutputType, string> = {
  summary: "Summary",
  goals: "Client Goals",
  "action-items": "Action Items",
  "follow-up": "Follow-up",
  "follow-up-draft": "Follow-up Draft",
  "client-brief-update": "Client Brief Update",
  notes: "Notes",
  custom: "Output",
}

function CopilotOutputCard({
  title,
  content,
  type,
  onCopy,
  onEdit,
  onSave,
  onCreateTask,
  isExpanded: controlledExpanded,
  onExpandChange,
  className,
}: CopilotOutputCardProps) {
  const [internalExpanded, setInternalExpanded] = React.useState(true)
  const [isEditing, setIsEditing] = React.useState(false)
  const [editedContent, setEditedContent] = React.useState(content)
  const [copied, setCopied] = React.useState(false)

  // Support controlled and uncontrolled expansion
  const isExpanded = controlledExpanded ?? internalExpanded
  const setIsExpanded = React.useCallback((value: boolean) => {
    setInternalExpanded(value)
    onExpandChange?.(value)
  }, [onExpandChange])

  // Reset edited content when content prop changes
  React.useEffect(() => {
    setEditedContent(content)
  }, [content])

  const handleCopy = async () => {
    const textToCopy = isEditing ? editedContent : content
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      onCopy?.(textToCopy)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API failed silently
    }
  }

  const handleSaveEdit = () => {
    onEdit?.(editedContent)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditedContent(content)
    setIsEditing(false)
  }

  const handleSaveToNotes = () => {
    onSave?.(isEditing ? editedContent : content)
  }

  const handleCreateTask = () => {
    onCreateTask?.(isEditing ? editedContent : content)
  }

  return (
    <div
      data-slot="copilot-output-card"
      className={cn(
        "relative rounded-md border border-border bg-card overflow-hidden",
        className
      )}
    >
      {/* DRAFT Badge - Prominently displayed */}
      <div className="absolute top-3 right-3 z-10">
        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 border border-amber-500/30 rounded">
          DRAFT
        </span>
      </div>

      {/* Header - Collapsible trigger */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 p-4 pr-20 hover:bg-muted/50 transition-colors text-left"
      >
        <span className="size-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground shrink-0">
          {OUTPUT_TYPE_ICONS[type]}
        </span>
        <div className="flex-1 min-w-0">
          <span className="font-medium text-foreground block truncate">
            {title || OUTPUT_TYPE_LABELS[type]}
          </span>
          {!isExpanded && (
            <span className="text-xs text-muted-foreground truncate block mt-0.5">
              {content.slice(0, 80)}...
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="size-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="size-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {/* Content - Collapsible */}
      {isExpanded && (
        <div className="border-t border-border">
          {/* Content Area */}
          <div className="p-4">
            {isEditing ? (
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[150px] font-mono text-sm"
                autoFocus
              />
            ) : (
              <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap leading-relaxed">
                {content}
              </div>
            )}
          </div>

          {/* Actions Bar */}
          <div className="flex items-center gap-2 px-4 pb-4 flex-wrap">
            {isEditing ? (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSaveEdit}
                >
                  <Save className="size-4 mr-1.5" />
                  Save Changes
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                >
                  <X className="size-4 mr-1.5" />
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <Check className="size-4 mr-1.5 text-green-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-4 mr-1.5" />
                      Copy
                    </>
                  )}
                </Button>
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="size-4 mr-1.5" />
                    Edit
                  </Button>
                )}
                {onSave && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSaveToNotes}
                  >
                    <FileText className="size-4 mr-1.5" />
                    Save to Notes
                  </Button>
                )}
                {onCreateTask && type === "action-items" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCreateTask}
                  >
                    <ListTodo className="size-4 mr-1.5" />
                    Create Tasks
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export { CopilotOutputCard }
