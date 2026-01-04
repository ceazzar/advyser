# Admin - Listings Moderation Wireframe

## Page Purpose
Administrative interface for reviewing, moderating, and managing advisor business listings across the platform. Allows admins to handle flagged content, suspend problematic listings, and ensure quality standards are maintained.

## URL Pattern
`/admin/listings`

## User Role
admin (authenticated, role=admin)

## Desktop Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│  ADVYSER ADMIN                                                    [Admin User ▼]         │
├─────────────────┬────────────────────────────────────────────────────────────────────────┤
│                 │                                                                        │
│  Dashboard      │  Listings Moderation                                                   │
│                 │  ─────────────────────────────────────────────────────────────────     │
│  Claims         │                                                                        │
│                 │  ┌──────────────────────────────────────────────────────────────────┐ │
│  ● Listings     │  │ Flagged (7)    │    All Active (1,423)    │    Inactive (89)    │ │
│    ├ Moderation │  │ ════════════                                                     │ │
│    └ All        │  └──────────────────────────────────────────────────────────────────┘ │
│                 │                                                                        │
│  Reviews        │  ┌──────────────────────────────────────────────────────────────────┐ │
│                 │  │                                                                  │ │
│  Reports        │  │  Filters:                                                        │ │
│                 │  │  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐          │ │
│  Categories     │  │  │ Advisor Type▼ │ │ Verification▼ │ │ Date Range ▼  │          │ │
│                 │  │  │ All Types     │ │ All Levels    │ │ All Time      │          │ │
│  Analytics      │  │  └───────────────┘ └───────────────┘ └───────────────┘          │ │
│                 │  │                                                                  │ │
│  Users          │  │  Search: [_________________________________] [Search]           │ │
│                 │  │                                                                  │ │
│                 │  └──────────────────────────────────────────────────────────────────┘ │
│                 │                                                                        │
│                 │  ┌──────────────────────────────────────────────────────────────────┐ │
│                 │  │                                                                  │ │
│                 │  │  BUSINESS          │ ADVISOR        │ TYPE       │ VERIFICATION │ │
│                 │  │                    │                │            │              │ │
│                 │  │  COMPLETENESS      │ REPORTS        │ FLAG REASON│ ACTIONS      │ │
│                 │  │ ───────────────────┼────────────────┼────────────┼──────────────│ │
│                 │  │                    │                │            │              │ │
│                 │  │  Smith Financial   │ John Smith     │ Financial  │ ✓ Verified   │ │
│                 │  │  Planning          │                │ Adviser    │              │ │
│                 │  │                    │                │            │              │ │
│                 │  │  85%  ████████░░   │ 2 reports     │ ⚠ User     │ [View]       │ │
│                 │  │                    │                │   reported │ [Suspend]    │ │
│                 │  │ ───────────────────┼────────────────┼────────────┼──────────────│ │
│                 │  │                    │                │            │              │ │
│                 │  │  Brisbane Loans    │ Mike Chen      │ Mortgage   │ ○ Basic      │ │
│                 │  │  Direct            │                │ Broker     │              │ │
│                 │  │                    │                │            │              │ │
│                 │  │  45%  ████░░░░░░   │ 0 reports     │ ⚠ Auto     │ [View]       │ │
│                 │  │                    │                │   (content)│ [Suspend]    │ │
│                 │  │ ───────────────────┼────────────────┼────────────┼──────────────│ │
│                 │  │                    │                │            │              │ │
│                 │  │  Sydney Property   │ Lisa Wong      │ Buyer's    │ ✓✓ Enhanced  │ │
│                 │  │  Buyers            │                │ Agent      │              │ │
│                 │  │                    │                │            │              │ │
│                 │  │  92%  █████████░   │ 1 report      │ ⚠ User     │ [View]       │ │
│                 │  │                    │                │   reported │ [Suspend]    │ │
│                 │  │ ───────────────────┼────────────────┼────────────┼──────────────│ │
│                 │  │                    │                │            │              │ │
│                 │  │  Perth Wealth      │ David Brown    │ Financial  │ ✓ Verified   │ │
│                 │  │  Advisors          │                │ Adviser    │              │ │
│                 │  │                    │                │            │              │ │
│                 │  │  78%  ███████░░░   │ 3 reports     │ ⚠ Multiple │ [View]       │ │
│                 │  │                    │                │   reports  │ [Suspend]    │ │
│                 │  │ ───────────────────┼────────────────┼────────────┼──────────────│ │
│                 │  │                    │                │            │              │ │
│                 │  │  Coastal Mortgages │ Sarah Taylor   │ Mortgage   │ ○ Basic      │ │
│                 │  │                    │                │ Broker     │              │ │
│                 │  │                    │                │            │              │ │
│                 │  │  60%  ██████░░░░   │ 0 reports     │ ⚠ Auto     │ [View]       │ │
│                 │  │                    │                │   (spam)   │ [Suspend]    │ │
│                 │  │ ───────────────────┼────────────────┼────────────┼──────────────│ │
│                 │  │                    │                │            │              │ │
│                 │  │  Melbourne Buyers  │ Amy Zhang      │ Property   │ ✓ Verified   │ │
│                 │  │  Agency            │                │ Adviser    │              │ │
│                 │  │                    │                │            │              │ │
│                 │  │  70%  ███████░░░   │ 1 report      │ ⚠ User     │ [View]       │ │
│                 │  │                    │                │   reported │ [Suspend]    │ │
│                 │  │ ───────────────────┼────────────────┼────────────┼──────────────│ │
│                 │  │                    │                │            │              │ │
│                 │  │  Gold Coast        │ Tom Wilson     │ Buyer's    │ ○ Basic      │ │
│                 │  │  Advocates         │                │ Agent      │              │ │
│                 │  │                    │                │            │              │ │
│                 │  │  55%  █████░░░░░   │ 0 reports     │ ⚠ Auto     │ [View]       │ │
│                 │  │                    │                │   (images) │ [Suspend]    │ │
│                 │  │                    │                │            │              │ │
│                 │  └──────────────────────────────────────────────────────────────────┘ │
│                 │                                                                        │
│                 │  Showing 7 flagged listings                      [< Prev] [Next >]    │
│                 │                                                                        │
└─────────────────┴────────────────────────────────────────────────────────────────────────┘
```

## Tab States

### Flagged Tab (Default when flags exist)
```
┌──────────────────────────────────────────────────────────────────┐
│ Flagged (7)    │    All Active (1,423)    │    Inactive (89)    │
│ ════════════                                                     │
└──────────────────────────────────────────────────────────────────┘
```
- Listings requiring admin review
- Auto-flagged by system OR user-reported
- Sorted by: Reports count (desc), then date flagged

### All Active Tab
```
┌──────────────────────────────────────────────────────────────────┐
│ Flagged (7)    │    All Active (1,423)    │    Inactive (89)    │
│                     ══════════════════                           │
└──────────────────────────────────────────────────────────────────┘
```
- All published, visible listings
- Search and filter functionality
- Bulk operations available

### Inactive Tab
```
┌──────────────────────────────────────────────────────────────────┐
│ Flagged (7)    │    All Active (1,423)    │    Inactive (89)    │
│                                                ════════════      │
└──────────────────────────────────────────────────────────────────┘
```
- Suspended listings
- Unpublished by owner
- Awaiting verification
- Can reactivate from here

## Components

### Filter Bar

```
┌───────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│  Filters:                                                                 │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ │
│  │ Advisor Type▼ │ │ Verification▼ │ │ Date Range ▼  │ │ Flag Type ▼   │ │
│  │ All Types     │ │ All Levels    │ │ All Time      │ │ All Flags     │ │
│  └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘ │
│                                                                           │
│  Search: [Business name, advisor name, ABN...___________] [Search]       │
│                                                                           │
│  Active Filters: [Financial Adviser ×]  [Clear All]                      │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

**Advisor Type:**
- All Types
- Financial Adviser
- Mortgage Broker
- Buyer's Agent
- Property Adviser

**Verification Level:**
- All Levels
- Unverified (unclaimed)
- Basic
- Verified
- Enhanced

**Date Range:**
- All Time
- Created today
- Last 7 days
- Last 30 days
- Custom range

**Flag Type (Flagged tab only):**
- All Flags
- User reported
- Auto-flagged (content)
- Auto-flagged (spam)
- Auto-flagged (images)
- Multiple reports

### Listings Table

**Columns:**
| Column | Width | Description |
|--------|-------|-------------|
| Business | 180px | Trading name |
| Advisor | 120px | Owner name |
| Type | 100px | Advisor category |
| Verification | 100px | Level badge |
| Completeness | 120px | Progress bar |
| Reports | 80px | Report count |
| Flag Reason | 100px | Why flagged |
| Actions | 120px | View/Suspend buttons |

### Flag Reason Badges

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  FLAG TYPES:                                                        │
│                                                                     │
│  ⚠ User reported     - Flagged by platform users                   │
│  ⚠ Auto (content)    - Inappropriate/prohibited content detected   │
│  ⚠ Auto (spam)       - Spam patterns detected                      │
│  ⚠ Auto (images)     - Image quality/content issues                │
│  ⚠ Multiple reports  - 3+ reports from different users            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Listing Preview Modal

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                        [×] │
│  Listing Preview: Smith Financial Planning                                 │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                                                                     │  │
│  │  ┌──────────┐  SMITH FINANCIAL PLANNING                            │  │
│  │  │          │  ✓ Verified Financial Adviser                        │  │
│  │  │  [LOGO]  │                                                      │  │
│  │  │          │  Specialising in retirement planning and wealth     │  │
│  │  └──────────┘  management for Sydney professionals.                │  │
│  │                                                                     │  │
│  │  ─────────────────────────────────────────────────────────────     │  │
│  │                                                                     │  │
│  │  ABOUT                                                              │  │
│  │  Smith Financial Planning has been helping Australians achieve     │  │
│  │  their financial goals since 2018. Our team of experienced        │  │
│  │  advisers provides personalized strategies...                      │  │
│  │                                                                     │  │
│  │  ─────────────────────────────────────────────────────────────     │  │
│  │                                                                     │  │
│  │  SERVICES                                                           │  │
│  │  • Retirement Planning    • Superannuation                         │  │
│  │  • Wealth Management      • Insurance                              │  │
│  │                                                                     │  │
│  │  ─────────────────────────────────────────────────────────────     │  │
│  │                                                                     │  │
│  │  CONTACT                                                            │  │
│  │  123 Financial Street, Sydney NSW 2000                             │  │
│  │  (02) 9123 4567  |  info@smithfinancial.com.au                    │  │
│  │                                                                     │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                            │
│  FLAG DETAILS                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                                                                     │  │
│  │  Reason: User reported                                              │  │
│  │  Reported by: 2 users                                               │  │
│  │  Date: 4 Jan 2026                                                   │  │
│  │                                                                     │  │
│  │  Reports:                                                           │  │
│  │  1. "Claims to offer free advice but then charges hidden fees"     │  │
│  │  2. "Misleading information about qualifications"                  │  │
│  │                                                                     │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                            │
│  ACTIONS                                                                   │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐              │
│  │ Suspend Listing │ │ Remove Content  │ │ Warn Advisor    │              │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘              │
│  ┌─────────────────┐ ┌─────────────────┐                                  │
│  │ No Action       │ │ View Full Page  │                                  │
│  └─────────────────┘ └─────────────────┘                                  │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Action Confirmation Modals

**Suspend Listing:**
```
┌────────────────────────────────────────────────────────────────┐
│                                                            [×] │
│  Suspend Listing                                               │
│  ──────────────────────────────────────────────────────────    │
│                                                                │
│  Are you sure you want to suspend this listing?                │
│                                                                │
│  Business: Smith Financial Planning                            │
│  Advisor: John Smith                                           │
│                                                                │
│  Suspension Reason:                                            │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Select a reason...                                    ▼  │ │
│  │ ───────────────────────────────────────────────────────  │ │
│  │ • Policy violation - misleading content                  │ │
│  │ • Policy violation - prohibited services                 │ │
│  │ • Policy violation - inappropriate images                │ │
│  │ • Multiple user complaints                               │ │
│  │ • Suspected fraud                                        │ │
│  │ • Licence no longer valid                               │ │
│  │ • Other (specify below)                                  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Additional Notes:                                             │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  [ ] Notify advisor by email                                  │
│  [ ] Allow appeal (30 days)                                   │
│                                                                │
│  ⚠ This listing will be immediately hidden from search       │
│  and the advisor will lose access to new leads.              │
│                                                                │
│                          [Cancel]    [Suspend Listing]        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Remove Content:**
```
┌────────────────────────────────────────────────────────────────┐
│                                                            [×] │
│  Remove Specific Content                                       │
│  ──────────────────────────────────────────────────────────    │
│                                                                │
│  Select content to remove from this listing:                   │
│                                                                │
│  [ ] Profile description                                       │
│  [ ] Profile image                                             │
│  [ ] Banner image                                              │
│  [ ] Specific text (specify below)                            │
│                                                                │
│  Content to Remove:                                            │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ "FREE advice with no obligations"                        │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Reason:                                                       │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Misleading claim - all financial advice has costs       │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  [ ] Notify advisor with reason                               │
│  [ ] Require re-approval before content can be re-added      │
│                                                                │
│                          [Cancel]    [Remove Content]         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Warn Advisor:**
```
┌────────────────────────────────────────────────────────────────┐
│                                                            [×] │
│  Send Warning to Advisor                                       │
│  ──────────────────────────────────────────────────────────    │
│                                                                │
│  Warning Type:                                                 │
│  ○ First Warning (informal)                                   │
│  ● Formal Warning (recorded)                                  │
│  ○ Final Warning (suspension on next violation)               │
│                                                                │
│  Warning Message:                                              │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Dear John Smith,                                         │ │
│  │                                                          │ │
│  │ We have received reports regarding your listing on      │ │
│  │ Advyser. Specifically, concerns were raised about       │ │
│  │ claims of "free advice" which may be misleading to     │ │
│  │ consumers.                                               │ │
│  │                                                          │ │
│  │ Please review and update your listing to ensure it      │ │
│  │ accurately represents your services and fee structure.  │ │
│  │                                                          │ │
│  │ This is a formal warning. Continued violations may      │ │
│  │ result in listing suspension.                           │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  [ ] Request acknowledgment from advisor                      │
│  [ ] Set review date (auto-check in 7 days)                  │
│                                                                │
│                          [Cancel]    [Send Warning]           │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**No Action (Clear Flag):**
```
┌────────────────────────────────────────────────────────────────┐
│                                                            [×] │
│  Clear Flag - No Action Required                               │
│  ──────────────────────────────────────────────────────────    │
│                                                                │
│  Confirm that this listing does not require moderation:        │
│                                                                │
│  Business: Smith Financial Planning                            │
│  Flag Reason: User reported (2 reports)                        │
│                                                                │
│  Resolution Notes:                                             │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Reviewed listing content. The "free consultation"       │ │
│  │ mentioned is accurately described as an initial meeting │ │
│  │ with no obligation. Fees are clearly disclosed in the   │ │
│  │ services section. Reports appear to be competitor       │ │
│  │ driven rather than legitimate concerns.                 │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  [ ] Mark reporters as "false report" (affects trust score)  │
│                                                                │
│                          [Cancel]    [Clear Flag]             │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Tablet Layout (768px)

```
┌────────────────────────────────────────────────────────┐
│  ADVYSER ADMIN              [≡]        [Admin User ▼]  │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Listings Moderation                                   │
│  ────────────────────────────────────────────────────  │
│                                                        │
│  ┌────────────────────────────────────────────────┐   │
│  │ Flagged (7)  │ Active (1,423)  │ Inactive (89)│   │
│  │ ════════════                                   │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
│  [Filters ▼]              [________________] [Search] │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Smith Financial Planning                         │ │
│  │ John Smith · Financial Adviser                  │ │
│  │                                                  │ │
│  │ ✓ Verified   Profile: 85% ████████░░            │ │
│  │                                                  │ │
│  │ ⚠ User reported (2 reports)                     │ │
│  │                                                  │ │
│  │ [View]  [Suspend]                               │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Brisbane Loans Direct                            │ │
│  │ Mike Chen · Mortgage Broker                     │ │
│  │                                                  │ │
│  │ ○ Basic   Profile: 45% ████░░░░░░               │ │
│  │                                                  │ │
│  │ ⚠ Auto-flagged (content)                        │ │
│  │                                                  │ │
│  │ [View]  [Suspend]                               │ │
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
│  Listings Moderation            │
│  ──────────────────────────     │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Flagged │ Active │ Inact │ │
│  │ (7)     │(1,423) │ (89)  │ │
│  │ ═══════                   │ │
│  └───────────────────────────┘ │
│                                 │
│  [Filters ▼]    [Search ▼]     │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Smith Financial Planning  │ │
│  │ John Smith                │ │
│  │ Financial Adviser         │ │
│  │                           │ │
│  │ ✓ Verified                │ │
│  │ Profile: 85%              │ │
│  │                           │ │
│  │ ⚠ User reported           │ │
│  │ 2 reports                 │ │
│  │                           │ │
│  │ [View]  [Suspend]         │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Brisbane Loans Direct     │ │
│  │ Mike Chen                 │ │
│  │ Mortgage Broker           │ │
│  │                           │ │
│  │ ○ Basic                   │ │
│  │ Profile: 45%              │ │
│  │                           │ │
│  │ ⚠ Auto-flagged (content)  │ │
│  │                           │ │
│  │ [View]  [Suspend]         │ │
│  └───────────────────────────┘ │
│                                 │
│  [Load More...]                │
│                                 │
└─────────────────────────────────┘
```

## Interactions

### View Listing
1. Click [View] button
2. Opens preview modal
3. Shows full listing content
4. Displays flag details and reports
5. Action buttons at bottom
6. Can open full page in new tab

### Suspend Listing
1. Click [Suspend] button
2. Opens confirmation modal
3. Select suspension reason
4. Add optional notes
5. Choose notification options
6. Confirm suspension
7. Listing immediately hidden
8. Email sent to advisor (if selected)
9. Return to list with success toast

### Remove Content
1. Click [Remove Content] in modal
2. Select specific content to remove
3. Provide reason
4. Choose notification option
5. Confirm removal
6. Content removed from listing
7. Listing remains active

### Warn Advisor
1. Click [Warn Advisor] in modal
2. Select warning level
3. Edit/customize message
4. Set follow-up options
5. Send warning
6. Warning logged in advisor's record
7. Email sent to advisor

### No Action
1. Click [No Action] in modal
2. Provide resolution notes
3. Optionally flag reporters
4. Confirm clear
5. Flag removed from listing
6. Listed returned to normal state

### Bulk Actions (All Active tab)
- Select multiple listings
- [Suspend Selected] - bulk suspend
- [Export Selected] - CSV download
- Requires confirmation for destructive actions

## Data Requirements

### Listing List Item
```typescript
interface ListingModerationItem {
  id: string;
  businessName: string;
  advisorName: string;
  advisorId: string;
  advisorType: AdvisorType;
  verificationLevel: 'unverified' | 'basic' | 'verified' | 'enhanced';
  profileCompleteness: number; // 0-100
  reportCount: number;
  flagReason?: {
    type: 'user_reported' | 'auto_content' | 'auto_spam' | 'auto_images' | 'multiple_reports';
    details: string;
    flaggedAt: Date;
  };
  status: 'active' | 'suspended' | 'unpublished' | 'pending_verification';
  createdAt: Date;
  lastModified: Date;
}
```

### Flag Details
```typescript
interface FlagDetails {
  listingId: string;
  flagType: string;
  reports: {
    reporterId: string;
    reporterName: string;
    reason: string;
    details: string;
    reportedAt: Date;
  }[];
  autoFlagReasons?: string[];
}
```

## Permissions

- **Access**: Only users with role='admin' can access
- **Suspend Listing**: All admins
- **Remove Content**: All admins
- **Warn Advisor**: All admins
- **Bulk Operations**: May require senior admin
- **Audit Logging**: All actions logged with admin ID, timestamp, reason

## Audit Log Events

- Listing viewed for moderation
- Listing suspended (with reason)
- Content removed (with specifics)
- Warning sent (with type and message)
- Flag cleared (with resolution notes)
- Listing reactivated

## Error States

### Load Error
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│                       (error icon)                            │
│                                                               │
│            Unable to load listings                            │
│                                                               │
│        There was an error fetching listing data.             │
│                   [Retry] [Contact Support]                   │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Action Failed
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  ⚠ Failed to suspend listing                                 │
│                                                               │
│  Error: [Specific error message]                             │
│                                                               │
│  [Retry]  [Cancel]                                           │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Accessibility

- Table rows keyboard navigable
- Action buttons have clear labels
- Modal focus trapped
- Status badges have text alternatives
- Confirmation required for destructive actions
- Screen reader announces list updates
- Progress bars have aria-valuenow
