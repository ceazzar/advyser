"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { FileUpload } from "@/components/ui/file-upload"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface MeetingType {
  value: string
  label: string
}

export interface OutputOption {
  id: string
  label: string
  description?: string
}

export interface CopilotInputPanelProps {
  onSubmit: (data: {
    text: string
    files: File[]
    meetingType: string
    outputTypes: string[]
  }) => void
  isLoading?: boolean
  meetingTypes?: MeetingType[]
  outputOptions?: OutputOption[]
  className?: string
}

const DEFAULT_MEETING_TYPES: MeetingType[] = [
  { value: "initial-consultation", label: "Initial Consultation" },
  { value: "review-meeting", label: "Review Meeting" },
  { value: "strategy-session", label: "Strategy Session" },
  { value: "ad-hoc", label: "Ad-hoc" },
  { value: "fact-find", label: "Fact Find" },
  { value: "soa-presentation", label: "SOA Presentation" },
  { value: "other", label: "Other" },
]

const DEFAULT_OUTPUT_OPTIONS: OutputOption[] = [
  { id: "summary", label: "Summary", description: "Concise meeting summary" },
  { id: "action-items", label: "Action Items", description: "Tasks extracted from discussion" },
  { id: "follow-up-draft", label: "Follow-up Draft", description: "Draft email for client" },
  { id: "client-brief-update", label: "Client Brief Update", description: "Updates to client profile" },
]

function CopilotInputPanel({
  onSubmit,
  isLoading = false,
  meetingTypes = DEFAULT_MEETING_TYPES,
  outputOptions = DEFAULT_OUTPUT_OPTIONS,
  className,
}: CopilotInputPanelProps) {
  const [text, setText] = React.useState("")
  const [files, setFiles] = React.useState<File[]>([])
  const [meetingType, setMeetingType] = React.useState("")
  const [selectedOutputs, setSelectedOutputs] = React.useState<string[]>(["summary"])
  const [inputMode, setInputMode] = React.useState<"paste" | "upload">("paste")

  const handleModeChange = (newMode: "paste" | "upload") => {
    setInputMode(newMode)
    if (newMode === "paste") {
      setFiles([])
    } else {
      setText("")
    }
  }

  const handleOutputToggle = (outputId: string) => {
    setSelectedOutputs((prev) =>
      prev.includes(outputId)
        ? prev.filter((id) => id !== outputId)
        : [...prev, outputId]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() && files.length === 0) return
    if (!meetingType) return
    if (selectedOutputs.length === 0) return

    onSubmit({
      text: text.trim(),
      files,
      meetingType,
      outputTypes: selectedOutputs,
    })
  }

  const canSubmit =
    (text.trim() || files.length > 0) &&
    meetingType &&
    selectedOutputs.length > 0 &&
    !isLoading

  return (
    <div
      data-slot="copilot-input-panel"
      className={cn("flex flex-col gap-6", className)}
    >
      {/* Meeting Type Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Meeting Type
        </label>
        <Select value={meetingType} onValueChange={setMeetingType}>
          <SelectTrigger>
            <SelectValue placeholder="Select meeting type..." />
          </SelectTrigger>
          <SelectContent>
            {meetingTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Input Mode Toggle */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Input Method
        </label>
        <div className="flex gap-2 p-1 bg-muted rounded-md w-fit">
          <button
            type="button"
            onClick={() => handleModeChange("paste")}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded transition-colors",
              inputMode === "paste"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Paste Text
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("upload")}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded transition-colors",
              inputMode === "upload"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Upload File
          </button>
        </div>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {inputMode === "paste" ? (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Meeting Notes or Transcript
            </label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your meeting notes, transcript, or any text you'd like the AI to process..."
              className="min-h-[200px] resize-y"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Tip: Include client goals, key discussion points, and any action items mentioned.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Upload Documents
            </label>
            <FileUpload
              accept=".pdf,.doc,.docx,.txt"
              multiple
              maxSize={25}
              onChange={setFiles}
              disabled={isLoading}
              placeholder="Drag and drop PDF, DOCX, or TXT files here, or click to browse"
            />
          </div>
        )}

        {/* Output Type Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            What would you like to generate?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {outputOptions.map((option) => (
              <label
                key={option.id}
                tabIndex={0}
                role="checkbox"
                aria-checked={selectedOutputs.includes(option.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    if (!isLoading) {
                      handleOutputToggle(option.id)
                    }
                  }
                }}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors",
                  selectedOutputs.includes(option.id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <Checkbox
                  checked={selectedOutputs.includes(option.id)}
                  onCheckedChange={() => handleOutputToggle(option.id)}
                  disabled={isLoading}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <span className="text-sm font-medium text-foreground">
                    {option.label}
                  </span>
                  {option.description && (
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!canSubmit}
          loading={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? "Processing..." : "Generate Draft Output"}
        </Button>
      </form>

      {/* Compliance Notice */}
      <p className="text-xs text-muted-foreground text-center px-4">
        AI outputs are drafts only and require advisor review before use.
        No client-facing recommendations are generated.
      </p>
    </div>
  )
}

export { CopilotInputPanel }
