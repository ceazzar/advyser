# Client Workspace - Overview Tab Wireframe

## Page Purpose
The Overview tab serves as the central hub for an active client relationship, displaying a living Client Brief document alongside key stats, recent activity, and upcoming appointments. It provides advisors with an at-a-glance summary of everything they need to know about a client before any interaction.

## URL Pattern
`/advisor/clients/:id/overview`

## User Role
advisor (authenticated)

## Desktop Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [Logo]  Advyser                                   [🔔 3] [Jane D. ▼]        │
├────────────┬─────────────────────────────────────────────────────────────────┤
│            │  ← Back to Clients                                              │
│  Dashboard │  ┌─────────────────────────────────────────────────────────────┐│
│  Leads     │  │ John Smith                              [Archive] [Message] ││
│  Clients ● │  │ ● Active Client · Financial Advisor                         ││
│  Messages  │  ├─────────────────────────────────────────────────────────────┤│
│  Bookings  │  │ Overview │ Messages │ Documents │ Notes │ Copilot │ Tasks   ││
│  Profile   │  │ ────────                                                    ││
│  Team      │  ├─────────────────────────────────────────────────────────────┤│
│  Settings  │  │                                                             ││
│            │  │  ┌─────────────────────────────┐ ┌─────────────────────────┐││
│            │  │  │ CLIENT BRIEF                │ │ QUICK STATS             │││
│            │  │  │ Living Document             │ │                         │││
│            │  │  │ Last updated: 3 days ago    │ │ ┌─────┐ ┌─────┐        │││
│            │  │  │                             │ │ │  8  │ │ 2d  │        │││
│            │  │  │ GOALS                       │ │ │Sess-│ │ ago │        │││
│            │  │  │ ─────                       │ │ │ions │ │Last │        │││
│            │  │  │ • Retire by 55 with $2M    │ │ └─────┘ └─────┘        │││
│            │  │  │ • Pay off mortgage in 7yr  │ │ ┌─────┐ ┌─────┐        │││
│            │  │  │ • Fund kids' education     │ │ │ 23  │ │  5  │        │││
│            │  │  │                             │ │ │Docs │ │Open │        │││
│            │  │  │ SITUATION SUMMARY           │ │ │     │ │Tasks│        │││
│            │  │  │ ─────────────────           │ │ └─────┘ └─────┘        │││
│            │  │  │ Married, 2 kids (8, 11).   │ │                         │││
│            │  │  │ Both working full-time.    │ └─────────────────────────┘││
│            │  │  │ Combined income ~$280k.    │                             ││
│            │  │  │ Own PPOR in Sydney ($1.2M).│ ┌─────────────────────────┐││
│            │  │  │                             │ │ UPCOMING                │││
│            │  │  │ FINANCIAL SNAPSHOT          │ │                         │││
│            │  │  │ ──────────────────          │ │ ┌─────────────────────┐│││
│            │  │  │ Super: $450k combined      │ │ │ 📅 Strategy Review  ││││
│            │  │  │ Savings: $85k              │ │ │ Tomorrow at 10:00am ││││
│            │  │  │ Mortgage: $620k remaining  │ │ │ Video Call (Zoom)   ││││
│            │  │  │ Investments: $120k shares  │ │ │                     ││││
│            │  │  │                             │ │ │ [View Booking]      ││││
│            │  │  │ PREFERENCES                 │ │ └─────────────────────┘│││
│            │  │  │ ───────────                 │ │                         │││
│            │  │  │ Contact: Email preferred   │ │ No other upcoming       │││
│            │  │  │ Meetings: Mornings, Zoom   │ │ appointments            │││
│            │  │  │ Risk: Moderate-conservative│ └─────────────────────────┘││
│            │  │  │                             │                             ││
│            │  │  │ OUTSTANDING INFO            │ ┌─────────────────────────┐││
│            │  │  │ ────────────────            │ │ TIMELINE                │││
│            │  │  │ ⚠ Awaiting: Tax returns    │ │ Recent Activity         │││
│            │  │  │ ⚠ Awaiting: Super stmt     │ │                         │││
│            │  │  │                             │ │ ● 2 days ago            │││
│            │  │  │ NEXT APPOINTMENT OBJECTIVE  │ │   Meeting completed     │││
│            │  │  │ ──────────────────────────  │ │   "Review discussion"   │││
│            │  │  │ Review current strategy.   │ │                         │││
│            │  │  │ Discuss super contribution │ │ ● 5 days ago            │││
│            │  │  │ increase. Address market   │ │   Document uploaded     │││
│            │  │  │ volatility concerns.       │ │   "Payslip_Dec.pdf"     │││
│            │  │  │                             │ │                         │││
│            │  │  │               [Edit Brief] │ │ ● 1 week ago            │││
│            │  │  └─────────────────────────────┘ │   Note added            │││
│            │  │                                  │   "Risk profile update" │││
│            │  │                                  │                         │││
│            │  │                                  │ ● 2 weeks ago           │││
│            │  │                                  │   Task completed        │││
│            │  │                                  │   "Send SOA draft"      │││
│            │  │                                  │                         │││
│            │  │                                  │ ● 3 weeks ago           │││
│            │  │                                  │   Message sent          │││
│            │  │                                  │   "Follow-up email"     │││
│            │  │                                  │                         │││
│            │  │                                  │ [View Full Timeline →]  │││
│            │  │                                  └─────────────────────────┘││
│            │  │                                                             ││
│            │  └─────────────────────────────────────────────────────────────┘│
└────────────┴─────────────────────────────────────────────────────────────────┘
```

## Edit Brief Modal

```
┌─────────────────────────────────────────────────────────────────┐
│  Edit Client Brief                                          [X] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Goals                                                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ • Retire by 55 with $2M portfolio                          ││
│  │ • Pay off mortgage within 7 years                          ││
│  │ • Fund children's university education                     ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Situation Summary                                              │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Married couple, 2 kids (ages 8 and 11). Both working       ││
│  │ full-time. Combined household income ~$280k p.a. Own       ││
│  │ principal place of residence in Sydney (valued $1.2M).     ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Financial/Property Snapshot                                    │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Super: $450k combined | Savings: $85k | Mortgage: $620k    ││
│  │ Investments: $120k in shares                               ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Preferences                                                    │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Contact: Email preferred                                   ││
│  │ Meetings: Morning slots, Zoom preferred                    ││
│  │ Risk tolerance: Moderate-conservative                      ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Outstanding Information Needed                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ • 2023-24 tax returns                                      ││
│  │ • Latest superannuation statement                          ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Next Appointment Objective                                     │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Review current investment strategy. Discuss increasing     ││
│  │ super contributions. Address concerns about market         ││
│  │ volatility and portfolio rebalancing options.              ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  💡 Tip: This brief can be auto-updated by Copilot after       │
│     meetings. Run Copilot → check "Update Client Brief"        │
│                                                                 │
│                                    [Cancel]  [Save Changes]     │
└─────────────────────────────────────────────────────────────────┘
```

## Mobile Layout (390px)

```
┌─────────────────────────────────┐
│  [≡]  Advyser        [🔔] [👤] │
├─────────────────────────────────┤
│  ← Back                         │
│                                 │
│  John Smith                     │
│  ● Active Client                │
│  [Archive] [Message]            │
│                                 │
│  ┌───────────────────────────┐  │
│  │Overview│Msgs│Docs│...│ ▶  │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ QUICK STATS               │  │
│  │ ┌────┐┌────┐┌────┐┌────┐ │  │
│  │ │ 8  ││ 2d ││ 23 ││ 5  │ │  │
│  │ │Sess││Last││Docs││Task│ │  │
│  │ └────┘└────┘└────┘└────┘ │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ UPCOMING                  │  │
│  │ 📅 Strategy Review        │  │
│  │ Tomorrow, 10:00am         │  │
│  │ Video Call                │  │
│  │ [View Booking]            │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ CLIENT BRIEF              │  │
│  │ [Expand/Collapse ▼]       │  │
│  │                           │  │
│  │ GOALS                     │  │
│  │ • Retire by 55 with $2M  │  │
│  │ • Pay off mortgage 7yr   │  │
│  │ • Fund kids' education   │  │
│  │                           │  │
│  │ SITUATION                 │  │
│  │ Married, 2 kids. Combined │  │
│  │ income ~$280k...          │  │
│  │ [Show more]               │  │
│  │                           │  │
│  │            [Edit Brief]   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ TIMELINE                  │  │
│  │                           │  │
│  │ ● 2 days ago              │  │
│  │   Meeting completed       │  │
│  │                           │  │
│  │ ● 5 days ago              │  │
│  │   Document uploaded       │  │
│  │                           │  │
│  │ [View Full Timeline →]    │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

## Components

### Header Section
| Element | Description |
|---------|-------------|
| Back link | "← Back to Clients" - returns to clients list |
| Client name | H1, client's full name |
| Status badge | Green "Active" or Grey "Archived" pill |
| Service type | Secondary text showing advisor type relationship |
| Archive button | Secondary button, opens confirmation modal |
| Message button | Primary button, opens message composer |

### Client Brief Card
| Element | Description |
|---------|-------------|
| Card title | "CLIENT BRIEF" with "Living Document" subtitle |
| Last updated | Timestamp showing when brief was last modified |
| Goals section | Bulleted list of client objectives |
| Situation summary | Free-text overview of client circumstances |
| Financial snapshot | Key financial figures in condensed format |
| Preferences | Communication and service preferences |
| Outstanding info | Warning items for pending information |
| Next objective | Goals for upcoming appointment |
| Edit Brief button | Opens modal to edit all brief sections |

### Quick Stats
| Stat | Description |
|------|-------------|
| Sessions | Total meeting count |
| Last interaction | Days/weeks since last activity |
| Documents | Total document count |
| Open tasks | Count of pending tasks |

### Upcoming Section
| Element | Description |
|---------|-------------|
| Next booking card | Shows meeting type, date/time, format |
| View Booking link | Navigates to booking detail |
| Empty state | "No upcoming appointments" with [Schedule] link |

### Timeline Preview
| Element | Description |
|---------|-------------|
| Activity items | Last 5 activities with relative timestamps |
| Activity types | Meeting, Document, Note, Task, Message |
| View Full link | Expands to full timeline view |

## Interactions

| Action | Result |
|--------|--------|
| Click "Archive" | Opens confirmation: "Archive John Smith? They will be moved to archived clients." [Cancel] [Archive] |
| Click "Message" | Opens message composer with client pre-selected |
| Click "Edit Brief" | Opens Edit Brief modal |
| Save Brief changes | Updates brief, shows "Brief updated" toast, updates "Last updated" |
| Click "View Booking" | Navigates to `/advisor/bookings/:bookingId` |
| Click timeline item | Navigates to relevant detail (note, document, etc.) |
| Click "View Full Timeline" | Expands timeline section or navigates to dedicated timeline view |
| Click tab | Switches to selected workspace tab |

## States

### Active Client
- Green status badge
- All features enabled
- Can archive

### Archived Client
- Grey "Archived" badge
- "Restore" button replaces "Archive"
- Read-only brief
- Cannot message directly

### No Upcoming Appointments
```
┌─────────────────────────────┐
│ UPCOMING                    │
│                             │
│ No upcoming appointments    │
│                             │
│ [Schedule Meeting]          │
└─────────────────────────────┘
```

### Empty Timeline
```
┌─────────────────────────────┐
│ TIMELINE                    │
│                             │
│ No activity yet             │
│                             │
│ Start by adding a note or   │
│ uploading a document.       │
└─────────────────────────────┘
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/advisor/clients/:id` | Fetch client details including brief |
| PUT | `/api/advisor/clients/:id` | Update client status (archive/restore) |
| PUT | `/api/advisor/clients/:id/brief` | Update client brief |
| GET | `/api/advisor/clients/:id/stats` | Fetch quick stats |
| GET | `/api/advisor/clients/:id/timeline` | Fetch activity timeline |
| GET | `/api/advisor/clients/:id/bookings/upcoming` | Fetch next scheduled booking |

## Data Models

### Client
```typescript
interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: 'active' | 'archived';
  advisorType: 'financial' | 'property';
  brief: ClientBrief;
  createdAt: Date;
  updatedAt: Date;
}
```

### ClientBrief
```typescript
interface ClientBrief {
  goals: string[];
  situationSummary: string;
  financialSnapshot: string;
  preferences: string;
  outstandingInfo: string[];
  nextAppointmentObjective: string;
  updatedAt: Date;
  updatedBy: string; // 'advisor' | 'copilot'
}
```

### TimelineItem
```typescript
interface TimelineItem {
  id: string;
  type: 'meeting' | 'document' | 'note' | 'task' | 'message';
  title: string;
  description?: string;
  timestamp: Date;
  referenceId: string; // ID of related entity
}
```

## Accessibility Notes

- All stats cards have aria-labels describing the metric
- Timeline items are in a list with proper list semantics
- Modal trap focus when Edit Brief is open
- Status badges have aria-label for screen readers
- Tab navigation follows standard tab panel pattern
