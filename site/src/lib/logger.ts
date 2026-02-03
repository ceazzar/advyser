/**
 * Structured Logger for Advyser
 *
 * Provides consistent logging across the application with:
 * - JSON output in production (optimized for Vercel Logs)
 * - Human-readable output in development
 *
 * @example
 * ```typescript
 * import { logger } from '@/lib/logger'
 *
 * // Basic usage
 * logger.info('User signed up')
 *
 * // With context
 * logger.error('Payment failed', {
 *   userId: '123',
 *   amount: 100,
 *   error: err.message
 * })
 * ```
 *
 * @note This logger will be upgraded to Sentry in the future
 */

const isProd = process.env.NODE_ENV === 'production'

type LogLevel = 'error' | 'warn' | 'info'

type LogContext = Record<string, unknown>

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  [key: string]: unknown
}

/**
 * Formats a log entry for production (JSON) or development (human-readable)
 */
function formatLog(level: LogLevel, message: string, context?: LogContext): string | LogEntry {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  }

  if (isProd) {
    return JSON.stringify(entry)
  }

  return entry
}

/**
 * Structured logger with environment-aware formatting
 */
export const logger = {
  /**
   * Log an error message
   * Use for exceptions, failed operations, and critical issues
   */
  error: (message: string, context?: LogContext): void => {
    if (isProd) {
      console.error(formatLog('error', message, context))
    } else {
      console.error(`[ERROR] ${message}`, context ?? '')
    }
  },

  /**
   * Log a warning message
   * Use for deprecated features, potential issues, and recoverable errors
   */
  warn: (message: string, context?: LogContext): void => {
    if (isProd) {
      console.warn(formatLog('warn', message, context))
    } else {
      console.warn(`[WARN] ${message}`, context ?? '')
    }
  },

  /**
   * Log an info message
   * Use for general application events and state changes
   */
  info: (message: string, context?: LogContext): void => {
    if (isProd) {
      console.info(formatLog('info', message, context))
    } else {
      console.info(`[INFO] ${message}`, context ?? '')
    }
  },
}

export default logger
