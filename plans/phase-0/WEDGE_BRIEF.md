# Phase 0 Wedge Brief (MVPv1)

## Document Control
- Version: v1.0 (locked)
- Date: 2026-02-10
- Phase: 0 (Wedge Decision + Demand Proof)
- Duration: 14 days
- Primary goal: prove short-horizon demand before heavy build

## 1) Wedge Decision (Locked)

### Candidate wedges considered
1. Mortgage brokers (Melbourne): first-home buyer (FHB) + refinance.
2. Buyer's agents (Melbourne): first-home buyer purchase support.
3. Accountants (Melbourne): contractor tax + SMSF basics.

### Chosen wedge
- Mortgage brokers in Melbourne metro.
- Demand focus: FHB + refinance.
- Why chosen: fastest feedback loop, strongest short-horizon intent, and most direct lead-value signal in 14 days.

## 2) ICP and Anti-ICP

### ICP (in-scope user)
- Person actively looking for a mortgage broker in Melbourne metro.
- Intent is FHB borrowing support or refinance support.
- Willing to take a broker call this week.
- Provides usable contact details and preferred contact method/time.

### Anti-ICP (out of scope for Phase 0)
- User outside Melbourne metro postcode boundary.
- Intent outside FHB/refinance (for example, commercial lending only).
- User only browsing with no contact intent.
- User who declines contact consent.

## 3) Geography Boundary (Canonical for Phase 0)

### Rule
- A lead is `in_wedge_geo` only if postcode is in the canonical Phase 0 list below.
- All other postcodes are tagged `out_of_wedge`.
- This list is frozen for the 14-day test window.

### Melbourne metro postcodes (Phase 0 canonical list)
`3000, 3002, 3003, 3004, 3005, 3006, 3008, 3011, 3012, 3013, 3015, 3016, 3018, 3019, 3020, 3021, 3023, 3025, 3026, 3027, 3028, 3029, 3030, 3031, 3032, 3033, 3034, 3036, 3037, 3038, 3039, 3040, 3041, 3042, 3043, 3044, 3046, 3047, 3048, 3049, 3051, 3052, 3053, 3054, 3055, 3056, 3057, 3058, 3059, 3060, 3061, 3064, 3065, 3066, 3067, 3068, 3070, 3071, 3072, 3073, 3074, 3075, 3076, 3078, 3079, 3081, 3082, 3083, 3084, 3085, 3087, 3088, 3090, 3093, 3094, 3095, 3096, 3097, 3099, 3101, 3102, 3103, 3104, 3105, 3106, 3107, 3108, 3109, 3111, 3113, 3114, 3115, 3116, 3121, 3122, 3123, 3124, 3125, 3126, 3127, 3128, 3129, 3130, 3131, 3132, 3133, 3134, 3135, 3136, 3137, 3138, 3141, 3142, 3143, 3144, 3145, 3146, 3147, 3148, 3149, 3150, 3151, 3152, 3153, 3154, 3155, 3156, 3158, 3161, 3162, 3163, 3165, 3166, 3167, 3168, 3169, 3170, 3171, 3172, 3173, 3174, 3175, 3178, 3179, 3181, 3182, 3183, 3184, 3185, 3186, 3187, 3188, 3189, 3190, 3191, 3192, 3193, 3194, 3195, 3196, 3197, 3198, 3204, 3205, 3206, 3207`

## 4) Offer and Instant Value Moment

### Offer (locked)
- "Compare 3 Melbourne mortgage brokers fast."
- Primary CTA: "Request a call."

### Instant value moment (<= 5 minutes)
- User completes a short qualifier (3-5 questions).
- User sees a shortlist of 3 best-fit brokers.
- User submits lead with preferred contact method/time.

### Single conversion event
- `lead_submitted` is the Phase 0 conversion event.

## 5) Qualification Definitions

### Lead qualification (all required)
1. `intent_type` is `fhb` or `refinance`.
2. `postcode` is in the Phase 0 Melbourne canonical list.
3. Valid contact details supplied.
4. Preferred contact time and contact method supplied.
5. Contact consent supplied.

### Supply qualification (broker eligibility, all required)
1. Services Melbourne metro postcodes.
2. Accepting new clients.
3. Commits to response SLA <= 2 business hours.
4. Specializes in FHB and/or refinance.
5. Profile includes licensing/association details and commission disclosure.

### Enforcement rule
- Any broker that misses the SLA commitment is paused from shortlist rotation.

## 6) Channel Hypothesis (14-Day Demand Test)

### Primary channel strategy
- Direct outreach + community distribution (not SEO-first for this window).

### First 100 visitors target mix
1. Community distribution: 40 visitors.
2. Broker profile/link sharing: 30 visitors.
3. Optional paid/partner source: 30 visitors.

### Daily cadence
- Community: 3-5 high-intent posts/day with tracked links.
- Broker distribution: every onboarded broker shares their profile link.
- Optional paid/partner source activates only if cumulative traffic is under 35 visitors by Day 5.

## 7) MVP Exclusions (Phase 0 / MVPv1)
1. Payments or deposits.
2. Calendar integrations or live scheduling.
3. Client accounts/portal.
4. In-app messaging inbox.
5. Reviews and ratings.
6. Broker CRM pipeline.
7. Multi-staff team workflows.
8. Automated compliance workflows.

## 8) 14-Day Operating Plan

### Day 1-2
- Onboard first 10 brokers.
- Finalize lead form schema and tracking links.
- Publish first community posts and broker share kit.

### Day 3-5
- Reach 35+ total visitors.
- Onboard to at least 20 brokers.
- Run daily community posting cadence.

### Day 6-9
- Reach 60+ total visitors.
- Monitor first-response SLA.
- Pause low-response brokers from shortlist rotation.

### Day 10-12
- Reach 85+ total visitors.
- Activate optional paid/partner source only if behind traffic plan.

### Day 13-14
- Reach 100 total visitors.
- Close measurement period.
- Produce pass/fail decision against KPI gate.

## 9) Gate and Pass/Fail Logic

### Hard pass criteria
1. `qualified_leads >= 15` within 14 days.
2. Median broker first response <= 2 business hours.
3. Lead contact success rate >= 70%.

### Soft pass criteria
1. Search/list -> profile CTR >= 8%.
2. Profile -> lead conversion >= 4%.
3. Show-up rate >= 60% when calls are scheduled.

### Fail conditions
- Fewer than 10 qualified leads in 14 days.
- Material underperformance on response SLA or contact success rate.

## 10) Success Metric Statement
- Phase 0 is successful if the team can clearly answer:
  - Who converts first (ICP)?
  - What delivers day-1 value?
  - What 14-day KPI thresholds are achievable and repeatable?

