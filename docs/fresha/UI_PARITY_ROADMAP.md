# Advyser UI Parity Roadmap (Fresha-Level UX)

Context mapped against:
- `/Users/ceazar/Code Base/advyser/site/src/app/page.tsx`
- `/Users/ceazar/Code Base/advyser/site/src/components/layout/public-header.tsx`
- `/Users/ceazar/Code Base/advyser/site/src/components/composite/hero-search-bar.tsx`
- `/Users/ceazar/Code Base/advyser/site/src/components/layout/public-footer.tsx`
- `/Users/ceazar/Code Base/advyser/site/src/app/globals.css`

## 1) UI parity scorecard (0-5) by area

| Area | Score | Notes |
|---|---:|---|
| Nav | 3.2 | Sticky + auth states are solid, but utility hierarchy and sticky progression are below Fresha sophistication. |
| Hero | 2.1 | Conversion copy is clear, but lacks atmospheric visual framing and metric/app hooks. |
| Search UX | 2.6 | Segmented search exists; missing time segment and dynamic predictive search behavior. |
| Cards/rails | 2.0 | Good cards, no true marketplace rails/carousels with progressive density and controls. |
| Social proof | 2.8 | Testimonials and trust strip exist but not stacked into a conversion-first trust system. |
| App promo | 0.5 | No dedicated app acquisition block on home. |
| Metrics | 1.8 | Static counts only; no hero-adjacent real-time vitality metrics. |
| City SEO module | 0.0 | No crawlable city/category SEO module on homepage. |
| Footer | 2.7 | Link depth is good, but lacks app badges and city/category internal-link strategy. |
| Responsiveness | 3.4 | Basic responsive behavior is good; lacks device-specific interaction choreography. |
| Accessibility | 2.4 | Partial ARIA and focus support; combobox semantics and reduced-motion strategy are incomplete. |
| Motion | 2.3 | Isolated animations exist without a system-level motion token strategy. |
| Visual polish | 2.5 | Clean, but not yet at Fresha’s layered, image-led, high-confidence marketplace polish. |

## 2) Detailed gap matrix

| Area | Current behavior (with file references) | Target Fresha-like behavior | Impact on conversion/trust | Effort |
|---|---|---|---|---|
| Header IA and hierarchy | Single-row sticky header with nav + auth + CTA in `/Users/ceazar/Code Base/advyser/site/src/components/layout/public-header.tsx:51` and `/Users/ceazar/Code Base/advyser/site/src/components/layout/public-header.tsx:87` | Two-tier IA: discovery nav + utility/account tools + progressive sticky compression state. | Improves first-click orientation and CTA clarity. | M |
| Hero visual architecture | White hero shell in `/Users/ceazar/Code Base/advyser/site/src/app/page.tsx:210` | Add brand-safe gradient atmosphere and hero depth layer without changing Advyser identity. | Increases immediate trust and perceived product quality. | M |
| Search IA (hero) | 3-segment model in `/Users/ceazar/Code Base/advyser/site/src/components/composite/hero-search-bar.tsx:333` and `/Users/ceazar/Code Base/advyser/site/src/components/composite/hero-search-bar.tsx:440` | 4-segment conversion model: service/category, location, time, search CTA. | Improves query precision and qualified traffic flow to search results. | L |
| Search suggestions | Static recent/trending with empty-query behavior in `/Users/ceazar/Code Base/advyser/site/src/components/composite/hero-search-bar.tsx:442` and `/Users/ceazar/Code Base/advyser/site/src/components/composite/hero-search-bar.tsx:519` | Dynamic suggestions (services, advisors, cities), ranked and highlighted, visible during typing. | Reduces abandonment and dead-end queries. | L |
| Discovery rails | Static category grid in `/Users/ceazar/Code Base/advyser/site/src/app/page.tsx:295` | Add image-led horizontal rails with chevrons, drag support, and snap points. | Higher listing CTR and deeper browsing. | L |
| Search map mode | Placeholder map view in `/Users/ceazar/Code Base/advyser/site/src/app/search/page.tsx:996` | Real split-view map/list with synchronized marker-card interactions. | Improves location confidence and local conversion. | L |
| Social proof stack | Testimonials and trust strip in `/Users/ceazar/Code Base/advyser/site/src/app/page.tsx:376` and `/Users/ceazar/Code Base/advyser/site/src/components/composite/trust-strip.tsx:78` | Layered trust: aggregate rating, verification depth, outcomes, and recency signals. | De-risks advisor selection and strengthens trust. | M |
| App promo block | No app install module in `/Users/ceazar/Code Base/advyser/site/src/app/page.tsx` | Add app strip with App Store/Google Play badges and mobile value proposition. | Increases retention and multi-session booking behavior. | S |
| Metrics module | Static counts in `/Users/ceazar/Code Base/advyser/site/src/components/composite/trust-strip.tsx:96` | Hero-adjacent vitality metrics (bookings today, average response speed). | Raises marketplace “alive” perception and urgency. | S |
| City SEO module | Missing on homepage in `/Users/ceazar/Code Base/advyser/site/src/app/page.tsx` | Add crawlable city/specialty link matrix and structured internal linking. | Drives SEO acquisition and local-intent discovery. | M |
| Footer depth | Footer sections in `/Users/ceazar/Code Base/advyser/site/src/components/layout/public-footer.tsx:68` | Add app badges, city clusters, specialty clusters, and condensed legal trust row. | Improves bottom-funnel continuation and crawl depth. | M |
| Design tokens | Sparse type/motion tokens in `/Users/ceazar/Code Base/advyser/site/src/app/globals.css:133` and `/Users/ceazar/Code Base/advyser/site/src/app/globals.css:139` | Expand into full conversion-grade type/spacing/radius/shadow/motion system. | Consistency and faster implementation velocity. | M |
| Accessibility systems | Partial combobox semantics in `/Users/ceazar/Code Base/advyser/site/src/components/composite/hero-search-bar.tsx:372`; no global reduced-motion strategy in `/Users/ceazar/Code Base/advyser/site/src/app/globals.css:209` | Full combobox semantics and global reduced-motion rules by token. | Better usability and trust for assistive-tech users. | M |
| Motion coherence | Local transitions in `/Users/ceazar/Code Base/advyser/site/src/components/composite/hero-search-bar.tsx:559` and `/Users/ceazar/Code Base/advyser/site/src/app/search/page.tsx:1007` | Tokenized motion patterns across hover, sticky, rail, and loading states. | Higher perceived quality and interaction clarity. | S |

## 3) Design system delta

| System area | Current | Delta required |
|---|---|---|
| Typography scale | Minimal display/body tokens | Add full type ramp: `display-2xl`, `display-xl`, `display-lg`, `h1`, `h2`, `h3`, `body-lg`, `body-md`, `body-sm`, `caption` with line-height/letter-spacing tokens. |
| Spacing scale | Utility-driven, non-semantic | Add semantic spacing tokens: `space-1` to `space-24` and section-level spacing rules (`hero`, `content`, `footer`). |
| Radius/shadow | Radius and shadow tokens exist but generic | Define role-specific tokens: `radius-pill`, `radius-card`, `radius-panel`; elevation tiers with hover deltas (`e1-e4`). |
| Color tokens | Neutral base; limited conversion accents | Keep Advyser brand model; add conversion tokens: `surface-gradient-start/end`, `cta-primary`, `cta-hover`, `trust-success`, `focus-strong`, `chip-active`. |
| Icon sizing | Per-component manual sizing | Standardize icon tokens: `icon-xs`, `icon-sm`, `icon-md`, `icon-lg`; define line-vs-filled optical correction rule. |
| Motion tokens | No motion token taxonomy | Add `duration-fast/base/slow`, easing tokens (`standard`, `decelerate`, `emphasized`), and sticky spring token. |
| Component density rules | Mixed control heights | Define density presets (`compact`, `default`, `comfortable`) and map controls per viewport. |

## 4) Component roadmap

| Component | Purpose | States | Interactions | Breakpoints | Loading/empty/error | Accessibility requirements | Analytics events |
|---|---|---|---|---|---|---|---|
| `PublicHeader` | Navigation and high-intent CTA | default, scrolled, menu-open, authenticated | sticky compression, menu toggle, active states | mobile sheet, tablet hybrid, desktop full nav | auth-unknown fallback links | nav landmark, sheet focus trap, visible focus ring, skip target | `c1_nav_viewed`, `c1_menu_toggled`, `c1_nav_link_clicked` |
| `HomeHero` | Primary message and search activation | default, personalized, returning-user | search CTA, quick links, app CTA | stacked mobile, segmented desktop | skeleton for metrics and suggestions | heading hierarchy, contrast AA, semantic CTA labels | `c1_discovery_viewed`, `c1_hero_cta_clicked` |
| `HeroSearchBar` | Core query capture and routing | idle, focused, suggestions-open, loading, no-results, error | keyboard navigation, suggestion select, clear, submit | stacked mobile, segmented desktop | suggestion skeleton, no-results guidance, retry row | complete combobox semantics, escape/tab behavior, SR labels | `c1_search_started`, `c1_search_suggestion_selected`, `c1_search_submitted` |
| `DiscoveryRail` (new) | Browse recommendations quickly | loading, loaded, empty, error | drag/swipe, arrows, snap | 1-up mobile to 4-up desktop | skeleton cards, empty CTA, retry | arrow labels, keyboard navigation, focus-visible | `c1_rail_viewed`, `c1_rail_scrolled`, `c1_listing_opened` |
| `AdvisorCard` | Trust-rich listing unit | default, hover, favorited, verified/unverified | favorite toggle, profile CTA | compact mobile, enriched desktop | image fallback, content skeleton | article semantics, rating labels, 44px target size | `c1_card_impression`, `c1_card_favorite_toggled`, `c1_listing_opened` |
| `SocialProofSection` | Reduce booking uncertainty | aggregate-proof, testimonial, badge-only | card/slider navigation | 1-column mobile to 3-column desktop | testimonial skeleton, empty proof fallback | region labels, pause on interaction | `c1_socialproof_viewed`, `c1_reviews_opened` |
| `MetricsStrip` | Marketplace vitality proof | loading, live, stale | number reveal, details tooltip | ticker mobile, expanded desktop | metric skeleton, stale-data tag | controlled live-region announcements | `c1_metrics_viewed` |
| `AppPromoStrip` (new) | Drive app installs and retention | default, iOS-priority, Android-priority | badge clicks, QR reveal | inline mobile, side-by-side desktop | hidden block fallback if links unavailable | descriptive labels for store badges | `c1_app_promo_viewed`, `c1_app_store_clicked` |
| `CitySeoModule` (new) | SEO and internal linking | loading, loaded, empty | city tabs/accordions, link clicks | accordion mobile, grid desktop | city chip skeleton, empty fallback | heading structure and crawlable links | `c1_city_module_viewed`, `c1_city_link_clicked` |
| `PublicFooter` | Final navigation and trust/legal continuity | default, compact, legal-expanded | links and social interactions | collapsed mobile to multi-column desktop | fallback when link groups missing | footer landmark and heading hierarchy | `c1_footer_link_clicked`, `c1_footer_social_clicked` |

## 5) Micro-interaction roadmap

| Pattern | Spec |
|---|---|
| Hover/focus/press | Hover lift (`-2px`) + elevation shift; focus ring tokenized and consistent; press scale `0.98` on primary interactive surfaces. |
| Sticky transitions | Header transitions at 24px scroll threshold with deterministic height and shadow changes. |
| Search suggestions | Debounce at ~120ms, wrap keyboard navigation, highlighted matching text, enter-to-select active item. |
| Carousel controls | Controls appear on hover/focus-within; disabled controls de-emphasized with no layout shift. |
| Skeleton loading | Use structured skeletons (cards, chips, metric lines) instead of generic blocks. |
| Reduced motion | Disable transform-heavy transitions and autoplay movement; keep minimal opacity transitions only. |

## 6) Responsive roadmap

Breakpoints:
- Mobile: `<768`
- Tablet: `768-1023`
- Laptop: `1024-1279`
- Desktop: `>=1280`

| Surface | Mobile | Tablet | Laptop | Desktop |
|---|---|---|---|---|
| Header | logo + menu + CTA | utility-lite + menu | full nav + CTA | full nav + utility + contextual CTA |
| Hero/search | stacked 4-row search | 2x2 segmented layout | horizontal segmented | full segmented + metrics + app CTA |
| Rails | touch-first swipe | 2 cards/view | 3 cards/view | 4 cards/view |
| Search results | filter sheet + list default | list/map toggle | sticky sidebar + list/map | split map/list with synchronized interactions |
| Social proof | single column + swipe | 2 columns | 3 columns | 3 columns + aggregate panel |
| City SEO | accordion | 2-column matrix | 3-column matrix | 4-column matrix + expanded link depth |
| Footer | grouped collapsible | 3 columns | 5 columns | 6 columns + app/store + city links |

## 7) Execution plan

### Phase 1: Conversion-critical shell (Header, Hero, Search)
- Dependencies:
  - Token baseline update in `/Users/ceazar/Code Base/advyser/site/src/app/globals.css`
  - Event contract alignment with `/Users/ceazar/Code Base/advyser/docs/fresha/INSTRUMENTATION.md`
- Sequencing:
  - Design tokens -> Header variants -> Hero composition -> Search IA/states/a11y.
- Risks:
  - Suggestion data source readiness.
  - Scope creep around auth-specific nav variants.
- Acceptance criteria:
  - Nav/Hero/Search parity average >= 3.8.
  - Complete state coverage documented for search and header.

### Phase 2: Discovery and trust depth (Rails, Social proof, Metrics, App promo, City SEO)
- Dependencies:
  - Card data contracts and city taxonomy.
- Sequencing:
  - Discovery rails -> Social proof -> Metrics -> App promo -> City SEO module.
- Risks:
  - Placeholder data lowering trust if left in production.
- Acceptance criteria:
  - Cards/Rails/Social proof/App promo/City SEO parity average >= 4.0.
  - All modules have loading/empty/error specs and analytics hooks.

### Phase 3: System polish and hardening (Footer, Motion, A11y, QA)
- Dependencies:
  - Locked breakpoint and component API decisions.
- Sequencing:
  - Footer IA -> Motion token rollout -> Accessibility hardening -> Performance pass.
- Risks:
  - Motion/performance regressions on low-end mobile devices.
- Acceptance criteria:
  - No critical accessibility defects.
  - Responsiveness/Accessibility/Motion/Visual polish parity average >= 4.0.

### 2-week sprint breakdown

| Day | Deliverables |
|---|---|
| Day 1 | Final parity baseline, KPI definitions, component inventory. |
| Day 2 | Token delta spec for typography/spacing/color/radius/shadow/motion. |
| Day 3 | Header + hero UX specs and state diagrams. |
| Day 4 | Search behavior spec (suggestions, keyboard, errors, reduced-motion). |
| Day 5 | Engineering tickets for Phase 1 with acceptance criteria. |
| Day 6 | Discovery rail and advisor card enhancement specs. |
| Day 7 | Social proof and metric system specs. |
| Day 8 | App promo and city SEO module specs + link architecture. |
| Day 9 | Footer IA refactor spec + responsive behavior matrix. |
| Day 10 | QA protocol, parity score re-evaluation, sign-off package. |

## 8) QA checklist

### Visual QA
- Token consistency for spacing, typography, radius, and shadows.
- Gradient/background quality and no visual banding on key surfaces.
- Card/rail polish and image cropping consistency.

### Interaction QA
- Hover/focus/press states validated across mouse, touch, keyboard.
- Sticky header and rail controls behave deterministically.
- Search suggestion keyboard path validated end-to-end.

### Accessibility QA
- Automated scan + manual keyboard pass across home/search/footer.
- Combobox semantics and screen-reader announcements verified.
- Reduced-motion behavior confirmed under `prefers-reduced-motion`.
- Contrast ratios meet AA on all critical surfaces.

### Performance QA
- Mobile performance budgets: LCP <= 2.5s, CLS <= 0.1, INP <= 200ms.
- Skeleton/loading strategy prevents layout shifts.
- No sustained frame drops on interaction-heavy surfaces.

## 9) Definition of done for UI parity

### Measurable criteria
- Parity score >= 4.0 for:
  - Nav, Hero, Search UX, Cards/Rails, Social proof, Footer, Responsiveness, Accessibility, Motion, Visual polish.
- App promo module and city SEO module are both live and tracked.
- Search interaction supports complete keyboard and screen-reader workflow.
- Analytics event schema compliance >= 98% for required conversion events.
- No critical accessibility violations in release candidate.
- Performance budgets met on mobile and desktop.

### Sign-off checklist
- [ ] Product design sign-off for conversion-critical journeys.
- [ ] Frontend tech lead sign-off for component APIs and state completeness.
- [ ] Accessibility sign-off (automated + manual).
- [ ] QA sign-off (visual, interaction, responsive).
- [ ] Analytics sign-off (event payload validation and dashboard checks).
- [ ] SEO sign-off (city/category internal-link module and crawlability).
