# A) EXECUTIVE MAP

## Scope and boundary
- Target product is Fresha beauty/wellness marketplace + business OS on `fresha.com` and `partners.fresha.com`; operational/policy detail comes from Help Center and Terms domains. Sources: https://www.fresha.com/, https://partners.fresha.com/users/sign-up?lang=en-US&from=fresha, https://www.fresha.com/help-center/get-support, https://www.terms.fresha.com/terms-of-service
- `fresha.com.au` appears to be an unrelated beverage distribution site, so it is excluded from the replica target. Source: https://fresha.com.au/

## Product map (high-level)
1. Consumer Marketplace (C1)
- Discovery/search, geo/category landing pages, venue detail pages, booking entry points, app install paths. Sources: https://www.fresha.com/search, https://www.fresha.com/sitemap, https://www.fresha.com/lp/en/bt/beauty-salons/in/au-sydney, https://www.fresha.com/es/a/brighton-wellness-hub-brighton-uk-113a-st-james-street-r6bnvkdr, https://apps.apple.com/us/app/fresha/id1297230801, https://play.google.com/store/apps/details?id=com.fresha.customer
2. Business SaaS (C2)
- Business marketing site, vertical pages, onboarding/auth, calendar/POS/payments/online profile controls, support workflows. Sources: https://www.fresha.com/for-business, https://www.fresha.com/for-business/salon, https://www.fresha.com/pricing, https://partners.fresha.com/users/sign-in?lang=en-US&from=fresha, https://www.fresha.com/help-center/knowledge-base/online-profile, https://www.fresha.com/help-center/knowledge-base/payments
3. Money + Attribution (C3)
- Marketplace client acquisition fees, payment processing, payouts/wallet/billing, no-show/late-cancel charging, refunds/chargebacks, external channel attribution. Sources: https://www.fresha.com/pricing, https://www.terms.fresha.com/marketplace-terms-of-service, https://www.terms.fresha.com/partner-terms-of-service, https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/create-and-manage-no-show-fees, https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/manage-disputes-and-chargebacks, https://www.fresha.com/help-center/knowledge-base/online-profile/track-meta-pixel-ads, https://www.fresha.com/help-center/knowledge-base/online-profile/manage-google-analytics

## System decomposition (build-ready)
- `Discovery Layer`: `/search`, `/lp/en/bt/...`, `/lp/en/tt/...`, venue pages `/a/...`.
- `Conversion Layer`: booking entry points from profile/Google/social/website button; policy-aware checkout (deposits, no-show fees, card-on-file).
- `Operations Layer`: workspace/team/services/calendar/POS/clients/marketing/payments modules.
- `Risk & Trust Layer`: profile verification, cancellation/no-show/refund/dispute controls, payment security controls.
- `Revenue Layer`: marketplace acquisition fee logic, payment processing revenue, capital product fee model.

## Agent orchestration summary
- `MARKETPLACE`: consumer discovery and booking surfaces, marketplace attribution surfaces.
- `BUSINESS_SAAS`: onboarding + operating-system capabilities for partners.
- `MONEY_FEES`: pricing, fee logic, billing cadence, payout/dispute mechanics.
- `HELP_CENTER_POLICIES`: no-show/cancellation/refund/chargeback and trust controls.
- `OBJECT_MODELER`: unified entities, states, and constraints.
- `INSTRUMENTATION`: proposed event taxonomy tied to C1/C2/C3.

## Gaps / unknowns
- Full authenticated booking checkout flow (exact screen-by-screen sequence) is partially blocked without live session, so checkout states are inferred from public help/terms plus public listing pages.
- Exact regional fee values are localized by market; rule logic is stable, but numeric rates vary by country/payment method at runtime.
