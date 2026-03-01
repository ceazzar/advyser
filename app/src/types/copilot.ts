/**
 * Copilot Output Types
 * TypeScript interfaces and Zod schemas for AI Copilot outputs
 *
 * IMPORTANT: The AI Copilot is advisor-only tooling. These outputs are
 * internal drafts that require advisor review and approval before any
 * client communication or action.
 *
 * AU Regulatory Context: All outputs must comply with ASIC/AFSL requirements.
 * The Copilot NEVER provides financial advice - it summarizes, structures,
 * and drafts content for advisor review only.
 *
 * @module types/copilot
 * @version 1.0.0
 */

import { z } from 'zod'

// =============================================================================
// SCHEMA VERSION
// =============================================================================

/**
 * Current schema version for all Copilot outputs.
 * Bump this when making breaking changes to output structures.
 */
export const COPILOT_SCHEMA_VERSION = '1.0.0' as const

// =============================================================================
// ENUMS AND SHARED TYPES
// =============================================================================

/**
 * Meeting types supported by the Copilot.
 * Covers the range of financial advice meeting contexts.
 */
export const MeetingTypeSchema = z.enum([
  'initial_consultation',
  'review_meeting',
  'strategy_session',
  'adhoc',
  // Extended types for AU financial planning context
  'fact_find',
  'strategy_presentation',
  'soa_presentation',
  'insurance_review',
  'estate_planning',
  'super_consolidation',
  'general_catchup',
  'other',
])
export type MeetingType = z.infer<typeof MeetingTypeSchema>

/**
 * Communication channels for follow-up drafts.
 */
export const ChannelSchema = z.enum(['email', 'sms', 'portal_message'])
export type Channel = z.infer<typeof ChannelSchema>

/**
 * Tone options for generated content.
 */
export const ToneSchema = z.enum(['formal', 'friendly', 'neutral'])
export type Tone = z.infer<typeof ToneSchema>

/**
 * Priority levels for tasks and goals.
 */
export const PrioritySchema = z.enum(['high', 'medium', 'low'])
export type Priority = z.infer<typeof PrioritySchema>

/**
 * Compliance flag severity levels.
 * - critical: Must be addressed before any client communication
 * - warning: Should be reviewed but may be acceptable with context
 * - info: Informational suggestion for improvement
 */
export const SeveritySchema = z.enum(['critical', 'warning', 'info'])
export type Severity = z.infer<typeof SeveritySchema>

/**
 * Task status for action items.
 */
export const TaskStatusSchema = z.enum(['pending', 'in_progress', 'completed', 'cancelled'])
export type TaskStatus = z.infer<typeof TaskStatusSchema>

/**
 * Participant roles in meetings.
 */
export const ParticipantRoleSchema = z.enum([
  'advisor',
  'client',
  'spouse_partner',
  'support_person',
  'other',
])
export type ParticipantRole = z.infer<typeof ParticipantRoleSchema>

// =============================================================================
// 1. MEETING SUMMARY
// =============================================================================

/**
 * Meeting participant with role and optional advisor registration.
 */
export const ParticipantSchema = z.object({
  /** Participant's name */
  name: z.string().min(1),
  /** Role in the meeting */
  role: ParticipantRoleSchema,
  /** Authorised Representative number (advisors only, AU regulatory) */
  authorisedRepNumber: z.string().optional(),
})
export type Participant = z.infer<typeof ParticipantSchema>

/**
 * Topic discussed during the meeting with summary and duration.
 */
export const TopicSchema = z.object({
  /** Topic title/heading */
  title: z.string().min(1),
  /** Summary of what was discussed */
  summary: z.string(),
  /** Estimated time spent on topic in minutes */
  durationMinutes: z.number().positive().optional(),
})
export type Topic = z.infer<typeof TopicSchema>

/**
 * Client goal extracted from meeting discussion.
 */
export const ClientGoalSchema = z.object({
  /** Goal description */
  description: z.string().min(1),
  /** Target date if mentioned (ISO 8601 format) */
  targetDate: z.string().optional(),
  /** Priority as stated or inferred from client */
  priority: PrioritySchema.optional(),
  /** Verbatim quote from client if available */
  clientQuote: z.string().optional(),
})
export type ClientGoal = z.infer<typeof ClientGoalSchema>

/**
 * Constraint or limitation mentioned by client.
 */
export const ConstraintSchema = z.object({
  /** Type of constraint */
  type: z.enum([
    'budget',
    'timeline',
    'risk_tolerance',
    'lifestyle',
    'health',
    'family',
    'legal',
    'other',
  ]),
  /** Description of the constraint */
  description: z.string().min(1),
})
export type Constraint = z.infer<typeof ConstraintSchema>

/**
 * Decision made during the meeting.
 */
export const DecisionSchema = z.object({
  /** Description of the decision */
  description: z.string().min(1),
  /** Who made or agreed to the decision */
  madeBy: z.enum(['client', 'joint', 'advisor_recommendation_accepted']),
  /** Any conditions or caveats attached */
  conditions: z.string().optional(),
})
export type Decision = z.infer<typeof DecisionSchema>

/**
 * Open question requiring follow-up after the meeting.
 */
export const OpenQuestionSchema = z.object({
  /** The question to be answered */
  question: z.string().min(1),
  /** Who needs to answer/action this */
  assignedTo: z.enum(['advisor', 'client', 'third_party']),
  /** Context or reason for the question */
  context: z.string().optional(),
})
export type OpenQuestion = z.infer<typeof OpenQuestionSchema>

/**
 * Meeting Summary Output
 *
 * Structured summary of a client meeting including participants,
 * topics discussed, goals identified, and decisions made.
 * This is a DRAFT for advisor review - never shown directly to clients.
 */
export const MeetingSummarySchema = z.object({
  /** Schema version for compatibility checking */
  version: z.string().default(COPILOT_SCHEMA_VERSION),
  /** Type of meeting conducted */
  meeting_type: MeetingTypeSchema,
  /** Purpose/objective of the meeting */
  purpose: z.string().min(1),
  /** Meeting participants */
  participants: z.array(ParticipantSchema).min(1),
  /** Topics discussed during the meeting */
  topics_discussed: z.array(z.string()),
  /** Client goals identified */
  client_goals: z.array(z.string()),
  /** Constraints and limitations mentioned */
  constraints_mentioned: z.array(z.string()),
  /** Decisions made during the meeting */
  decisions_made: z.array(z.string()),
  /** Open questions requiring follow-up */
  open_questions: z.array(z.string()),
  /** Executive summary (2-3 paragraphs max) */
  summary: z.string().min(1),
})
export type MeetingSummary = z.infer<typeof MeetingSummarySchema>

/**
 * Enhanced Meeting Summary with detailed structured data.
 * Use this when you need richer metadata about meeting content.
 */
export const MeetingSummaryEnhancedSchema = z.object({
  version: z.string().default(COPILOT_SCHEMA_VERSION),
  meetingType: MeetingTypeSchema,
  purpose: z.string().min(1),
  participants: z.array(ParticipantSchema).min(1),
  /** Detailed topics with summaries and duration */
  topics: z.array(TopicSchema),
  /** Structured client goals */
  clientGoals: z.array(ClientGoalSchema),
  /** Typed constraints */
  constraints: z.array(ConstraintSchema),
  /** Detailed decisions with attribution */
  decisions: z.array(DecisionSchema),
  /** Structured open questions with assignments */
  openQuestions: z.array(OpenQuestionSchema),
  summary: z.string().min(1),
})
export type MeetingSummaryEnhanced = z.infer<typeof MeetingSummaryEnhancedSchema>

// =============================================================================
// 2. ACTION ITEMS
// =============================================================================

/**
 * Advisor task extracted from meeting.
 */
export const AdvisorTaskSchema = z.object({
  /** Task description */
  task: z.string().min(1),
  /** Priority level */
  priority: PrioritySchema,
  /** Due date if applicable (ISO 8601 format) */
  due_by: z.string().optional(),
})
export type AdvisorTask = z.infer<typeof AdvisorTaskSchema>

/**
 * Client task to communicate back to client.
 */
export const ClientTaskSchema = z.object({
  /** Task description */
  task: z.string().min(1),
  /** Additional details or instructions */
  description: z.string(),
})
export type ClientTask = z.infer<typeof ClientTaskSchema>

/**
 * Action Items Output
 *
 * Extracted tasks for advisor and client following a meeting.
 * Includes dependencies and next meeting objectives.
 */
export const ActionItemsSchema = z.object({
  /** Schema version */
  version: z.string().default(COPILOT_SCHEMA_VERSION),
  /** Tasks for the advisor to complete */
  advisor_tasks: z.array(AdvisorTaskSchema),
  /** Tasks for the client to complete */
  client_tasks: z.array(ClientTaskSchema),
  /** Suggested objective for the next meeting */
  next_meeting_objective: z.string().optional(),
  /** Dependencies or blockers identified */
  dependencies: z.array(z.string()),
})
export type ActionItems = z.infer<typeof ActionItemsSchema>

/**
 * Enhanced action item with full tracking metadata.
 */
export const ActionItemEnhancedSchema = z.object({
  /** Unique identifier */
  id: z.string().uuid(),
  /** Task description */
  description: z.string().min(1),
  /** Due date if applicable */
  dueDate: z.string().optional(),
  /** Priority level */
  priority: PrioritySchema,
  /** Current status */
  status: TaskStatusSchema.default('pending'),
  /** Additional notes */
  notes: z.string().optional(),
  /** Related topic from meeting */
  relatedTopic: z.string().optional(),
})
export type ActionItemEnhanced = z.infer<typeof ActionItemEnhancedSchema>

/**
 * Task dependency relationship.
 */
export const DependencySchema = z.object({
  /** Task ID that must complete first */
  blockingTaskId: z.string(),
  /** Task ID that is blocked */
  blockedTaskId: z.string(),
  /** Reason for the dependency */
  reason: z.string().optional(),
})
export type Dependency = z.infer<typeof DependencySchema>

// =============================================================================
// 3. FOLLOW-UP DRAFT
// =============================================================================

/**
 * Follow-up Draft Output
 *
 * Draft communication for advisor review before sending to client.
 * IMPORTANT: This is ALWAYS a draft requiring human review.
 */
export const FollowupDraftSchema = z.object({
  /** Schema version */
  version: z.string().default(COPILOT_SCHEMA_VERSION),
  /** Communication channel */
  channel: ChannelSchema,
  /** Subject line (required for email, optional for others) */
  subject: z.string().optional(),
  /** Message body - DRAFT requiring advisor review */
  body: z.string().min(1),
  /** Documents/attachments to request from client */
  attachments_requested: z.array(z.string()),
  /** Clear call to action for client */
  call_to_action: z.string(),
  /** Tone of the message */
  tone: ToneSchema,
})
export type FollowupDraft = z.infer<typeof FollowupDraftSchema>

// =============================================================================
// 4. CLIENT BRIEF UPDATE
// =============================================================================

/**
 * Goal with timeframe and priority for client brief.
 */
export const BriefGoalSchema = z.object({
  /** Goal description */
  goal: z.string().min(1),
  /** Timeframe for achieving the goal */
  timeframe: z.string().optional(),
  /** Priority ranking (1 = highest) */
  priority: z.number().int().positive().optional(),
})
export type BriefGoal = z.infer<typeof BriefGoalSchema>

/**
 * Enhanced brief goal with status tracking.
 */
export const BriefGoalEnhancedSchema = z.object({
  /** Goal description */
  description: z.string().min(1),
  /** Goal status */
  status: z.enum(['active', 'achieved', 'paused', 'revised']),
  /** Progress notes */
  progress: z.string().optional(),
  /** Last updated timestamp */
  lastUpdated: z.string(),
})
export type BriefGoalEnhanced = z.infer<typeof BriefGoalEnhancedSchema>

/**
 * Client preference categorized by type.
 */
export const PreferenceSchema = z.object({
  /** Preference category */
  category: z.enum(['communication', 'investment', 'risk', 'lifestyle', 'other']),
  /** Preference description */
  description: z.string().min(1),
})
export type Preference = z.infer<typeof PreferenceSchema>

/**
 * Known fact about client with source tracking.
 */
export const KnownFactSchema = z.object({
  /** Fact category */
  category: z.enum([
    'personal',
    'financial',
    'employment',
    'family',
    'health',
    'property',
    'other',
  ]),
  /** The fact itself */
  fact: z.string().min(1),
  /** Source of the information */
  source: z.string().optional(),
  /** Date the fact was recorded */
  dateRecorded: z.string().optional(),
})
export type KnownFact = z.infer<typeof KnownFactSchema>

/**
 * Information gap that needs to be filled.
 */
export const UnknownNeededSchema = z.object({
  /** What information is missing */
  description: z.string().min(1),
  /** Why this information is needed */
  reason: z.string(),
  /** Priority for obtaining this information */
  priority: PrioritySchema,
})
export type UnknownNeeded = z.infer<typeof UnknownNeededSchema>

/**
 * Risk noted for the client.
 */
export const RiskNotedSchema = z.object({
  /** Risk description */
  description: z.string().min(1),
  /** Risk category */
  category: z.enum([
    'market',
    'personal',
    'legislative',
    'insurance',
    'longevity',
    'other',
  ]),
  /** Severity of the risk */
  severity: SeveritySchema,
  /** Mitigation strategy if discussed */
  mitigation: z.string().optional(),
})
export type RiskNoted = z.infer<typeof RiskNotedSchema>

/**
 * Client Brief Update Output
 *
 * Updates to the internal client summary/brief.
 * This captures the evolving understanding of client situation and needs.
 */
export const ClientBriefUpdateSchema = z.object({
  /** Schema version */
  version: z.string().default(COPILOT_SCHEMA_VERSION),
  /** Point-in-time snapshot date (ISO 8601) */
  snapshot_date: z.string(),
  /** Client goals with timeframes and priorities */
  goals: z.array(BriefGoalSchema),
  /** Current situation summary */
  current_situation: z.string().min(1),
  /** Client preferences */
  preferences: z.array(z.string()),
  /** Known facts about the client */
  known_facts: z.array(z.string()),
  /** Information gaps to fill */
  unknowns_needed: z.array(z.string()),
  /** Risks identified */
  risks_noted: z.array(z.string()),
  /** Next steps to take */
  next_steps: z.array(z.string()),
})
export type ClientBriefUpdate = z.infer<typeof ClientBriefUpdateSchema>

/**
 * Enhanced Client Brief Update with structured metadata.
 */
export const ClientBriefUpdateEnhancedSchema = z.object({
  version: z.string().default(COPILOT_SCHEMA_VERSION),
  /** Point-in-time snapshot description */
  snapshot: z.string(),
  /** Structured goals with status */
  goals: z.array(BriefGoalEnhancedSchema),
  /** Current situation summary */
  situation: z.string().min(1),
  /** Categorized preferences */
  preferences: z.array(PreferenceSchema),
  /** Structured known facts */
  knownFacts: z.array(KnownFactSchema),
  /** Structured information gaps */
  unknownsNeeded: z.array(UnknownNeededSchema),
  /** Structured risks */
  risksNoted: z.array(RiskNotedSchema),
  /** Next steps as simple strings */
  nextSteps: z.array(z.string()),
})
export type ClientBriefUpdateEnhanced = z.infer<typeof ClientBriefUpdateEnhancedSchema>

// =============================================================================
// 5. COMPLIANCE FLAGS
// =============================================================================

/**
 * Compliance flag identifying potentially problematic content.
 */
export const ComplianceFlagSchema = z.object({
  /** Severity of the issue */
  severity: SeveritySchema,
  /** Excerpt from content that triggered the flag */
  excerpt: z.string().min(1),
  /** Reason this content is flagged */
  reason: z.string().min(1),
  /** Suggested safer alternative wording */
  safer_rewrite: z.string().optional(),
})
export type ComplianceFlag = z.infer<typeof ComplianceFlagSchema>

/**
 * Missing information check for compliance.
 */
export const MissingInfoCheckSchema = z.object({
  /** What information is missing */
  description: z.string().min(1),
  /** Why it's required for compliance */
  requirement: z.string(),
  /** Action required to obtain it */
  actionRequired: z.string(),
})
export type MissingInfoCheck = z.infer<typeof MissingInfoCheckSchema>

/**
 * Wording suggestion for better compliance or clarity.
 */
export const WordingSuggestionSchema = z.object({
  /** Original wording */
  original: z.string().min(1),
  /** Suggested alternative */
  suggested: z.string().min(1),
  /** Reason for the suggestion */
  reason: z.string(),
})
export type WordingSuggestion = z.infer<typeof WordingSuggestionSchema>

/**
 * Compliance Flags Output
 *
 * Identifies potentially risky wording and compliance gaps.
 * Helps advisors catch issues before client communication.
 * Based on AU ASIC/AFSL regulatory requirements.
 */
export const ComplianceFlagsSchema = z.object({
  /** Schema version */
  version: z.string().default(COPILOT_SCHEMA_VERSION),
  /** Compliance flags identified */
  flags: z.array(ComplianceFlagSchema),
  /** Missing information checks */
  missing_info_checks: z.array(z.string()),
  /** Wording suggestions for improvement */
  wording_suggestions: z.array(WordingSuggestionSchema),
})
export type ComplianceFlags = z.infer<typeof ComplianceFlagsSchema>

/**
 * Enhanced Compliance Flags with structured missing info checks.
 */
export const ComplianceFlagsEnhancedSchema = z.object({
  version: z.string().default(COPILOT_SCHEMA_VERSION),
  flags: z.array(ComplianceFlagSchema),
  /** Structured missing information checks */
  missingInfoChecks: z.array(MissingInfoCheckSchema),
  wordingSuggestions: z.array(WordingSuggestionSchema),
})
export type ComplianceFlagsEnhanced = z.infer<typeof ComplianceFlagsEnhancedSchema>

// =============================================================================
// 6. SAFETY CHECK RESULT
// =============================================================================

/**
 * Types of safety violations the system checks for.
 */
export const SafetyViolationTypeSchema = z.enum([
  'recommendation', // Contains "you should", product picks, etc.
  'advice', // Appears to give financial advice
  'guarantee', // Makes guarantees or promises about outcomes
  'unsuitable', // Content inappropriate for context
  'pii_exposure', // Exposes sensitive personal information
  'regulatory_breach', // Directly violates ASIC/AFSL rules
])
export type SafetyViolationType = z.infer<typeof SafetyViolationTypeSchema>

/**
 * Safety violation found in generated content.
 */
export const SafetyViolationSchema = z.object({
  /** Type of violation */
  type: SafetyViolationTypeSchema,
  /** Description of the violation */
  description: z.string().min(1),
  /** Excerpt that caused the violation */
  excerpt: z.string().optional(),
})
export type SafetyViolation = z.infer<typeof SafetyViolationSchema>

/**
 * Enhanced safety violation with location tracking.
 */
export const SafetyViolationEnhancedSchema = z.object({
  type: SafetyViolationTypeSchema,
  description: z.string().min(1),
  excerpt: z.string(),
  /** Location in the output (e.g., "summary paragraph 2") */
  location: z.string().optional(),
})
export type SafetyViolationEnhanced = z.infer<typeof SafetyViolationEnhancedSchema>

/**
 * Safety Check Result Output
 *
 * Post-validates generated outputs for safety and compliance.
 * This is the final gate before content can be used.
 */
export const SafetyCheckResultSchema = z.object({
  /** Schema version */
  version: z.string().default(COPILOT_SCHEMA_VERSION),
  /** Whether the output passed all safety checks */
  passed: z.boolean(),
  /** Violations found (empty if passed) */
  violations: z.array(SafetyViolationSchema),
  /** Redacted/sanitized output if violations were found */
  redacted_output: z.string().optional(),
})
export type SafetyCheckResult = z.infer<typeof SafetyCheckResultSchema>

// =============================================================================
// 7. COPILOT INPUT
// =============================================================================

/**
 * Input type for Copilot processing.
 */
export const CopilotInputTypeSchema = z.enum(['text', 'file'])
export type CopilotInputType = z.infer<typeof CopilotInputTypeSchema>

/**
 * Copilot Input
 *
 * Represents input data for a Copilot run.
 * Can be raw text (transcript/notes) or a file reference.
 */
export const CopilotInputSchema = z.object({
  /** Unique identifier for this input */
  id: z.string().uuid(),
  /** Associated run ID */
  run_id: z.string().uuid(),
  /** Type of input */
  type: CopilotInputTypeSchema,
  /** Text content (for text input type) */
  content: z.string().optional(),
  /** File URL (for file input type) */
  file_url: z.string().url().optional(),
  /** Original file name */
  file_name: z.string().optional(),
  /** MIME type of the file */
  file_type: z.string().optional(),
})
export type CopilotInput = z.infer<typeof CopilotInputSchema>

/**
 * Meeting notes input for Copilot processing.
 */
export const MeetingNotesInputSchema = z.object({
  /** Raw meeting transcript or notes */
  transcript: z.string().min(1),
  /** Meeting date (ISO 8601) */
  meetingDate: z.string(),
  /** Meeting duration in minutes */
  durationMinutes: z.number().positive().optional(),
  /** Meeting type if known */
  meetingType: MeetingTypeSchema.optional(),
  /** Client name for context */
  clientName: z.string().min(1),
  /** Advisor name */
  advisorName: z.string().min(1),
  /** Additional context or instructions */
  additionalContext: z.string().optional(),
})
export type MeetingNotesInput = z.infer<typeof MeetingNotesInputSchema>

/**
 * Existing client brief for update processing.
 */
export const ExistingClientBriefSchema = z.object({
  /** Last update timestamp */
  lastUpdated: z.string(),
  /** Current snapshot description */
  currentSnapshot: z.string().optional(),
  /** Current goals */
  currentGoals: z.array(BriefGoalEnhancedSchema).optional(),
  /** Current situation summary */
  currentSituation: z.string().optional(),
})
export type ExistingClientBrief = z.infer<typeof ExistingClientBriefSchema>

// =============================================================================
// 8. COPILOT OUTPUT
// =============================================================================

/**
 * Output types produced by a Copilot run.
 */
export const OutputTypeSchema = z.enum([
  'meeting_summary',
  'action_items',
  'followup_draft',
  'client_brief_update',
  'compliance_flags',
])
export type OutputType = z.infer<typeof OutputTypeSchema>

/**
 * Union of all possible Copilot output content types.
 */
export type CopilotOutputContent =
  | MeetingSummary
  | ActionItems
  | FollowupDraft
  | ClientBriefUpdate
  | ComplianceFlags

/**
 * Copilot Output
 *
 * Single output from a Copilot run with type discrimination.
 */
export const CopilotOutputSchema = z.object({
  /** Unique identifier for this output */
  id: z.string().uuid(),
  /** Associated run ID */
  run_id: z.string().uuid(),
  /** Type of output */
  output_type: OutputTypeSchema,
  /** The actual output content */
  content: z.union([
    MeetingSummarySchema,
    ActionItemsSchema,
    FollowupDraftSchema,
    ClientBriefUpdateSchema,
    ComplianceFlagsSchema,
  ]),
  /** Edited content if advisor has modified the draft */
  edited_content: z
    .union([
      MeetingSummarySchema,
      ActionItemsSchema,
      FollowupDraftSchema,
      ClientBriefUpdateSchema,
      ComplianceFlagsSchema,
    ])
    .optional(),
  /** Timestamp when advisor finalized/approved this output */
  finalized_at: z.string().optional(),
  /** Whether this output passed safety checks */
  safety_passed: z.boolean(),
})
export type CopilotOutput = z.infer<typeof CopilotOutputSchema>

// =============================================================================
// 9. COPILOT RUN (METADATA)
// =============================================================================

/**
 * Copilot Run
 *
 * Metadata tracking a complete Copilot execution.
 * Links inputs, outputs, and processing information.
 */
export const CopilotRunSchema = z.object({
  /** Unique run identifier */
  id: z.string().uuid(),
  /** Client being processed */
  client_id: z.string(),
  /** Advisor running the Copilot */
  advisor_id: z.string(),
  /** Type of meeting (if processing meeting notes) */
  meeting_type: MeetingTypeSchema,
  /** Version of prompt templates used */
  prompt_version: z.string(),
  /** Model identifier (e.g., 'claude-3-sonnet') */
  model_id: z.string(),
  /** Hash of input for deduplication/caching */
  input_hash: z.string(),
  /** Run creation timestamp (ISO 8601) */
  created_at: z.string(),
  /** Outputs produced by this run */
  outputs: z.array(CopilotOutputSchema),
})
export type CopilotRun = z.infer<typeof CopilotRunSchema>

/**
 * Enhanced Copilot Run with additional metadata.
 */
export const CopilotRunEnhancedSchema = z.object({
  id: z.string().uuid(),
  clientId: z.string(),
  advisorId: z.string(),
  meetingType: MeetingTypeSchema.optional(),
  promptVersion: z.string(),
  modelId: z.string(),
  inputHash: z.string(),
  createdAt: z.date(),
  outputs: z.array(CopilotOutputSchema),
  /** Total processing time in milliseconds */
  totalProcessingTimeMs: z.number().optional(),
  /** Error message if run failed */
  error: z.string().optional(),
})
export type CopilotRunEnhanced = z.infer<typeof CopilotRunEnhancedSchema>

// =============================================================================
// TYPE GUARDS
// =============================================================================

/**
 * Type guard for MeetingSummary output.
 * Uses Zod schema validation for robust type checking.
 */
export function isMeetingSummary(content: CopilotOutputContent): content is MeetingSummary {
  return MeetingSummarySchema.safeParse(content).success
}

/**
 * Type guard for ActionItems output.
 * Uses Zod schema validation for robust type checking.
 */
export function isActionItems(content: CopilotOutputContent): content is ActionItems {
  return ActionItemsSchema.safeParse(content).success
}

/**
 * Type guard for FollowupDraft output.
 * Uses Zod schema validation for robust type checking.
 */
export function isFollowupDraft(content: CopilotOutputContent): content is FollowupDraft {
  return FollowupDraftSchema.safeParse(content).success
}

/**
 * Type guard for ClientBriefUpdate output.
 * Uses Zod schema validation for robust type checking.
 */
export function isClientBriefUpdate(content: CopilotOutputContent): content is ClientBriefUpdate {
  return ClientBriefUpdateSchema.safeParse(content).success
}

/**
 * Type guard for ComplianceFlags output.
 * Uses Zod schema validation for robust type checking.
 */
export function isComplianceFlags(content: CopilotOutputContent): content is ComplianceFlags {
  return ComplianceFlagsSchema.safeParse(content).success
}

/**
 * Type guard for SafetyCheckResult.
 * Uses Zod schema validation for robust type checking.
 */
export function isSafetyCheckResult(obj: unknown): obj is SafetyCheckResult {
  return SafetyCheckResultSchema.safeParse(obj).success
}

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Validates a MeetingSummary object against the schema.
 * @param data - Data to validate
 * @returns Parsed MeetingSummary or throws ZodError
 */
export function validateMeetingSummary(data: unknown): MeetingSummary {
  return MeetingSummarySchema.parse(data)
}

/**
 * Validates an ActionItems object against the schema.
 * @param data - Data to validate
 * @returns Parsed ActionItems or throws ZodError
 */
export function validateActionItems(data: unknown): ActionItems {
  return ActionItemsSchema.parse(data)
}

/**
 * Validates a FollowupDraft object against the schema.
 * @param data - Data to validate
 * @returns Parsed FollowupDraft or throws ZodError
 */
export function validateFollowupDraft(data: unknown): FollowupDraft {
  return FollowupDraftSchema.parse(data)
}

/**
 * Validates a ClientBriefUpdate object against the schema.
 * @param data - Data to validate
 * @returns Parsed ClientBriefUpdate or throws ZodError
 */
export function validateClientBriefUpdate(data: unknown): ClientBriefUpdate {
  return ClientBriefUpdateSchema.parse(data)
}

/**
 * Validates a ComplianceFlags object against the schema.
 * @param data - Data to validate
 * @returns Parsed ComplianceFlags or throws ZodError
 */
export function validateComplianceFlags(data: unknown): ComplianceFlags {
  return ComplianceFlagsSchema.parse(data)
}

/**
 * Validates a SafetyCheckResult object against the schema.
 * @param data - Data to validate
 * @returns Parsed SafetyCheckResult or throws ZodError
 */
export function validateSafetyCheckResult(data: unknown): SafetyCheckResult {
  return SafetyCheckResultSchema.parse(data)
}

/**
 * Validates a CopilotRun object against the schema.
 * @param data - Data to validate
 * @returns Parsed CopilotRun or throws ZodError
 */
export function validateCopilotRun(data: unknown): CopilotRun {
  return CopilotRunSchema.parse(data)
}

/**
 * Validates a CopilotOutput object against the schema.
 * @param data - Data to validate
 * @returns Parsed CopilotOutput or throws ZodError
 */
export function validateCopilotOutput(data: unknown): CopilotOutput {
  return CopilotOutputSchema.parse(data)
}

/**
 * Validates a CopilotInput object against the schema.
 * @param data - Data to validate
 * @returns Parsed CopilotInput or throws ZodError
 */
export function validateCopilotInput(data: unknown): CopilotInput {
  return CopilotInputSchema.parse(data)
}

// =============================================================================
// SAFE VALIDATION (Returns result instead of throwing)
// =============================================================================

/**
 * Safely validates data against a schema, returning a result object.
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Object with success flag and either data or error
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}

// =============================================================================
// EXPORT COLLECTIONS
// =============================================================================

/**
 * All output schemas for iteration/mapping.
 */
export const OutputSchemas = {
  meeting_summary: MeetingSummarySchema,
  action_items: ActionItemsSchema,
  followup_draft: FollowupDraftSchema,
  client_brief_update: ClientBriefUpdateSchema,
  compliance_flags: ComplianceFlagsSchema,
} as const

/**
 * All type guards for output content.
 */
export const TypeGuards = {
  isMeetingSummary,
  isActionItems,
  isFollowupDraft,
  isClientBriefUpdate,
  isComplianceFlags,
  isSafetyCheckResult,
} as const

/**
 * All validation functions.
 */
export const Validators = {
  validateMeetingSummary,
  validateActionItems,
  validateFollowupDraft,
  validateClientBriefUpdate,
  validateComplianceFlags,
  validateSafetyCheckResult,
  validateCopilotRun,
  validateCopilotOutput,
  validateCopilotInput,
} as const
