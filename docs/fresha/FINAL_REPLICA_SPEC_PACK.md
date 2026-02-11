# FINAL REPLICA SPEC PACK

## A) EXECUTIVE MAP
- See detailed map: `/Users/ceazar/Code Base/advyser/docs/fresha/EXECUTIVE_MAP.md`
- Fresha replica should be built as three coupled systems: consumer marketplace (C1), business operating system (C2), and money/attribution engine (C3).
- Domain note: target is `fresha.com` ecosystem; `fresha.com.au` excluded as unrelated.

## B) IA INVENTORY (PAGE TYPES)
- See full inventory: `/Users/ceazar/Code Base/advyser/docs/fresha/IA_INVENTORY.md`
- Captured 20 core page types spanning discovery, listing, onboarding, pricing/payments/capital, help center modules, and legal terms.
- Stop-condition check: core page-type threshold met.

## C) CORE FLOW MAPS
- See full flow maps: `/Users/ceazar/Code Base/advyser/docs/fresha/FLOWS.md`
- C1 Consumer: discover -> listing -> booking channel -> policy-aware checkout -> completion/cancel/no-show/refund/dispute.
- C2 Business: acquire -> onboard workspace -> configure operations/payments -> publish/verify profile -> run and optimize.
- C3 Money/Attribution: channel attribution -> booking classification -> fee assessment -> billing/payout -> exception handling.
- Stop-condition check: C1/C2/C3 complete and internally consistent.

## D) DATA / OBJECT MODEL
- See full model: `/Users/ceazar/Code Base/advyser/docs/fresha/OBJECT_MODEL.md`
- Canonical objects: Workspace, TeamMember, Client, Service, OnlineProfile, Booking, Payment, NoShowFee, Refund, Dispute, Invoice, WalletPayout, AttributionTouchpoint, CapitalAdvance.
- States + constraints were normalized for build readiness.

## E) ROLE & PERMISSION MODEL
- See permission model: `/Users/ceazar/Code Base/advyser/docs/fresha/ROLES_PERMISSIONS.md`
- Proposed roles: WorkspaceOwner, WorkspaceAdmin, Manager, TeamMember, FinanceOperator, MarketingOperator.
- Module permissions are partitioned to reduce money/risk surface coupling.

## F) TRUST & QUALITY CONTROLS
- See control matrix: `/Users/ceazar/Code Base/advyser/docs/fresha/TRUST_QUALITY.md`
- Core controls: cancellation/no-show policy enforcement, refund/void correctness, dispute handling, payment security controls, profile verification, billing integrity.

## G) MONETIZATION DETAILS
- See full monetization rules: `/Users/ceazar/Code Base/advyser/docs/fresha/MONETIZATION.md`
- Precise rule set includes:
  - New-vs-returning client marketplace fee logic with 12-month lookback.
  - Marketplace fee assessed on confirmed bookings, not profile views.
  - Processing fees represented as locale-specific `% + fixed` formulas.
  - No-show/late-cancel monetization tied to policy eligibility.
  - Invoice due windows and overdue consequences.
  - Capital upfront fee and automatic repayment from sales.
- Stop-condition check: monetization section contains precise, source-cited rules.

## H) INSTRUMENTATION EVENTS
- See event taxonomy: `/Users/ceazar/Code Base/advyser/docs/fresha/INSTRUMENTATION.md`
- Event namespaces: `c1_*`, `c2_*`, `c3_*` tied directly to flow steps and money/attribution checkpoints.
- Includes required properties and suggested integrity controls.

## APPENDIX
- Full URL list and non-core/excluded pages: `/Users/ceazar/Code Base/advyser/docs/fresha/APPENDIX_URLS.md`

## Consolidated gaps/unknowns
- Authenticated workspace internals and full checkout step URLs require logged-in/runtime state.
- Regional pricing values are dynamic/localized; replica should externalize rate cards by market.

## Source anchors (primary)
- Consumer/discovery: https://www.fresha.com/, https://www.fresha.com/search, https://www.fresha.com/sitemap
- Business SaaS: https://www.fresha.com/for-business, https://www.fresha.com/pricing, https://www.fresha.com/payments, https://www.fresha.com/for-business/features/capital, https://partners.fresha.com/users/sign-up?lang=en-US&from=fresha
- Help/policies: https://www.fresha.com/help-center/get-support and linked knowledge-base articles
- Legal/commercial rules: https://www.terms.fresha.com/terms-of-service, https://www.terms.fresha.com/marketplace-terms-of-service, https://www.terms.fresha.com/partner-terms-of-service
- App channels: https://apps.apple.com/us/app/fresha/id1297230801, https://play.google.com/store/apps/details?id=com.fresha.customer
