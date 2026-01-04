# Licence Re-Verification and Stale Data (AU)

## Goals

- Keep "Verified" badges meaningful and current
- Avoid stale register claims that could mislead consumers
- Maintain transparency: show "Verified on <date>" to build trust
- Comply with AU regulatory expectations

---

## Re-Check Cadence (Default)

| Credential Type | Re-check Frequency | Notes |
|-----------------|-------------------|-------|
| ABN (via ABR) | Every 90 days | Or on profile edits |
| AFSL / ACL (business licences) | Every 180 days | Licences rarely change |
| FAR entries (individual advisers) | Quarterly | Aligned to ASIC update cycles |
| Credit Representative | Every 180 days | |
| State real estate licences | Every 180 days | State registers vary |
| Expiring licences | 30 days before expiry, then weekly | Until renewed or expired |

### User-Triggered Refresh

- Advisor can request "Re-verify my credentials" from dashboard
- Useful after licence renewal or register update
- Rate-limited to 1 request per 7 days per credential

---

## Register Sources (AU)

### Financial Services

| Credential | Source | Automation |
|------------|--------|------------|
| Financial Advisers Register (FAR) | [MoneySmart](https://moneysmart.gov.au/financial-advice/financial-advisers-register) | Semi-auto (scrape/manual) |
| AFSL Holders | [ASIC Professional Registers](https://asic.gov.au/online-services/search-asics-registers/) | Semi-auto |
| Authorised Representatives | ASIC PRS | Semi-auto |

### Credit/Mortgage

| Credential | Source | Automation |
|------------|--------|------------|
| Australian Credit Licence (ACL) | [ASIC Credit Licensee Search](https://asic.gov.au) | Semi-auto |
| Credit Representatives | ASIC PRS | Semi-auto |

### Property (State-Based)

| State | Source | Automation |
|-------|--------|------------|
| NSW | [Service NSW Licence Check](https://www.service.nsw.gov.au) | Manual |
| VIC | [Consumer Affairs Victoria](https://www.consumer.vic.gov.au) | Manual |
| QLD | [QLD Property Licence Check](https://www.qld.gov.au) | Manual |
| WA | [WA Consumer Protection](https://www.consumerprotection.wa.gov.au) | Manual |
| SA | [CBS SA](https://www.cbs.sa.gov.au) | Manual |

---

## Verification Workflow

### V1 (Manual-First)

```
1. Admin receives re-verification task (scheduled or triggered)
2. Admin opens register source URL (pre-linked)
3. Admin checks:
   - Licence/registration still active
   - Name matches
   - No disciplinary actions
4. Admin updates credential:
   - verification_status = 'verified' or 'rejected'
   - verified_at = now()
   - verification_source = 'asic_far' / 'state_register' / etc.
   - verification_notes = any comments
5. Audit event logged
```

### V2 (Semi-Automated)

Where APIs or structured data exist:

1. **ABN Lookup API** — Fully automated
   - Validate ABN status
   - Fetch entity name + address
   - Fuzzy match to stored data

2. **ASIC Data** — Structured verification
   - Build internal lookup against published data
   - Admin confirms match (not fully automated)

3. **State Registers** — Remain manual
   - No public APIs available
   - Store evidence screenshots

---

## UX Transparency

### On Listing/Profile

Display verification badge with tooltip:

```
✓ Licence Verified
  "Verified on 15 Jan 2025"
  "Source: ASIC Financial Advisers Register"
```

### Stale/Pending States

| State | Badge Display |
|-------|---------------|
| Verified (current) | ✓ Verified |
| Verification pending refresh | ⏳ Verification updating |
| Overdue (> 30 days past schedule) | ⚠️ Verification pending |
| Rejected/Expired | No badge (or ✗ if needed) |

### Admin Dashboard

- "Last checked at" timestamp
- "Next scheduled check" date
- "Days until expiry" for expiring licences
- Queue of credentials due for re-verification

---

## What Happens When Stale

### Soft Stale (Overdue < 30 days)

- Badge changes to "Verification updating"
- No ranking penalty yet
- Admin task created with high priority

### Hard Stale (Overdue > 30 days)

- Badge downgraded to "Verification pending"
- Ranking penalty applied
- Advisor notified via email/dashboard

### Register Shows Inactive/Suspended/Expired

1. Set `credential.verification_status = 'rejected'`
2. Set `credential.verification_notes` with reason
3. Downgrade `listing.verification_level`
4. Log `audit_event` with details
5. Notify advisor with required actions

---

## Expiry Handling

### Licences with Expiry Dates

Many AU licences have annual renewal:

```
expires_at = 2025-06-30

30 days before:
  → Create re-verification task
  → Notify advisor: "Your licence expires soon, please renew"

7 days before:
  → Escalate task priority
  → Reminder notification

On expiry:
  → Set verification_status = 'expired'
  → Downgrade verification_level
  → Notify advisor
```

### Licences Without Expiry

- Follow standard re-check cadence
- No expiry-based notifications

---

## Implementation Checklist

### V1 (Manual)

- [ ] Add `next_verification_at` to `credential` table
- [ ] Create scheduled job to generate re-verification tasks
- [ ] Build admin queue for pending verifications
- [ ] Add register source URL shortcuts in admin UI
- [ ] Implement verification status change → audit log
- [ ] Add badge tooltip with verification date

### V2 (Automation)

- [ ] Integrate ABR API for ABN verification
- [ ] Build ASIC data lookup (if structured data available)
- [ ] Implement auto-expiry for overdue credentials
- [ ] Add advisor self-service "request re-verification"

---

## Compliance Notes

- Always store evidence of verification (screenshots, API responses)
- Never claim "verified" without checking the source
- If register is unavailable, don't fail-open — mark as "pending"
- Consider professional indemnity implications of displaying badges
