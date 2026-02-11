# Phase 3 Event Taxonomy

## Document control
- Version: v1.0
- Date: 2026-02-10
- Phase: 3 (Targeted Crawl + Replica Spec Pack)
- Upstream dependency: `/Users/ceazar/Code Base/advyser/plans/phase-2/PHASE_2_ATTRIBUTION_SPEC.md`

## Purpose
Define a build-ready event set for Phase 4 schema/API planning, aligned to the Phase 3 screen inventory and flow maps.

## Common event envelope (required fields)
1. `event_name`
2. `event_ts`
3. `session_id`
4. `visitor_id` (nullable post-auth depending on flow)
5. `user_id` (nullable for anonymous traffic)
6. `firm_id` (nullable for pre-auth consumer events)
7. `advisor_id` (nullable unless advisor-context)
8. `lead_id` (nullable until lead creation)
9. `rule_version` (required for attribution/fee/dispute events)
10. `metadata_json`

## Marketplace funnel events (consumer)

| Event | Trigger | Minimum metadata |
|---|---|---|
| `list_viewed` | Search/category results rendered | `surface`, `geo`, `intent_filter`, `result_count` |
| `profile_opened` | Advisor profile opened | `advisor_slug`, `referrer_surface` |
| `shortlist_rendered` | Trust/CTA module rendered | `advisor_id`, `verification_level`, `accepting_status` |
| `lead_form_started` | Lead form receives first input | `advisor_id`, `intent_type`, `channel_source` |
| `lead_submitted` | Lead form submission accepted | `lead_id`, `intent_type`, `postcode`, `channel_source`, `campaign_id` |
| `lead_confirmation_viewed` | Confirmation state displayed | `lead_id`, `expected_response_sla` |
| `lead_manage_viewed` | Client opens request list/detail | `lead_id`, `view_type` |

## Advisor operations events

| Event | Trigger | Minimum metadata |
|---|---|---|
| `advisor_onboarding_completed` | Onboarding wizard completed | `advisor_id`, `firm_id`, `specialty_count`, `sla_hours` |
| `advisor_profile_published` | Profile publish action succeeds | `advisor_id`, `firm_id`, `verification_level` |
| `advisor_lead_viewed` | Advisor opens lead queue/detail | `lead_id`, `advisor_id`, `queue_state` |
| `advisor_responded` | Advisor response recorded | `lead_id`, `advisor_id`, `response_type`, `response_latency_minutes` |
| `contact_confirmed` | Contact outcome confirmed | `lead_id`, `advisor_id`, `contact_method` |
| `call_scheduled` | Consult call scheduled | `lead_id`, `advisor_id`, `scheduled_at` |
| `call_completed` | Consult call marked complete | `lead_id`, `advisor_id`, `completed_at` |

## Attribution and monetization events

| Event | Trigger | Minimum metadata |
|---|---|---|
| `attribution_touch_captured` | Channel touchpoint captured | `channel_source`, `campaign_id`, `touch_type` |
| `attribution_assigned` | First/last touch snapshot frozen | `lead_id`, `first_touch`, `last_touch`, `window_days` |
| `new_client_classified` | New-client rule computed | `lead_id`, `new_client`, `lookback_months`, `evidence_ref` |
| `lead_dedupe_evaluated` | Dedupe rule evaluated | `lead_id`, `is_duplicate`, `duplicate_of_lead_id` |
| `fee_assessed` | Fee eligibility evaluated | `lead_id`, `fee_eligible`, `fee_amount`, `tier`, `rule_version` |
| `statement_issued` | Billing statement generated | `statement_id`, `firm_id`, `period_start`, `period_end` |
| `statement_viewed` | Advisor opens billing statement | `statement_id`, `advisor_id`, `firm_id` |
| `dispute_opened` | Billing dispute created | `dispute_id`, `statement_id`, `lead_id`, `reason_code` |
| `dispute_resolved` | Billing dispute resolved | `dispute_id`, `resolution`, `adjustment_amount` |

## Trust/admin moderation events

| Event | Trigger | Minimum metadata |
|---|---|---|
| `claim_queue_viewed` | Admin opens claim queue | `actor_id`, `queue_size` |
| `claim_reviewed` | Claim approved/rejected | `claim_id`, `decision`, `reason_code` |
| `listing_moderated` | Listing pause/unpause action applied | `advisor_id`, `action`, `reason_code` |

## Quality controls
1. Money-impact events (`fee_assessed`, `statement_issued`, `dispute_*`) must be immutable and append-only.
2. Any event that affects billability must include `rule_version`.
3. `lead_submitted` is the canonical conversion anchor event.
4. Event names and payload keys are contract-locked at Phase 3 gate and may only change with explicit version bump.

## Acceptance check
1. Taxonomy covers marketplace, advisor ops, money/attribution, and admin moderation.
2. Event set reconciles with Phase 2 attribution and fee rules.
3. Every prioritized Phase 3 screen has at least one mapped event.
