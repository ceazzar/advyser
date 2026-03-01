/**
 * Advyser Type Definitions
 * Barrel export for all types
 */

// User types
export type { Profile, User, UserRole } from './user'

// Advisor types
export type {
  Advisor,
  Availability,
  ClaimRequest,
  Credential,
  CredentialType,
  Service,
  VerificationLevel,
  VerificationStatus,
} from './advisor'

// Message types
export type {
  Conversation,
  FileAttachment,
  Message,
  MessageStatus,
  TypingState,
} from './message'

// API types
export type {
  ApiError,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  SortDirection,
} from './api'

// Search types
export type {
  SearchFilters,
  SearchResponse,
  SearchResult,
} from './search'

// =============================================================================
// COPILOT TYPES
// =============================================================================

// Copilot - Schema version
export { COPILOT_SCHEMA_VERSION } from './copilot'

// Copilot - Enum types
export type {
  Channel,
  CopilotInputType,
  MeetingType,
  OutputType,
  ParticipantRole,
  Priority,
  SafetyViolationType,
  Severity,
  TaskStatus,
  Tone,
} from './copilot'

// Copilot - Meeting Summary types
export type {
  ClientGoal,
  Constraint,
  Decision,
  MeetingSummary,
  MeetingSummaryEnhanced,
  OpenQuestion,
  Participant,
  Topic,
} from './copilot'

// Copilot - Action Items types
export type {
  ActionItemEnhanced,
  ActionItems,
  AdvisorTask,
  ClientTask,
  Dependency,
} from './copilot'

// Copilot - Follow-up Draft types
export type { FollowupDraft } from './copilot'

// Copilot - Client Brief Update types
export type {
  BriefGoal,
  BriefGoalEnhanced,
  ClientBriefUpdate,
  ClientBriefUpdateEnhanced,
  KnownFact,
  Preference,
  RiskNoted,
  UnknownNeeded,
} from './copilot'

// Copilot - Compliance types
export type {
  ComplianceFlag,
  ComplianceFlags,
  ComplianceFlagsEnhanced,
  MissingInfoCheck,
  WordingSuggestion,
} from './copilot'

// Copilot - Safety types
export type {
  SafetyCheckResult,
  SafetyViolation,
  SafetyViolationEnhanced,
} from './copilot'

// Copilot - Input types
export type {
  CopilotInput,
  ExistingClientBrief,
  MeetingNotesInput,
} from './copilot'

// Copilot - Output types
export type {
  CopilotOutput,
  CopilotOutputContent,
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
  ActionItemEnhancedSchema,
  ActionItemsSchema,
  // Action Items schemas
  AdvisorTaskSchema,
  BriefGoalEnhancedSchema,
  // Client Brief Update schemas
  BriefGoalSchema,
  ChannelSchema,
  ClientBriefUpdateEnhancedSchema,
  ClientBriefUpdateSchema,
  ClientGoalSchema,
  ClientTaskSchema,
  // Compliance schemas
  ComplianceFlagSchema,
  ComplianceFlagsEnhancedSchema,
  ComplianceFlagsSchema,
  ConstraintSchema,
  // Input schemas
  CopilotInputSchema,
  CopilotInputTypeSchema,
  // Output schemas
  CopilotOutputSchema,
  CopilotRunEnhancedSchema,
  // Run schemas
  CopilotRunSchema,
  DecisionSchema,
  DependencySchema,
  ExistingClientBriefSchema,
  // Follow-up Draft schema
  FollowupDraftSchema,
  KnownFactSchema,
  MeetingNotesInputSchema,
  MeetingSummaryEnhancedSchema,
  MeetingSummarySchema,
  // Enum schemas
  MeetingTypeSchema,
  MissingInfoCheckSchema,
  OpenQuestionSchema,
  OutputTypeSchema,
  ParticipantRoleSchema,
  // Meeting Summary schemas
  ParticipantSchema,
  PreferenceSchema,
  PrioritySchema,
  RiskNotedSchema,
  SafetyCheckResultSchema,
  SafetyViolationEnhancedSchema,
  // Safety schemas
  SafetyViolationSchema,
  SafetyViolationTypeSchema,
  SeveritySchema,
  TaskStatusSchema,
  ToneSchema,
  TopicSchema,
  UnknownNeededSchema,
  WordingSuggestionSchema,
} from './copilot'

// =============================================================================
// COPILOT TYPE GUARDS
// =============================================================================

export {
  isActionItems,
  isClientBriefUpdate,
  isComplianceFlags,
  isFollowupDraft,
  isMeetingSummary,
  isSafetyCheckResult,
  TypeGuards,
} from './copilot'

// =============================================================================
// COPILOT VALIDATION HELPERS
// =============================================================================

export {
  safeValidate,
  validateActionItems,
  validateClientBriefUpdate,
  validateComplianceFlags,
  validateCopilotInput,
  validateCopilotOutput,
  validateCopilotRun,
  validateFollowupDraft,
  validateMeetingSummary,
  validateSafetyCheckResult,
  Validators,
} from './copilot'

// =============================================================================
// COPILOT SCHEMA COLLECTIONS
// =============================================================================

export { OutputSchemas } from './copilot'
