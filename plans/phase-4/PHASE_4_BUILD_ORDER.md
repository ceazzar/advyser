# Phase 4 Build Order

## Document control
- Version: v1.0
- Date: 2026-02-10
- Phase: 4 (Gap Map + Build Sequencing)
- Gate rule: `Auth/RLS -> Schema -> APIs -> UI -> Conversion mechanics`

## Purpose
Lock execution sequence and dependency edges so implementation remains acyclic and measurable.

## Build order lock (canonical)
1. Auth/RLS hardening (`Phase 6` prerequisites)
2. Schema and data primitives (`Phase 8`)
3. Core API contracts and rule enforcement (`Phase 9`)
4. UI integration + mock removal (`Phase 10`)
5. Conversion mechanics and optimization layers (`Phase 11+`)

## Ordered work packages

| Order | Package | Primary outputs | Entry criteria | Exit criteria |
|---|---|---|---|---|
| 1 | Auth + Tenancy + RLS baseline | role guards, RLS policies, policy tests, auth flow hardening | Phase 4 artifacts locked | cross-tenant access blocked in tests |
| 2 | Schema delta package | attribution snapshot, lead lifecycle events, fee assessment, statement line items, disputes, audit coverage | package 1 complete for critical tables | migrations apply cleanly + type generation passes |
| 3 | API contract package | search/profile/lead/claims/listings/billing endpoints + validation + state machine guards | package 2 complete | API contracts documented + integration tests passing |
| 4 | UI integration package | critical route cutovers to live APIs + no local mock data in core loop | package 3 complete for each route slice | route-level smoke tests pass and events emit |
| 5 | Conversion mechanics package | SLA measurement, triage mechanics, dashboard baselines | package 4 complete | weekly conversion optimization loop is measurable |

## Dependency graph (textual)
1. `RLS policies` block all write-path API work.
2. `Schema deltas` block fee/dispute and attribution APIs.
3. `APIs` block route cutover for `/search`, `/advisors/[slug]`, `/request-intro`, `/advisor/leads*`, `/admin/claims*`, `/admin/listings`.
4. `UI cutover` blocks conversion-engine validation.

## Critical path (Phase 10 cutover)
1. `/search`
2. `/advisors/[slug]`
3. `/request-intro`
4. `/advisor/leads`
5. `/advisor/leads/[id]`
6. `/admin/claims`
7. `/admin/claims/[id]`
8. `/admin/listings`

## Non-blocking deferred branches
1. `/dashboard/messages*`, `/dashboard/bookings`
2. `/advisor/messages`, `/advisor/bookings`, `/advisor/team`, `/advisor/clients*`, `/advisor/settings`
3. `/admin/reviews`, `/admin/categories`, `/admin/reports`, `/admin/analytics`

## Build-order integrity checks
1. No API endpoint is merged if its underlying schema primitive is missing.
2. No critical UI route is marked complete while consuming local mock data.
3. No monetization transparency route is marked complete without rule-versioned fee artifacts.
4. Deferred branches cannot consume core-loop implementation capacity before Phase 10 gate pass.
