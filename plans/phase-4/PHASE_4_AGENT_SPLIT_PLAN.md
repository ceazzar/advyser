# Phase 4 Agent Split Plan

## Document control
- Version: v1.0
- Date: 2026-02-10
- Phase: 4 (Gap Map + Build Sequencing)

## Purpose
Define a parallel-by-waves execution model with bounded ownership and clean merge points.

## Agent lanes and ownership

| Agent lane | Wave ownership | Scope | Inputs | Outputs |
|---|---|---|---|---|
| `SCHEMA_RLS` | 4.A | schema comparison, missing primitives, RLS expansion plan | Phase 3 object model + schema snapshot | schema delta list, RLS policy matrix, migration order |
| `API_CONTRACTS` | 4.B | endpoint comparison, DTO contracts, state-transition enforcement map | Phase 3 flows + event taxonomy + SCHEMA_RLS outputs | API backlog, contract definitions, endpoint dependency graph |
| `UI_GAP` | 4.C | route/component readiness and mock-removal plan for critical screens | Phase 3 screen inventory + API contracts | route cutover checklist, UI dependency map, reuse/refactor/rebuild confirmation |
| `QA_STRATEGY` | 4.D | test harness and acceptance strategy | outputs from 4.A/4.B/4.C | test matrix (unit/integration/E2E), gate test checklist, CI test staging |

## Handoff protocol
1. `SCHEMA_RLS -> API_CONTRACTS`:
- Deliver stable entity/field list and policy assumptions before endpoint finalization.
2. `API_CONTRACTS -> UI_GAP`:
- Deliver DTOs and endpoint readiness states before route cutover planning.
3. `SCHEMA_RLS + API_CONTRACTS + UI_GAP -> QA_STRATEGY`:
- Deliver lockfile of critical transitions and route behaviors for test design.

## Merge points
1. Merge point A (end of 4.A): schema/RLS contract freeze.
2. Merge point B (end of 4.B): API contract freeze.
3. Merge point C (end of 4.C): route cutover plan freeze.
4. Merge point D (end of 4.D): Phase 4 gate evidence freeze.

## Concurrency guardrails
1. Do not parallelize same-file schema migrations.
2. Do not merge UI cutover plans before API contract freeze.
3. Do not add test assertions for unstable event names.
4. Keep one owner per artifact file to avoid merge contention.

## Escalation rules
1. Any dependency cycle discovered across waves must block gate closure until resolved.
2. Any scope expansion that touches deferred routes requires explicit reclassification in the reuse/replace plan.
3. Any conflict between phase gate and MVP track interpretation resolves to:
- phase-local completion in phase docs
- release readiness in `/Users/ceazar/Code Base/advyser/plans/MVP_TRACK_STATUS.md`
