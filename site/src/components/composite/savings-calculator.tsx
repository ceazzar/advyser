"use client"

import * as React from "react"
import { TrendingDown, Calculator, Info } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

export interface SavingsCalculatorProps {
  /** Minimum portfolio size in dollars */
  minPortfolio?: number
  /** Maximum portfolio size in dollars */
  maxPortfolio?: number
  /** Default portfolio size in dollars */
  defaultPortfolio?: number
  /** Minimum advisory fee percentage */
  minFee?: number
  /** Maximum advisory fee percentage */
  maxFee?: number
  /** Default advisory fee percentage */
  defaultFee?: number
  /** Target fee percentage (what good advice could achieve) */
  targetFee?: number
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
 * Formats a number as a percentage
 */
function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

/**
 * Hook for animated number transitions
 */
function useAnimatedNumber(value: number, duration: number = 300): number {
  const [displayValue, setDisplayValue] = React.useState(value)
  const previousValue = React.useRef(value)
  const animationRef = React.useRef<number | null>(null)

  React.useEffect(() => {
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
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [value, duration])

  return displayValue
}

/**
 * Slider input with label and value display
 */
interface SliderInputProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  formatValue: (value: number) => string
  onChange: (value: number) => void
  tooltip?: string
}

function SliderInput({
  label,
  value,
  min,
  max,
  step,
  formatValue,
  onChange,
  tooltip,
}: SliderInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground">{label}</label>
          {tooltip && (
            <div className="group relative">
              <Info className="size-4 text-muted-foreground cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover border border-border rounded-md shadow-md text-xs text-popover-foreground max-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                {tooltip}
              </div>
            </div>
          )}
        </div>
        <span className="text-sm font-semibold text-primary tabular-nums">
          {formatValue(value)}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([newValue]) => onChange(newValue)}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  )
}

/**
 * Savings result display with animated value
 */
interface SavingsResultProps {
  annualSavings: number
  currentFees: number
  projectedFees: number
  feeDifference: number
}

function SavingsResult({
  annualSavings,
  currentFees,
  projectedFees,
  feeDifference,
}: SavingsResultProps) {
  const animatedSavings = useAnimatedNumber(annualSavings)
  const animatedCurrentFees = useAnimatedNumber(currentFees)
  const animatedProjectedFees = useAnimatedNumber(projectedFees)

  return (
    <div className="space-y-4">
      {/* Primary savings highlight */}
      <div className="p-6 bg-primary/5 border border-primary/20 rounded-md text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingDown className="size-5 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">
            Potential Annual Savings
          </span>
        </div>
        <div className="text-4xl font-bold text-primary tabular-nums">
          {formatCurrency(animatedSavings)}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          By reducing your advisory fees by {formatPercentage(feeDifference)}
        </p>
      </div>

      {/* Fee comparison breakdown */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-muted/50 rounded-md">
          <span className="text-xs text-muted-foreground block mb-1">
            Current Annual Fees
          </span>
          <span className="text-lg font-semibold text-foreground tabular-nums">
            {formatCurrency(animatedCurrentFees)}
          </span>
        </div>
        <div className="p-4 bg-muted/50 rounded-md">
          <span className="text-xs text-muted-foreground block mb-1">
            With Better Advice
          </span>
          <span className="text-lg font-semibold text-foreground tabular-nums">
            {formatCurrency(animatedProjectedFees)}
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * Interactive calculator showing potential annual savings from good financial advice.
 * Features slider inputs for portfolio size and current advisory fees,
 * with animated number transitions and mobile-responsive design.
 */
function SavingsCalculator({
  minPortfolio = 50000,
  maxPortfolio = 2000000,
  defaultPortfolio = 500000,
  minFee = 0.5,
  maxFee = 2.5,
  defaultFee = 1.5,
  targetFee = 0.75,
  className,
}: SavingsCalculatorProps) {
  const [portfolioSize, setPortfolioSize] = React.useState(defaultPortfolio)
  const [currentFee, setCurrentFee] = React.useState(defaultFee)

  // Calculate savings based on fee reduction
  const currentFees = (portfolioSize * currentFee) / 100
  const projectedFees = (portfolioSize * targetFee) / 100
  const annualSavings = Math.max(0, currentFees - projectedFees)
  const feeDifference = Math.max(0, currentFee - targetFee)

  return (
    <Card className={cn("w-full max-w-lg", className)}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
            <Calculator className="size-5" />
          </div>
          <div>
            <CardTitle className="text-xl">See how much you could save</CardTitle>
            <CardDescription>
              Calculate your potential savings with the right financial advice
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Portfolio Size Slider */}
        <SliderInput
          label="Your portfolio size"
          value={portfolioSize}
          min={minPortfolio}
          max={maxPortfolio}
          step={10000}
          formatValue={formatCurrency}
          onChange={setPortfolioSize}
          tooltip="Include investments, super, and managed funds"
        />

        {/* Advisory Fee Slider */}
        <SliderInput
          label="Current advisory fees"
          value={currentFee}
          min={minFee}
          max={maxFee}
          step={0.1}
          formatValue={formatPercentage}
          onChange={setCurrentFee}
          tooltip="The percentage you currently pay your advisor annually"
        />

        {/* Results Display */}
        <SavingsResult
          annualSavings={annualSavings}
          currentFees={currentFees}
          projectedFees={projectedFees}
          feeDifference={feeDifference}
        />

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          Calculations assume a target fee of {formatPercentage(targetFee)} p.a.
          Actual savings will vary based on individual circumstances and advisor selection.
          This is for illustrative purposes only and does not constitute financial advice.
        </p>
      </CardContent>
    </Card>
  )
}

export { SavingsCalculator }
