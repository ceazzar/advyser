# Advisor Dashboard Wireframe

## Page Purpose
The central hub for advisors to monitor their business performance, manage incoming leads, and stay on top of daily activities. Provides at-a-glance KPIs and actionable items requiring immediate attention.

## URL Pattern
`/advisor/dashboard`

## User Role
advisor (authenticated)

## Desktop Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│  [Advyser Logo]                                    [Upgrade to Pro]  [🔔 3]  [Avatar ▼]  │
├─────────────┬────────────────────────────────────────────────────────────────────────────┤
│             │                                                                            │
│  ┌────────┐ │  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 📊     │ │  │  Good morning, [First Name]                                        │   │
│  │Dashboard│ │  │  Here's what's happening with your practice today                 │   │
│  └────────┘ │  └─────────────────────────────────────────────────────────────────────┘   │
│  ┌────────┐ │                                                                            │
│  │ 📥     │ │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │ Leads  │ │  │  New Leads   │ │ Response Time│ │  Conversion  │ │Profile Views │       │
│  └────────┘ │  │              │ │              │ │    Rate      │ │              │       │
│  ┌────────┐ │  │     12       │ │    2.4 hrs   │ │    34%       │ │     847      │       │
│  │ 👥     │ │  │  this week   │ │   avg        │ │  this month  │ │  this month  │       │
│  │Clients │ │  │  ↑ 20%       │ │  ↓ 15%       │ │  ↑ 5%        │ │  ↑ 12%       │       │
│  └────────┘ │  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘       │
│  ┌────────┐ │                                                                            │
│  │ 💬     │ │  ┌─────────────────────────────────────┐ ┌────────────────────────────┐    │
│  │Messages│ │  │  Leads Requiring Action         (5) │ │  Profile Completeness      │    │
│  └────────┘ │  ├─────────────────────────────────────┤ ├────────────────────────────┤    │
│  ┌────────┐ │  │                                     │ │                            │    │
│  │ 📅     │ │  │  ┌─────────────────────────────┐    │ │  ████████████░░░░  75%     │    │
│  │Bookings│ │  │  │ Sarah M.              NEW   │    │ │                            │    │
│  └────────┘ │  │  │ SMSF setup guidance         │    │ │  Missing:                  │    │
│  ┌────────┐ │  │  │ Video preferred • 2hrs ago  │    │ │  • Profile photo           │    │
│  │ 👤     │ │  │  │        [✓ Accept] [✕ Decline]│   │ │  • Service descriptions    │    │
│  │Profile │ │  │  └─────────────────────────────┘    │ │  • Credentials upload      │    │
│  └────────┘ │  │                                     │ │                            │    │
│  ┌────────┐ │  │  ┌─────────────────────────────┐    │ │  [Complete Profile →]      │    │
│  │ 👥     │ │  │  │ James K.           PENDING  │    │ └────────────────────────────┘    │
│  │ Team   │ │  │  │ Retirement planning advice  │    │                                   │
│  └────────┘ │  │  │ Phone preferred • 1 day ago │    │ ┌────────────────────────────┐    │
│  ┌────────┐ │  │  │        [✓ Accept] [✕ Decline]│   │ │  Copilot Usage (Pro)       │    │
│  │ ⚙️     │ │  │  └─────────────────────────────┘    │ ├────────────────────────────┤    │
│  │Settings│ │  │                                     │ │                            │    │
│  └────────┘ │  │  ┌─────────────────────────────┐    │ │  ████████░░░░░░░░  12/25   │    │
│             │  │  │ Maria L.           PENDING  │    │ │  reports this month        │    │
│             │  │  │ First home buyer loan       │    │ │                            │    │
│             │  │  │ In-person • 3 days ago      │    │ │  [Generate Report]         │    │
│             │  │  │        [✓ Accept] [✕ Decline]│   │ └────────────────────────────┘    │
│             │  │  └─────────────────────────────┘    │                                   │
│             │  │                                     │                                   │
│             │  │  [View All Leads →]                 │                                   │
│             │  └─────────────────────────────────────┘                                   │
│             │                                                                            │
│             │  ┌─────────────────────────────────────────────────────────────────────┐   │
│             │  │  Recent Activity                                                    │   │
│             │  ├─────────────────────────────────────────────────────────────────────┤   │
│             │  │                                                                     │   │
│             │  │  🟢  New lead received from Sarah M.                    2 hrs ago   │   │
│             │  │  📧  Message sent to David R.                           4 hrs ago   │   │
│             │  │  ✓   Meeting completed with Emma T.                     Yesterday   │   │
│             │  │  🔄  Lead status changed: James K. → Contacted          Yesterday   │   │
│             │  │  👤  Profile viewed by potential client                 2 days ago  │   │
│             │  │                                                                     │   │
│             │  │  [View All Activity →]                                              │   │
│             │  └─────────────────────────────────────────────────────────────────────┘   │
│             │                                                                            │
└─────────────┴────────────────────────────────────────────────────────────────────────────┘
```

## Mobile Layout (375px)

```
┌─────────────────────────────────┐
│  [≡]  Advyser      [🔔 3] [👤]  │
├─────────────────────────────────┤
│                                 │
│  Good morning, [First Name]     │
│                                 │
│  ┌──────────┐ ┌──────────┐      │
│  │New Leads │ │ Response │      │
│  │    12    │ │  2.4 hrs │      │
│  │  ↑ 20%   │ │  ↓ 15%   │      │
│  └──────────┘ └──────────┘      │
│                                 │
│  ┌──────────┐ ┌──────────┐      │
│  │Conversion│ │ Views    │      │
│  │   34%    │ │   847    │      │
│  │  ↑ 5%    │ │  ↑ 12%   │      │
│  └──────────┘ └──────────┘      │
│                                 │
│  ┌─────────────────────────┐    │
│  │ Leads Requiring Action  │    │
│  ├─────────────────────────┤    │
│  │ Sarah M.           NEW  │    │
│  │ SMSF setup guidance     │    │
│  │ [✓ Accept] [✕ Decline]  │    │
│  ├─────────────────────────┤    │
│  │ James K.        PENDING │    │
│  │ Retirement planning     │    │
│  │ [✓ Accept] [✕ Decline]  │    │
│  └─────────────────────────┘    │
│                                 │
│  [View All Leads →]             │
│                                 │
│  ┌─────────────────────────┐    │
│  │ Profile Completeness    │    │
│  │ ████████████░░░░  75%   │    │
│  │ [Complete Profile →]    │    │
│  └─────────────────────────┘    │
│                                 │
├─────────────────────────────────┤
│  [📊] [📥] [💬] [📅] [👤]       │
│  Home Leads Msgs Book Prof      │
└─────────────────────────────────┘
```

## Components

### Header
- **Business Logo**: Links to dashboard
- **Upgrade to Pro Button**: Shown for free tier users; opens upgrade modal
- **Notification Bell**: Badge count for unread notifications; dropdown on click
- **Avatar Dropdown**: Account settings, logout, switch account (if applicable)

### Left Navigation
| Item | Icon | Path | Badge |
|------|------|------|-------|
| Dashboard | 📊 | `/advisor/dashboard` | - |
| Leads | 📥 | `/advisor/leads` | Unread count |
| Clients | 👥 | `/advisor/clients` | - |
| Messages | 💬 | `/advisor/messages` | Unread count |
| Bookings | 📅 | `/advisor/bookings` | Today's count |
| Profile | 👤 | `/advisor/profile` | Incomplete indicator |
| Team | 👥 | `/advisor/team` | - |
| Settings | ⚙️ | `/advisor/settings` | - |

### KPI Cards
| Card | Metric | Trend | Comparison |
|------|--------|-------|------------|
| New Leads | Count this week | ↑/↓ % | vs. last week |
| Response Time | Average hours | ↑/↓ % | vs. last month |
| Conversion Rate | % this month | ↑/↓ % | vs. last month |
| Profile Views | Count this month | ↑/↓ % | vs. last month |

### Leads Requiring Action Card
- Shows up to 5 most urgent leads (NEW or PENDING status)
- Each lead displays:
  - Consumer first name + last initial
  - Goal summary (truncated to 1 line)
  - Preferred meeting mode badge
  - Time since received
  - Quick action buttons
- "View All Leads" link at bottom

### Profile Completeness Indicator
- Progress bar with percentage
- List of missing/incomplete items
- CTA button to complete profile
- Hides when 100% complete

### Copilot Usage Summary (Pro Only)
- Usage bar showing runs used/available
- "Generate Report" CTA
- Not shown for free tier users

### Recent Activity Feed
- Chronological list of recent events
- Event types: New lead, Message sent/received, Booking, Status change, Profile view
- Timestamp for each event
- "View All Activity" link

## Interactions

| Element | Trigger | Action |
|---------|---------|--------|
| Upgrade to Pro | Click | Open pricing/upgrade modal |
| Notification Bell | Click | Open notifications dropdown |
| Avatar | Click | Open account dropdown menu |
| Nav Item | Click | Navigate to page |
| KPI Card | Click | Navigate to detailed report |
| Accept Lead | Click | Change lead status to "Contacted" |
| Decline Lead | Click | Open decline reason modal |
| View All Leads | Click | Navigate to `/advisor/leads` |
| Complete Profile | Click | Navigate to `/advisor/profile` |
| Generate Report | Click | Open Copilot report generator |
| Activity Item | Click | Navigate to related item |

## States

### Loading State
```
┌──────────────────────────────────┐
│  ░░░░░░░░░░░░░  Loading...       │
│  ┌────────┐ ┌────────┐ ┌────────┐│
│  │ ░░░░░░ │ │ ░░░░░░ │ │ ░░░░░░ ││
│  │ ░░░░░░ │ │ ░░░░░░ │ │ ░░░░░░ ││
│  └────────┘ └────────┘ └────────┘│
└──────────────────────────────────┘
```

### Empty State (New Advisor)
```
┌─────────────────────────────────────┐
│  Welcome to Advyser!                │
│                                     │
│  Complete your profile to start     │
│  receiving leads from consumers     │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  1. ✓ Create account        │    │
│  │  2. ○ Complete profile      │    │
│  │  3. ○ Add services          │    │
│  │  4. ○ Set availability      │    │
│  └─────────────────────────────┘    │
│                                     │
│  [Complete Setup →]                 │
└─────────────────────────────────────┘
```

### No Leads State
```
┌─────────────────────────────────┐
│  Leads Requiring Action     (0) │
├─────────────────────────────────┤
│                                 │
│  📭                             │
│  No leads requiring action      │
│                                 │
│  New leads will appear here     │
│  when consumers match with      │
│  your profile.                  │
│                                 │
│  [Optimize Profile →]           │
└─────────────────────────────────┘
```

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/advisor/dashboard/stats` | GET | Fetch KPI metrics |
| `GET /api/advisor/leads?status=new,pending&limit=5` | GET | Fetch leads requiring action |
| `GET /api/advisor/activity?limit=10` | GET | Fetch recent activity |
| `GET /api/advisor/profile/completeness` | GET | Get profile completion status |
| `GET /api/advisor/copilot/usage` | GET | Get Copilot usage (Pro) |
| `PATCH /api/advisor/leads/:id/status` | PATCH | Update lead status |
| `GET /api/advisor/notifications` | GET | Fetch notifications |
| `PATCH /api/advisor/notifications/read` | PATCH | Mark notifications as read |

## Data Models

### DashboardStats
```typescript
interface DashboardStats {
  newLeads: {
    count: number;
    trend: number; // percentage change
    period: 'week';
  };
  responseTime: {
    hours: number;
    trend: number;
    period: 'month';
  };
  conversionRate: {
    percentage: number;
    trend: number;
    period: 'month';
  };
  profileViews: {
    count: number;
    trend: number;
    period: 'month';
  };
}
```

### ActivityItem
```typescript
interface ActivityItem {
  id: string;
  type: 'new_lead' | 'message_sent' | 'message_received' | 'booking' | 'status_change' | 'profile_view';
  description: string;
  relatedId?: string;
  relatedType?: 'lead' | 'message' | 'booking';
  timestamp: Date;
}
```

## Accessibility

- All interactive elements have focus states
- KPI cards are keyboard navigable
- Screen reader announces notification count
- Color contrast meets WCAG AA standards
- Activity feed uses semantic list markup
