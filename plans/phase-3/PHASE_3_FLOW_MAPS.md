# Phase 3 Flow Maps

## Document control
- Version: v1.0
- Date: 2026-02-10
- Phase: 3 (Targeted Crawl + Replica Spec Pack)
- Companion inventory: `/Users/ceazar/Code Base/advyser/plans/phase-3/PHASE_3_PAGE_TYPE_INVENTORY.md`

## Flow A: Marketplace (discover -> trust -> lead -> confirmation -> manage)

| Step | Screen | Primary action | Inputs | Output | State transition | Events |
|---|---|---|---|---|---|---|
| A1 | `/search` | discover advisor options | location, intent, channel params | ranked results list | n/a | `list_viewed` |
| A2 | `/advisors/[slug]` | evaluate trust and fit | advisor slug | trust context + CTA availability | n/a | `profile_opened`, `shortlist_rendered` |
| A3 | `/request-intro` | submit qualified request | lead form payload + consent + attribution | `lead_id` + confirmation metadata | `Lead: submitted` | `lead_form_started`, `lead_submitted` |
| A4 | `/dashboard/requests/[id]` | review request status | `lead_id` + auth | timeline snapshot | `Lead: submitted -> notified` (eventual) | `lead_confirmation_viewed`, `lead_manage_viewed` |
| A5 | `/dashboard/requests` | manage open requests | auth + optional filters | request list | state-read only | `lead_manage_viewed` |

### Flow A constraints
1. Form submission is blocked unless `consent_contact = true`.
2. Attribution fields must be present at submission for Phase 2 fee logic.
3. Consumer sees status only; advisor/private notes are excluded.

## Flow B: Advisor Ops (onboard -> publish -> receive -> respond -> contact -> schedule)

| Step | Screen | Primary action | Inputs | Output | State transition | Events |
|---|---|---|---|---|---|---|
| B1 | `/advisor/onboarding` | complete setup | profile basics, specialties, SLA | saved draft profile | `AdvisorProfile: draft` | `advisor_onboarding_completed` |
| B2 | `/advisor/profile` | publish profile | trust disclosures, credentials, offer details | profile visible in search | `AdvisorProfile: draft -> published` | `advisor_profile_published` |
| B3 | `/advisor/leads` | open incoming lead | auth context, lead filters | prioritized lead queue | `Lead: submitted -> notified` (visibility) | `advisor_lead_viewed` |
| B4 | `/advisor/leads/[id]` | respond to lead | response payload + timestamp | response recorded | `Lead: notified -> responded` | `advisor_responded` |
| B5 | `/advisor/leads/[id]` | confirm contact outcome | contact status + notes | outcome recorded | `Lead: responded -> contacted` | `contact_confirmed` |
| B6 | `/advisor/leads/[id]` | schedule consult call | schedule metadata | call step recorded | `Lead: contacted -> scheduled` | `call_scheduled` |

### Flow B constraints
1. Publish is blocked unless required trust fields are complete.
2. Lead response timestamps drive SLA compliance and shortlist eligibility.
3. Lead state transitions must be valid and server-enforced.

## Flow C: Money + Attribution (capture -> classify -> assess -> statement -> dispute)

| Step | Trigger surface | Primary action | Inputs | Output | State transition | Events |
|---|---|---|---|---|---|---|
| C1 | `/search`, `/advisors/[slug]`, `/request-intro` | capture attribution context | channel, campaign, visitor identity | frozen attribution snapshot at submit | n/a | `attribution_touch_captured`, `attribution_assigned` |
| C2 | server on lead submit | classify new-client + dedupe | identity key, `firm_id`, lookback windows | eligibility flags | `Lead.new_client`, `Lead.is_duplicate` set | `new_client_classified`, `lead_dedupe_evaluated` |
| C3 | server on lifecycle progression | assess fee eligibility | qualified flag, contact confirmed, SLA status, tier counters | fee assessment record | `FeeAssessment: pending -> assessed/non_billable` | `fee_assessed` |
| C4 | `/advisor/billing` | render statement transparency | statement period | line-item statement | `BillingStatement: issued` | `statement_issued`, `statement_viewed` |
| C5 | `/advisor/billing` + admin workflow | handle dispute | dispute reason + evidence | adjustment decision | `Dispute: opened -> resolved` | `dispute_opened`, `dispute_resolved` |

### Flow C constraints
1. New-client rule uses 12-month firm-level lookback (Phase 2 lock).
2. Dedupe uses 7-day identity + intent + firm window.
3. Every assessment and dispute entry stores `rule_version`.
4. Billing line items must expose attribution + eligibility decisions.

## Flow stop condition check
1. Three required flow maps are complete and aligned to Phase 3 waves.
2. Each flow includes screen/trigger, actions, inputs, outputs, transitions, and events.
3. Flow steps map directly to the prioritized screen inventory IDs `P3-01` through `P3-16`.
