/**
 * Search Types
 * Search filters and result types for advisor discovery
 */

import type { Advisor, VerificationLevel } from './advisor'
import type { PaginatedResponse } from './api'

/**
 * Search filters for advisor search
 */
export interface SearchFilters {
  /** Search query text */
  query?: string
  /** Category/specialty */
  category?: string
  /** Location (suburb, postcode) */
  location?: string
  /** Australian state */
  state?: 'nsw' | 'vic' | 'qld' | 'wa' | 'sa' | 'tas' | 'act' | 'nt'
  /** Service mode */
  serviceMode?: 'online' | 'in-person' | 'both'
  /** Minimum verification level */
  verificationLevel?: VerificationLevel
  /** Minimum rating */
  minRating?: number
  /** Has availability this week */
  availableThisWeek?: boolean
  /** Price range */
  priceRange?: 'budget' | 'mid' | 'premium'
  /** Languages spoken */
  languages?: string[]
  /** Specialties */
  specialties?: string[]
}

/**
 * Search result item - advisor with search relevance
 */
export interface SearchResult {
  advisor: Advisor
  /** Search relevance score */
  relevanceScore: number
  /** Distance in km (if location provided) */
  distanceKm?: number
  /** Highlighted fields for search term */
  highlights?: {
    name?: string
    bio?: string
    specialties?: string[]
  }
}

/**
 * Search response with facets
 */
export interface SearchResponse extends PaginatedResponse<SearchResult> {
  /** Facets for filter refinement */
  facets: {
    categories: Array<{ value: string; label: string; count: number }>
    locations: Array<{ value: string; label: string; count: number }>
    states: Array<{ value: string; label: string; count: number }>
    languages: Array<{ value: string; label: string; count: number }>
    priceRanges: Array<{ value: string; label: string; count: number }>
  }
}
