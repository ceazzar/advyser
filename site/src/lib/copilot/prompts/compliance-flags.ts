/**
 * Compliance Flags Prompt Template
 *
 * Identifies potentially risky wording and compliance gaps in advisor content.
 * Output is for ADVISOR INTERNAL REVIEW ONLY.
 *
 * @module lib/copilot/prompts/compliance-flags
 * @version 1.0.0
 */

import type { ComplianceFlags, ComplianceFlag, WordingSuggestion } from '@/types/copilot'
import { buildSystemPrompt, PROMPT_VERSION, FORBIDDEN_PHRASES_LIST } from './_shared_rules'

// =============================================================================
// INPUT TYPES
// =============================================================================

/**
 * Input required for compliance checking.
 */
export interface ComplianceFlagsInput {
  /** The content to check */
  content: string
  /** Type of content being checked */
  contentType:
    | 'meeting_summary'
    | 'followup_email'
    | 'followup_sms'
    | 'client_brief'
    | 'soa_draft'
    | 'general'
  /** Client's name (for context) */
  clientName: string
  /** Advisor's name */
  advisorName: string
  /** Additional context about the content */
  additionalContext?: string
}

// =============================================================================
// OUTPUT SCHEMA DESCRIPTION
// =============================================================================

/**
 * JSON schema description for compliance flags output.
 * Used to guide LLM output format.
 */
export const OUTPUT_SCHEMA_DESCRIPTION = `
{
  "version": "string - Schema version (e.g., '1.0.0')",
  "flags": [
    {
      "severity": "enum - critical | warning | info",
      "excerpt": "string - Exact text that triggered this flag",
      "reason": "string - Explanation of why this is a compliance concern",
      "safer_rewrite": "string (optional) - Suggested safer alternative wording"
    }
  ],
  "missing_info_checks": ["string - Description of missing compliance elements"],
  "wording_suggestions": [
    {
      "original": "string - Original text",
      "suggested": "string - Improved version",
      "reason": "string - Why this is better from compliance perspective"
    }
  ]
}
` as const

// =============================================================================
// SYSTEM PROMPT
// =============================================================================

/**
 * System prompt for compliance checking.
 * Includes shared rules and task-specific instructions.
 */
export const SYSTEM_PROMPT = buildSystemPrompt(`
# Task: Compliance Review

You are reviewing content created for or by a licensed Australian financial advisor. Your job is to identify compliance concerns, risky wording, and missing information that could create regulatory or professional issues.

## Your Role

You are a compliance reviewer, not a content creator. Your outputs help the advisor identify and fix potential issues BEFORE content is used or sent to clients.

## Australian Regulatory Context

This review considers:
- **ASIC Regulatory Guide 175** - Licensing requirements
- **AFSL Conditions** - Must not provide unlicensed advice
- **Best Interests Duty** (s961B) - Personal advice must be in client's best interests
- **Appropriateness** (s961G) - Advice must be appropriate to client circumstances
- **General Advice Warning** - Required when advice doesn't consider personal circumstances
- **FASEA Code of Ethics** - Professional and ethical standards

## Severity Levels

### Critical (Must Fix)
- Could constitute unlicensed advice
- Could breach AFSL conditions
- Could be misleading or deceptive conduct
- Could expose advisor to ASIC action
- Contains clear recommendations without appropriate basis

### Warning (Should Review)
- Could be misinterpreted by clients
- Lacks appropriate qualifications or disclaimers
- Uses language that could imply advice
- Missing standard compliance elements

### Info (Consider Improving)
- Stylistic improvements for clarity
- Best practice suggestions
- Enhanced professionalism
- Optional refinements

## Patterns to Flag

### CRITICAL - Always Flag These
1. **Direct Recommendations**
   - "You should..." / "You must..." / "You need to..."
   - "I recommend..." / "I suggest..." / "I advise..."
   - "The best option..." / "The right choice..."

2. **Product Recommendations** (outside SOA context)
   - Specific fund or product names with positive framing
   - "Switch to..." / "Transfer to..."
   - Comparative statements ("X is better than Y")

3. **Guarantees/Promises**
   - "Guaranteed returns..."
   - "Will definitely..." / "Certain to..."
   - "Risk-free..." / "Safe investment..."

4. **Pressure Tactics**
   - "Act now..." / "Urgent..."
   - "Limited time..." / "Don't miss out..."

### WARNING - Flag for Review
1. **Implied Advice**
   - "It would be wise to..."
   - "Consider..." (without "may wish to")
   - "You could benefit from..."

2. **Missing Qualifications**
   - Past performance without disclaimers
   - Projections without basis statements
   - General advice without warnings

3. **Inappropriate Certainty**
   - "This will achieve..." (should be "may help achieve")
   - "You will see returns of..." (should be "historical returns have been")

### INFO - Suggest Improvements
1. **Clarity Enhancements**
   - Ambiguous pronouns
   - Complex sentence structures
   - Jargon without explanation

2. **Professionalism**
   - Informal language in formal context
   - Missing courtesy elements
   - Inconsistent tone

## Missing Information Checks

Flag if content is missing:
- General advice warning (when applicable)
- Source attribution for facts
- Date stamps on time-sensitive information
- Disclosure requirements
- Risk acknowledgments
- Basis of advice statement (for personal advice)

## Forbidden Phrases (Auto-Flag as Critical)

The following phrases must ALWAYS be flagged if present:

${FORBIDDEN_PHRASES_LIST}

## Output Quality

**GOOD Flag:**
- Specific excerpt quoted
- Clear explanation of issue
- Concrete suggestion for improvement

**POOR Flag:**
- Vague reference to content
- Generic "might be problematic"
- No actionable suggestion

## Output Format

Return a valid JSON object matching this schema:

${OUTPUT_SCHEMA_DESCRIPTION}

### Flag Ordering
1. Critical flags first (most urgent)
2. Warning flags second
3. Info flags last
`)

// =============================================================================
// USER PROMPT TEMPLATE
// =============================================================================

/**
 * Generate the user prompt for compliance checking.
 * @param input - Compliance check input
 * @returns Formatted user prompt string
 */
export function USER_PROMPT_TEMPLATE(input: ComplianceFlagsInput): string {
  const contentTypeLabels: Record<string, string> = {
    meeting_summary: 'Meeting Summary',
    followup_email: 'Follow-up Email Draft',
    followup_sms: 'Follow-up SMS Draft',
    client_brief: 'Client Brief (Internal)',
    soa_draft: 'Statement of Advice Draft',
    general: 'General Content',
  }

  let contextSection = ''
  if (input.additionalContext) {
    contextSection = `
## Additional Context

${input.additionalContext}
`
  }

  return `## Compliance Review Request

**Content Type:** ${contentTypeLabels[input.contentType] || input.contentType}
**Client:** ${input.clientName}
**Advisor:** ${input.advisorName}

## Content to Review

\`\`\`
${input.content}
\`\`\`
${contextSection}
---

Please review this content for compliance issues following the system instructions:
1. Flag any forbidden phrases (CRITICAL severity)
2. Identify language that could be interpreted as advice
3. Check for missing compliance elements
4. Suggest wording improvements where appropriate

Order flags by severity: Critical first, then Warning, then Info.`
}

// =============================================================================
// EXAMPLES (for few-shot learning)
// =============================================================================

/**
 * Example of good compliance flags output.
 * Used for few-shot prompting if needed.
 */
export const GOOD_OUTPUT_EXAMPLE: ComplianceFlags = {
  version: '1.0.0',
  flags: [
    {
      severity: 'critical',
      excerpt: 'I recommend consolidating your super funds as soon as possible',
      reason:
        'Contains forbidden phrase "I recommend" and constitutes specific advice without SOA context',
      safer_rewrite:
        'Super consolidation was discussed as one option to explore - we can review this further once I have your full details',
    },
    {
      severity: 'critical',
      excerpt: 'You should definitely switch to the ABC Growth Fund',
      reason:
        'Contains forbidden phrase "you should" and recommends specific product without appropriate basis documentation',
      safer_rewrite:
        'During our meeting, I outlined how the ABC Growth Fund works and its historical performance',
    },
    {
      severity: 'warning',
      excerpt: 'This will help you achieve your retirement goals',
      reason:
        'Uses certain language "will help" - outcomes cannot be guaranteed. Should use conditional language.',
      safer_rewrite: 'This may help work towards your retirement goals',
    },
    {
      severity: 'warning',
      excerpt: 'The fund has returned 8% per year',
      reason: 'Past performance statement without standard disclaimer',
      safer_rewrite:
        'The fund has returned approximately 8% per year historically. Past performance is not indicative of future performance.',
    },
    {
      severity: 'info',
      excerpt: "Don't forget to send me those documents",
      reason: '"Don\'t forget" can sound demanding. Consider softer phrasing.',
      safer_rewrite: 'When convenient, please send through the documents we discussed',
    },
  ],
  missing_info_checks: [
    'General advice warning not present - required if this content goes to client',
    'No date stamp on performance figures - could become misleading if outdated',
    'Missing disclosure of advisor AR number',
  ],
  wording_suggestions: [
    {
      original: "I'll get back to you ASAP",
      suggested: "I'll be in touch within [specific timeframe]",
      reason:
        'Specific timeframe manages expectations better and is more professional',
    },
    {
      original: 'Let me know if you have questions',
      suggested: 'Please don\'t hesitate to reach out if you have any questions',
      reason: 'Slightly more formal and welcoming tone',
    },
  ],
}

/**
 * Example of bad output with issues annotated.
 * Used for training and validation.
 */
export const BAD_OUTPUT_EXAMPLE = {
  issues: [
    {
      problem: 'Flag without specific excerpt',
      badOutput: { severity: 'warning', reason: 'Some parts sound like advice' },
      fix: 'Always quote the specific text that triggered the flag',
    },
    {
      problem: 'No actionable suggestion',
      badOutput: { excerpt: 'You should...', reason: 'Advisory language', safer_rewrite: '' },
      fix: 'Always provide a concrete safer alternative',
    },
    {
      problem: 'Wrong severity level',
      badOutput: { severity: 'info', excerpt: 'I recommend...', reason: 'Forbidden phrase' },
      fix: 'Forbidden phrases should always be CRITICAL severity',
    },
  ],
}

/**
 * Example content with compliance issues for testing.
 */
export const TEST_CONTENT_WITH_ISSUES = `
Dear Sarah,

Thank you for meeting with me today. Based on our discussion, I recommend you consolidate your super funds into the ABC Growth Fund as soon as possible. This is definitely the best option for your situation.

You should also consider increasing your contributions - this will guarantee you reach your retirement goals faster. The fund has returned 12% per year, so you can expect similar returns going forward.

Don't delay on this - act now to maximise your benefits. I've attached the application forms.

Let me know if you have questions.

Regards,
Michael
`

/**
 * Example of clean content that passes review.
 */
export const CLEAN_CONTENT_EXAMPLE = `
Dear Sarah,

Thank you for taking the time to meet with me today. It was valuable to learn more about your retirement goals and current situation.

During our conversation, we discussed several topics including your superannuation arrangements, your retirement timeline, and your preferences around investment risk. I've noted your goal of retiring by age 60 as a key priority.

From here, I'll be:
- Preparing some retirement projection scenarios for us to review together
- Researching options as discussed
- Putting together a summary of the consolidation considerations we covered

As you mentioned, gathering your super statements and tax returns would help me complete the analysis. Please feel free to upload these through the secure portal when convenient.

I'll be in touch within the next two weeks. In the meantime, please don't hesitate to reach out if you have any questions.

Kind regards,
Michael Chen
Authorised Representative No. 123456
ABC Financial Planning Pty Ltd
AFSL No. 987654

This is general information only and does not take into account your personal objectives, financial situation or needs. You should consider whether this information is appropriate for you before acting on it.
`

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
    testContent: TEST_CONTENT_WITH_ISSUES,
    cleanContent: CLEAN_CONTENT_EXAMPLE,
  },
}
