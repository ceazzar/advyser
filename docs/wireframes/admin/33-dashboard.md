# Admin - Dashboard Wireframe

## Page Purpose
Central command center for Advyser internal staff to monitor platform health, view pending tasks requiring attention, and quickly access key administrative functions.

## URL Pattern
`/admin/dashboard`

## User Role
admin (authenticated, role=admin)

## Desktop Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│  ADVYSER ADMIN                                                    [Admin User ▼]         │
├─────────────────┬────────────────────────────────────────────────────────────────────────┤
│                 │                                                                        │
│  ● Dashboard    │  Dashboard                                             Today: 5 Jan    │
│                 │  ─────────────────────────────────────────────────────────────────     │
│  Claims         │                                                                        │
│                 │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  Listings       │  │ PENDING     │ │ PENDING     │ │ ACTIVE      │ │ ACTIVE      │      │
│                 │  │ CLAIMS      │ │ REVIEWS     │ │ REPORTS     │ │ USERS       │      │
│  Reviews        │  │             │ │             │ │             │ │             │      │
│                 │  │     12      │ │      8      │ │      3      │ │   2,847     │      │
│  Reports        │  │  ⚠ 3 urgent │ │             │ │  1 critical │ │  +47 today  │      │
│                 │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘      │
│  Categories     │                                                                        │
│                 │  ┌─────────────┐                                                       │
│  Analytics      │  │ ACTIVE      │                                                       │
│                 │  │ LISTINGS    │                                                       │
│  Users          │  │             │                                                       │
│                 │  │    1,423    │                                                       │
│  ─────────────  │  │  +12 today  │                                                       │
│                 │  └─────────────┘                                                       │
│  Settings       │                                                                        │
│                 │  ─────────────────────────────────────────────────────────────────     │
│  Logout         │                                                                        │
│                 │  ALERTS REQUIRING ATTENTION                                            │
│                 │  ┌────────────────────────────────────────────────────────────────┐   │
│                 │  │ ⚠ URGENT  Claim #4521 - Submitted 5 days ago, still pending   │   │
│                 │  │           Financial adviser, verification documents attached   │   │
│                 │  │           [Review Now]                                         │   │
│                 │  ├────────────────────────────────────────────────────────────────┤   │
│                 │  │ ⚠ URGENT  Claim #4518 - Multiple fraud flags detected         │   │
│                 │  │           Same IP as denied claim #4402                        │   │
│                 │  │           [Review Now]                                         │   │
│                 │  ├────────────────────────────────────────────────────────────────┤   │
│                 │  │ ! HIGH    Report #891 - Advisor conduct complaint             │   │
│                 │  │           User alleges misleading fee information              │   │
│                 │  │           [View Report]                                        │   │
│                 │  ├────────────────────────────────────────────────────────────────┤   │
│                 │  │ ○ NORMAL  3 reviews pending moderation > 48 hours             │   │
│                 │  │           [Review Queue]                                       │   │
│                 │  └────────────────────────────────────────────────────────────────┘   │
│                 │                                                                        │
│                 │  ─────────────────────────────────────────────────────────────────     │
│                 │                                                                        │
│                 │  PLATFORM METRICS (Last 7 Days)                                        │
│                 │  ┌──────────────────────────────┐ ┌──────────────────────────────┐    │
│                 │  │ NEW SIGNUPS                  │ │ LEADS CREATED                │    │
│                 │  │                              │ │                              │    │
│                 │  │     ╭─╮                      │ │            ╭──╮              │    │
│                 │  │   ╭─╯ ╰─╮  ╭─╮              │ │      ╭─╮  ╭╯  ╰╮ ╭╮          │    │
│                 │  │ ╭─╯     ╰──╯ ╰─╮            │ │    ╭─╯ ╰──╯    ╰─╯╰─╮        │    │
│                 │  │ ╯              ╰────        │ │  ──╯                 ╰──      │    │
│                 │  │ M  T  W  T  F  S  S         │ │  M  T  W  T  F  S  S         │    │
│                 │  │ Total: 312  Avg: 45/day     │ │  Total: 847  Avg: 121/day    │    │
│                 │  └──────────────────────────────┘ └──────────────────────────────┘    │
│                 │                                                                        │
│                 │  ┌──────────────────────────────┐                                      │
│                 │  │ CLAIM APPROVAL RATE          │                                      │
│                 │  │                              │                                      │
│                 │  │  Approved: 78% ████████░░   │                                      │
│                 │  │  Denied:   15% ██░░░░░░░░   │                                      │
│                 │  │  Pending:   7% █░░░░░░░░░   │                                      │
│                 │  │                              │                                      │
│                 │  │  Avg processing: 1.8 days   │                                      │
│                 │  └──────────────────────────────┘                                      │
│                 │                                                                        │
│                 │  ─────────────────────────────────────────────────────────────────     │
│                 │                                                                        │
│                 │  QUICK ACTIONS                                                         │
│                 │  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐             │
│                 │  │ Review Claims  │ │ Moderate       │ │ View Reports   │             │
│                 │  │ (12 pending)   │ │ Reviews (8)    │ │ (3 active)     │             │
│                 │  └────────────────┘ └────────────────┘ └────────────────┘             │
│                 │                                                                        │
│                 │  ─────────────────────────────────────────────────────────────────     │
│                 │                                                                        │
│                 │  SYSTEM STATUS                                                         │
│                 │  ┌────────────────────────────────────────────────────────────────┐   │
│                 │  │ API Health        ● Operational     Response: 45ms avg        │   │
│                 │  │ Search Index      ● Operational     Last sync: 2 min ago      │   │
│                 │  │ Email Service     ● Operational     Queue: 0 pending          │   │
│                 │  │ ABN Lookup        ● Operational     Last check: 5 min ago     │   │
│                 │  │ Payment Gateway   ● Operational     No issues                 │   │
│                 │  └────────────────────────────────────────────────────────────────┘   │
│                 │                                                                        │
└─────────────────┴────────────────────────────────────────────────────────────────────────┘
```

## Components

### Header Bar
- **Logo**: "ADVYSER ADMIN" - links to dashboard
- **Admin User Dropdown**: Shows current admin name
  - Profile Settings
  - Activity Log
  - Logout

### Sidebar Navigation
- **Width**: 200px fixed
- **Background**: Dark gray (#1a1a2e)
- **Active item**: Highlighted with accent color, bullet indicator
- **Items**:
  - Dashboard (home)
  - Claims (with pending count badge)
  - Listings
  - Reviews (with pending count badge)
  - Reports (with count badge if active)
  - Categories
  - Analytics
  - Users
  - Divider
  - Settings
  - Logout

### Stats Cards Row
- **Layout**: 5 cards in a row, equal width
- **Card Structure**:
  - Label (muted, uppercase, small)
  - Large number (primary stat)
  - Sub-stat or badge (contextual)
- **Pending Claims Card**:
  - Shows total pending count
  - Orange "urgent" badge if any > 3 days old
- **Reports Card**:
  - Red "critical" badge for conduct complaints

### Alerts Section
- **Purpose**: Surface items requiring immediate attention
- **Priority Levels**:
  - URGENT (red): Items > 3 days old, fraud flags
  - HIGH (orange): Conduct complaints, escalations
  - NORMAL (gray): Standard pending items
- **Each Alert Row**:
  - Priority badge
  - Description text
  - Context/details
  - Action button

### Charts Section
- **New Signups Chart**:
  - 7-day line chart
  - Shows daily signup count
  - Total and average below
- **Leads Created Chart**:
  - 7-day line chart
  - Shows leads generated
  - Total and average below
- **Claim Approval Rate**:
  - Horizontal bar chart
  - Shows approved/denied/pending percentages
  - Average processing time stat

### Quick Actions
- **Layout**: 3 button cards
- **Each Button**:
  - Primary action label
  - Count in parentheses
  - Links to respective queue

### System Status Panel
- **Purpose**: At-a-glance platform health
- **Status Indicators**:
  - Green dot: Operational
  - Yellow dot: Degraded
  - Red dot: Down
- **Services Monitored**:
  - API Health + response time
  - Search Index + last sync
  - Email Service + queue status
  - ABN Lookup API status
  - Payment Gateway status

## Tablet Layout (768px)

```
┌────────────────────────────────────────────────────────┐
│  ADVYSER ADMIN              [≡]        [Admin User ▼]  │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Dashboard                              Today: 5 Jan   │
│  ────────────────────────────────────────────────────  │
│                                                        │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐         │
│  │ PENDING    │ │ PENDING    │ │ ACTIVE     │         │
│  │ CLAIMS     │ │ REVIEWS    │ │ REPORTS    │         │
│  │    12      │ │     8      │ │     3      │         │
│  │ ⚠ 3 urgent │ │            │ │ 1 critical │         │
│  └────────────┘ └────────────┘ └────────────┘         │
│                                                        │
│  ┌────────────┐ ┌────────────┐                        │
│  │ ACTIVE     │ │ ACTIVE     │                        │
│  │ LISTINGS   │ │ USERS      │                        │
│  │   1,423    │ │   2,847    │                        │
│  └────────────┘ └────────────┘                        │
│                                                        │
│  ALERTS                                                │
│  ┌──────────────────────────────────────────────────┐ │
│  │ ⚠ Claim #4521 - 5 days pending   [Review Now]   │ │
│  ├──────────────────────────────────────────────────┤ │
│  │ ⚠ Claim #4518 - Fraud flags      [Review Now]   │ │
│  ├──────────────────────────────────────────────────┤ │
│  │ ! Report #891 - Conduct          [View Report]  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  [Charts - stacked vertically]                        │
│                                                        │
│  QUICK ACTIONS                                         │
│  [Review Claims] [Moderate Reviews] [View Reports]    │
│                                                        │
│  SYSTEM STATUS                                         │
│  [Collapsed by default - tap to expand]               │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Mobile Layout (375px)

```
┌─────────────────────────────────┐
│  ADVYSER      [≡]    [Admin ▼] │
├─────────────────────────────────┤
│                                 │
│  Dashboard                      │
│  ──────────────────────────     │
│                                 │
│  ┌─────────────────────────┐   │
│  │ PENDING CLAIMS      12  │   │
│  │ ⚠ 3 urgent              │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ PENDING REVIEWS      8  │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ACTIVE REPORTS       3  │   │
│  │ 1 critical              │   │
│  └─────────────────────────┘   │
│                                 │
│  [More stats ▼]                │
│                                 │
│  ──────────────────────────     │
│                                 │
│  URGENT ALERTS (3)              │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ⚠ Claim #4521           │   │
│  │ 5 days pending          │   │
│  │ [Review Now]            │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ⚠ Claim #4518           │   │
│  │ Fraud flags detected    │   │
│  │ [Review Now]            │   │
│  └─────────────────────────┘   │
│                                 │
│  [View All Alerts]             │
│                                 │
│  ──────────────────────────     │
│                                 │
│  QUICK ACTIONS                  │
│  ┌─────────────────────────┐   │
│  │ Review Claims (12)      │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ Moderate Reviews (8)    │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ View Reports (3)        │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

## Interactions

### Auto-Refresh
- Stats cards refresh every 60 seconds
- Alerts section refreshes every 30 seconds
- System status refreshes every 5 minutes
- Visual indicator when data is refreshing

### Alert Actions
- Clicking "Review Now" navigates to specific claim/review
- Alerts can be dismissed (with confirmation)
- Dismissed alerts logged in activity

### Stat Card Clicks
- Clicking any stat card navigates to relevant section
- Pending Claims -> Claims queue (pending tab)
- Active Reports -> Reports queue
- Active Users -> Users management

### Chart Interactions
- Hover shows exact values for that day
- Click chart opens expanded view in Analytics
- Date range shown below chart

## Data Requirements

### Real-time Stats
- `pendingClaimsCount`: Total claims with status 'pending'
- `urgentClaimsCount`: Claims pending > 72 hours
- `pendingReviewsCount`: Reviews awaiting moderation
- `activeReportsCount`: Unresolved reports
- `criticalReportsCount`: Conduct complaints
- `activeListingsCount`: Published listings
- `activeUsersCount`: Users with verified accounts
- `newUsersToday`: Signups in last 24 hours
- `newListingsToday`: Listings created today

### Chart Data
- `signupsByDay`: Array of {date, count} for last 7 days
- `leadsByDay`: Array of {date, count} for last 7 days
- `claimStats`: {approved, denied, pending} percentages
- `avgProcessingTime`: Average claim processing in days

### Alerts
- Fetched from alerts/notifications table
- Filtered by priority and unresolved status
- Max 5 displayed, link to view all

### System Status
- Health check endpoints for each service
- Cached for 5 minutes
- Red alert if any service down

## Permissions

- **Access**: Only users with role='admin' can access
- **Audit Logging**: All page views logged with timestamp, admin ID
- **Session**: Auto-logout after 30 minutes inactivity
- **IP Restriction**: Optional - can restrict to office IPs

## Error States

### Service Down
```
┌────────────────────────────────────────┐
│ ⚠ Unable to load dashboard data        │
│                                        │
│ Some services may be unavailable.      │
│ Last successful load: 10:45 AM         │
│                                        │
│ [Retry] [View System Status]           │
└────────────────────────────────────────┘
```

### Partial Data
- Individual cards show "---" if data unavailable
- Charts show "Data unavailable" placeholder
- System status shows specific service issues

## Accessibility

- All stats have aria-labels with full context
- Alert priority levels announced to screen readers
- Chart data available as table alternative
- Keyboard navigation through all interactive elements
- Focus indicators on all clickable items
- Color not sole indicator (icons + text for status)
