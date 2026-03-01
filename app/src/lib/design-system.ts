/**
 * Advyser Design System - Neutral Palette
 * Updated: 2026-02-02
 *
 * Primary = Gray (neutral, not branded)
 * Verification badges = Success (green) - semantic choice
 * Accent reserved for future brand color
 *
 * DO NOT MODIFY without team approval.
 */

export const designSystem = {
  // Primary Color: Neutral Gray
  colors: {
    primary: {
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#E5E5E5",
      300: "#D4D4D4",
      400: "#A3A3A3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717", // Headings/hover
      950: "#0A0A0A", // Main primary (buttons)
    },
    // Neutral Scale: Gray
    neutral: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827",
      950: "#030712",
    },
    // Semantic colors
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  },

  // Font Family: DM Sans
  fontFamily: {
    sans: "var(--font-dm-sans), system-ui, sans-serif",
    mono: "ui-monospace, SFMono-Regular, monospace",
  },

  // Border Radius: Small (6px)
  borderRadius: {
    none: "0px",
    sm: "4px",
    base: "6px",    // Default
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },

  // Shadow Style: MD
  shadow: {
    none: "none",
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    base: "0 1px 3px rgba(0,0,0,0.1)",
    md: "0 4px 6px rgba(0,0,0,0.1)",  // Default
    lg: "0 10px 15px rgba(0,0,0,0.1)",
    xl: "0 20px 25px rgba(0,0,0,0.1)",
  },

  // Spacing Scale: Relaxed
  spacing: {
    xs: "8px",
    sm: "16px",
    md: "24px",
    lg: "32px",
    xl: "48px",
    "2xl": "64px",
  },

  // Component Defaults
  components: {
    // Button Style: Solid
    button: {
      primary: {
        bg: "bg-gray-950",
        hoverBg: "hover:bg-gray-800",
        text: "text-white",
        border: "",
        radius: "rounded-md",
      },
      secondary: {
        bg: "bg-gray-100",
        hoverBg: "hover:bg-gray-200",
        text: "text-gray-900",
        border: "",
        radius: "rounded-md",
      },
      outline: {
        bg: "bg-transparent",
        hoverBg: "hover:bg-gray-50",
        text: "text-gray-900",
        border: "border-2 border-gray-900",
        radius: "rounded-md",
      },
      ghost: {
        bg: "bg-transparent",
        hoverBg: "hover:bg-gray-100",
        text: "text-gray-700",
        border: "",
        radius: "rounded-md",
      },
    },
    // Input Style: Filled
    input: {
      bg: "bg-gray-100",
      border: "border border-transparent",
      focusBorder: "focus:border-gray-900",
      focusRing: "focus:ring-2 focus:ring-gray-900/40",
      radius: "rounded-md",
      text: "text-gray-900",
      placeholder: "placeholder:text-gray-400",
    },
    // Card Style: Shadow MD
    card: {
      bg: "bg-white",
      border: "",
      shadow: "shadow-md",
      radius: "rounded-md",
    },
  },
} as const;

export type DesignSystem = typeof designSystem;

/**
 * Icon Optical Sizing Guide
 * -------------------------
 * Lucide icons have different visual weights. Stroke-only icons appear lighter
 * than filled icons at the same pixel size. To achieve optical balance:
 *
 * Baseline Sizes:
 * - size-4 (16px): Standard for filled icons and button icons
 * - size-[18px]: Stroke icons inline with text (optical parity with size-4 filled)
 * - size-3 (12px): Small badge/pill icons (context makes weight less critical)
 * - size-5 (20px): Emphasis icons, larger text contexts
 * - size-6 (24px): Category tiles, feature icons
 * - size-8 (32px): Decorative/hero icons
 *
 * Icon Categories (Lucide):
 * - FILLED: Star (when fill applied), CheckCircle2 (hybrid)
 * - STROKE: MapPin, Clock, DollarSign, Users, Activity, Calendar,
 *           ArrowRight, TrendingUp, PiggyBank, Shield, etc.
 *
 * The 18px size for inline stroke icons compensates for the ~2px visual weight
 * difference between stroke (1.5-2px stroke width) and filled icons.
 *
 * @example
 * // ✅ Correct - stroke icon with optical correction
 * <MapPin className="size-[18px]" />
 *
 * // ✅ Correct - filled icon at baseline
 * <Star className="size-4 fill-amber-400" />
 *
 * // ✅ Correct - small badge icon
 * <Activity className="size-3" />
 */
export const iconSizes = {
  /** Small badge/pill icons */
  xs: "size-3",        // 12px
  /** Standard filled icons, button icons */
  sm: "size-4",        // 16px
  /** Stroke icons inline with text (optical parity) */
  smOptical: "size-[18px]", // 18px - use for stroke icons next to text
  /** Emphasis icons, larger contexts */
  md: "size-5",        // 20px
  /** Category tiles, feature icons */
  lg: "size-6",        // 24px
  /** Decorative/hero icons */
  xl: "size-8",        // 32px
} as const;

/**
 * Usage: Import tokens for reference or programmatic access.
 * For UI components, use Shadcn variants directly:
 *
 * @example
 * // ✅ Preferred - Shadcn components with variants
 * <Button variant="default">Primary</Button>
 * <Button variant="secondary">Secondary</Button>
 * <Button variant="outline">Outline</Button>
 *
 * // ✅ Access tokens programmatically if needed
 * designSystem.colors.primary[950] // "#0A0A0A" (primary button)
 * designSystem.colors.primary[900] // "#171717" (headings)
 * designSystem.spacing.md // "24px"
 *
 * // ✅ Icon sizing for optical balance
 * iconSizes.smOptical // "size-[18px]" - use for stroke icons inline with text
 */
