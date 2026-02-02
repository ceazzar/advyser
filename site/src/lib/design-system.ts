/**
 * Advyser Design System
 * Locked: 2026-02-01
 *
 * DO NOT MODIFY without team approval.
 */

export const designSystem = {
  // Primary Color: Teal
  colors: {
    primary: {
      50: "#F0FDFA",
      100: "#CCFBF1",
      200: "#99F6E4",
      300: "#5EEAD4",
      400: "#2DD4BF",
      500: "#14B8A6", // Main primary
      600: "#0D9488",
      700: "#0F766E",
      800: "#115E59",
      900: "#134E4A",
      950: "#042F2E",
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
        bg: "bg-teal-500",
        hoverBg: "hover:bg-teal-600",
        text: "text-white",
        border: "",
        radius: "rounded-md",
      },
      secondary: {
        bg: "bg-teal-100",
        hoverBg: "hover:bg-teal-200",
        text: "text-teal-700",
        border: "",
        radius: "rounded-md",
      },
      outline: {
        bg: "bg-transparent",
        hoverBg: "hover:bg-teal-50",
        text: "text-teal-600",
        border: "border-2 border-teal-600",
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
      focusBorder: "focus:border-teal-500",
      focusRing: "focus:ring-2 focus:ring-teal-500/20",
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
 * designSystem.colors.primary[500] // "#14B8A6"
 * designSystem.spacing.md // "24px"
 */
