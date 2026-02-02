/**
 * Advyser Design Reference — 3 Locked Websites
 * Locked: 2026-02-01
 * Updated: 2026-02-02 (migrated from #14B8A6 → #0A0A0A neutral palette)
 *
 * Mirror UI/UX patterns from these sites. Apply Advyser neutral gray palette.
 */

export const referenceWebsites = [
  {
    id: "wise",
    name: "Wise",
    url: "https://wise.com",
    designSystem: "https://wise.design",
    why: "Primary reference. Calculator-forward, transparency, trust signals, generous spacing, pill buttons",
  },
  {
    id: "chime",
    name: "Chime",
    url: "https://chime.com",
    designSystem: null,
    why: "Best layout/whitespace match (9/10). Clean accessible typography, friendly fintech personality",
  },
  {
    id: "n26",
    name: "N26",
    url: "https://n26.com",
    designSystem: null,
    why: "European fintech sophistication. Whitespace-forward, mobile-first, strong trust signals",
  },
] as const;

export const componentSources = {
  // Wise components
  calculator: { source: "wise", url: "https://wise.com" },
  hero: { source: "wise", url: "https://wise.com" },
  feeComparison: { source: "wise", url: "https://wise.com/pricing" },
  trustBadges: { source: "wise", url: "https://wise.com" },
  testimonials: { source: "wise", url: "https://wise.com" },
  pillButtons: { source: "wise", url: "https://wise.design/components/button" },

  // Chime components
  pageLayout: { source: "chime", url: "https://chime.com" },
  sectionSpacing: { source: "chime", url: "https://chime.com" },
  featureCards: { source: "chime", url: "https://chime.com/features" },
  mobileNav: { source: "chime", url: "https://chime.com" },

  // N26 components
  navbar: { source: "n26", url: "https://n26.com" },
  footer: { source: "n26", url: "https://n26.com" },
  pricing: { source: "n26", url: "https://n26.com/en-eu/plans" },
  faqAccordion: { source: "n26", url: "https://n26.com/en-eu/faq" },
  appDownloadCta: { source: "n26", url: "https://n26.com" },
} as const;

// Wise spacing scale
export const wiseSpacing = {
  4: "4px",
  8: "8px",
  12: "12px",
  16: "16px",
  24: "24px",
  32: "32px",
  48: "48px",
  64: "64px",
  96: "96px",
} as const;

// Wise border radius
export const wiseRadius = {
  small: "16px",
  medium: "20px",
  large: "30px",
  xLarge: "40px",
  pill: "9999px",
} as const;

export type ReferenceWebsite = (typeof referenceWebsites)[number];
export type ComponentSource = keyof typeof componentSources;
