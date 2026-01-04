# Admin - Analytics Dashboard Wireframe

## Page Purpose
Comprehensive analytics dashboard providing administrators with insights into platform performance, user behavior, lead generation metrics, and business health indicators. Enables data-driven decision making for platform improvements.

## URL Pattern
`/admin/analytics`

## User Role
admin (authenticated, role=admin)

## Desktop Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│  ADVYSER ADMIN                                                    [Admin User ▼]         │
├─────────────────┬────────────────────────────────────────────────────────────────────────┤
│                 │                                                                        │
│  Dashboard      │  Analytics                                                             │
│                 │  ─────────────────────────────────────────────────────────────────     │
│  Claims         │                                                                        │
│                 │  Date Range: [Last 30 Days ▼]  From: [05 Dec 2025] To: [05 Jan 2026]  │
│  Listings       │                                                                        │
│                 │  Compare to: [Previous Period ▼]                                      │
│  Reviews        │                                                                        │
│                 │  ═══════════════════════════════════════════════════════════════════  │
│  Reports        │                                                                        │
│                 │  KEY METRICS                                                           │
│  Categories     │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐          │
│                 │  │ TOTAL USERS     │ │ TOTAL LISTINGS  │ │ TOTAL LEADS     │          │
│  ● Analytics    │  │                 │ │                 │ │                 │          │
│                 │  │    12,847       │ │     1,713       │ │     8,421       │          │
│  Users          │  │    ↑ 12.3%      │ │    ↑ 8.7%       │ │    ↑ 23.1%      │          │
│                 │  │                 │ │                 │ │                 │          │
│                 │  │  vs prev period │ │  vs prev period │ │  vs prev period │          │
│                 │  └─────────────────┘ └─────────────────┘ └─────────────────┘          │
│                 │                                                                        │
│                 │  ┌─────────────────┐ ┌─────────────────┐                              │
│                 │  │ CONVERSION RATE │ │ AVG RESPONSE    │                              │
│                 │  │                 │ │ TIME            │                              │
│                 │  │     34.2%       │ │    4.2 hours    │                              │
│                 │  │    ↑ 2.1pp      │ │    ↓ 18.3%      │                              │
│                 │  │                 │ │                 │                              │
│                 │  │ Lead → Contact  │ │ better          │                              │
│                 │  └─────────────────┘ └─────────────────┘                              │
│                 │                                                                        │
│                 │  ═══════════════════════════════════════════════════════════════════  │
│                 │                                                                        │
│                 │  USER SIGNUPS OVER TIME                                               │
│                 │  ┌────────────────────────────────────────────────────────────────┐   │
│                 │  │                                                                │   │
│                 │  │  450 ┤                                                         │   │
│                 │  │      │                                    ╭─╮                  │   │
│                 │  │  400 ┤                              ╭─────╯ │                  │   │
│                 │  │      │                        ╭─────╯       ╰──╮               │   │
│                 │  │  350 ┤                  ╭─────╯                 ╰──╮           │   │
│                 │  │      │            ╭─────╯                          ╰──╮        │   │
│                 │  │  300 ┤      ╭─────╯                                    ╰──     │   │
│                 │  │      │ ─────╯                                                  │   │
│                 │  │  250 ┤                                                         │   │
│                 │  │      │                                                         │   │
│                 │  │  200 ┼────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────  │   │
│                 │  │       Dec6 Dec9 Dec12 Dec15 Dec18 Dec21 Dec24 Dec27 Dec30 Jan2 │   │
│                 │  │                                                                │   │
│                 │  │  ── Consumers (9,234)   ── Advisors (3,613)   Total: 12,847   │   │
│                 │  │                                                                │   │
│                 │  └────────────────────────────────────────────────────────────────┘   │
│                 │                                                                        │
│                 │  ═══════════════════════════════════════════════════════════════════  │
│                 │                                                                        │
│                 │  ┌────────────────────────────────┐ ┌──────────────────────────────┐  │
│                 │  │                                │ │                              │  │
│                 │  │  LEADS BY ADVISOR TYPE         │ │  LEAD FUNNEL                 │  │
│                 │  │  ────────────────────────────  │ │  ──────────────────────────  │  │
│                 │  │                                │ │                              │  │
│                 │  │  Financial    ████████████ 42% │ │  Created     ████████  8,421 │  │
│                 │  │  Adviser      (3,537)          │ │               100%           │  │
│                 │  │                                │ │                              │  │
│                 │  │  Mortgage     ███████░░░░ 28%  │ │  Contacted   ██████░░  5,847 │  │
│                 │  │  Broker       (2,358)          │ │               69.4%          │  │
│                 │  │                                │ │                              │  │
│                 │  │  Buyer's      █████░░░░░░ 18%  │ │  Booked      ███░░░░░  2,879 │  │
│                 │  │  Agent        (1,516)          │ │               34.2%          │  │
│                 │  │                                │ │                              │  │
│                 │  │  Property     ███░░░░░░░░ 12%  │ │  Converted   █░░░░░░░    847 │  │
│                 │  │  Adviser      (1,010)          │ │               10.1%          │  │
│                 │  │                                │ │                              │  │
│                 │  └────────────────────────────────┘ └──────────────────────────────┘  │
│                 │                                                                        │
│                 │  ═══════════════════════════════════════════════════════════════════  │
│                 │                                                                        │
│                 │  ┌────────────────────────────────┐ ┌──────────────────────────────┐  │
│                 │  │                                │ │                              │  │
│                 │  │  CLAIMS: SUBMITTED VS STATUS   │ │  VERIFICATION DISTRIBUTION   │  │
│                 │  │  ────────────────────────────  │ │  ──────────────────────────  │  │
│                 │  │                                │ │                              │  │
│                 │  │  250 ┤                         │ │                              │  │
│                 │  │      │     ┌───┐               │ │         Verified             │  │
│                 │  │  200 ┤     │   │ ┌───┐         │ │           43%                │  │
│                 │  │      │     │   │ │   │         │ │        ╭──────╮              │  │
│                 │  │  150 ┤ ┌───│   │ │   │ ┌───┐   │ │       ╱        ╲             │  │
│                 │  │      │ │   │   │ │   │ │   │   │ │      │          │            │  │
│                 │  │  100 ┤ │   │   │ │   │ │   │   │ │  Basic          Enhanced    │  │
│                 │  │      │ │   │   │ │   │ │   │   │ │   32%    ╲  ╱     25%        │  │
│                 │  │   50 ┤ │   │   │ │   │ │   │   │ │          ╰──╯                │  │
│                 │  │      │ │   │   │ │   │ │   │   │ │                              │  │
│                 │  │    0 ┼─┴───┴───┴─┴───┴─┴───┴───│ │  Total: 1,713 listings      │  │
│                 │  │       Week1 Week2 Week3 Week4  │ │                              │  │
│                 │  │                                │ │  Unverified: 0% (unclaimed)  │  │
│                 │  │  ░ Submitted  █ Approved       │ │                              │  │
│                 │  │  ▒ Denied     ▓ Pending        │ │                              │  │
│                 │  │                                │ │                              │  │
│                 │  └────────────────────────────────┘ └──────────────────────────────┘  │
│                 │                                                                        │
│                 │  ═══════════════════════════════════════════════════════════════════  │
│                 │                                                                        │
│                 │  RESPONSE TIME DISTRIBUTION                                           │
│                 │  ┌────────────────────────────────────────────────────────────────┐   │
│                 │  │                                                                │   │
│                 │  │   40% ┤                                                        │   │
│                 │  │       │     ┌────────┐                                         │   │
│                 │  │   30% ┤     │        │                                         │   │
│                 │  │       │     │        │ ┌────────┐                              │   │
│                 │  │   20% ┤     │        │ │        │                              │   │
│                 │  │       │     │        │ │        │ ┌────────┐                   │   │
│                 │  │   10% ┤ ┌───│        │ │        │ │        │                   │   │
│                 │  │       │ │   │        │ │        │ │        │ ┌───┐ ┌───┐       │   │
│                 │  │    0% ┼─┴───┴────────┴─┴────────┴─┴────────┴─┴───┴─┴───┴────   │   │
│                 │  │       <1hr   1-4hr     4-12hr    12-24hr   24-48hr  >48hr      │   │
│                 │  │                                                                │   │
│                 │  │   Median: 4.2 hours   Target: <6 hours   Meeting target: 68%  │   │
│                 │  │                                                                │   │
│                 │  └────────────────────────────────────────────────────────────────┘   │
│                 │                                                                        │
│                 │  ═══════════════════════════════════════════════════════════════════  │
│                 │                                                                        │
│                 │  EXPORT DATA                                                           │
│                 │  ┌────────────────┐ ┌────────────────┐                                │
│                 │  │ Download CSV   │ │ Download PDF   │                                │
│                 │  │                │ │ Report         │                                │
│                 │  └────────────────┘ └────────────────┘                                │
│                 │                                                                        │
└─────────────────┴────────────────────────────────────────────────────────────────────────┘
```

## Components

### Date Range Selector

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                                                                                │
│  Date Range: [Last 30 Days ▼]  From: [05 Dec 2025] To: [05 Jan 2026]          │
│              ┌─────────────────────┐                                          │
│              │ Today               │  Compare to: [Previous Period ▼]         │
│              │ Yesterday           │              ┌─────────────────────┐     │
│              │ Last 7 Days         │              │ Previous Period     │     │
│              │ Last 30 Days     ✓  │              │ Same Period Last Yr │     │
│              │ Last 90 Days        │              │ No Comparison       │     │
│              │ Last 12 Months      │              └─────────────────────┘     │
│              │ Year to Date        │                                          │
│              │ All Time            │                                          │
│              │ ─────────────────── │                                          │
│              │ Custom Range...     │                                          │
│              └─────────────────────┘                                          │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

### Key Metrics Cards

```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ TOTAL USERS     │ │ TOTAL LISTINGS  │ │ TOTAL LEADS     │
│                 │ │                 │ │                 │
│    12,847       │ │     1,713       │ │     8,421       │
│    ↑ 12.3%      │ │    ↑ 8.7%       │ │    ↑ 23.1%      │
│                 │ │                 │ │                 │
│  vs prev period │ │  vs prev period │ │  vs prev period │
└─────────────────┘ └─────────────────┘ └─────────────────┘

┌─────────────────┐ ┌─────────────────┐
│ CONVERSION RATE │ │ AVG RESPONSE    │
│                 │ │ TIME            │
│     34.2%       │ │    4.2 hours    │
│    ↑ 2.1pp      │ │    ↓ 18.3%      │
│                 │ │                 │
│ Lead → Contact  │ │ (better)        │
└─────────────────┘ └─────────────────┘
```

**Card Elements:**
- Metric label (muted)
- Primary value (large, bold)
- Change indicator (green up, red down)
- Comparison context

### User Signups Chart

```
┌────────────────────────────────────────────────────────────────────┐
│  USER SIGNUPS OVER TIME                              [Line ▼]     │
│  ──────────────────────────────────────────────────────────────   │
│                                                                   │
│  [Chart: Line graph with two series]                             │
│                                                                   │
│  Y-axis: User count (0-450)                                      │
│  X-axis: Date (daily for 30 days)                                │
│                                                                   │
│  Series 1: Consumers (blue line)                                 │
│  Series 2: Advisors (green line)                                 │
│                                                                   │
│  Legend: ── Consumers (9,234)   ── Advisors (3,613)              │
│          Total: 12,847                                            │
│                                                                   │
│  Hover: Shows exact values for date                              │
│                                                                   │
└────────────────────────────────────────────────────────────────────┘
```

### Leads by Advisor Type Chart

```
┌────────────────────────────────────────┐
│  LEADS BY ADVISOR TYPE                 │
│  ────────────────────────────────────  │
│                                        │
│  Financial    ████████████ 42%        │
│  Adviser      (3,537 leads)            │
│                                        │
│  Mortgage     ███████░░░░ 28%         │
│  Broker       (2,358 leads)            │
│                                        │
│  Buyer's      █████░░░░░░ 18%         │
│  Agent        (1,516 leads)            │
│                                        │
│  Property     ███░░░░░░░░ 12%         │
│  Adviser      (1,010 leads)            │
│                                        │
│  Hover bars for detailed breakdown     │
│                                        │
└────────────────────────────────────────┘
```

### Lead Funnel Chart

```
┌──────────────────────────────────────┐
│  LEAD FUNNEL                         │
│  ──────────────────────────────────  │
│                                      │
│  Created     ████████████  8,421    │
│              100%                    │
│                 ↓                    │
│  Contacted   █████████░░░  5,847    │
│              69.4%  (drop: 30.6%)   │
│                 ↓                    │
│  Booked      █████░░░░░░░  2,879    │
│              34.2%  (drop: 50.8%)   │
│                 ↓                    │
│  Converted   ██░░░░░░░░░░    847    │
│              10.1%  (drop: 70.6%)   │
│                                      │
│  Click stage for detailed breakdown  │
│                                      │
└──────────────────────────────────────┘
```

### Claims Status Chart

```
┌────────────────────────────────────────┐
│  CLAIMS: SUBMITTED VS STATUS           │
│  ────────────────────────────────────  │
│                                        │
│  [Stacked Bar Chart - Weekly]          │
│                                        │
│  Week 1:  ████░▒▓  (189 total)        │
│  Week 2:  █████░▒▓ (234 total)        │
│  Week 3:  ████░▒▓  (212 total)        │
│  Week 4:  ████░▒▓  (198 total)        │
│                                        │
│  Legend:                               │
│  █ Approved (78%)                      │
│  ░ Submitted/Pending (7%)             │
│  ▒ Denied (12%)                        │
│  ▓ Needs More Info (3%)               │
│                                        │
│  Total Claims: 833                     │
│  Avg Processing Time: 1.8 days        │
│                                        │
└────────────────────────────────────────┘
```

### Verification Distribution Chart

```
┌──────────────────────────────────────┐
│  VERIFICATION DISTRIBUTION           │
│  ──────────────────────────────────  │
│                                      │
│  [Pie/Donut Chart]                   │
│                                      │
│           Verified                   │
│             43%                      │
│          ╭──────╮                    │
│         ╱        ╲                   │
│        │   737    │                  │
│  Basic │          │ Enhanced         │
│   32%  │          │   25%            │
│  (549)  ╲        ╱  (427)            │
│          ╰──────╯                    │
│                                      │
│  Total Active Listings: 1,713        │
│                                      │
│  Click segment for advisor list      │
│                                      │
└──────────────────────────────────────┘
```

### Response Time Histogram

```
┌────────────────────────────────────────────────────────────────────┐
│  RESPONSE TIME DISTRIBUTION                                        │
│  ──────────────────────────────────────────────────────────────    │
│                                                                    │
│  [Histogram - Response times grouped]                              │
│                                                                    │
│    <1hr:   8%   ████                                              │
│   1-4hr:  35%   █████████████████                                 │
│  4-12hr:  25%   ████████████                                      │
│ 12-24hr:  18%   █████████                                         │
│ 24-48hr:   9%   ████                                              │
│   >48hr:   5%   ██                                                │
│                                                                    │
│  Statistics:                                                       │
│  • Median: 4.2 hours                                              │
│  • Average: 8.7 hours                                             │
│  • Target: <6 hours                                               │
│  • Meeting target: 68%                                            │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Export Options

```
┌────────────────────────────────────────────────────────────────────┐
│  EXPORT DATA                                                       │
│  ──────────────────────────────────────────────────────────────    │
│                                                                    │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐         │
│  │ [icon] CSV     │ │ [icon] PDF     │ │ [icon] Schedule│         │
│  │ Download       │ │ Report         │ │ Reports        │         │
│  │                │ │                │ │                │         │
│  │ Raw data       │ │ Formatted      │ │ Weekly/Monthly │         │
│  │ All metrics    │ │ with charts    │ │ automated      │         │
│  └────────────────┘ └────────────────┘ └────────────────┘         │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

## Additional Charts (Scrollable)

### Geographic Distribution

```
┌────────────────────────────────────────────────────────────────────┐
│  LISTINGS BY STATE                                                 │
│  ──────────────────────────────────────────────────────────────    │
│                                                                    │
│  NSW       █████████████████████  42%  (719)                      │
│  VIC       ██████████████░░░░░░░  28%  (480)                      │
│  QLD       █████████░░░░░░░░░░░░  15%  (257)                      │
│  WA        ████░░░░░░░░░░░░░░░░░   8%  (137)                      │
│  SA        ██░░░░░░░░░░░░░░░░░░░   4%  ( 68)                      │
│  Other     █░░░░░░░░░░░░░░░░░░░░   3%  ( 52)                      │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Top Performing Advisors

```
┌────────────────────────────────────────────────────────────────────┐
│  TOP ADVISORS BY LEADS                                             │
│  ──────────────────────────────────────────────────────────────    │
│                                                                    │
│  #  ADVISOR               TYPE         LEADS    CONV RATE          │
│  ─────────────────────────────────────────────────────────────     │
│  1  Smith Financial       FA           156      42%                │
│  2  Brisbane Loans        MB           143      38%                │
│  3  Sydney Buyers         BA           128      35%                │
│  4  Perth Wealth          FA           121      41%                │
│  5  Melbourne Home        BA           118      33%                │
│                                                                    │
│  [View Full Leaderboard]                                          │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Revenue Metrics (if applicable)

```
┌────────────────────────────────────────────────────────────────────┐
│  SUBSCRIPTION REVENUE                                              │
│  ──────────────────────────────────────────────────────────────    │
│                                                                    │
│  MRR (Monthly Recurring)     $48,720        ↑ 8.3%                │
│  ARR (Annual)               $584,640        ↑ 8.3%                │
│                                                                    │
│  By Plan:                                                          │
│  • Basic:      $12,340  (412 subscribers)                         │
│  • Premium:    $24,780  (298 subscribers)                         │
│  • Enterprise: $11,600  ( 29 subscribers)                         │
│                                                                    │
│  Churn Rate: 2.1%   LTV: $847                                     │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

## Tablet Layout (768px)

```
┌────────────────────────────────────────────────────────┐
│  ADVYSER ADMIN              [≡]        [Admin User ▼]  │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Analytics                                             │
│  ────────────────────────────────────────────────────  │
│                                                        │
│  Date Range: [Last 30 Days ▼]                         │
│  From: [05 Dec 2025] To: [05 Jan 2026]               │
│  Compare: [Previous Period ▼]                         │
│                                                        │
│  ════════════════════════════════════════════════════  │
│                                                        │
│  KEY METRICS                                           │
│  ┌───────────────┐ ┌───────────────┐                  │
│  │ TOTAL USERS   │ │ TOTAL LISTINGS│                  │
│  │   12,847      │ │    1,713      │                  │
│  │   ↑ 12.3%     │ │   ↑ 8.7%      │                  │
│  └───────────────┘ └───────────────┘                  │
│                                                        │
│  ┌───────────────┐ ┌───────────────┐                  │
│  │ TOTAL LEADS   │ │ CONVERSION    │                  │
│  │    8,421      │ │    34.2%      │                  │
│  │   ↑ 23.1%     │ │   ↑ 2.1pp     │                  │
│  └───────────────┘ └───────────────┘                  │
│                                                        │
│  ════════════════════════════════════════════════════  │
│                                                        │
│  USER SIGNUPS                                          │
│  ┌──────────────────────────────────────────────────┐ │
│  │ [Line chart - simplified]                        │ │
│  │                                                  │ │
│  │      ╭─────────────╮                            │ │
│  │   ───╯             ╰────                        │ │
│  │                                                  │ │
│  │ Dec 5                               Jan 5       │ │
│  │                                                  │ │
│  │ Consumers: 9,234  Advisors: 3,613              │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ════════════════════════════════════════════════════  │
│                                                        │
│  LEADS BY TYPE          │  LEAD FUNNEL                │
│  ┌─────────────────────┐ ┌───────────────────────┐    │
│  │ FA  ████████ 42%    │ │ Created   8,421      │    │
│  │ MB  █████░░░ 28%    │ │ Contacted 5,847      │    │
│  │ BA  ███░░░░░ 18%    │ │ Booked    2,879      │    │
│  │ PA  ██░░░░░░ 12%    │ │ Converted   847      │    │
│  └─────────────────────┘ └───────────────────────┘    │
│                                                        │
│  [Download CSV] [Download PDF]                        │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Mobile Layout (375px)

```
┌─────────────────────────────────┐
│  ADVYSER      [≡]    [Admin ▼] │
├─────────────────────────────────┤
│                                 │
│  Analytics                      │
│  ──────────────────────────     │
│                                 │
│  [Last 30 Days ▼]               │
│                                 │
│  ═════════════════════════════  │
│                                 │
│  ┌───────────────────────────┐ │
│  │ TOTAL USERS               │ │
│  │    12,847     ↑ 12.3%     │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ TOTAL LISTINGS            │ │
│  │     1,713     ↑ 8.7%      │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ TOTAL LEADS               │ │
│  │     8,421     ↑ 23.1%     │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ CONVERSION RATE           │ │
│  │     34.2%     ↑ 2.1pp     │ │
│  └───────────────────────────┘ │
│                                 │
│  ═════════════════════════════  │
│                                 │
│  USER SIGNUPS                   │
│  ┌───────────────────────────┐ │
│  │ [Simplified line chart]   │ │
│  │                           │ │
│  │    ╭────────╮             │ │
│  │ ───╯        ╰───          │ │
│  │                           │ │
│  │ Total: 12,847             │ │
│  └───────────────────────────┘ │
│                                 │
│  ═════════════════════════════  │
│                                 │
│  LEADS BY TYPE                  │
│  ┌───────────────────────────┐ │
│  │ Financial    42%          │ │
│  │ Mortgage     28%          │ │
│  │ Buyer's      18%          │ │
│  │ Property     12%          │ │
│  └───────────────────────────┘ │
│                                 │
│  [View Full Analytics]         │
│                                 │
│  [Download Report]             │
│                                 │
└─────────────────────────────────┘
```

## Interactions

### Date Range Selection
1. Click date range dropdown
2. Select preset or "Custom Range"
3. If custom, date pickers appear
4. Apply to refresh all charts
5. URL updates with date params

### Chart Interactions
- **Hover**: Shows tooltip with exact values
- **Click segment**: Drills down to detail view
- **Legend click**: Toggles series visibility
- **Chart type toggle**: Some charts allow bar/line switch

### Export Functions
- **CSV**: Raw data for all visible metrics
- **PDF**: Formatted report with all charts
- **Schedule**: Set up automated weekly/monthly emails

### Comparison Mode
- When comparison enabled, all metrics show delta
- Charts overlay comparison period (dashed line)
- Color coding: green (improvement), red (decline)

## Data Requirements

### Metrics Query
```typescript
interface AnalyticsMetrics {
  dateRange: { from: Date; to: Date };
  comparisonRange?: { from: Date; to: Date };

  totalUsers: number;
  totalUsersChange: number;
  usersByType: { consumers: number; advisors: number };

  totalListings: number;
  totalListingsChange: number;
  listingsByType: Record<AdvisorType, number>;

  totalLeads: number;
  totalLeadsChange: number;
  leadsByType: Record<AdvisorType, number>;

  conversionRate: number;
  conversionRateChange: number;

  avgResponseTime: number;
  avgResponseTimeChange: number;
  responseTimeDistribution: { bucket: string; count: number }[];
}
```

### Time Series Data
```typescript
interface TimeSeriesPoint {
  date: Date;
  consumers: number;
  advisors: number;
  total: number;
}

interface LeadFunnelData {
  created: number;
  contacted: number;
  booked: number;
  converted: number;
}

interface ClaimsData {
  week: string;
  submitted: number;
  approved: number;
  denied: number;
  pending: number;
}
```

## Permissions

- **Access**: Only users with role='admin' can access
- **Export CSV**: All admins
- **Export PDF**: All admins
- **Schedule Reports**: May require senior admin
- **View Revenue**: May require finance role

## Cache Strategy

- Key metrics: 5 minute cache
- Charts: 15 minute cache
- Force refresh available
- Background refresh on navigation

## Error States

### Data Load Error
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│                       (error icon)                            │
│                                                               │
│            Unable to load analytics data                      │
│                                                               │
│        There was an error fetching metrics.                  │
│                   [Retry] [Contact Support]                   │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Partial Data
- Individual chart shows "Data unavailable"
- Other charts still display
- Warning banner at top

### Export Error
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  ⚠ Export failed                                             │
│                                                               │
│  Unable to generate report. Please try again.                │
│                                                               │
│  [Retry]  [Cancel]                                           │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Accessibility

- All charts have data table alternatives
- Color blind friendly palette
- Clear labels on all axes
- Screen reader announces metric changes
- Keyboard navigation through charts
- Focus indicators on interactive elements
