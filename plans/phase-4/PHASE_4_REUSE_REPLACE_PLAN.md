# Phase 4 Reuse/Replace Plan

## Document control
- Version: v1.0
- Date: 2026-02-10
- Phase: 4 (Gap Map + Build Sequencing)
- Readiness taxonomy: `reuse | refactor | rebuild | defer | remove`
- Primary input: `/Users/ceazar/Code Base/advyser/plans/phase-1/ROUTE_DECISION_MATRIX.md`

## Purpose
Lock asset-level treatment so engineering execution does not drift during Phases 5-10.

## Reuse/replace matrix

| Asset | Current state | Decision | Why | Target window | Blocking dependencies |
|---|---|---|---|---|---|
| `/login`, `/signup`, `/verify`, `/forgot-password`, `/reset-password` | Working auth baseline with Supabase + server actions | reuse | Functional for MVP baseline; needs hardening/polish, not rebuild | Phase 6.A + 10 polish | auth test coverage, rate-limit controls |
| `/auth/callback/route.ts` | Working code exchange and safe redirect checks | reuse | Core callback path already aligned with security baseline | Phase 6.A | callback flow tests |
| `/search` | UI exists with local mock data | rebuild | Load-bearing conversion route; requires live query + events | Phase 10.A | search API, ranking read model, RLS reads |
| `/category/[type]` | UI exists; currently static behavior | rebuild | SEO/discovery input to conversion funnel | Phase 10.A | category-to-offer mapping APIs |
| `/advisors/[slug]` | UI exists with mock advisor data | rebuild | Core trust + CTA route for conversion | Phase 10.A/10.C | profile API, trust/disclosure projection |
| `/request-intro` | Multi-step form with simulated submit | rebuild | Must become canonical `lead_submitted` write path | Phase 10.A | lead intake API, attribution + dedupe writes |
| `/dashboard/requests` + `/dashboard/requests/[id]` | UI exists with mock data | rebuild | Required manage-lite path in Phase 3 inventory | Phase 10.A | consumer lead list/detail API + RLS |
| `/advisor/onboarding` | UI form exists; no durable onboarding pipeline | rebuild | Required advisor publish entry point | Phase 10.B | onboarding API, trust prerequisites |
| `/advisor/profile` | UI exists with mock profile state | rebuild | Required publish + trust completeness flow | Phase 10.B/10.C | profile update/publish APIs |
| `/advisor/leads` + `/advisor/leads/[id]` | UI exists with mock queue/detail | rebuild | Core advisor response loop | Phase 10.B | lead queue/detail API + state machine |
| `/admin/claims` + `/admin/claims/[id]` | UI exists with mock moderation data | refactor | Shell is usable; needs live moderation reads/writes + audit | Phase 10.C | claims API, admin/staff policy, audit writes |
| `/admin/listings` | UI exists with mock listing moderation data | refactor | Shell is usable; needs live moderation actions + audit | Phase 10.C | listing moderation API, admin/staff policy |
| `/advisor/billing` | Route exists, not Phase 1 critical path | defer | Billing transparency tied to monetization depth | Phase 11-12 | fee assessment + statement models |
| `/dashboard/messages*`, `/dashboard/bookings` | Route family exists | defer | Not required for first conversion proof | Phase 11+ | messaging/booking API maturity |
| `/advisor/messages`, `/advisor/bookings`, `/advisor/team`, `/advisor/clients*`, `/advisor/settings` | Route family exists | defer | Beyond first conversion-critical loop | Phase 11-12 | lifecycle/integrations |
| `/admin/reviews`, `/admin/categories`, `/admin/reports`, `/admin/analytics` | Route family exists | defer | Post-core-loop operational depth | Phase 11+ | trust/analytics depth |
| `/components`, `/design-system` | Dev showcase routes | remove | Non-production surfaces | Phase 10 cleanup | none |
| `/privacy`, `/terms`, `/cookies`, `/disclaimer`, `/help`, `/contact`, `/about`, `/press`, `/careers`, `/resources` | Stable informational/legal pages | reuse | Keep live with copy updates only | Phase 10 polish | legal copy review |
| `database/schema.sql` | Broad schema baseline exists | refactor | Extend to Phase 3 object model deltas (attribution/fee/dispute/lifecycle events) | Phase 8 | migration sequencing + RLS |
| `database/migrations/001_auth_trigger_and_rls.sql` | RLS currently limited to users table | refactor | Expand to all critical tenant-scoped tables | Phase 6/8 | role matrix + policy tests |
| `site/src/lib/auth-actions.ts`, `site/src/lib/auth-context.tsx`, `site/src/middleware.ts` | Auth baseline implemented | reuse | Keep architecture; harden and test | Phase 6 | auth regression tests |
| Core API route layer (`site/src/app/api/*`) | Not present for core loop | rebuild | Needed for deterministic contracts and server-side enforcement | Phase 9 | schema + RLS + DTO contracts |
| Test harness (`vitest` config/setup) | Framework exists, tests absent | refactor | Keep framework, add comprehensive coverage | Phase 16 | seed fixtures + stable API contracts |

## Decision locks
1. `rebuild` routes do not ship until local mock dependencies are removed.
2. `defer` routes cannot block Phase 10 core-loop gate.
3. `reuse` assets can only change via hardening/polish scope unless explicitly reclassified in a gate-reviewed update.
