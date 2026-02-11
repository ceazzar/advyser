# H) INSTRUMENTATION EVENTS

## Event taxonomy principles
- Namespace by domain: `c1_*` (consumer), `c2_*` (business ops), `c3_*` (money/attribution).
- Include immutable IDs (`workspace_id`, `booking_id`, `client_id`, `payment_id`) and versioned rule context.
- Track channel and attribution metadata on every booking-adjacent event.

## C1 consumer events
| Event | Trigger | Required properties | Source tie |
|---|---|---|---|
| `c1_discovery_viewed` | Consumer opens discovery page | `surface_type`, `geo`, `category_slug`, `session_id` | https://www.fresha.com/search, https://www.fresha.com/sitemap |
| `c1_listing_opened` | Venue profile opened | `venue_id`, `surface_type`, `referrer_channel` | https://www.fresha.com/es/a/brighton-wellness-hub-brighton-uk-113a-st-james-street-r6bnvkdr |
| `c1_booking_started` | Booking funnel starts | `venue_id`, `service_ids`, `channel` | https://www.fresha.com/help-center/knowledge-base/online-profile/get-bookings-from-google-search-and-maps |
| `c1_checkout_submitted` | Payment/deposit submission | `booking_id`, `payment_method`, `policy_version` | https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/create-and-manage-no-show-fees |
| `c1_booking_confirmed` | Booking confirmation | `booking_id`, `client_id`, `channel`, `new_client_flag` | https://www.terms.fresha.com/marketplace-terms-of-service |
| `c1_booking_cancelled` | Cancel action | `booking_id`, `cancel_origin`, `fee_applied` | https://www.terms.fresha.com/terms-of-service |
| `c1_no_show_recorded` | No-show disposition | `booking_id`, `fee_policy_id`, `fee_amount` | https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/create-and-manage-no-show-fees |

## C2 business events
| Event | Trigger | Required properties | Source tie |
|---|---|---|---|
| `c2_workspace_created` | Partner account/workspace creation | `workspace_id`, `country`, `onboarding_source` | https://partners.fresha.com/users/sign-up?lang=en-US&from=fresha |
| `c2_team_member_added` | Team profile created | `workspace_id`, `team_member_id`, `role` | https://www.fresha.com/help-center/get-support |
| `c2_online_profile_published` | Listing published/visible | `workspace_id`, `profile_id`, `visibility_state` | https://www.fresha.com/help-center/knowledge-base/online-profile/manage-online-profile-visibility |
| `c2_online_profile_verified` | Profile verification completes | `workspace_id`, `profile_id`, `verification_state` | https://www.fresha.com/help-center/knowledge-base/online-profile/verify-online-profile |
| `c2_payments_enabled` | Payments activated | `workspace_id`, `payments_provider`, `terminal_enabled` | https://www.fresha.com/payments |
| `c2_refund_processed` | Refund completed | `workspace_id`, `refund_id`, `payment_id`, `refund_method` | https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/process-refunds |
| `c2_dispute_opened` | Chargeback/dispute opened | `workspace_id`, `dispute_id`, `payment_id`, `reason_code` | https://www.fresha.com/help-center/knowledge-base/sales-and-checkout/manage-disputes-and-chargebacks |

## C3 money + attribution events
| Event | Trigger | Required properties | Source tie |
|---|---|---|---|
| `c3_channel_connected` | Meta/GA/Google/website booking channel configured | `workspace_id`, `channel`, `status` | https://www.fresha.com/help-center/knowledge-base/online-profile/track-meta-pixel-ads, https://www.fresha.com/help-center/knowledge-base/online-profile/manage-google-analytics, https://www.fresha.com/help-center/knowledge-base/online-profile/add-a-book-button-to-website |
| `c3_attribution_assigned` | Booking receives channel attribution | `booking_id`, `channel`, `campaign`, `touchpoint_ts` | same as above |
| `c3_marketplace_fee_assessed` | Marketplace fee computed | `booking_id`, `workspace_id`, `new_client_flag`, `fee_amount`, `rule_version` | https://www.terms.fresha.com/marketplace-terms-of-service, https://www.fresha.com/pricing |
| `c3_processing_fee_assessed` | Payment processing fee computed | `payment_id`, `workspace_id`, `rate_plan_id`, `fee_amount` | https://www.fresha.com/pricing, https://www.fresha.com/payments |
| `c3_invoice_issued` | Statement/invoice creation | `invoice_id`, `workspace_id`, `period_start`, `period_end`, `due_date` | https://www.terms.fresha.com/partner-terms-of-service |
| `c3_invoice_overdue` | Due date breached | `invoice_id`, `days_overdue`, `risk_state` | https://www.terms.fresha.com/partner-terms-of-service |
| `c3_payout_settled` | Payout completes | `payout_id`, `workspace_id`, `amount`, `currency` | https://www.fresha.com/help-center/knowledge-base/wallet |
| `c3_capital_offer_presented` | Capital offer shown | `workspace_id`, `offer_id`, `principal`, `capital_fee` | https://www.fresha.com/for-business/features/capital |
| `c3_capital_repayment_posted` | Repayment applied | `advance_id`, `workspace_id`, `repayment_amount`, `remaining_balance` | https://www.fresha.com/for-business/features/capital |

## Event quality controls
- Add `rule_version` to fee/refund/no-show events.
- Persist `channel_first_touch` and `channel_last_touch` on booking-level attribution facts.
- Emit immutable ledger events for all money-impact actions (`assessed`, `captured`, `refunded`, `disputed`, `paid_out`).

## Gaps / unknowns
- Native Fresha event names are not publicly documented; this is a replica taxonomy tied to observed product behavior.
