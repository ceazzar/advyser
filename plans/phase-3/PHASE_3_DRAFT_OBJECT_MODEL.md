# Phase 3 Draft Object Model

## Document control
- Version: v1.0
- Date: 2026-02-10
- Phase: 3 (Targeted Crawl + Replica Spec Pack)
- Related docs:
  - `/Users/ceazar/Code Base/advyser/plans/phase-1/PHASE_1_REPLICA_SPEC.md`
  - `/Users/ceazar/Code Base/advyser/plans/phase-2/PHASE_2_MONETIZATION_DECISION_DOC.md`
  - `/Users/ceazar/Code Base/advyser/plans/phase-2/PHASE_2_ATTRIBUTION_SPEC.md`

## Purpose
Provide a normalized object set and relationship map for Phase 4 gap analysis and Phase 8 schema design.

## Core objects (MVPv1 + monetization prerequisites)

| Object | Purpose | Key fields | State model | Critical constraints |
|---|---|---|---|---|
| `Firm` | Tenant boundary for advisor operations and billing | `firm_id`, `name`, `abn`, `timezone`, `status`, `billing_tier` | `active`, `paused`, `suspended` | billing and lead classification are firm-scoped |
| `AdvisorProfile` | Public trust + conversion profile | `advisor_id`, `firm_id`, `slug`, `display_name`, `verification_level`, `publish_state`, `response_sla_hours` | `draft -> published -> paused` | publish requires trust disclosures and active firm |
| `AdvisoryOffer` | Bookable/leadable service package | `offer_id`, `advisor_id`, `intent_type`, `service_areas`, `status` | `draft -> active -> archived` | intent_type restricted to wedge values in MVPv1 |
| `TrustDisclosure` | Licensing/commission trust content | `disclosure_id`, `advisor_id`, `licensing_text`, `commission_text`, `version` | `draft -> published -> revised` | latest published disclosure required for profile publish |
| `Lead` | Primary conversion transaction | `lead_id`, `firm_id`, `advisor_id`, `intent_type`, `postcode`, `contact_hash`, `status`, `qualified`, `new_client`, `is_duplicate` | `submitted -> notified -> responded -> contacted -> scheduled -> completed/closed` | consent required at creation; status transitions server-enforced |
| `LeadLifecycleEvent` | Immutable lead timeline | `event_id`, `lead_id`, `event_type`, `actor_id`, `event_ts`, `metadata_json` | append-only | timeline cannot be edited/deleted |
| `LeadAttributionSnapshot` | Frozen first/last-touch record | `snapshot_id`, `lead_id`, `first_touch_source`, `last_touch_source`, `campaign_id`, `window_days`, `rule_version` | single-write snapshot | immutable after lead submission |
| `FeeAssessment` | Fee eligibility and amount decision | `assessment_id`, `lead_id`, `firm_id`, `fee_eligible`, `fee_amount`, `reason_code`, `rule_version` | `pending -> assessed/non_billable -> credited` | requires qualified + new_client + non-duplicate + contact confirmed + SLA pass |
| `BillingStatement` | Monthly fee statement | `statement_id`, `firm_id`, `period_start`, `period_end`, `issued_at`, `status` | `draft -> issued -> paid/overdue` | one statement per firm per billing period |
| `StatementLineItem` | Statement-level breakdown row | `line_item_id`, `statement_id`, `lead_id`, `amount`, `line_type`, `eligibility_snapshot` | n/a | must expose attribution + eligibility decisions |
| `BillingDispute` | Advisor billing dispute case | `dispute_id`, `statement_id`, `line_item_id`, `reason_code`, `status`, `opened_at`, `resolved_at` | `opened -> reviewing -> upheld/rejected/partial` | open window is 14 days from statement issue |
| `ClaimCase` | Admin trust/claim moderation record | `claim_id`, `advisor_id`, `submitted_by`, `status`, `decision`, `decision_reason` | `submitted -> under_review -> approved/rejected` | decision reason and reviewer identity required |
| `AuditLog` | Immutable governance trail | `audit_id`, `actor_id`, `action`, `entity_type`, `entity_id`, `event_ts`, `diff_json` | append-only | all admin moderation and billing decisions must write audit records |

## Relationship map
1. `Firm 1..* AdvisorProfile`
2. `AdvisorProfile 1..* AdvisoryOffer`
3. `AdvisorProfile 1..* TrustDisclosure`
4. `Firm 1..* Lead`
5. `Lead 1..* LeadLifecycleEvent`
6. `Lead 1..1 LeadAttributionSnapshot`
7. `Lead 0..1 FeeAssessment`
8. `Firm 1..* BillingStatement`
9. `BillingStatement 1..* StatementLineItem`
10. `StatementLineItem 0..1 BillingDispute`
11. `AdvisorProfile 0..* ClaimCase`
12. `AuditLog` references all moderation and billing entities

## Derived/computed fields
1. `Lead.new_client` is computed from 12-month firm-level history.
2. `Lead.is_duplicate` is computed from 7-day identity + intent + firm match.
3. `FeeAssessment.fee_eligible` is computed from lifecycle + classification predicates.
4. `AdvisorProfile.shortlist_eligible` is computed from publish state + SLA compliance.

## Object model constraints for Phase 4
1. Use immutable event and audit records for any trust or money-impact action.
2. Keep lead, attribution snapshot, and fee assessment linked by stable IDs.
3. Store `rule_version` on attribution, fee, statement line, and dispute resolution artifacts.
4. Enforce role boundaries around `ClaimCase`, `BillingDispute`, and `AuditLog` writes.

## Acceptance check
1. Object set covers marketplace, advisor ops, money, and moderation surfaces in Phase 3 inventory.
2. Relationships support all three Phase 3 flow maps without ambiguous ownership.
3. Model is directly mappable to Phase 8 database tables and Phase 9 API contracts.
