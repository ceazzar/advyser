# Phase 6 Gate Evidence

## Document control
- Version: v1.1
- Date: 2026-02-11
- Phase: 6 (Authentication + Tenancy + RLS)
- Plan reference: `/Users/ceazar/Code Base/advyser/plans/Master-Plan-v2.md`

## Gate requirement
From Phase 6 gate:
1. All tables protected by RLS.
2. Server-side permissions mirror UI role guards.
3. Cross-tenant data access fails under crafted tests and direct attempts.

## Evidence mapping

### 1. All tables protected by RLS: PASS ✅
- Migration artifacts:
  - `/Users/ceazar/Code Base/advyser/site/supabase/migrations/20260211210000_phase6_auth_tenancy_rls.sql`
  - `/Users/ceazar/Code Base/advyser/site/supabase/migrations/20260211213000_phase6_rls_policy_fix.sql`
  - `/Users/ceazar/Code Base/advyser/site/supabase/migrations/20260211234000_phase6_security_hardening.sql`
- Verification command:
  - `npm run db:verify-phase6`
- Verification output snapshot:
  - `{"tables_checked":43,"rls_enabled_all_tables":true,"policy_presence_all_tables":true,...}`

### 2. Server-side permissions mirror role guards: PASS ✅
- Shared role redirect/path policy:
  - `/Users/ceazar/Code Base/advyser/site/src/lib/auth-routing.ts`
- Unit tests:
  - `/Users/ceazar/Code Base/advyser/site/src/lib/auth-routing.test.ts`
  - segment-boundary checks covered (`/dashboardevil`, `/advisory`, `/admin-tools`).

### 3. Cross-tenant protection assertions: PASS ✅
- Verification command:
  - `npm run db:verify-phase6`
- Crafted checks executed:
  - outsider cannot read another tenant lead
  - outsider cannot read another tenant conversation
  - outsider cannot insert lead for a different consumer
  - consumer cannot read foreign claim by deterministic ID
  - requester can read own claim by deterministic ID
  - admin can read foreign claim by deterministic ID
  - consumer cannot read or insert advisor internal notes
  - consumer cannot self-promote `public.users.role` to `admin`
  - advisor business-member access succeeds for protected records
  - anon catalog read works only for intended public surfaces

### End-to-end phase gate run: PASS ✅
- One-shot command:
  - `npm run verify:phase6`
- Chain includes:
  - env validation, migration push, seed, seed verification, phase6 RLS verification, lint, tests, build.

## Quality review notes
- Review-driven blockers remediated:
  - self role escalation closed via restricted `users` update grants/policies and role-mutation guard trigger.
  - advisor-note consumer access removed via business-member-only advisor note/revision policies.
  - verifier blind spots closed with deterministic claim/note fixtures and strict allow/deny assertions.
  - route-prefix confusion closed with segment-boundary path checks.
  - migration policy reset behavior narrowed to migration-owned policy names.
- Residual non-blocking debt:
  - Existing app lint warnings remain (0 lint errors).
  - Next.js middleware deprecation warning (`middleware` -> `proxy`) noted for future phase.
  - Build warns when Upstash packages are absent; runtime fallback logs and continues.

## Completion decision
- Phase 6 gate status: `PASS ✅` (`PHASE_GATE_COMPLETE`)
- Completion date: `2026-02-11`
- Next phase focus: `Phase 7 - Trust Launch`
- Closeout checklist:
  - `/Users/ceazar/Code Base/advyser/plans/phase-6/PHASE_6_CLOSEOUT_CHECKLIST.md`
