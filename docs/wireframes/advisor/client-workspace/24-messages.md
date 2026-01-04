# Client Workspace - Messages Tab Wireframe

## Page Purpose
The Messages tab provides a dedicated conversation thread for all communication with a specific client. It displays the full message history with inline attachments and offers quick actions like inserting Copilot-generated follow-up drafts directly into the composer.

## URL Pattern
`/advisor/clients/:id/messages`

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
│  Profile   │  │          │ ──────── │                                       ││
│  Team      │  ├─────────────────────────────────────────────────────────────┤│
│  Settings  │  │                                                             ││
│            │  │  ┌─────────────────────────────────────────────────────────┐││
│            │  │  │                   CONVERSATION                          │││
│            │  │  │                                                         │││
│            │  │  │  ─────────────── Dec 15, 2024 ───────────────          │││
│            │  │  │                                                         │││
│            │  │  │                          ┌─────────────────────────────┐│││
│            │  │  │                          │ Hi John,                    ││││
│            │  │  │                          │                             ││││
│            │  │  │                          │ Thanks for our call today.  ││││
│            │  │  │                          │ I've attached the SOA draft ││││
│            │  │  │                          │ we discussed.               ││││
│            │  │  │                          │                             ││││
│            │  │  │                          │ 📎 SOA_Draft_v1.pdf (245kb) ││││
│            │  │  │                          │ [Download]                  ││││
│            │  │  │                          │                             ││││
│            │  │  │                          │ Let me know if you have     ││││
│            │  │  │                          │ any questions.              ││││
│            │  │  │                          │                             ││││
│            │  │  │                          │ Best,                       ││││
│            │  │  │                          │ Jane                        ││││
│            │  │  │                          └─────────────────────────────┘│││
│            │  │  │                                         You · 2:34 PM   │││
│            │  │  │                                                         │││
│            │  │  │  ┌─────────────────────────────┐                        │││
│            │  │  │  │ Thanks Jane!                │                        │││
│            │  │  │  │                             │                        │││
│            │  │  │  │ I'll review this over the  │                        │││
│            │  │  │  │ weekend and get back to    │                        │││
│            │  │  │  │ you Monday.                │                        │││
│            │  │  │  │                             │                        │││
│            │  │  │  │ Quick question - should I  │                        │││
│            │  │  │  │ also send through my tax   │                        │││
│            │  │  │  │ returns from last year?    │                        │││
│            │  │  │  └─────────────────────────────┘                        │││
│            │  │  │  John · 4:15 PM                                         │││
│            │  │  │                                                         │││
│            │  │  │  ─────────────── Dec 18, 2024 ───────────────          │││
│            │  │  │                                                         │││
│            │  │  │                          ┌─────────────────────────────┐│││
│            │  │  │                          │ Hi John,                    ││││
│            │  │  │                          │                             ││││
│            │  │  │                          │ Yes, tax returns would be   ││││
│            │  │  │                          │ very helpful. Can you       ││││
│            │  │  │                          │ upload them to the          ││││
│            │  │  │                          │ Documents section?          ││││
│            │  │  │                          │                             ││││
│            │  │  │                          │ Cheers,                     ││││
│            │  │  │                          │ Jane                        ││││
│            │  │  │                          └─────────────────────────────┘│││
│            │  │  │                                         You · 9:12 AM   │││
│            │  │  │                                                         │││
│            │  │  │  ┌─────────────────────────────┐                        │││
│            │  │  │  │ Done! Just uploaded them.   │                        │││
│            │  │  │  │                             │                        │││
│            │  │  │  │ 📎 Tax_Return_2024.pdf      │                        │││
│            │  │  │  │ [Download]                  │                        │││
│            │  │  │  └─────────────────────────────┘                        │││
│            │  │  │  John · 10:45 AM                                        │││
│            │  │  │                                                         │││
│            │  │  │                                                         │││
│            │  │  └─────────────────────────────────────────────────────────┘││
│            │  │                                                             ││
│            │  │  ┌─────────────────────────────────────────────────────────┐││
│            │  │  │                                                         │││
│            │  │  │  ┌─────────────────────────────────────────────────────┐│││
│            │  │  │  │ Type your message...                                ││││
│            │  │  │  │                                                     ││││
│            │  │  │  │                                                     ││││
│            │  │  │  │                                                     ││││
│            │  │  │  └─────────────────────────────────────────────────────┘│││
│            │  │  │                                                         │││
│            │  │  │  [📎 Attach]  [Insert from Copilot ▼]          [Send]  │││
│            │  │  │                                                         │││
│            │  │  └─────────────────────────────────────────────────────────┘││
│            │  │                                                             ││
│            │  │  [View all messages in Messages section →]                  ││
│            │  │                                                             ││
│            │  └─────────────────────────────────────────────────────────────┘│
└────────────┴─────────────────────────────────────────────────────────────────┘
```

## Insert from Copilot Dropdown

```
┌─────────────────────────────────────────────────────────────────┐
│  [Insert from Copilot ▼]                                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Available Drafts                                            ││
│  │                                                             ││
│  │ ┌─────────────────────────────────────────────────────────┐ ││
│  │ │ 📝 Strategy Review Follow-up                            │ ││
│  │ │ Generated: Today, 11:30 AM                              │ ││
│  │ │ "Hi John, Thank you for meeting with me today..."       │ ││
│  │ │                                        [Insert] [View]  │ ││
│  │ └─────────────────────────────────────────────────────────┘ ││
│  │                                                             ││
│  │ ┌─────────────────────────────────────────────────────────┐ ││
│  │ │ 📝 Document Request                                     │ ││
│  │ │ Generated: Dec 15, 2024                                 │ ││
│  │ │ "Hi John, As discussed, could you please..."            │ ││
│  │ │                                        [Insert] [View]  │ ││
│  │ └─────────────────────────────────────────────────────────┘ ││
│  │                                                             ││
│  │ ─────────────────────────────────────────────────────────── ││
│  │                                                             ││
│  │ No drafts? Run Copilot to generate follow-up emails.       ││
│  │                                           [Go to Copilot]  ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## View Draft Modal

```
┌─────────────────────────────────────────────────────────────────┐
│  Follow-up Draft                                            [X] │
│  Generated by Copilot · Today, 11:30 AM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Subject: Strategy Review Follow-up                             │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Hi John,                                                       │
│                                                                 │
│  Thank you for meeting with me today to discuss your            │
│  investment strategy. It was great to review your progress      │
│  toward your retirement goals.                                  │
│                                                                 │
│  As discussed, here are the key action items:                   │
│                                                                 │
│  1. I will prepare a revised SOA reflecting the increased       │
│     super contributions we discussed                            │
│  2. Please send through your latest superannuation statement    │
│  3. Our next review is scheduled for March 15, 2025             │
│                                                                 │
│  If you have any questions in the meantime, please don't        │
│  hesitate to reach out.                                         │
│                                                                 │
│  Best regards,                                                  │
│  Jane Doe                                                       │
│                                                                 │
│                                                                 │
│                   [Insert into Composer]  [Close]               │
└─────────────────────────────────────────────────────────────────┘
```

## Mobile Layout (390px)

```
┌─────────────────────────────────┐
│  [≡]  Advyser        [🔔] [👤] │
├─────────────────────────────────┤
│  ← John Smith                   │
│  ● Active                       │
│                                 │
│  ┌───────────────────────────┐  │
│  │Overview│Msgs│Docs│...│ ▶  │  │
│  │        │────│    │   │    │  │
│  └───────────────────────────┘  │
│                                 │
│  ── Dec 15, 2024 ──            │
│                                 │
│           ┌───────────────────┐ │
│           │ Hi John,          │ │
│           │                   │ │
│           │ Thanks for our    │ │
│           │ call today...     │ │
│           │                   │ │
│           │ 📎 SOA_Draft.pdf  │ │
│           │ [Download]        │ │
│           └───────────────────┘ │
│                    You · 2:34pm │
│                                 │
│  ┌────────────────────┐         │
│  │ Thanks Jane!       │         │
│  │                    │         │
│  │ I'll review this   │         │
│  │ over the weekend...│         │
│  └────────────────────┘         │
│  John · 4:15pm                  │
│                                 │
│  ── Dec 18, 2024 ──            │
│                                 │
│           ┌───────────────────┐ │
│           │ Yes, tax returns  │ │
│           │ would be very     │ │
│           │ helpful...        │ │
│           └───────────────────┘ │
│                    You · 9:12am │
│                                 │
│  ┌────────────────────┐         │
│  │ Done! Just uploaded│         │
│  │                    │         │
│  │ 📎 Tax_Return.pdf  │         │
│  │ [Download]         │         │
│  └────────────────────┘         │
│  John · 10:45am                 │
│                                 │
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │ Type your message...      │  │
│  │                           │  │
│  └───────────────────────────┘  │
│  [📎] [Copilot ▼]      [Send]  │
└─────────────────────────────────┘
```

## Components

### Conversation Area
| Element | Description |
|---------|-------------|
| Date dividers | Horizontal line with date label separating message groups |
| Message bubbles | Rounded rectangles containing message content |
| Advisor messages | Right-aligned, primary brand color background |
| Client messages | Left-aligned, light grey background |
| Sender label | Name and timestamp below each bubble |
| Inline attachments | File icon, name, size within message bubble |
| Download button | Small text link on attachments |

### Message Bubble Anatomy
| Element | Description |
|---------|-------------|
| Container | Rounded corners (8px), max-width 70% of conversation area |
| Text content | Body text, preserves line breaks |
| Attachment card | Nested card with file icon, name, size, download link |
| Timestamp | Muted text, "Name · Time" format |

### Message Composer
| Element | Description |
|---------|-------------|
| Text input | Multi-line textarea, placeholder "Type your message..." |
| Attach button | Opens file picker for attachments |
| Insert from Copilot | Dropdown showing available follow-up drafts |
| Send button | Primary button, disabled when empty |
| Character limit | Optional indicator if limit exists |

### Insert from Copilot Dropdown
| Element | Description |
|---------|-------------|
| Available Drafts | List of Copilot-generated follow-ups for this client |
| Draft card | Title, generation date, preview text |
| Insert button | Inserts draft into composer |
| View button | Opens full draft in modal |
| Empty state | Message suggesting to run Copilot with link |

### Footer Link
| Element | Description |
|---------|-------------|
| View all link | "View all messages in Messages section" links to `/advisor/messages?client=:id` |

## Interactions

| Action | Result |
|--------|--------|
| Type in composer | Enables Send button |
| Click Send | Sends message, clears composer, message appears in thread |
| Click Attach | Opens file picker; selected files show as attachment cards above input |
| Remove attachment | Click X on attachment card before sending |
| Click Insert from Copilot | Opens dropdown with available drafts |
| Click Insert on draft | Inserts full draft text into composer, closes dropdown |
| Click View on draft | Opens modal with full draft content |
| Click Insert into Composer (modal) | Inserts draft, closes modal |
| Click Download on attachment | Downloads file |
| Scroll up in conversation | Loads older messages (infinite scroll) |
| Click View all messages link | Navigates to Messages section filtered to this client |

## Empty State

```
┌─────────────────────────────────────────────────────────────────┐
│                           CONVERSATION                          │
│                                                                 │
│                                                                 │
│                                                                 │
│                         💬                                      │
│                                                                 │
│                  No messages yet                                │
│                                                                 │
│           Start the conversation with John Smith                │
│                                                                 │
│                                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Message States

### Sending
```
┌─────────────────────────────┐
│ Thanks for the update!      │
│                             │
│ Sending...                  │
└─────────────────────────────┘
```

### Failed
```
┌─────────────────────────────┐
│ Thanks for the update!      │
│                             │
│ ⚠ Failed to send [Retry]   │
└─────────────────────────────┘
```

### Read Receipt (optional)
```
                         You · 2:34 PM · ✓ Read
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/advisor/clients/:id/messages` | Fetch conversation with pagination |
| POST | `/api/advisor/clients/:id/messages` | Send new message |
| POST | `/api/advisor/clients/:id/messages/attachments` | Upload attachment |
| GET | `/api/advisor/clients/:id/copilot/drafts` | Fetch available follow-up drafts |
| GET | `/api/advisor/copilot/drafts/:draftId` | Fetch full draft content |

## Data Models

### Message
```typescript
interface Message {
  id: string;
  clientId: string;
  senderId: string;
  senderType: 'advisor' | 'client';
  content: string;
  attachments: Attachment[];
  createdAt: Date;
  readAt?: Date;
  status: 'sending' | 'sent' | 'failed';
}
```

### Attachment
```typescript
interface Attachment {
  id: string;
  messageId: string;
  filename: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedAt: Date;
}
```

### CopilotDraft
```typescript
interface CopilotDraft {
  id: string;
  clientId: string;
  copilotRunId: string;
  type: 'follow_up';
  title: string;
  content: string;
  preview: string;
  status: 'draft' | 'used';
  generatedAt: Date;
}
```

## Real-time Considerations

- WebSocket connection for real-time message delivery
- Optimistic UI updates when sending messages
- Read receipts update in real-time when client views message
- New message indicator if scrolled up in conversation
- Typing indicator (optional): "John is typing..."

## Accessibility Notes

- Messages are in an ARIA live region for screen reader announcements
- Conversation area is scrollable with keyboard
- Attachment download links have descriptive aria-labels
- Send button disabled state communicated to assistive technology
- Focus moves to newest message after sending
- Dropdown menu follows WAI-ARIA combobox pattern
