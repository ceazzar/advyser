# Phase 4 Gap Map Table

## Document control
- Version: v1.0
- Date: 2026-02-10
- Phase: 4 (Gap Map + Build Sequencing)
- Plan reference: `/Users/ceazar/Code Base/advyser/plans/Master-Plan-v2.md`
- Inputs:
  - `/Users/ceazar/Code Base/advyser/plans/phase-3/PHASE_3_PAGE_TYPE_INVENTORY.md`
  - `/Users/ceazar/Code Base/advyser/plans/phase-3/PHASE_3_DRAFT_OBJECT_MODEL.md`
  - `/Users/ceazar/Code Base/advyser/plans/phase-3/PHASE_3_EVENT_TAXONOMY.md`
  - `/Users/ceazar/Code Base/advyser/plans/phase-1/ROUTE_DECISION_MATRIX.md`

## Purpose
Translate the Phase 3 buildable spec into a dependency-safe execution table for schema/RLS, API, UI, and QA planning.

## Required columns (gate contract)
- `exists?`
- `missing primitives`
- `dependencies`
- `effort`
- `owner wave`

## Gap map table (load-bearing scope)

| Capability (Phase 3 mapping) | exists? | missing primitives | dependencies | effort | owner wave |
|---|---|---|---|---|---|
| Search results read model (`P3-01`, `P3-02`) | Partial | API endpoint for filtered results, ranked query contract, event write for `list_viewed`, removal of local `mockAdvisors` from `/search` | listing/listing_service_area/specialty schema, search DTO, read RLS policy | M | 4.B |
| Advisor profile trust surface (`P3-03`) | Partial | API endpoint for profile by slug, trust disclosure projection, shortlist eligibility logic, event writes for `profile_opened`/`shortlist_rendered`, removal of local `mockAdvisor` | advisor_profile/listing/credential schema, trust rule mapping, read RLS policy | M | 4.B |
| Lead intake submit path (`P3-04`) | Partial | server write endpoint/action for lead creation, consent and attribution persistence, dedupe hook, event writes (`lead_form_started`, `lead_submitted`), replace simulated submit in `/request-intro` | lead schema extensions, attribution tables, validation schema alignment, write RLS policy | L | 4.B |
| Consumer request list/detail (`P3-05`, `P3-06`) | Partial | list/detail APIs scoped to consumer ownership, lifecycle timeline source, event write `lead_manage_viewed`, replace mock request data | lead + lifecycle event model, auth context, consumer RLS | M | 4.B |
| Advisor onboarding flow (`P3-07`) | Partial | persistence endpoint for onboarding draft/finalize, publish-precondition checks, event write `advisor_onboarding_completed` | advisor_profile + listing + service mappings, trust disclosure structure, advisor RLS | M | 4.B |
| Advisor profile publish flow (`P3-08`) | Partial | publish/unpublish API, trust completeness validator, event write `advisor_profile_published`, replace local `mockProfile` state source | trust disclosure data model, credential verification linkages, advisor/admin RLS | M | 4.B |
| Advisor lead queue (`P3-09`) | Partial | assigned leads query API, SLA/queue sorting logic, event write `advisor_lead_viewed`, replace `mockLeads` | lead assignment fields, lifecycle state rules, advisor RLS | M | 4.B |
| Advisor lead detail + response (`P3-10`) | Partial | lead detail API, response transition endpoints, state machine guardrails, event writes (`advisor_responded`, `contact_confirmed`, `call_scheduled`), replace `mockLead` | lifecycle event model, transition policy, audit writes | L | 4.B |
| Admin claims queue (`P3-11`) | Partial | claims queue API, moderation filters, event write `claim_queue_viewed`, replace `mockClaims` | claim_request schema, admin/staff role policy, audit model | M | 4.B |
| Admin claim review detail (`P3-12`) | Partial | claim decision endpoint (approve/reject), reason code enforcement, immutable audit write, event write `claim_reviewed`, replace static claim detail selection | claim_request + claim_evidence schema, audit_event coverage, admin/staff RLS | M | 4.B |
| Admin listing moderation (`P3-13`) | Partial | listing moderation API, pause/unpause with reason, audit write, event write `listing_moderated`, replace `mockListings` | listing moderation fields, audit_event policy, admin/staff RLS | M | 4.B |
| Advisor billing statement view (`P3-14`) | Partial | statement read API, line-item model with attribution/eligibility payload, event write `statement_viewed` | invoice/subscription schema, fee assessment model, advisor RLS | L | 4.A |
| Billing dispute entrypoint (`P3-14`) | No | dispute table/model, dispute create/resolve APIs, event writes (`dispute_opened`, `dispute_resolved`) | fee assessment + statement line-item model, admin workflow, audit model | L | 4.A |
| Auth login/signup (`P3-15`, `P3-16`) | Yes (baseline) | rate-limit/brute-force hardening policy, role redirect test matrix, auth event emission (`auth_login_*`, `auth_signup_*`) | existing server actions + callback route, users RLS | S | 4.C |
| Lead attribution snapshot | No | attribution snapshot table, first/last touch assignment logic, rule version storage | lead submit pipeline, channel source taxonomy, dedupe classifier | L | 4.A |
| New-client + dedupe classifier | No | classifier service + persisted decision evidence, 12-month + 7-day window logic | normalized identity strategy, historical lead query paths | L | 4.A |
| Fee assessment ledger | No | `fee_assessed` computation service, rule versioned assessment records, eligibility reason coding | attribution snapshot + lifecycle milestones + tier config | L | 4.A |
| Event pipeline and envelope | Partial | canonical telemetry write path, envelope normalization, event validation, replay-safe writes | event taxonomy contracts, request context propagation | M | 4.B |
| Cross-table RLS policy coverage | No (except users) | RLS enablement + read/write policies across lead/claim/listing/invoice/audit surfaces, policy tests | tenancy model, role matrix, migration ordering | L | 4.A |
| API route layer for core loop | No | route handlers/server actions for search/profile/lead/claims/listings/billing flows | schema readiness, DTO contracts, RLS policies | L | 4.B |
| UI mock-removal in critical routes | No | data hooks/adapters for live backend, loading/error states, empty states tied to real responses | API route layer, DTO stability | L | 4.C |
| Test harness for gate-critical flows | Partial | unit/integration coverage for auth/RLS/state transitions, E2E for conversion loop, instrumentation assertions | stable APIs, seeded fixtures, CI integration | L | 4.D |

## Snapshot findings (evidence highlights)
1. Core critical routes exist but are mock-driven (`/search`, `/advisors/[slug]`, `/advisor/leads*`, `/admin/claims*`, `/admin/listings`).
2. Data layer is broad (`database/schema.sql`) but Phase 3 object-model primitives remain partially unmapped (attribution snapshot, fee assessment, billing dispute, statement line items).
3. Auth baseline exists (`auth-actions`, callback route, middleware), but non-auth core loop APIs are not yet implemented as dedicated route handlers.
4. RLS migration currently covers `users` only (`database/migrations/001_auth_trigger_and_rls.sql`), so multi-table tenancy enforcement is still a gap.
