# Phase 1 MVP Scope Statement

## Document control
- Version: v1.0
- Date: 2026-02-10
- Phase: 1 (Fresha-pattern translation)
- Related spec: `/Users/ceazar/Code Base/advyser/plans/phase-1/PHASE_1_REPLICA_SPEC.md`

## Scope intent
Freeze what is in MVPv1 versus deferred, so implementation can proceed without scope drift.

## In scope (MVPv1 core loop)
1. Discovery to conversion critical path:
- `/search`
- `/advisors/[slug]`
- `/request-intro`
- `/category/[type]`
- `/`

2. Advisor operational minimum:
- `/advisor/onboarding`
- `/advisor/profile`
- `/advisor/leads`
- `/advisor/leads/[id]`

3. Trust and moderation minimum:
- `/admin/claims`
- `/admin/claims/[id]`
- `/admin/listings`

4. Auth and access baseline:
- `/login`, `/signup`, `/verify`, `/forgot-password`, `/reset-password`, `/auth/callback/route.ts`

5. Phase 0 contract continuity:
- Qualified lead definition and KPI taxonomy remain unchanged.

## Out of scope (MVPv1 explicit exclusions)
1. Payments and deposits.
2. Calendar integrations/live scheduling engines.
3. In-app messaging inbox as core conversion dependency.
4. Full review and rating product depth.
5. Broker CRM pipeline and workflow automation.
6. Multi-staff advanced team operations.
7. Automated compliance workflows beyond baseline trust disclosures.
8. Capital/advanced monetization modules.

## Deferred (post-core-loop)
1. Consumer dashboard depth (`/dashboard*`) except minimal manage-lite visibility.
2. Advisor non-critical modules:
- `/advisor/messages`
- `/advisor/bookings`
- `/advisor/team`
- `/advisor/clients*`
- `/advisor/settings`
- `/advisor/billing`
3. Admin depth:
- `/admin/reviews`
- `/admin/categories`
- `/admin/reports`
- `/admin/analytics`

## Remove from production navigation
1. `/components`
2. `/design-system`

## Keep with light polish only
Legal and support pages remain and receive copy/polish only:
- `/privacy`
- `/terms`
- `/cookies`
- `/disclaimer`
- `/help`
- `/contact`
- `/about`
- `/press`
- `/careers`
- `/resources`

## Dependency handoff to later phases
1. Phase 2:
- Monetization and attribution rule finalization details.
2. Phase 4:
- Gap map with `reuse/refactor/rebuild/defer/remove` status per route.
3. Phase 5-7:
- CI/test hardening, RBAC/RLS guardrails, trust schema and moderation readiness.
4. Phase 8-9:
- Data/API backbone for search/profile/lead/lifecycle.
5. Phase 10:
- UI integration and mock removal from critical paths.

## Non-negotiable constraints
1. Existing stack remains (Next.js + Supabase + current schema baseline).
2. URL structure remains stable unless explicitly approved.
3. Core loop routes must have no local `mock*` data by Phase 10 gate.
4. Any new scope item requires explicit mapping to a later phase and gate.

## Phase 1 acceptance checklist
1. Replica spec exists and includes Waves 1.A, 1.B, 1.C.
2. Route decision matrix exists and is complete.
3. Interface contracts are specified for search/profile/lead/lifecycle.
4. In-scope and out-of-scope lists are explicit and conflict-free.
5. Client and advisor stories are both complete and testable.
