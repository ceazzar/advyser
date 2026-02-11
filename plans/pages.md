# Advyser Route Inventory (Current Runtime)

## Document control
- Version: v3.0
- Date: 2026-02-11
- Source of truth for current app routes: `/Users/ceazar/Code Base/advyser/site/src/app`
- Related phase docs:
  - `/Users/ceazar/Code Base/advyser/plans/phase-8/MVP1_PUBLIC_ONLY_SCOPE.md`
  - `/Users/ceazar/Code Base/advyser/plans/phase-8/MVP1_PUBLIC_ONLY_PRUNE_LOG.md`
  - `/Users/ceazar/Code Base/advyser/plans/phase-8/MVP1_PUBLIC_ONLY_RECOVERY_RUNBOOK.md`

## Current route surface
Current production runtime is intentionally `MVP1 public-only` and compiles to 20 app routes.

## Public marketplace + support routes (active)
1. `/`
2. `/about`
3. `/advisor-resources`
4. `/advisors/[slug]`
5. `/careers`
6. `/category/[type]`
7. `/contact`
8. `/cookies`
9. `/disclaimer`
10. `/for-advisors`
11. `/help`
12. `/how-it-works`
13. `/press`
14. `/privacy`
15. `/quiz`
16. `/request-intro`
17. `/resources`
18. `/search`
19. `/terms`

## System app routes (framework)
1. `/_not-found`

## Hard-pruned route groups (not in runtime)
1. `/dashboard/*`
2. `/advisor/*`
3. `/admin/*`
4. `/claim/*`
5. `/login`, `/signup`, `/verify`, `/forgot-password`, `/reset-password`, `/auth/*`
6. `/components`, `/design-system`
7. `/leads/*`

## Historical note
Older phase specs (Phase 1 to Phase 4) include broader route inventories used for planning and sequencing.
Current runtime scope is governed by the Phase 8 public-only docs listed above.
