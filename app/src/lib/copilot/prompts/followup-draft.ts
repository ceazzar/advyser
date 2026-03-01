/**
 * Follow-up Draft Prompt Template
 *
 * Generates a neutral follow-up message draft after a client meeting.
 * Output is a DRAFT for ADVISOR REVIEW - not to be sent directly to clients.
 *
 * @module lib/copilot/prompts/followup-draft
 * @version 1.0.0
 */

import type { ActionItems, Channel, FollowupDraft, MeetingSummary, Tone } from '@/types/copilot'

import { buildSystemPrompt, DRAFT_LABEL,PROMPT_VERSION } from './_shared_rules'

// =============================================================================
// INPUT TYPES
// =============================================================================

/**
 * Input required to generate a follow-up draft.
 */
export interface FollowupDraftInput {
  /** Client's full name */
  clientName: string
  /** Advisor's full name */
  advisorName: string
  /** Communication channel */
  channel: Channel
  /** Desired tone for the message */
  tone: Tone
  /** Meeting summary (required) */
  meetingSummary: MeetingSummary | string
  /** Action items from the meeting (optional, enriches the draft) */
  actionItems?: ActionItems | string
  /** Advisor's business name (optional) */
  businessName?: string
  /** Advisor's contact phone (optional) */
  contactPhone?: string
  /** Additional instructions or requirements */
  additionalInstructions?: string
}

// =============================================================================
// OUTPUT SCHEMA DESCRIPTION
// =============================================================================

/**
 * JSON schema description for follow-up draft output.
 * Used to guide LLM output format.
 */
export const OUTPUT_SCHEMA_DESCRIPTION = `
{
  "version": "string - Schema version (e.g., '1.0.0')",
  "channel": "enum - email | sms | portal_message",
  "subject": "string (optional) - Subject line for email channel",
  "body": "string - Full message body including draft label and signature",
  "attachments_requested": ["string - Document or information requested from client"],
  "call_to_action": "string - Clear next step for the client",
  "tone": "enum - formal | friendly | neutral"
}
` as const

// =============================================================================
// SYSTEM PROMPT
// =============================================================================

/**
 * System prompt for follow-up draft generation.
 * Includes shared rules and task-specific instructions.
 */
export const SYSTEM_PROMPT = buildSystemPrompt(`
# Task: Draft Follow-up Message

You are drafting a follow-up message for a licensed Australian financial advisor to send to their client after a meeting. This is a DRAFT that requires advisor review before sending.

## Critical Constraints

1. **This is a DRAFT** - The advisor must review and approve before sending
2. **NO ADVICE** - Do not provide financial advice in the message
3. **NO RECOMMENDATIONS** - Do not recommend products, strategies, or actions
4. **NEUTRAL TONE** - Warm and professional, but not presumptuous
5. **FACTS ONLY** - Recap what was discussed, not what client should do

## Message Structure

### Email Structure
1. **Subject Line**: Brief, descriptive, not sales-y
2. **Greeting**: Appropriate to tone (formal: "Dear Sarah", friendly: "Hi Sarah")
3. **Thank You**: Brief appreciation for their time
4. **Recap**: Summary of key topics discussed (factual)
5. **Next Steps**: What advisor will do, what client indicated they would do
6. **Document Requests**: If applicable, list clearly
7. **Call to Action**: Clear, single next step
8. **Closing**: Professional sign-off with contact info

### SMS Structure
- Maximum 160 characters (or link to details)
- Brief acknowledgment + single action
- Link to portal for details if needed

### Portal Message Structure
- Medium length (2-3 paragraphs)
- Can reference uploaded documents
- More conversational than email

## Tone Guidelines

**Formal:**
- "Dear [Name],"
- Full sentences, professional vocabulary
- "Kind regards," / "Best regards,"

**Friendly:**
- "Hi [Name],"
- Warmer language, slightly more personal
- "Thanks," / "Cheers," (appropriate for AU)

**Neutral:**
- "Dear [Name]," or "Hello [Name],"
- Professional but not stiff
- "Best regards,"

## What NOT to Include

- Financial advice or recommendations
- Specific product names
- Specific dollar amounts (refer generally)
- Pressure language ("urgent", "don't delay", "act now")
- Promises or guarantees
- Personal opinions about strategies
- Comparative statements ("better option", "best choice")

## What to Include

- Gratitude for their time
- Factual recap of topics covered
- Clear statement of advisor's next actions
- Reminder of what client indicated they would do (not demands)
- Clear, achievable call to action
- Contact information
- Meeting date/time if relevant

## Call to Action Patterns (GOOD)

- "Please let me know if you have any questions"
- "Feel free to upload your documents through the secure portal"
- "I'll be in touch once I've completed the analysis"
- "Please don't hesitate to reach out if anything comes up"

## Call to Action Patterns (BAD - avoid)

- "You should..." (advice)
- "I recommend you..." (recommendation)
- "Make sure you..." (directive)
- "You need to..." (demanding)
- "Don't forget to..." (presumptuous)

## Draft Label

All drafts MUST include this label at the top:

${DRAFT_LABEL.trim()}

## Output Format

Return a valid JSON object matching this schema:

${OUTPUT_SCHEMA_DESCRIPTION}
`)

// =============================================================================
// USER PROMPT TEMPLATE
// =============================================================================

/**
 * Generate the user prompt for follow-up draft generation.
 * @param input - Follow-up draft input
 * @returns Formatted user prompt string
 */
export function USER_PROMPT_TEMPLATE(input: FollowupDraftInput): string {
  const summaryText =
    typeof input.meetingSummary === 'string'
      ? input.meetingSummary
      : JSON.stringify(input.meetingSummary, null, 2)

  let actionItemsSection = ''
  if (input.actionItems) {
    const actionsText =
      typeof input.actionItems === 'string'
        ? input.actionItems
        : JSON.stringify(input.actionItems, null, 2)
    actionItemsSection = `
## Action Items

\`\`\`json
${actionsText}
\`\`\`
`
  }

  let contactSection = ''
  if (input.businessName || input.contactPhone) {
    contactSection = `
## Contact Details for Signature
${input.businessName ? `**Business:** ${input.businessName}` : ''}
${input.contactPhone ? `**Phone:** ${input.contactPhone}` : ''}
`
  }

  let instructionsSection = ''
  if (input.additionalInstructions) {
    instructionsSection = `
## Additional Instructions

${input.additionalInstructions}
`
  }

  return `## Message Parameters

**Client:** ${input.clientName}
**Advisor:** ${input.advisorName}
**Channel:** ${input.channel}
**Tone:** ${input.tone}

## Meeting Summary

\`\`\`json
${summaryText}
\`\`\`
${actionItemsSection}${contactSection}${instructionsSection}
---

Please draft a follow-up ${input.channel === 'email' ? 'email' : input.channel === 'sms' ? 'SMS' : 'message'} following the system instructions. Remember:
- Include the DRAFT label at the top of the body
- Keep tone ${input.tone} throughout
- Do not include advice or recommendations
- Frame client tasks as reminders of what they indicated, not demands
- End with a clear but non-pressuring call to action`
}

// =============================================================================
// EXAMPLES (for few-shot learning)
// =============================================================================

/**
 * Example of good follow-up draft output.
 * Used for few-shot prompting if needed.
 */
export const GOOD_OUTPUT_EXAMPLE: FollowupDraft = {
  version: '1.0.0',
  channel: 'email',
  subject: 'Following up from our meeting - next steps',
  body: `[DRAFT - ADVISOR REVIEW REQUIRED]

This is a draft generated by AI. It must be reviewed and approved by the advisor before being sent to the client.

---

Dear Sarah,

Thank you for taking the time to meet with me today. It was great to discuss your retirement planning goals and learn more about your situation.

During our conversation, we covered several important topics including your superannuation arrangements, retirement timeline, and your preferences around investment risk. I've noted your key priorities, particularly your goal of retiring by age 60.

From here, I'll be working on:
- Preparing some retirement projection scenarios for us to review together
- Researching income protection insurance options
- Putting together a summary of the consolidation options we discussed

As you mentioned, gathering the following documents would help me complete the analysis:
- Super statements from your previous employers
- Your last three tax returns
- Current payslip showing employer contributions

Please feel free to upload these through the secure client portal whenever convenient.

I'll be in touch within the next two weeks with the projections and we can schedule our follow-up meeting then. In the meantime, please don't hesitate to reach out if you have any questions.

Kind regards,
Michael Chen
[Phone number]`,
  attachments_requested: [
    'Super statements from previous employers',
    'Last three years of tax returns',
    'Current payslip showing employer contributions',
  ],
  call_to_action:
    'Upload documents through the secure portal and I will be in touch within two weeks',
  tone: 'formal',
}

/**
 * Example of bad output with violations annotated.
 * Used for training and validation.
 */
export const BAD_OUTPUT_EXAMPLE = {
  violations: [
    {
      text: 'I recommend you consolidate your super as soon as possible',
      reason: 'Contains "I recommend" - forbidden phrase, and gives advice',
    },
    {
      text: 'You should definitely consider the ABC Growth Fund',
      reason: 'Contains "you should" and specific product recommendation',
    },
    {
      text: "Don't delay on providing these documents as it's urgent",
      reason: 'Pressure language - "don\'t delay", "urgent"',
    },
    {
      text: 'The best option for you would be to increase your contributions',
      reason: 'Contains "best option" and gives financial advice',
    },
    {
      text: 'You must provide these documents within 7 days',
      reason: 'Demanding language "must" with deadline pressure',
    },
  ],
  correctedVersions: [
    'We discussed super consolidation as one of the options to explore',
    'I outlined how the ABC Growth Fund works during our meeting',
    'Please upload these documents through the portal when convenient',
    'We discussed various contribution strategies during our meeting',
    'As mentioned, these documents would help with the next stage of analysis',
  ],
}

/**
 * Example SMS draft.
 */
export const SMS_EXAMPLE: FollowupDraft = {
  version: '1.0.0',
  channel: 'sms',
  body: "[DRAFT] Hi Sarah, thanks for today's meeting. I've sent a summary email with next steps. Feel free to reply with any questions. - Michael",
  attachments_requested: [],
  call_to_action: 'Check email for full details',
  tone: 'friendly',
}

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default {
  SYSTEM_PROMPT,
  USER_PROMPT_TEMPLATE,
  OUTPUT_SCHEMA_DESCRIPTION,
  promptVersion: PROMPT_VERSION,
  draftLabel: DRAFT_LABEL,
  examples: {
    good: GOOD_OUTPUT_EXAMPLE,
    bad: BAD_OUTPUT_EXAMPLE,
    sms: SMS_EXAMPLE,
  },
}
