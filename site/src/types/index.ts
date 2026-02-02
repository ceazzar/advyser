/**
 * Advyser Type Definitions
 * Barrel export for all types
 */

// User types
export type { User, Profile, UserRole } from './user'

// Advisor types
export type {
  Advisor,
  Credential,
  CredentialType,
  Service,
  Availability,
  VerificationStatus,
  VerificationLevel,
  ClaimRequest,
} from './advisor'

// Message types
export type {
  Message,
  Conversation,
  FileAttachment,
  MessageStatus,
  TypingState,
} from './message'

// API types
export type {
  ApiResponse,
  ApiError,
  PaginatedResponse,
  PaginationParams,
  SortDirection,
} from './api'

// Search types
export type {
  SearchFilters,
  SearchResult,
  SearchResponse,
} from './search'

// =============================================================================
// COPILOT TYPES
// =============================================================================

// Copilot - Schema version
export { COPILOT_SCHEMA_VERSION } from './copilot'

// Copilot - Enum types
export type {
  MeetingType,
  Channel,
  Tone,
  Priority,
  Severity,
  TaskStatus,
  ParticipantRole,
  OutputType,
  CopilotInputType,
  SafetyViolationType,
} from './copilot'

// Copilot - Meeting Summary types
export type {
  Participant,
  Topic,
  ClientGoal,
  Constraint,
  Decision,
  OpenQuestion,
  MeetingSummary,
  MeetingSummaryEnhanced,
} from './copilot'

// Copilot - Action Items types
export type {
  AdvisorTask,
  ClientTask,
  ActionItems,
  ActionItemEnhanced,
  Dependency,
} from './copilot'

// Copilot - Follow-up Draft types
export type { FollowupDraft } from './copilot'

// Copilot - Client Brief Update types
export type {
  BriefGoal,
  BriefGoalEnhanced,
  Preference,
  KnownFact,
  UnknownNeeded,
  RiskNoted,
  ClientBriefUpdate,
  ClientBriefUpdateEnhanced,
} from './copilot'

// Copilot - Compliance types
export type {
  ComplianceFlag,
  MissingInfoCheck,
  WordingSuggestion,
  ComplianceFlags,
  ComplianceFlagsEnhanced,
} from './copilot'

// Copilot - Safety types
export type {
  SafetyViolation,
  SafetyViolationEnhanced,
  SafetyCheckResult,
} from './copilot'

// Copilot - Input types
export type {
  CopilotInput,
  MeetingNotesInput,
  ExistingClientBrief,
} from './copilot'

// Copilot - Output types
export type {
  CopilotOutputContent,
  CopilotOutput,
} from './copilot'

// Copilot - Run types
export type {
  CopilotRun,
  CopilotRunEnhanced,
} from './copilot'

// =============================================================================
// COPILOT ZOD SCHEMAS (for runtime validation)
// =============================================================================

export {
  // Enum schemas
  MeetingTypeSchema,
  ChannelSchema,
  ToneSchema,
  PrioritySchema,
  SeveritySchema,
  TaskStatusSchema,
  ParticipantRoleSchema,
  OutputTypeSchema,
  CopilotInputTypeSchema,
  SafetyViolationTypeSchema,
  // Meeting Summary schemas
  ParticipantSchema,
  TopicSchema,
  ClientGoalSchema,
  ConstraintSchema,
  DecisionSchema,
  OpenQuestionSchema,
  MeetingSummarySchema,
  MeetingSummaryEnhancedSchema,
  // Action Items schemas
  AdvisorTaskSchema,
  ClientTaskSchema,
  ActionItemsSchema,
  ActionItemEnhancedSchema,
  DependencySchema,
  // Follow-up Draft schema
  FollowupDraftSchema,
  // Client Brief Update schemas
  BriefGoalSchema,
  BriefGoalEnhancedSchema,
  PreferenceSchema,
  KnownFactSchema,
  UnknownNeededSchema,
  RiskNotedSchema,
  ClientBriefUpdateSchema,
  ClientBriefUpdateEnhancedSchema,
  // Compliance schemas
  ComplianceFlagSchema,
  MissingInfoCheckSchema,
  WordingSuggestionSchema,
  ComplianceFlagsSchema,
  ComplianceFlagsEnhancedSchema,
  // Safety schemas
  SafetyViolationSchema,
  SafetyViolationEnhancedSchema,
  SafetyCheckResultSchema,
  // Input schemas
  CopilotInputSchema,
  MeetingNotesInputSchema,
  ExistingClientBriefSchema,
  // Output schemas
  CopilotOutputSchema,
  // Run schemas
  CopilotRunSchema,
  CopilotRunEnhancedSchema,
} from './copilot'

// =============================================================================
// COPILOT TYPE GUARDS
// =============================================================================

export {
  isMeetingSummary,
  isActionItems,
  isFollowupDraft,
  isClientBriefUpdate,
  isComplianceFlags,
  isSafetyCheckResult,
  TypeGuards,
} from './copilot'

// =============================================================================
// COPILOT VALIDATION HELPERS
// =============================================================================

export {
  validateMeetingSummary,
  validateActionItems,
  validateFollowupDraft,
  validateClientBriefUpdate,
  validateComplianceFlags,
  validateSafetyCheckResult,
  validateCopilotRun,
  validateCopilotOutput,
  validateCopilotInput,
  safeValidate,
  Validators,
} from './copilot'

// =============================================================================
// COPILOT SCHEMA COLLECTIONS
// =============================================================================

export { OutputSchemas } from './copilot'
