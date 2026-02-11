# F) TRUST & QUALITY CONTROLS

## Policy and control inventory
1. Cancellation and no-show governance
- Consumer terms define cancellation/no-show policy behavior and indicate business-defined policy windows. Source: https://www.terms.fresha.com/terms-of-service
- Help-center operations define when no-show fees can be created/charged and late-cancel handling constraints. Source: https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/create-and-manage-no-show-fees

2. Refund correctness controls
- Refund options depend on payment/voucher method and original transaction path. Source: https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/refund-options-for-payments-and-vouchers
- Refund and void are separate operations with different accounting impacts. Sources: https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/process-refunds, https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/void-sales

3. Dispute and chargeback handling
- Dedicated chargeback workflow supports response/evidence operations. Source: https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/manage-disputes-and-chargebacks

4. Payment security controls
- Fresha payments surface highlights fraud controls, 3D Secure, and encrypted card handling with PCI framing. Source: https://www.fresha.com/payments

5. Marketplace profile trust controls
- Online profile verification and visibility controls are explicit and influence discoverability and trust posture. Sources: https://www.fresha.com/help-center/knowledge-base/online-profile/verify-online-profile, https://www.fresha.com/help-center/knowledge-base/online-profile/manage-online-profile-visibility

6. Billing/commercial integrity controls
- Partner and marketplace terms define invoice cadence, due windows, and consequences for non-payment. Sources: https://www.terms.fresha.com/partner-terms-of-service, https://www.terms.fresha.com/marketplace-terms-of-service

## Quality assurance controls for replica build
- Enforce explicit state transitions for `booking`, `payment`, `refund`, and `dispute` objects to avoid silent state corruption.
- Require policy snapshots on booking confirmation (`cancellation_policy_version`, `no_show_policy_version`) for auditability.
- Maintain idempotency keys for payment capture/refund endpoints.
- Store channel attribution separately from payout settlement data to avoid cross-domain contamination.

## Known unknowns
- Public docs do not fully expose fraud model scoring thresholds, dispute SLA timers, or all compliance attestations.
