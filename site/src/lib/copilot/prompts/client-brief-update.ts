/**
 * Client Brief Update Prompt Template
 *
 * Updates the internal client summary/brief based on new meeting information.
 * Output is for ADVISOR INTERNAL USE ONLY - never shared with clients.
 *
 * @module lib/copilot/prompts/client-brief-update
 * @version 1.0.0
 */

import type {
  ClientBriefUpdate,
  MeetingSummary,
  ExistingClientBrief,
  BriefGoal,
} from '@/types/copilot'
import { buildSystemPrompt, PROMPT_VERSION } from './_shared_rules'

// =============================================================================
// INPUT TYPES
// =============================================================================

/**
 * Input required to generate a client brief update.
 */
export interface ClientBriefUpdateInput {
  /** Client's full name */
  clientName: string
  /** Date of the most recent meeting (ISO format) */
  meetingDate: string
  /** Meeting summary (required) */
  meetingSummary: MeetingSummary | string
  /** Existing client brief if available */
  existingBrief?: ExistingClientBrief | string
  /** Additional context or notes */
  additionalContext?: string
}

// =============================================================================
// OUTPUT SCHEMA DESCRIPTION
// =============================================================================

/**
 * JSON schema description for client brief update output.
 * Used to guide LLM output format.
 */
export const OUTPUT_SCHEMA_DESCRIPTION = `
{
  "version": "string - Schema version (e.g., '1.0.0')",
  "snapshot_date": "string - ISO date of this snapshot (YYYY-MM-DD)",
  "goals": [
    {
      "goal": "string - Goal description",
      "timeframe": "string (optional) - Target timeframe",
      "priority": "number (optional) - Priority ranking (1 = highest)"
    }
  ],
  "current_situation": "string - Summary of client's current financial situation",
  "preferences": ["string - Client preference (communication, investment style, risk, etc.)"],
  "known_facts": ["string - Factual information about the client"],
  "unknowns_needed": ["string - Information gaps to fill"],
  "risks_noted": ["string - Risks identified or discussed"],
  "next_steps": ["string - Clear action items going forward"]
}
` as const

// =============================================================================
// SYSTEM PROMPT
// =============================================================================

/**
 * System prompt for client brief update generation.
 * Includes shared rules and task-specific instructions.
 */
export const SYSTEM_PROMPT = buildSystemPrompt(`
# Task: Update Client Brief

You are updating an internal client brief for a licensed Australian financial advisor. This is a CONFIDENTIAL internal document that helps the advisor maintain a current understanding of their client's situation and needs.

## Purpose of Client Brief

The client brief is the advisor's internal reference document. It:
- Captures the evolving picture of the client's situation
- Records goals, preferences, and constraints
- Tracks known facts and information gaps
- Helps prepare for meetings
- Supports regulatory compliance documentation

## Critical Constraints

1. **INTERNAL ONLY** - This document is NEVER shared with clients
2. **FACTS ONLY** - Record what was said/learned, not advice or recommendations
3. **ATTRIBUTION** - Note the source of information (e.g., "Per meeting on 2025-02-01")
4. **PRESERVE HISTORY** - Don't delete previous information unless explicitly superseded
5. **FLAG CONFLICTS** - Note when new information contradicts old

## What Constitutes Each Category

### Goals
Goals are desired outcomes the client has expressed:
- Retirement targets (age, lifestyle, location)
- Wealth building objectives
- Debt reduction aims
- Legacy/estate intentions
- Specific purchases (home, car, travel)
- Education funding

**Capture goals in the client's own words where possible.**

### Preferences
Preferences are how the client wants things done:
- Communication preferences (email, phone, frequency)
- Investment philosophy (active vs passive, ethical, etc.)
- Risk attitude (as stated by client)
- Decision-making style (deliberate, delegator, etc.)
- Meeting preferences (time, location, attendees)

### Known Facts
Facts are objective information about the client:
- Personal: Age, marital status, dependents, health
- Financial: Income, assets, debts, super balances
- Employment: Occupation, employer, tenure, stability
- Property: Ownership, mortgages, rental
- Insurance: Current policies, coverage
- Legal: Wills, POA, trusts, structures

**Always note the source and date of facts.**

### Unknowns Needed
Information gaps that would be valuable to know:
- Missing documents
- Unclear circumstances
- Conflicting information needing clarification
- Regulatory requirements not yet met
- Dependencies on third-party information

### Risks Noted
Risks discussed or identified:
- Market/investment risks mentioned
- Personal risks (health, job stability)
- Insurance gaps identified
- Legislative/regulatory risks
- Longevity risk considerations
- Concentration risks

## Merging with Existing Brief

When an existing brief is provided:
1. **Preserve** facts unless contradicted by new information
2. **Update** goal statuses based on meeting discussion
3. **Add** new information to appropriate categories
4. **Flag** if any previously recorded information appears outdated
5. **Note** contradictions between old and new information
6. **Timestamp** updates with the meeting date

## Output Quality Criteria

**GOOD Entries:**
- "Goal: Retire by age 60 - described as 'my absolute priority' (Per meeting 2025-02-01)"
- "Fact: Annual income approximately $150,000 (client stated 2025-02-01)"
- "Risk: Currently no income protection insurance (identified 2025-02-01)"

**BAD Entries (violations):**
- "Client should retire at 60" (advisory language)
- "I recommend addressing the insurance gap" (recommendation)
- "The best approach would be to consolidate super" (advice)

## Output Format

Return a valid JSON object matching this schema:

${OUTPUT_SCHEMA_DESCRIPTION}
`)

// =============================================================================
// USER PROMPT TEMPLATE
// =============================================================================

/**
 * Generate the user prompt for client brief update.
 * @param input - Client brief update input
 * @returns Formatted user prompt string
 */
export function USER_PROMPT_TEMPLATE(input: ClientBriefUpdateInput): string {
  const summaryText =
    typeof input.meetingSummary === 'string'
      ? input.meetingSummary
      : JSON.stringify(input.meetingSummary, null, 2)

  let existingBriefSection = ''
  if (input.existingBrief) {
    const briefText =
      typeof input.existingBrief === 'string'
        ? input.existingBrief
        : JSON.stringify(input.existingBrief, null, 2)
    existingBriefSection = `
## Existing Client Brief

\`\`\`json
${briefText}
\`\`\`

**Instructions for merging:**
- Preserve existing information unless contradicted
- Add new information from the meeting
- Update goal statuses if discussed
- Flag any contradictions you identify
`
  }

  let contextSection = ''
  if (input.additionalContext) {
    contextSection = `
## Additional Context

${input.additionalContext}
`
  }

  return `## Client Brief Update Request

**Client:** ${input.clientName}
**Meeting Date:** ${input.meetingDate}

## Recent Meeting Summary

\`\`\`json
${summaryText}
\`\`\`
${existingBriefSection}${contextSection}
---

Please generate an updated client brief following the system instructions. Remember:
- This is an INTERNAL document - use factual, objective language
- Record facts and goals as stated, not as recommendations
- Include the source/date for new information
- Preserve historical information unless explicitly superseded
- Flag any information conflicts or gaps`
}

// =============================================================================
// EXAMPLES (for few-shot learning)
// =============================================================================

/**
 * Example of good client brief update output.
 * Used for few-shot prompting if needed.
 */
export const GOOD_OUTPUT_EXAMPLE: ClientBriefUpdate = {
  version: '1.0.0',
  snapshot_date: '2025-02-01',
  goals: [
    {
      goal: 'Retire by age 60 - described as "my absolute priority"',
      timeframe: '12 years (by 2037)',
      priority: 1,
    },
    {
      goal: 'Maintain current lifestyle in retirement',
      timeframe: 'Ongoing from retirement',
      priority: 2,
    },
    {
      goal: 'Leave inheritance for children',
      timeframe: 'Estate planning',
      priority: 3,
    },
  ],
  current_situation:
    'Sarah is a 48-year-old marketing manager currently earning approximately $150,000 per year. She has been with her current employer for 7 years. She has superannuation with multiple funds from previous employers (exact balances to be confirmed once statements received). She owns her home jointly with her spouse, with approximately $200,000 remaining on the mortgage. She has one dependent child (19) currently at university, with education support expected to continue for another 3 years.',
  preferences: [
    'Communication: Prefers email for documents, phone for discussions',
    'Risk tolerance: Conservative - "I don\'t want to lose sleep over market drops"',
    'Investment philosophy: Prefers Australian investments, some interest in ethical options',
    'Decision-making: Wants to involve spouse in major decisions',
  ],
  known_facts: [
    'Age: 48 years old (Per meeting 2025-02-01)',
    'Income: Approximately $150,000 per year (client stated 2025-02-01)',
    'Employment: Marketing Manager, 7 years with current employer (Per meeting 2025-02-01)',
    'Family: Married, one child age 19 at university (Per meeting 2025-02-01)',
    'Property: Home owner, joint ownership with spouse (Per meeting 2025-02-01)',
    'Mortgage: Approximately $200,000 remaining (client estimate 2025-02-01)',
    'Super: Multiple funds from previous employers - ABC Super and XYZ Retirement Fund mentioned (Per meeting 2025-02-01)',
    'Savings capacity: Approximately $500/month discretionary (Per meeting 2025-02-01)',
  ],
  unknowns_needed: [
    'Exact superannuation balances from all funds',
    'Current employer contribution rate (may differ from standard 11.5%)',
    'Spouse superannuation details and retirement plans',
    'Existing life insurance and income protection arrangements',
    'Tax returns for last 3 years (income verification)',
    'Details of any other investments or assets',
  ],
  risks_noted: [
    'Potential super fund fragmentation - may have lost track of some accounts',
    'Unknown insurance coverage status',
    'Single income dependency during university support period',
    'No confirmed income protection insurance in place',
  ],
  next_steps: [
    'Client to provide super statements from previous employers',
    'Client to provide last 3 years tax returns',
    'Client to discuss super consolidation options with spouse',
    'Advisor to prepare preliminary retirement projections',
    'Advisor to research income protection options',
    'Schedule follow-up meeting in 2 weeks',
  ],
}

/**
 * Example of bad output with violations annotated.
 * Used for training and validation.
 */
export const BAD_OUTPUT_EXAMPLE = {
  violations: [
    {
      text: 'Sarah should consolidate her super funds',
      reason: 'Advisory language "should" - brief should record facts, not give advice',
    },
    {
      text: 'The best option is to increase contributions',
      reason: 'Contains "the best option" - this is advice',
    },
    {
      text: 'I recommend getting income protection insurance immediately',
      reason: 'Contains "I recommend" and "immediately" - forbidden phrases',
    },
    {
      text: 'She must retire at 60 to achieve her goals',
      reason: 'Contains "must" - demanding/advisory language',
    },
  ],
  correctedVersions: [
    'Super consolidation was discussed as an option to explore',
    'Various contribution strategies were outlined during the meeting',
    'Income protection insurance was identified as a potential gap to review',
    'Client expressed retirement by age 60 as her primary goal',
  ],
}

/**
 * Example of merging with existing brief.
 */
export const MERGE_EXAMPLE = {
  existingBrief: {
    snapshot_date: '2024-12-15',
    goals: [
      {
        goal: 'Retire by age 60',
        timeframe: '12-13 years',
        priority: 1,
      },
    ],
    current_situation: 'Sarah is a marketing professional in her late 40s.',
    known_facts: ['Age: Late 40s (2024-12-15)', 'Occupation: Marketing (2024-12-15)'],
  },
  meetingSummary: 'Confirmed age 48, income $150k, refined retirement goal...',
  mergeNotes:
    'Updated age from "late 40s" to "48 years old" with new source date. Preserved original goal entry but added client quote. Added significant new detail to situation summary.',
}

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default {
  SYSTEM_PROMPT,
  USER_PROMPT_TEMPLATE,
  OUTPUT_SCHEMA_DESCRIPTION,
  promptVersion: PROMPT_VERSION,
  examples: {
    good: GOOD_OUTPUT_EXAMPLE,
    bad: BAD_OUTPUT_EXAMPLE,
    merge: MERGE_EXAMPLE,
  },
}
