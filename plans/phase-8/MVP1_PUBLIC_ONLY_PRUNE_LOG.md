# MVP1 Public-Only Prune Log

## Document control
- Version: v1.0
- Date: 2026-02-11
- Owner phase: `8 (Database + Data Layer)`

## Change objective
Hard-prune non-public route groups to enforce a lean MVP1 scope and reduce implementation/testing surface area.

## Preservation reference
- Backup branch reference created before prune:
  - `codex/non-public-backup-20260211`

## Route-level changes (hard prune)
Deleted route directories under `/Users/ceazar/Code Base/advyser/site/src/app`:

1. `admin/`
2. `advisor/`
3. `auth/`
4. `claim/`
5. `components/`
6. `dashboard/`
7. `design-system/`
8. `forgot-password/`
9. `login/`
10. `reset-password/`
11. `signup/`
12. `verify/`
13. `leads/`

## Supporting code changes
1. Middleware simplified to legacy-prefix redirect only:
   - `/Users/ceazar/Code Base/advyser/site/src/middleware.ts`
2. Public header cleaned of login/dashboard/logout actions:
   - `/Users/ceazar/Code Base/advyser/site/src/components/layout/public-header.tsx`
3. Public footer cleaned of advisor-login link:
   - `/Users/ceazar/Code Base/advyser/site/src/components/layout/public-footer.tsx`
4. Root layout no longer wraps with `AuthProvider`:
   - `/Users/ceazar/Code Base/advyser/site/src/app/layout.tsx`
5. Route-prefix utility retained as lightweight helper:
   - `/Users/ceazar/Code Base/advyser/site/src/lib/mvp-mode.ts`
   - `/Users/ceazar/Code Base/advyser/site/src/lib/mvp-mode.test.ts`

## Validation results
Validation executed after prune:

1. `npm run test:run` -> pass
2. `npm run build` -> pass
3. `npm run lint` -> pass (warnings only, no errors)

Build route output confirms the app now compiles only public routes.
