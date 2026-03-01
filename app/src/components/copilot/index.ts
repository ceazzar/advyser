/**
 * Copilot Components - Barrel Export
 *
 * AI Copilot for advisors to process meeting notes and transcripts.
 * All outputs are advisor-only drafts - NEVER client-facing.
 *
 * IMPORTANT: The AI Copilot NEVER provides financial advice.
 * All outputs require advisor review and approval before use.
 *
 * @module copilot
 */

// Input Panel - For entering meeting notes/transcripts
export type { CopilotInputPanelProps, MeetingType, OutputOption } from "./input-panel"
export { CopilotInputPanel } from "./input-panel"

// Output Card - Collapsible card for displaying generated content
export type { CopilotOutputCardProps, CopilotOutputType } from "./output-card"
export { CopilotOutputCard } from "./output-card"

// Run History - Sidebar list of previous copilot runs
export type { CopilotRun,CopilotRunHistoryProps } from "./run-history"
export { CopilotRunHistory } from "./run-history"

// Safety Banner - Warning banner about AI-generated content
export type { ComplianceStatus,CopilotSafetyBannerProps } from "./safety-banner"
export { CopilotSafetyBanner } from "./safety-banner"

// Empty State - Shown when no input yet
export type { CopilotEmptyStateProps } from "./empty-state"
export { CopilotEmptyState } from "./empty-state"
