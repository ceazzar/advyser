# Claim Business Entry Page Wireframe

## Page Purpose
Entry point for advisors to search for and initiate the claim process for their business on the Advyser platform. This page enables advisors to find their existing business listing (from aggregated data) or create a new one if not found.

## URL Pattern
`/claim`

## User Role
advisor (unauthenticated or authenticated without a claimed business)

## Desktop Layout (1440px)

```
+-----------------------------------------------------------------------------------+
|  [Logo] Advyser                                          [Log In]  [Sign Up]      |
+-----------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------+
|                                                                                   |
|                    ┌─────────────────────────────────────────────┐                |
|                    │                                             │                |
|                    │      CLAIM YOUR BUSINESS ON ADVYSER         │                |
|                    │                                             │                |
|                    │   Get verified, attract clients, and grow   │                |
|                    │            your advisory practice           │                |
|                    │                                             │                |
|                    └─────────────────────────────────────────────┘                |
|                                                                                   |
|           ┌─────────────────────────────────────────────────────────────┐         |
|           │  🔍  Search for your business by name or ABN                │         |
|           │  ┌─────────────────────────────────────────────────────┐    │         |
|           │  │ e.g., "ABC Financial Planning" or "12 345 678 901"  │    │         |
|           │  └─────────────────────────────────────────────────────┘    │         |
|           │                                            [Search]         │         |
|           └─────────────────────────────────────────────────────────────┘         |
|                                                                                   |
+-----------------------------------------------------------------------------------+

                           SEARCH RESULTS (After Search)

+-----------------------------------------------------------------------------------+
|                                                                                   |
|     Showing 3 results for "ABC Financial"                                         |
|                                                                                   |
|     ┌───────────────────────────────────────────────────────────────────────┐     |
|     │                                                                       │     |
|     │  ABC Financial Planning Pty Ltd                                       │     |
|     │  ─────────────────────────────────────────────────────────────────    │     |
|     │  ABN: 12 345 678 901                                                  │     |
|     │  📍 123 Collins Street, Melbourne VIC 3000                            │     |
|     │  Type: Financial Adviser                                              │     |
|     │                                                                       │     |
|     │  Status: ○ Unclaimed                                                  │     |
|     │                                                                       │     |
|     │                                      [Claim This Business]            │     |
|     │                                                                       │     |
|     └───────────────────────────────────────────────────────────────────────┘     |
|                                                                                   |
|     ┌───────────────────────────────────────────────────────────────────────┐     |
|     │                                                                       │     |
|     │  ABC Wealth Advisory Group                                            │     |
|     │  ─────────────────────────────────────────────────────────────────    │     |
|     │  ABN: 98 765 432 109                                                  │     |
|     │  📍 456 George Street, Sydney NSW 2000                                │     |
|     │  Type: Financial Adviser                                              │     |
|     │                                                                       │     |
|     │  Status: ● Claimed                                                    │     |
|     │                                                                       │     |
|     │  This business has been claimed.  [Contact Support]                   │     |
|     │                                                                       │     |
|     └───────────────────────────────────────────────────────────────────────┘     |
|                                                                                   |
|     ┌───────────────────────────────────────────────────────────────────────┐     |
|     │                                                                       │     |
|     │  ABC Property & Mortgage Solutions                                    │     |
|     │  ─────────────────────────────────────────────────────────────────    │     |
|     │  ABN: 11 222 333 444                                                  │     |
|     │  📍 789 Queen Street, Brisbane QLD 4000                               │     |
|     │  Type: Mortgage Broker                                                │     |
|     │                                                                       │     |
|     │  Status: ○ Unclaimed                                                  │     |
|     │                                                                       │     |
|     │                                      [Claim This Business]            │     |
|     │                                                                       │     |
|     └───────────────────────────────────────────────────────────────────────┘     |
|                                                                                   |
+-----------------------------------------------------------------------------------+

                           NO RESULTS STATE

+-----------------------------------------------------------------------------------+
|                                                                                   |
|     No businesses found for "XYZ Advisory"                                        |
|                                                                                   |
|     ┌───────────────────────────────────────────────────────────────────────┐     |
|     │                                                                       │     |
|     │        Can't find your business?                                      │     |
|     │                                                                       │     |
|     │        Your business may not be in our database yet.                  │     |
|     │        You can create a new listing and get verified.                 │     |
|     │                                                                       │     |
|     │                     [Create New Listing]                              │     |
|     │                                                                       │     |
|     │        Or try searching with your exact ABN                           │     |
|     │                                                                       │     |
|     └───────────────────────────────────────────────────────────────────────┘     |
|                                                                                   |
+-----------------------------------------------------------------------------------+

                           WHY CLAIM SECTION

+-----------------------------------------------------------------------------------+
|                                                                                   |
|                    WHY CLAIM YOUR BUSINESS ON ADVYSER?                            |
|                                                                                   |
|     ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐          |
|     │                   │  │                   │  │                   │          |
|     │    💼 Get Leads   │  │  ✓ Verified Badge │  │  📊 Dashboard     │          |
|     │                   │  │                   │  │     Access        │          |
|     │  Receive enquiries│  │  Build trust with │  │                   │          |
|     │  from Australians │  │  a verified       │  │  Manage reviews,  │          |
|     │  actively seeking │  │  professional     │  │  respond to       │          |
|     │  financial advice │  │  badge on your    │  │  enquiries, and   │          |
|     │                   │  │  profile          │  │  track your       │          |
|     │                   │  │                   │  │  performance      │          |
|     │                   │  │                   │  │                   │          |
|     └───────────────────┘  └───────────────────┘  └───────────────────┘          |
|                                                                                   |
|     ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐          |
|     │                   │  │                   │  │                   │          |
|     │  🛡️ Control Your  │  │  🤖 AI Copilot    │  │  📈 Grow Your     │          |
|     │     Listing       │  │     (Pro Plan)    │  │     Practice      │          |
|     │                   │  │                   │  │                   │          |
|     │  Update your      │  │  Get AI-powered   │  │  Stand out in     │          |
|     │  services, bio,   │  │  lead responses   │  │  search results   │          |
|     │  and pricing      │  │  and client       │  │  and attract      │          |
|     │  anytime          │  │  matching         │  │  ideal clients    │          |
|     │                   │  │                   │  │                   │          |
|     └───────────────────┘  └───────────────────┘  └───────────────────┘          |
|                                                                                   |
+-----------------------------------------------------------------------------------+

                           TRUST INDICATORS

+-----------------------------------------------------------------------------------+
|                                                                                   |
|     ┌───────────────────────────────────────────────────────────────────────┐     |
|     │                                                                       │     |
|     │  🔒 Secure Verification Process                                       │     |
|     │                                                                       │     |
|     │  We verify all claims against ASIC, ABR, and state regulatory         │     |
|     │  databases to ensure only legitimate advisors can claim listings.     │     |
|     │                                                                       │     |
|     │  [ASIC Logo]  [ABR Logo]  [MoneySmart Logo]                           │     |
|     │                                                                       │     |
|     └───────────────────────────────────────────────────────────────────────┘     |
|                                                                                   |
+-----------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------+
|  Footer: About | Terms | Privacy | Help Centre                © 2025 Advyser    |
+-----------------------------------------------------------------------------------+
```

## Mobile Layout (375px)

```
+----------------------------------+
|  [≡] Advyser            [Log In] |
+----------------------------------+

+----------------------------------+
|                                  |
|   CLAIM YOUR BUSINESS            |
|      ON ADVYSER                  |
|                                  |
|  Get verified, attract clients,  |
|  and grow your advisory practice |
|                                  |
+----------------------------------+

+----------------------------------+
|  Search for your business        |
|  by name or ABN                  |
|  ┌─────────────────────────────┐ |
|  │ Enter business name or ABN  │ |
|  └─────────────────────────────┘ |
|  [        Search        ]        |
+----------------------------------+

        SEARCH RESULTS

+----------------------------------+
|  3 results for "ABC Financial"   |
+----------------------------------+

+----------------------------------+
|  ABC Financial Planning Pty Ltd  |
|  ────────────────────────────    |
|  ABN: 12 345 678 901             |
|  📍 123 Collins St, Melbourne    |
|  Type: Financial Adviser         |
|                                  |
|  Status: ○ Unclaimed             |
|                                  |
|  [   Claim This Business   ]     |
+----------------------------------+

+----------------------------------+
|  ABC Wealth Advisory Group       |
|  ────────────────────────────    |
|  ABN: 98 765 432 109             |
|  📍 456 George St, Sydney        |
|  Type: Financial Adviser         |
|                                  |
|  Status: ● Claimed               |
|                                  |
|  [   Contact Support   ]         |
+----------------------------------+

        NO RESULTS STATE

+----------------------------------+
|  No businesses found             |
|  ────────────────────────────    |
|                                  |
|  Can't find your business?       |
|                                  |
|  Your business may not be in     |
|  our database yet.               |
|                                  |
|  [   Create New Listing   ]      |
|                                  |
|  Or try your exact ABN           |
+----------------------------------+

        WHY CLAIM

+----------------------------------+
|                                  |
|  WHY CLAIM YOUR BUSINESS?        |
|                                  |
|  ┌────────────────────────────┐  |
|  │ 💼 Get Leads               │  |
|  │ Receive enquiries from     │  |
|  │ Australians seeking advice │  |
|  └────────────────────────────┘  |
|                                  |
|  ┌────────────────────────────┐  |
|  │ ✓ Verified Badge           │  |
|  │ Build trust with a         │  |
|  │ verified professional badge│  |
|  └────────────────────────────┘  |
|                                  |
|  ┌────────────────────────────┐  |
|  │ 📊 Dashboard Access        │  |
|  │ Manage reviews, respond    │  |
|  │ to enquiries, track stats  │  |
|  └────────────────────────────┘  |
|                                  |
+----------------------------------+

+----------------------------------+
|  🔒 Secure Verification          |
|                                  |
|  We verify against ASIC, ABR,    |
|  and state regulatory databases  |
+----------------------------------+

+----------------------------------+
| About | Terms | Privacy | Help   |
|        © 2025 Advyser            |
+----------------------------------+
```

## Components

### Header Navigation
- **Logo**: Advyser wordmark, links to homepage
- **Auth buttons**: Log In (text link), Sign Up (primary button)
- **Mobile**: Hamburger menu with auth options

### Hero Section
- **Headline**: "Claim Your Business on Advyser"
- **Subheadline**: "Get verified, attract clients, and grow your advisory practice"
- **Background**: Subtle gradient or professional pattern

### Search Box
| Element | Specification |
|---------|---------------|
| Input field | 600px wide, 48px height, 8px border-radius |
| Placeholder | "e.g., 'ABC Financial Planning' or '12 345 678 901'" |
| Search button | Primary button, 120px wide |
| Debounce | 300ms delay before API call |
| Minimum chars | 3 characters before search |

### Business Result Card
| Element | Specification |
|---------|---------------|
| Card width | 100% of container (max 800px) |
| Padding | 24px |
| Border | 1px solid #E5E7EB, 8px border-radius |
| Hover state | Subtle shadow elevation |
| Business name | 18px semibold, primary text color |
| ABN display | Formatted with spaces: XX XXX XXX XXX |
| Address | With map pin icon |
| Type badge | Small pill showing advisor category |

### Claim Status Indicators
| Status | Display | Action |
|--------|---------|--------|
| Unclaimed | ○ Grey circle + "Unclaimed" | [Claim This Business] primary button |
| Claimed | ● Green circle + "Claimed" | [Contact Support] secondary link |
| Pending | ◐ Yellow circle + "Claim Pending" | "A claim is being reviewed" + [Contact Support] |

### No Results Card
- **Headline**: "Can't find your business?"
- **Body text**: "Your business may not be in our database yet. You can create a new listing and get verified."
- **Primary CTA**: [Create New Listing] button
- **Secondary text**: "Or try searching with your exact ABN"

### Benefits Cards
| Benefit | Icon | Title | Description |
|---------|------|-------|-------------|
| Leads | Briefcase | Get Leads | Receive enquiries from Australians actively seeking financial advice |
| Verification | Checkmark | Verified Badge | Build trust with a verified professional badge on your profile |
| Dashboard | Chart | Dashboard Access | Manage reviews, respond to enquiries, and track your performance |
| Control | Shield | Control Your Listing | Update your services, bio, and pricing anytime |
| AI | Robot | AI Copilot | Get AI-powered lead responses and client matching (Pro Plan) |
| Growth | Trend | Grow Your Practice | Stand out in search results and attract ideal clients |

### Trust Indicators Section
- Lock icon with "Secure Verification Process" heading
- Explanation of verification against regulatory bodies
- Logo row: ASIC, ABR, MoneySmart (greyscale)

## Validation Rules

### Search Input
- **Minimum length**: 3 characters
- **ABN detection**: If 11 digits detected (ignoring spaces), treat as ABN search
- **ABN format**: Accept with or without spaces
- **Special characters**: Strip all except alphanumeric and spaces
- **Max length**: 100 characters

### ABN Validation (if ABN entered)
- Must be exactly 11 digits
- Must pass ABN checksum algorithm
- Must match active record in ABR database

## Error States

### Search Errors
| Error | Display |
|-------|---------|
| Search too short | "Please enter at least 3 characters" (inline hint) |
| Invalid ABN format | "ABN must be 11 digits" (inline error) |
| ABN checksum fail | "This doesn't appear to be a valid ABN" |
| API error | "Something went wrong. Please try again." with retry button |
| Rate limited | "Too many searches. Please wait a moment." |

### Claimed Business States
| Scenario | Display |
|----------|---------|
| Already claimed by user | "You've already claimed this business" + [Go to Dashboard] |
| Claimed by other | "This business has been claimed. If you believe this is an error, please [Contact Support]" |
| Claim pending (by other) | "A claim for this business is under review" + [Contact Support] |
| Claim pending (by user) | "Your claim is under review" + [View Status] |

## API Endpoints

### Search Businesses
```
GET /api/v1/businesses/search
Query params:
- q: search query (string)
- type: "name" | "abn" (auto-detected)
- limit: 20 (default)
- offset: 0 (pagination)

Response:
{
  results: [
    {
      id: "uuid",
      trading_name: "ABC Financial Planning Pty Ltd",
      legal_name: "ABC Financial Planning Pty Ltd",
      abn: "12345678901",
      address: {
        street: "123 Collins Street",
        suburb: "Melbourne",
        state: "VIC",
        postcode: "3000"
      },
      advisor_type: "financial_adviser",
      claim_status: "unclaimed" | "claimed" | "pending"
    }
  ],
  total: 3,
  query: "ABC Financial"
}
```

## Accessibility Notes
- Search input has proper aria-label
- Search results announced via aria-live region
- Business cards are focusable with keyboard navigation
- Status indicators have text labels, not just colors/icons
- Sufficient color contrast for all text (WCAG 2.1 AA)

## AU Compliance Notes
- ABN validation uses ABR (Australian Business Register) API
- ABN displayed in standard format: XX XXX XXX XXX
- No personal information collected at this stage
- Privacy policy link visible in footer
- ASIC, ABR logos used with appropriate permissions
- Search data logged for fraud prevention (disclosed in privacy policy)

## Analytics Events
| Event | Trigger | Properties |
|-------|---------|------------|
| `claim_page_viewed` | Page load | - |
| `claim_search_performed` | Search submitted | query_type, query_length |
| `claim_result_viewed` | Result card visible | business_id, claim_status |
| `claim_initiated` | "Claim This Business" clicked | business_id |
| `claim_support_clicked` | "Contact Support" clicked | business_id |
| `claim_new_listing_clicked` | "Create New Listing" clicked | search_query |

## State Management
```typescript
interface ClaimEntryState {
  searchQuery: string;
  searchType: 'name' | 'abn' | null;
  isSearching: boolean;
  results: Business[];
  totalResults: number;
  error: string | null;
  hasSearched: boolean;
}
```

## Related Wireframes
- Previous: User dashboard or homepage
- Next: [30-claim-form.md](./30-claim-form.md) - Multi-step claim form
