# D) DATA / OBJECT MODEL

## Canonical entities
| Entity | Purpose | Key attributes | State model | Key constraints/rules | Sources |
|---|---|---|---|---|---|
| Workspace | Business tenant boundary | `workspace_id`, `business_name`, `country`, `timezone`, `billing_profile` | `pending_setup -> active -> suspended` | Non-payment can lead to account restrictions/suspension | https://partners.fresha.com/users/sign-up?lang=en-US&from=fresha, https://www.terms.fresha.com/partner-terms-of-service |
| TeamMember | Service delivery and scheduling actor | `team_member_id`, `role`, `bookable`, `shift_rules`, `payout_destination` | `invited -> active -> inactive` | Team can be added/scheduled; payouts can be distributed | https://www.fresha.com/help-center/get-support, https://www.fresha.com/payments |
| Client | Consumer identity and relationship | `client_id`, `name`, `contact`, `first_seen_at`, `last_booking_at` | `new -> returning -> dormant` | Marketplace “new client” lookback rule is 12 months | https://www.terms.fresha.com/marketplace-terms-of-service |
| Service | Bookable offer | `service_id`, `duration`, `price`, `category`, `staff_eligibility` | `draft -> active -> archived` | Service catalog powers discovery + booking pathways | https://www.fresha.com/lp/en/tt/facials/in/au-sydney, https://www.fresha.com/es/a/brighton-wellness-hub-brighton-uk-113a-st-james-street-r6bnvkdr |
| OnlineProfile | Public listing record | `profile_id`, `visibility`, `verification_status`, `channels_enabled` | `draft -> listed -> unlisted` | Verification/visibility controls drive trust and acquisition | https://www.fresha.com/help-center/knowledge-base/online-profile/verify-online-profile, https://www.fresha.com/help-center/knowledge-base/online-profile/manage-online-profile-visibility |
| Booking | Core transaction unit | `booking_id`, `client_id`, `service_lines`, `staff_id`, `channel`, `scheduled_at` | `draft -> confirmed -> completed/cancelled/no_show` | No-show/late-cancel fees can be charged by policy | https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/create-and-manage-no-show-fees, https://www.terms.fresha.com/terms-of-service |
| Payment | Financial settlement object | `payment_id`, `booking_id`, `amount`, `method`, `captured_at` | `authorized -> captured -> refunded/voided/charged_back` | Card-on-file and payment method support defined in payment docs | https://www.fresha.com/payments, https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/process-refunds |
| NoShowFee | Policy-derived penalty charge | `fee_id`, `booking_id`, `policy_id`, `amount`, `reason` | `eligible -> charged -> waived` | Applies only when policy + payment setup conditions are met | https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/create-and-manage-no-show-fees |
| Refund | Reversal object | `refund_id`, `payment_id`, `amount`, `destination_method` | `requested -> processed -> settled` | Destination often follows original payment method constraints | https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/refund-options-for-payments-and-vouchers |
| Dispute | Chargeback case | `dispute_id`, `payment_id`, `reason_code`, `status`, `evidence_due_at` | `opened -> evidence_submitted -> won/lost` | Dedicated dispute workflow exists for handling chargebacks | https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/manage-disputes-and-chargebacks |
| Invoice | Billing statement | `invoice_id`, `workspace_id`, `period`, `line_items`, `due_date` | `issued -> due -> paid/overdue` | Payment due windows and service restriction risk in terms | https://www.terms.fresha.com/partner-terms-of-service, https://www.terms.fresha.com/marketplace-terms-of-service |
| WalletPayout | Settlement/payout transfer | `payout_id`, `workspace_id`, `amount`, `destination`, `status` | `scheduled -> in_transit -> settled/failed` | Wallet and payout operations are supported modules | https://www.fresha.com/help-center/knowledge-base/wallet |
| AttributionTouchpoint | Acquisition lineage | `touchpoint_id`, `booking_id`, `channel`, `campaign`, `source_url` | `captured -> attributed` | Trackable channels include Google, Meta Pixel, website button | https://www.fresha.com/help-center/knowledge-base/online-profile/track-meta-pixel-ads, https://www.fresha.com/help-center/knowledge-base/online-profile/manage-google-analytics, https://www.fresha.com/help-center/knowledge-base/online-profile/get-bookings-from-google-search-and-maps |
| CapitalAdvance | Embedded financing object | `advance_id`, `workspace_id`, `principal`, `capital_fee`, `repayment_progress` | `offered -> accepted -> repaying -> closed` | Upfront capital fee and automatic repayment from sales | https://www.fresha.com/for-business/features/capital |

## Relationship map
- `Workspace 1..* TeamMember`
- `Workspace 1..* Service`
- `Workspace 1..* Client`
- `Workspace 1..1 OnlineProfile`
- `Client 1..* Booking`
- `Booking 0..* Payment`
- `Payment 0..* Refund`
- `Payment 0..1 Dispute`
- `Booking 0..1 NoShowFee`
- `Workspace 1..* Invoice`
- `Workspace 1..* WalletPayout`
- `Booking 0..* AttributionTouchpoint`
- `Workspace 0..* CapitalAdvance`

## Inferred constraints (explicitly marked)
- Inference: `Booking.channel` should be normalized (`marketplace`, `google`, `meta`, `website_button`, `direct`) so fee attribution and marketing analytics resolve to the same taxonomy.
- Inference: `Client.new_vs_returning` should be computed from prior completed booking history with the 12-month lookback rule from marketplace terms.

## Gaps / unknowns
- Exact internal enum names and API schemas are not public.
- Exact payout states and retry semantics are not fully documented on public pages.
