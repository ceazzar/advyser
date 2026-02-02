"use client"

import * as React from "react"
import {
  FileText,
  ListTodo,
  MessageSquare,
  Sparkles,
  Target,
  ArrowRight,
  Upload,
  ClipboardPaste,
  Lightbulb,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface CopilotEmptyStateProps {
  /** Callback when user clicks Get Started */
  onGetStarted?: () => void
  /** Show compact version */
  compact?: boolean
  className?: string
}

interface UseCase {
  icon: React.ReactNode
  title: string
  description: string
}

interface QuickTip {
  icon: React.ReactNode
  text: string
}

const USE_CASES: UseCase[] = [
  {
    icon: <FileText className="size-5" />,
    title: "Meeting Summaries",
    description: "Transform lengthy meeting notes into concise, structured summaries",
  },
  {
    icon: <Target className="size-5" />,
    title: "Extract Client Goals",
    description: "Identify and organize client objectives from conversations",
  },
  {
    icon: <ListTodo className="size-5" />,
    title: "Action Item Lists",
    description: "Generate clear follow-up tasks from meeting discussions",
  },
  {
    icon: <MessageSquare className="size-5" />,
    title: "Draft Follow-ups",
    description: "Create professional follow-up email drafts for advisor review",
  },
]

const QUICK_TIPS: QuickTip[] = [
  {
    icon: <ClipboardPaste className="size-4" />,
    text: "Paste your meeting transcript directly",
  },
  {
    icon: <Upload className="size-4" />,
    text: "Upload call recording notes (PDF, DOCX, TXT)",
  },
  {
    icon: <Lightbulb className="size-4" />,
    text: "Include client names and key discussion points for best results",
  },
]

function CopilotEmptyState({
  onGetStarted,
  compact = false,
  className,
}: CopilotEmptyStateProps) {
  if (compact) {
    return (
      <div
        data-slot="copilot-empty-state"
        className={cn(
          "flex flex-col items-center justify-center gap-4 p-6 text-center",
          className
        )}
      >
        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Sparkles className="size-6 text-primary" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">
            Ready to process meeting notes
          </h3>
          <p className="text-sm text-muted-foreground">
            Paste a transcript or upload a document to get started
          </p>
        </div>
        {onGetStarted && (
          <Button onClick={onGetStarted} size="sm">
            Get Started
            <ArrowRight className="size-4 ml-1.5" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div
      data-slot="copilot-empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-8 p-8 text-center",
        className
      )}
    >
      {/* Hero Section */}
      <div className="flex flex-col items-center gap-4 max-w-md">
        <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Sparkles className="size-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            AI Copilot for Advisors
          </h2>
          <p className="text-muted-foreground">
            Save hours on administrative tasks. Paste meeting notes or upload
            transcripts to generate structured drafts instantly.
          </p>
        </div>
      </div>

      {/* Use Cases Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        {USE_CASES.map((useCase, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 text-left hover:bg-muted/70 transition-colors"
          >
            <div className="size-10 rounded-md bg-background border border-border flex items-center justify-center shrink-0 text-muted-foreground">
              {useCase.icon}
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-foreground">
                {useCase.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {useCase.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="w-full max-w-lg">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Quick Tips for Best Results
        </h4>
        <div className="flex flex-col gap-2">
          {QUICK_TIPS.map((tip, index) => (
            <div
              key={index}
              className="flex items-center gap-3 text-sm text-muted-foreground"
            >
              <span className="text-primary">{tip.icon}</span>
              <span>{tip.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="flex flex-col items-center gap-4">
        {onGetStarted && (
          <Button onClick={onGetStarted} size="lg">
            Get Started
            <ArrowRight className="size-4 ml-2" />
          </Button>
        )}
        <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
          All AI outputs are drafts that require advisor review.
          The copilot never generates client-facing recommendations.
        </p>
      </div>

      {/* Compliance Notice */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-xs text-muted-foreground">
        <span className="size-2 rounded-full bg-green-500 animate-pulse" />
        <span>AFSL compliant - advisor-only drafts</span>
      </div>
    </div>
  )
}

export { CopilotEmptyState }
