# Phase 1 Replica Spec (MVPv1)

## Document control
- Version: v1.0
- Date: 2026-02-10
- Owner: Product + Engineering
- Phase: 1 (Fresha-pattern translation)
- Source of truth plan: `/Users/ceazar/Code Base/advyser/plans/Master-Plan-v2.md`

## Purpose
Translate Fresha mechanics into Advyser-specific entities, roles, and funnels for the locked wedge:
- Mortgage brokers
- Melbourne metro
- FHB + refinance

This spec freezes the selective-rebuild strategy on the existing codebase.

## Inputs used
- `/Users/ceazar/Code Base/advyser/docs/fresha/FINAL_REPLICA_SPEC_PACK.md`
- `/Users/ceazar/Code Base/advyser/docs/fresha/IA_INVENTORY.md`
- `/Users/ceazar/Code Base/advyser/docs/fresha/FLOWS.md`
- `/Users/ceazar/Code Base/advyser/docs/fresha/OBJECT_MODEL.md`
- `/Users/ceazar/Code Base/advyser/docs/fresha/ROLES_PERMISSIONS.md`
- `/Users/ceazar/Code Base/advyser/plans/phase-0/WEDGE_BRIEF.md`
- `/Users/ceazar/Code Base/advyser/plans/phase-0/KPI_TARGET_SHEET.md`

## Strategy lock (Phase 1 decision freeze)
1. Do not rebuild repository from scratch.
2. Keep infra foundation: Next.js app router, Supabase auth wiring, schema/migrations.
3. Selectively rebuild conversion-critical surfaces to Fresha-like interaction and information architecture.
4. Defer non-critical surfaces until post-core-loop integration.
5. Keep URLs stable where possible to reduce migration and SEO risk.

## Wave 1.A - Entity mapping (Fresha -> Advyser)

| Fresha concept | Advyser concept | MVPv1 status | Notes |
|---|---|---|---|
| Workspace | Firm | In | Tenant boundary for advisor operations |
| TeamMember | Advisor/Staff | In | Single-advisor-first, team depth later |
| Service | Advisory Offer | In | FHB/refinance service packages |
| OnlineProfile | Advisor Public Profile | In | Trust/disclosure and CTA surface |
| Booking | Qualified Lead + Optional Scheduled Call | In | `lead_submitted` is primary conversion |
| Client | Consumer Lead | In | Qualified by wedge and contactability |
| AttributionTouchpoint | Lead Source | In | Required for channel hypothesis and KPI attribution |
| Invoice/Processing fee | Platform billing data | Deferred | Commercial depth belongs to Phase 2+ |
| No-show policy stack | Lead/contact outcome states | Deferred | Appointment economics after core loop |
| Capital product | N/A for MVPv1 wedge | Out | Not needed for demand proof or Phase 1 gate |

### Canonical core entities (MVPv1)
1. `Firm`
2. `AdvisorProfile`
3. `AdvisoryOffer`
4. `Lead`
5. `LeadSource`
6. `LeadLifecycleEvent`
7. `TrustDisclosure`

### Canonical lifecycle states
- Advisor profile: `draft -> published -> paused`
- Lead: `submitted -> notified -> responded -> contacted -> scheduled -> completed | closed`
- Trust disclosure: `draft -> published -> revised`

## Wave 1.B - Role mapping and permission boundaries

### MVPv1 role set
1. `Visitor`
2. `Client`
3. `Advisor`
4. `Admin`
5. `Staff`

### Permission matrix (MVPv1)
| Capability | Visitor | Client | Advisor | Admin | Staff |
|---|---|---|---|---|---|
| View search and public profile | Y | Y | Y | Y | Y |
| Submit qualified lead | N | Y | N | N | N |
| Edit own advisor profile | N | N | Y | Y | Limited |
| Publish/unpublish advisor profile | N | N | Y | Y | N |
| View assigned leads | N | N | Y | Y | Limited |
| Respond to leads | N | N | Y | Y | Limited |
| Moderate claims/listings | N | N | N | Y | Limited |
| Edit trust/disclosure policy copy | N | N | N | Y | N |
| Access billing controls | N | N | N | Y | N |

### Boundary rules
1. Advisor cannot access admin moderation actions.
2. Client cannot access advisor lead inbox or profile management.
3. Staff access is explicitly scoped by assignment and cannot perform global admin operations.

## Wave 1.C - Funnel mapping (gate narratives)

## Client story (discover -> trust -> lead -> confirmation -> manage)
| Step | Trigger | Primary CTA | Required inputs | Success event | Primary drop-off risk |
|---|---|---|---|---|---|
| Discover | User enters search/category/home | `View profile` | Location, intent cues | `list_viewed` + `profile_opened` | Weak relevance in first results |
| Trust | User reads profile trust blocks | `Request a call` | Credentials, disclosures, SLA visibility | `shortlist_rendered` or `lead_form_started` | Insufficient trust evidence |
| Lead | User completes lead form | `Submit request` | Intent, postcode, contact, consent | `lead_submitted` | Form friction or unclear value |
| Confirmation | Submission accepted | `Done` / next steps | Lead id + expected response time | `lead_confirmation_viewed` | Unclear expectations |
| Manage-lite | User follows up via confirmation path | `View request` | Request reference | `lead_manage_viewed` | No visibility into status |

## Advisor story (onboard -> publish -> receive -> respond -> deliver -> retain-lite)
| Step | Trigger | Primary CTA | Required inputs | Success event | Primary drop-off risk |
|---|---|---|---|---|---|
| Onboard | Advisor starts account/profile setup | `Continue setup` | Profile basics, service area, specialization | `advisor_onboarding_completed` | Setup friction |
| Publish | Advisor makes profile public | `Publish profile` | Disclosures + availability/SLA commitment | `advisor_profile_published` | Missing trust/disclosure requirements |
| Receive | New qualified lead arrives | `Open lead` | Notification metadata | `advisor_lead_viewed` | Slow lead pickup |
| Respond | Advisor responds to lead | `Respond now` | Response action + timestamp | `advisor_responded` | SLA breach |
| Deliver | Contact and schedule progress | `Mark contacted/scheduled` | Contact outcome | `contact_confirmed` / `call_scheduled` | Incomplete follow-through |
| Retain-lite | Initial relationship continuation | `Follow up` | Minimal notes/status update | `lead_followup_logged` | No habit loop |

## Ambiguity killers (must remain stable)
1. Primary conversion is `lead_submitted`, not booking confirmation.
2. Out-of-geo leads are captured but excluded from qualified lead count.
3. Wedge intent is only `fhb` or `refinance` for Phase 1.
4. SLA commitment target is <= 2 business hours.
5. Advisors breaching SLA can be paused from shortlist rotation.
6. Trust blocks must include licensing/association + commission disclosure.
7. Route URL structure stays stable unless explicitly approved.
8. Core loop excludes payments, in-app inbox, and calendar integrations in MVPv1.
9. Attribution fields are mandatory for lead submission.
10. Consumer manage experience is minimal (request confirmation/status), not full client portal.
11. Admin moderation is in scope for claims/listings only.
12. Staff role has constrained permissions and no global admin powers.

## Route readiness taxonomy (governance type)
`RouteReadinessType = reuse | refactor | rebuild | defer | remove`

Canonical route decision matrix:
- `/Users/ceazar/Code Base/advyser/plans/phase-1/ROUTE_DECISION_MATRIX.md`

## Phase 1 interface contracts (spec-level)

## `SearchResultCardDTO`
```ts
type SearchResultCardDTO = {
  advisor_id: string
  slug: string
  service_areas: string[]
  specialties: string[]
  verification_level: "none" | "basic" | "licence_verified" | "enhanced"
  response_sla: string
  rating: number
  review_count: number
  accepting_status: "taking_clients" | "waitlist" | "not_accepting"
}
```

## `AdvisorProfileDTO`
```ts
type AdvisorProfileDTO = {
  advisor_id: string
  slug: string
  display_name: string
  trust: {
    credentials: Array<{ type: string; number?: string; status: string }>
    disclosures: { commission_disclosure: string; licensing_disclosure: string }
    verification_level: "none" | "basic" | "licence_verified" | "enhanced"
  }
  services: Array<{ id: string; name: string; summary: string }>
  lead_cta: { enabled: boolean; response_sla: string }
}
```

## `LeadIntakeDTO` (Phase 0 aligned)
```ts
type LeadIntakeDTO = {
  intent_type: "fhb" | "refinance"
  postcode: string
  timeframe: string
  contact_name: string
  contact_method: "phone" | "email" | "sms"
  preferred_contact_time: string
  consent_contact: boolean
  channel_source: "community" | "broker_referral" | "paid" | "partner" | "direct"
  campaign_id: string
}
```

## `LeadLifecycleEventDTO`
```ts
type LeadLifecycleEventDTO = {
  event:
    | "lead_submitted"
    | "advisor_notified"
    | "advisor_responded"
    | "contact_confirmed"
    | "call_scheduled"
    | "call_completed"
  lead_id: string
  advisor_id?: string
  event_ts: string
}
```

## Phase 1 gate acceptance checklist
1. Entity mapping defined and unambiguous.
2. Role and permission boundaries defined for MVPv1.
3. Client and advisor stories narrate end-to-end with no missing decisions.
4. Core interfaces for search/profile/lead/lifecycle frozen at spec level.
5. Route readiness matrix is complete and referenced.
