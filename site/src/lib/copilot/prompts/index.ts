/**
 * Copilot Prompt Templates - Barrel Export
 *
 * This module exports all AI Copilot prompt templates for the Advyser platform.
 * Each prompt template follows a consistent pattern:
 *
 * - SYSTEM_PROMPT: Complete system prompt including shared rules and task-specific instructions
 * - USER_PROMPT_TEMPLATE: Function to generate user prompts from input data
 * - OUTPUT_SCHEMA_DESCRIPTION: JSON schema description for the LLM
 *
 * IMPORTANT: All prompts enforce strict guardrails to prevent financial advice.
 * The Copilot is advisor-only tooling that processes and structures information.
 *
 * @module lib/copilot/prompts
 * @version 1.0.0
 */

// =============================================================================
// SHARED RULES AND UTILITIES
// =============================================================================

export {
  // Version
  PROMPT_VERSION,

  // Regulatory context
  AU_REGULATORY_CONTEXT,

  // Core rules
  CORE_OPERATING_RULES,

  // Forbidden phrases
  FORBIDDEN_PHRASES,
  FORBIDDEN_PHRASES_LIST,

  // Safe alternatives
  SAFE_ALTERNATIVES,

  // Output format
  OUTPUT_FORMAT_RULES,

  // Draft labels
  DRAFT_LABEL,
  DRAFT_LABEL_INLINE,

  // Complete shared rules
  SHARED_RULES,

  // Functions
  buildSystemPrompt,
  buildPrompt, // Legacy alias
  containsForbiddenPhrases,
  validateCompliance,
  getSafeAlternative,
} from './_shared_rules'

// =============================================================================
// MEETING SUMMARY
// =============================================================================

export {
  // Main exports
  SYSTEM_PROMPT as MEETING_SUMMARY_SYSTEM_PROMPT,
  USER_PROMPT_TEMPLATE as meetingSummaryUserPrompt,
  OUTPUT_SCHEMA_DESCRIPTION as MEETING_SUMMARY_SCHEMA,

  // Input type
  type MeetingSummaryInput,

  // Examples
  GOOD_OUTPUT_EXAMPLE as meetingSummaryGoodExample,
  BAD_OUTPUT_EXAMPLE as meetingSummaryBadExample,

  // Default export
  default as meetingSummaryPrompt,
} from './meeting-summary'

// =============================================================================
// ACTION ITEMS
// =============================================================================

export {
  // Main exports
  SYSTEM_PROMPT as ACTION_ITEMS_SYSTEM_PROMPT,
  USER_PROMPT_TEMPLATE as actionItemsUserPrompt,
  OUTPUT_SCHEMA_DESCRIPTION as ACTION_ITEMS_SCHEMA,

  // Input type
  type ActionItemsInput,

  // Examples
  GOOD_OUTPUT_EXAMPLE as actionItemsGoodExample,
  BAD_OUTPUT_EXAMPLE as actionItemsBadExample,

  // Default export
  default as actionItemsPrompt,
} from './action-items'

// =============================================================================
// FOLLOW-UP DRAFT
// =============================================================================

export {
  // Main exports
  SYSTEM_PROMPT as FOLLOWUP_DRAFT_SYSTEM_PROMPT,
  USER_PROMPT_TEMPLATE as followupDraftUserPrompt,
  OUTPUT_SCHEMA_DESCRIPTION as FOLLOWUP_DRAFT_SCHEMA,

  // Input type
  type FollowupDraftInput,

  // Examples
  GOOD_OUTPUT_EXAMPLE as followupDraftGoodExample,
  BAD_OUTPUT_EXAMPLE as followupDraftBadExample,
  SMS_EXAMPLE as followupDraftSmsExample,

  // Default export
  default as followupDraftPrompt,
} from './followup-draft'

// =============================================================================
// CLIENT BRIEF UPDATE
// =============================================================================

export {
  // Main exports
  SYSTEM_PROMPT as CLIENT_BRIEF_UPDATE_SYSTEM_PROMPT,
  USER_PROMPT_TEMPLATE as clientBriefUpdateUserPrompt,
  OUTPUT_SCHEMA_DESCRIPTION as CLIENT_BRIEF_UPDATE_SCHEMA,

  // Input type
  type ClientBriefUpdateInput,

  // Examples
  GOOD_OUTPUT_EXAMPLE as clientBriefUpdateGoodExample,
  BAD_OUTPUT_EXAMPLE as clientBriefUpdateBadExample,
  MERGE_EXAMPLE as clientBriefUpdateMergeExample,

  // Default export
  default as clientBriefUpdatePrompt,
} from './client-brief-update'

// =============================================================================
// COMPLIANCE FLAGS
// =============================================================================

export {
  // Main exports
  SYSTEM_PROMPT as COMPLIANCE_FLAGS_SYSTEM_PROMPT,
  USER_PROMPT_TEMPLATE as complianceFlagsUserPrompt,
  OUTPUT_SCHEMA_DESCRIPTION as COMPLIANCE_FLAGS_SCHEMA,

  // Input type
  type ComplianceFlagsInput,

  // Examples
  GOOD_OUTPUT_EXAMPLE as complianceFlagsGoodExample,
  BAD_OUTPUT_EXAMPLE as complianceFlagsBadExample,
  TEST_CONTENT_WITH_ISSUES as complianceFlagsTestContent,
  CLEAN_CONTENT_EXAMPLE as complianceFlagsCleanContent,

  // Default export
  default as complianceFlagsPrompt,
} from './compliance-flags'

// =============================================================================
// SAFETY CHECKER
// =============================================================================

export {
  // Main exports
  SYSTEM_PROMPT as SAFETY_CHECKER_SYSTEM_PROMPT,
  USER_PROMPT_TEMPLATE as safetyCheckerUserPrompt,
  OUTPUT_SCHEMA_DESCRIPTION as SAFETY_CHECKER_SCHEMA,

  // Input type
  type SafetyCheckerInput,

  // Violation types
  VIOLATION_TYPE_DESCRIPTIONS,

  // Utility functions
  quickSafetyCheck,
  redactContent,

  // Examples
  PASS_EXAMPLE as safetyCheckerPassExample,
  FAIL_EXAMPLE as safetyCheckerFailExample,
  PII_VIOLATION_EXAMPLE as safetyCheckerPiiExample,
  SAFE_CONTENT_EXAMPLE as safetyCheckerSafeContent,
  UNSAFE_CONTENT_EXAMPLE as safetyCheckerUnsafeContent,

  // Default export
  default as safetyCheckerPrompt,
} from './safety-checker'

// =============================================================================
// CONSOLIDATED PROMPT REGISTRY
// =============================================================================

import meetingSummary from './meeting-summary'
import actionItems from './action-items'
import followupDraft from './followup-draft'
import clientBriefUpdate from './client-brief-update'
import complianceFlags from './compliance-flags'
import safetyChecker from './safety-checker'

/**
 * All prompt templates in a single registry.
 * Useful for dynamic prompt selection based on task type.
 */
export const promptRegistry = {
  meetingSummary,
  actionItems,
  followupDraft,
  clientBriefUpdate,
  complianceFlags,
  safetyChecker,
} as const

/**
 * Prompt type identifiers.
 */
export type PromptType = keyof typeof promptRegistry

/**
 * Get a prompt template by type.
 * @param type - The prompt type to retrieve
 * @returns The prompt template module
 */
export function getPrompt<T extends PromptType>(type: T): (typeof promptRegistry)[T] {
  return promptRegistry[type]
}

/**
 * All system prompts for quick access.
 */
export const systemPrompts = {
  meetingSummary: meetingSummary.SYSTEM_PROMPT,
  actionItems: actionItems.SYSTEM_PROMPT,
  followupDraft: followupDraft.SYSTEM_PROMPT,
  clientBriefUpdate: clientBriefUpdate.SYSTEM_PROMPT,
  complianceFlags: complianceFlags.SYSTEM_PROMPT,
  safetyChecker: safetyChecker.SYSTEM_PROMPT,
} as const

/**
 * All user prompt template functions for quick access.
 */
export const userPromptTemplates = {
  meetingSummary: meetingSummary.USER_PROMPT_TEMPLATE,
  actionItems: actionItems.USER_PROMPT_TEMPLATE,
  followupDraft: followupDraft.USER_PROMPT_TEMPLATE,
  clientBriefUpdate: clientBriefUpdate.USER_PROMPT_TEMPLATE,
  complianceFlags: complianceFlags.USER_PROMPT_TEMPLATE,
  safetyChecker: safetyChecker.USER_PROMPT_TEMPLATE,
} as const

/**
 * All output schema descriptions for quick access.
 */
export const outputSchemas = {
  meetingSummary: meetingSummary.OUTPUT_SCHEMA_DESCRIPTION,
  actionItems: actionItems.OUTPUT_SCHEMA_DESCRIPTION,
  followupDraft: followupDraft.OUTPUT_SCHEMA_DESCRIPTION,
  clientBriefUpdate: clientBriefUpdate.OUTPUT_SCHEMA_DESCRIPTION,
  complianceFlags: complianceFlags.OUTPUT_SCHEMA_DESCRIPTION,
  safetyChecker: safetyChecker.OUTPUT_SCHEMA_DESCRIPTION,
} as const

// =============================================================================
// LEGACY EXPORTS (for backwards compatibility)
// =============================================================================

// These maintain compatibility with the previous export pattern
export const meetingSummaryPromptTemplate = meetingSummary.SYSTEM_PROMPT
export const meetingSummaryPromptVersion = meetingSummary.promptVersion
export const meetingSummaryOutputSchema = meetingSummary.OUTPUT_SCHEMA_DESCRIPTION

export const actionItemsPromptTemplate = actionItems.SYSTEM_PROMPT
export const actionItemsPromptVersion = actionItems.promptVersion
export const actionItemsOutputSchema = actionItems.OUTPUT_SCHEMA_DESCRIPTION

export const followupDraftPromptTemplate = followupDraft.SYSTEM_PROMPT
export const followupDraftPromptVersion = followupDraft.promptVersion
export const followupDraftOutputSchema = followupDraft.OUTPUT_SCHEMA_DESCRIPTION

export const clientBriefUpdatePromptTemplate = clientBriefUpdate.SYSTEM_PROMPT
export const clientBriefUpdatePromptVersion = clientBriefUpdate.promptVersion
export const clientBriefUpdateOutputSchema = clientBriefUpdate.OUTPUT_SCHEMA_DESCRIPTION

export const complianceFlagsPromptTemplate = complianceFlags.SYSTEM_PROMPT
export const complianceFlagsPromptVersion = complianceFlags.promptVersion
export const complianceFlagsOutputSchema = complianceFlags.OUTPUT_SCHEMA_DESCRIPTION

export const safetyCheckerPromptTemplate = safetyChecker.SYSTEM_PROMPT
export const safetyCheckerPromptVersion = safetyChecker.promptVersion
export const safetyCheckerOutputSchema = safetyChecker.OUTPUT_SCHEMA_DESCRIPTION

/**
 * @deprecated Use promptRegistry instead
 */
export const copilotPrompts = {
  meetingSummary: {
    template: meetingSummary.SYSTEM_PROMPT,
    version: meetingSummary.promptVersion,
    schema: meetingSummary.OUTPUT_SCHEMA_DESCRIPTION,
  },
  actionItems: {
    template: actionItems.SYSTEM_PROMPT,
    version: actionItems.promptVersion,
    schema: actionItems.OUTPUT_SCHEMA_DESCRIPTION,
  },
  followupDraft: {
    template: followupDraft.SYSTEM_PROMPT,
    version: followupDraft.promptVersion,
    schema: followupDraft.OUTPUT_SCHEMA_DESCRIPTION,
  },
  clientBriefUpdate: {
    template: clientBriefUpdate.SYSTEM_PROMPT,
    version: clientBriefUpdate.promptVersion,
    schema: clientBriefUpdate.OUTPUT_SCHEMA_DESCRIPTION,
  },
  complianceFlags: {
    template: complianceFlags.SYSTEM_PROMPT,
    version: complianceFlags.promptVersion,
    schema: complianceFlags.OUTPUT_SCHEMA_DESCRIPTION,
  },
  safetyChecker: {
    template: safetyChecker.SYSTEM_PROMPT,
    version: safetyChecker.promptVersion,
    schema: safetyChecker.OUTPUT_SCHEMA_DESCRIPTION,
  },
} as const

export type CopilotPromptType = keyof typeof copilotPrompts
