# Route Decision Matrix (Selective Rebuild)

## Document control
- Version: v1.0
- Date: 2026-02-10
- Phase alignment: 1 -> 10
- Readiness enum: `reuse | refactor | rebuild | defer | remove`

## Purpose
Single source of truth for how each route group should be handled in the selective rebuild strategy.

## Matrix
| Route group | Readiness | Why | Build window |
|---|---|---|---|
| `/search` | rebuild | Core Fresha-like discovery surface; currently mock-driven | Phase 10.A |
| `/advisors/[slug]` | rebuild | Core trust + conversion profile; currently mock-driven | Phase 10.A/10.C |
| `/request-intro` | rebuild | Core conversion flow aligned to qualified lead schema | Phase 10.A |
| `/category/[type]` | rebuild | SEO landing parity and discovery amplification | Phase 10.A |
| `/` | rebuild | Needs Fresha-style funnel entry and wedge messaging | Phase 10.A |
| `/for-advisors` | refactor | Keep shell, update narrative and conversion mechanics | Phase 10.B |
| `/advisor/onboarding` | rebuild | Core advisor publish path | Phase 10.B |
| `/advisor/profile` | rebuild | Trust/disclosure + services + CTA visibility | Phase 10.B/10.C |
| `/advisor/leads` | rebuild | Lead intake + triage loop is conversion critical | Phase 10.B |
| `/advisor/leads/[id]` | rebuild | Lead response and lifecycle transitions | Phase 10.B |
| `/admin/claims` | refactor | Existing shell; replace mock with moderation data | Phase 10.C |
| `/admin/claims/[id]` | refactor | Existing shell; replace mock with moderation data | Phase 10.C |
| `/admin/listings` | refactor | Required trust/quality moderation surface | Phase 10.C |
| `/login` | reuse | Functional auth path exists; visual alignment only | Phase 6.A + 10 polish |
| `/signup` | reuse | Functional auth path exists; visual alignment only | Phase 6.A + 10 polish |
| `/verify` | reuse | Functional auth path exists; visual alignment only | Phase 6.A + 10 polish |
| `/forgot-password` | reuse | Functional auth path exists; visual alignment only | Phase 6.A + 10 polish |
| `/reset-password` | reuse | Functional auth path exists; visual alignment only | Phase 6.A + 10 polish |
| `/auth/callback/route.ts` | reuse | Functional callback path exists | Phase 6.A |
| `/dashboard*` | defer | Not required for first wedge conversion proof | Phase 11+ |
| `/advisor/messages` | defer | Mock-heavy and non-critical for first conversion loop | Phase 11-12 |
| `/advisor/bookings` | defer | Scheduling depth not MVPv1 critical | Phase 11-12 |
| `/advisor/team` | defer | Team depth after single-advisor loop | Phase 11-12 |
| `/advisor/clients*` | defer | Relationship workspace depth follows conversion core | Phase 11-12 |
| `/advisor/settings` | defer | Non-critical for first conversion proof | Phase 11-12 |
| `/advisor/billing` | defer | Monetization depth phase-gated later | Phase 11-12 |
| `/admin/reviews` | defer | Review depth beyond baseline trust launch | Phase 11+ |
| `/admin/categories` | defer | Admin taxonomy depth later | Phase 11+ |
| `/admin/reports` | defer | Reporting depth after core loop instrumentation | Phase 11+ |
| `/admin/analytics` | defer | Advanced analytics after baseline instrumentation | Phase 11+ |
| `/components` | remove | Dev-only showcase route | Phase 10 cleanup |
| `/design-system` | remove | Dev-only showcase route | Phase 10 cleanup |
| `/privacy` | reuse | Legal/support keep with copy refresh only | Phase 10 polish |
| `/terms` | reuse | Legal/support keep with copy refresh only | Phase 10 polish |
| `/cookies` | reuse | Legal/support keep with copy refresh only | Phase 10 polish |
| `/disclaimer` | reuse | Legal/support keep with copy refresh only | Phase 10 polish |
| `/help` | reuse | Legal/support keep with copy refresh only | Phase 10 polish |
| `/contact` | reuse | Legal/support keep with copy refresh only | Phase 10 polish |
| `/about` | reuse | Legal/support keep with copy refresh only | Phase 10 polish |
| `/press` | reuse | Legal/support keep with copy refresh only | Phase 10 polish |
| `/careers` | reuse | Legal/support keep with copy refresh only | Phase 10 polish |
| `/resources` | reuse | Legal/support keep with copy refresh only | Phase 10 polish |

## Agent cutover controls
1. Core loop route cannot cut over unless its required DTO contracts are implemented.
2. Core loop route cannot cut over if local `mock*` data still feeds conversion UI.
3. Any route marked `defer` cannot be rebuilt before all `rebuild` routes in Phase 10 are complete.
4. Route status changes require a single commit note with reason and phase impact.

## Critical path cutover order (Phase 10)
1. `/search`
2. `/advisors/[slug]`
3. `/request-intro`
4. `/advisor/leads`
5. `/advisor/leads/[id]`
6. `/admin/claims` and `/admin/claims/[id]`
7. `/admin/listings`

