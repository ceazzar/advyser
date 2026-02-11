# G) MONETIZATION DETAILS

## Revenue surfaces
1. Marketplace acquisition fees
- Pricing/terms indicate a new-client acquisition fee model with returning-client logic. Sources: https://www.fresha.com/pricing, https://www.terms.fresha.com/marketplace-terms-of-service
2. Payments processing economics
- Payments product and pricing describe processing-rate model and checkout rails. Sources: https://www.fresha.com/payments, https://www.fresha.com/pricing
3. Capital financing fees
- Capital product describes upfront capital fee and automated repayments. Source: https://www.fresha.com/for-business/features/capital
4. Policy-driven collection (no-show / late cancellation)
- Businesses can charge policy-based no-show/late-cancel fees when configured. Sources: https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/create-and-manage-no-show-fees, https://www.terms.fresha.com/terms-of-service

## Rule table (replica-ready)
| Rule ID | Rule | Precision | Source |
|---|---|---|---|
| M01 | Marketplace charges apply on confirmed bookings, not profile views. | Binary condition | https://www.terms.fresha.com/marketplace-terms-of-service |
| M02 | Marketplace “new client” logic uses a 12-month lookback for prior appointments. | Time-window rule | https://www.terms.fresha.com/marketplace-terms-of-service |
| M03 | Returning clients are not charged marketplace acquisition fee under terms logic. | Binary condition | https://www.terms.fresha.com/marketplace-terms-of-service |
| M04 | Pricing page advertises one-time marketplace fee for new clients and states returning-client free model; observed public examples include `20% one-time fee` and `minimum $6` in USD locales. | Percentage + floor (locale-sensitive) | https://www.fresha.com/pricing |
| M05 | Card processing rates are market-localized on pricing; public examples are shown as rate+fixed component (e.g., in-person and online percentage + fixed amount). | Formula pattern: `% + fixed` | https://www.fresha.com/pricing |
| M06 | Payments product states no setup/subscription/surprise surcharge positioning and supports cards, wallets, and cards-on-file. | Product pricing posture | https://www.fresha.com/payments |
| M07 | No-show fee collection is policy-dependent and requires compliant payment setup/configuration. | Eligibility gating | https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/create-and-manage-no-show-fees |
| M08 | Refund route depends on original payment/voucher method and cannot be treated as arbitrary destination in all cases. | Refund routing constraint | https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/refund-options-for-payments-and-vouchers |
| M09 | Billing statements/invoices are periodic with due windows; overdue non-payment can trigger service restriction/suspension. | Billing lifecycle | https://www.terms.fresha.com/partner-terms-of-service, https://www.terms.fresha.com/marketplace-terms-of-service |
| M10 | Capital product uses a clear upfront capital fee and automatic repayment tied to sales flow, with option for early payoff. | Financing fee + repayment mechanics | https://www.fresha.com/for-business/features/capital |

## Money and attribution coupling
- Acquisition channel configuration (Google, Meta Pixel, website button) should feed booking attribution keys that determine whether a booking is marketplace-attributed and fee-eligible. Sources: https://www.fresha.com/help-center/knowledge-base/online-profile/get-bookings-from-google-search-and-maps, https://www.fresha.com/help-center/knowledge-base/online-profile/track-meta-pixel-ads, https://www.fresha.com/help-center/knowledge-base/online-profile/add-a-book-button-to-website, https://www.terms.fresha.com/marketplace-terms-of-service

## Replica implementation notes
- Model all fee calculations as rule-engine outputs with versioned policy snapshots.
- Separate `acquisition_fee`, `payment_processing_fee`, `policy_fee`, `capital_fee`, and `tax` in ledger entries.
- Keep country/payment-method overrides externalized (config) because pricing values are localized.

## Gaps / unknowns
- Public pages do not expose full per-country rate cards in a machine-readable table.
- Final net settlement formula may include country-specific taxes/partner processor nuances not fully exposed publicly.
