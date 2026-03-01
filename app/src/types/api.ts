/**
 * API Types
 * Generic API response types for Advyser platform
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
  /** Response timestamp */
  timestamp: string
}

/**
 * API error structure
 */
export interface ApiError {
  code: string
  message: string
  details?: Record<string, string[]>
  /** HTTP status code */
  statusCode: number
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc'

/**
 * Pagination params for requests
 */
export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortDirection?: SortDirection
}
