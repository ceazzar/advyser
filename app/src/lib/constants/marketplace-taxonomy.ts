export type AdvisorType =
  | "financial_adviser"
  | "mortgage_broker"
  | "buyers_agent"
  | "property_adviser"

export type QuizGoal =
  | "investments"
  | "retirement"
  | "property"
  | "debt"
  | "insurance"
  | "other"

export type QuizUrgency = "urgent" | "month" | "exploring" | "future"

export type QuizSituation = "individual" | "couple" | "business" | "smsf"

export const ADVISOR_TYPE_OPTIONS: ReadonlyArray<{ value: AdvisorType; label: string }> = [
  { value: "financial_adviser", label: "Financial Adviser" },
  { value: "mortgage_broker", label: "Mortgage Broker" },
  { value: "buyers_agent", label: "Buyers Agent" },
  { value: "property_adviser", label: "Property Adviser" },
]

export const QUIZ_GOAL_TO_ADVISOR_TYPES: Record<QuizGoal, AdvisorType[]> = {
  investments: ["financial_adviser", "property_adviser"],
  retirement: ["financial_adviser"],
  property: ["mortgage_broker", "buyers_agent", "property_adviser"],
  debt: ["mortgage_broker", "financial_adviser"],
  insurance: ["financial_adviser"],
  other: ["financial_adviser"],
}

export const QUIZ_GOAL_TO_SPECIALTY_SLUGS: Record<QuizGoal, string[]> = {
  investments: ["wealth-management", "investment-strategy", "portfolio-management"],
  retirement: ["retirement-planning", "superannuation", "smsf"],
  property: ["first-home-buyers", "property-investment", "refinance"],
  debt: ["refinance", "debt-consolidation", "cash-flow"],
  insurance: ["insurance-risk", "income-protection", "life-insurance"],
  other: ["financial-planning"],
}

export const QUIZ_SITUATION_TO_SPECIALTY_SLUGS: Record<QuizSituation, string[]> = {
  individual: ["financial-planning"],
  couple: ["family-finance", "financial-planning"],
  business: ["business-finance", "tax-planning"],
  smsf: ["smsf", "retirement-planning"],
}

export const CATEGORY_TO_SPECIALTY: Record<
  string,
  { specialtySlug: string; advisorType?: AdvisorType }
> = {
  "retirement-planning": { specialtySlug: "retirement-planning", advisorType: "financial_adviser" },
  "wealth-management": { specialtySlug: "wealth-management", advisorType: "financial_adviser" },
  "insurance-risk": { specialtySlug: "insurance-risk", advisorType: "financial_adviser" },
  "property-investment": { specialtySlug: "property-investment", advisorType: "property_adviser" },
  "tax-planning": { specialtySlug: "tax-planning", advisorType: "financial_adviser" },
  "estate-planning": { specialtySlug: "estate-planning", advisorType: "financial_adviser" },
}

export const AU_STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"] as const

export function normalizeAuState(input: string | null | undefined): string | null {
  if (!input) return null
  const value = input.trim().toUpperCase()
  return AU_STATES.includes(value as (typeof AU_STATES)[number]) ? value : null
}

