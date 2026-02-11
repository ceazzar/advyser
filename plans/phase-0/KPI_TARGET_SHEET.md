# Phase 0 KPI Target Sheet (MVPv1)

## Document Control
- Version: v1.0 (locked)
- Date: 2026-02-10
- Phase: 0 (14-day demand proof)
- Scope: Mortgage brokers (Melbourne), FHB + refinance

## 1) KPI Scorecard (Targets and Formulas)

| KPI | Formula | Target | Denominator Rule | Notes |
|---|---|---:|---|---|
| Search/list -> profile CTR | `profile_opened / list_viewed` | `>= 8%` | Unique sessions that fired `list_viewed` | Measures listing/profile relevance |
| Profile -> lead conversion | `lead_submitted / profile_opened` | `>= 4%` | Unique sessions that fired `profile_opened` | Primary demand proof conversion |
| Median first response time | `median(broker_first_response - lead_submitted)` in business hours | `<= 2h` | Qualified leads only | SLA discipline metric |
| Lead contact success rate | `contact_confirmed / lead_submitted` | `>= 70%` | Qualified leads only | Contactability + broker follow-through |
| Show-up rate | `call_completed / call_scheduled` | `>= 60%` | Calls scheduled from qualified leads | Applies only when calls are scheduled |
| ROI hypothesis value per qualified lead | Self-reported broker value band | `A$150-A$350` | Qualified leads with broker feedback | Proxy only, not closed revenue |

## 2) Win Metric and Gate Logic

### Primary win metric (hard)
- `qualified_leads >= 15` in 14 days.

### Hard gate checks
1. `qualified_leads >= 15`.
2. Median first response time `<= 2 business hours`.
3. Lead contact success `>= 70%`.

### Soft gate checks
1. Search/list -> profile CTR `>= 8%`.
2. Profile -> lead conversion `>= 4%`.
3. Show-up rate `>= 60%` (when calls scheduled).

### Fail conditions
- `qualified_leads < 10`, or
- response-time and contact-success performance materially below hard targets.

## 3) Metric Definitions (Canonical)

### Qualified lead
A lead counts as qualified only when all are true:
1. `intent_type in {fhb, refinance}`
2. `postcode` in Phase 0 Melbourne canonical list
3. Contact details valid
4. Preferred contact method + time supplied
5. Contact consent supplied

### Business hours
- Monday-Friday, 9:00 to 17:00 local Melbourne time (AEST/AEDT as applicable).
- Response-time KPI uses business-hour delta, not wall-clock elapsed time.

### Unique counting
- Session metrics (`list_viewed`, `profile_opened`) use unique `visitor_id` per day.
- Lead metrics use unique `lead_id` (deduplicated by submission record id).

## 4) Event Instrumentation Requirements

## Required funnel events
1. `list_viewed`
2. `profile_opened`
3. `shortlist_rendered`
4. `lead_form_started`
5. `lead_submitted`
6. `broker_first_response`
7. `contact_confirmed`
8. `call_scheduled`
9. `call_completed`

## Event envelope (minimum schema)
```json
{
  "event_name": "string",
  "event_ts": "ISO-8601 timestamp",
  "visitor_id": "string",
  "lead_id": "string|null",
  "broker_id": "string|null",
  "channel_source": "community|broker_referral|paid|partner|direct",
  "campaign_id": "string|null",
  "metadata_json": {}
}
```

## 5) Public Lead Intake and Supply Field Requirements

## Lead intake payload (minimum)
```json
{
  "intent_type": "fhb|refinance",
  "postcode": "string",
  "timeframe": "string",
  "contact_name": "string",
  "contact_method": "phone|email|sms",
  "preferred_contact_time": "string",
  "consent_contact": true,
  "channel_source": "community|broker_referral|paid|partner|direct",
  "campaign_id": "string"
}
```

## Broker minimum public fields
```json
{
  "service_area_postcodes": ["string"],
  "accepting_new_clients": true,
  "specializations": ["fhb", "refinance"],
  "sla_commitment_business_hours": 2,
  "licensing_association_details": "string",
  "commission_disclosure": "string",
  "profile_share_link": "string"
}
```

## 6) Attribution and Channel Tracking Rules

1. Every session and lead must include `channel_source`.
2. Every campaign-linked visit/lead must include `campaign_id`.
3. Broker-shared traffic must include `broker_referral_id` in `metadata_json`.
4. Any event missing source fields is tagged `attribution_incomplete`.

## 7) Daily Tracker Templates (14-day run)

## A) Traffic and funnel tracker

| Day | Date | Visitors (all) | Visitors (community) | Visitors (broker share) | Visitors (paid/partner) | List viewed | Profile opened | CTR % | Lead submitted | Profile->Lead % |
|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | YYYY-MM-DD |  |  |  |  |  |  |  |  |  |
| 2 | YYYY-MM-DD |  |  |  |  |  |  |  |  |  |
| 3 | YYYY-MM-DD |  |  |  |  |  |  |  |  |  |
| 4 | YYYY-MM-DD |  |  |  |  |  |  |  |  |  |
| 5 | YYYY-MM-DD |  |  |  |  |  |  |  |  |  |
| 6 | YYYY-MM-DD |  |  |  |  |  |  |  |  |  |
| 7 | YYYY-MM-DD |  |  |  |  |  |  |  |  |  |
| 8 | YYYY-MM-DD |  |  |  |  |  |  |  |  |  |
| 9 | YYYY-MM-DD |  |  |  |  |  |  |  |  |  |
| 10 | YYYY-MM-DD |  |  |  |  |  |  |  |  |  |
| 11 | YYYY-MM-DD |  |  |  |  |  |  |  |  |  |
| 12 | YYYY-MM-DD |  |  |  |  |  |  |  |  |  |
| 13 | YYYY-MM-DD |  |  |  |  |  |  |  |  |  |
| 14 | YYYY-MM-DD |  |  |  |  |  |  |  |  |  |

## B) Lead quality and SLA tracker

| Day | Leads submitted | Qualified leads | Out-of-wedge leads | Median first response (business hours) | Contact confirmed | Contact success % | Calls scheduled | Calls completed | Show-up % |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 |  |  |  |  |  |  |  |  |  |
| 2 |  |  |  |  |  |  |  |  |  |
| 3 |  |  |  |  |  |  |  |  |  |
| 4 |  |  |  |  |  |  |  |  |  |
| 5 |  |  |  |  |  |  |  |  |  |
| 6 |  |  |  |  |  |  |  |  |  |
| 7 |  |  |  |  |  |  |  |  |  |
| 8 |  |  |  |  |  |  |  |  |  |
| 9 |  |  |  |  |  |  |  |  |  |
| 10 |  |  |  |  |  |  |  |  |  |
| 11 |  |  |  |  |  |  |  |  |  |
| 12 |  |  |  |  |  |  |  |  |  |
| 13 |  |  |  |  |  |  |  |  |  |
| 14 |  |  |  |  |  |  |  |  |  |

## C) Running gate status

| Metric | Running value | Target | Status |
|---|---:|---:|---|
| Qualified leads (14-day cumulative) |  | `>= 15` |  |
| Search/list -> profile CTR |  | `>= 8%` |  |
| Profile -> lead conversion |  | `>= 4%` |  |
| Median first response |  | `<= 2 business hours` |  |
| Lead contact success |  | `>= 70%` |  |
| Show-up rate |  | `>= 60%` |  |

## 8) Ownership and Operating Cadence

| Area | Owner | Daily checkpoint |
|---|---|---|
| Community traffic execution | Growth | Post volume and tracked-link clicks |
| Broker onboarding and share kit | Supply ops | Active brokers and share-link participation |
| SLA monitoring and broker pause list | Supply ops | Brokers breaching <=2h response commitment |
| Event quality and KPI rollups | Analytics | Missing event fields and denominator integrity |
| End-of-day gate dashboard | Phase lead | Pass risk and next-day adjustments |

## 9) Data Quality Controls

1. Exclude duplicate lead submissions by the same `lead_id`.
2. Keep `channel_source` mandatory on all funnel events.
3. Validate postcode against canonical list before qualified-lead classification.
4. Require `broker_first_response` timestamp to compute SLA.
5. Flag and audit events with missing IDs (`visitor_id`, `lead_id`, `broker_id` where applicable).

## 10) Final Decision Output (Day 14)

At close, record one of:
1. `PASS`: hard-gate criteria met.
2. `SOFT PASS`: win metric not fully met but strong directional fit with clear remediation.
3. `FAIL`: insufficient demand proof or weak supply-response mechanics.

Include:
- 14-day KPI snapshot,
- source-level conversion breakdown,
- top 3 blockers and top 3 unlocks,
- recommendation for Phase 1 scope lock.

