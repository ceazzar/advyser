# C) CORE FLOW MAPS

## C1) Consumer flow (Marketplace)
1. Enter discovery surface
- User enters via `/search`, category/location landing pages, or app-store channels. Sources: https://www.fresha.com/search, https://www.fresha.com/lp/en/bt/beauty-salons/in/au-sydney, https://www.fresha.com/lp/en/tt/facials/in/au-sydney, https://apps.apple.com/us/app/fresha/id1297230801
2. Browse venue profile
- User lands on venue page with service and booking CTA context. Source: https://www.fresha.com/es/a/brighton-wellness-hub-brighton-uk-113a-st-james-street-r6bnvkdr
3. Choose booking channel
- Booking can be initiated through marketplace profile, Google surfaces, Facebook/Instagram, or a website book button. Sources: https://www.fresha.com/help-center/knowledge-base/online-profile/get-bookings-from-google-search-and-maps, https://www.fresha.com/help-center/knowledge-base/online-profile/set-up-bookings-with-facebook-and-instagram, https://www.fresha.com/help-center/knowledge-base/online-profile/add-a-book-button-to-website
4. Checkout and payment policy enforcement
- Business can apply no-show fee and late-cancel charging based on configured policies and payment settings. Sources: https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/create-and-manage-no-show-fees, https://www.terms.fresha.com/terms-of-service
5. Post-booking lifecycle
- Possible branches: completed, cancelled, no-show, refunded, disputed. Sources: https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/refund-options-for-payments-and-vouchers, https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/manage-disputes-and-chargebacks

Extracted C1 objects/rules
- `Client` classification includes new-vs-returning logic for marketplace fee attribution (12-month lookback). Source: https://www.terms.fresha.com/marketplace-terms-of-service
- `Booking` can accrue cancellation/no-show charges under policy constraints. Sources: https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/create-and-manage-no-show-fees, https://www.terms.fresha.com/terms-of-service

C1 gaps
- Exact unauthenticated checkout URL/state machine is inferred from public policy/help documents.

## C2) Business flow (SaaS operator)
1. Acquire and onboard
- Business starts on `/for-business` and creates account on partners auth pages. Sources: https://www.fresha.com/for-business, https://partners.fresha.com/users/sign-up?lang=en-US&from=fresha
2. Configure workspace operations
- Configure services, team, bookings, clients, and checkout tooling via business product modules/help categories. Sources: https://www.fresha.com/for-business/salon, https://www.fresha.com/help-center/get-support, https://www.fresha.com/help-center/knowledge-base/team
3. Enable payments and selling controls
- Set up payments, cards-on-file behaviors, and checkout controls; use card terminals/online processing flows. Sources: https://www.fresha.com/payments, https://www.fresha.com/help-center/knowledge-base/payments
4. Publish and optimize online profile
- Create profile, verify profile, manage visibility, and connect acquisition channels. Sources: https://www.fresha.com/help-center/knowledge-base/online-profile, https://www.fresha.com/help-center/knowledge-base/online-profile/verify-online-profile, https://www.fresha.com/help-center/knowledge-base/online-profile/manage-online-profile-visibility
5. Run daily operations
- Execute bookings/POS/refunds/disputes/no-show handling and monitor business outcomes. Sources: https://www.fresha.com/help-center/knowledge-base/sales-and-checkout, https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/process-refunds, https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/manage-disputes-and-chargebacks

Extracted C2 objects/rules
- `Workspace` is the anchor entity for team, catalog, profile, and payment configuration. Sources: https://partners.fresha.com/users/sign-up?lang=en-US&from=fresha, https://www.fresha.com/help-center/get-support
- `Team member` entities are managed explicitly and can be scheduled/paid out in operations. Sources: https://www.fresha.com/help-center/get-support, https://www.fresha.com/payments

C2 gaps
- Fine-grained role names and post-login permission toggles are only partially visible publicly.

## C3) Money + attribution flow
1. Attribution capture
- Profile traffic and booking conversion can be attributed from marketplace, Google, Meta, and website channels. Sources: https://www.fresha.com/help-center/knowledge-base/online-profile/get-bookings-from-google-search-and-maps, https://www.fresha.com/help-center/knowledge-base/online-profile/track-meta-pixel-ads, https://www.fresha.com/help-center/knowledge-base/online-profile/manage-google-analytics, https://www.fresha.com/help-center/knowledge-base/online-profile/add-a-book-button-to-website
2. Booking classification
- Confirmed bookings are classified for monetization (new vs returning client for marketplace fees). Source: https://www.terms.fresha.com/marketplace-terms-of-service
3. Fee application
- Marketplace and payment fees are applied according to pricing/terms; policy charges may apply for no-show/late-cancel. Sources: https://www.fresha.com/pricing, https://www.terms.fresha.com/marketplace-terms-of-service, https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/create-and-manage-no-show-fees
4. Billing, settlement, payout
- Statements/invoices are generated on billing cycles with stated due windows; payouts and wallet operations occur in payment rails. Sources: https://www.terms.fresha.com/partner-terms-of-service, https://www.terms.fresha.com/marketplace-terms-of-service, https://www.fresha.com/help-center/knowledge-base/wallet
5. Exception handling
- Refunds, voids, and disputes/chargebacks route through dedicated workflows. Sources: https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/refund-options-for-payments-and-vouchers, https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/void-sales, https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/manage-disputes-and-chargebacks

Extracted C3 objects/rules
- `Invoice` due-window and suspension risk for unpaid balances. Sources: https://www.terms.fresha.com/partner-terms-of-service, https://www.terms.fresha.com/marketplace-terms-of-service
- `Capital advance` includes clear upfront capital fee and automatic repayment from sales flow. Source: https://www.fresha.com/for-business/features/capital

C3 gaps
- Exact payout timing matrix by region is not fully enumerated in publicly visible pages.
