# Admin - Reviews Moderation Wireframe

## Page Purpose
Administrative interface for moderating user reviews of advisors. Ensures review authenticity, filters inappropriate content, and maintains platform integrity by verifying reviews come from genuine clients who have interacted with advisors.

## URL Pattern
`/admin/reviews`

## User Role
admin (authenticated, role=admin)

## Desktop Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│  ADVYSER ADMIN                                                    [Admin User ▼]         │
├─────────────────┬────────────────────────────────────────────────────────────────────────┤
│                 │                                                                        │
│  Dashboard      │  Reviews Moderation                                                    │
│                 │  ─────────────────────────────────────────────────────────────────     │
│  Claims         │                                                                        │
│                 │  ┌──────────────────────────────────────────────────────────────────┐ │
│  Listings       │  │ Pending (8)       │       Published       │       Rejected       │ │
│                 │  │ ════════════                                                     │ │
│  ● Reviews      │  └──────────────────────────────────────────────────────────────────┘ │
│    ├ Moderate   │                                                                        │
│    └ All        │  ┌──────────────────────────────────────────────────────────────────┐ │
│                 │  │                                                                  │ │
│  Reports        │  │  Filters:                                                        │ │
│                 │  │  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐          │ │
│  Categories     │  │  │ Rating ▼      │ │ Lead Verified▼│ │ Date Range ▼  │          │ │
│                 │  │  │ All Ratings   │ │ All           │ │ All Time      │          │ │
│  Analytics      │  │  └───────────────┘ └───────────────┘ └───────────────┘          │ │
│                 │  │                                                                  │ │
│  Users          │  │  Search: [Reviewer, business, content...___________] [Search]   │ │
│                 │  │                                                                  │ │
│                 │  └──────────────────────────────────────────────────────────────────┘ │
│                 │                                                                        │
│                 │  ┌──────────────────────────────────────────────────────────────────┐ │
│                 │  │                                                                  │ │
│                 │  │  REVIEWER        │ ADVISOR/BUSINESS │ RATING  │ EXCERPT          │ │
│                 │  │                  │                  │         │                  │ │
│                 │  │  DATE            │ LEAD VERIFIED    │ FLAGS   │ ACTION           │ │
│                 │  │ ─────────────────┼──────────────────┼─────────┼─────────────────│ │
│                 │  │                  │                  │         │                  │ │
│                 │  │  Sarah Chen      │ Smith Financial  │ ★★★★★   │ "John was        │ │
│                 │  │  sarah@email.com │ Planning         │ 5.0     │ incredibly       │ │
│                 │  │                  │ John Smith       │         │ helpful with..."│ │
│                 │  │                  │                  │         │                  │ │
│                 │  │  2 hours ago     │ ✓ Yes            │ ✓ Clean │ [Review]        │ │
│                 │  │ ─────────────────┼──────────────────┼─────────┼─────────────────│ │
│                 │  │                  │                  │         │                  │ │
│                 │  │  Mike Wilson     │ Brisbane Loans   │ ★★★★☆   │ "Good service   │ │
│                 │  │  m.wilson@       │ Direct           │ 4.0     │ overall but     │ │
│                 │  │  email.com       │ Mike Chen        │         │ communication..."│ │
│                 │  │                  │                  │         │                  │ │
│                 │  │  5 hours ago     │ ✓ Yes            │ ✓ Clean │ [Review]        │ │
│                 │  │ ─────────────────┼──────────────────┼─────────┼─────────────────│ │
│                 │  │                  │                  │         │                  │ │
│                 │  │  Anonymous       │ Sydney Property  │ ★☆☆☆☆   │ "Terrible       │ │
│                 │  │  User            │ Buyers           │ 1.0     │ experience.     │ │
│                 │  │                  │ Lisa Wong        │         │ Avoid at all..."│ │
│                 │  │                  │                  │         │                  │ │
│                 │  │  1 day ago       │ ✗ No             │ ⚠ 2     │ [Review]        │ │
│                 │  │ ─────────────────┼──────────────────┼─────────┼─────────────────│ │
│                 │  │                  │                  │         │                  │ │
│                 │  │  David Brown     │ Perth Wealth     │ ★★★★★   │ "Absolutely     │ │
│                 │  │  david.b@        │ Advisors         │ 5.0     │ fantastic       │ │
│                 │  │  email.com       │ David Brown      │         │ experience..."  │ │
│                 │  │                  │                  │         │                  │ │
│                 │  │  1 day ago       │ ✓ Yes            │ ⚠ 1     │ [Review]        │ │
│                 │  │ ─────────────────┼──────────────────┼─────────┼─────────────────│ │
│                 │  │                  │                  │         │                  │ │
│                 │  │  Jane Smith      │ Melbourne Buyers │ ★★★☆☆   │ "Mixed          │ │
│                 │  │  jane.s@         │ Agency           │ 3.0     │ feelings about  │ │
│                 │  │  email.com       │ Amy Zhang        │         │ this advisor..."│ │
│                 │  │                  │                  │         │                  │ │
│                 │  │  2 days ago      │ ✓ Yes            │ ✓ Clean │ [Review]        │ │
│                 │  │ ─────────────────┼──────────────────┼─────────┼─────────────────│ │
│                 │  │                  │                  │         │                  │ │
│                 │  │  Tom Lee         │ Coastal Finance  │ ★★★★☆   │ "Professional   │ │
│                 │  │  tom@email.com   │ Group            │ 4.0     │ service, would  │ │
│                 │  │                  │ Sarah Taylor     │         │ recommend..."   │ │
│                 │  │                  │                  │         │                  │ │
│                 │  │  2 days ago      │ ✓ Yes            │ ✓ Clean │ [Review]        │ │
│                 │  │                  │                  │         │                  │ │
│                 │  └──────────────────────────────────────────────────────────────────┘ │
│                 │                                                                        │
│                 │  Showing 6 of 8 pending reviews                  [< Prev] [Next >]    │
│                 │                                                                        │
└─────────────────┴────────────────────────────────────────────────────────────────────────┘
```

## Tab States

### Pending Tab (Default)
```
┌──────────────────────────────────────────────────────────────────┐
│ Pending (8)       │       Published       │       Rejected       │
│ ════════════                                                     │
└──────────────────────────────────────────────────────────────────┘
```
- Reviews awaiting moderation
- Sorted by: Oldest first (FIFO)
- Includes both new reviews and reported published reviews

### Published Tab
```
┌──────────────────────────────────────────────────────────────────┐
│ Pending (8)       │       Published       │       Rejected       │
│                        ═════════════                             │
└──────────────────────────────────────────────────────────────────┘
```
- All live reviews
- Searchable and filterable
- Can be un-published if issues found

### Rejected Tab
```
┌──────────────────────────────────────────────────────────────────┐
│ Pending (8)       │       Published       │       Rejected       │
│                                                ════════════      │
└──────────────────────────────────────────────────────────────────┘
```
- Reviews that were rejected
- Shows rejection reason
- Can be reconsidered if appealed

## Components

### Filter Bar

```
┌───────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│  Filters:                                                                 │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ │
│  │ Rating ▼      │ │ Lead Verified▼│ │ Date Range ▼  │ │ Has Flags ▼   │ │
│  │ All Ratings   │ │ All           │ │ All Time      │ │ All           │ │
│  └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘ │
│                                                                           │
│  Search: [Reviewer name, business, review content...______] [Search]     │
│                                                                           │
│  Active Filters: [Unverified Lead ×]  [Clear All]                        │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

**Rating Filter:**
- All Ratings
- 5 stars only
- 4+ stars
- 3 stars
- 1-2 stars (negative)

**Lead Verified Filter:**
- All
- Yes (has associated lead/booking)
- No (no verified interaction)

**Has Flags Filter:**
- All
- Has flags (fraud/content signals)
- No flags (clean)

### Reviews Table

**Columns:**
| Column | Width | Description |
|--------|-------|-------------|
| Reviewer | 150px | Name and email |
| Advisor/Business | 150px | Business and advisor name |
| Rating | 80px | Stars and numeric |
| Excerpt | 180px | First ~50 chars of review |
| Date | 100px | Relative timestamp |
| Lead Verified | 80px | Yes/No indicator |
| Flags | 60px | Flag count or clean |
| Action | 80px | Review button |

### Review Detail Modal

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                                                                            [×] │
│  Review Details                                                                │
│  ─────────────────────────────────────────────────────────────────────────     │
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                         │  │
│  │  REVIEW CONTENT                                                         │  │
│  │  ─────────────────────────────────────────────────────────────────────  │  │
│  │                                                                         │  │
│  │  Rating: ★★★★★ (5.0)                                                   │  │
│  │                                                                         │  │
│  │  "John was incredibly helpful with our retirement planning. He took   │  │
│  │  the time to understand our goals and created a comprehensive         │  │
│  │  strategy that we're confident in. His communication throughout the   │  │
│  │  process was excellent - always responsive and clear in his           │  │
│  │  explanations. Would highly recommend to anyone looking for a         │  │
│  │  financial adviser in Sydney."                                        │  │
│  │                                                                         │  │
│  │  Submitted: 5 Jan 2026, 2:34 PM (2 hours ago)                         │  │
│  │                                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  ┌──────────────────────────────┐  ┌────────────────────────────────────────┐ │
│  │                              │  │                                        │ │
│  │  REVIEWER INFORMATION        │  │  ADVISOR/BUSINESS                      │ │
│  │  ──────────────────────────  │  │  ────────────────────────────────────  │ │
│  │                              │  │                                        │ │
│  │  Name: Sarah Chen            │  │  Business: Smith Financial Planning   │ │
│  │  Email: sarah@email.com      │  │  Advisor: John Smith                  │ │
│  │                              │  │  Type: Financial Adviser              │ │
│  │  Account Created:            │  │                                        │ │
│  │  15 Dec 2025                 │  │  Verification: ✓ Verified             │ │
│  │                              │  │                                        │ │
│  │  Total Reviews: 1            │  │  Total Reviews: 23                    │ │
│  │  Avg Rating Given: 5.0       │  │  Avg Rating: 4.7                      │ │
│  │                              │  │                                        │ │
│  │  [View User Profile →]       │  │  [View Listing →]                     │ │
│  │                              │  │                                        │ │
│  └──────────────────────────────┘  └────────────────────────────────────────┘ │
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                         │  │
│  │  LEAD/BOOKING VERIFICATION                                              │  │
│  │  ─────────────────────────────────────────────────────────────────────  │  │
│  │                                                                         │  │
│  │  Status: ✓ VERIFIED                                                    │  │
│  │                                                                         │  │
│  │  Associated Lead: #L-4521                                              │  │
│  │  Lead Created: 10 Dec 2025                                             │  │
│  │  Consultation Booked: 15 Dec 2025                                      │  │
│  │  Consultation Completed: Yes (confirmed by advisor)                    │  │
│  │                                                                         │  │
│  │  Timeline appears legitimate ✓                                         │  │
│  │                                                                         │  │
│  │  [View Lead Details →]                                                 │  │
│  │                                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                         │  │
│  │  FRAUD SIGNALS                                                          │  │
│  │  ─────────────────────────────────────────────────────────────────────  │  │
│  │                                                                         │  │
│  │  ✓ No fraud signals detected                                           │  │
│  │                                                                         │  │
│  │  Checks Passed:                                                         │  │
│  │  • IP address different from advisor's IP ✓                            │  │
│  │  • Reviewer account age > 7 days ✓                                     │  │
│  │  • Review timing consistent with service delivery ✓                    │  │
│  │  • No duplicate content detected ✓                                     │  │
│  │  • Writing style unique (not templated) ✓                              │  │
│  │                                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  ─────────────────────────────────────────────────────────────────────────     │
│                                                                                │
│  MODERATION DECISION                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                         │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐            │  │
│  │  │    Publish     │  │  Request Edit  │  │     Reject     │            │  │
│  │  │                │  │                │  │                │            │  │
│  │  └────────────────┘  └────────────────┘  └────────────────┘            │  │
│  │                                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

### Review with Fraud Flags

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  FRAUD SIGNALS                                                          │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  ⚠ 2 SIGNALS DETECTED - Review with caution                            │
│                                                                         │
│  Issues Found:                                                          │
│                                                                         │
│  ⚠ SAME IP ADDRESS                                                     │
│    Reviewer IP matches advisor's known IP address                      │
│    Reviewer IP: 203.45.xxx.xxx (Sydney, NSW)                          │
│    Advisor IP: 203.45.xxx.xxx (Sydney, NSW)                           │
│    Risk: HIGH - May be self-review                                     │
│                                                                         │
│  ⚠ TIMING SUSPICIOUS                                                   │
│    Review submitted 15 minutes after account created                   │
│    No associated lead or booking found                                 │
│    Risk: MEDIUM - May not be genuine client                            │
│                                                                         │
│  Checks Passed:                                                         │
│  • Writing style appears unique ✓                                      │
│  • No duplicate content detected ✓                                     │
│  • Email domain appears legitimate ✓                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Reject Review Modal

```
┌────────────────────────────────────────────────────────────────┐
│                                                            [×] │
│  Reject Review                                                 │
│  ──────────────────────────────────────────────────────────    │
│                                                                │
│  Rejection Reason:                                             │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Select a reason...                                    ▼  │ │
│  │ ───────────────────────────────────────────────────────  │ │
│  │ • Fake/fraudulent review                                 │ │
│  │ • Self-review (advisor reviewing themselves)             │ │
│  │ • No verified interaction with advisor                   │ │
│  │ • Inappropriate/offensive content                        │ │
│  │ • Contains personal information                          │ │
│  │ • Spam or promotional content                            │ │
│  │ • Defamatory content                                     │ │
│  │ • Competitor sabotage suspected                          │ │
│  │ • Duplicate review                                       │ │
│  │ • Other (specify below)                                  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Additional Notes (internal):                                  │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ IP address matched advisor's known IP. Likely attempted │ │
│  │ self-review to boost ratings.                            │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Notification to Reviewer:                                     │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Your review was not published because it did not meet   │ │
│  │ our community guidelines. Reviews must be from genuine  │ │
│  │ clients who have received services from the advisor.    │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  [ ] Flag reviewer account for review                         │
│  [ ] Flag advisor account (if self-review suspected)          │
│                                                                │
│                          [Cancel]    [Reject Review]          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Request Edit Modal

```
┌────────────────────────────────────────────────────────────────┐
│                                                            [×] │
│  Request Review Edit                                           │
│  ──────────────────────────────────────────────────────────    │
│                                                                │
│  Issue with Review:                                            │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Select an issue...                                    ▼  │ │
│  │ ───────────────────────────────────────────────────────  │ │
│  │ • Contains personal information (names, addresses)       │ │
│  │ • Contains contact details                               │ │
│  │ • Language needs toning down                             │ │
│  │ • Factual inaccuracies                                   │ │
│  │ • Too vague - needs more detail                          │ │
│  │ • Other (specify below)                                  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Message to Reviewer:                                          │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Thank you for your review. Before we can publish it,    │ │
│  │ we need you to make a small edit:                       │ │
│  │                                                          │ │
│  │ Please remove the reference to "my wife Sarah" as we    │ │
│  │ don't publish personal names in reviews for privacy     │ │
│  │ reasons. You can say "my spouse" or "my partner"        │ │
│  │ instead.                                                 │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Edit Deadline: [7 days ▼]                                    │
│                                                                │
│  [ ] Auto-reject if no response by deadline                   │
│                                                                │
│                          [Cancel]    [Send Request]           │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Tablet Layout (768px)

```
┌────────────────────────────────────────────────────────┐
│  ADVYSER ADMIN              [≡]        [Admin User ▼]  │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Reviews Moderation                                    │
│  ────────────────────────────────────────────────────  │
│                                                        │
│  ┌────────────────────────────────────────────────┐   │
│  │ Pending (8)  │ Published   │ Rejected         │   │
│  │ ════════════                                   │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
│  [Filters ▼]              [________________] [Search] │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Sarah Chen                                       │ │
│  │ sarah@email.com                                  │ │
│  │                                                  │ │
│  │ → Smith Financial Planning                      │ │
│  │   John Smith · Financial Adviser               │ │
│  │                                                  │ │
│  │ ★★★★★ (5.0)                                     │ │
│  │ "John was incredibly helpful with our           │ │
│  │ retirement planning. He took the time to..."   │ │
│  │                                                  │ │
│  │ 2 hours ago   Lead: ✓ Verified   Flags: ✓      │ │
│  │                                                  │ │
│  │ [Review]                                        │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Anonymous User                                   │ │
│  │                                                  │ │
│  │ → Sydney Property Buyers                        │ │
│  │   Lisa Wong · Buyer's Agent                    │ │
│  │                                                  │ │
│  │ ★☆☆☆☆ (1.0)                                     │ │
│  │ "Terrible experience. Avoid at all costs..."   │ │
│  │                                                  │ │
│  │ 1 day ago   Lead: ✗ No   Flags: ⚠ 2            │ │
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
│  Reviews Moderation             │
│  ──────────────────────────     │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Pending │ Pub │ Rejected │ │
│  │ (8)     │     │          │ │
│  │ ═══════                   │ │
│  └───────────────────────────┘ │
│                                 │
│  [Filters ▼]    [Search ▼]     │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Sarah Chen                │ │
│  │ ★★★★★ (5.0)               │ │
│  │                           │ │
│  │ → Smith Financial         │ │
│  │   Planning                │ │
│  │                           │ │
│  │ "John was incredibly      │ │
│  │ helpful with our..."      │ │
│  │                           │ │
│  │ 2 hours ago               │ │
│  │ Lead: ✓   Flags: ✓        │ │
│  │                           │ │
│  │ [Review]                  │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Anonymous User            │ │
│  │ ★☆☆☆☆ (1.0)               │ │
│  │                           │ │
│  │ → Sydney Property         │ │
│  │   Buyers                  │ │
│  │                           │ │
│  │ "Terrible experience..."  │ │
│  │                           │ │
│  │ 1 day ago                 │ │
│  │ Lead: ✗   Flags: ⚠ 2      │ │
│  │                           │ │
│  │ [Review]                  │ │
│  └───────────────────────────┘ │
│                                 │
│  [Load More...]                │
│                                 │
└─────────────────────────────────┘
```

## Interactions

### Review Detail Flow
1. Click [Review] button
2. Modal opens with full review details
3. Admin reviews content, fraud signals, lead verification
4. Makes decision: Publish / Request Edit / Reject
5. For Reject: Select reason, add notes
6. For Request Edit: Specify issue, write message
7. Confirm action
8. Email notification sent to reviewer
9. Return to list with next review

### Bulk Actions (Pending tab)
- Select multiple clean reviews
- [Publish Selected] - bulk approve
- Only available for reviews with no flags

### Quick Publish
- Reviews with verified lead + no flags can be quick-approved
- Single click publish without opening modal
- Still logged for audit

## Data Requirements

### Review List Item
```typescript
interface ReviewModerationItem {
  id: string;
  reviewerName: string;
  reviewerEmail: string;
  reviewerAccountId: string;

  businessId: string;
  businessName: string;
  advisorName: string;
  advisorType: AdvisorType;

  rating: number; // 1-5
  content: string;
  excerpt: string; // First 100 chars

  submittedAt: Date;
  status: 'pending' | 'published' | 'rejected';

  leadVerified: boolean;
  leadId?: string;

  fraudFlags: FraudSignal[];
  flagCount: number;
}
```

### Fraud Signals
```typescript
interface FraudSignal {
  type: 'same_ip' | 'timing' | 'no_lead' | 'duplicate' | 'templated' | 'velocity';
  severity: 'low' | 'medium' | 'high';
  description: string;
  details: Record<string, any>;
}
```

### Lead Verification
```typescript
interface LeadVerification {
  verified: boolean;
  leadId?: string;
  leadCreatedAt?: Date;
  consultationBookedAt?: Date;
  consultationCompleted?: boolean;
  timelineValid?: boolean;
}
```

## Permissions

- **Access**: Only users with role='admin' can access
- **Publish Review**: All admins
- **Reject Review**: All admins
- **Flag User Account**: All admins
- **Flag Advisor Account**: May require senior admin
- **Audit Logging**: All decisions logged

## Audit Log Events

- Review opened for moderation
- Review published (with admin ID)
- Review rejected (with reason)
- Edit requested (with message)
- User account flagged
- Advisor account flagged

## Error States

### Load Error
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│                       (error icon)                            │
│                                                               │
│            Unable to load reviews                             │
│                                                               │
│        There was an error fetching review data.              │
│                   [Retry] [Contact Support]                   │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Action Failed
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  ⚠ Failed to publish review                                  │
│                                                               │
│  Error: [Specific error message]                             │
│                                                               │
│  [Retry]  [Cancel]                                           │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Empty States

### No Pending Reviews
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│                      (checkmark icon)                         │
│                                                               │
│            All reviews have been moderated                    │
│                                                               │
│        Great work! Check back later for new submissions.     │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Accessibility

- Star ratings have numeric text alternatives
- Fraud flags clearly labeled
- Modal focus management
- Keyboard shortcuts for common actions
- Screen reader announces decision outcomes
- Color not sole indicator of status
