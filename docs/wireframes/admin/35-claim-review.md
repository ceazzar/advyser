# Admin - Claim Request Review Page Wireframe

## Page Purpose
The core administrative workflow page for reviewing and processing business claim requests. This page provides all necessary information and verification tools for admins to make informed decisions about granting business ownership claims, including integrated external verification lookups and fraud detection.

## URL Pattern
`/admin/claims/:claimId/review`

## User Role
admin (authenticated, role=admin)

## Desktop Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│  ADVYSER ADMIN                                                    [Admin User ▼]         │
├─────────────────┬────────────────────────────────────────────────────────────────────────┤
│                 │                                                                        │
│  Dashboard      │  ← Back to Claims Queue                                               │
│                 │                                                                        │
│  ● Claims       │  ┌────────────────────────────────────────────────────────────────┐   │
│    ├ Queue      │  │                                                                │   │
│    └ History    │  │  Smith Financial Planning                                      │   │
│                 │  │  Claim #4521                                                   │   │
│  Listings       │  │                                                                │   │
│                 │  │  Status: [Pending ▼]     Submitted: 5 Jan 2026, 10:34 AM      │   │
│  Reviews        │  │                          Assigned to: You                      │   │
│                 │  │                                                                │   │
│  Reports        │  │  ┌─────────────┐ ┌─────────────────┐ ┌─────────────────┐      │   │
│                 │  │  │  Approve    │ │  Request Info   │ │      Deny       │      │   │
│  Categories     │  │  └─────────────┘ └─────────────────┘ └─────────────────┘      │   │
│                 │  │                                                                │   │
│  Analytics      │  └────────────────────────────────────────────────────────────────┘   │
│                 │                                                                        │
│  Users          │  ═══════════════════════════════════════════════════════════════════  │
│                 │                                                                        │
│                 │  ┌─────────────────────────────────┐ ┌─────────────────────────────┐  │
│                 │  │                                 │ │                             │  │
│                 │  │  SUBMITTED INFORMATION          │ │  VERIFICATION CHECKS        │  │
│                 │  │                                 │ │                             │  │
│                 │  │  ─────────────────────────────  │ │  ─────────────────────────  │  │
│                 │  │                                 │ │                             │  │
│                 │  │  CLAIMANT DETAILS               │ │  ABN LOOKUP RESULT          │  │
│                 │  │  ┌───────────────────────────┐  │ │  ┌─────────────────────────┐│  │
│                 │  │  │                           │  │ │  │                         ││  │
│                 │  │  │  Name:      John Smith    │  │ │  │  Status: Active ✓       ││  │
│                 │  │  │  Email:     john@smith    │  │ │  │                         ││  │
│                 │  │  │            financial.au   │  │ │  │  Entity Name:           ││  │
│                 │  │  │  Phone:     0412 345 678  │  │ │  │  Smith Financial        ││  │
│                 │  │  │  Role:      Owner/Director│  │ │  │  Pty Ltd                ││  │
│                 │  │  │                           │  │ │  │  ✓ Matches submission   ││  │
│                 │  │  │  Account Created:         │  │ │  │                         ││  │
│                 │  │  │  2 Jan 2026               │  │ │  │  Business Address:      ││  │
│                 │  │  │                           │  │ │  │  123 Financial St       ││  │
│                 │  │  │  Previous Claims: 0       │  │ │  │  Sydney NSW 2000        ││  │
│                 │  │  │                           │  │ │  │  ✓ Matches submission   ││  │
│                 │  │  └───────────────────────────┘  │ │  │                         ││  │
│                 │  │                                 │ │  │  ABN Effective:         ││  │
│                 │  │  ─────────────────────────────  │ │  │  15 Mar 2018            ││  │
│                 │  │                                 │ │  │                         ││  │
│                 │  │  BUSINESS DETAILS               │ │  │  GST Registered: Yes    ││  │
│                 │  │  ┌───────────────────────────┐  │ │  │                         ││  │
│                 │  │  │                           │  │ │  │  [Open ABN Lookup →]    ││  │
│                 │  │  │  Trading Name:            │  │ │  │                         ││  │
│                 │  │  │  Smith Financial Planning │  │ │  └─────────────────────────┘│  │
│                 │  │  │                           │  │ │                             │  │
│                 │  │  │  Legal Name:              │  │ │  Last checked: Just now     │  │
│                 │  │  │  Smith Financial Pty Ltd  │  │ │  [Refresh ABN Data]         │  │
│                 │  │  │                           │  │ │                             │  │
│                 │  │  │  ABN: 12 345 678 901      │  │ │  ─────────────────────────  │  │
│                 │  │  │                           │  │ │                             │  │
│                 │  │  │  Address:                 │  │ │  LICENCE VERIFICATION       │  │
│                 │  │  │  123 Financial Street     │  │ │  ┌─────────────────────────┐│  │
│                 │  │  │  Sydney NSW 2000          │  │ │  │                         ││  │
│                 │  │  │                           │  │ │  │  Advisor Type:          ││  │
│                 │  │  │  Website:                 │  │ │  │  Financial Adviser      ││  │
│                 │  │  │  smithfinancial.com.au    │  │ │  │                         ││  │
│                 │  │  │                           │  │ │  │  ─────────────────────  ││  │
│                 │  │  │  Phone: (02) 9123 4567    │  │ │  │                         ││  │
│                 │  │  │                           │  │ │  │  ASIC FAR Check:        ││  │
│                 │  │  └───────────────────────────┘  │ │  │                         ││  │
│                 │  │                                 │ │  │  [x] Checked ASIC FAR   ││  │
│                 │  │  ─────────────────────────────  │ │  │      [Open MoneySmart →]││  │
│                 │  │                                 │ │  │                         ││  │
│                 │  │  CREDENTIALS SUBMITTED          │ │  │  [x] Name matches       ││  │
│                 │  │  ┌───────────────────────────┐  │ │  │      Listed: John Smith ││  │
│                 │  │  │                           │  │ │  │      Submitted: J Smith ││  │
│                 │  │  │  Credential Type:         │  │ │  │                         ││  │
│                 │  │  │  ASIC Financial Adviser   │  │ │  │  [x] Status: Current    ││  │
│                 │  │  │  Representative Number    │  │ │  │      (Since 2015)       ││  │
│                 │  │  │                           │  │ │  │                         ││  │
│                 │  │  │  Number: 001234567        │  │ │  │  [x] Licence details    ││  │
│                 │  │  │                           │  │ │  │      match submission   ││  │
│                 │  │  │  AFSL Holder:             │  │ │  │                         ││  │
│                 │  │  │  XYZ Wealth Pty Ltd       │  │ │  │  Authorisations:        ││  │
│                 │  │  │  AFSL: 123456             │  │ │  │  - Personal advice      ││  │
│                 │  │  │                           │  │ │  │  - SMSF                 ││  │
│                 │  │  │  State: N/A (Federal)     │  │ │  │  - Life insurance       ││  │
│                 │  │  │                           │  │ │  │                         ││  │
│                 │  │  └───────────────────────────┘  │ │  └─────────────────────────┘│  │
│                 │  │                                 │ │                             │  │
│                 │  │  ─────────────────────────────  │ │  ─────────────────────────  │  │
│                 │  │                                 │ │                             │  │
│                 │  │  PROOF OF CONTROL               │ │  FRAUD FLAGS               │  │
│                 │  │  ┌───────────────────────────┐  │ │  ┌─────────────────────────┐│  │
│                 │  │  │                           │  │ │  │                         ││  │
│                 │  │  │  Method: Email Domain     │  │ │  │  ⚠ Email domain does   ││  │
│                 │  │  │  Verification             │  │ │  │    not match business  ││  │
│                 │  │  │                           │  │ │  │    website             ││  │
│                 │  │  │  Email Used:              │  │ │  │                         ││  │
│                 │  │  │  john@smithfinancial.au   │  │ │  │    Claimant email:     ││  │
│                 │  │  │                           │  │ │  │    john@smithfin.au    ││  │
│                 │  │  │  Business Domain:         │  │ │  │    Business website:   ││  │
│                 │  │  │  smithfinancial.com.au    │  │ │  │    smithfinancial.com.au││  │
│                 │  │  │                           │  │ │  │                         ││  │
│                 │  │  │  Status: ⚠ Mismatch       │  │ │  │  ─────────────────────  ││  │
│                 │  │  │                           │  │ │  │                         ││  │
│                 │  │  │  Note: .au vs .com.au     │  │ │  │  ✓ No multiple claim   ││  │
│                 │  │  │                           │  │ │  │    attempts detected   ││  │
│                 │  │  └───────────────────────────┘  │ │  │                         ││  │
│                 │  │                                 │ │  │  ✓ IP address clean    ││  │
│                 │  │  ─────────────────────────────  │ │  │    (AU residential)    ││  │
│                 │  │                                 │ │  │                         ││  │
│                 │  │  EVIDENCE FILES                 │ │  │  ✓ Account age OK      ││  │
│                 │  │  ┌───────────────────────────┐  │ │  │    (3 days)            ││  │
│                 │  │  │                           │  │ │  │                         ││  │
│                 │  │  │  ┌─────┐ ┌─────┐ ┌─────┐  │  │ │  │  ✓ No velocity flags   ││  │
│                 │  │  │  │ PDF │ │ JPG │ │ PDF │  │  │ │  │                         ││  │
│                 │  │  │  │     │ │     │ │     │  │  │ │  └─────────────────────────┘│  │
│                 │  │  │  └─────┘ └─────┘ └─────┘  │  │ │                             │  │
│                 │  │  │  ASIC    Photo   Business │  │ │                             │  │
│                 │  │  │  Letter  ID      Card     │  │ │                             │  │
│                 │  │  │                           │  │ │                             │  │
│                 │  │  │  [View Full] [Download]   │  │ │                             │  │
│                 │  │  │  per file                 │  │ │                             │  │
│                 │  │  │                           │  │ │                             │  │
│                 │  │  └───────────────────────────┘  │ │                             │  │
│                 │  │                                 │ │                             │  │
│                 │  │  ─────────────────────────────  │ │                             │  │
│                 │  │                                 │ │                             │  │
│                 │  │  SUBMISSION NOTES               │ │                             │  │
│                 │  │  ┌───────────────────────────┐  │ │                             │  │
│                 │  │  │ "I am the owner and       │  │ │                             │  │
│                 │  │  │ principal adviser of      │  │ │                             │  │
│                 │  │  │ Smith Financial. We've    │  │ │                             │  │
│                 │  │  │ been operating since 2018 │  │ │                             │  │
│                 │  │  │ and I'd like to claim     │  │ │                             │  │
│                 │  │  │ our business listing."    │  │ │                             │  │
│                 │  │  └───────────────────────────┘  │ │                             │  │
│                 │  │                                 │ │                             │  │
│                 │  └─────────────────────────────────┘ └─────────────────────────────┘  │
│                 │                                                                        │
│                 │  ═══════════════════════════════════════════════════════════════════  │
│                 │                                                                        │
│                 │  DECISION                                                              │
│                 │  ┌────────────────────────────────────────────────────────────────┐   │
│                 │  │                                                                │   │
│                 │  │  ○ Approve Claim    ○ Request More Info    ○ Deny Claim       │   │
│                 │  │                                                                │   │
│                 │  │  ────────────────────────────────────────────────────────────  │   │
│                 │  │                                                                │   │
│                 │  │  [Decision form appears based on selection - see below]       │   │
│                 │  │                                                                │   │
│                 │  └────────────────────────────────────────────────────────────────┘   │
│                 │                                                                        │
│                 │  INTERNAL NOTES (Not shared with claimant)                            │
│                 │  ┌────────────────────────────────────────────────────────────────┐   │
│                 │  │                                                                │   │
│                 │  │  [Add internal note...                                     ]  │   │
│                 │  │                                                                │   │
│                 │  │  ─────────────────────────────────────────────────────────     │   │
│                 │  │                                                                │   │
│                 │  │  Previous notes:                                               │   │
│                 │  │  (none)                                                        │   │
│                 │  │                                                                │   │
│                 │  └────────────────────────────────────────────────────────────────┘   │
│                 │                                                                        │
│                 │  ┌────────────────────────────────────────────────────────────────┐   │
│                 │  │                                      [Cancel]  [Submit Decision]│   │
│                 │  └────────────────────────────────────────────────────────────────┘   │
│                 │                                                                        │
└─────────────────┴────────────────────────────────────────────────────────────────────────┘
```

## Header Section Detail

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  ← Back to Claims Queue                                                    │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                                                                      │ │
│  │  Smith Financial Planning                          Claim #4521       │ │
│  │  ════════════════════════                                            │ │
│  │                                                                      │ │
│  │  Status: ┌────────────────────┐    Submitted: 5 Jan 2026, 10:34 AM  │ │
│  │          │ ● Pending        ▼ │    Age: 5 days (⚠ URGENT)           │ │
│  │          │   ○ Pending        │    Assigned to: You                  │ │
│  │          │   ○ Needs Info     │    Previous reviewer: None           │ │
│  │          │   ○ Approved       │                                      │ │
│  │          │   ○ Denied         │                                      │ │
│  │          └────────────────────┘                                      │ │
│  │                                                                      │ │
│  │  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐     │ │
│  │  │  ✓ Approve       │ │  ? Request Info  │ │  ✗ Deny          │     │ │
│  │  │                  │ │                  │ │                  │     │ │
│  │  └──────────────────┘ └──────────────────┘ └──────────────────┘     │ │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

## Left Column - Submitted Information

### Claimant Details Section

```
┌───────────────────────────────────────────────────────────────┐
│  CLAIMANT DETAILS                                             │
│  ─────────────────────────────────────────────────────────    │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                         │ │
│  │  Full Name           John Robert Smith                  │ │
│  │  Email               john@smithfinancial.au             │ │
│  │  Phone               0412 345 678                       │ │
│  │  Role Claimed        Owner / Director                   │ │
│  │                                                         │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  ACCOUNT INFORMATION                                    │ │
│  │  Account Created     2 Jan 2026 (3 days ago)           │ │
│  │  Email Verified      Yes ✓                              │ │
│  │  Phone Verified      Yes ✓                              │ │
│  │  Previous Claims     0                                  │ │
│  │  Other Businesses    0                                  │ │
│  │                                                         │ │
│  │  [View Full User Profile →]                            │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Business Details Section

```
┌───────────────────────────────────────────────────────────────┐
│  BUSINESS DETAILS                                             │
│  ─────────────────────────────────────────────────────────    │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                         │ │
│  │  Trading Name        Smith Financial Planning           │ │
│  │  Legal Name          Smith Financial Pty Ltd            │ │
│  │  ABN                 12 345 678 901  [Copy]            │ │
│  │  ACN                 123 456 789                        │ │
│  │                                                         │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  Business Address    123 Financial Street               │ │
│  │                      Suite 401                          │ │
│  │                      Sydney NSW 2000                    │ │
│  │                      [View on Map →]                    │ │
│  │                                                         │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  Website             smithfinancial.com.au  [Visit →]  │ │
│  │  Phone               (02) 9123 4567                     │ │
│  │  Email               info@smithfinancial.com.au        │ │
│  │                                                         │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  EXISTING LISTING                                       │ │
│  │  Status              Unclaimed                          │ │
│  │  Created             12 Dec 2025 (auto-generated)      │ │
│  │  Profile Complete    45%                                │ │
│  │  [View Listing →]                                      │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Credentials Submitted Section

```
┌───────────────────────────────────────────────────────────────┐
│  CREDENTIALS SUBMITTED                                        │
│  ─────────────────────────────────────────────────────────    │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                         │ │
│  │  Credential Type     ASIC Financial Adviser            │ │
│  │                      Representative Number              │ │
│  │                                                         │ │
│  │  Number              001234567  [Copy]                 │ │
│  │                                                         │ │
│  │  AFSL Holder         XYZ Wealth Pty Ltd                │ │
│  │  AFSL Number         123456                             │ │
│  │                                                         │ │
│  │  State/Territory     N/A (Federal Registration)        │ │
│  │                                                         │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  Additional Credentials Claimed:                        │ │
│  │  • CFP (Certified Financial Planner)                   │ │
│  │  • SMSF Specialist Adviser                             │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Proof of Control Section

```
┌───────────────────────────────────────────────────────────────┐
│  PROOF OF CONTROL                                             │
│  ─────────────────────────────────────────────────────────    │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                         │ │
│  │  Verification Method:  Email Domain Verification        │ │
│  │                                                         │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  Email Used           john@smithfinancial.au           │ │
│  │  Email Domain         smithfinancial.au                 │ │
│  │  Business Website     smithfinancial.com.au            │ │
│  │                                                         │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  Verification Status: ⚠ PARTIAL MATCH                  │ │
│  │                                                         │ │
│  │  Note: Email domain (.au) differs from website         │ │
│  │  domain (.com.au). May be legitimate (many AU          │ │
│  │  businesses use both), but requires manual review.     │ │
│  │                                                         │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  Alternative Verification Options:                      │ │
│  │  [Request Phone Verification]                          │ │
│  │  [Request Document Upload]                             │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Evidence Files Section

```
┌───────────────────────────────────────────────────────────────┐
│  EVIDENCE FILES (3 files)                                     │
│  ─────────────────────────────────────────────────────────    │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                         │ │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐           │ │
│  │  │           │  │           │  │           │           │ │
│  │  │   [PDF]   │  │   [IMG]   │  │   [PDF]   │           │ │
│  │  │           │  │           │  │           │           │ │
│  │  │  ASIC     │  │  Photo    │  │  Business │           │ │
│  │  │  Letter   │  │  ID       │  │  Card     │           │ │
│  │  │           │  │           │  │           │           │ │
│  │  │  245 KB   │  │  1.2 MB   │  │  89 KB    │           │ │
│  │  │           │  │           │  │           │           │ │
│  │  └───────────┘  └───────────┘  └───────────┘           │ │
│  │   [View] [DL]   [View] [DL]   [View] [DL]             │ │
│  │                                                         │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  Uploaded: 5 Jan 2026, 10:32 AM                        │ │
│  │  Virus Scan: Passed ✓                                  │ │
│  │                                                         │ │
│  │  [Download All as ZIP]                                 │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Submission Notes Section

```
┌───────────────────────────────────────────────────────────────┐
│  SUBMISSION NOTES                                             │
│  ─────────────────────────────────────────────────────────    │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                         │ │
│  │  "I am the owner and principal financial adviser at    │ │
│  │  Smith Financial Planning. We've been operating since  │ │
│  │  2018, primarily serving clients in the Sydney CBD     │ │
│  │  area. I'd like to claim our business listing to       │ │
│  │  ensure the information is accurate and to be able     │ │
│  │  to respond to client enquiries through the platform.  │ │
│  │                                                         │ │
│  │  Note: My email uses .au domain while website is       │ │
│  │  .com.au - we own both domains, happy to verify        │ │
│  │  either way."                                          │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Right Column - Verification Checks

### ABN Lookup Result Section

```
┌───────────────────────────────────────────────────────────────┐
│  ABN LOOKUP RESULT                    [Refresh ABN Data]     │
│  ─────────────────────────────────────────────────────────    │
│  Last checked: Just now                                       │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                         │ │
│  │  ABN Status          ● Active                    ✓     │ │
│  │                                                         │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  Entity Name         Smith Financial Pty Ltd           │ │
│  │  Submitted Name      Smith Financial Pty Ltd           │ │
│  │  Match Status        ✓ Exact Match                     │ │
│  │                                                         │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  ABR Address         123 Financial St                  │ │
│  │                      SYDNEY NSW 2000                   │ │
│  │  Submitted Address   123 Financial Street              │ │
│  │                      Sydney NSW 2000                   │ │
│  │  Match Status        ✓ Match (normalised)             │ │
│  │                                                         │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  ABN Effective       15 March 2018                     │ │
│  │  Entity Type         Australian Private Company        │ │
│  │  GST Registered      Yes (since 15 Mar 2018)          │ │
│  │                                                         │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  Trading Names:                                         │ │
│  │  • Smith Financial Planning (from 15 Mar 2018)        │ │
│  │                                                         │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  [Open ABN Lookup →]                                   │ │
│  │  https://abr.business.gov.au                          │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Licence Verification Section - Financial Adviser

```
┌───────────────────────────────────────────────────────────────┐
│  LICENCE VERIFICATION                                         │
│  ─────────────────────────────────────────────────────────    │
│                                                               │
│  Advisor Type: FINANCIAL ADVISER                              │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                         │ │
│  │  ASIC FINANCIAL ADVISERS REGISTER (FAR) CHECK          │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  [x] Checked ASIC FAR                                  │ │
│  │                                                         │ │
│  │      [Open MoneySmart FAR →]                           │ │
│  │      https://moneysmart.gov.au/financial-advice/       │ │
│  │      financial-advisers-register                       │ │
│  │                                                         │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  [x] Name matches register                             │ │
│  │                                                         │ │
│  │      Register Name:    John Robert Smith               │ │
│  │      Submitted Name:   John Smith                      │ │
│  │      Status:           ✓ Match (middle name optional)  │ │
│  │                                                         │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  [x] Status is Current                                 │ │
│  │                                                         │ │
│  │      Registration Status:  Current                     │ │
│  │      Registered Since:     12 June 2015                │ │
│  │      Ceased Date:          N/A                         │ │
│  │                                                         │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  [x] Licence details match submission                  │ │
│  │                                                         │ │
│  │      Rep Number (FAR):     001234567                   │ │
│  │      Rep Number (Submit):  001234567                   │ │
│  │      Status:               ✓ Exact Match               │ │
│  │                                                         │ │
│  │      AFSL Holder (FAR):    XYZ Wealth Pty Ltd         │ │
│  │      AFSL Number (FAR):    123456                      │ │
│  │      AFSL (Submit):        123456                      │ │
│  │      Status:               ✓ Match                     │ │
│  │                                                         │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  AUTHORISATIONS (from FAR):                            │ │
│  │  • Provide personal advice on:                         │ │
│  │    - Deposit and payment products                      │ │
│  │    - Government debentures, stocks or bonds           │ │
│  │    - Investment life insurance products               │ │
│  │    - Life risk insurance products                     │ │
│  │    - Managed investment schemes                       │ │
│  │    - Retirement savings account products              │ │
│  │    - Securities                                       │ │
│  │    - Superannuation                                   │ │
│  │  • Self-managed superannuation funds                  │ │
│  │                                                         │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  DISCIPLINARY HISTORY:                                 │ │
│  │  None recorded ✓                                       │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Licence Verification Section - Mortgage Broker (Alternative)

```
┌───────────────────────────────────────────────────────────────┐
│  LICENCE VERIFICATION                                         │
│  ─────────────────────────────────────────────────────────    │
│                                                               │
│  Advisor Type: MORTGAGE BROKER                                │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                         │ │
│  │  ASIC CREDIT REPRESENTATIVE CHECK                       │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  [x] Checked ASIC Credit Register                      │ │
│  │                                                         │ │
│  │      [Open ASIC Credit Register →]                     │ │
│  │      https://asic.gov.au/online-services/             │ │
│  │      search-asics-registers/credit/                    │ │
│  │                                                         │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  [x] ACL/Credit Rep Number verified                    │ │
│  │                                                         │ │
│  │      Credit Rep Number:    CR 123456                   │ │
│  │      Status:               Current                     │ │
│  │      ACL Holder:           ABC Lending Group          │ │
│  │      ACL Number:           ACL 654321                  │ │
│  │                                                         │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  [x] Name matches                                      │ │
│  │                                                         │ │
│  │  [ ] MFAA/FBAA membership verified (optional)         │ │
│  │                                                         │ │
│  │      MFAA Number (if provided): _____________          │ │
│  │      [Check MFAA →]                                    │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Licence Verification Section - Buyer's Agent / Property Agent (Alternative)

```
┌───────────────────────────────────────────────────────────────┐
│  LICENCE VERIFICATION                                         │
│  ─────────────────────────────────────────────────────────    │
│                                                               │
│  Advisor Type: BUYER'S AGENT                                  │
│  State: NEW SOUTH WALES                                       │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                         │ │
│  │  STATE LICENCE CHECK                                    │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  Registry Links by State:                               │ │
│  │                                                         │ │
│  │  ● NSW (Selected)                                       │ │
│  │    [Open Service NSW Public Register →]                │ │
│  │    https://verify.licence.nsw.gov.au                   │ │
│  │                                                         │ │
│  │  ○ VIC                                                  │ │
│  │    [Open Consumer Affairs Victoria →]                  │ │
│  │    https://www.consumer.vic.gov.au/                   │ │
│  │    licensing-and-registration/public-register         │ │
│  │                                                         │ │
│  │  ○ QLD                                                  │ │
│  │    [Open OFT Queensland Register →]                    │ │
│  │    https://www.qld.gov.au/law/laws-regulated-         │ │
│  │    industries-and-accountability/queensland-          │ │
│  │    laws-and-regulations/regulated-industries-         │ │
│  │    and-licensing/property-industry-regulation         │ │
│  │                                                         │ │
│  │  ○ WA                                                   │ │
│  │    [Open WA Consumer Protection →]                     │ │
│  │    https://www.commerce.wa.gov.au/consumer-           │ │
│  │    protection/property-industry-licensing             │ │
│  │                                                         │ │
│  │  ○ SA                                                   │ │
│  │    [Open CBS South Australia →]                        │ │
│  │    https://www.cbs.sa.gov.au/                         │ │
│  │                                                         │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  [x] Licence number verified on state register         │ │
│  │                                                         │ │
│  │      Licence Number:       12345678                    │ │
│  │      Licence Type:         Real Estate Agent (Class 1)│ │
│  │      Expiry Date:          30 June 2026               │ │
│  │      Status:               Current ✓                   │ │
│  │                                                         │ │
│  │  [x] Name matches register                             │ │
│  │                                                         │ │
│  │  [ ] CPD requirements current (if verifiable)         │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Fraud Flags Section

```
┌───────────────────────────────────────────────────────────────┐
│  FRAUD FLAGS                                                  │
│  ─────────────────────────────────────────────────────────    │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                         │ │
│  │  DETECTED FLAGS (1)                                     │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  ⚠ EMAIL DOMAIN MISMATCH                               │ │
│  │                                                         │ │
│  │    Claimant email domain:    smithfinancial.au         │ │
│  │    Business website domain:  smithfinancial.com.au     │ │
│  │                                                         │ │
│  │    Assessment: LOW RISK                                 │ │
│  │    Note: Common for AU businesses to use both          │ │
│  │    .au and .com.au domains. Claimant acknowledged      │ │
│  │    in submission notes.                                │ │
│  │                                                         │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  PASSED CHECKS                                          │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │                                                         │ │
│  │  ✓ No multiple claim attempts from this account        │ │
│  │                                                         │ │
│  │  ✓ IP address analysis: Clean                          │ │
│  │    Location: Sydney, NSW, Australia                    │ │
│  │    Type: Residential ISP                               │ │
│  │    VPN/Proxy: No                                       │ │
│  │    Previous denials from IP: 0                         │ │
│  │                                                         │ │
│  │  ✓ Account age acceptable                              │ │
│  │    Created: 3 days before claim                        │ │
│  │    Minimum required: 0 days                            │ │
│  │                                                         │ │
│  │  ✓ No velocity anomalies                               │ │
│  │    Claims from this user: 1                            │ │
│  │    Claims for this business: 1                         │ │
│  │                                                         │ │
│  │  ✓ No duplicate submissions detected                   │ │
│  │                                                         │ │
│  │  ✓ Document metadata clean                             │ │
│  │    No editing software signatures detected             │ │
│  │    Creation dates consistent                           │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Decision Section

### Approve Decision Form

```
┌────────────────────────────────────────────────────────────────────────────┐
│  DECISION                                                                  │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                            │
│  ● Approve Claim    ○ Request More Info    ○ Deny Claim                   │
│                                                                            │
│  ════════════════════════════════════════════════════════════════════     │
│                                                                            │
│  APPROVE CLAIM                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                                                                      │ │
│  │  Verification Level to Grant:                                        │ │
│  │                                                                      │ │
│  │  ○ Basic                                                             │ │
│  │    Business ownership verified. No licence check.                   │ │
│  │                                                                      │ │
│  │  ● Verified                                                          │ │
│  │    Business ownership + licence verified.                           │ │
│  │                                                                      │ │
│  │  ○ Enhanced                                                          │ │
│  │    Full verification including identity + additional checks.        │ │
│  │                                                                      │ │
│  │  ─────────────────────────────────────────────────────────────────   │ │
│  │                                                                      │ │
│  │  Approval Notes (optional, sent to claimant):                       │ │
│  │  ┌────────────────────────────────────────────────────────────────┐ │ │
│  │  │ Your claim has been approved. Welcome to Advyser!              │ │ │
│  │  │                                                                │ │ │
│  │  │                                                                │ │ │
│  │  └────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                      │ │
│  │  ─────────────────────────────────────────────────────────────────   │ │
│  │                                                                      │ │
│  │  What happens on approval:                                           │ │
│  │  • Claimant becomes owner of listing                                │ │
│  │  • Verification badge added to profile                              │ │
│  │  • Claimant can edit all business details                          │ │
│  │  • Claimant receives access to leads dashboard                     │ │
│  │  • Approval email sent automatically                                │ │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Request More Info Decision Form

```
┌────────────────────────────────────────────────────────────────────────────┐
│  DECISION                                                                  │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                            │
│  ○ Approve Claim    ● Request More Info    ○ Deny Claim                   │
│                                                                            │
│  ════════════════════════════════════════════════════════════════════     │
│                                                                            │
│  REQUEST MORE INFORMATION                                                  │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                                                                      │ │
│  │  What additional information is needed?                             │ │
│  │                                                                      │ │
│  │  [ ] Additional identity verification                               │ │
│  │  [ ] Proof of business ownership (director certificate, etc)       │ │
│  │  [ ] Updated licence documentation                                  │ │
│  │  [x] Domain ownership verification                                  │ │
│  │  [ ] Photo holding ID                                               │ │
│  │  [ ] Business registration documents                                │ │
│  │  [ ] Other (specify below)                                         │ │
│  │                                                                      │ │
│  │  ─────────────────────────────────────────────────────────────────   │ │
│  │                                                                      │ │
│  │  Detailed Request (sent to claimant):                               │ │
│  │  ┌────────────────────────────────────────────────────────────────┐ │ │
│  │  │ Thank you for your claim request. To complete verification,   │ │ │
│  │  │ we need you to verify ownership of one of your email domains. │ │ │
│  │  │                                                                │ │ │
│  │  │ Please either:                                                 │ │ │
│  │  │ 1. Send us an email from john@smithfinancial.com.au, OR       │ │ │
│  │  │ 2. Add a TXT record to smithfinancial.au DNS                  │ │ │
│  │  │                                                                │ │ │
│  │  │ Reply to this email with confirmation once completed.         │ │ │
│  │  │                                                                │ │ │
│  │  └────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                      │ │
│  │  Response Deadline: [7 days ▼]                                      │ │
│  │                                                                      │ │
│  │  ─────────────────────────────────────────────────────────────────   │ │
│  │                                                                      │ │
│  │  What happens when sent:                                             │ │
│  │  • Status changes to "Needs More Info"                              │ │
│  │  • Email sent to claimant with request                              │ │
│  │  • Deadline set for response                                         │ │
│  │  • Claim returns to queue when response received                    │ │
│  │  • Auto-deny if no response by deadline                             │ │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Deny Decision Form

```
┌────────────────────────────────────────────────────────────────────────────┐
│  DECISION                                                                  │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                            │
│  ○ Approve Claim    ○ Request More Info    ● Deny Claim                   │
│                                                                            │
│  ════════════════════════════════════════════════════════════════════     │
│                                                                            │
│  DENY CLAIM                                                                │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                                                                      │ │
│  │  Denial Reason:                                                      │ │
│  │  ┌────────────────────────────────────────────────────────────────┐ │ │
│  │  │ Select a reason...                                         ▼  │ │ │
│  │  │ ─────────────────────────────────────────────────────────────  │ │ │
│  │  │ • Unable to verify identity                                   │ │ │
│  │  │ • Unable to verify business ownership                         │ │ │
│  │  │ • Licence not found or not current                            │ │ │
│  │  │ • ABN verification failed                                     │ │ │
│  │  │ • Suspected fraudulent claim                                  │ │ │
│  │  │ • Business already claimed by another user                    │ │ │
│  │  │ • Insufficient documentation provided                         │ │ │
│  │  │ • Failed to respond to info request                          │ │ │
│  │  │ • Other (must specify)                                        │ │ │
│  │  └────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                      │ │
│  │  ─────────────────────────────────────────────────────────────────   │ │
│  │                                                                      │ │
│  │  Denial Notes (sent to claimant):                                   │ │
│  │  ┌────────────────────────────────────────────────────────────────┐ │ │
│  │  │ We were unable to approve your claim for Smith Financial      │ │ │
│  │  │ Planning at this time.                                        │ │ │
│  │  │                                                                │ │ │
│  │  │ Reason: [Auto-populated based on selection]                   │ │ │
│  │  │                                                                │ │ │
│  │  │ If you believe this is in error, you may submit a new claim  │ │ │
│  │  │ with additional documentation after 30 days.                  │ │ │
│  │  │                                                                │ │ │
│  │  └────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                      │ │
│  │  ─────────────────────────────────────────────────────────────────   │ │
│  │                                                                      │ │
│  │  [ ] Block this user from future claims (fraud cases only)         │ │
│  │  [ ] Flag this ABN for review on future claims                     │ │
│  │                                                                      │ │
│  │  ─────────────────────────────────────────────────────────────────   │ │
│  │                                                                      │ │
│  │  ⚠ Warning: Denial decisions are recorded and affect user's       │ │
│  │  ability to make future claims. Ensure all checks completed.       │ │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Internal Notes Section

```
┌────────────────────────────────────────────────────────────────────────────┐
│  INTERNAL NOTES (Not shared with claimant)                                │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                                                                      │ │
│  │  Add Note:                                                           │ │
│  │  ┌────────────────────────────────────────────────────────────────┐ │ │
│  │  │ Verified .au domain ownership via WHOIS - same registrant     │ │ │
│  │  │ details as .com.au domain. Confident this is legitimate.      │ │ │
│  │  │                                                                │ │ │
│  │  └────────────────────────────────────────────────────────────────┘ │ │
│  │  [Add Note]                                                          │ │
│  │                                                                      │ │
│  │  ─────────────────────────────────────────────────────────────────   │ │
│  │                                                                      │ │
│  │  Previous Notes:                                                     │ │
│  │                                                                      │ │
│  │  ┌────────────────────────────────────────────────────────────────┐ │ │
│  │  │ [No previous notes for this claim]                            │ │ │
│  │  └────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Action Buttons

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│                                         [Cancel]    [Submit Decision]      │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

## Tablet Layout (768px)

```
┌────────────────────────────────────────────────────────┐
│  ADVYSER ADMIN              [≡]        [Admin User ▼]  │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ← Back to Claims Queue                                │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │                                                  │ │
│  │  Smith Financial Planning                        │ │
│  │  Claim #4521                                     │ │
│  │                                                  │ │
│  │  Status: [Pending ▼]   Submitted: 5 Jan 2026    │ │
│  │                                                  │ │
│  │  [Approve]  [Request Info]  [Deny]              │ │
│  │                                                  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ═══════════════════════════════════════════════════  │
│                                                        │
│  [Submitted Info ▼]  [Verification ▼]                 │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ SUBMITTED INFORMATION                            │ │
│  │                                                  │ │
│  │ CLAIMANT                                         │ │
│  │ Name: John Smith                                 │ │
│  │ Email: john@smithfinancial.au                   │ │
│  │ Phone: 0412 345 678                              │ │
│  │ Role: Owner/Director                             │ │
│  │ Account: 2 Jan 2026 (3 days ago)                │ │
│  │                                                  │ │
│  │ BUSINESS                                         │ │
│  │ Trading: Smith Financial Planning               │ │
│  │ Legal: Smith Financial Pty Ltd                  │ │
│  │ ABN: 12 345 678 901                             │ │
│  │ Address: 123 Financial Street...                │ │
│  │                                                  │ │
│  │ CREDENTIALS                                      │ │
│  │ Type: ASIC FAR                                   │ │
│  │ Number: 001234567                                │ │
│  │ AFSL: XYZ Wealth (123456)                       │ │
│  │                                                  │ │
│  │ PROOF OF CONTROL                                 │ │
│  │ Method: Email Domain                             │ │
│  │ Status: Partial Match                           │ │
│  │                                                  │ │
│  │ EVIDENCE (3 files)                              │ │
│  │ [ASIC Letter] [Photo ID] [Business Card]       │ │
│  │                                                  │ │
│  │ NOTES                                            │ │
│  │ "I am the owner and principal..."               │ │
│  │                                                  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ VERIFICATION CHECKS                              │ │
│  │                                                  │ │
│  │ ABN LOOKUP                                       │ │
│  │ Status: Active ✓                                 │ │
│  │ Name Match: ✓                                    │ │
│  │ Address Match: ✓                                 │ │
│  │ [Open ABN Lookup →]                             │ │
│  │                                                  │ │
│  │ LICENCE (Financial Adviser)                     │ │
│  │ [x] Checked ASIC FAR                            │ │
│  │ [x] Name matches                                 │ │
│  │ [x] Status: Current                              │ │
│  │ [x] Details match                                │ │
│  │ [Open MoneySmart →]                             │ │
│  │                                                  │ │
│  │ FRAUD FLAGS                                      │ │
│  │ ⚠ 1 flag (email domain mismatch)               │ │
│  │ ✓ 5 checks passed                               │ │
│  │                                                  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ═══════════════════════════════════════════════════  │
│                                                        │
│  DECISION                                              │
│  ○ Approve  ○ Request Info  ○ Deny                   │
│                                                        │
│  [Decision form based on selection]                   │
│                                                        │
│  INTERNAL NOTES                                        │
│  [Add note...]                                        │
│                                                        │
│  [Cancel]  [Submit Decision]                          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Mobile Layout (375px)

```
┌─────────────────────────────────┐
│  ADVYSER      [≡]    [Admin ▼] │
├─────────────────────────────────┤
│                                 │
│  ← Back                         │
│                                 │
│  Smith Financial Planning       │
│  Claim #4521                    │
│  ──────────────────────────     │
│                                 │
│  Status: [Pending ▼]            │
│  Submitted: 5 Jan 2026          │
│                                 │
│  ┌─────────────────────────┐   │
│  │ [Approve] [Info] [Deny] │   │
│  └─────────────────────────┘   │
│                                 │
│  ═════════════════════════════  │
│                                 │
│  [Submitted Info]               │
│  [Verification]                 │
│  [Decision]                     │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  CLAIMANT                       │
│  ┌───────────────────────────┐ │
│  │ John Smith                │ │
│  │ john@smithfinancial.au    │ │
│  │ 0412 345 678              │ │
│  │ Owner/Director            │ │
│  │ Account: 3 days ago       │ │
│  └───────────────────────────┘ │
│                                 │
│  BUSINESS                       │
│  ┌───────────────────────────┐ │
│  │ Smith Financial Planning  │ │
│  │ ABN: 12 345 678 901       │ │
│  │ Sydney NSW 2000           │ │
│  │ [View Details]            │ │
│  └───────────────────────────┘ │
│                                 │
│  CREDENTIALS                    │
│  ┌───────────────────────────┐ │
│  │ ASIC FAR: 001234567       │ │
│  │ AFSL: 123456              │ │
│  │ [View Details]            │ │
│  └───────────────────────────┘ │
│                                 │
│  EVIDENCE (3)                   │
│  ┌───────────────────────────┐ │
│  │ [PDF] [IMG] [PDF]         │ │
│  │ [View All]                │ │
│  └───────────────────────────┘ │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  ABN STATUS: Active ✓           │
│  LICENCE: Verified ✓            │
│  FLAGS: 1 warning               │
│                                 │
│  [View Full Verification]      │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  DECISION                       │
│  ○ Approve                      │
│  ○ Request More Info            │
│  ○ Deny                         │
│                                 │
│  [Form fields...]              │
│                                 │
│  [Submit Decision]              │
│                                 │
└─────────────────────────────────┘
```

## Interactions

### Page Load
1. Fetch claim details from API
2. Auto-trigger ABN lookup (cached if recent)
3. Display all submitted information
4. Pre-populate licence verification based on advisor type
5. Display any auto-detected fraud flags

### ABN Lookup
- Auto-runs on page load if not cached (<24h)
- Manual "Refresh" button for on-demand check
- Results show match/mismatch indicators
- Link opens ABR website in new tab

### Licence Verification Checklist
- Manual checkboxes for admin to confirm
- Each checkbox has "Open [Registry]" link
- Links open in new tab
- Checkboxes auto-save as draft
- All must be checked for approval (or noted why not)

### Evidence File Viewing
- Thumbnails show file type icon
- Click "View Full" opens lightbox/modal
- PDF renders inline
- Images zoom-able
- "Download" saves to local machine
- "Download All" creates ZIP

### Decision Submission
1. Select decision type (radio)
2. Complete required fields for that decision
3. Add internal notes (optional)
4. Click "Submit Decision"
5. Confirmation modal shows summary
6. On confirm:
   - Updates claim status
   - Sends appropriate email to claimant
   - Logs action in audit trail
   - Redirects to next pending claim (or queue)

### Status Dropdown
- Quick-change status without full decision
- Used for reassigning or admin corrections
- Requires confirmation
- Logged in audit trail

### Keyboard Shortcuts
- `A` - Focus Approve
- `I` - Focus Request Info
- `D` - Focus Deny
- `S` - Submit Decision (when form valid)
- `Esc` - Cancel / Close modals

## Data Requirements

### Claim Detail Object
```typescript
interface ClaimDetail {
  id: string;
  status: 'pending' | 'needs_more_info' | 'approved' | 'denied';
  submittedAt: Date;
  assignedTo: string | null;

  claimant: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    roleClaimed: string;
    accountCreatedAt: Date;
    emailVerified: boolean;
    phoneVerified: boolean;
    previousClaims: number;
    otherBusinesses: number;
  };

  business: {
    id: string;
    tradingName: string;
    legalName: string;
    abn: string;
    acn?: string;
    address: Address;
    website?: string;
    phone?: string;
    email?: string;
    existingListingId?: string;
    listingStatus: 'unclaimed' | 'claimed';
    profileCompleteness: number;
  };

  credentials: {
    type: CredentialType;
    number: string;
    afslHolder?: string;
    afslNumber?: string;
    state?: string;
    additionalCredentials: string[];
  };

  proofOfControl: {
    method: 'email_domain' | 'phone' | 'document';
    emailUsed?: string;
    emailDomain?: string;
    businessDomain?: string;
    status: 'verified' | 'partial' | 'failed';
    notes?: string;
  };

  evidenceFiles: {
    id: string;
    filename: string;
    fileType: string;
    fileSize: number;
    thumbnailUrl: string;
    downloadUrl: string;
    uploadedAt: Date;
    virusScanStatus: 'passed' | 'failed' | 'pending';
  }[];

  submissionNotes: string;

  internalNotes: {
    id: string;
    authorId: string;
    authorName: string;
    content: string;
    createdAt: Date;
  }[];
}
```

### ABN Lookup Response
```typescript
interface ABNLookupResult {
  abn: string;
  status: 'active' | 'cancelled';
  entityName: string;
  entityType: string;
  effectiveFrom: Date;
  gstRegistered: boolean;
  gstRegisteredFrom?: Date;
  businessAddress: {
    state: string;
    postcode: string;
  };
  tradingNames: {
    name: string;
    effectiveFrom: Date;
  }[];
  lastChecked: Date;
}
```

### Fraud Flags
```typescript
interface FraudFlags {
  flags: {
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    details: Record<string, any>;
  }[];
  passedChecks: {
    type: string;
    description: string;
    details?: string;
  }[];
}
```

## Permissions

- **Access**: Only users with role='admin' can access
- **Approve/Deny**: All admins can make decisions
- **Block User**: May require senior admin approval
- **View Evidence**: Audit logged
- **Download Evidence**: Audit logged

## Audit Logging

All actions on this page are logged:
- Page view (with claim ID)
- ABN lookup triggered
- Evidence file viewed
- Evidence file downloaded
- Internal note added
- Decision submitted (with full details)
- Status changed

## Error States

### Claim Not Found
```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                        (error icon)                            │
│                                                                │
│               Claim #4521 not found                            │
│                                                                │
│    This claim may have been deleted or you may not have       │
│    permission to view it.                                      │
│                                                                │
│                 [Back to Claims Queue]                         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### ABN Lookup Failed
```
┌───────────────────────────────────────────────────────────────┐
│  ABN LOOKUP RESULT                                            │
│                                                               │
│  ⚠ Unable to retrieve ABN data                               │
│                                                               │
│  The ABR service may be temporarily unavailable.             │
│  Please verify manually or try again later.                  │
│                                                               │
│  [Retry] [Open ABN Lookup Manually →]                        │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Decision Submission Failed
```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  ⚠ Failed to submit decision                                  │
│                                                                │
│  Error: [Specific error message]                              │
│                                                                │
│  Your decision has been saved as a draft. Please try again   │
│  or contact support if the issue persists.                   │
│                                                                │
│  [Retry] [Save Draft] [Contact Support]                       │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Accessibility

- All form fields have associated labels
- Checkboxes announced with state
- External links indicate new tab
- File type icons have text alternatives
- Error messages linked to fields
- Focus management on section changes
- Skip link to decision section
- High contrast for status indicators
- Keyboard accessible throughout
