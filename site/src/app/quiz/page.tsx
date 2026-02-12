"use client"

/**
 * 3-Question Guided Quiz
 * Helps users who aren't sure what type of advisor they need
 *
 * Flow:
 * 1. What's your main financial goal?
 * 2. How soon do you need help?
 * 3. What's your situation?
 * 4. Results -> Recommended advisor type + CTA to /search
 *
 * Uses CSS transitions for compatibility (framer-motion blocked).
 */

import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  CreditCard,
  HelpCircle,
  Home,
  Landmark,
  Search,
  Shield,
  TrendingUp,
  User,
  Users,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect,useState } from "react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// Types
type GoalValue =
  | "investments"
  | "retirement"
  | "property"
  | "debt"
  | "insurance"
  | "other"
type UrgencyValue = "urgent" | "month" | "exploring" | "future"
type SituationValue = "individual" | "couple" | "business" | "smsf"

interface QuizAnswers {
  goal?: GoalValue
  urgency?: UrgencyValue
  situation?: SituationValue
}

// Advisor category mapping based on answers
type AdvisorCategory =
  | "financial-planner"
  | "mortgage-broker"
  | "accountant"
  | "insurance-advisor"
  | "wealth-manager"

interface CategoryInfo {
  name: string
  description: string
  searchParam: string
}

const ADVISOR_CATEGORIES: Record<AdvisorCategory, CategoryInfo> = {
  "financial-planner": {
    name: "Financial Planner",
    description:
      "A licensed financial planner can help you create a comprehensive plan for your financial future, including investments, super, and retirement.",
    searchParam: "financial-planner",
  },
  "mortgage-broker": {
    name: "Mortgage Broker",
    description:
      "A mortgage broker can help you navigate the property market, compare loans, and find the best deal for your situation.",
    searchParam: "mortgage-broker",
  },
  accountant: {
    name: "Accountant",
    description:
      "An accountant can help with tax planning, business structures, and financial record-keeping to maximise your financial position.",
    searchParam: "accountant",
  },
  "insurance-advisor": {
    name: "Insurance Advisor",
    description:
      "An insurance advisor can assess your protection needs and find the right cover for you and your family.",
    searchParam: "insurance-advisor",
  },
  "wealth-manager": {
    name: "Wealth Manager",
    description:
      "A wealth manager provides sophisticated investment strategies and portfolio management for growing and preserving your assets.",
    searchParam: "wealth-manager",
  },
}

// Determine recommended advisor category based on answers
function getRecommendedCategory(answers: QuizAnswers): AdvisorCategory {
  const { goal, situation } = answers

  // SMSF trustees typically need specialized financial planners
  if (situation === "smsf") {
    return "financial-planner"
  }

  // Business owners often need accountants
  if (situation === "business") {
    if (goal === "property") return "mortgage-broker"
    if (goal === "insurance") return "insurance-advisor"
    return "accountant"
  }

  // Goal-based recommendations
  switch (goal) {
    case "investments":
      return "wealth-manager"
    case "retirement":
      return "financial-planner"
    case "property":
      return "mortgage-broker"
    case "debt":
      return "mortgage-broker" // Debt consolidation, refinancing
    case "insurance":
      return "insurance-advisor"
    case "other":
    default:
      return "financial-planner" // Default to comprehensive advice
  }
}

// Quiz step configuration
const QUIZ_STEPS = [
  {
    id: "goal" as const,
    question: "What's your main financial goal?",
    description: "Select the area you'd like help with",
    options: [
      {
        value: "investments" as GoalValue,
        label: "Growing wealth / investments",
        icon: TrendingUp,
      },
      {
        value: "retirement" as GoalValue,
        label: "Planning for retirement",
        icon: Landmark,
      },
      {
        value: "property" as GoalValue,
        label: "Buying property",
        icon: Home,
      },
      {
        value: "debt" as GoalValue,
        label: "Managing debt",
        icon: CreditCard,
      },
      {
        value: "insurance" as GoalValue,
        label: "Protecting my family (insurance)",
        icon: Shield,
      },
      {
        value: "other" as GoalValue,
        label: "Other / Not sure",
        icon: HelpCircle,
      },
    ],
  },
  {
    id: "urgency" as const,
    question: "How soon do you need help?",
    description: "This helps us prioritise your matches",
    options: [
      {
        value: "urgent" as UrgencyValue,
        label: "Right now - urgent",
        icon: Zap,
      },
      {
        value: "month" as UrgencyValue,
        label: "Within the next month",
        icon: Calendar,
      },
      {
        value: "exploring" as UrgencyValue,
        label: "Just exploring options",
        icon: Compass,
      },
      {
        value: "future" as UrgencyValue,
        label: "Planning for the future",
        icon: Clock,
      },
    ],
  },
  {
    id: "situation" as const,
    question: "What's your situation?",
    description: "This helps us match you with the right expertise",
    options: [
      {
        value: "individual" as SituationValue,
        label: "Individual / Personal",
        icon: User,
      },
      {
        value: "couple" as SituationValue,
        label: "Couple / Family",
        icon: Users,
      },
      {
        value: "business" as SituationValue,
        label: "Business owner",
        icon: Briefcase,
      },
      {
        value: "smsf" as SituationValue,
        label: "SMSF trustee",
        icon: Building2,
      },
    ],
  },
] as const

type StepId = (typeof QUIZ_STEPS)[number]["id"]

// Option card component - large, tappable cards
function OptionCard({
  option,
  isSelected,
  onSelect,
}: {
  option: {
    value: string
    label: string
    icon: React.ComponentType<{ className?: string }>
  }
  isSelected: boolean
  onSelect: () => void
}) {
  const Icon = option.icon

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative w-full p-4 sm:p-5 rounded-xl border-2 text-left",
        "transition-all duration-200 ease-out",
        "hover:border-primary/50 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
        "active:scale-[0.98] active:transition-none",
        isSelected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-background hover:bg-muted/30"
      )}
    >
      <div className="flex items-center gap-4">
        {/* Icon container */}
        <div
          className={cn(
            "flex items-center justify-center size-12 rounded-lg transition-colors duration-200",
            isSelected
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary/70"
          )}
        >
          <Icon className="size-6" />
        </div>

        {/* Label */}
        <span
          className={cn(
            "text-base sm:text-lg font-medium transition-colors flex-1",
            isSelected
              ? "text-foreground"
              : "text-muted-foreground group-hover:text-foreground"
          )}
        >
          {option.label}
        </span>

        {/* Selection indicator */}
        <div
          className={cn(
            "flex items-center justify-center size-6 rounded-full border-2 transition-all duration-200",
            isSelected
              ? "border-primary bg-primary"
              : "border-border bg-background group-hover:border-primary/50"
          )}
        >
          {isSelected && (
            <CheckCircle2 className="size-4 text-white animate-in zoom-in-50 duration-150" />
          )}
        </div>
      </div>
    </button>
  )
}

// Results component with advisor recommendation
function QuizResults({
  answers,
  onRestart,
}: {
  answers: QuizAnswers
  onRestart: () => void
}) {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  const recommendedCategory = getRecommendedCategory(answers)
  const categoryInfo = ADVISOR_CATEGORIES[recommendedCategory]

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true))
  }, [])

  const handleFindAdvisor = useCallback(() => {
    const params = new URLSearchParams()
    params.set("category", categoryInfo.searchParam)

    // Add urgency for sorting/filtering if relevant
    if (answers.urgency === "urgent") {
      params.set("availability", "immediate")
    }

    // Add situation for filtering
    if (answers.situation) {
      params.set("specialisation", answers.situation)
    }

    router.push(`/search?${params.toString()}`)
  }, [router, categoryInfo.searchParam, answers])

  // Get display labels for the summary
  const getGoalLabel = (goal?: GoalValue) => {
    const step = QUIZ_STEPS.find((s) => s.id === "goal")
    return step?.options.find((o) => o.value === goal)?.label || "Not specified"
  }

  const getUrgencyLabel = (urgency?: UrgencyValue) => {
    const step = QUIZ_STEPS.find((s) => s.id === "urgency")
    return (
      step?.options.find((o) => o.value === urgency)?.label || "Not specified"
    )
  }

  const getSituationLabel = (situation?: SituationValue) => {
    const step = QUIZ_STEPS.find((s) => s.id === "situation")
    return (
      step?.options.find((o) => o.value === situation)?.label || "Not specified"
    )
  }

  return (
    <div
      className={cn(
        "transition-all duration-500 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      {/* Success header */}
      <div className="text-center mb-8">
        <div className="mb-4 inline-flex size-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="size-8 text-green-600" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-3">
          Based on your answers, we recommend a
        </h2>
        <p className="text-3xl sm:text-4xl font-bold text-primary">
          {categoryInfo.name}
        </p>
      </div>

      {/* Category description */}
      <div className="mb-8 p-5 bg-muted/50 rounded-xl border border-border">
        <p className="text-muted-foreground leading-relaxed">
          {categoryInfo.description}
        </p>
      </div>

      {/* Summary of answers */}
      <div className="mb-8 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Your answers
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">Financial goal</span>
            <span className="font-medium text-foreground">
              {getGoalLabel(answers.goal)}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">Timeline</span>
            <span className="font-medium text-foreground">
              {getUrgencyLabel(answers.urgency)}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Situation</span>
            <span className="font-medium text-foreground">
              {getSituationLabel(answers.situation)}
            </span>
          </div>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="space-y-3">
        <Button size="lg" className="w-full" onClick={handleFindAdvisor}>
          <Search className="size-4 mr-2" />
          Find a {categoryInfo.name}
        </Button>
        <Button variant="ghost" size="lg" className="w-full" onClick={onRestart}>
          Start over
        </Button>
      </div>
    </div>
  )
}

// Animated step wrapper using CSS transitions
function AnimatedStep({
  children,
  direction,
  stepKey,
}: {
  children: React.ReactNode
  direction: "forward" | "backward"
  stepKey: number
}) {
  return (
    <div
      key={stepKey}
      className={cn(
        "animate-in fade-in-0 duration-300 ease-out",
        direction === "forward" ? "slide-in-from-right-12" : "slide-in-from-left-12"
      )}
    >
      {children}
    </div>
  )
}

// Progress dots indicator
function ProgressDots({
  currentStep,
  totalSteps,
}: {
  currentStep: number
  totalSteps: number
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "transition-all duration-300",
            index === currentStep
              ? "w-8 h-2 bg-primary rounded-full"
              : index < currentStep
                ? "w-2 h-2 bg-primary rounded-full"
                : "w-2 h-2 bg-border rounded-full"
          )}
        />
      ))}
    </div>
  )
}

// Main quiz component
export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const [isComplete, setIsComplete] = useState(false)
  const [direction, setDirection] = useState<"forward" | "backward">("forward")

  const totalSteps = QUIZ_STEPS.length
  const progress = ((currentStep + 1) / totalSteps) * 100
  const currentStepData = QUIZ_STEPS[currentStep]
  const currentAnswer = answers[currentStepData?.id as StepId]

  const handleSelect = (value: string) => {
    if (currentStepData) {
      setAnswers((prev) => ({
        ...prev,
        [currentStepData.id]: value,
      }))
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setDirection("forward")
      setCurrentStep((prev) => prev + 1)
    } else {
      setIsComplete(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection("backward")
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setAnswers({})
    setIsComplete(false)
    setDirection("forward")
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-xl px-4 py-8 sm:py-16">
        {/* Header - always visible */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-block text-xl font-bold text-foreground mb-6 hover:text-primary transition-colors"
          >
            Advyser
          </Link>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
            Find your ideal advisor
          </h1>
          <p className="text-muted-foreground">
            Not sure what you need? Answer 3 quick questions.
          </p>
        </div>

        {!isComplete && (
          <>
            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">
                  Step {currentStep + 1} of {totalSteps}
                </span>
                <ProgressDots currentStep={currentStep} totalSteps={totalSteps} />
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          </>
        )}

        {/* Quiz content */}
        <div className="relative overflow-hidden">
          {isComplete ? (
            <QuizResults answers={answers} onRestart={handleRestart} />
          ) : (
            <AnimatedStep direction={direction} stepKey={currentStep}>
              {/* Question */}
              <div className="mb-6 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
                  {currentStepData.question}
                </h2>
                <p className="text-muted-foreground">
                  {currentStepData.description}
                </p>
              </div>

              {/* Options - large tappable cards */}
              <div className="space-y-3 mb-8">
                {currentStepData.options.map((option) => (
                  <OptionCard
                    key={option.value}
                    option={option}
                    isSelected={currentAnswer === option.value}
                    onSelect={() => handleSelect(option.value)}
                  />
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-3">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleBack}
                    className="flex-1 sm:flex-none sm:w-auto"
                  >
                    <ArrowLeft className="size-4 mr-2" />
                    Back
                  </Button>
                )}
                <Button
                  size="lg"
                  onClick={handleNext}
                  disabled={!currentAnswer}
                  className={cn("flex-1", currentStep === 0 && "w-full")}
                >
                  {currentStep === totalSteps - 1 ? (
                    "See my recommendation"
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="size-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </AnimatedStep>
          )}
        </div>

        {/* Skip option - only during quiz */}
        {!isComplete && (
          <div className="mt-8 text-center">
            <Link
              href="/search"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              Skip quiz and browse all advisors
            </Link>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            Your answers help us match you with the right type of professional.
            <br />
            All advisors on Advyser are verified and licensed in Australia.
          </p>
        </div>
      </div>
    </main>
  )
}
