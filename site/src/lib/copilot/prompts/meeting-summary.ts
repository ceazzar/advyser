/**
 * Meeting Summary Prompt Template
 *
 * Generates a structured summary of a client meeting from transcript/notes.
 * Output is for ADVISOR INTERNAL USE ONLY.
 *
 * @module lib/copilot/prompts/meeting-summary
 * @version 1.0.0
 */

import type { MeetingNotesInput,MeetingSummary } from '@/types/copilot'

import { buildSystemPrompt, PROMPT_VERSION } from './_shared_rules'

// =============================================================================
// INPUT TYPES
// =============================================================================

/**
 * Input required to generate a meeting summary.
 */
export interface MeetingSummaryInput {
  /** Raw meeting transcript or notes */
  transcript: string
  /** Meeting date in ISO format (YYYY-MM-DD) */
  meetingDate: string
  /** Type of meeting (optional, will be inferred if not provided) */
  meetingType?: string
  /** Client's full name */
  clientName: string
  /** Advisor's full name */
  advisorName: string
  /** Additional context or instructions */
  additionalContext?: string
  /** Meeting duration in minutes (optional) */
  durationMinutes?: number
}

// =============================================================================
// OUTPUT SCHEMA DESCRIPTION
// =============================================================================

/**
 * JSON schema description for meeting summary output.
 * Used to guide LLM output format.
 */
export const OUTPUT_SCHEMA_DESCRIPTION = `
{
  "version": "string - Schema version (e.g., '1.0.0')",
  "meeting_type": "enum - One of: initial_consultation, fact_find, review_meeting, strategy_session, strategy_presentation, soa_presentation, insurance_review, estate_planning, super_consolidation, general_catchup, adhoc, other",
  "purpose": "string - Brief statement of meeting purpose/objective",
  "participants": [
    {
      "name": "string - Participant's name",
      "role": "enum - One of: advisor, client, spouse_partner, support_person, other",
      "authorisedRepNumber": "string (optional) - AR number for advisors only"
    }
  ],
  "topics_discussed": ["string - Topic title and brief description"],
  "client_goals": ["string - Goal as stated or paraphrased from client"],
  "constraints_mentioned": ["string - Constraint, limitation, or parameter mentioned"],
  "decisions_made": ["string - Decision made during the meeting"],
  "open_questions": ["string - Question requiring follow-up"],
  "summary": "string - Executive summary (2-3 paragraphs max)"
}
` as const

// =============================================================================
// SYSTEM PROMPT
// =============================================================================

/**
 * System prompt for meeting summary generation.
 * Includes shared rules and task-specific instructions.
 */
export const SYSTEM_PROMPT = buildSystemPrompt(`
# Task: Generate Meeting Summary

You are processing meeting notes for a licensed Australian financial advisor. Generate a structured summary of the meeting that captures key information for the advisor's internal records.

## Your Objective

Extract and organize the key information from the meeting into a structured format. Focus on:
1. Who was present and their roles
2. What topics were discussed
3. What goals the client expressed
4. What constraints or limitations were mentioned
5. What decisions were made
6. What questions remain open

## Processing Guidelines

### Identifying Participants
- List all people mentioned or who spoke
- Assign appropriate roles based on context
- For advisors, include AR number if mentioned

### Extracting Client Goals
- Use the client's own words where possible (preserve quotes)
- Distinguish between stated goals and implied preferences
- Note any timeframes mentioned
- Do not add goals that weren't discussed

### Capturing Constraints
- Budget limitations
- Timeline requirements
- Risk tolerance statements
- Lifestyle considerations
- Family obligations
- Health factors
- Legal restrictions

### Recording Decisions
- What was agreed upon
- Who made or accepted the decision
- Any conditions attached

### Identifying Open Questions
- Questions the client asked that weren't fully answered
- Information the advisor needs to research
- Documents or data needed before proceeding

### Writing the Summary
- 2-3 paragraphs maximum
- Factual and neutral tone
- Capture the essence of the meeting
- Do NOT include recommendations or advice

## Output Quality Criteria

**GOOD Output:**
- "Sarah mentioned wanting to retire by age 60, which she described as 'my absolute priority'"
- "John expressed concerns about market volatility affecting his portfolio"
- "The advisor explained the differences between accumulation and pension phase super"

**BAD Output (violations):**
- "Sarah should aim to retire at 60" (advisory - uses "should")
- "John would benefit from a more conservative portfolio" (advice)
- "I recommend reviewing the insurance coverage" (recommendation)

## Output Format

Return a valid JSON object matching this schema:

${OUTPUT_SCHEMA_DESCRIPTION}
`)

// =============================================================================
// USER PROMPT TEMPLATE
// =============================================================================

/**
 * Generate the user prompt for a meeting summary request.
 * @param input - Meeting notes input
 * @returns Formatted user prompt string
 */
export function USER_PROMPT_TEMPLATE(input: MeetingSummaryInput): string {
  const contextSection = input.additionalContext
    ? `\n**Additional Context:** ${input.additionalContext}\n`
    : ''

  const durationSection = input.durationMinutes
    ? `\n**Meeting Duration:** ${input.durationMinutes} minutes\n`
    : ''

  return `## Meeting Details

**Meeting Date:** ${input.meetingDate}
**Meeting Type:** ${input.meetingType || 'To be determined from content'}
**Client:** ${input.clientName}
**Advisor:** ${input.advisorName}${durationSection}${contextSection}

## Meeting Transcript/Notes

\`\`\`
${input.transcript}
\`\`\`

---

Please generate a structured meeting summary following the system instructions. Remember:
- Extract facts only - do not provide advice
- Use the client's own words for goals where possible
- Attribute any discussed strategies to ${input.advisorName}
- Label anything unclear as needing follow-up`
}

// =============================================================================
// EXAMPLES (for few-shot learning)
// =============================================================================

/**
 * Example of good meeting summary output.
 * Used for few-shot prompting if needed.
 */
export const GOOD_OUTPUT_EXAMPLE: MeetingSummary = {
  version: '1.0.0',
  meeting_type: 'initial_consultation',
  purpose: 'Initial consultation to understand retirement planning needs',
  participants: [
    { name: 'Sarah Johnson', role: 'client' },
    { name: 'Michael Chen', role: 'advisor', authorisedRepNumber: '123456' },
  ],
  topics_discussed: [
    'Current superannuation arrangements and consolidation options',
    'Retirement timeline and lifestyle expectations',
    'Risk tolerance and investment preferences',
    'Insurance coverage review',
  ],
  client_goals: [
    'Retire by age 60 - described as "my absolute priority"',
    'Maintain current lifestyle in retirement',
    'Leave something for the children',
  ],
  constraints_mentioned: [
    'Budget: Current savings capacity limited to $500/month',
    'Timeline: 12 years until target retirement age',
    'Risk tolerance: "I don\'t want to lose sleep over market drops"',
    'Family: Supporting daughter through university for next 3 years',
  ],
  decisions_made: [
    'Client agreed to provide last 3 years of tax returns',
    'Client to locate old superannuation statements',
    'Next meeting scheduled for 2 weeks',
  ],
  open_questions: [
    'Current employer super contribution rate - client to confirm',
    'Details of existing life insurance policies',
    'Spouse\'s super balance and arrangements',
  ],
  summary:
    'This initial consultation established Sarah\'s primary retirement goal of ceasing work by age 60, approximately 12 years from now. Sarah expressed a conservative approach to risk, noting she values peace of mind over maximum returns. Current constraints include supporting her daughter through university and a monthly savings capacity of around $500.\n\nMichael explained the process of reviewing her situation comprehensively, including superannuation consolidation options and insurance needs. Sarah will gather documentation including tax returns, super statements, and insurance policies before the next meeting. Several information gaps remain, including spouse details and current employer contribution rates.',
}

/**
 * Example of bad output with violations annotated.
 * Used for training and validation.
 */
export const BAD_OUTPUT_EXAMPLE = {
  violations: [
    {
      text: 'Sarah should consolidate her super funds',
      reason: 'Uses "should" - this is advice, not summary',
    },
    {
      text: 'I recommend increasing contributions to the maximum',
      reason: 'Uses "I recommend" - forbidden phrase',
    },
    {
      text: 'The best option is to switch to a growth portfolio',
      reason: 'Uses "the best option" - advisory language',
    },
  ],
  correctedVersions: [
    'Superannuation consolidation was discussed as one option',
    'The potential benefits of increased contributions were explained',
    'Various portfolio options including growth strategies were outlined',
  ],
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
  },
}
