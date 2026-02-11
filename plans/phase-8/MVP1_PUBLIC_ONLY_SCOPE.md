# MVP1 Public-Only Scope

## Document control
- Version: v1.0
- Date: 2026-02-11
- Owner phase: `8 (Database + Data Layer)`
- Related plan: `/Users/ceazar/Code Base/advyser/plans/Master-Plan-v2.md`

## Purpose
Define the exact MVP1 surface after hard-pruning non-public portal/auth/dev routes to prevent scope bloat and keep delivery focused on public marketplace value.

## In-scope (kept routes)
Public marketplace/support routes currently retained in `/Users/ceazar/Code Base/advyser/site/src/app`:

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

Shared app shell files retained:
- `/Users/ceazar/Code Base/advyser/site/src/app/layout.tsx`
- `/Users/ceazar/Code Base/advyser/site/src/app/not-found.tsx`
- `/Users/ceazar/Code Base/advyser/site/src/app/loading.tsx`
- `/Users/ceazar/Code Base/advyser/site/src/app/error.tsx`

## Out-of-scope (hard-pruned route groups)
Removed from app routing surface:

1. Consumer dashboard: `/dashboard/*`
2. Advisor portal: `/advisor/*`
3. Admin portal: `/admin/*`
4. Claim flow: `/claim/*`
5. Auth flows: `/login`, `/signup`, `/verify`, `/forgot-password`, `/reset-password`, `/auth/*`
6. Dev docs pages: `/components`, `/design-system`
7. Legacy leads support route: `/leads/*`

## Guard behavior
Even after physical prune, middleware continues to redirect any legacy deep links from removed prefixes to `/`:
- `/Users/ceazar/Code Base/advyser/site/src/middleware.ts`

## Scope intent
This scope intentionally optimizes for MVP1 discovery + trust + conversion-entry pages only.
Portal workflows (advisor/admin/dashboard/auth/claim operations) are deferred for later reintroduction as phase-gated work.
