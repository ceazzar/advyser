# Advisor Messages Wireframe

## Page Purpose
Central communication hub for advisors to manage all conversations with leads and clients. Features a three-column layout for efficient message management, including conversation list, active thread, and contextual lead/client information.

## URL Pattern
`/advisor/messages`
`/advisor/messages/:conversationId`

## User Role
advisor (authenticated)

## Desktop Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│  [Advyser Logo]                                    [Upgrade to Pro]  [🔔 3]  [Avatar ▼]  │
├─────────────┬────────────────────────────────────────────────────────────────────────────┤
│             │                                                                            │
│  ┌────────┐ │  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ 📊     │ │  │  Messages                                                            │ │
│  │Dashboard│ │  └───────────────────────────────────────────────────────────────────────┘ │
│  └────────┘ │                                                                            │
│  ┌────────┐ │  ┌─────────────────┬─────────────────────────────────┬───────────────────┐ │
│  │ 📥     │ │  │ Conversations   │  Sarah M.                       │ Lead Context      │ │
│  │ Leads  │ │  │                 │  ──────────────────────────────  │ ─────────────────  │ │
│  └────────┘ │  │ 🔍 Search...    │                                 │                   │ │
│  ┌────────┐ │  │                 │  ┌─────────────────────────┐    │ Sarah M.          │ │
│  │ 👥     │ │  │ ┌─────────────┐ │  │ Hi! I saw your profile  │    │ Status: NEW       │ │
│  │Clients │ │  │ │ ● Sarah M.  │ │  │ and I'm interested in   │    │                   │ │
│  └────────┘ │  │ │ Hi! I saw   │ │  │ getting help with my    │    │ Goal:             │ │
│  ┌────────┐ │  │ │ your pro... │ │  │ SMSF setup. Can we      │    │ SMSF setup        │ │
│  │ 💬     │ │  │ │ 2 hrs ago   │ │  │ schedule a call?        │    │ guidance          │ │
│  │Messages│ │  │ │      NEW 🔵 │ │  │                         │    │                   │ │
│  │  (3)   │ │  │ └─────────────┘ │  │         Today 2:30 PM   │    │ Budget:           │ │
│  └────────┘ │  │                 │  └─────────────────────────┘    │ $2,000 - $5,000   │ │
│  ┌────────┐ │  │ ┌─────────────┐ │                                 │                   │ │
│  │ 📅     │ │  │ │   David R.  │ │  ┌─────────────────────────┐    │ Meeting:          │ │
│  │Bookings│ │  │ │ Thanks for  │ │  │ Hi Sarah! Thank you for │    │ 📹 Video call     │ │
│  └────────┘ │  │ │ the info... │ │  │ reaching out. I'd be    │    │                   │ │
│  ┌────────┐ │  │ │ 1 day ago   │ │  │ happy to discuss your   │    │ Timeline:         │ │
│  │ 👤     │ │  │ │  CONTACTED  │ │  │ SMSF needs. Would next  │    │ Next 1-3 months   │ │
│  │Profile │ │  │ └─────────────┘ │  │ Tuesday work for a      │    │                   │ │
│  └────────┘ │  │                 │  │ video call?             │    │ ─────────────────  │ │
│  ┌────────┐ │  │ ┌─────────────┐ │  │                    You  │    │                   │ │
│  │ 👥     │ │  │ │   Lisa M.   │ │  │         Today 2:45 PM   │    │ Quick Actions     │ │
│  │ Team   │ │  │ │ When can we │ │  └─────────────────────────┘    │                   │ │
│  └────────┘ │  │ │ meet?       │ │                                 │ ┌───────────────┐ │ │
│  ┌────────┐ │  │ │ 2 days ago  │ │  ┌─────────────────────────┐    │ │ ✓ Accept Lead │ │ │
│  │ ⚙️     │ │  │ │  CONTACTED  │ │  │ That sounds great! I'm  │    │ └───────────────┘ │ │
│  │Settings│ │  │ └─────────────┘ │  │ flexible Tuesday        │    │ ┌───────────────┐ │ │
│  └────────┘ │  │                 │  │ afternoon. How about    │    │ │ 📅 Book Now   │ │ │
│             │  │ ┌─────────────┐ │  │ 2pm?                    │    │ └───────────────┘ │ │
│             │  │ │   Emma T.   │ │  │                         │    │ ┌───────────────┐ │ │
│             │  │ │ See you on  │ │  │         Just now        │    │ │ 👤 View Lead  │ │ │
│             │  │ │ Tuesday!    │ │  └─────────────────────────┘    │ └───────────────┘ │ │
│             │  │ │ 3 days ago  │ │                                 │                   │ │
│             │  │ │    BOOKED   │ │                                 │ Documents         │ │
│             │  │ └─────────────┘ │                                 │ ─────────────────  │ │
│             │  │                 │                                 │ 📎 super_stmt.pdf │ │
│             │  │                 │                                 │ 📎 tax_2024.pdf   │ │
│             │  │                 │  ┌─────────────────────────────────────────────────┐ │ │
│             │  │                 │  │                                                 │ │ │
│             │  │                 │  │  Type a message...                              │ │ │
│             │  │                 │  │                                                 │ │ │
│             │  │                 │  │  [📎 Attach]  [📄 Templates ▼]       [Send →]   │ │ │
│             │  │                 │  │                                                 │ │ │
│             │  │                 │  └─────────────────────────────────────────────────┘ │ │
│             │  │                 │                                                       │ │
│             │  └─────────────────┴─────────────────────────────────┴───────────────────┘ │
│             │                                                                            │
└─────────────┴────────────────────────────────────────────────────────────────────────────┘
```

## Mobile Layout (375px)

### Conversation List View
```
┌─────────────────────────────────┐
│  [≡]  Messages (3)     [🔔][👤] │
├─────────────────────────────────┤
│                                 │
│  🔍 Search conversations...     │
│                                 │
│  ┌─────────────────────────┐    │
│  │ ● Sarah M.         NEW  │    │
│  │ Hi! I saw your profile  │    │
│  │ and I'm interested...   │    │
│  │ 2 hrs ago           🔵  │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ David R.      CONTACTED │    │
│  │ Thanks for the info,    │    │
│  │ I'll review and...      │    │
│  │ 1 day ago               │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ Lisa M.       CONTACTED │    │
│  │ When can we meet?       │    │
│  │ 2 days ago              │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ Emma T.          BOOKED │    │
│  │ See you on Tuesday!     │    │
│  │ 3 days ago              │    │
│  └─────────────────────────┘    │
│                                 │
├─────────────────────────────────┤
│  [📊] [📥] [💬] [📅] [👤]       │
└─────────────────────────────────┘
```

### Thread View (Mobile)
```
┌─────────────────────────────────┐
│  [←]  Sarah M.    [ℹ️] [🔔][👤] │
│  NEW                            │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐    │
│  │ Hi! I saw your profile  │    │
│  │ and I'm interested in   │    │
│  │ getting help with my    │    │
│  │ SMSF setup. Can we      │    │
│  │ schedule a call?        │    │
│  │         Today 2:30 PM   │    │
│  └─────────────────────────┘    │
│                                 │
│         ┌─────────────────────┐ │
│         │ Hi Sarah! Thank you │ │
│         │ for reaching out.   │ │
│         │ I'd be happy to     │ │
│         │ discuss your SMSF   │ │
│         │ needs. Would next   │ │
│         │ Tuesday work?   You │ │
│         │         Today 2:45  │ │
│         └─────────────────────┘ │
│                                 │
│  ┌─────────────────────────┐    │
│  │ That sounds great! I'm  │    │
│  │ flexible Tuesday        │    │
│  │ afternoon. How about    │    │
│  │ 2pm?                    │    │
│  │         Just now        │    │
│  └─────────────────────────┘    │
│                                 │
├─────────────────────────────────┤
│  [Type a message...]   [📎][→] │
├─────────────────────────────────┤
│  [📊] [📥] [💬] [📅] [👤]       │
└─────────────────────────────────┘
```

### Context Panel (Mobile - Slide-in)
```
┌─────────────────────────────────┐
│  Lead Context             [✕]  │
├─────────────────────────────────┤
│                                 │
│  Sarah M.                       │
│  Status: NEW                    │
│                                 │
│  Goal                           │
│  SMSF setup guidance            │
│                                 │
│  Budget                         │
│  $2,000 - $5,000                │
│                                 │
│  Meeting                        │
│  📹 Video call                  │
│                                 │
│  Timeline                       │
│  Next 1-3 months                │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  [✓ Accept Lead]                │
│  [📅 Book Now]                  │
│  [👤 View Lead Details]         │
│                                 │
│  Documents                      │
│  📎 super_statement.pdf         │
│  📎 tax_return_2024.pdf         │
│                                 │
└─────────────────────────────────┘
```

## Components

### Conversation List (Left Column)
| Element | Description |
|---------|-------------|
| Search Bar | Filter conversations by name/content |
| Conversation Card | Consumer name, last message preview, timestamp, status tag, unread badge |
| Status Tags | NEW, CONTACTED, BOOKED, CONVERTED, CLIENT |

### Conversation Card
```
┌─────────────────────────┐
│ ● [Consumer Name]       │  <- ● = has unread, Name
│ [Last message preview   │  <- Truncated to 2 lines
│  truncated...]          │
│ [Timestamp]   [STATUS]  │  <- Relative time + status badge
│                    🔵   │  <- Unread indicator (if unread)
└─────────────────────────┘
```

### Message Thread (Center Column)
- **Header**: Consumer name, status
- **Messages**: Alternating alignment (consumer left, advisor right)
- **Timestamps**: Shown between messages when time gap > 1 hour
- **Read Receipts**: "Seen" indicator on sent messages
- **Typing Indicator**: Shows when consumer is typing

### Message Bubble (Consumer)
```
┌─────────────────────────┐
│ [Message content]       │
│                         │
│         [Timestamp]     │
└─────────────────────────┘
```

### Message Bubble (Advisor)
```
         ┌─────────────────────────┐
         │ [Message content]  You  │
         │                         │
         │         [Timestamp] ✓✓  │
         └─────────────────────────┘
```

### Message Composer
| Element | Description |
|---------|-------------|
| Text Input | Multi-line textarea with placeholder |
| Attach Button | Opens file upload dialog |
| Templates Dropdown | Insert canned responses |
| Send Button | Submits message |

### Context Panel (Right Column)
| Section | Content |
|---------|---------|
| Consumer Info | Name, status badge |
| Lead Brief | Goal, budget, meeting preference, timeline |
| Quick Actions | Accept Lead, Book Now, View Lead |
| Documents | List of attached files |

### Templates Dropdown
```
┌─────────────────────────────────┐
│  Insert Template            [✕] │
├─────────────────────────────────┤
│  📝 Initial Response            │
│  📝 Request More Information    │
│  📝 Meeting Confirmation        │
│  📝 Follow-up After Meeting     │
│  📝 Proposal Sent               │
│  ─────────────────────────────  │
│  [+ Create New Template]        │
└─────────────────────────────────┘
```

## Canned Responses / Templates

### Initial Response
```
Hi [Name],

Thank you for reaching out! I'd be happy to help you with [goal].

Based on your needs, I think we should schedule a [meeting_preference] to discuss your options in more detail.

Would [suggested_time] work for you?

Best regards,
[Advisor Name]
```

### Request More Information
```
Hi [Name],

Thank you for your enquiry. To better understand your needs, could you please provide some additional information:

1. [Question 1]
2. [Question 2]

This will help me prepare for our discussion.

Best regards,
[Advisor Name]
```

### Meeting Confirmation
```
Hi [Name],

Great! I've confirmed our meeting for:

Date: [Date]
Time: [Time]
Format: [Video/Phone/In-person]

I'll send you a calendar invite shortly. Please let me know if you need to reschedule.

Looking forward to speaking with you!

Best regards,
[Advisor Name]
```

## Interactions

| Element | Trigger | Action |
|---------|---------|--------|
| Search Input | Type | Filter conversations in real-time |
| Conversation Card | Click | Open conversation thread |
| Message Input | Type | Enable send button |
| Send Button | Click | Send message, clear input |
| Attach Button | Click | Open file picker |
| Templates Dropdown | Click | Show template options |
| Template Option | Click | Insert template into composer |
| Accept Lead | Click | Change lead status to Contacted |
| Book Now | Click | Open booking modal |
| View Lead | Click | Navigate to lead detail page |
| Document | Click | Download file |
| Info Button (Mobile) | Click | Open context panel |

## States

### Empty State - No Conversations
```
┌─────────────────────────────────────────┐
│                                         │
│               💬                        │
│                                         │
│     No messages yet                     │
│                                         │
│     When you receive leads and start    │
│     communicating with consumers,       │
│     your conversations will appear      │
│     here.                               │
│                                         │
│     [View Leads →]                      │
│                                         │
└─────────────────────────────────────────┘
```

### Empty Thread Selected
```
┌─────────────────────────────────────────┐
│                                         │
│     Select a conversation               │
│                                         │
│     Choose a conversation from the      │
│     list to view messages.              │
│                                         │
└─────────────────────────────────────────┘
```

### New Conversation (No Messages Yet)
```
┌─────────────────────────────────────────┐
│  Sarah M.                               │
│  NEW                                    │
├─────────────────────────────────────────┤
│                                         │
│     Start the conversation              │
│                                         │
│     Sarah has submitted a lead. Send    │
│     a message to begin the discussion.  │
│                                         │
│     [📄 Use Template: Initial Response] │
│                                         │
└─────────────────────────────────────────┘
```

### Typing Indicator
```
┌─────────────────────────┐
│ ● ● ●                   │  <- Animated dots
│ Sarah is typing...      │
└─────────────────────────┘
```

### Loading State
```
┌─────────────────────────────────────────┐
│  Loading messages...                    │
│                                         │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
│                                         │
└─────────────────────────────────────────┘
```

### Message Sending State
```
         ┌─────────────────────────┐
         │ [Message content]  You  │
         │                         │
         │         Sending... ○    │
         └─────────────────────────┘
```

### Message Failed State
```
         ┌─────────────────────────┐
         │ [Message content]  You  │
         │                         │
         │         ⚠️ Failed [Retry]│
         └─────────────────────────┘
```

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/advisor/conversations` | GET | List all conversations |
| `GET /api/advisor/conversations/:id` | GET | Get conversation details |
| `GET /api/advisor/conversations/:id/messages` | GET | Get messages (paginated) |
| `POST /api/advisor/conversations/:id/messages` | POST | Send message |
| `PATCH /api/advisor/conversations/:id/read` | PATCH | Mark as read |
| `GET /api/advisor/templates` | GET | Get message templates |
| `POST /api/advisor/templates` | POST | Create template |
| `POST /api/advisor/messages/:id/attachments` | POST | Upload attachment |

## Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search conversations |
| `status` | string | Filter by lead/client status |
| `unread` | boolean | Show only unread |
| `page` | number | Pagination page |
| `limit` | number | Messages per page |

## Data Models

### Conversation
```typescript
interface Conversation {
  id: string;
  leadId?: string;
  clientId?: string;
  consumer: {
    id: string;
    name: string;
    avatar?: string;
  };
  status: 'new' | 'contacted' | 'booked' | 'converted' | 'client';
  lastMessage: {
    content: string;
    senderId: string;
    timestamp: Date;
  };
  unreadCount: number;
  isTyping: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'advisor' | 'consumer';
  content: string;
  attachments?: Attachment[];
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  createdAt: Date;
}

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[]; // e.g., ['name', 'goal', 'meeting_preference']
  createdAt: Date;
}
```

## Real-time Features

- **WebSocket Events**:
  - `message:new` - New message received
  - `message:read` - Message read by recipient
  - `typing:start` - Consumer started typing
  - `typing:stop` - Consumer stopped typing
  - `status:change` - Lead/client status changed

## Accessibility

- Conversation list is keyboard navigable
- Messages use proper ARIA labels for sender identification
- New message notifications announced to screen readers
- Send button disabled until message entered
- Templates dropdown is keyboard accessible
- File attachments include file type and size for screen readers
