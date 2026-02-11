# Phase 2 Attribution Spec

## Document control
- Version: v1.0
- Date: 2026-02-10
- Phase: 2 (Attribution logic + data capture points)
- Companion doc: `/Users/ceazar/Code Base/advyser/plans/phase-2/PHASE_2_MONETIZATION_DECISION_DOC.md`

## Purpose
Define deterministic attribution and reporting logic so fee eligibility and source performance are auditable and consistent.

## Attribution model (locked)

## Source taxonomy
`channel_source` must be one of:
1. `community`
2. `broker_referral`
3. `paid`
4. `partner`
5. `direct`
6. `organic_search`

## Touch model
1. Capture both `first_touch` and `last_touch` at lead level.
2. Use `last_touch` for operational source reporting.
3. Preserve `first_touch` for assisted-conversion analysis.

## Lookback windows
1. Attribution lookback: `30 days` before `lead_submitted`.
2. New-client lookback: `12 months` (firm-level) for fee eligibility.
3. Dedupe lookback: `7 days` for identity+intent+firm duplicates.

## Data capture points

## Required events
1. `list_viewed`
2. `profile_opened`
3. `lead_form_started`
4. `lead_submitted`
5. `advisor_notified`
6. `advisor_responded`
7. `contact_confirmed`
8. `call_scheduled`
9. `call_completed`
10. `fee_assessed`
11. `dispute_opened`
12. `dispute_resolved`

## Required fields (event envelope)
1. `event_name`
2. `event_ts`
3. `visitor_id`
4. `lead_id` (nullable pre-submit)
5. `firm_id`
6. `advisor_id` (nullable where not applicable)
7. `channel_source`
8. `campaign_id` (nullable)
9. `broker_referral_id` (nullable)
10. `rule_version`
11. `metadata_json`

## Lead attribution record schema (minimum)
```ts
type LeadAttributionRecord = {
  lead_id: string
  firm_id: string
  first_touch_source: string
  first_touch_campaign_id?: string
  first_touch_ts: string
  last_touch_source: string
  last_touch_campaign_id?: string
  last_touch_ts: string
  attribution_window_days: 30
  rule_version: string
}
```

## Deterministic assignment logic

## On `lead_submitted`
1. Find all touch events for `visitor_id` in prior 30 days.
2. Assign `first_touch` = earliest qualifying touch.
3. Assign `last_touch` = latest non-null qualifying touch.
4. If only `direct` exists, use `direct`.
5. Persist attribution snapshot to lead record; never mutate historical snapshots.

## New-client classification logic
1. Resolve consumer identity key from normalized email/phone hash.
2. Query leads/engagements for same identity + same `firm_id` in prior 12 months.
3. If none found, `new_client = true`; else `false`.
4. Store decision reason and evidence pointer.

## Dedupe logic
1. Candidate duplicate if same firm + same identity + same intent in 7 days.
2. Keep oldest canonical lead.
3. Mark later record:
- `is_duplicate = true`
- `duplicate_of_lead_id = canonical_id`
- `fee_eligible = false`

## Fee eligibility linkage
Fee decision consumes attribution + lifecycle:
1. `qualified = true`
2. `new_client = true`
3. `is_duplicate = false`
4. `contact_confirmed = true`
5. `advisor_responded_within_sla = true`

If all true, emit `fee_assessed`.

## Transparency surfaces

## Advisor source report columns
1. `source`
2. `campaign`
3. `leads_submitted`
4. `qualified_leads`
5. `new_client_leads`
6. `billable_leads`
7. `contact_confirmed_rate`
8. `show_up_rate`
9. `fees_assessed`
10. `credits_issued`
11. `net_fees`

## Lead-level visibility fields
1. `first_touch_source`
2. `last_touch_source`
3. `new_client`
4. `dedupe_status`
5. `fee_eligible`
6. `fee_amount`
7. `rule_version`

## Dispute workflow linkage
1. Dispute record references:
- `lead_id`
- `fee_assessment_id`
- `attribution_snapshot_id`
2. Reviewer sees immutable source and classification evidence.
3. Resolution emits `dispute_resolved` with reason code and adjustment amount.

## Edge case handling
1. Missing campaign id:
- allow source attribution; mark campaign as `unknown`.
2. Source conflict due to late event ingestion:
- ignore events arriving after attribution freeze unless manual audit correction.
3. Cross-device without identity stitch:
- attribution stays visitor-scoped; conservative direct fallback.
4. Re-opened lead after close:
- preserve original attribution snapshot; lifecycle continues on same lead id.
5. Manual admin lead creation:
- source set to `direct` with `metadata_json.manual_entry = true`.

## Acceptance tests
1. First-touch and last-touch assign correctly from 30-day event stream.
2. New-client classification obeys 12-month lookback at firm level.
3. Duplicate leads in 7-day window are non-billable.
4. Fee assessment only fires when all eligibility conditions are true.
5. Advisor report totals reconcile to fee assessment ledger.
6. Dispute resolution produces traceable adjustments.
