"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner"

import {
  CopilotInputPanel,
  CopilotOutputCard,
  CopilotRunHistory,
  CopilotSafetyBanner,
  CopilotEmptyState,
  type CopilotRun,
} from "@/components/copilot"
import type {
  MeetingSummary,
  ActionItems,
} from "@/types/copilot"

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_RUNS: CopilotRun[] = [
  {
    id: "run-1",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    meetingType: "review_meeting",
    clientName: "Sarah Mitchell",
    preview: "Quarterly review discussing retirement goals and super consolidation...",
    outputTypes: ["summary", "action-items"],
  },
  {
    id: "run-2",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    meetingType: "initial_consultation",
    clientName: "Sarah Mitchell",
    preview: "Initial meeting covering financial goals, risk tolerance, and timeline...",
    outputTypes: ["summary", "action-items", "follow-up-draft"],
  },
  {
    id: "run-3",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    meetingType: "strategy_session",
    clientName: "Sarah Mitchell",
    preview: "Deep dive into TTR pension strategy and tax optimization options...",
    outputTypes: ["summary", "client-brief-update"],
  },
]

// Mock meeting summary output
const MOCK_MEETING_SUMMARY: MeetingSummary = {
  version: "1.0.0",
  meeting_type: "review_meeting",
  purpose: "Quarterly portfolio review and retirement planning discussion",
  participants: [
    { name: "James Anderson", role: "advisor", authorisedRepNumber: "AR001234" },
    { name: "Sarah Mitchell", role: "client" },
  ],
  topics_discussed: [
    "Current portfolio performance - up 8.2% YTD",
    "Superannuation consolidation options (3 funds identified)",
    "TTR pension strategy for tax optimization",
    "Insurance coverage review - income protection gap identified",
    "Timeline for retirement at age 65",
  ],
  client_goals: [
    "Retire at age 65 with $80,000 p.a. income",
    "Consolidate super funds to reduce fees",
    "Build emergency fund to $30,000 target",
    "Review insurance coverage for adequate protection",
  ],
  constraints_mentioned: [
    "Prefers to maintain current risk profile (balanced)",
    "No additional capital available for immediate investment",
    "Wants to keep home mortgage-free",
  ],
  decisions_made: [
    "Agreed to proceed with super consolidation process",
    "Will schedule follow-up meeting to discuss TTR strategy in detail",
    "Client to gather documents for insurance review",
  ],
  open_questions: [
    "Which super fund offers best value after consolidation?",
    "What income protection premium would be appropriate?",
    "Should consider spouse inclusion in estate planning?",
  ],
  summary: `Sarah Mitchell attended a quarterly review meeting with her advisor James Anderson. The meeting focused on evaluating her current financial position and progress toward retirement goals.

Key highlights include strong portfolio performance (8.2% YTD), identification of three super funds suitable for consolidation (potential fee savings of $1,200 p.a.), and discussion of a TTR pension strategy that could provide tax savings of approximately $8,000 annually.

An important gap was identified in Sarah's insurance coverage - she currently has no income protection despite her $145,000 salary. This represents a significant risk that should be addressed. The client agreed to gather relevant documents and schedule a follow-up meeting to finalize the TTR strategy implementation.`,
}

// Mock action items output
const MOCK_ACTION_ITEMS: ActionItems = {
  version: "1.0.0",
  advisor_tasks: [
    {
      task: "Prepare super consolidation comparison analysis",
      priority: "high",
      due_by: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
    {
      task: "Research income protection insurance options and prepare quotes",
      priority: "high",
      due_by: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
    {
      task: "Draft TTR pension strategy recommendation document",
      priority: "medium",
      due_by: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
    {
      task: "Update client file with current risk profile confirmation",
      priority: "low",
    },
  ],
  client_tasks: [
    {
      task: "Gather super fund statements from all three providers",
      description: "Need latest annual statements from REST Super, Australian Super, and Hostplus to compare fees and insurance.",
    },
    {
      task: "Review current insurance policies and locate policy documents",
      description: "Check for any existing income protection, life insurance, or TPD coverage through super or private policies.",
    },
    {
      task: "Consider retirement income needs with spouse",
      description: "Discuss with partner what combined retirement income would be needed and any estate planning considerations.",
    },
  ],
  next_meeting_objective: "Review super consolidation analysis and make final decision on fund selection. Begin TTR strategy implementation discussion.",
  dependencies: [
    "Client documents required before super comparison can be finalized",
    "Insurance quotes dependent on medical history disclosure",
  ],
}

// Helper to format mock outputs for display
function formatMeetingSummary(summary: MeetingSummary): string {
  const sections = [
    `Meeting Type: ${summary.meeting_type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`,
    `Purpose: ${summary.purpose}`,
    "",
    "Participants:",
    ...summary.participants.map((p) => `  - ${p.name} (${p.role})`),
    "",
    "Topics Discussed:",
    ...summary.topics_discussed.map((t) => `  - ${t}`),
    "",
    "Client Goals:",
    ...summary.client_goals.map((g) => `  - ${g}`),
    "",
    "Decisions Made:",
    ...summary.decisions_made.map((d) => `  - ${d}`),
    "",
    "Open Questions:",
    ...summary.open_questions.map((q) => `  - ${q}`),
    "",
    "Summary:",
    summary.summary,
  ]
  return sections.join("\n")
}

function formatActionItems(items: ActionItems): string {
  const sections = [
    "ADVISOR TASKS:",
    ...items.advisor_tasks.map(
      (t) => `  [${t.priority.toUpperCase()}] ${t.task}${t.due_by ? ` (Due: ${t.due_by})` : ""}`
    ),
    "",
    "CLIENT TASKS:",
    ...items.client_tasks.map((t) => `  - ${t.task}\n    ${t.description}`),
    "",
  ]

  if (items.next_meeting_objective) {
    sections.push(`Next Meeting Objective: ${items.next_meeting_objective}`, "")
  }

  if (items.dependencies.length > 0) {
    sections.push("Dependencies:", ...items.dependencies.map((d) => `  - ${d}`))
  }

  return sections.join("\n")
}

// =============================================================================
// TYPES
// =============================================================================

interface OutputDisplay {
  id: string
  type: "summary" | "action-items" | "follow-up-draft" | "client-brief-update"
  title: string
  content: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function ClientCopilotPage() {
  // Route params
  const params = useParams()
  const clientId = params?.id as string

  // State
  const [runs, setRuns] = React.useState<CopilotRun[]>(MOCK_RUNS)
  const [selectedRunId, setSelectedRunId] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [outputs, setOutputs] = React.useState<OutputDisplay[]>([])
  const [showEmptyState, setShowEmptyState] = React.useState(true)
  const [bannerDismissed, setBannerDismissed] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Ref for cleanup
  const isMountedRef = React.useRef(true)

  // Cleanup on unmount
  React.useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Handlers
  const handleSubmit = async (data: {
    text: string
    files: File[]
    meetingType: string
    outputTypes: string[]
  }) => {
    try {
      setIsLoading(true)
      setShowEmptyState(false)
      setError(null)

      // Simulate AI processing delay with cleanup check
      await new Promise((resolve) => setTimeout(resolve, 2500))

      // Check if component is still mounted before updating state
      if (!isMountedRef.current) return

    // Generate mock outputs based on selected types
    const newOutputs: OutputDisplay[] = []

    if (data.outputTypes.includes("summary")) {
      newOutputs.push({
        id: `output-summary-${Date.now()}`,
        type: "summary",
        title: "Meeting Summary",
        content: formatMeetingSummary(MOCK_MEETING_SUMMARY),
      })
    }

    if (data.outputTypes.includes("action-items")) {
      newOutputs.push({
        id: `output-actions-${Date.now()}`,
        type: "action-items",
        title: "Action Items",
        content: formatActionItems(MOCK_ACTION_ITEMS),
      })
    }

    if (data.outputTypes.includes("follow-up-draft")) {
      newOutputs.push({
        id: `output-followup-${Date.now()}`,
        type: "follow-up-draft",
        title: "Follow-up Email Draft",
        content: `Subject: Follow-up from our meeting - Next steps

Dear Sarah,

Thank you for taking the time to meet today. It was great to review your progress toward retirement and discuss the opportunities we've identified.

As discussed, here are the key next steps:

1. Super Consolidation: I'll prepare a detailed comparison of your three super funds by next week. This analysis will help us identify the best fund for consolidation, potentially saving you around $1,200 in annual fees.

2. TTR Strategy: I'm drafting a recommendation document outlining how a Transition to Retirement pension could provide tax savings of approximately $8,000 per year.

3. Insurance Review: Once you've located your current policy documents, I'll compare them against income protection options that suit your needs.

Action items for you:
- Gather your latest super statements from REST Super, Australian Super, and Hostplus
- Locate any existing insurance policy documents
- Consider discussing retirement income needs with your partner

Please don't hesitate to reach out if you have any questions before our next meeting.

Best regards,
James Anderson
Authorised Representative`,
      })
    }

    if (data.outputTypes.includes("client-brief-update")) {
      newOutputs.push({
        id: `output-brief-${Date.now()}`,
        type: "client-brief-update",
        title: "Client Brief Update",
        content: `CLIENT BRIEF UPDATE
Snapshot Date: ${new Date().toISOString().split("T")[0]}

GOALS:
1. Primary: Retire at 65 with $80,000 p.a. income (7 years away, 72% on track)
2. Super consolidation to reduce fees - IN PROGRESS
3. Emergency fund target $30,000 (currently 85% complete)
4. NEW: Address insurance coverage gap

CURRENT SITUATION:
- Superannuation: $520,000 across 3 funds
- Investable assets: $650,000 total
- Annual income: $145,000 (full-time)
- Property: Home owned outright
- Risk profile: Balanced (last updated 8 months ago)

PREFERENCES:
- Prefers face-to-face meetings over virtual
- Values detailed explanations of strategy
- Conservative approach to risk

RISKS IDENTIFIED:
- No income protection insurance - HIGH PRIORITY
- Multiple super funds creating fee drag
- Risk profile may need refresh

NEXT STEPS:
1. Complete super consolidation analysis
2. Present insurance options
3. Schedule TTR strategy deep-dive
4. Refresh risk profile questionnaire`,
      })
    }

    setOutputs(newOutputs)

    // Add to run history
    const newRun: CopilotRun = {
      id: `run-${Date.now()}`,
      date: new Date(),
      meetingType: data.meetingType,
      clientName: "Sarah Mitchell", // In production, fetch client name using clientId
      preview: data.text.slice(0, 100) + (data.text.length > 100 ? "..." : ""),
      outputTypes: data.outputTypes,
    }
    setRuns((prev) => [newRun, ...prev])
    setSelectedRunId(newRun.id)

    setIsLoading(false)
    toast.success("Draft outputs generated successfully")
    } catch (err) {
      if (!isMountedRef.current) return
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      setIsLoading(false)
      toast.error("Failed to process meeting notes")
    }
  }

  const handleSelectRun = (run: CopilotRun) => {
    setSelectedRunId(run.id)
    setShowEmptyState(false)

    // Restore outputs for selected run (mock)
    const restoredOutputs: OutputDisplay[] = []

    if (run.outputTypes?.includes("summary")) {
      restoredOutputs.push({
        id: `restored-summary-${run.id}`,
        type: "summary",
        title: "Meeting Summary",
        content: formatMeetingSummary(MOCK_MEETING_SUMMARY),
      })
    }

    if (run.outputTypes?.includes("action-items")) {
      restoredOutputs.push({
        id: `restored-actions-${run.id}`,
        type: "action-items",
        title: "Action Items",
        content: formatActionItems(MOCK_ACTION_ITEMS),
      })
    }

    setOutputs(restoredOutputs)
    toast.info("Previous run restored")
  }

  const handleDeleteRun = (runId: string) => {
    setRuns((prev) => prev.filter((r) => r.id !== runId))
    if (selectedRunId === runId) {
      setSelectedRunId(null)
      setOutputs([])
      setShowEmptyState(true)
    }
    toast.success("Run deleted")
  }

  const handleCopyOutput = (content: string) => {
    toast.success("Copied to clipboard")
  }

  const handleSaveOutput = (content: string) => {
    toast.success("Saved to client notes")
  }

  const handleEditOutput = (content: string) => {
    toast.success("Changes saved")
  }

  const handleCreateTask = (content: string) => {
    toast.success("Tasks created from action items")
  }

  const handleGetStarted = () => {
    setShowEmptyState(false)
  }

  // Determine what to show in main area
  const hasOutputs = outputs.length > 0

  return (
    <div className="flex gap-6 h-[calc(100vh-16rem)] min-h-[600px]">
      {/* Left Sidebar - Run History */}
      <aside className="w-72 shrink-0 border border-border rounded-lg bg-card overflow-hidden hidden lg:flex lg:flex-col">
        <CopilotRunHistory
          runs={runs}
          selectedId={selectedRunId ?? undefined}
          onSelect={handleSelectRun}
          onDelete={handleDeleteRun}
          className="h-full"
        />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 gap-4">
        {/* Safety Banner - Always visible unless dismissed */}
        {!bannerDismissed && (
          <CopilotSafetyBanner
            showWarning={true}
            complianceStatus={hasOutputs ? "review-required" : "compliant"}
            dismissable={true}
            onDismiss={() => setBannerDismissed(true)}
          />
        )}

        {/* Content: Empty State, Input Panel, or Outputs */}
        <div className="flex-1 overflow-y-auto">
          {showEmptyState && !isLoading ? (
            <div className="h-full flex items-center justify-center">
              <CopilotEmptyState
                onGetStarted={handleGetStarted}
                className="max-w-3xl"
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Input Panel */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Process Meeting Notes
                </h2>
                <CopilotInputPanel
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                />
              </div>

              {/* Error State */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="size-5 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-destructive text-sm font-medium">!</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-destructive">
                        Processing Error
                      </h3>
                      <p className="text-sm text-destructive/80 mt-1">
                        {error}
                      </p>
                      <button
                        onClick={() => setError(null)}
                        className="text-sm text-destructive underline mt-2 hover:no-underline"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Output Cards */}
              {hasOutputs && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">
                      Generated Outputs
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {outputs.length} {outputs.length === 1 ? "output" : "outputs"} generated
                    </p>
                  </div>

                  <div className="space-y-4">
                    {outputs.map((output) => (
                      <CopilotOutputCard
                        key={output.id}
                        type={output.type}
                        title={output.title}
                        content={output.content}
                        onCopy={handleCopyOutput}
                        onSave={handleSaveOutput}
                        onEdit={handleEditOutput}
                        onCreateTask={output.type === "action-items" ? handleCreateTask : undefined}
                        isExpanded={true}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    Processing...
                  </h2>
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="bg-card border border-border rounded-lg p-6 animate-shimmer"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="size-8 rounded-md bg-muted animate-shimmer" />
                          <div className="h-5 w-32 bg-muted rounded animate-shimmer" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-full animate-shimmer" />
                          <div className="h-4 bg-muted rounded w-5/6 animate-shimmer" />
                          <div className="h-4 bg-muted rounded w-4/6 animate-shimmer" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
