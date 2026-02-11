# MVP1 Public-Only Recovery Runbook

## Document control
- Version: v1.0
- Date: 2026-02-11
- Owner phase: `8 (Database + Data Layer)`

## Purpose
Provide deterministic restore paths for reintroducing pruned non-public routes when later phase gates require them.

## Recovery source
Primary reference branch:
- `codex/non-public-backup-20260211`

## Recovery options

### Option A — Restore all pruned app routes
```bash
git checkout codex/non-public-backup-20260211 -- site/src/app
```

Use when you need full advisor/admin/dashboard/auth/claim route trees back at once.

### Option B — Restore selected route group only
Examples:
```bash
git checkout codex/non-public-backup-20260211 -- site/src/app/advisor
git checkout codex/non-public-backup-20260211 -- site/src/app/login
git checkout codex/non-public-backup-20260211 -- site/src/app/dashboard
```

Use when sequencing reintroduction by phase/wave.

### Option C — Restore support files tied to non-public flows
Examples:
```bash
git checkout codex/non-public-backup-20260211 -- site/src/middleware.ts
git checkout codex/non-public-backup-20260211 -- site/src/app/layout.tsx
git checkout codex/non-public-backup-20260211 -- site/src/components/layout/public-header.tsx
git checkout codex/non-public-backup-20260211 -- site/src/components/layout/public-footer.tsx
```

Use when reactivated routes require auth/session navigation behavior again.

## Post-restore verification checklist
1. `npm run test:run`
2. `npm run lint`
3. `npm run build`
4. If DB/API-coupled paths are restored, run phase gate verifiers as needed:
   - `npm run verify:phase6`
   - `npm run verify:phase7`
   - `npm run verify:phase8`

## Governance note
Do not restore non-public routes ad hoc. Tie restoration to explicit phase scope (typically Phase 9/10+ API/UI integration milestones) and update:
- `/Users/ceazar/Code Base/advyser/plans/Master-Plan-v2.md`
- `/Users/ceazar/Code Base/advyser/plans/MVP_TRACK_STATUS.md`
