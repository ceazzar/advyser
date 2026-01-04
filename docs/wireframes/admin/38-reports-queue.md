# Admin - Reports Queue Wireframe

## Page Purpose
Central queue for managing user-submitted reports about profiles, messages, reviews, and advisor conduct. Allows admins to investigate complaints, take appropriate action, and maintain platform safety and trust.

## URL Pattern
`/admin/reports`

## User Role
admin (authenticated, role=admin)

## Desktop Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│  ADVYSER ADMIN                                                    [Admin User ▼]         │
├─────────────────┬────────────────────────────────────────────────────────────────────────┤
│                 │                                                                        │
│  Dashboard      │  Reports Queue                                                         │
│                 │  ─────────────────────────────────────────────────────────────────     │
│  Claims         │                                                                        │
│                 │  ┌──────────────────────────────────────────────────────────────────┐ │
│  Listings       │  │ Open (12)      │      In Progress (3)      │      Resolved       │ │
│                 │  │ ═══════════                                                      │ │
│  Reviews        │  └──────────────────────────────────────────────────────────────────┘ │
│                 │                                                                        │
│  ● Reports      │  ┌──────────────────────────────────────────────────────────────────┐ │
│                 │  │                                                                  │ │
│  Categories     │  │  Filters:                                                        │ │
│                 │  │  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐          │ │
│  Analytics      │  │  │ Report Type ▼ │ │ Priority ▼    │ │ Date Range ▼  │          │ │
│                 │  │  │ All Types     │ │ All           │ │ All Time      │          │ │
│  Users          │  │  └───────────────┘ └───────────────┘ └───────────────┘          │ │
│                 │  │                                                                  │ │
│                 │  │  Search: [Reporter, reported entity...___________] [Search]     │ │
│                 │  │                                                                  │ │
│                 │  └──────────────────────────────────────────────────────────────────┘ │
│                 │                                                                        │
│                 │  ┌──────────────────────────────────────────────────────────────────┐ │
│                 │  │                                                                  │ │
│                 │  │  REPORTER       │ REPORTED ENTITY  │ TYPE      │ REASON          │ │
│                 │  │                 │                  │           │                 │ │
│                 │  │  DATE           │ PRIORITY         │ STATUS    │ ACTION          │ │
│                 │  │ ────────────────┼──────────────────┼───────────┼─────────────────│ │
│                 │  │                 │                  │           │                 │ │
│                 │  │  Sarah Chen     │ John Smith       │ Advisor   │ Misleading      │ │
│                 │  │  Consumer       │ Smith Financial  │ Conduct   │ fee claims      │ │
│                 │  │                 │ Planning         │           │                 │ │
│                 │  │                 │                  │           │                 │ │
│                 │  │  2 hours ago    │ ● HIGH           │ ○ Open    │ [Review]        │ │
│                 │  │ ────────────────┼──────────────────┼───────────┼─────────────────│ │
│                 │  │                 │                  │           │                 │ │
│                 │  │  Mike Wilson    │ Review #4521     │ Review    │ Fake review     │ │
│                 │  │  Consumer       │ on Brisbane      │           │                 │ │
│                 │  │                 │ Loans Direct     │           │                 │ │
│                 │  │                 │                  │           │                 │ │
│                 │  │  5 hours ago    │ ● MEDIUM         │ ○ Open    │ [Review]        │ │
│                 │  │ ────────────────┼──────────────────┼───────────┼─────────────────│ │
│                 │  │                 │                  │           │                 │ │
│                 │  │  Lisa Wong      │ Message from     │ Message   │ Harassment      │ │
│                 │  │  Advisor        │ User #8821       │           │                 │ │
│                 │  │                 │                  │           │                 │ │
│                 │  │                 │                  │           │                 │ │
│                 │  │  1 day ago      │ ● HIGH           │ ○ Open    │ [Review]        │ │
│                 │  │ ────────────────┼──────────────────┼───────────┼─────────────────│ │
│                 │  │                 │                  │           │                 │ │
│                 │  │  David Brown    │ Perth Property   │ Profile   │ Inappropriate   │ │
│                 │  │  Consumer       │ Group            │           │ images          │ │
│                 │  │                 │ Listing #2341    │           │                 │ │
│                 │  │                 │                  │           │                 │ │
│                 │  │  1 day ago      │ ○ LOW            │ ○ Open    │ [Review]        │ │
│                 │  │ ────────────────┼──────────────────┼───────────┼─────────────────│ │
│                 │  │                 │                  │           │                 │ │
│                 │  │  Amy Zhang      │ Tom Wilson       │ Advisor   │ Unlicensed      │ │
│                 │  │  Advisor        │ Gold Coast       │ Conduct   │ practice        │ │
│                 │  │                 │ Advocates        │           │                 │ │
│                 │  │                 │                  │           │                 │ │
│                 │  │  2 days ago     │ ● CRITICAL       │ ○ Open    │ [Review]        │ │
│                 │  │ ────────────────┼──────────────────┼───────────┼─────────────────│ │
│                 │  │                 │                  │           │                 │ │
│                 │  │  Jane Smith     │ Review #4498     │ Review    │ Defamatory      │ │
│                 │  │  Advisor        │ on Melbourne     │           │ content         │ │
│                 │  │                 │ Buyers Agency    │           │                 │ │
│                 │  │                 │                  │           │                 │ │
│                 │  │  2 days ago     │ ● MEDIUM         │ ○ Open    │ [Review]        │ │
│                 │  │                 │                  │           │                 │ │
│                 │  └──────────────────────────────────────────────────────────────────┘ │
│                 │                                                                        │
│                 │  Showing 6 of 12 open reports                    [< Prev] [Next >]    │
│                 │                                                                        │
└─────────────────┴────────────────────────────────────────────────────────────────────────┘
```

## Tab States

### Open Tab (Default)
```
┌──────────────────────────────────────────────────────────────────┐
│ Open (12)      │      In Progress (3)      │      Resolved       │
│ ═══════════                                                      │
└──────────────────────────────────────────────────────────────────┘
```
- New reports awaiting review
- Sorted by: Priority (desc), then date

### In Progress Tab
```
┌──────────────────────────────────────────────────────────────────┐
│ Open (12)      │      In Progress (3)      │      Resolved       │
│                     ══════════════════                           │
└──────────────────────────────────────────────────────────────────┘
```
- Reports being actively investigated
- Shows assigned admin
- Awaiting response from parties

### Resolved Tab
```
┌──────────────────────────────────────────────────────────────────┐
│ Open (12)      │      In Progress (3)      │      Resolved       │
│                                                 ════════════     │
└──────────────────────────────────────────────────────────────────┘
```
- Completed reports
- Shows resolution type
- Searchable history

## Components

### Filter Bar

```
┌───────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│  Filters:                                                                 │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ │
│  │ Report Type ▼ │ │ Priority ▼    │ │ Date Range ▼  │ │ Reporter Type▼│ │
│  │ All Types     │ │ All           │ │ All Time      │ │ All           │ │
│  └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘ │
│                                                                           │
│  Search: [Reporter name, entity, keywords...___________] [Search]        │
│                                                                           │
│  Active Filters: [Advisor Conduct ×] [High Priority ×]  [Clear All]      │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

**Report Type:**
- All Types
- Profile (listing content)
- Message (communication)
- Review (review content)
- Advisor Conduct (behavior/practice)

**Priority:**
- All
- Critical (safety/legal)
- High (conduct complaints)
- Medium (content issues)
- Low (minor complaints)

**Reporter Type:**
- All
- Consumer
- Advisor
- System (auto-detected)

### Reports Table

**Columns:**
| Column | Width | Description |
|--------|-------|-------------|
| Reporter | 140px | Name and type |
| Reported Entity | 160px | What was reported |
| Type | 80px | Report category |
| Reason | 120px | Brief description |
| Date | 100px | Relative timestamp |
| Priority | 80px | Priority badge |
| Status | 80px | Current status |
| Action | 80px | Review button |

### Priority Badges

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  PRIORITY LEVELS:                                                   │
│                                                                     │
│  ● CRITICAL  - Safety concerns, legal issues, unlicensed practice  │
│  ● HIGH      - Conduct complaints, harassment, misleading claims    │
│  ● MEDIUM    - Content issues, fake reviews, minor policy breach    │
│  ○ LOW       - Quality concerns, preferences, minor complaints      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Report Detail Modal

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                                                                            [×] │
│  Report #R-4521                                              Status: ○ Open   │
│  ─────────────────────────────────────────────────────────────────────────     │
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                         │  │
│  │  REPORT SUMMARY                                                         │  │
│  │  ─────────────────────────────────────────────────────────────────────  │  │
│  │                                                                         │  │
│  │  Type: Advisor Conduct                                                  │  │
│  │  Priority: ● HIGH                                                       │  │
│  │  Submitted: 5 Jan 2026, 10:34 AM (2 hours ago)                         │  │
│  │                                                                         │  │
│  │  Reason Selected: Misleading information                                │  │
│  │                                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  ┌──────────────────────────────┐  ┌────────────────────────────────────────┐ │
│  │                              │  │                                        │ │
│  │  REPORTER INFORMATION        │  │  REPORTED ENTITY                       │ │
│  │  ──────────────────────────  │  │  ────────────────────────────────────  │ │
│  │                              │  │                                        │ │
│  │  Name: Sarah Chen            │  │  Type: Advisor                         │ │
│  │  Type: Consumer              │  │  Name: John Smith                      │ │
│  │  Email: sarah@email.com      │  │  Business: Smith Financial Planning   │ │
│  │                              │  │                                        │ │
│  │  Account Created:            │  │  Advisor Type: Financial Adviser      │ │
│  │  15 Nov 2025                 │  │  Verification: ✓ Verified             │ │
│  │                              │  │                                        │ │
│  │  Previous Reports: 0         │  │  Previous Reports Against: 1          │ │
│  │  Report History: Clean       │  │  (resolved - no action)               │ │
│  │                              │  │                                        │ │
│  │  [View User Profile →]       │  │  [View Advisor Profile →]             │ │
│  │                              │  │                                        │ │
│  └──────────────────────────────┘  └────────────────────────────────────────┘ │
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                         │  │
│  │  REPORT DETAILS                                                         │  │
│  │  ─────────────────────────────────────────────────────────────────────  │  │
│  │                                                                         │  │
│  │  Reporter's Description:                                                │  │
│  │  ┌───────────────────────────────────────────────────────────────────┐ │  │
│  │  │ "I had an initial consultation with John Smith where he claimed  │ │  │
│  │  │ there would be 'no fees for the first meeting'. After the       │ │  │
│  │  │ meeting, I received an invoice for $330 for 'consultation fees'. │ │  │
│  │  │ When I questioned this, he said the 'no fee' only applied to    │ │  │
│  │  │ phone calls, not in-person meetings. This was not made clear    │ │  │
│  │  │ anywhere on his profile or in our email exchanges.               │ │  │
│  │  │                                                                   │ │  │
│  │  │ I believe this is misleading advertising and other potential    │ │  │
│  │  │ clients should be warned."                                       │ │  │
│  │  └───────────────────────────────────────────────────────────────────┘ │  │
│  │                                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                         │  │
│  │  EVIDENCE ATTACHED                                                      │  │
│  │  ─────────────────────────────────────────────────────────────────────  │  │
│  │                                                                         │  │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐                           │  │
│  │  │           │  │           │  │           │                           │  │
│  │  │   [PDF]   │  │   [IMG]   │  │   [IMG]   │                           │  │
│  │  │           │  │           │  │           │                           │  │
│  │  │  Invoice  │  │  Email    │  │  Profile  │                           │  │
│  │  │  330.pdf  │  │  thread   │  │  screenshot│                          │  │
│  │  │           │  │           │  │           │                           │  │
│  │  └───────────┘  └───────────┘  └───────────┘                           │  │
│  │   [View]         [View]         [View]                                  │  │
│  │                                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                         │  │
│  │  REPORTED CONTENT (Advisor's Profile)                                   │  │
│  │  ─────────────────────────────────────────────────────────────────────  │  │
│  │                                                                         │  │
│  │  Current profile description includes:                                  │  │
│  │  "...FREE initial consultation to discuss your financial goals..."    │  │
│  │                                                                         │  │
│  │  Fee structure section states:                                          │  │
│  │  "Initial consultation: No charge for phone consultations.              │  │
│  │  In-person meetings may incur a fee."                                  │  │
│  │                                                                         │  │
│  │  [View Full Profile →]                                                 │  │
│  │                                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  ─────────────────────────────────────────────────────────────────────────     │
│                                                                                │
│  ADMIN ACTIONS                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                         │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐            │  │
│  │  │  Take Action   │  │    Dismiss     │  │   Escalate     │            │  │
│  │  │                │  │                │  │                │            │  │
│  │  └────────────────┘  └────────────────┘  └────────────────┘            │  │
│  │                                                                         │  │
│  │  ┌────────────────┐  ┌────────────────┐                                │  │
│  │  │ Request Info   │  │ Assign to Me   │                                │  │
│  │  │                │  │                │                                │  │
│  │  └────────────────┘  └────────────────┘                                │  │
│  │                                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

### Take Action Modal

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                        [×] │
│  Take Action on Report #R-4521                                             │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                            │
│  Action Type:                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ Select an action...                                               ▼  │ │
│  │ ─────────────────────────────────────────────────────────────────    │ │
│  │ PROFILE/LISTING ACTIONS                                              │ │
│  │ • Require profile update                                             │ │
│  │ • Remove specific content                                            │ │
│  │ • Suspend listing                                                    │ │
│  │                                                                       │ │
│  │ ADVISOR ACTIONS                                                       │ │
│  │ • Send formal warning                                                │ │
│  │ • Require training/acknowledgment                                    │ │
│  │ • Suspend advisor account                                            │ │
│  │ • Permanent ban                                                      │ │
│  │                                                                       │ │
│  │ USER ACTIONS (if reporter violated guidelines)                       │ │
│  │ • Warn reporter                                                      │ │
│  │ • Suspend reporter account                                           │ │
│  │                                                                       │ │
│  │ EXTERNAL ESCALATION                                                   │ │
│  │ • Report to ASIC                                                     │ │
│  │ • Report to state licensing body                                     │ │
│  │ • Recommend legal consultation                                       │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  ────────────────────────────────────────────────────────────────────────  │
│                                                                            │
│  Action Details:                                                           │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                                                                      │ │
│  │ [Details shown based on action selected]                            │ │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  Resolution Notes (sent to reporter):                                      │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ Thank you for your report. We have investigated the matter and      │ │
│  │ have taken action to address the issue. The advisor has been        │ │
│  │ required to update their profile to clarify their fee structure.    │ │
│  │                                                                      │ │
│  │ We appreciate you helping us maintain platform quality.             │ │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  Internal Notes (not shared):                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ Reviewed profile - the wording was ambiguous. Required advisor to   │ │
│  │ make fee structure explicitly clear. First report against this      │ │
│  │ advisor, giving benefit of doubt but flagging for monitoring.       │ │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  [ ] Notify reporter of resolution                                        │
│  [ ] Notify reported party of action taken                                │
│  [ ] Flag this advisor for monitoring (30 days)                          │
│                                                                            │
│                              [Cancel]    [Submit Action]                  │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Dismiss Report Modal

```
┌────────────────────────────────────────────────────────────────┐
│                                                            [×] │
│  Dismiss Report                                                │
│  ──────────────────────────────────────────────────────────    │
│                                                                │
│  Dismissal Reason:                                             │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Select a reason...                                    ▼  │ │
│  │ ───────────────────────────────────────────────────────  │ │
│  │ • No policy violation found                              │ │
│  │ • Insufficient evidence                                  │ │
│  │ • Already resolved                                       │ │
│  │ • Personal dispute - not platform matter                 │ │
│  │ • False/malicious report                                 │ │
│  │ • Duplicate report                                       │ │
│  │ • Other (specify below)                                  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Resolution Notes (to reporter):                               │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Thank you for your report. After investigation, we      │ │
│  │ found that the advisor's profile does state that        │ │
│  │ in-person meetings may incur fees. While we understand  │ │
│  │ this may have been unclear, it does not constitute a    │ │
│  │ policy violation.                                        │ │
│  │                                                          │ │
│  │ We have noted your feedback and will consider requiring │ │
│  │ clearer fee disclosures in future platform updates.     │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Internal Notes:                                               │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  [ ] Notify reporter of resolution                            │
│  [ ] Flag reporter for false reports (if malicious)          │
│                                                                │
│                          [Cancel]    [Dismiss Report]         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Escalate Report Modal

```
┌────────────────────────────────────────────────────────────────┐
│                                                            [×] │
│  Escalate Report                                               │
│  ──────────────────────────────────────────────────────────    │
│                                                                │
│  Escalate To:                                                  │
│  ○ Senior Admin                                               │
│  ○ Legal Team                                                 │
│  ● External Regulator                                         │
│                                                                │
│  ────────────────────────────────────────────────────────────  │
│                                                                │
│  External Regulator:                                           │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Select regulator...                                   ▼  │ │
│  │ ───────────────────────────────────────────────────────  │ │
│  │ • ASIC - Australian Securities & Investments Commission  │ │
│  │ • NSW Fair Trading                                       │ │
│  │ • VIC Consumer Affairs                                   │ │
│  │ • QLD Office of Fair Trading                            │ │
│  │ • Other state regulator                                  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Escalation Reason:                                            │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Report alleges unlicensed financial advice. This is a   │ │
│  │ serious matter that falls under ASIC jurisdiction.      │ │
│  │ Recommending escalation for proper investigation.       │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ⚠ This will:                                                 │
│  • Mark report as escalated                                   │
│  • Suspend the advisor's account pending investigation        │
│  • Generate a formal report for the regulator                 │
│  • Notify senior admin                                        │
│                                                                │
│                          [Cancel]    [Escalate Report]        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Tablet Layout (768px)

```
┌────────────────────────────────────────────────────────┐
│  ADVYSER ADMIN              [≡]        [Admin User ▼]  │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Reports Queue                                         │
│  ────────────────────────────────────────────────────  │
│                                                        │
│  ┌────────────────────────────────────────────────┐   │
│  │ Open (12)  │ In Progress (3)  │ Resolved      │   │
│  │ ═══════════                                    │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
│  [Filters ▼]              [________________] [Search] │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Sarah Chen (Consumer)               ● HIGH       │ │
│  │                                                  │ │
│  │ Reported: John Smith                            │ │
│  │ Smith Financial Planning                        │ │
│  │                                                  │ │
│  │ Type: Advisor Conduct                           │ │
│  │ Reason: Misleading fee claims                   │ │
│  │                                                  │ │
│  │ 2 hours ago                          ○ Open    │ │
│  │                                                  │ │
│  │ [Review]                                        │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Mike Wilson (Consumer)              ● MEDIUM     │ │
│  │                                                  │ │
│  │ Reported: Review #4521                          │ │
│  │ on Brisbane Loans Direct                        │ │
│  │                                                  │ │
│  │ Type: Review                                    │ │
│  │ Reason: Fake review                             │ │
│  │                                                  │ │
│  │ 5 hours ago                          ○ Open    │ │
│  │                                                  │ │
│  │ [Review]                                        │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  [Load More...]                                       │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Mobile Layout (375px)

```
┌─────────────────────────────────┐
│  ADVYSER      [≡]    [Admin ▼] │
├─────────────────────────────────┤
│                                 │
│  Reports Queue                  │
│  ──────────────────────────     │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Open │ In Prog │ Resolved│ │
│  │ (12) │ (3)     │         │ │
│  │ ═════                     │ │
│  └───────────────────────────┘ │
│                                 │
│  [Filters ▼]    [Search ▼]     │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Sarah Chen                │ │
│  │ Consumer                  │ │
│  │                           │ │
│  │ → John Smith              │ │
│  │   Smith Financial         │ │
│  │                           │ │
│  │ Advisor Conduct           │ │
│  │ Misleading fee claims     │ │
│  │                           │ │
│  │ ● HIGH      ○ Open        │ │
│  │ 2 hours ago               │ │
│  │                           │ │
│  │ [Review]                  │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Amy Zhang                 │ │
│  │ Advisor                   │ │
│  │                           │ │
│  │ → Tom Wilson              │ │
│  │   Gold Coast Advocates    │ │
│  │                           │ │
│  │ Advisor Conduct           │ │
│  │ Unlicensed practice       │ │
│  │                           │ │
│  │ ● CRITICAL   ○ Open       │ │
│  │ 2 days ago                │ │
│  │                           │ │
│  │ [Review]                  │ │
│  └───────────────────────────┘ │
│                                 │
│  [Load More...]                │
│                                 │
└─────────────────────────────────┘
```

## Interactions

### Review Report Flow
1. Click [Review] button
2. Modal opens with full report details
3. Review evidence, context, history
4. Choose action: Take Action / Dismiss / Escalate
5. Complete action form
6. Submit with notes
7. Notifications sent as configured
8. Return to queue

### Assign Report
- Click "Assign to Me" to claim
- Shows as "In Progress" with your name
- Other admins can reassign
- Auto-assignment based on load possible

### Request Info
- Send message to reporter or reported party
- Report moves to "In Progress"
- Returns to queue when response received

### Evidence Viewing
- Click thumbnails to view full-size
- PDF renders in modal
- Images zoomable
- Download option available

## Data Requirements

### Report List Item
```typescript
interface ReportItem {
  id: string;
  reporterName: string;
  reporterType: 'consumer' | 'advisor' | 'system';
  reporterEmail: string;
  reporterAccountId: string;

  reportedEntityType: 'profile' | 'message' | 'review' | 'advisor_conduct';
  reportedEntityId: string;
  reportedEntityName: string;
  reportedPartyName?: string;
  reportedPartyId?: string;

  reason: string;
  reasonCategory: string;
  description: string;

  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved';

  assignedTo?: string;
  submittedAt: Date;

  evidenceFiles: EvidenceFile[];

  previousReportsAgainstEntity: number;
  previousReportsByReporter: number;
}
```

### Report Resolution
```typescript
interface ReportResolution {
  reportId: string;
  actionType: string;
  actionDetails: Record<string, any>;
  resolutionNotes: string;
  internalNotes: string;
  resolvedBy: string;
  resolvedAt: Date;
  notificationsSent: string[];
}
```

## Permissions

- **Access**: Only users with role='admin' can access
- **Take Action**: All admins
- **Dismiss**: All admins
- **Escalate to Senior**: All admins
- **Escalate to External**: May require senior admin
- **Permanent Ban**: Requires senior admin
- **Audit Logging**: All actions logged

## Audit Log Events

- Report opened for review
- Report assigned to admin
- Action taken (with details)
- Report dismissed (with reason)
- Report escalated (with destination)
- Notifications sent
- Status changed

## Error States

### Load Error
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│                       (error icon)                            │
│                                                               │
│            Unable to load reports                             │
│                                                               │
│        There was an error fetching report data.              │
│                   [Retry] [Contact Support]                   │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Empty State
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│                      (checkmark icon)                         │
│                                                               │
│              No open reports                                  │
│                                                               │
│        All reports have been reviewed. Great work!           │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Accessibility

- Priority badges have text labels
- Evidence files have descriptive names
- Modal focus management
- Keyboard navigation throughout
- Screen reader announces priority levels
- Form validation announced
