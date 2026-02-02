/**
 * Safety Checker Prompt Template
 *
 * Post-validates generated Copilot outputs before they're shown to advisors.
 * This is the FINAL GATE to catch any outputs that violate safety rules.
 *
 * @module lib/copilot/prompts/safety-checker
 * @version 1.0.0
 */

import type { SafetyCheckResult, SafetyViolation, CopilotOutputContent } from '@/types/copilot'
import { buildSystemPrompt, PROMPT_VERSION, FORBIDDEN_PHRASES } from './_shared_rules'

// =============================================================================
// INPUT TYPES
// =============================================================================

/**
 * Input required for safety checking.
 */
export interface SafetyCheckerInput {
  /** Type of output being validated */
  outputType:
    | 'meeting_summary'
    | 'action_items'
    | 'followup_draft'
    | 'client_brief_update'
    | 'compliance_flags'
  /** The generated output to validate (as JSON string or object) */
  generatedOutput: CopilotOutputContent | string
}

// =============================================================================
// OUTPUT SCHEMA DESCRIPTION
// =============================================================================

/**
 * JSON schema description for safety check result output.
 * Used to guide LLM output format.
 */
export const OUTPUT_SCHEMA_DESCRIPTION = `
{
  "version": "string - Schema version (e.g., '1.0.0')",
  "passed": "boolean - true if output is safe, false if violations found",
  "violations": [
    {
      "type": "enum - recommendation | advice | guarantee | unsuitable | pii_exposure | regulatory_breach",
      "description": "string - Description of the violation",
      "excerpt": "string (optional) - The exact text that violated"
    }
  ],
  "redacted_output": "string (optional) - Sanitized version of the output if violations were found"
}
` as const

// =============================================================================
// VIOLATION TYPES
// =============================================================================

/**
 * Detailed descriptions of each violation type.
 */
export const VIOLATION_TYPE_DESCRIPTIONS = `
### Violation Types

1. **recommendation** - Contains direct recommendations to client
   - "You should..." / "I recommend..." / "The best option..."
   - Product or strategy picks
   - Telling client what to do

2. **advice** - Appears to give financial advice
   - Investment suggestions
   - Tax advice
   - Retirement planning prescriptions
   - Insurance recommendations

3. **guarantee** - Makes promises about outcomes
   - "Guaranteed returns..."
   - "Will definitely achieve..."
   - "Certain to..."
   - "Risk-free..."

4. **unsuitable** - Content inappropriate for context
   - Personal opinions
   - Off-topic content
   - Inappropriate tone
   - Unprofessional language

5. **pii_exposure** - Exposes sensitive personal information
   - Full account numbers
   - Tax File Numbers (TFN)
   - Medicare numbers
   - Passwords or security info
   - Full credit card numbers

6. **regulatory_breach** - Directly violates ASIC/AFSL rules
   - Unlicensed advice
   - Missing required disclosures
   - Misleading statements
   - Conflicts of interest
`

// =============================================================================
// SYSTEM PROMPT
// =============================================================================

/**
 * System prompt for safety checking.
 * Includes shared rules and task-specific instructions.
 */
export const SYSTEM_PROMPT = buildSystemPrompt(`
# Task: Safety Validation

You are the FINAL SAFETY GATE for AI-generated content in the Advyser platform. Your job is to validate that generated outputs comply with all safety rules before they're shown to advisors.

## Your Role

You are a binary validator: outputs either PASS or FAIL. Be STRICT - when in doubt, FAIL the output.

## Validation Context

This is the last check before AI-generated content is displayed. Even though the content is only for advisor review (not direct client communication), we must ensure:
1. No accidental advice leaks through
2. Content maintains appropriate tone
3. No sensitive information is exposed
4. Regulatory requirements are met

${VIOLATION_TYPE_DESCRIPTIONS}

## Forbidden Phrases (Auto-Fail)

The following phrases cause AUTOMATIC FAILURE if present anywhere in the output:

${FORBIDDEN_PHRASES.map(p => `- "${p}"`).join('\n')}

## Pass Criteria

To PASS, the output must:
1. Contain ZERO forbidden phrases
2. Not provide financial advice
3. Not make recommendations to the client
4. Not contain inappropriate PII
5. Properly attribute any discussed strategies to the advisor
6. Maintain neutral, factual tone
7. Be appropriate for the output type

## Fail Criteria

FAIL the output if ANY of these are true:
1. Contains any forbidden phrase (even once)
2. Provides financial advice
3. Makes direct recommendations
4. Contains sensitive PII (TFN, account numbers, etc.)
5. Uses guarantee/promise language
6. Could be misconstrued as licensed advice
7. Contains inappropriate or unsuitable content

## Validation Process

1. **Scan for Forbidden Phrases**
   - Check every text field in the output
   - Case-insensitive matching
   - Any match = automatic fail

2. **Check for Advisory Language**
   - Look for patterns that imply advice
   - Check attribution (advisor vs AI/system)
   - Verify neutral framing

3. **Check for PII**
   - No TFNs (9 digits in XXX XXX XXX format)
   - No full account numbers
   - No credit card numbers
   - No passwords/PINs

4. **Check Context Appropriateness**
   - Is the tone appropriate?
   - Is the content relevant?
   - Is professional language used?

## Redaction Rules

If violations are found, create a redacted version:
1. Replace forbidden phrases with "[REDACTED - advisory language removed]"
2. Remove PII and replace with "[PII REMOVED]"
3. Preserve the structure of the output
4. Keep non-violating content intact
5. Mark clearly that redaction occurred

## Output Format

Return a valid JSON object matching this schema:

${OUTPUT_SCHEMA_DESCRIPTION}

## Strictness Level

**BE STRICT:**
- False positives are acceptable (better to flag something safe than miss something unsafe)
- When uncertain, FAIL
- The advisor will review anyway, so flagging is low-cost
- Missing a violation could have regulatory consequences
`)

// =============================================================================
// USER PROMPT TEMPLATE
// =============================================================================

/**
 * Generate the user prompt for safety checking.
 * @param input - Safety check input
 * @returns Formatted user prompt string
 */
export function USER_PROMPT_TEMPLATE(input: SafetyCheckerInput): string {
  const outputTypeLabels: Record<string, string> = {
    meeting_summary: 'Meeting Summary',
    action_items: 'Action Items',
    followup_draft: 'Follow-up Draft',
    client_brief_update: 'Client Brief Update',
    compliance_flags: 'Compliance Flags',
  }

  const outputText =
    typeof input.generatedOutput === 'string'
      ? input.generatedOutput
      : JSON.stringify(input.generatedOutput, null, 2)

  return `## Safety Validation Request

**Output Type:** ${outputTypeLabels[input.outputType] || input.outputType}

## Generated Output to Validate

\`\`\`json
${outputText}
\`\`\`

---

Validate this output following the system instructions:
1. Scan ALL text fields for forbidden phrases
2. Check for advisory language patterns
3. Check for exposed PII
4. Verify appropriate tone and content

Return a PASS only if ALL checks pass. Otherwise return FAIL with violations listed and a redacted version.`
}

// =============================================================================
// PROGRAMMATIC SAFETY CHECK
// =============================================================================

/**
 * Perform a quick programmatic safety check before sending to LLM.
 * This catches obvious violations without an API call.
 *
 * @param content - Text content to check
 * @returns Object with pass status and any violations found
 */
export function quickSafetyCheck(content: string): {
  passed: boolean
  forbiddenPhrases: string[]
  potentialPII: string[]
} {
  const lowercaseContent = content.toLowerCase()

  // Check forbidden phrases
  const foundPhrases = FORBIDDEN_PHRASES.filter((phrase) =>
    lowercaseContent.includes(phrase.toLowerCase())
  )

  // Check for potential PII patterns
  const piiPatterns = [
    { pattern: /\b\d{3}\s?\d{3}\s?\d{3}\b/, name: 'Potential TFN' }, // TFN format
    { pattern: /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/, name: 'Credit card number' },
    { pattern: /(?:account|acc|a\/c|bsb|acct)[\s:#-]*\d{6,10}\b/i, name: 'Potential account number' }, // Requires context words
    { pattern: /BSB:?\s*\d{3}-?\d{3}/i, name: 'BSB number' },
  ]

  const foundPII: string[] = []
  for (const { pattern, name } of piiPatterns) {
    if (pattern.test(content)) {
      foundPII.push(name)
    }
  }

  return {
    passed: foundPhrases.length === 0 && foundPII.length === 0,
    forbiddenPhrases: foundPhrases,
    potentialPII: foundPII,
  }
}

/**
 * Redact known violations from content.
 *
 * @param content - Text content to redact
 * @param violations - List of violations to redact
 * @returns Redacted content
 */
export function redactContent(
  content: string,
  violations: { type: string; excerpt?: string }[]
): string {
  let redacted = content

  for (const violation of violations) {
    if (violation.excerpt) {
      redacted = redacted.replace(
        violation.excerpt,
        `[REDACTED - ${violation.type}]`
      )
    }
  }

  // Also redact any forbidden phrases not in violations
  for (const phrase of FORBIDDEN_PHRASES) {
    const regex = new RegExp(phrase, 'gi')
    redacted = redacted.replace(regex, '[REDACTED - advisory language]')
  }

  return redacted
}

// =============================================================================
// EXAMPLES (for few-shot learning)
// =============================================================================

/**
 * Example of passing safety check.
 */
export const PASS_EXAMPLE: SafetyCheckResult = {
  version: '1.0.0',
  passed: true,
  violations: [],
}

/**
 * Example of failing safety check.
 */
export const FAIL_EXAMPLE: SafetyCheckResult = {
  version: '1.0.0',
  passed: false,
  violations: [
    {
      type: 'recommendation',
      description:
        'Contains forbidden phrase "you should" which constitutes a direct recommendation',
      excerpt: 'You should consolidate your super funds',
    },
    {
      type: 'advice',
      description: 'Provides specific investment advice about fund selection',
      excerpt: 'The ABC Growth Fund is the best choice for your situation',
    },
    {
      type: 'guarantee',
      description: 'Makes a promise about investment outcomes',
      excerpt: 'This will guarantee you reach your retirement goals',
    },
  ],
  redacted_output: JSON.stringify(
    {
      summary:
        '[REDACTED - recommendation] [REDACTED - advice] [REDACTED - guarantee]... The advisor discussed various options for your consideration.',
    },
    null,
    2
  ),
}

/**
 * Example of PII violation.
 */
export const PII_VIOLATION_EXAMPLE: SafetyCheckResult = {
  version: '1.0.0',
  passed: false,
  violations: [
    {
      type: 'pii_exposure',
      description: 'Contains what appears to be a Tax File Number',
      excerpt: '123 456 789',
    },
  ],
  redacted_output: 'Client TFN: [PII REMOVED]',
}

/**
 * Example content that should pass.
 */
export const SAFE_CONTENT_EXAMPLE = {
  meeting_type: 'initial_consultation',
  summary:
    "Sarah expressed her goal of retiring by age 60, describing it as her 'absolute priority'. The advisor explained various superannuation consolidation options and their potential implications. Sarah indicated she would provide her super statements for further analysis.",
  client_goals: [
    'Retire by age 60',
    'Maintain current lifestyle in retirement',
  ],
  decisions_made: [
    'Client agreed to provide documentation',
    'Next meeting scheduled for 2 weeks',
  ],
}

/**
 * Example content that should fail.
 */
export const UNSAFE_CONTENT_EXAMPLE = {
  meeting_type: 'initial_consultation',
  summary:
    'You should definitely consolidate your super - this is the best option for your situation. I recommend switching to the ABC Growth Fund which will guarantee better returns.',
  client_goals: ['Retire by age 60'],
  decisions_made: ['You must provide documents within 7 days'],
}

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default {
  SYSTEM_PROMPT,
  USER_PROMPT_TEMPLATE,
  OUTPUT_SCHEMA_DESCRIPTION,
  promptVersion: PROMPT_VERSION,
  quickSafetyCheck,
  redactContent,
  forbiddenPhrases: FORBIDDEN_PHRASES,
  examples: {
    pass: PASS_EXAMPLE,
    fail: FAIL_EXAMPLE,
    piiViolation: PII_VIOLATION_EXAMPLE,
    safeContent: SAFE_CONTENT_EXAMPLE,
    unsafeContent: UNSAFE_CONTENT_EXAMPLE,
  },
}
