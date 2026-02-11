# Phase 3 Page Type Inventory

## Document control
- Version: v1.0
- Date: 2026-02-10
- Phase: 3 (Targeted Crawl + Replica Spec Pack)
- Plan reference: `/Users/ceazar/Code Base/advyser/plans/Master-Plan-v2.md`

## Scope rule
Prioritize load-bearing MVPv1 screen types only (10-20), with enough detail to drive schema/API/UI sequencing in Phase 4.

## Prioritized screen types (16)

| ID | Route | Primary role | Primary CTA | Inputs | Outputs | Core components | Core objects | Constraints/rules | Required events |
|---|---|---|---|---|---|---|---|---|---|
| P3-01 | `/search` | Visitor/Client | `View profile` | location, intent, source params | ranked advisor cards | search bar, filter chips, result cards, pagination | `AdvisorProfile`, `AdvisoryOffer`, `LeadSource` | wedge intents only (`fhb`, `refinance`); geo relevance required | `list_viewed` |
| P3-02 | `/category/[type]` | Visitor/Client | `Open advisor` | category slug, location | categorized result set | category hero, SEO copy block, result cards | `AdvisorProfile`, `AdvisoryOffer` | category must map to wedge offer taxonomy | `list_viewed` |
| P3-03 | `/advisors/[slug]` | Visitor/Client | `Request a call` | advisor slug | trust-forward advisor profile | trust blocks, disclosure panel, offer list, CTA module | `AdvisorProfile`, `TrustDisclosure`, `AdvisoryOffer` | hidden if advisor status != `published`; disclosure required before CTA | `profile_opened`, `shortlist_rendered` |
| P3-04 | `/request-intro` | Client | `Submit request` | intent, postcode, timeframe, contact, consent, attribution | lead record + confirmation payload | lead form, consent checkbox, validation, submit state | `Lead`, `LeadSource`, `LeadAttributionSnapshot` | consent must be true; attribution fields required; spam guard | `lead_form_started`, `lead_submitted` |
| P3-05 | `/dashboard/requests` | Client | `Open request` | auth context, request filters | request list | status cards, list table, empty state | `Lead`, `LeadLifecycleEvent` | user can view only own leads | `lead_manage_viewed` |
| P3-06 | `/dashboard/requests/[id]` | Client | `View status` | request id | lifecycle timeline snapshot | timeline, status badge, next-step hints | `Lead`, `LeadLifecycleEvent` | no advisor private notes exposed | `lead_manage_viewed` |
| P3-07 | `/advisor/onboarding` | Advisor | `Continue setup` | profile basics, service area, specialties, SLA | onboarded advisor draft profile | wizard steps, validation, save/resume | `AdvisorProfile`, `AdvisoryOffer`, `TrustDisclosure` | cannot publish without disclosure + SLA | `advisor_onboarding_completed` |
| P3-08 | `/advisor/profile` | Advisor | `Publish profile` | profile edits, credentials, disclosures, offer config | published/paused profile state | profile editor, trust evidence uploader, publish toggle | `AdvisorProfile`, `TrustDisclosure`, `AdvisoryOffer` | publish requires mandatory trust fields | `advisor_profile_published` |
| P3-09 | `/advisor/leads` | Advisor | `Open lead` | auth context, lead filters | assigned lead queue | lead queue table, SLA indicator, quick actions | `Lead`, `LeadLifecycleEvent` | assignment scoped to firm/advisor permissions | `advisor_lead_viewed` |
| P3-10 | `/advisor/leads/[id]` | Advisor | `Respond now` | lead id, response action, notes, outcome | response and lifecycle update | lead detail panel, response composer, outcome controls | `Lead`, `LeadLifecycleEvent` | response timestamp drives SLA; state transitions must be valid | `advisor_responded`, `contact_confirmed`, `call_scheduled` |
| P3-11 | `/admin/claims` | Admin/Staff | `Review claim` | claim filters, moderation queue | prioritized claim list | queue table, risk flags, assignee controls | `ClaimCase`, `AdvisorProfile` | staff cannot apply global policy changes | `claim_queue_viewed` |
| P3-12 | `/admin/claims/[id]` | Admin/Staff | `Approve` / `Reject` | claim evidence, reviewer decision, reason code | claim decision + audit entry | evidence viewer, decision form, audit timeline | `ClaimCase`, `TrustDisclosure`, `AuditLog` | decision reason mandatory; immutable audit write | `claim_reviewed` |
| P3-13 | `/admin/listings` | Admin/Staff | `Pause listing` | listing id, policy reason | listing moderation action | listing queue, moderation controls, bulk actions | `AdvisorProfile`, `AuditLog` | pause/unpause must persist actor + reason | `listing_moderated` |
| P3-14 | `/advisor/billing` | Advisor | `Open statement` | billing period, tier context | statement summary and line items | billing summary, statement rows, dispute entrypoint | `BillingStatement`, `StatementLineItem`, `FeeAssessment` | must expose new-client and dedupe decisions per line | `statement_viewed`, `dispute_opened` |
| P3-15 | `/login` | Visitor/Advisor/Client/Admin | `Sign in` | email, password | authenticated session | login form, role routing guard | `UserAccount`, `Session` | brute-force protection + role-based redirect | `auth_login_succeeded`, `auth_login_failed` |
| P3-16 | `/signup` | Visitor/Advisor/Client | `Create account` | identity, email verification intent, role path | pending verified account | signup form, verification prompt | `UserAccount`, `VerificationToken` | verification required before privileged actions | `auth_signup_started`, `auth_signup_completed` |

## Phase 3 stop condition check
1. Screen count is within required range (`16`, target `10-20`).
2. Every screen defines role, CTA, inputs/outputs, components, objects, constraints, and events.
3. Coverage includes marketplace (`P3-01` to `P3-06`), advisor ops (`P3-07` to `P3-10`), money/transparency (`P3-14`), trust/admin controls (`P3-11` to `P3-13`), and auth entry points (`P3-15` to `P3-16`).
