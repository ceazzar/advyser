/**
 * Lead State Machine
 *
 * Defines valid lead statuses and allowed transitions.
 * Prevents invalid state changes and documents the lead lifecycle.
 */

export type LeadStatus = "new" | "contacted" | "booked" | "converted" | "declined";

/**
 * Valid state transitions for leads
 *
 * Lead Lifecycle:
 * ┌───────┐    accept    ┌───────────┐    book    ┌────────┐    convert    ┌───────────┐
 * │  new  │ ──────────▶ │ contacted │ ────────▶ │ booked │ ────────────▶ │ converted │
 * └───────┘             └───────────┘            └────────┘               └───────────┘
 *     │                       │                      │
 *     │ decline               │ decline              │ decline
 *     ▼                       ▼                      ▼
 * ┌──────────┐           ┌──────────┐           ┌──────────┐
 * │ declined │           │ declined │           │ declined │
 * └──────────┘           └──────────┘           └──────────┘
 */
export const VALID_LEAD_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  new: ["contacted", "declined"],
  contacted: ["booked", "declined"],
  booked: ["converted", "declined"],
  converted: [], // terminal state
  declined: [], // terminal state (cannot be undone)
};

/**
 * Check if a state transition is valid
 */
export function isValidTransition(
  currentStatus: LeadStatus,
  newStatus: LeadStatus
): boolean {
  return VALID_LEAD_TRANSITIONS[currentStatus].includes(newStatus);
}

/**
 * Get allowed next statuses from current status
 */
export function getAllowedTransitions(currentStatus: LeadStatus): LeadStatus[] {
  return VALID_LEAD_TRANSITIONS[currentStatus];
}

/**
 * Check if a lead is in a terminal state
 */
export function isTerminalState(status: LeadStatus): boolean {
  return VALID_LEAD_TRANSITIONS[status].length === 0;
}

/**
 * Human-readable status labels
 */
export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  booked: "Booked",
  converted: "Converted",
  declined: "Declined",
};

/**
 * Status colors for UI (Tailwind classes)
 */
export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  booked: "bg-purple-100 text-purple-800",
  converted: "bg-green-100 text-green-800",
  declined: "bg-gray-100 text-gray-800",
};

/**
 * Status descriptions for UI
 */
export const LEAD_STATUS_DESCRIPTIONS: Record<LeadStatus, string> = {
  new: "Awaiting advisor response",
  contacted: "Advisor has responded",
  booked: "Meeting scheduled",
  converted: "Became a client",
  declined: "Request declined",
};
