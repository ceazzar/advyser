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
  // Regulatory context
  AU_REGULATORY_CONTEXT,
  buildPrompt, // Legacy alias
  // Functions
  buildSystemPrompt,
  containsForbiddenPhrases,
  // Core rules
  CORE_OPERATING_RULES,
  // Draft labels
  DRAFT_LABEL,
  DRAFT_LABEL_INLINE,
  // Forbidden phrases
  FORBIDDEN_PHRASES,
  FORBIDDEN_PHRASES_LIST,
  getSafeAlternative,
  // Output format
  OUTPUT_FORMAT_RULES,
  // Version
  PROMPT_VERSION,
  // Safe alternatives
  SAFE_ALTERNATIVES,
  // Complete shared rules
  SHARED_RULES,
  validateCompliance,
} from './_shared_rules'

// =============================================================================
// MEETING SUMMARY
// =============================================================================

export {
  OUTPUT_SCHEMA_DESCRIPTION as MEETING_SUMMARY_SCHEMA,
  // Main exports
  SYSTEM_PROMPT as MEETING_SUMMARY_SYSTEM_PROMPT,
  BAD_OUTPUT_EXAMPLE as meetingSummaryBadExample,
  // Examples
  GOOD_OUTPUT_EXAMPLE as meetingSummaryGoodExample,
  // Input type
  type MeetingSummaryInput,
  // Default export
  default as meetingSummaryPrompt,
  USER_PROMPT_TEMPLATE as meetingSummaryUserPrompt,
} from './meeting-summary'

// =============================================================================
// ACTION ITEMS
// =============================================================================

export {
  OUTPUT_SCHEMA_DESCRIPTION as ACTION_ITEMS_SCHEMA,
  // Main exports
  SYSTEM_PROMPT as ACTION_ITEMS_SYSTEM_PROMPT,
  BAD_OUTPUT_EXAMPLE as actionItemsBadExample,
  // Examples
  GOOD_OUTPUT_EXAMPLE as actionItemsGoodExample,
  // Input type
  type ActionItemsInput,
  // Default export
  default as actionItemsPrompt,
  USER_PROMPT_TEMPLATE as actionItemsUserPrompt,
} from './action-items'

// =============================================================================
// FOLLOW-UP DRAFT
// =============================================================================

export {
  OUTPUT_SCHEMA_DESCRIPTION as FOLLOWUP_DRAFT_SCHEMA,
  // Main exports
  SYSTEM_PROMPT as FOLLOWUP_DRAFT_SYSTEM_PROMPT,
  BAD_OUTPUT_EXAMPLE as followupDraftBadExample,
  // Examples
  GOOD_OUTPUT_EXAMPLE as followupDraftGoodExample,
  // Input type
  type FollowupDraftInput,
  // Default export
  default as followupDraftPrompt,
  SMS_EXAMPLE as followupDraftSmsExample,
  USER_PROMPT_TEMPLATE as followupDraftUserPrompt,
} from './followup-draft'

// =============================================================================
// CLIENT BRIEF UPDATE
// =============================================================================

export {
  OUTPUT_SCHEMA_DESCRIPTION as CLIENT_BRIEF_UPDATE_SCHEMA,
  // Main exports
  SYSTEM_PROMPT as CLIENT_BRIEF_UPDATE_SYSTEM_PROMPT,
  BAD_OUTPUT_EXAMPLE as clientBriefUpdateBadExample,
  // Examples
  GOOD_OUTPUT_EXAMPLE as clientBriefUpdateGoodExample,
  // Input type
  type ClientBriefUpdateInput,
  MERGE_EXAMPLE as clientBriefUpdateMergeExample,
  // Default export
  default as clientBriefUpdatePrompt,
  USER_PROMPT_TEMPLATE as clientBriefUpdateUserPrompt,
} from './client-brief-update'

// =============================================================================
// COMPLIANCE FLAGS
// =============================================================================

export {
  OUTPUT_SCHEMA_DESCRIPTION as COMPLIANCE_FLAGS_SCHEMA,
  // Main exports
  SYSTEM_PROMPT as COMPLIANCE_FLAGS_SYSTEM_PROMPT,
  BAD_OUTPUT_EXAMPLE as complianceFlagsBadExample,
  CLEAN_CONTENT_EXAMPLE as complianceFlagsCleanContent,
  // Examples
  GOOD_OUTPUT_EXAMPLE as complianceFlagsGoodExample,
  // Input type
  type ComplianceFlagsInput,
  // Default export
  default as complianceFlagsPrompt,
  TEST_CONTENT_WITH_ISSUES as complianceFlagsTestContent,
  USER_PROMPT_TEMPLATE as complianceFlagsUserPrompt,
} from './compliance-flags'

// =============================================================================
// SAFETY CHECKER
// =============================================================================

export {
  // Utility functions
  quickSafetyCheck,
  redactContent,
  OUTPUT_SCHEMA_DESCRIPTION as SAFETY_CHECKER_SCHEMA,
  // Main exports
  SYSTEM_PROMPT as SAFETY_CHECKER_SYSTEM_PROMPT,
  FAIL_EXAMPLE as safetyCheckerFailExample,
  // Input type
  type SafetyCheckerInput,
  // Examples
  PASS_EXAMPLE as safetyCheckerPassExample,
  PII_VIOLATION_EXAMPLE as safetyCheckerPiiExample,
  // Default export
  default as safetyCheckerPrompt,
  SAFE_CONTENT_EXAMPLE as safetyCheckerSafeContent,
  UNSAFE_CONTENT_EXAMPLE as safetyCheckerUnsafeContent,
  USER_PROMPT_TEMPLATE as safetyCheckerUserPrompt,
  // Violation types
  VIOLATION_TYPE_DESCRIPTIONS,
} from './safety-checker'

// =============================================================================
// CONSOLIDATED PROMPT REGISTRY
// =============================================================================

import actionItems from './action-items'
import clientBriefUpdate from './client-brief-update'
import complianceFlags from './compliance-flags'
import followupDraft from './followup-draft'
import meetingSummary from './meeting-summary'
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
