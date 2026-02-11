# Phase 3 Replica Spec Pack

## Document control
- Version: v1.0
- Date: 2026-02-10
- Phase: 3 (Targeted Crawl + Replica Spec Pack)
- Plan reference: `/Users/ceazar/Code Base/advyser/plans/Master-Plan-v2.md`

## Objective
Convert Phase 1/2 decisions and targeted Fresha-pattern crawl evidence into buildable artifacts for load-bearing Advyser routes.

## Inputs used
1. `/Users/ceazar/Code Base/advyser/plans/phase-1/PHASE_1_REPLICA_SPEC.md`
2. `/Users/ceazar/Code Base/advyser/plans/phase-1/PHASE_1_MVP_SCOPE_STATEMENT.md`
3. `/Users/ceazar/Code Base/advyser/plans/phase-2/PHASE_2_MONETIZATION_DECISION_DOC.md`
4. `/Users/ceazar/Code Base/advyser/plans/phase-2/PHASE_2_ATTRIBUTION_SPEC.md`
5. `/Users/ceazar/Code Base/advyser/docs/fresha/FINAL_REPLICA_SPEC_PACK.md`
6. `/Users/ceazar/Code Base/advyser/docs/fresha/IA_INVENTORY.md`
7. `/Users/ceazar/Code Base/advyser/docs/fresha/FLOWS.md`
8. `/Users/ceazar/Code Base/advyser/docs/fresha/INSTRUMENTATION.md`
9. `/Users/ceazar/Code Base/advyser/docs/fresha/OBJECT_MODEL.md`

## Phase 3 deliverables
1. Page type inventory (prioritized load-bearing screen types):
- `/Users/ceazar/Code Base/advyser/plans/phase-3/PHASE_3_PAGE_TYPE_INVENTORY.md`
2. Three core flow maps:
- `/Users/ceazar/Code Base/advyser/plans/phase-3/PHASE_3_FLOW_MAPS.md`
3. Event taxonomy (contract-level):
- `/Users/ceazar/Code Base/advyser/plans/phase-3/PHASE_3_EVENT_TAXONOMY.md`
4. Draft object model:
- `/Users/ceazar/Code Base/advyser/plans/phase-3/PHASE_3_DRAFT_OBJECT_MODEL.md`

## Coverage summary
1. Screen coverage:
- `16` prioritized screen types (`10-20` gate target satisfied).
2. Flow coverage:
- Marketplace conversion flow, advisor operating flow, money/attribution transparency flow.
3. Event coverage:
- Consumer discovery and conversion, advisor lifecycle actions, fee/dispute transparency, admin moderation events.
4. Object coverage:
- Tenant, profile, lead lifecycle, attribution snapshot, fee assessment, billing statement, disputes, moderation, audit logs.

## Wave mapping
1. Wave `3.A` Marketplace crawl:
- represented by screens `P3-01` through `P3-06` and Flow A.
2. Wave `3.B` Advisor crawl:
- represented by screens `P3-07` through `P3-10` and Flow B.
3. Wave `3.C` Money surfaces crawl:
- represented by screen `P3-14` and Flow C.
4. Wave `3.D` Consolidation synthesis:
- represented by the event taxonomy and draft object model.

## Hand-off to Phase 4
1. Use screen inventory as UI gap baseline.
2. Use flow maps to define API transition points and ownership boundaries.
3. Use event taxonomy to drive instrumentation and analytics table contracts.
4. Use draft object model to map existing schema versus missing primitives.

## Stop-condition check
1. Gate-required artifacts all exist and are cross-linked.
2. Artifacts are constrained to MVPv1 load-bearing routes and monetization prerequisites.
3. Phase 4 can start without requiring additional scope discovery.
