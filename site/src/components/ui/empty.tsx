import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// =============================================================================
// Preset Illustrations
// =============================================================================
// Simple line art SVGs using currentColor for theme support
// Consistent sizing: 120x120, stroke-width: 1.5

type IllustrationPreset = "no-results" | "no-data" | "empty-inbox" | "empty-folder" | "empty-cart" | "error"

const illustrations: Record<IllustrationPreset, React.ReactNode> = {
  "no-results": (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted-foreground/50"
    >
      {/* Magnifying glass */}
      <circle cx="52" cy="52" r="24" />
      <line x1="70" y1="70" x2="88" y2="88" />
      {/* X inside glass */}
      <line x1="44" y1="44" x2="60" y2="60" />
      <line x1="60" y1="44" x2="44" y2="60" />
    </svg>
  ),
  "no-data": (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted-foreground/50"
    >
      {/* Chart bars */}
      <rect x="20" y="70" width="16" height="30" rx="2" />
      <rect x="44" y="50" width="16" height="50" rx="2" />
      <rect x="68" y="60" width="16" height="40" rx="2" />
      {/* Dashed line suggesting missing data */}
      <line x1="20" y1="35" x2="100" y2="35" strokeDasharray="4 4" />
      {/* Question mark */}
      <path d="M92 55 C92 45 100 42 100 50 C100 56 96 58 96 64" />
      <circle cx="96" cy="70" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  "empty-inbox": (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted-foreground/50"
    >
      {/* Inbox tray */}
      <path d="M24 50 L24 85 C24 89 27 92 31 92 L89 92 C93 92 96 89 96 85 L96 50" />
      <path d="M24 50 L36 50 L42 62 L78 62 L84 50 L96 50" />
      {/* Envelope floating above */}
      <rect x="45" y="28" width="30" height="20" rx="2" />
      <polyline points="45,30 60,42 75,30" />
    </svg>
  ),
  "empty-folder": (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted-foreground/50"
    >
      {/* Folder */}
      <path d="M20 40 L20 85 C20 89 23 92 27 92 L93 92 C97 92 100 89 100 85 L100 48 C100 44 97 41 93 41 L55 41 L48 32 L27 32 C23 32 20 35 20 39 Z" />
      {/* Dashed center indicating empty */}
      <line x1="45" y1="66" x2="75" y2="66" strokeDasharray="4 4" />
    </svg>
  ),
  "empty-cart": (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted-foreground/50"
    >
      {/* Shopping cart */}
      <path d="M25 30 L35 30 L45 70 L90 70 L100 40 L40 40" />
      <circle cx="52" cy="85" r="6" />
      <circle cx="82" cy="85" r="6" />
      {/* Sparkle indicating empty/fresh */}
      <line x1="70" y1="25" x2="70" y2="35" />
      <line x1="65" y1="30" x2="75" y2="30" />
    </svg>
  ),
  "error": (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted-foreground/50"
    >
      {/* Warning triangle */}
      <path d="M60 25 L95 85 L25 85 Z" />
      {/* Exclamation mark */}
      <line x1="60" y1="45" x2="60" y2="62" />
      <circle cx="60" cy="72" r="2" fill="currentColor" stroke="none" />
    </svg>
  ),
}

// =============================================================================
// EmptyIllustration Component
// =============================================================================

interface EmptyIllustrationProps extends React.ComponentProps<"div"> {
  /** Preset illustration key or custom React node */
  illustration?: IllustrationPreset | React.ReactNode
  /** Size of the illustration container */
  size?: "sm" | "md" | "lg"
  /** Whether to animate on load */
  animate?: boolean
}

const illustrationSizes = {
  sm: "w-20 h-20",
  md: "w-[120px] h-[120px]",
  lg: "w-40 h-40",
}

function EmptyIllustration({
  className,
  illustration,
  size = "md",
  animate = true,
  ...props
}: EmptyIllustrationProps) {
  // If no illustration provided, return null
  if (!illustration) return null

  // Determine content: preset or custom node
  const content =
    typeof illustration === "string" && illustration in illustrations
      ? illustrations[illustration as IllustrationPreset]
      : illustration

  return (
    <div
      data-slot="empty-illustration"
      className={cn(
        "flex shrink-0 items-center justify-center",
        illustrationSizes[size],
        animate && "animate-in fade-in duration-500",
        // Scale SVG to fit container
        "[&>svg]:w-full [&>svg]:h-full",
        className
      )}
      {...props}
    >
      {content}
    </div>
  )
}

// =============================================================================
// Empty Component
// =============================================================================

interface EmptyProps extends React.ComponentProps<"div"> {
  /** Optional preset illustration or custom React node */
  illustration?: IllustrationPreset | React.ReactNode
  /** Size of the illustration */
  illustrationSize?: "sm" | "md" | "lg"
  /** Whether to animate illustration on load */
  animateIllustration?: boolean
}

function Empty({
  className,
  illustration,
  illustrationSize = "md",
  animateIllustration = true,
  children,
  ...props
}: EmptyProps) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12",
        className
      )}
      {...props}
    >
      {illustration && (
        <EmptyIllustration
          illustration={illustration}
          size={illustrationSize}
          animate={animateIllustration}
        />
      )}
      {children}
    </div>
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        "flex max-w-sm flex-col items-center gap-2 text-center",
        className
      )}
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  "flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn("text-lg font-medium tracking-tight", className)}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        "text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance",
        className
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyIllustration,
  EmptyMedia,
  EmptyTitle,
}

export type { IllustrationPreset }
