import {
  type AdvisorType,
  QUIZ_GOAL_TO_ADVISOR_TYPES,
  QUIZ_GOAL_TO_SPECIALTY_SLUGS,
  QUIZ_SITUATION_TO_SPECIALTY_SLUGS,
  type QuizGoal,
  type QuizSituation,
  type QuizUrgency,
} from "@/lib/constants/marketplace-taxonomy";

export interface MatchRequestInput {
  goal: QuizGoal;
  urgency: QuizUrgency;
  situation: QuizSituation;
  location?: string;
}

export interface MatchCandidate {
  listingId: string;
  advisorType: AdvisorType;
  specialtySlugs: string[];
  suburb: string | null;
  state: string | null;
  acceptingStatus: string;
  responseTimeHours: number | null;
  verificationLevel: string;
  rating: number | null;
  responseRate: number | null;
  profileCompletenessScore: number | null;
}

export interface MatchReason {
  text: string;
  strength: "strong" | "moderate";
}

export interface MatchResult {
  listingId: string;
  score: number;
  reasons: MatchReason[];
}

const WEIGHTS = {
  profession: 40,
  specialty: 25,
  location: 20,
  urgency: 10,
  trust: 5,
} as const;

function normalize(value: string | null | undefined): string {
  return (value || "").trim().toLowerCase();
}

function buildDesiredSpecialties(goal: QuizGoal, situation: QuizSituation): string[] {
  return [...QUIZ_GOAL_TO_SPECIALTY_SLUGS[goal], ...QUIZ_SITUATION_TO_SPECIALTY_SLUGS[situation]];
}

function locationScore(candidate: MatchCandidate, rawLocation?: string): { score: number; reason?: MatchReason } {
  if (!rawLocation || rawLocation.trim().length < 2) {
    return { score: 10, reason: { text: "No location preference set", strength: "moderate" } };
  }

  const location = normalize(rawLocation);
  const suburb = normalize(candidate.suburb);
  const state = normalize(candidate.state);

  if (suburb && (location.includes(suburb) || suburb.includes(location))) {
    return { score: WEIGHTS.location, reason: { text: "Strong local suburb match", strength: "strong" } };
  }

  if (state && location.includes(state)) {
    return { score: 14, reason: { text: "State-level location match", strength: "moderate" } };
  }

  return { score: 0 };
}

function urgencyScore(candidate: MatchCandidate, urgency: QuizUrgency): { score: number; reason?: MatchReason } {
  const takingClients = candidate.acceptingStatus === "taking_clients";
  const responseHours = candidate.responseTimeHours ?? null;

  if (urgency === "urgent") {
    if (takingClients && responseHours !== null && responseHours <= 24) {
      return { score: WEIGHTS.urgency, reason: { text: "Fast response and accepting new clients", strength: "strong" } };
    }
    if (takingClients) {
      return { score: 6, reason: { text: "Accepting new clients", strength: "moderate" } };
    }
    return { score: 0 };
  }

  if (takingClients) {
    return { score: 6, reason: { text: "Currently taking new clients", strength: "moderate" } };
  }

  return { score: 2 };
}

function trustScore(candidate: MatchCandidate): { score: number; reason?: MatchReason } {
  let score = 0;

  if (candidate.verificationLevel === "licence_verified" || candidate.verificationLevel === "identity_verified") {
    score += 2;
  }

  if ((candidate.rating ?? 0) >= 4.5) {
    score += 1.5;
  }

  if ((candidate.responseRate ?? 0) >= 80) {
    score += 1;
  }

  if ((candidate.profileCompletenessScore ?? 0) >= 80) {
    score += 0.5;
  }

  if (score > 0) {
    return {
      score: Math.min(WEIGHTS.trust, score),
      reason: { text: "Strong trust and profile quality signals", strength: "moderate" },
    };
  }

  return { score: 0 };
}

export function scoreMatchCandidate(input: MatchRequestInput, candidate: MatchCandidate): MatchResult {
  const reasons: MatchReason[] = [];
  let score = 0;

  const preferredAdvisorTypes = QUIZ_GOAL_TO_ADVISOR_TYPES[input.goal];
  if (preferredAdvisorTypes.includes(candidate.advisorType)) {
    score += WEIGHTS.profession;
    reasons.push({ text: "Advisor type matches your main goal", strength: "strong" });
  }

  const desiredSpecialties = buildDesiredSpecialties(input.goal, input.situation);
  const specialtyOverlap = desiredSpecialties.filter((slug) => candidate.specialtySlugs.includes(slug));
  if (specialtyOverlap.length > 0) {
    const specialtyScore = Math.min(WEIGHTS.specialty, 10 + specialtyOverlap.length * 5);
    score += specialtyScore;
    reasons.push({ text: "Specialty alignment with your situation", strength: "strong" });
  }

  const location = locationScore(candidate, input.location);
  score += location.score;
  if (location.reason) reasons.push(location.reason);

  const urgency = urgencyScore(candidate, input.urgency);
  score += urgency.score;
  if (urgency.reason) reasons.push(urgency.reason);

  const trust = trustScore(candidate);
  score += trust.score;
  if (trust.reason) reasons.push(trust.reason);

  return {
    listingId: candidate.listingId,
    score: Math.round(score * 100) / 100,
    reasons: reasons.slice(0, 3),
  };
}

