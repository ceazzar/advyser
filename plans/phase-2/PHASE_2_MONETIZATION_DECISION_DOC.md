# Phase 2 Monetization Decision Doc

## Document control
- Version: v1.0
- Date: 2026-02-10
- Phase: 2 (Monetization + Attribution Rules)
- Plan reference: `/Users/ceazar/Code Base/advyser/plans/Master-Plan-v2.md`

## Decision summary (locked)
1. Consumer side remains free.
2. Advisor monetization model is hybrid:
- subscription as primary
- performance fee on eligible leads for Free tier and overflow on paid tiers
3. New-client status is computed with a 12-month lookback at firm level.
4. Fee and attribution statements are advisor-visible at lead line-item granularity.

## Commercial model (MVPv3 lock)

## Tiers
1. `Free Listing`
- Subscription fee: `A$0`
- Performance fee: `A$69` per eligible new-client lead

2. `Pro`
- Subscription fee: `A$149 / advisor / month`
- Included eligible new-client leads: `20 / month`
- Overflow fee: `A$39` per additional eligible new-client lead

3. `Team`
- Subscription fee: `A$499 / month` (includes 5 advisors)
- Extra seat: `A$79 / seat / month`
- Included eligible new-client leads: `80 / month`
- Overflow fee: `A$29` per additional eligible new-client lead

4. `Enterprise`
- Custom contract (negotiated rate card and included volume)

## Fee eligibility trigger
A lead is billable only if all are true:
1. Lead is `qualified` (Phase 0 quality rules).
2. Lead is `new_client = true` (12-month lookback rule).
3. Advisor response occurs within SLA policy window.
4. Contact outcome reaches `contact_confirmed`.

## Non-billable conditions
1. Duplicate lead detected within dedupe window.
2. Out-of-wedge lead (`out_of_wedge`).
3. Returning client (`new_client = false`).
4. Invalid contact details or spam/fraud determination.
5. SLA failure where policy waives fee.

## Core policy rules

## New-client window
- `12 months` lookback from lead submission timestamp.
- Scope: same consumer identity to same firm.

## Dedupe rules
1. Identity key:
- normalized email hash OR normalized phone hash; if both present, pairwise confidence score.
2. Dedupe window:
- `7 days` for identical intent + contact identity + firm.
3. If duplicate detected:
- first valid lead remains canonical
- later duplicate marked `duplicate_of_lead_id` and non-billable

## Billing cycle
1. Monthly invoice cycle (calendar month).
2. Statement line items include subscription, overflow lead fees, credits, taxes.
3. Credits from disputes/refunds appear in next billing cycle as adjustment lines.

## Advisor-facing transparency surfaces
1. Lead-level statement row:
- `lead_id`
- submission timestamp
- source attribution (`first_touch`, `last_touch`)
- `new_client` decision
- fee eligibility decision
- fee amount and rule version
- dispute status

2. Monthly invoice summary:
- subscription base
- included lead allowance used
- overflow lead count and amount
- credits/adjustments
- net payable

3. Source performance report:
- leads by source
- eligible billable leads by source
- contact-confirmed rate by source
- effective cost per confirmed contact

## Five realistic computed scenarios

Assume:
- Pro includes 20 eligible new-client leads/month
- Pro overflow fee = A$39
- Free lead fee = A$69

| Scenario | Inputs | New-client | Billable | Computation | Output |
|---|---|---|---|---|---|
| S1 Free tier, first qualified lead | Tier=Free, qualified, contact confirmed, no prior lead in 12m | true | yes | `1 * A$69` | `A$69` |
| S2 Free tier, returning client | Tier=Free, qualified, prior confirmed lead 3 months ago | false | no | `A$0` | `A$0` |
| S3 Pro tier within included volume | Tier=Pro, month eligible lead count before event=12 | true | yes | Included bucket (no overflow) | `A$0 incremental` |
| S4 Pro tier overflow | Tier=Pro, month eligible lead count before event=20 | true | yes | `1 * A$39 overflow` | `A$39` |
| S5 Duplicate lead in 24h | Tier=Free, same identity+intent+firm, dedupe hit | n/a | no | Duplicate -> non-billable | `A$0` |

## Edge cases and decisions
1. Source changed between first and last touch:
- both stored; billing uses fee eligibility independent of source, reporting shows both.
2. Lead valid but advisor responded after SLA:
- non-billable unless admin override.
3. Contact confirmed then later disputed:
- bill first, credit on successful dispute resolution.
4. Missing phone but valid email:
- still eligible if identity confidence and contact confirmation pass.
5. Lead reassigned within same firm:
- billing ownership remains firm-level, not individual advisor-level.
6. Lead assigned across firms:
- prohibited by data policy; flagged for admin review.

## Dispute process (billing disputes)
1. Advisor opens dispute within `14 calendar days` of invoice issue.
2. Required evidence:
- incorrect new-client classification, duplicate proof, invalid lead evidence, SLA exception evidence.
3. Review SLA:
- initial response within `2 business days`
- final decision within `10 business days`
4. Outcomes:
- `upheld`: fee credited in next statement
- `rejected`: fee stands with reason code
- `partial`: reduced fee or split adjustment
5. Auditability:
- all dispute actions produce immutable timeline entries.

## Implementation notes
1. Keep rate card in config table with effective dates and versioning.
2. All fee assessments must store `rule_version`.
3. Avoid hardcoding rates into UI or API handlers.

## Acceptance checklist
1. Commercial model selected and locked.
2. New-client window and dedupe rules defined.
3. Edge cases and dispute process defined.
4. Five computed scenarios documented.
5. Advisor-facing fee transparency surfaces specified.

