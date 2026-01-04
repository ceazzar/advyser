# Admin - Categories Management Wireframe

## Page Purpose
Administrative interface for managing the taxonomy of the Advyser platform including advisor types, specialties, and service offerings. Changes here affect what options are available to advisors when setting up their profiles and how consumers can filter search results.

## URL Pattern
`/admin/categories`

## User Role
admin (authenticated, role=admin)

## Desktop Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│  ADVYSER ADMIN                                                    [Admin User ▼]         │
├─────────────────┬────────────────────────────────────────────────────────────────────────┤
│                 │                                                                        │
│  Dashboard      │  Categories Management                                                 │
│                 │  ─────────────────────────────────────────────────────────────────     │
│  Claims         │                                                                        │
│                 │  ┌──────────────────────────────────────────────────────────────────┐ │
│  Listings       │  │ Advisor Types  │  Specialties  │  Service Offerings  │  Locations │ │
│                 │  │ ══════════════                                                   │ │
│  Reviews        │  └──────────────────────────────────────────────────────────────────┘ │
│                 │                                                                        │
│  Reports        │  ═══════════════════════════════════════════════════════════════════  │
│                 │                                                                        │
│  ● Categories   │  ADVISOR TYPES                                                        │
│                 │  ─────────────────────────────────────────────────────────────────     │
│  Analytics      │                                                                        │
│                 │  These are the primary categories of advisors on the platform.        │
│  Users          │  Changes affect all listings and search functionality.                │
│                 │                                                                        │
│                 │  ┌──────────────────────────────────────────────────────────────────┐ │
│                 │  │                                                                  │ │
│                 │  │  TYPE                │ LISTINGS │ STATUS    │ ACTIONS           │ │
│                 │  │ ─────────────────────┼──────────┼───────────┼───────────────────│ │
│                 │  │                      │          │           │                   │ │
│                 │  │  Financial Adviser   │   847    │ ● Active  │ [Edit] [Disable]  │ │
│                 │  │  ID: financial_adv   │          │           │                   │ │
│                 │  │                      │          │           │                   │ │
│                 │  │  Description: Licensed financial advisers providing           │ │
│                 │  │  personal financial advice and wealth management              │ │
│                 │  │                      │          │           │                   │ │
│                 │  │  Requires: ASIC FAR registration                              │ │
│                 │  │ ─────────────────────┼──────────┼───────────┼───────────────────│ │
│                 │  │                      │          │           │                   │ │
│                 │  │  Mortgage Broker     │   412    │ ● Active  │ [Edit] [Disable]  │ │
│                 │  │  ID: mortgage_broker │          │           │                   │ │
│                 │  │                      │          │           │                   │ │
│                 │  │  Description: Credit representatives helping clients          │ │
│                 │  │  find and secure home loans and refinancing                   │ │
│                 │  │                      │          │           │                   │ │
│                 │  │  Requires: ASIC Credit Register entry                         │ │
│                 │  │ ─────────────────────┼──────────┼───────────┼───────────────────│ │
│                 │  │                      │          │           │                   │ │
│                 │  │  Buyer's Agent       │   298    │ ● Active  │ [Edit] [Disable]  │ │
│                 │  │  ID: buyers_agent    │          │           │                   │ │
│                 │  │                      │          │           │                   │ │
│                 │  │  Description: Licensed agents representing buyers in          │ │
│                 │  │  property purchases                                           │ │
│                 │  │                      │          │           │                   │ │
│                 │  │  Requires: State real estate licence                          │ │
│                 │  │ ─────────────────────┼──────────┼───────────┼───────────────────│ │
│                 │  │                      │          │           │                   │ │
│                 │  │  Property Adviser    │   156    │ ● Active  │ [Edit] [Disable]  │ │
│                 │  │  ID: property_adv    │          │           │                   │ │
│                 │  │                      │          │           │                   │ │
│                 │  │  Description: Property investment advisors and                │ │
│                 │  │  strategists helping clients build portfolios                 │ │
│                 │  │                      │          │           │                   │ │
│                 │  │  Requires: Varies by state                                    │ │
│                 │  │                      │          │           │                   │ │
│                 │  └──────────────────────────────────────────────────────────────────┘ │
│                 │                                                                        │
│                 │  [+ Add New Advisor Type]                                             │
│                 │                                                                        │
│                 │  ⚠ Note: Adding or disabling advisor types affects platform-wide     │
│                 │  functionality. Coordinate with development team for significant     │
│                 │  changes.                                                             │
│                 │                                                                        │
└─────────────────┴────────────────────────────────────────────────────────────────────────┘
```

## Tab States

### Advisor Types Tab (Default)
```
┌──────────────────────────────────────────────────────────────────┐
│ Advisor Types  │  Specialties  │  Service Offerings  │  Locations │
│ ══════════════                                                   │
└──────────────────────────────────────────────────────────────────┘
```
- Primary advisor categories
- Each type has specific verification requirements
- Affects search and filtering

### Specialties Tab
```
┌──────────────────────────────────────────────────────────────────┐
│ Advisor Types  │  Specialties  │  Service Offerings  │  Locations │
│                  ═════════════                                   │
└──────────────────────────────────────────────────────────────────┘
```
- Sub-categories within each advisor type
- Advisors can select multiple
- Used for detailed search filtering

### Service Offerings Tab
```
┌──────────────────────────────────────────────────────────────────┐
│ Advisor Types  │  Specialties  │  Service Offerings  │  Locations │
│                                  ══════════════════              │
└──────────────────────────────────────────────────────────────────┘
```
- Specific services advisors can provide
- Linked to advisor types
- Displayed on profiles

### Locations Tab
```
┌──────────────────────────────────────────────────────────────────┐
│ Advisor Types  │  Specialties  │  Service Offerings  │  Locations │
│                                                        ══════════ │
└──────────────────────────────────────────────────────────────────┘
```
- Geographic areas
- States, cities, regions
- Used for location-based search

## Specialties Tab Layout

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                                                                                │
│  SPECIALTIES                                                                   │
│  ─────────────────────────────────────────────────────────────────────────     │
│                                                                                │
│  Specialties are focus areas within each advisor type. Advisors can           │
│  select multiple specialties for their profile.                               │
│                                                                                │
│  Filter by Advisor Type: [All Types ▼]          Search: [__________] [Search] │
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                          │ │
│  │  SPECIALTY            │ ADVISOR TYPE      │ USAGE  │ STATUS  │ ACTIONS   │ │
│  │ ──────────────────────┼───────────────────┼────────┼─────────┼───────────│ │
│  │                       │                   │        │         │           │ │
│  │  Retirement Planning  │ Financial Adviser │  423   │ Active  │ [Edit]    │ │
│  │  ID: retirement       │                   │        │         │ [Disable] │ │
│  │ ──────────────────────┼───────────────────┼────────┼─────────┼───────────│ │
│  │                       │                   │        │         │           │ │
│  │  SMSF Advice          │ Financial Adviser │  312   │ Active  │ [Edit]    │ │
│  │  ID: smsf             │                   │        │         │ [Disable] │ │
│  │ ──────────────────────┼───────────────────┼────────┼─────────┼───────────│ │
│  │                       │                   │        │         │           │ │
│  │  Wealth Management    │ Financial Adviser │  298   │ Active  │ [Edit]    │ │
│  │  ID: wealth_mgmt      │                   │        │         │ [Disable] │ │
│  │ ──────────────────────┼───────────────────┼────────┼─────────┼───────────│ │
│  │                       │                   │        │         │           │ │
│  │  First Home Buyer     │ Mortgage Broker   │  287   │ Active  │ [Edit]    │ │
│  │  ID: first_home       │                   │        │         │ [Disable] │ │
│  │ ──────────────────────┼───────────────────┼────────┼─────────┼───────────│ │
│  │                       │                   │        │         │           │ │
│  │  Refinancing          │ Mortgage Broker   │  256   │ Active  │ [Edit]    │ │
│  │  ID: refinancing      │                   │        │         │ [Disable] │ │
│  │ ──────────────────────┼───────────────────┼────────┼─────────┼───────────│ │
│  │                       │                   │        │         │           │ │
│  │  Investment Property  │ Mortgage Broker   │  198   │ Active  │ [Edit]    │ │
│  │  ID: invest_property  │ Buyer's Agent     │        │         │ [Disable] │ │
│  │ ──────────────────────┼───────────────────┼────────┼─────────┼───────────│ │
│  │                       │                   │        │         │           │ │
│  │  Prestige Property    │ Buyer's Agent     │   89   │ Active  │ [Edit]    │ │
│  │  ID: prestige         │                   │        │         │ [Disable] │ │
│  │ ──────────────────────┼───────────────────┼────────┼─────────┼───────────│ │
│  │                       │                   │        │         │           │ │
│  │  Aged Care Planning   │ Financial Adviser │   45   │ Active  │ [Edit]    │ │
│  │  ID: aged_care        │                   │        │         │ [Disable] │ │
│  │                       │                   │        │         │           │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                                │
│  Showing 8 of 24 specialties                              [< Prev] [Next >]   │
│                                                                                │
│  [+ Add New Specialty]                                                        │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

## Service Offerings Tab Layout

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                                                                                │
│  SERVICE OFFERINGS                                                             │
│  ─────────────────────────────────────────────────────────────────────────     │
│                                                                                │
│  Service offerings are specific services that advisors can list on their      │
│  profiles. These appear in the "Services" section.                            │
│                                                                                │
│  Filter by Advisor Type: [All Types ▼]          Search: [__________] [Search] │
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                          │ │
│  │  SERVICE              │ ADVISOR TYPE(S)   │ USAGE  │ STATUS  │ ACTIONS   │ │
│  │ ──────────────────────┼───────────────────┼────────┼─────────┼───────────│ │
│  │                       │                   │        │         │           │ │
│  │  Financial Plan       │ Financial Adviser │  621   │ Active  │ [Edit]    │ │
│  │  Development          │                   │        │         │ [Disable] │ │
│  │ ──────────────────────┼───────────────────┼────────┼─────────┼───────────│ │
│  │                       │                   │        │         │           │ │
│  │  Investment Advice    │ Financial Adviser │  589   │ Active  │ [Edit]    │ │
│  │                       │                   │        │         │ [Disable] │ │
│  │ ──────────────────────┼───────────────────┼────────┼─────────┼───────────│ │
│  │                       │                   │        │         │           │ │
│  │  Home Loan            │ Mortgage Broker   │  398   │ Active  │ [Edit]    │ │
│  │  Comparison           │                   │        │         │ [Disable] │ │
│  │ ──────────────────────┼───────────────────┼────────┼─────────┼───────────│ │
│  │                       │                   │        │         │           │ │
│  │  Property Search      │ Buyer's Agent     │  276   │ Active  │ [Edit]    │ │
│  │                       │                   │        │         │ [Disable] │ │
│  │ ──────────────────────┼───────────────────┼────────┼─────────┼───────────│ │
│  │                       │                   │        │         │           │ │
│  │  Auction Bidding      │ Buyer's Agent     │  198   │ Active  │ [Edit]    │ │
│  │                       │                   │        │         │ [Disable] │ │
│  │ ──────────────────────┼───────────────────┼────────┼─────────┼───────────│ │
│  │                       │                   │        │         │           │ │
│  │  Portfolio Strategy   │ Property Adviser  │  145   │ Active  │ [Edit]    │ │
│  │                       │ Financial Adviser │        │         │ [Disable] │ │
│  │                       │                   │        │         │           │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                                │
│  [+ Add New Service Offering]                                                 │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

## Components

### Edit Advisor Type Modal

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                        [×] │
│  Edit Advisor Type: Financial Adviser                                      │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                            │
│  Display Name *                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ Financial Adviser                                                    │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  System ID (read-only)                                                     │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ financial_adviser                                                    │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  Description *                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ Licensed financial advisers providing personal financial advice     │ │
│  │ and wealth management services to individuals and businesses.       │ │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  Short Description (for filters)                                           │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ Financial planning & investment advice                               │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  Icon                                                                      │
│  [Current: chart-line]  [Change Icon...]                                  │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                            │
│  VERIFICATION REQUIREMENTS                                                 │
│                                                                            │
│  Primary Credential *                                                      │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ ASIC Financial Advisers Register (FAR)                           ▼  │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  Verification Method *                                                     │
│  [x] FAR Number lookup                                                    │
│  [x] AFSL verification                                                    │
│  [ ] State licence                                                        │
│  [ ] Industry membership                                                  │
│                                                                            │
│  Verification Links (displayed to admins during claim review)             │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ MoneySmart FAR | https://moneysmart.gov.au/financial-advice/...     │ │
│  │ [+ Add Link]                                                         │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                            │
│  DISPLAY SETTINGS                                                          │
│                                                                            │
│  Display Order: [1 ▼]                                                     │
│                                                                            │
│  [x] Show in main navigation                                              │
│  [x] Show in search filters                                               │
│  [x] Allow new registrations                                              │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                            │
│  Current Usage: 847 active listings                                        │
│                                                                            │
│                                      [Cancel]    [Save Changes]           │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Add Specialty Modal

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                        [×] │
│  Add New Specialty                                                         │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                            │
│  Specialty Name *                                                          │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ Estate Planning                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  System ID (auto-generated)                                                │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ estate_planning                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  Description                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ Advisers specialising in estate planning, wills, and                │ │
│  │ intergenerational wealth transfer strategies.                       │ │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  Applicable Advisor Types *                                                │
│  [x] Financial Adviser                                                    │
│  [ ] Mortgage Broker                                                      │
│  [ ] Buyer's Agent                                                        │
│  [ ] Property Adviser                                                     │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                            │
│  Display Settings                                                          │
│                                                                            │
│  [x] Show in search filters                                               │
│  [x] Allow advisors to select                                             │
│  [x] Active immediately                                                   │
│                                                                            │
│                                      [Cancel]    [Add Specialty]          │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Disable Confirmation Modal

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                        [×] │
│  Disable Specialty: SMSF Advice                                            │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                            │
│  ⚠ WARNING: This action affects existing listings                         │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                                                                      │ │
│  │  Current Usage: 312 listings have this specialty selected           │ │
│  │                                                                      │ │
│  │  What happens when disabled:                                         │ │
│  │  • Specialty will be hidden from search filters                     │ │
│  │  • New advisors cannot select this specialty                        │ │
│  │  • Existing listings will retain the specialty (grandfathered)     │ │
│  │  • Existing listings won't appear in filtered searches             │ │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  Reason for Disabling:                                                     │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ Consolidating into "Superannuation Advice" specialty               │ │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  [ ] Notify affected advisors (312 advisors)                              │
│  [ ] Suggest alternative specialty: [Superannuation Advice ▼]            │
│                                                                            │
│                                      [Cancel]    [Disable Specialty]      │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

## Tablet Layout (768px)

```
┌────────────────────────────────────────────────────────┐
│  ADVYSER ADMIN              [≡]        [Admin User ▼]  │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Categories Management                                 │
│  ────────────────────────────────────────────────────  │
│                                                        │
│  ┌────────────────────────────────────────────────┐   │
│  │ Types │ Specialties │ Services │ Locations    │   │
│  │ ══════                                         │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
│  ADVISOR TYPES                                         │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Financial Adviser                                │ │
│  │ ID: financial_adviser                           │ │
│  │                                                  │ │
│  │ Licensed financial advisers providing personal  │ │
│  │ financial advice and wealth management          │ │
│  │                                                  │ │
│  │ Listings: 847        Status: ● Active          │ │
│  │                                                  │ │
│  │ Requires: ASIC FAR registration                 │ │
│  │                                                  │ │
│  │ [Edit]  [Disable]                               │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Mortgage Broker                                  │ │
│  │ ID: mortgage_broker                             │ │
│  │                                                  │ │
│  │ Credit representatives helping clients find     │ │
│  │ and secure home loans and refinancing          │ │
│  │                                                  │ │
│  │ Listings: 412        Status: ● Active          │ │
│  │                                                  │ │
│  │ Requires: ASIC Credit Register entry            │ │
│  │                                                  │ │
│  │ [Edit]  [Disable]                               │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  [+ Add New Advisor Type]                             │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Mobile Layout (375px)

```
┌─────────────────────────────────┐
│  ADVYSER      [≡]    [Admin ▼] │
├─────────────────────────────────┤
│                                 │
│  Categories Management          │
│  ──────────────────────────     │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Types │ Spec │ Serv │ Loc │ │
│  │ ══════                     │ │
│  └───────────────────────────┘ │
│                                 │
│  ADVISOR TYPES                  │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Financial Adviser         │ │
│  │ ● Active                  │ │
│  │                           │ │
│  │ 847 listings              │ │
│  │                           │ │
│  │ Licensed financial        │ │
│  │ advisers providing        │ │
│  │ personal financial        │ │
│  │ advice...                 │ │
│  │                           │ │
│  │ [Edit]  [Disable]         │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Mortgage Broker           │ │
│  │ ● Active                  │ │
│  │                           │ │
│  │ 412 listings              │ │
│  │                           │ │
│  │ Credit representatives    │ │
│  │ helping clients find...   │ │
│  │                           │ │
│  │ [Edit]  [Disable]         │ │
│  └───────────────────────────┘ │
│                                 │
│  [+ Add New Type]              │
│                                 │
└─────────────────────────────────┘
```

## Interactions

### Edit Category
1. Click [Edit] button
2. Modal opens with form
3. Make changes
4. Save changes
5. Changes applied immediately
6. Search index updated in background

### Add New Item
1. Click [+ Add New...] button
2. Modal opens with empty form
3. Fill required fields
4. Save new item
5. Item appears in list
6. Available to advisors immediately (if active)

### Disable Item
1. Click [Disable] button
2. Confirmation modal shows impact
3. Enter reason
4. Choose notification options
5. Confirm disable
6. Item marked as disabled
7. Hidden from new selections
8. Existing usage grandfathered

### Reorder Items
- Drag and drop to reorder (desktop)
- Affects display order in filters/dropdowns

## Data Requirements

### Advisor Type
```typescript
interface AdvisorType {
  id: string;
  displayName: string;
  description: string;
  shortDescription: string;
  icon: string;
  status: 'active' | 'disabled';
  displayOrder: number;
  listingCount: number;
  verificationRequirements: {
    primaryCredential: string;
    methods: string[];
    verificationLinks: { label: string; url: string }[];
  };
  displaySettings: {
    showInNav: boolean;
    showInFilters: boolean;
    allowNewRegistrations: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Specialty
```typescript
interface Specialty {
  id: string;
  name: string;
  description: string;
  advisorTypes: string[];
  status: 'active' | 'disabled';
  usageCount: number;
  displaySettings: {
    showInFilters: boolean;
    allowSelection: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Service Offering
```typescript
interface ServiceOffering {
  id: string;
  name: string;
  description: string;
  advisorTypes: string[];
  status: 'active' | 'disabled';
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Permissions

- **Access**: Only users with role='admin' can access
- **Edit**: All admins
- **Add New**: All admins
- **Disable**: May require senior admin for high-impact items
- **Delete**: Not allowed (only disable)
- **Audit Logging**: All changes logged

## Audit Log Events

- Category viewed
- Category edited (with diff)
- Category added
- Category disabled
- Category re-enabled
- Display order changed

## Error States

### Load Error
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│                       (error icon)                            │
│                                                               │
│            Unable to load categories                          │
│                                                               │
│        There was an error fetching category data.            │
│                   [Retry] [Contact Support]                   │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Save Error
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  ⚠ Failed to save changes                                    │
│                                                               │
│  Error: [Specific error message]                             │
│                                                               │
│  [Retry]  [Cancel]                                           │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Accessibility

- Tables have proper headers
- Form fields have labels
- Status indicators have text
- Modal focus management
- Keyboard navigation
- Screen reader announcements for changes
