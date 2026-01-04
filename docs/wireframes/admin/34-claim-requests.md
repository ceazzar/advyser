# Admin - Claim Requests Queue Wireframe

## Page Purpose
Centralized queue for administrators to view, filter, and manage all business claim requests. This is the entry point for the claim review workflow, allowing admins to triage and prioritize verification work.

## URL Pattern
`/admin/claims`

## User Role
admin (authenticated, role=admin)

## Desktop Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│  ADVYSER ADMIN                                                    [Admin User ▼]         │
├─────────────────┬────────────────────────────────────────────────────────────────────────┤
│                 │                                                                        │
│  Dashboard      │  Claim Requests                                                        │
│                 │  ─────────────────────────────────────────────────────────────────     │
│  ● Claims       │                                                                        │
│    ├ Queue      │  ┌──────────────────────────────────────────────────────────────────┐ │
│    └ History    │  │ Pending (12)  │  Needs More Info (4)  │  Approved  │  Denied    │ │
│                 │  │ ════════════                                                     │ │
│  Listings       │  └──────────────────────────────────────────────────────────────────┘ │
│                 │                                                                        │
│  Reviews        │  ┌──────────────────────────────────────────────────────────────────┐ │
│                 │  │                                                                  │ │
│  Reports        │  │  Filters:                                                        │ │
│                 │  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐    │ │
│  Categories     │  │  │ Advisor Type ▼  │ │ Date Range   ▼  │ │ Verification ▼  │    │ │
│                 │  │  │ All Types       │ │ All Time        │ │ All Levels      │    │ │
│  Analytics      │  │  └─────────────────┘ └─────────────────┘ └─────────────────┘    │ │
│                 │  │                                                                  │ │
│  Users          │  │  Sort: [Oldest First ▼]    Search: [________________] [Search]  │ │
│                 │  │                                                                  │ │
│                 │  └──────────────────────────────────────────────────────────────────┘ │
│                 │                                                                        │
│                 │  ┌──────────────────────────────────────────────────────────────────┐ │
│                 │  │ □  Select All (12)           [Bulk Approve Low-Risk]            │ │
│                 │  └──────────────────────────────────────────────────────────────────┘ │
│                 │                                                                        │
│                 │  ┌──────────────────────────────────────────────────────────────────┐ │
│                 │  │                                                                  │ │
│                 │  │  □ │ BUSINESS NAME      │ CLAIMANT     │ TYPE      │ SUBMITTED │ │
│                 │  │    │                    │              │           │           │ │
│                 │  │    │ STATUS             │ VERIFICATION │ FLAGS     │ ACTION    │ │
│                 │  │ ───┼────────────────────┼──────────────┼───────────┼───────────│ │
│                 │  │    │                    │              │           │           │ │
│                 │  │ □  │ Smith Financial    │ John Smith   │ Financial │ 5 days    │ │
│                 │  │    │ Planning           │ john@smith   │ Adviser   │ ago       │ │
│                 │  │    │                    │ .com.au      │           │           │ │
│                 │  │    │ ● Pending          │ Verified     │ ⚠ 2 flags │ [Review]  │ │
│                 │  │    │ ⚠ URGENT           │              │           │           │ │
│                 │  │ ───┼────────────────────┼──────────────┼───────────┼───────────│ │
│                 │  │    │                    │              │           │           │ │
│                 │  │ □  │ Brisbane Mortgage  │ Sarah Chen   │ Mortgage  │ 4 days    │ │
│                 │  │    │ Solutions          │ sarah@bms    │ Broker    │ ago       │ │
│                 │  │    │                    │ .com.au      │           │           │ │
│                 │  │    │ ● Pending          │ Verified     │ ✓ Clean   │ [Review]  │ │
│                 │  │    │ ⚠ URGENT           │              │           │           │ │
│                 │  │ ───┼────────────────────┼──────────────┼───────────┼───────────│ │
│                 │  │    │                    │              │           │           │ │
│                 │  │ □  │ Sydney Buyers      │ Michael Wong │ Buyer's   │ 3 days    │ │
│                 │  │    │ Agency             │ m.wong@      │ Agent     │ ago       │ │
│                 │  │    │                    │ sba.com.au   │           │           │ │
│                 │  │    │ ● Pending          │ Enhanced     │ ✓ Clean   │ [Review]  │ │
│                 │  │ ───┼────────────────────┼──────────────┼───────────┼───────────│ │
│                 │  │    │                    │              │           │           │ │
│                 │  │ □  │ Premier Property   │ Lisa Taylor  │ Property  │ 2 days    │ │
│                 │  │    │ Advisers           │ lisa@ppa     │ Adviser   │ ago       │ │
│                 │  │    │                    │ .net.au      │           │           │ │
│                 │  │    │ ● Pending          │ Basic        │ ⚠ 1 flag  │ [Review]  │ │
│                 │  │ ───┼────────────────────┼──────────────┼───────────┼───────────│ │
│                 │  │    │                    │              │           │           │ │
│                 │  │ □  │ Coastal Finance    │ David Brown  │ Financial │ 1 day     │ │
│                 │  │    │ Group              │ david@cfg    │ Adviser   │ ago       │ │
│                 │  │    │                    │ .com.au      │           │           │ │
│                 │  │    │ ● Pending          │ Verified     │ ✓ Clean   │ [Review]  │ │
│                 │  │ ───┼────────────────────┼──────────────┼───────────┼───────────│ │
│                 │  │    │                    │              │           │           │ │
│                 │  │ □  │ Melbourne Home     │ Amy Zhang    │ Buyer's   │ 1 day     │ │
│                 │  │    │ Hunters            │ amy@mhh      │ Agent     │ ago       │ │
│                 │  │    │                    │ .com.au      │           │           │ │
│                 │  │    │ ● Pending          │ Enhanced     │ ✓ Clean   │ [Review]  │ │
│                 │  │ ───┼────────────────────┼──────────────┼───────────┼───────────│ │
│                 │  │    │                    │              │           │           │ │
│                 │  │    │ [Load More - 6 remaining]                                   │ │
│                 │  │                                                                  │ │
│                 │  └──────────────────────────────────────────────────────────────────┘ │
│                 │                                                                        │
│                 │  Showing 6 of 12 pending claims                                        │
│                 │                                                                        │
└─────────────────┴────────────────────────────────────────────────────────────────────────┘
```

## Tab States

### Pending Tab (Default)
```
┌──────────────────────────────────────────────────────────────────┐
│ Pending (12)  │  Needs More Info (4)  │  Approved  │  Denied    │
│ ════════════                                                     │
└──────────────────────────────────────────────────────────────────┘
```
- Shows claims awaiting first review
- Sorted by oldest first (default) to ensure FIFO processing
- Urgent badges on items > 72 hours old

### Needs More Info Tab
```
┌──────────────────────────────────────────────────────────────────┐
│ Pending (12)  │  Needs More Info (4)  │  Approved  │  Denied    │
│                  ══════════════════                              │
└──────────────────────────────────────────────────────────────────┘
```
- Claims where admin requested additional documentation
- Shows what was requested
- Shows response deadline
- Re-sorts when claimant responds

### Approved Tab
```
┌──────────────────────────────────────────────────────────────────┐
│ Pending (12)  │  Needs More Info (4)  │  Approved  │  Denied    │
│                                         ════════                 │
└──────────────────────────────────────────────────────────────────┘
```
- Historical view of approved claims
- Date range filter important here
- Read-only, links to view decision details

### Denied Tab
```
┌──────────────────────────────────────────────────────────────────┐
│ Pending (12)  │  Needs More Info (4)  │  Approved  │  Denied    │
│                                                      ══════      │
└──────────────────────────────────────────────────────────────────┘
```
- Historical view of denied claims
- Shows denial reason
- Option to re-open if claimant appeals

## Components

### Filter Bar

```
┌─────────────────────────────────────────────────────────────────────┐
│  Filters:                                                           │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐       │
│  │ Advisor Type ▼  │ │ Date Range   ▼  │ │ Verification ▼  │       │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘       │
│                                                                     │
│  Sort: [Oldest First ▼]    Search: [________________] [Search]     │
│                                                                     │
│  Active Filters: [Financial Adviser ×] [Last 7 Days ×]  [Clear All]│
└─────────────────────────────────────────────────────────────────────┘
```

**Advisor Type Dropdown:**
- All Types (default)
- Financial Adviser
- Mortgage Broker
- Buyer's Agent
- Property Adviser

**Date Range Dropdown:**
- All Time
- Today
- Last 7 Days
- Last 30 Days
- Custom Range...

**Verification Level Dropdown:**
- All Levels
- Basic
- Verified
- Enhanced

**Sort Dropdown:**
- Oldest First (default - FIFO)
- Newest First
- Urgency (flags first)
- Business Name A-Z

**Search:**
- Searches business name, claimant name, email, ABN

### Bulk Actions Bar

```
┌─────────────────────────────────────────────────────────────────────┐
│ □  Select All (12)           [Bulk Approve Low-Risk]               │
└─────────────────────────────────────────────────────────────────────┘
```

- Appears when at least one item selected
- "Bulk Approve Low-Risk" only enabled when:
  - All selected items have no fraud flags
  - All have ABN verified
  - All have valid licence numbers
- Requires confirmation dialog

### Claims Table

**Columns:**
| Column | Width | Description |
|--------|-------|-------------|
| Checkbox | 40px | Multi-select |
| Business Name | 200px | Trading name, legal name below |
| Claimant | 150px | Name, email below |
| Advisor Type | 100px | FA/MB/BA/PA |
| Submitted | 100px | Relative date |
| Status | 100px | Status badge + urgency |
| Verification | 100px | Level requested |
| Flags | 80px | Flag count or clean |
| Action | 80px | Review button |

**Row States:**
- Normal: White background
- Urgent (>72h): Light yellow background
- Fraud flagged: Light red left border
- Hover: Light gray background

### Table Row Detail

```
┌─────────────────────────────────────────────────────────────────────┐
│ □  │ Smith Financial Planning              │ John Smith        │   │
│    │ Legal: Smith Financial Pty Ltd        │ john@smithfp.au   │   │
│    │ ABN: 12 345 678 901                   │                   │   │
│    │                                        │                   │   │
│    │ Type: Financial Adviser               │ Submitted: 5d ago │   │
│    │                                        │                   │   │
│    │ ● Pending  ⚠ URGENT                   │ Verification:     │   │
│    │                                        │ Verified          │   │
│    │                                        │                   │   │
│    │ Flags: ⚠ Email domain mismatch        │ [Review]          │   │
│    │        ⚠ Multiple attempts            │                   │   │
└─────────────────────────────────────────────────────────────────────┘
```

### Empty States

**No Pending Claims:**
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                              (checkmark icon)                       │
│                                                                     │
│                     No pending claims                               │
│                                                                     │
│            All claim requests have been processed.                  │
│            Great work! Check back later for new submissions.        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**No Results (Filtered):**
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                          (search icon)                              │
│                                                                     │
│                     No claims match your filters                    │
│                                                                     │
│            Try adjusting your filters or search terms.              │
│                           [Clear Filters]                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Tablet Layout (768px)

```
┌────────────────────────────────────────────────────────┐
│  ADVYSER ADMIN              [≡]        [Admin User ▼]  │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Claim Requests                                        │
│  ────────────────────────────────────────────────────  │
│                                                        │
│  ┌────────────────────────────────────────────────┐   │
│  │ Pending (12) │ Info (4) │ Approved │ Denied   │   │
│  │ ════════════                                   │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
│  [Filters ▼]              [________________] [Search] │
│                                                        │
│  Sort: [Oldest First ▼]           □ Select All (12)  │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Smith Financial Planning                         │ │
│  │ John Smith · john@smithfp.com.au                │ │
│  │                                                  │ │
│  │ Financial Adviser · 5 days ago                  │ │
│  │ ● Pending ⚠ URGENT                              │ │
│  │                                                  │ │
│  │ Verification: Verified   Flags: ⚠ 2             │ │
│  │                                                  │ │
│  │ □ Select                              [Review]  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Brisbane Mortgage Solutions                      │ │
│  │ Sarah Chen · sarah@bms.com.au                   │ │
│  │                                                  │ │
│  │ Mortgage Broker · 4 days ago                    │ │
│  │ ● Pending ⚠ URGENT                              │ │
│  │                                                  │ │
│  │ Verification: Verified   Flags: ✓ Clean         │ │
│  │                                                  │ │
│  │ □ Select                              [Review]  │ │
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
│  Claim Requests                 │
│  ──────────────────────────     │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Pending │ Info │ App │ Den│ │
│  │ (12)    │ (4)  │     │    │ │
│  │ ═══════                   │ │
│  └───────────────────────────┘ │
│                                 │
│  [Filters ▼]    [Search ▼]     │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Smith Financial Planning  │ │
│  │ John Smith                │ │
│  │ john@smithfp.com.au       │ │
│  │                           │ │
│  │ Financial Adviser         │ │
│  │ 5 days ago                │ │
│  │                           │ │
│  │ ● Pending ⚠ URGENT        │ │
│  │ Flags: ⚠ 2                │ │
│  │                           │ │
│  │ [Review]                  │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Brisbane Mortgage         │ │
│  │ Solutions                 │ │
│  │ Sarah Chen                │ │
│  │                           │ │
│  │ Mortgage Broker           │ │
│  │ 4 days ago                │ │
│  │                           │ │
│  │ ● Pending ⚠ URGENT        │ │
│  │ Flags: ✓ Clean            │ │
│  │                           │ │
│  │ [Review]                  │ │
│  └───────────────────────────┘ │
│                                 │
│  [Load More...]                │
│                                 │
└─────────────────────────────────┘
```

## Interactions

### Tab Navigation
- Clicking tab loads claims with that status
- Count badges update in real-time
- Maintains filter state when switching tabs
- URL updates: `/admin/claims?status=pending`

### Filter Application
- Filters apply immediately (no submit button)
- Active filters shown as removable chips
- Filters persist in URL for bookmarking
- "Clear All" resets to defaults

### Row Selection
- Checkbox selects individual row
- "Select All" selects all visible rows
- Shift+click for range selection
- Selection count updates in bulk action bar

### Bulk Approval
1. Select multiple claims
2. Click "Bulk Approve Low-Risk"
3. System checks all meet criteria
4. If any don't meet criteria, shows list of excluded items
5. Confirmation dialog with count
6. On confirm, processes in background
7. Success toast with count

### Review Click
- Opens claim review page (35-claim-review.md)
- Can open in new tab (Cmd/Ctrl+click)

### Sorting
- Click column header to sort
- Click again to reverse
- Sort indicator shows current sort

### Infinite Scroll / Load More
- Initial load: 20 items
- "Load More" fetches next 20
- Or implement infinite scroll on desktop

## Data Requirements

### Claims List Query
```typescript
interface ClaimListItem {
  id: string;
  businessName: string;
  legalName: string;
  abn: string;
  claimantName: string;
  claimantEmail: string;
  advisorType: 'financial_adviser' | 'mortgage_broker' | 'buyers_agent' | 'property_adviser';
  submittedAt: Date;
  status: 'pending' | 'needs_more_info' | 'approved' | 'denied';
  verificationLevel: 'basic' | 'verified' | 'enhanced';
  fraudFlags: string[];
  isUrgent: boolean; // >72 hours old
}
```

### Tab Counts
```typescript
interface ClaimCounts {
  pending: number;
  needsMoreInfo: number;
  approved: number;
  denied: number;
}
```

## Permissions

- **Access**: Only users with role='admin' can access
- **Bulk Approve**: May require senior admin role
- **Audit Logging**: All actions logged
  - Page views
  - Filter changes
  - Bulk selections
  - Approvals/denials

## Error States

### Load Error
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                          (error icon)                               │
│                                                                     │
│                     Unable to load claims                           │
│                                                                     │
│            There was an error fetching claim data.                  │
│                  [Retry] [Contact Support]                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Bulk Action Error
- Toast notification with specific error
- List of claims that failed
- Retry option for failed items

## Accessibility

- Table has proper header associations
- Checkboxes have accessible labels
- Status badges have text alternatives
- Keyboard navigation through table rows
- Tab key moves between interactive elements
- Enter key activates Review button
- Screen reader announces when list updates
- Focus management on filter changes
