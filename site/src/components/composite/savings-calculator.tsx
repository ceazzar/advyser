"use client"

import * as React from "react"
import { TrendingUp, Calculator, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Icon Optical Sizing:
 * - Calculator in header circle: size-5 (20px) - contained in 40px circle
 * - TrendingUp inline with text: size-[18px] for optical parity
 * - Sparkles decorative: size-5 (20px)
 */
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

export interface SavingsCalculatorProps {
  /** Minimum portfolio/income amount in dollars */
  minAmount?: number
  /** Maximum portfolio/income amount in dollars */
  maxAmount?: number
  /** Default portfolio/income amount in dollars */
  defaultAmount?: number
  /** Savings rate lower bound (percentage of portfolio that good advice saves) */
  savingsRateLow?: number
  /** Savings rate upper bound (percentage of portfolio that good advice saves) */
  savingsRateHigh?: number
  /** Call-to-action text */
  ctaText?: string
  /** CTA click handler */
  onCTAClick?: () => void
  /** Additional CSS classes */
  className?: string
}

/**
 * Formats a number as Australian currency
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Formats a number with K/M suffix for compact display
 */
function formatCompact(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `$${Math.round(amount / 1000)}K`
  }
  return formatCurrency(amount)
}

/**
 * Hook for animated number transitions
 */
function useAnimatedNumber(value: number, duration: number = 300): number {
  const [displayValue, setDisplayValue] = React.useState(value)
  const previousValue = React.useRef(value)
  const animationRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    // Cancel any existing animation BEFORE starting a new one
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    const startValue = previousValue.current
    const endValue = value
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValue + (endValue - startValue) * easeOut

      setDisplayValue(Math.round(currentValue))

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        previousValue.current = endValue
        animationRef.current = null
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [value, duration])

  return displayValue
}

/**
 * Hook for debounced value (used for ARIA announcements)
 */
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Wise-style interactive savings calculator showing potential annual savings
 * from quality financial advice. Features a slider for portfolio/income amount
 * with animated savings range display ($7K-$14K based on portfolio size).
 */
function SavingsCalculator({
  minAmount = 100000,
  maxAmount = 2000000,
  defaultAmount = 500000,
  savingsRateLow = 0.014, // 1.4% savings from good advice
  savingsRateHigh = 0.028, // 2.8% savings from good advice
  ctaText = "Find an Advisor",
  onCTAClick,
  className,
}: SavingsCalculatorProps) {
  const [portfolioAmount, setPortfolioAmount] = React.useState(defaultAmount)

  // Calculate savings range based on portfolio
  const savingsLow = Math.round(portfolioAmount * savingsRateLow)
  const savingsHigh = Math.round(portfolioAmount * savingsRateHigh)

  // Animated values for smooth transitions
  const animatedSavingsLow = useAnimatedNumber(savingsLow)
  const animatedSavingsHigh = useAnimatedNumber(savingsHigh)

  // Debounced values for ARIA announcements (prevents spam during slider drag)
  const debouncedSavingsLow = useDebouncedValue(savingsLow, 500)
  const debouncedSavingsHigh = useDebouncedValue(savingsHigh, 500)

  // Calculate slider position percentage for gradient
  const sliderPosition = ((portfolioAmount - minAmount) / (maxAmount - minAmount)) * 100

  return (
    <Card className={cn("w-full max-w-xl overflow-hidden", className)}>
      <CardContent className="p-0">
        {/* Header Section */}
        <div className="p-6 pb-4 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center size-10 rounded-full bg-primary/15 text-primary">
              <Calculator className="size-5" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              See your potential savings
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Quality financial advice can save you thousands each year through
            better investment strategies, tax efficiency, and fee optimization.
          </p>
        </div>

        {/* Calculator Section */}
        <div className="p-6 space-y-6">
          {/* Portfolio Input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Your portfolio value
              </label>
              <span className="text-lg font-bold text-primary tabular-nums">
                {formatCurrency(portfolioAmount)}
              </span>
            </div>

            <Slider
              value={[portfolioAmount]}
              min={minAmount}
              max={maxAmount}
              step={25000}
              onValueChange={([value]) => setPortfolioAmount(value)}
              className="w-full"
              aria-label="Portfolio value"
            />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatCompact(minAmount)}</span>
              <span>{formatCompact(maxAmount)}</span>
            </div>
          </div>

          {/* Savings Result - Highlighted */}
          <div
            className="relative p-6 rounded-md overflow-hidden"
            style={{
              background: `linear-gradient(135deg,
                hsl(var(--primary) / 0.08) 0%,
                hsl(var(--primary) / 0.15) 100%)`
            }}
          >
            {/* Decorative sparkle */}
            <Sparkles className="absolute top-4 right-4 size-5 text-primary/30" />

            <div className="relative">
              {/* TrendingUp stroke icon uses 18px for optical parity */}
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="size-[18px] text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  Potential annual savings
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-bold text-primary tabular-nums">
                  {formatCurrency(animatedSavingsLow)}
                </span>
                <span className="text-xl sm:text-2xl font-medium text-muted-foreground mx-1">
                  to
                </span>
                <span className="text-3xl sm:text-4xl font-bold text-primary tabular-nums">
                  {formatCurrency(animatedSavingsHigh)}
                </span>
              </div>

              <p className="mt-3 text-sm text-muted-foreground">
                Based on a {formatCurrency(portfolioAmount)} portfolio, quality advice
                could save you <span className="font-medium text-foreground">
                {formatCurrency(savingsLow)}-{formatCurrency(savingsHigh)}
                </span> annually.
              </p>
            </div>
          </div>

          {/* CTA Button - Secondary to avoid competing with Hero/How It Works primary CTAs */}
          {onCTAClick && (
            <Button
              onClick={onCTAClick}
              variant="outline"
              className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              size="lg"
            >
              {ctaText}
            </Button>
          )}

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="size-1.5 rounded-full bg-green-500" />
              <span>Free to use</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="size-1.5 rounded-full bg-green-500" />
              <span>No obligation</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="size-1.5 rounded-full bg-green-500" />
              <span>ASIC licensed</span>
            </div>
          </div>
        </div>

        {/* Visually hidden ARIA live region for screen reader announcements */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          Potential annual savings: {formatCurrency(debouncedSavingsLow)} to {formatCurrency(debouncedSavingsHigh)}
        </div>

        {/* Disclaimer */}
        <div className="px-6 py-4 bg-muted/30 border-t border-border">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            Savings estimates are illustrative only, based on industry research showing
            quality advice can add 1.4%-2.8% p.a. in value. Individual results vary.
            This does not constitute financial advice.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export { SavingsCalculator }
