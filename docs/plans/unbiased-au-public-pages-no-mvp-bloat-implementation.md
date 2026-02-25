# Unbiased-Inspired AU Public Pages Implementation (No-MVP-Bloat)

## Document Control
- Date: 2026-02-25
- Status: In progress
- Workspace: `/Users/ceazar/Code Base/advyser`
- Owner: Product/Frontend

## Objective
Implement a lean, AU-adapted refresh of seven public routes:
1. `/about`
2. `/contact`
3. `/help`
4. `/privacy`
5. `/terms`
6. `/cookies`
7. `/disclaimer`

The focus is trust framing, support clarity, and policy consistency without adding enterprise-style complexity.

## Overlap Handled During Implementation
While implementing this plan, we also applied the overlapping auth-gate requirement from
`/Users/ceazar/Code Base/advyser/docs/plans/auth-restoration-mvp-contact-gate`:
1. Restored auth entry routes (`/login`, `/signup`, `/verify`, `/forgot-password`, `/reset-password`, `/auth/callback`).
2. Re-enabled auth routes in middleware.
3. Added `AuthProvider` to the root app shell.
4. Updated auth redirect defaults for consumer users (`/` instead of `/dashboard`).
5. Gated adviser contact details at API + UI.
6. Enforced authenticated-only lead submission for `/api/leads` and `/api/match-requests`.

## Guardrails (No Bloat)
1. Keep existing route structure.
2. Avoid CMS migration and live chat tooling.
3. Keep API additions minimal (single lightweight support endpoint).
4. Use existing layout and UI primitives.

## Scope Summary

### Foundation
1. Add shared legal page shell for consistent policy headers and in-page navigation.
2. Add policy metadata constants (`lastUpdated`, `version`, `owner`).
3. Extend `publicBusiness` config for media/complaints/legal/support-hour fields.
4. Add cookie consent utility layer and aligned controls.

### Contact + Help
1. Build segmented contact pathways (`Consumers`, `Advisers`, `Media/Legal`).
2. Add minimal support form backed by `POST /api/support/contact`.
3. Expand help to high-intent FAQs and actionable category links.
4. Add explicit complaint escalation guidance with AFCA/ASIC pathways.

### Legal Pages
1. Refactor privacy/terms/cookies/disclaimer with common shell.
2. Add plain-English summaries, better scanability, and section anchors.
3. Ensure contact details come from shared config.
4. Align cookie policy with actual runtime behavior.

### About
1. Replace placeholder-heavy content with trust-process framing.
2. Keep hero + how-it-works + mission while removing fake team grid.
3. Add dated capability snapshot and low-risk proof points.

## Implementation Files

### Added
1. `/Users/ceazar/Code Base/advyser/site/src/lib/cookie-consent.ts`
2. `/Users/ceazar/Code Base/advyser/site/src/lib/policy-meta.ts`
3. `/Users/ceazar/Code Base/advyser/site/src/lib/support-contact.ts`
4. `/Users/ceazar/Code Base/advyser/site/src/components/composite/legal-page-shell.tsx`
5. `/Users/ceazar/Code Base/advyser/site/src/components/composite/cookie-preferences-controls.tsx`
6. `/Users/ceazar/Code Base/advyser/site/src/app/contact/contact-page-client.tsx`
7. `/Users/ceazar/Code Base/advyser/site/src/app/help/help-page-client.tsx`
8. `/Users/ceazar/Code Base/advyser/site/src/app/api/support/contact/route.ts`

### Modified
1. `/Users/ceazar/Code Base/advyser/site/src/lib/public-business.ts`
2. `/Users/ceazar/Code Base/advyser/site/src/components/composite/cookie-consent.tsx`
3. `/Users/ceazar/Code Base/advyser/site/src/app/about/page.tsx`
4. `/Users/ceazar/Code Base/advyser/site/src/app/contact/page.tsx`
5. `/Users/ceazar/Code Base/advyser/site/src/app/help/page.tsx`
6. `/Users/ceazar/Code Base/advyser/site/src/app/privacy/page.tsx`
7. `/Users/ceazar/Code Base/advyser/site/src/app/terms/page.tsx`
8. `/Users/ceazar/Code Base/advyser/site/src/app/cookies/page.tsx`
9. `/Users/ceazar/Code Base/advyser/site/src/app/disclaimer/page.tsx`

## Acceptance Checklist
1. All 7 routes have route-specific metadata.
2. Contact form submits successfully to `/api/support/contact`.
3. Help search has a no-results state.
4. Cookie policy references real runtime storage and includes preference controls.
5. Legal pages share a consistent shell and section-anchor structure.
6. No hardcoded public contact addresses/emails inside those seven route files.

## Verification Plan
1. Run lint/tests/build checks for touched routes and API.
2. Run React Doctor after UI changes.
3. Manually smoke-test:
   - `/contact` form submit success/error states
   - `/help` search + no-results
   - `/cookies` preference toggles + banner behavior
   - legal page anchor navigation

## Notes
1. Final legal wording remains subject to legal/compliance sign-off.
2. This implementation intentionally avoids adding CMS, ticketing integrations, or support automation.
