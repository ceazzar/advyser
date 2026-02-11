# Advyser Documentation Index

Quick navigation for all project documentation.

---

## 📁 Folder Structure

```
docs/
├── specs/        → Feature specifications and design docs
├── technical/    → Engineering and implementation docs
├── design/       → UI/UX reference and design system
├── compliance/   → AU regulatory and audit docs
├── business/     → GTM, pricing, and growth docs
├── operations/   → Roadmaps and status tracking
└── archive/      → Historical reference (superseded docs)
```

---

## 🎯 Quick Links

### Feature Specifications (`specs/`)
- [verification](specs/verification) — Advisor claim, verification, and re-verification
- [copilot-spec](specs/copilot-spec) — AI Copilot feature specification
- [copilot-decisions](specs/copilot-decisions) — Copilot implementation decisions
- [search-ranking](specs/search-ranking) — Search algorithm and ranking factors
- [data-lifecycle](specs/data-lifecycle) — Data retention and lifecycle policies

### Technical (`technical/`)
- [demo-auth.md](technical/demo-auth.md) — Demo authentication system (dev only)
- [database-schema](technical/database-schema) — PostgreSQL schema documentation
- [context-overview](technical/context-overview) — System context and architecture

### Design (`design/`)
- [website-references](design/website-references) — Locked 3-site component matrix (Wise, Mercury, N26)
- [wise-design-patterns](design/wise-design-patterns) — Primary design reference
- [research](design/research) — Multi-site design analysis

### Compliance (`compliance/`)
- [platform-review-summary](compliance/platform-review-summary) — Security and compliance audit

### Business (`business/`)
- [monetization-model](business/monetization-model) — Pricing and revenue model
- [cold-start-playbook](business/cold-start-playbook) — Marketplace launch strategy

### Operations (`operations/`)
- [roadmap-v1](operations/roadmap-v1) — Implementation status and roadmap

### Fresha Translation (`fresha/` + `../plans/phase-*`)
- [FINAL_REPLICA_SPEC_PACK.md](fresha/FINAL_REPLICA_SPEC_PACK.md) — Source Fresha replica research pack
- [PHASE_1_REPLICA_SPEC.md](../plans/phase-1/PHASE_1_REPLICA_SPEC.md) — Phase 1 translation spec (entities/roles/funnels)
- [PHASE_1_MVP_SCOPE_STATEMENT.md](../plans/phase-1/PHASE_1_MVP_SCOPE_STATEMENT.md) — MVPv1 in-scope/out-of-scope freeze
- [ROUTE_DECISION_MATRIX.md](../plans/phase-1/ROUTE_DECISION_MATRIX.md) — Keep/refactor/rebuild/defer/remove route governance
- [SELECTIVE_REBUILD_EXECUTION_RUNBOOK.md](../plans/phase-1/SELECTIVE_REBUILD_EXECUTION_RUNBOOK.md) — Phase 4-10 execution checklist and cutover controls
- [PHASE_1_GATE_EVIDENCE.md](../plans/phase-1/PHASE_1_GATE_EVIDENCE.md) — Phase 1 verification gate evidence and pass decision
- [PHASE_2_MONETIZATION_DECISION_DOC.md](../plans/phase-2/PHASE_2_MONETIZATION_DECISION_DOC.md) — Phase 2 monetization model lock and computed scenarios
- [PHASE_2_ATTRIBUTION_SPEC.md](../plans/phase-2/PHASE_2_ATTRIBUTION_SPEC.md) — Phase 2 attribution logic and data capture rules
- [PHASE_2_GATE_EVIDENCE.md](../plans/phase-2/PHASE_2_GATE_EVIDENCE.md) — Phase 2 verification gate evidence and pass decision

### Archive (`archive/`)
- [schema-reconciliation-2026-02](archive/schema-reconciliation-2026-02) — Historical schema reconciliation

---

## 📊 Current Status

| Area | Status | Key Doc |
|------|--------|---------|
| Frontend UI | ~70% | [roadmap-v1](operations/roadmap-v1) |
| Backend API | 0% | Schema only |
| Authentication | Demo | [demo-auth.md](technical/demo-auth.md) |
| AU Compliance | Partial | [platform-review-summary](compliance/platform-review-summary) |
| AI Copilot | 0% | [copilot-spec](specs/copilot-spec) |

---

*Last updated: 2026-02-02*
