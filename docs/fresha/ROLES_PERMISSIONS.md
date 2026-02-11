# E) ROLE & PERMISSION MODEL

## Role set (replica recommendation)
- `WorkspaceOwner`: full tenant control, billing authority, payment and policy controls.
- `WorkspaceAdmin`: operational admin without ownership transfer powers.
- `Manager`: day-to-day operations, scheduling, client handling, no-show/refund workflows.
- `TeamMember`: schedule execution and assigned-client service delivery.
- `FinanceOperator`: payments, payouts, refunds, dispute handling.
- `MarketingOperator`: online profile visibility, channel integrations, attribution tooling.

Role inference is based on publicly exposed capabilities for team, payments, online profile, and checkout management. Sources: https://www.fresha.com/help-center/get-support, https://www.fresha.com/help-center/knowledge-base/team, https://www.fresha.com/help-center/knowledge-base/payments, https://www.fresha.com/help-center/knowledge-base/online-profile

## Permission matrix
| Capability | Owner | Admin | Manager | TeamMember | FinanceOperator | MarketingOperator | Sources |
|---|---|---|---|---|---|---|---|
| Manage workspace settings | Y | Y | N | N | N | N | https://partners.fresha.com/users/sign-up?lang=en-US&from=fresha |
| Invite/manage team | Y | Y | Y | N | N | N | https://www.fresha.com/help-center/get-support |
| Configure services/schedule | Y | Y | Y | Limited | N | N | https://www.fresha.com/for-business/salon |
| Manage online profile visibility/verification | Y | Y | Y | N | N | Y | https://www.fresha.com/help-center/knowledge-base/online-profile/manage-online-profile-visibility, https://www.fresha.com/help-center/knowledge-base/online-profile/verify-online-profile |
| Configure payments methods/devices | Y | Y | Limited | N | Y | N | https://www.fresha.com/payments |
| Set no-show and cancellation charging behavior | Y | Y | Y | N | Y | N | https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/create-and-manage-no-show-fees |
| Process refunds/voids | Y | Y | Y | N | Y | N | https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/process-refunds, https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/void-sales |
| Manage disputes/chargebacks | Y | Y | Limited | N | Y | N | https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/manage-disputes-and-chargebacks |
| Configure Meta/GA attribution | Y | Y | N | N | N | Y | https://www.fresha.com/help-center/knowledge-base/online-profile/track-meta-pixel-ads, https://www.fresha.com/help-center/knowledge-base/online-profile/manage-google-analytics |
| View billing invoices/payouts | Y | Y | Limited | N | Y | N | https://www.terms.fresha.com/partner-terms-of-service, https://www.fresha.com/help-center/knowledge-base/wallet |

## Permission model rules
- Billing/legal acceptance should be owner-scoped because payment default can suspend service if overdue. Source: https://www.terms.fresha.com/partner-terms-of-service
- Dispute/refund actions should be finance-audited because they alter settlement outcomes. Source: https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/manage-disputes-and-chargebacks
- Marketing channel controls should be separated from payment controls to reduce accidental revenue-impact changes. Sources: https://www.fresha.com/help-center/knowledge-base/online-profile/track-meta-pixel-ads, https://www.fresha.com/help-center/knowledge-base/online-profile/manage-google-analytics

## Gaps / unknowns
- Public docs do not expose exact internal ACL policy names or built-in role labels.
