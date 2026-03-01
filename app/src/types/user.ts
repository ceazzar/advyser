/**
 * User Types
 * Core user identity and profile types for Advyser platform
 */

/**
 * User role types - defines access levels
 */
export type UserRole = 'consumer' | 'advisor' | 'admin'

/**
 * User entity - core identity
 */
export interface User {
  /** Unique user identifier */
  id: string
  /** User email address (unique) */
  email: string
  /** User phone number (optional, AU format) */
  phone?: string
  /** User role - determines access permissions */
  role: UserRole
  /** Account creation timestamp */
  createdAt: Date
  /** Last login timestamp */
  lastLoginAt?: Date
  /** Last updated timestamp */
  updatedAt: Date
}

/**
 * User profile - extends basic user info
 */
export interface Profile {
  /** Reference to user ID */
  userId: string
  /** First name */
  firstName: string
  /** Last name */
  lastName: string
  /** Profile avatar URL */
  avatarUrl?: string
  /** Contact phone number */
  phone?: string
  /** Location (suburb, postcode, or state) */
  location?: string
  /** User timezone (e.g., 'Australia/Sydney') */
  timezone?: string
}
