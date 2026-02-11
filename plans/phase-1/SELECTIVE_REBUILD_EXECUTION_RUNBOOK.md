# Selective Rebuild Execution Runbook

## Document control
- Version: v1.0
- Date: 2026-02-10
- Strategy source: `/Users/ceazar/Code Base/advyser/plans/phase-1/PHASE_1_REPLICA_SPEC.md`

## Objective
Operationalize the selective rebuild plan from Phase 4 through Phase 10 with explicit checklists, owners, and gates.

## Execution mode
1. Preserve existing infrastructure and route URLs where feasible.
2. Rebuild only conversion-critical surfaces first.
3. Defer non-critical modules until core loop is fully live and measured.

## Phase 4 - Gap map and sequence lock

## Required outputs
1. Route-level gap table with columns:
- `route`
- `readiness` (`reuse|refactor|rebuild|defer|remove`)
- `exists_today`
- `missing_data_primitives`
- `missing_api_actions`
- `ui_dependency`
- `phase_window`
- `owner`
2. Build order lock:
- Auth/RLS -> Schema -> APIs -> UI -> instrumentation verification

## Exit criteria
1. All core loop routes have locked readiness statuses.
2. Dependencies are acyclic and owner-assigned.
3. No deferred route blocks critical-path rebuilds.

## Phase 5-7 - Prep and safety

## Required tasks
1. CI baseline:
- lint
- unit tests
- build
2. Seed baseline:
- realistic records for search/profile/lead core loop
3. RBAC/RLS guardrails:
- server enforcement mirrors UI route guards
4. Trust data prerequisites:
- disclosure and moderation fields available to target routes

## Exit criteria
1. CI baseline passes consistently.
2. Auth/RLS policy tests cover core loop read/write paths.
3. Trust prerequisites are available for UI integration.

## Phase 8-9 - Data and API backbone

## API slices required
1. Search result retrieval and filtering.
2. Advisor profile retrieval with trust/disclosure.
3. Lead intake and lifecycle transitions.
4. Advisor lead inbox and response actions.
5. Attribution and event write endpoints.

## Required contracts
1. `SearchResultCardDTO`
2. `AdvisorProfileDTO`
3. `LeadIntakeDTO`
4. `LeadLifecycleEventDTO`

## Exit criteria
1. API contracts documented and test-covered.
2. Critical server-side rule enforcement in place.
3. Core path works through APIs without manual DB edits.

## Phase 10 - UI integration and cutover

## Critical path route cutover order
1. `/search`
2. `/advisors/[slug]`
3. `/request-intro`
4. `/advisor/leads`
5. `/advisor/leads/[id]`
6. `/admin/claims` + `/admin/claims/[id]`
7. `/admin/listings`

## Cutover checklist per route
1. Route wired to live API contracts.
2. Local `mock*` data removed from conversion-critical rendering.
3. Analytics events emitted on required user actions.
4. RBAC/route guard behavior validated.
5. Route-level smoke tests pass.

## Phase 10 gate criteria
1. No mock data in MVP critical path.
2. Funnel events observed:
- `search -> profile -> lead_submitted -> advisor_responded`
3. Out-of-wedge classification still enforced.

## Test scenarios (mandatory)
1. Core conversion E2E:
- Discover advisor -> open profile -> submit qualified lead -> advisor responds.
2. Out-of-wedge handling:
- Lead captured but not counted as qualified if out-of-geo/intent.
3. Role enforcement:
- Consumer blocked from advisor/admin actions.
4. Trust rendering:
- Credentials/disclosures visible and consistent on profile.
5. Regression safety:
- Auth, legal, and preserved routes remain operational.

## Agent risk controls
1. Do not start deferred routes before all critical rebuild routes pass cutover.
2. Route cutovers happen only after route-level checklist completion.
3. Any scope expansion requires explicit phase and gate mapping.
4. Keep one changelog entry per cutover with route, contracts, tests, and rollback notes.
