╔═══════════════════════════════════════════════════════════════════════════════════════╗
║                ADVYSER PLATFORM - MASTER IMPLEMENTATION PLAN (vFinal)                ║
║               Fresha-Pattern Replica for Advisors (Property + Finance)                ║
╠═══════════════════════════════════════════════════════════════════════════════════════╣
║  Purpose: Sequential-by-gates, parallel-by-waves execution blueprint                  ║
║  Method: MASTER_PLAN format (Gates + Waves + strict dependency order)                 ║
║  Created: 2026-02-10                                                                  ║
║  Status: PHASE GATES THROUGH PHASE 10 COMPLETE                                         ║
║  Scope: Phase 0 through Phase 17                                                      ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝

STATUS LEGEND (DUAL COMPLETION SEMANTICS):
- `PHASE_GATE_COMPLETE`: the specific phase gate artifacts and criteria are complete.
- `TRACK_READY`: an MVP track is release-ready across all required phases/dependencies.
- `TRACK_BLOCKED_BY`: an MVP track is not ready and lists blocking phase IDs.

════════════════════════════════════════════════════════════════════════════════════════
                           STRATEGIC CONTEXT
════════════════════════════════════════════════════════════════════════════════════════

Read this section FIRST to understand what we're building and why.

────────────────────────────────────────────────────────────────────────────────────────
PLATFORM THESIS
────────────────────────────────────────────────────────────────────────────────────────

"Two products on one platform: a trust-first advisor marketplace and an advisor
operating system that turns first conversion into retained relationships."

You are replicating the Fresha business pattern, adapted for advisor vertical realities:

┌─────────────────────────────────────────────────────────────────────────────┐
│ FLYWHEEL STEP        │ ADVYSER INTERPRETATION                               │
├──────────────────────┼──────────────────────────────────────────────────────┤
│ Discovery            │ Search results, local pages, partner/referral entry │
├──────────────────────┼──────────────────────────────────────────────────────┤
│ Trust                │ Verification, disclosures, proof blocks, reviews    │
├──────────────────────┼──────────────────────────────────────────────────────┤
│ Booking/Lead         │ Instant booking or qualified lead submission         │
├──────────────────────┼──────────────────────────────────────────────────────┤
│ Advisor Ops          │ Services, availability, calendar, client timeline    │
├──────────────────────┼──────────────────────────────────────────────────────┤
│ Monetization         │ Subscription / lead fee / take-rate (by Phase 2)    │
├──────────────────────┼──────────────────────────────────────────────────────┤
│ Reinvestment         │ Liquidity growth: more supply + more demand          │
└──────────────────────┴──────────────────────────────────────────────────────┘

Advisor-vertical constraints that change sequencing:
• Trust and compliance are conversion primitives, not launch hardening extras.
• Lifecycle is relationship-centric, not appointment-centric only.
• Cold-start and quality triage must be explicit product mechanics.

────────────────────────────────────────────────────────────────────────────────────────
EXECUTION PHILOSOPHY
────────────────────────────────────────────────────────────────────────────────────────

This plan is:
1. Sequential at PHASE GATES (do not advance without gate evidence)
2. Parallel inside WAVES (schema/API/UI/QA where dependencies allow)
3. Overlap-capable only when underlying primitives already exist

Core sequence:
SPEC & TARGET (0-4) -> BUILD CORE LOOPS (5-10) -> DIFFERENTIATE & SCALE (11-17)

────────────────────────────────────────────────────────────────────────────────────────
GLOBAL CROSS-PHASE ARTIFACTS
────────────────────────────────────────────────────────────────────────────────────────

These artifacts are maintained continuously:

┌───────────────────────────────┬───────────────────────────────────────────────┐
│ Artifact                      │ Purpose                                       │
├───────────────────────────────┼───────────────────────────────────────────────┤
│ Replica Spec Pack             │ Page types, flows, object model, events       │
├───────────────────────────────┼───────────────────────────────────────────────┤
│ Gap Map Table                │ Exists/missing/dependencies/build order        │
├───────────────────────────────┼───────────────────────────────────────────────┤
│ Instrumentation Plan          │ Event taxonomy, funnels, dashboards, KPIs     │
├───────────────────────────────┼───────────────────────────────────────────────┤
│ Trust Model Pack              │ Verification/disclosure/consent/audit/reviews │
├───────────────────────────────┼───────────────────────────────────────────────┤
│ Launch Playbook               │ Cold-start ops, support, disputes, moderation │
└───────────────────────────────┴───────────────────────────────────────────────┘

════════════════════════════════════════════════════════════════════════════════════════
                           PHASE OVERVIEW
════════════════════════════════════════════════════════════════════════════════════════

┌───────┬───────────────────────────────────────────┬───────┬──────────────────┬──────────────────────┬────────────────────┐
│ Phase │ Name                                      │ Waves │ Deliverable      │ Gate Status          │ MVP Track Impact   │
├───────┼───────────────────────────────────────────┼───────┼──────────────────┼──────────────────────┼────────────────────┤
│   0   │ Wedge Decision + Demand Proof [MVPv1]     │   4   │ Wedge Brief      │ COMPLETE ✅           │ MVP1               │
├───────┼───────────────────────────────────────────┼───────┼──────────────────┼──────────────────────┼────────────────────┤
│   1   │ Fresha-pattern Translation [MVPv1]        │   3   │ Replica Spec     │ COMPLETE ✅           │ MVP1               │
├───────┼───────────────────────────────────────────┼───────┼──────────────────┼──────────────────────┼────────────────────┤
│   2   │ Monetization + Attribution Rules [MVPv3]  │   3   │ Decision Doc     │ COMPLETE ✅           │ MVP3 Foundation    │
├───────┼───────────────────────────────────────────┼───────┼──────────────────┼──────────────────────┼────────────────────┤
│   3   │ Targeted Crawl + Spec Pack [MVPv1]        │   4   │ Buildable Spec   │ COMPLETE ✅           │ MVP1               │
├───────┼───────────────────────────────────────────┼───────┼──────────────────┼──────────────────────┼────────────────────┤
│   4   │ Gap Map + Build Sequencing [MVPv1]        │   4   │ Sequenced Plan   │ COMPLETE ✅           │ MVP1               │
├───────┼───────────────────────────────────────────┼───────┼──────────────────┼──────────────────────┼────────────────────┤
│   5   │ Foundation Setup [MVPv1]                  │   3   │ Env + CI Ready   │ COMPLETE ✅           │ MVP1               │
├───────┼───────────────────────────────────────────┼───────┼──────────────────┼──────────────────────┼────────────────────┤
│   6   │ Authentication + Tenancy + RLS [MVPv2]    │   4   │ Secure Access    │ COMPLETE ✅           │ MVP2               │
├───────┼───────────────────────────────────────────┼───────┼──────────────────┼──────────────────────┼────────────────────┤
│   7   │ Trust Launch [MVPv3]                      │   4   │ Trust Primitives │ COMPLETE ✅           │ MVP3               │
├───────┼───────────────────────────────────────────┼───────┼──────────────────┼──────────────────────┼────────────────────┤
│   8   │ Database + Data Layer [MVPv1]             │   5   │ MVP Schema       │ COMPLETE ✅           │ MVP1               │
├───────┼───────────────────────────────────────────┼───────┼──────────────────┼──────────────────────┼────────────────────┤
│   9   │ Core API Endpoints [MVPv1]                │   5   │ Full Loop APIs   │ COMPLETE ✅           │ MVP1               │
├───────┼───────────────────────────────────────────┼───────┼──────────────────┼──────────────────────┼────────────────────┤
│  10   │ UI Integration [MVPv1]                    │   4   │ No Mock Data     │ COMPLETE ✅           │ MVP1               │
├───────┼───────────────────────────────────────────┼───────┼──────────────────┼──────────────────────┼────────────────────┤
│  11   │ Conversion Engine [MVPv3]                 │   4   │ Liquidity Engine │ NOT STARTED          │ MVP3               │
├───────┼───────────────────────────────────────────┼───────┼──────────────────┼──────────────────────┼────────────────────┤
│  12   │ Relationship Lifecycle Layer [MVPv3]      │   4   │ Lifecycle Lite   │ NOT STARTED          │ MVP3               │
├───────┼───────────────────────────────────────────┼───────┼──────────────────┼──────────────────────┼────────────────────┤
│  13   │ Integrations [MVPv3]                      │   4   │ Admin Reduction  │ NOT STARTED          │ MVP3               │
├───────┼───────────────────────────────────────────┼───────┼──────────────────┼──────────────────────┼────────────────────┤
│  14   │ Workflow Moat [MVPv3]                     │   3   │ Defensibility    │ NOT STARTED          │ MVP3               │
├───────┼───────────────────────────────────────────┼───────┼──────────────────┼──────────────────────┼────────────────────┤
│  15   │ Security + Compliance [MVPv1]             │   3   │ Controls Ready   │ NOT STARTED          │ MVP1               │
├───────┼───────────────────────────────────────────┼───────┼──────────────────┼──────────────────────┼────────────────────┤
│  16   │ Testing + QA [MVPv1]                      │   3   │ Ship Confidence  │ NOT STARTED          │ MVP1               │
├───────┼───────────────────────────────────────────┼───────┼──────────────────┼──────────────────────┼────────────────────┤
│  17   │ Deployment + Launch + Cold-start [MVPv1]  │   4   │ Production Live  │ NOT STARTED          │ MVP1               │
└───────┴───────────────────────────────────────────┴───────┴──────────────────┴──────────────────────┴────────────────────┘

Total: 18 Phases (0-17), 68 Waves

════════════════════════════════════════════════════════════════════════════════════════
                           MVP RELEASE TRACKS
════════════════════════════════════════════════════════════════════════════════════════

TRACK MEMBERSHIP MATRIX:
1. MVP1 track phases:
- `0, 1, 3, 4, 5, 8, 9, 10, 15, 16, 17`
2. MVP2 track phases:
- `6`
- Core dependencies: `5, 8, 9, 10`
3. MVP3 track phases:
- `2, 7, 11, 12, 13, 14`
- Core dependencies: `5, 8, 9, 10`
- Phase 2 is classified as `MVP3 Foundation`.

TRACK GATE CRITERIA (CANONICAL):
1. `MVP1 TRACK_READY` only when all MVP1 track phases are `PHASE_GATE_COMPLETE`.
2. `MVP2 TRACK_READY` only when:
- Phase `6` is `PHASE_GATE_COMPLETE`, and
- Core dependencies `5, 8, 9, 10` are `PHASE_GATE_COMPLETE`.
3. `MVP3 TRACK_READY` only when:
- Phases `2, 7, 11, 12, 13, 14` are `PHASE_GATE_COMPLETE`, and
- Core dependencies `5, 8, 9, 10` are `PHASE_GATE_COMPLETE`.
4. `Phase-level ✅` never auto-promotes any MVP track to `TRACK_READY`.

TRACK STATUS SOURCE OF TRUTH:
- `/Users/ceazar/Code Base/advyser/plans/MVP_TRACK_STATUS.md`

STATUS INTERPRETATION RULES:
1. The Phase Overview `Gate Status` column is phase-local only.
2. MVP release readiness must be read from the MVP track file, not inferred from any single phase.
3. A phase can be `PHASE_GATE_COMPLETE` while its parent MVP track remains `TRACK_BLOCKED_BY`.

════════════════════════════════════════════════════════════════════════════════════════
             PHASE 0: WEDGE DECISION + DEMAND PROOF [MVPv1] (4 Waves) [COMPLETE ✅]
════════════════════════════════════════════════════════════════════════════════════════

STATUS IDENTIFIER: ✅ PHASE 0 COMPLETE (2026-02-10)

OBJECTIVE: Choose the wedge and prove short-horizon demand before heavy build.
GATE: Team can clearly answer ICP, day-1 value, and 14-day success metric.

────────────────────────────────────────────────────────────────────────────────────────
WAVE COORDINATION (Phase 0)
────────────────────────────────────────────────────────────────────────────────────────

┌─────────┬─────────────────────────────────────────────────────────────────────────────┐
│  Wave   │ Scope                                                                       │
├─────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 0.A     │ ICP + niche selection [MVPv1]                                                       │
│ 0.B     │ Offer + qualification definition [MVPv1]                                            │
│ 0.C     │ Channel hypothesis (SEO/referral/partner/paid) [MVPv1]                              │
│ 0.D     │ KPI instrumentation requirements [MVPv1]                                             │
└─────────┴─────────────────────────────────────────────────────────────────────────────┘

VERIFICATION GATE (Phase 0):
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Output: Wedge Brief (1-2 pages) + KPI target sheet                                 │
│ Must define: ICP, first geography, instant value moment, MVP exclusions            │
│ KPI minimums: search->profile, profile->booking/lead, response time, show-up, ROI │
└─────────────────────────────────────────────────────────────────────────────────────┘

PHASE 0 EXECUTION ARTIFACTS (LOCKED):
- /Users/ceazar/Code Base/advyser/plans/phase-0/WEDGE_BRIEF.md
- /Users/ceazar/Code Base/advyser/plans/phase-0/KPI_TARGET_SHEET.md

PHASE 0 COMPLETION UPDATE (2026-02-10):
- Completion state: DONE (documentation and gate definitions complete)
- Locked wedge: Mortgage brokers, Melbourne metro, FHB + refinance
- Day-1 value moment: Guided shortlist + "Request a call"
- 14-day win metric: >= 15 qualified leads
- Next phase focus: Phase 1 (Fresha-pattern translation)

════════════════════════════════════════════════════════════════════════════════════════
             PHASE 1: FRESHA-PATTERN TRANSLATION [MVPv1] (3 Waves) [COMPLETE ✅]
════════════════════════════════════════════════════════════════════════════════════════

STATUS IDENTIFIER: ✅ PHASE 1 COMPLETE (2026-02-10)

OBJECTIVE: Translate Fresha mechanics into advisor-specific entities and flows.
GATE: Client and advisor stories both narrate end-to-end without ambiguity.

────────────────────────────────────────────────────────────────────────────────────────
WAVE COORDINATION (Phase 1)
────────────────────────────────────────────────────────────────────────────────────────

┌─────────┬─────────────────────────────────────────────────────────────────────────────┐
│  Wave   │ Scope                                                                       │
├─────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 1.A     │ Entity mapping (Firm, Advisor, Service, Availability, Booking/Lead, Money) [MVPv1]│
│ 1.B     │ Role mapping + permission boundaries [MVPv1]                                        │
│ 1.C     │ Funnel mapping (happy path + major drop-off points) [MVPv1]                         │
└─────────┴─────────────────────────────────────────────────────────────────────────────┘

VERIFICATION GATE (Phase 1):
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Output: Replica Spec (2-4 pages) + MVP scope statement                              │
│ Must narrate:                                                                        │
│ • Client: discover -> trust -> book/lead -> confirmation -> manage                  │
│ • Advisor: onboard -> publish -> receive -> respond -> deliver -> retain            │
└─────────────────────────────────────────────────────────────────────────────────────┘

PHASE 1 EXECUTION ARTIFACTS (LOCKED):
- /Users/ceazar/Code Base/advyser/plans/phase-1/PHASE_1_REPLICA_SPEC.md
- /Users/ceazar/Code Base/advyser/plans/phase-1/PHASE_1_MVP_SCOPE_STATEMENT.md
- /Users/ceazar/Code Base/advyser/plans/phase-1/ROUTE_DECISION_MATRIX.md
- /Users/ceazar/Code Base/advyser/plans/phase-1/SELECTIVE_REBUILD_EXECUTION_RUNBOOK.md
- /Users/ceazar/Code Base/advyser/plans/phase-1/PHASE_1_GATE_EVIDENCE.md

PHASE 1 IMPLEMENTATION STRATEGY UPDATE (2026-02-10):
- Strategy: selective rebuild on existing codebase (no full scratch rebuild)
- Decision: preserve infrastructure, rebuild conversion-critical routes, defer non-critical modules
- Governance: route readiness lock uses reuse/refactor/rebuild/defer/remove taxonomy

PHASE 1 COMPLETION UPDATE (2026-02-10):
- Completion state: DONE (gate criteria satisfied)
- Gate evidence: /Users/ceazar/Code Base/advyser/plans/phase-1/PHASE_1_GATE_EVIDENCE.md
- Required outputs delivered: Replica spec + MVP scope statement
- Narratives delivered: client and advisor end-to-end stories
- Next phase focus: Phase 2 (Monetization + Attribution Rules)

════════════════════════════════════════════════════════════════════════════════════════
             PHASE 2: MONETIZATION + ATTRIBUTION RULES [MVPv3] (3 Waves) [COMPLETE ✅]
════════════════════════════════════════════════════════════════════════════════════════

STATUS IDENTIFIER: ✅ PHASE 2 COMPLETE (2026-02-10)

OBJECTIVE: Decide commercial model early so data and reporting are built correctly.
GATE: Five realistic scenarios compute fees/new-client status/reporting outputs.

────────────────────────────────────────────────────────────────────────────────────────
WAVE COORDINATION (Phase 2)
────────────────────────────────────────────────────────────────────────────────────────

┌─────────┬─────────────────────────────────────────────────────────────────────────────┐
│  Wave   │ Scope                                                                       │
├─────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 2.A     │ Commercial model selection (subscription/lead-fee/take-rate/hybrid) [MVPv3]        │
│ 2.B     │ Attribution logic + data capture points [MVPv3]                                     │
│ 2.C     │ Transparency surfaces (advisor statements + source reporting) [MVPv3]               │
└─────────┴─────────────────────────────────────────────────────────────────────────────┘

VERIFICATION GATE (Phase 2):
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Output: Monetization Decision Doc + Attribution Spec                                │
│ Must define: new-client window, dedupe rules, edge cases, dispute process           │
│ Must show: advisor-facing fee breakdown and source attribution visibility            │
└─────────────────────────────────────────────────────────────────────────────────────┘

PHASE 2 EXECUTION ARTIFACTS (LOCKED):
- /Users/ceazar/Code Base/advyser/plans/phase-2/PHASE_2_MONETIZATION_DECISION_DOC.md
- /Users/ceazar/Code Base/advyser/plans/phase-2/PHASE_2_ATTRIBUTION_SPEC.md
- /Users/ceazar/Code Base/advyser/plans/phase-2/PHASE_2_GATE_EVIDENCE.md

PHASE 2 COMPLETION UPDATE (2026-02-10):
- Completion state: DONE (gate criteria satisfied)
- Gate evidence: /Users/ceazar/Code Base/advyser/plans/phase-2/PHASE_2_GATE_EVIDENCE.md
- Required outputs delivered: Monetization decision doc + attribution spec
- Five computed scenarios documented and validated at spec level
- Next phase focus: Phase 3 (Targeted Crawl + Replica Spec Pack)

════════════════════════════════════════════════════════════════════════════════════════
            PHASE 3: TARGETED CRAWL + REPLICA SPEC PACK [MVPv1] (4 Waves) [COMPLETE ✅]
════════════════════════════════════════════════════════════════════════════════════════

STATUS IDENTIFIER: ✅ PHASE 3 COMPLETE (2026-02-10)

OBJECTIVE: Produce buildable artifacts for load-bearing flows only (not full exhaust).
GATE: Prioritized 10-20 screen types with required objects/rules/events exists.

────────────────────────────────────────────────────────────────────────────────────────
WAVE COORDINATION (Phase 3)
────────────────────────────────────────────────────────────────────────────────────────

┌─────────┬─────────────────────────────────────────────────────────────────────────────┐
│  Wave   │ Scope                                                                       │
├─────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 3.A     │ Marketplace crawl (search/results/profile/availability/book/manage) [MVPv1]         │
│ 3.B     │ Advisor crawl (onboarding/services/availability/calendar/clients/comms) [MVPv1]     │
│ 3.C     │ Money surfaces crawl (fees/attribution/statements) [MVPv1]                          │
│ 3.D     │ Consolidation to page types + object/event synthesis [MVPv1]                        │
└─────────┴─────────────────────────────────────────────────────────────────────────────┘

VERIFICATION GATE (Phase 3):
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Output: Replica Spec Pack                                                           │
│ Contains: Page Type Inventory, 3 Flow Maps, Event Taxonomy, Draft Object Model     │
│ Per screen: role, CTA, inputs/outputs, components, objects, constraints, events     │
└─────────────────────────────────────────────────────────────────────────────────────┘

PHASE 3 EXECUTION ARTIFACTS (LOCKED):
- /Users/ceazar/Code Base/advyser/plans/phase-3/PHASE_3_REPLICA_SPEC_PACK.md
- /Users/ceazar/Code Base/advyser/plans/phase-3/PHASE_3_PAGE_TYPE_INVENTORY.md
- /Users/ceazar/Code Base/advyser/plans/phase-3/PHASE_3_FLOW_MAPS.md
- /Users/ceazar/Code Base/advyser/plans/phase-3/PHASE_3_EVENT_TAXONOMY.md
- /Users/ceazar/Code Base/advyser/plans/phase-3/PHASE_3_DRAFT_OBJECT_MODEL.md
- /Users/ceazar/Code Base/advyser/plans/phase-3/PHASE_3_GATE_EVIDENCE.md

PHASE 3 COMPLETION UPDATE (2026-02-10):
- Completion state: DONE (gate criteria satisfied)
- Gate evidence: /Users/ceazar/Code Base/advyser/plans/phase-3/PHASE_3_GATE_EVIDENCE.md
- Required outputs delivered: page inventory, three flow maps, event taxonomy, draft object model
- Prioritized screen count locked at 16 (target 10-20 satisfied)
- Next phase focus: Phase 4 (Gap Map + Build Sequencing)

════════════════════════════════════════════════════════════════════════════════════════
                  PHASE 4: GAP MAP + BUILD SEQUENCING [MVPv1] (4 Waves) [COMPLETE ✅]
════════════════════════════════════════════════════════════════════════════════════════

STATUS IDENTIFIER: ✅ PHASE 4 COMPLETE (2026-02-10)

OBJECTIVE: Convert specification into dependency-safe engineering execution.
GATE: Sequence Auth/RLS -> Schema -> APIs -> UI -> Conversion mechanics is locked.

────────────────────────────────────────────────────────────────────────────────────────
WAVE COORDINATION (Phase 4)
────────────────────────────────────────────────────────────────────────────────────────

┌─────────┬─────────────────────────────────────────────────────────────────────────────┐
│  Wave   │ Scope                                                                       │
├─────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 4.A     │ Schema + RLS comparison vs required objects [MVPv1]                                │
│ 4.B     │ API comparison vs required flow actions [MVPv1]                                    │
│ 4.C     │ UI route/component comparison vs required screens [MVPv1]                          │
│ 4.D     │ Testing harness and QA strategy planning [MVPv1]                                   │
└─────────┴─────────────────────────────────────────────────────────────────────────────┘

VERIFICATION GATE (Phase 4):
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Output: Gap Map Table + Reuse/Replace Plan + Build Order + Agent split plan        │
│ Required columns: exists?, missing primitives, dependencies, effort, owner wave     │
└─────────────────────────────────────────────────────────────────────────────────────┘

PHASE 4 EXECUTION ARTIFACTS (LOCKED):
- /Users/ceazar/Code Base/advyser/plans/phase-4/PHASE_4_GAP_MAP_TABLE.md
- /Users/ceazar/Code Base/advyser/plans/phase-4/PHASE_4_REUSE_REPLACE_PLAN.md
- /Users/ceazar/Code Base/advyser/plans/phase-4/PHASE_4_BUILD_ORDER.md
- /Users/ceazar/Code Base/advyser/plans/phase-4/PHASE_4_AGENT_SPLIT_PLAN.md
- /Users/ceazar/Code Base/advyser/plans/phase-4/PHASE_4_GATE_EVIDENCE.md

PHASE 4 COMPLETION UPDATE (2026-02-10):
- Completion state: DONE (gate criteria satisfied)
- Gate evidence: /Users/ceazar/Code Base/advyser/plans/phase-4/PHASE_4_GATE_EVIDENCE.md
- Required outputs delivered: gap map table, reuse/replace plan, build order, and agent split plan
- Sequence lock confirmed: Auth/RLS -> Schema -> APIs -> UI -> Conversion mechanics
- Next phase focus: Phase 5 (Foundation Setup)

════════════════════════════════════════════════════════════════════════════════════════
                         PHASE 5: FOUNDATION SETUP [MVPv1] (3 Waves)
════════════════════════════════════════════════════════════════════════════════════════

STATUS IDENTIFIER: ✅ PHASE 5 COMPLETE (2026-02-11)

OBJECTIVE: Establish environments, tooling, and baseline developer velocity.
GATE: New engineer can setup -> migrate -> seed -> test end-to-end.

────────────────────────────────────────────────────────────────────────────────────────
WAVE COORDINATION (Phase 5)
────────────────────────────────────────────────────────────────────────────────────────

┌─────────┬─────────────────────────────────────────────────────────────────────────────┐
│  Wave   │ Scope                                                                       │
├─────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 5.A     │ Infra + config (local/staging/prod) [MVPv1]                                        │
│ 5.B     │ Tooling (migrations, type generation, seeds) [MVPv1]                               │
│ 5.C     │ Dev workflow + multi-agent conventions [MVPv1]                                     │
└─────────┴─────────────────────────────────────────────────────────────────────────────┘

VERIFICATION GATE (Phase 5):
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ CI baseline: lint, unit tests, build pass                                           │
│ Seed strategy produces realistic demo records for core flows                         │
└─────────────────────────────────────────────────────────────────────────────────────┘

PHASE 5 START UPDATE (2026-02-10):
- Execution state: STARTED
- Entry criteria satisfied: Phase 4 gate passed and sequence lock confirmed
- Immediate focus: Wave 5.A (local/staging/prod infra + config baseline)
- Gate target remains unchanged: setup -> migrate -> seed -> test end-to-end

PHASE 5 COMPLETION UPDATE (2026-02-11):
- Completion state: DONE (gate criteria satisfied)
- Wave 5.A delivered: environment templates + validation tooling
- Wave 5.B delivered: migration alignment, type generation, and transactional seed tooling
- Wave 5.C delivered: CI baseline workflow + repeatable runbook
- End-to-end gate command verified: `npm run verify:phase5`
- Deterministic seed verification integrated: `npm run db:verify-seed` (includes `user_shortlist` validation)
- Seed validation confirmed core flow records: users, business, listing, lead, conversation, messages, booking, review, shortlist
- Gate evidence:
  - /Users/ceazar/Code Base/advyser/plans/phase-5/PHASE_5_EXECUTION_SUMMARY.md
  - /Users/ceazar/Code Base/advyser/plans/phase-5/PHASE_5_GATE_EVIDENCE.md
  - /Users/ceazar/Code Base/advyser/plans/phase-5/PHASE_5_CLOSEOUT_CHECKLIST.md
- Next phase focus: Phase 6 (Authentication + Tenancy + RLS)

════════════════════════════════════════════════════════════════════════════════════════
                         PHASE 6: AUTHENTICATION + TENANCY + RLS [MVPv2] (4 Waves)
════════════════════════════════════════════════════════════════════════════════════════

STATUS IDENTIFIER: ✅ PHASE 6 COMPLETE (2026-02-11)

OBJECTIVE: Enforce secure multi-role access boundaries across all data access paths.
GATE: Cross-tenant data access fails under crafted tests and direct request attempts.

────────────────────────────────────────────────────────────────────────────────────────
WAVE COORDINATION (Phase 6)
────────────────────────────────────────────────────────────────────────────────────────

┌─────────┬─────────────────────────────────────────────────────────────────────────────┐
│  Wave   │ Scope                                                                       │
├─────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 6.A     │ Auth UX flows (signup/login/reset) [MVPv2]                                         │
│ 6.B     │ RBAC implementation (visitor/client/advisor/admin/staff) [MVPv2]                   │
│ 6.C     │ RLS enforcement + policy tests [MVPv2]                                              │
│ 6.D     │ Admin access patterns with auditability [MVPv2]                                     │
└─────────┴─────────────────────────────────────────────────────────────────────────────┘

VERIFICATION GATE (Phase 6):
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ All tables protected by RLS                                                          │
│ Server-side permissions mirror UI role guards                                        │
└─────────────────────────────────────────────────────────────────────────────────────┘

PHASE 6 COMPLETION UPDATE (2026-02-11):
- Completion state: DONE (gate criteria satisfied)
- Wave 6.A delivered: shared auth redirect/path guard utilities + tests
- Wave 6.B delivered: middleware role-based route authorization
- Wave 6.C delivered: table-wide RLS enablement + policy coverage + crafted tenancy tests
- Wave 6.D delivered: deterministic one-shot phase verifier (`verify:phase6`)
- Security hardening follow-up delivered:
  - self role escalation blocked (`users` grant/policy + role-update guard trigger)
  - advisor note/revision access constrained to advisor business members
  - deterministic claim access matrix assertions added to Phase 6 verifier
  - policy reset scope narrowed to migration-owned policy names only
- End-to-end gate command verified: `npm run verify:phase6`
- Gate evidence:
  - /Users/ceazar/Code Base/advyser/plans/phase-6/PHASE_6_EXECUTION_SUMMARY.md
  - /Users/ceazar/Code Base/advyser/plans/phase-6/PHASE_6_GATE_EVIDENCE.md
  - /Users/ceazar/Code Base/advyser/plans/phase-6/PHASE_6_CLOSEOUT_CHECKLIST.md
- Next phase focus: Phase 7 (Trust Launch)

════════════════════════════════════════════════════════════════════════════════════════
                         PHASE 7: TRUST LAUNCH [MVPv3] (4 Waves)
════════════════════════════════════════════════════════════════════════════════════════

STATUS IDENTIFIER: ✅ PHASE 7 COMPLETE (2026-02-11)

OBJECTIVE: Ship trust primitives as conversion surfaces, not late-stage add-ons.
GATE: Verified profile renders with auditable trust actions and clear disclosures.

────────────────────────────────────────────────────────────────────────────────────────
WAVE COORDINATION (Phase 7)
────────────────────────────────────────────────────────────────────────────────────────

┌─────────┬─────────────────────────────────────────────────────────────────────────────┐
│  Wave   │ Scope                                                                       │
├─────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 7.A     │ Trust schema (verification/evidence/disclosures/consent/audit/reviews) [MVPv3]     │
│ 7.B     │ Trust UI (credibility blocks, badges, disclosure surfaces) [MVPv3]                  │
│ 7.C     │ Ops/admin verification queue + actions [MVPv3]                                      │
│ 7.D     │ Permission + tamper resistance tests [MVPv3]                                        │
└─────────┴─────────────────────────────────────────────────────────────────────────────┘

VERIFICATION GATE (Phase 7):
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Badge policy enforced: Verified != Promoted                                          │
│ Consent and audit entries written for trust-relevant state transitions               │
│ Review integrity scaffolding exists (dispute + right-of-reply baseline)              │
└─────────────────────────────────────────────────────────────────────────────────────┘

PHASE 7 COMPLETION UPDATE (2026-02-11):
- Completion state: DONE (gate criteria satisfied)
- Wave 7.A delivered: trust schema primitives (disclosures, consent, dispute, reply) + badge policy trigger
- Wave 7.B delivered: deterministic trust seed path supporting promoted/verified disclosure surfaces
- Wave 7.C delivered: auditable trust state transitions for listing and review operations
- Wave 7.D delivered: tamper-resistance verifier (`db:verify-phase7`) for trust gate assertions
- End-to-end gate command verified: `npm run verify:phase7`
- Gate evidence:
  - /Users/ceazar/Code Base/advyser/plans/phase-7/PHASE_7_EXECUTION_SUMMARY.md
  - /Users/ceazar/Code Base/advyser/plans/phase-7/PHASE_7_GATE_EVIDENCE.md
  - /Users/ceazar/Code Base/advyser/plans/phase-7/PHASE_7_CLOSEOUT_CHECKLIST.md
- Next phase focus: Phase 8 (Database + Data Layer)

════════════════════════════════════════════════════════════════════════════════════════
                         PHASE 8: DATABASE + DATA LAYER [MVPv1] (5 Waves)
════════════════════════════════════════════════════════════════════════════════════════

STATUS IDENTIFIER: ✅ PHASE 8 COMPLETE (2026-02-11)

OBJECTIVE: Finalize MVP schema across marketplace, advisor ops, trust, and attribution.
GATE: Seeded system demonstrates search -> profile -> booking/lead -> advisor visibility.

────────────────────────────────────────────────────────────────────────────────────────
WAVE COORDINATION (Phase 8)
────────────────────────────────────────────────────────────────────────────────────────

┌─────────┬─────────────────────────────────────────────────────────────────────────────┐
│  Wave   │ Scope                                                                       │
├─────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 8.A     │ Marketplace core tables [MVPv1]                                                     │
│ 8.B     │ Advisor ops tables [MVPv1]                                                          │
│ 8.C     │ Trust + compliance tables [MVPv1]                                                   │
│ 8.D     │ Attribution + monetization primitives [MVPv1]                                       │
│ 8.E     │ Seed data and fixtures [MVPv1]                                                      │
└─────────┴─────────────────────────────────────────────────────────────────────────────┘

VERIFICATION GATE (Phase 8):
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Migrations apply cleanly in local + staging                                          │
│ Type generation reflects all phase-8 entities                                        │
└─────────────────────────────────────────────────────────────────────────────────────┘

PHASE 8 COMPLETION UPDATE (2026-02-11):
- Completion state: DONE (gate criteria satisfied)
- Waves 8.A-8.E delivered through schema, RLS coverage, and seeded flow checks
- Type layer refreshed and verified:
  - `npm run db:types`
  - generated file: `/Users/ceazar/Code Base/advyser/site/src/types/database.generated.ts`
- Runtime scope remains MVP1 public-only:
  - route inventory source of truth: `/Users/ceazar/Code Base/advyser/plans/pages.md`
- Gate command verified: `npm run verify:phase8`
- Gate evidence:
  - /Users/ceazar/Code Base/advyser/plans/phase-8/PHASE_8_EXECUTION_SUMMARY.md
  - /Users/ceazar/Code Base/advyser/plans/phase-8/PHASE_8_GATE_EVIDENCE.md
- Scope-control references:
  - /Users/ceazar/Code Base/advyser/plans/phase-8/MVP1_PUBLIC_ONLY_SCOPE.md
  - /Users/ceazar/Code Base/advyser/plans/phase-8/MVP1_PUBLIC_ONLY_PRUNE_LOG.md
  - /Users/ceazar/Code Base/advyser/plans/phase-8/MVP1_PUBLIC_ONLY_RECOVERY_RUNBOOK.md

PHASE 9/10 PRECONDITION CLOSEOUT (2026-02-11):
- Security baseline satisfied:
  - hardening migration present: `/Users/ceazar/Code Base/advyser/site/supabase/migrations/20260211234000_phase6_security_hardening.sql`
  - baseline verifiers green: `npm run verify:phase6` and `npm run verify:phase7`
- Route-scope decision fixed:
  - runtime remains public-only (see `/Users/ceazar/Code Base/advyser/plans/pages.md`)
  - no advisor/admin/auth route restoration required for MVP1 public-loop Phase 9/10 execution
- Pre-phase gate confirmed:
  - `npm run verify:phase8`

════════════════════════════════════════════════════════════════════════════════════════
                         PHASE 9: CORE API ENDPOINTS [MVPv1] (5 Waves)
════════════════════════════════════════════════════════════════════════════════════════

STATUS IDENTIFIER: ✅ PHASE 9 COMPLETE (2026-02-11)

OBJECTIVE: Expose all MVP loop actions through enforceable, tested server endpoints.
GATE: End-to-end flow works through APIs only, with no manual DB edits.

────────────────────────────────────────────────────────────────────────────────────────
WAVE COORDINATION (Phase 9)
────────────────────────────────────────────────────────────────────────────────────────

┌─────────┬─────────────────────────────────────────────────────────────────────────────┐
│  Wave   │ Scope                                                                       │
├─────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 9.A     │ Marketplace APIs (search/profile/availability/book/manage) [MVPv1]                 │
│ 9.B     │ Advisor APIs (onboarding/services/availability/calendar/clients) [MVPv1]            │
│ 9.C     │ Trust APIs (verification/disclosures/reviews/disputes baseline) [MVPv1]             │
│ 9.D     │ Attribution + telemetry APIs [MVPv1]                                                │
│ 9.E     │ Booking/lead lifecycle state machine rules [MVPv1]                                  │
└─────────┴─────────────────────────────────────────────────────────────────────────────┘

VERIFICATION GATE (Phase 9):
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ API contracts documented and test-covered                                             │
│ Rule enforcement exists server-side for all critical transitions                      │
└─────────────────────────────────────────────────────────────────────────────────────┘

PHASE 9 COMPLETION UPDATE (2026-02-11):
- Completion state: DONE (gate criteria satisfied)
- API contract verifier added and enforced:
  - `/Users/ceazar/Code Base/advyser/site/scripts/verify-phase9-api-contracts.mjs`
- Lifecycle function guard checks verified:
  - `accept_lead`, `book_lead`, `convert_lead`, `decline_lead`
- Public lead submission path enabled with server-side validation/idempotency handling:
  - `/Users/ceazar/Code Base/advyser/site/src/app/api/leads/route.ts`
- Gate command verified: `npm run verify:phase9`
- Next phase focus: Phase 10 (UI Integration)

════════════════════════════════════════════════════════════════════════════════════════
                         PHASE 10: UI INTEGRATION [MVPv1] (4 Waves)
════════════════════════════════════════════════════════════════════════════════════════

STATUS IDENTIFIER: ✅ PHASE 10 COMPLETE (2026-02-11)

OBJECTIVE: Replace mocks with live backend data across full marketplace + advisor loop.
GATE: Stranger can find advisor, convert, and receive confirmation via live system.

────────────────────────────────────────────────────────────────────────────────────────
WAVE COORDINATION (Phase 10)
────────────────────────────────────────────────────────────────────────────────────────

┌─────────┬─────────────────────────────────────────────────────────────────────────────┐
│  Wave   │ Scope                                                                       │
├─────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 10.A    │ Marketplace UI integration [MVPv1]                                                  │
│ 10.B    │ Advisor portal UI integration [MVPv1]                                               │
│ 10.C    │ Trust UI integration [MVPv1]                                                        │
│ 10.D    │ Instrumentation verification [MVPv1]                                                │
└─────────┴─────────────────────────────────────────────────────────────────────────────┘

VERIFICATION GATE (Phase 10):
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ No mock data in MVP critical path                                                     │
│ Funnel events observed: search -> profile -> booking/lead -> response                │
└─────────────────────────────────────────────────────────────────────────────────────┘

PHASE 10 COMPLETION UPDATE (2026-02-11):
- Completion state: DONE (gate criteria satisfied)
- Critical marketplace routes moved from mock to live API wiring:
  - `/Users/ceazar/Code Base/advyser/site/src/app/search/page.tsx`
  - `/Users/ceazar/Code Base/advyser/site/src/app/category/[type]/page.tsx`
  - `/Users/ceazar/Code Base/advyser/site/src/app/advisors/[slug]/page.tsx`
  - `/Users/ceazar/Code Base/advyser/site/src/app/request-intro/page.tsx`
- UI integration verifier added:
  - `/Users/ceazar/Code Base/advyser/site/scripts/verify-phase10-ui-integration.mjs`
- Gate command verified: `npm run verify:phase10`
- Next phase focus: Phase 11 (Conversion Engine)

════════════════════════════════════════════════════════════════════════════════════════
                         PHASE 11: CONVERSION ENGINE [MVPv3] (4 Waves)
════════════════════════════════════════════════════════════════════════════════════════

OBJECTIVE: Create liquidity mechanics that improve advisor response and client outcomes.
GATE: Weekly conversion optimization possible with SLA and funnel data.

────────────────────────────────────────────────────────────────────────────────────────
WAVE COORDINATION (Phase 11)
────────────────────────────────────────────────────────────────────────────────────────

┌─────────┬─────────────────────────────────────────────────────────────────────────────┐
│  Wave   │ Scope                                                                       │
├─────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 11.A    │ Lead/booking triage state machine [MVPv3]                                           │
│ 11.B    │ Messaging templates + follow-up mechanics [MVPv3]                                   │
│ 11.C    │ Calendar attachments + reminders [MVPv3]                                            │
│ 11.D    │ Conversion dashboards (funnel + SLA + response) [MVPv3]                             │
└─────────┴─────────────────────────────────────────────────────────────────────────────┘

VERIFICATION GATE (Phase 11):
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Lead acceptance/decline and SLA timers active                                        │
│ Show/no-show and reschedule/cancel signals measurable                                │
└─────────────────────────────────────────────────────────────────────────────────────┘

════════════════════════════════════════════════════════════════════════════════════════
                         PHASE 12: RELATIONSHIP LIFECYCLE LAYER [MVPv3] (4 Waves)
════════════════════════════════════════════════════════════════════════════════════════

OBJECTIVE: Shift from appointment-only product to ongoing relationship operating model.
GATE: Advisor can run ongoing client relationship from inside platform.

────────────────────────────────────────────────────────────────────────────────────────
WAVE COORDINATION (Phase 12)
────────────────────────────────────────────────────────────────────────────────────────

┌─────────┬─────────────────────────────────────────────────────────────────────────────┐
│  Wave   │ Scope                                                                       │
├─────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 12.A    │ Engagement model (one-off vs ongoing) [MVPv3]                                      │
│ 12.B    │ Cadence and reminder automation [MVPv3]                                             │
│ 12.C    │ Client portal (tasks/next-steps/checklists) [MVPv3]                                │
│ 12.D    │ Secure docs vault + permissions baseline [MVPv3]                                   │
└─────────┴─────────────────────────────────────────────────────────────────────────────┘

VERIFICATION GATE (Phase 12):
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Rebooking and review cadence workflows are operational                               │
│ Secure document access boundaries validated                                          │
└─────────────────────────────────────────────────────────────────────────────────────┘

════════════════════════════════════════════════════════════════════════════════════════
                         PHASE 13: INTEGRATIONS [MVPv3] (4 Waves)
════════════════════════════════════════════════════════════════════════════════════════

OBJECTIVE: Reduce admin overhead by integrating with advisor system-of-record tools.
GATE: Advisors no longer need duplicate calendar entry for marketplace bookings.

────────────────────────────────────────────────────────────────────────────────────────
WAVE COORDINATION (Phase 13)
────────────────────────────────────────────────────────────────────────────────────────

┌─────────┬─────────────────────────────────────────────────────────────────────────────┐
│  Wave   │ Scope                                                                       │
├─────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 13.A    │ Calendar sync (Google/Microsoft) [MVPv3]                                           │
│ 13.B    │ Messaging provider hardening [MVPv3]                                                │
│ 13.C    │ Payments/invoicing thin implementation [MVPv3]                                      │
│ 13.D    │ Exports/webhooks (deferred/limited) [MVPv3]                                         │
└─────────┴─────────────────────────────────────────────────────────────────────────────┘

VERIFICATION GATE (Phase 13):
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Availability remains truthful after sync cycles                                      │
│ Deliverability and unsubscribe handling validated                                    │
└─────────────────────────────────────────────────────────────────────────────────────┘

════════════════════════════════════════════════════════════════════════════════════════
                         PHASE 14: WORKFLOW MOAT [MVPv3] (3 Waves)
════════════════════════════════════════════════════════════════════════════════════════

OBJECTIVE: Add defensibility through analytics, compliance exports, and auditable AI.
GATE: Advisors can justify retention through measurable value and compliance support.

────────────────────────────────────────────────────────────────────────────────────────
WAVE COORDINATION (Phase 14)
────────────────────────────────────────────────────────────────────────────────────────

┌─────────┬─────────────────────────────────────────────────────────────────────────────┐
│  Wave   │ Scope                                                                       │
├─────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 14.A    │ Advisor analytics (pipeline, conversion, ROI, source) [MVPv3]                       │
│ 14.B    │ Compliance export pack [MVPv3]                                                      │
│ 14.C    │ Copilot backend with consent + audit trail [MVPv3]                                  │
└─────────┴─────────────────────────────────────────────────────────────────────────────┘

VERIFICATION GATE (Phase 14):
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Compliance export generated for representative advisor scenarios                      │
│ Copilot outputs are consented, auditable, and exportable                             │
└─────────────────────────────────────────────────────────────────────────────────────┘

════════════════════════════════════════════════════════════════════════════════════════
                         PHASE 15: SECURITY + COMPLIANCE [MVPv1] (3 Waves)
════════════════════════════════════════════════════════════════════════════════════════

OBJECTIVE: Harden platform controls for privacy, abuse prevention, and audit integrity.
GATE: Internal security/compliance review passes with evidence.

────────────────────────────────────────────────────────────────────────────────────────
WAVE COORDINATION (Phase 15)
────────────────────────────────────────────────────────────────────────────────────────

┌─────────┬─────────────────────────────────────────────────────────────────────────────┐
│  Wave   │ Scope                                                                       │
├─────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 15.A    │ Security controls (secrets, PII boundaries, access logs) [MVPv1]                    │
│ 15.B    │ Abuse/integrity controls (spam, fake reviews, scraping, rate limits) [MVPv1]        │
│ 15.C    │ Compliance checklist and control evidence package [MVPv1]                            │
└─────────┴─────────────────────────────────────────────────────────────────────────────┘

VERIFICATION GATE (Phase 15):
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Public marketplace/private workspace data boundaries verified                        │
│ Audit log tamper checks and retention boundaries documented                          │
└─────────────────────────────────────────────────────────────────────────────────────┘

════════════════════════════════════════════════════════════════════════════════════════
                         PHASE 16: TESTING + QA [MVPv1] (3 Waves)
════════════════════════════════════════════════════════════════════════════════════════

OBJECTIVE: Ensure reliability for core conversion and trust-critical behaviors.
GATE: Team can ship without breaking auth, state machine, attribution, or funnel loop.

────────────────────────────────────────────────────────────────────────────────────────
WAVE COORDINATION (Phase 16)
────────────────────────────────────────────────────────────────────────────────────────

┌─────────┬─────────────────────────────────────────────────────────────────────────────┐
│  Wave   │ Scope                                                                       │
├─────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 16.A    │ Unit + integration tests (auth/RLS/state machine/fees) [MVPv1]                     │
│ 16.B    │ E2E tests for marketplace conversion loop [MVPv1]                                   │
│ 16.C    │ Performance/reliability smoke tests [MVPv1]                                         │
└─────────┴─────────────────────────────────────────────────────────────────────────────┘

VERIFICATION GATE (Phase 16):
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Test suite passes in CI with stable thresholds                                       │
│ Search and booking performance smoke checks within target range                      │
└─────────────────────────────────────────────────────────────────────────────────────┘

════════════════════════════════════════════════════════════════════════════════════════
                         PHASE 17: DEPLOYMENT + LAUNCH + COLD-START [MVPv1] (4 Waves)
════════════════════════════════════════════════════════════════════════════════════════

OBJECTIVE: Launch production with liquidity operations and support workflows active.
GATE: Real advisors onboarded, live demand tests running, liquidity measurable weekly.

────────────────────────────────────────────────────────────────────────────────────────
WAVE COORDINATION (Phase 17)
────────────────────────────────────────────────────────────────────────────────────────

┌─────────┬─────────────────────────────────────────────────────────────────────────────┐
│  Wave   │ Scope                                                                       │
├─────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 17.A    │ Production deployment + monitoring + rollback plan [MVPv1]                          │
│ 17.B    │ Supply onboarding operations (founding advisors, concierge setup) [MVPv1]           │
│ 17.C    │ Demand acquisition operations (SEO pages, partner channels, referrals) [MVPv1]      │
│ 17.D    │ Quality controls + support/dispute handling [MVPv1]                                 │
└─────────┴─────────────────────────────────────────────────────────────────────────────┘

VERIFICATION GATE (Phase 17):
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Liquidity KPI tracked weekly: bookings/leads, acceptance, response, show-up         │
│ Support workflow active for booking issues, disputes, and verification appeals       │
└─────────────────────────────────────────────────────────────────────────────────────┘

════════════════════════════════════════════════════════════════════════════════════════
IMPLEMENTATION CHECKLIST (MASTER_PLAN DISCIPLINE)
════════════════════════════════════════════════════════════════════════════════════════

Each phase closes only when:
• Output artifact is complete and reviewed
• Gate evidence is recorded
• Next-phase dependencies are unblocked
• Non-goals remain excluded

Parallelization guardrails:
• Never parallelize same-file edits, migrations with ordering, or env/secret changes
• Parallelize by bounded domains (schema/API/UI/docs/tests) with clear ownership
• Use single orchestrator for merge points and gate approvals
