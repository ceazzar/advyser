/**
 * Action Items Prompt Template
 *
 * Extracts action items/tasks for both advisor and client from meeting notes.
 * Output is for ADVISOR INTERNAL USE ONLY.
 *
 * @module lib/copilot/prompts/action-items
 * @version 1.0.0
 */

import type { ActionItems, MeetingSummary } from '@/types/copilot'
import { buildSystemPrompt, PROMPT_VERSION } from './_shared_rules'

// =============================================================================
// INPUT TYPES
// =============================================================================

/**
 * Input required to extract action items.
 */
export interface ActionItemsInput {
  /** Raw meeting transcript or notes */
  transcript: string
  /** Meeting date in ISO format (YYYY-MM-DD) */
  meetingDate: string
  /** Client's full name */
  clientName: string
  /** Advisor's full name */
  advisorName: string
  /** Previously generated meeting summary (optional, improves extraction) */
  meetingSummary?: MeetingSummary | string
}

// =============================================================================
// OUTPUT SCHEMA DESCRIPTION
// =============================================================================

/**
 * JSON schema description for action items output.
 * Used to guide LLM output format.
 */
export const OUTPUT_SCHEMA_DESCRIPTION = `
{
  "version": "string - Schema version (e.g., '1.0.0')",
  "advisor_tasks": [
    {
      "task": "string - Clear description of the task",
      "priority": "enum - high | medium | low",
      "due_by": "string (optional) - Due date in ISO format (YYYY-MM-DD)"
    }
  ],
  "client_tasks": [
    {
      "task": "string - Clear description framed as what client indicated they would do",
      "description": "string - Additional details or context"
    }
  ],
  "next_meeting_objective": "string (optional) - Purpose for the next meeting if discussed",
  "dependencies": ["string - Description of task dependencies identified"]
}
` as const

// =============================================================================
// SYSTEM PROMPT
// =============================================================================

/**
 * System prompt for action items extraction.
 * Includes shared rules and task-specific instructions.
 */
export const SYSTEM_PROMPT = buildSystemPrompt(`
# Task: Extract Action Items

You are processing meeting notes for a licensed Australian financial advisor. Extract all action items and tasks mentioned or implied in the meeting for both the advisor and the client.

## Your Objective

Identify all follow-up tasks from the meeting and organize them by responsible party. Create a clear, actionable task list that the advisor can use to track progress.

## Identifying Advisor Tasks

Look for tasks the advisor needs to complete:
- Research or analysis to perform
- Documents to prepare (SOA, ROA, quotes, projections)
- Calculations to run (retirement projections, insurance needs analysis)
- Referrals to make
- Follow-up calls or emails to send
- Internal compliance tasks
- Third-party inquiries (product providers, super funds)
- File notes to complete

## Identifying Client Tasks

Look for tasks the client committed to or needs to do:
- Documents to provide (tax returns, super statements, payslips)
- Information to gather (policy numbers, account details)
- Decisions to make
- Forms to sign or complete
- Actions to take (consolidate super, update beneficiaries)
- People to contact (existing advisors, employers, family members)
- Approvals to obtain (spouse, business partners)

**CRITICAL:** Frame client tasks as what the client "indicated they would do" or "agreed to provide" - NOT as demands or requirements.

## Priority Assignment Criteria

**HIGH Priority:**
- Time-sensitive (explicit deadline mentioned)
- Blocking other work (can't proceed without this)
- Compliance-related (regulatory requirement)
- Client explicitly marked as urgent
- Financial impact of delay

**MEDIUM Priority:**
- Important but no immediate deadline
- Part of the standard process
- Needed before next meeting but not immediately

**LOW Priority:**
- Nice to have
- Can be deferred if needed
- Background research
- Optional follow-up

## Identifying Dependencies

Note when:
- One task cannot start until another completes
- Information from one party is needed before another can act
- Sequential steps in a process
- External dependencies (waiting on third parties)

## Output Quality Criteria

**GOOD Task Descriptions:**
- "Prepare retirement projection scenarios based on current super balance and contribution rates"
- "Client indicated they would locate their existing super statements from ABC Super"
- "Research income protection insurance quotes from three providers"

**BAD Task Descriptions (violations):**
- "Client must provide super statements" (demands - use "indicated they would")
- "Client should consolidate their super" (advice - we don't tell them what to do)
- "You need to increase your contributions" (direct advice to client)

## Output Format

Return a valid JSON object matching this schema:

${OUTPUT_SCHEMA_DESCRIPTION}
`)

// =============================================================================
// USER PROMPT TEMPLATE
// =============================================================================

/**
 * Generate the user prompt for action items extraction.
 * @param input - Action items input
 * @returns Formatted user prompt string
 */
export function USER_PROMPT_TEMPLATE(input: ActionItemsInput): string {
  let summarySection = ''
  if (input.meetingSummary) {
    const summaryText =
      typeof input.meetingSummary === 'string'
        ? input.meetingSummary
        : JSON.stringify(input.meetingSummary, null, 2)
    summarySection = `
## Meeting Summary (for context)

\`\`\`json
${summaryText}
\`\`\`
`
  }

  return `## Meeting Details

**Meeting Date:** ${input.meetingDate}
**Client:** ${input.clientName}
**Advisor:** ${input.advisorName}

## Meeting Transcript/Notes

\`\`\`
${input.transcript}
\`\`\`
${summarySection}
---

Please extract all action items following the system instructions. Remember:
- Advisor tasks should be clear and actionable
- Client tasks should be framed as what they "indicated they would do" or "agreed to"
- Do NOT create tasks that tell the client what to do - only capture what was discussed
- Include dependencies where tasks are linked
- Assign priorities based on the criteria provided`
}

// =============================================================================
// EXAMPLES (for few-shot learning)
// =============================================================================

/**
 * Example of good action items output.
 * Used for few-shot prompting if needed.
 */
export const GOOD_OUTPUT_EXAMPLE: ActionItems = {
  version: '1.0.0',
  advisor_tasks: [
    {
      task: 'Prepare preliminary retirement projection scenarios based on current information',
      priority: 'high',
      due_by: '2025-02-15',
    },
    {
      task: 'Research income protection insurance options from three major providers',
      priority: 'medium',
      due_by: '2025-02-20',
    },
    {
      task: 'Complete fact-find documentation from meeting notes',
      priority: 'high',
      due_by: '2025-02-10',
    },
    {
      task: 'Send follow-up email with document checklist',
      priority: 'high',
      due_by: '2025-02-08',
    },
    {
      task: 'Contact ABC Super to obtain rollover forms',
      priority: 'low',
    },
  ],
  client_tasks: [
    {
      task: 'Sarah indicated she would locate super statements from previous employers',
      description:
        'Specifically looking for ABC Super and XYZ Retirement Fund statements. Sarah mentioned she may need to contact HR at her previous employer.',
    },
    {
      task: 'Client agreed to provide last three years of tax returns',
      description: 'Available through MyGov account. Client will download and forward via secure portal.',
    },
    {
      task: 'Sarah mentioned she would discuss super consolidation with her spouse',
      description: 'Wants to ensure spouse is comfortable before proceeding with any changes.',
    },
    {
      task: 'Client to confirm current employer superannuation contribution rate',
      description: 'Check with payroll or review recent payslip. May be different from standard 11.5%.',
    },
  ],
  next_meeting_objective:
    'Review retirement projections and discuss strategy options based on gathered information',
  dependencies: [
    'Retirement projections depend on receiving super statements and tax returns from client',
    'Strategy discussion cannot proceed until spouse consultation is complete',
    'Insurance recommendations require income details from tax returns',
  ],
}

/**
 * Example of bad output with violations annotated.
 * Used for training and validation.
 */
export const BAD_OUTPUT_EXAMPLE = {
  violations: [
    {
      text: 'Client must provide super statements within 7 days',
      reason: 'Uses demanding language "must" - should be "indicated they would"',
    },
    {
      text: 'Client should consolidate their super funds',
      reason: 'This is advice, not a task extraction - uses "should"',
    },
    {
      text: 'Recommend switching to a low-cost industry fund',
      reason: 'This is advice, not an action item - uses "recommend"',
    },
    {
      text: 'Client needs to increase contributions immediately',
      reason: 'Advisory language "needs to" - we capture what was discussed, not prescribe actions',
    },
  ],
  correctedVersions: [
    'Client indicated they would provide super statements before the next meeting',
    'Super consolidation options were discussed as a topic for further consideration',
    'Research low-cost fund options as requested for comparison',
    'Client expressed interest in understanding contribution increase options',
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
