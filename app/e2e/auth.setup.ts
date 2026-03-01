import { expect,test as setup } from "@playwright/test"
import * as path from "path"

/**
 * Playwright Auth Setup
 *
 * This file handles authentication state persistence for e2e tests.
 * It logs in as test users and saves their session state to JSON files
 * that can be reused across test runs.
 *
 * Usage in playwright.config.ts:
 * ```ts
 * projects: [
 *   { name: 'setup', testMatch: /.*\.setup\.ts/ },
 *   {
 *     name: 'consumer-tests',
 *     use: { storageState: '.auth/consumer.json' },
 *     dependencies: ['setup'],
 *   },
 *   {
 *     name: 'advisor-tests',
 *     use: { storageState: '.auth/advisor.json' },
 *     dependencies: ['setup'],
 *   },
 * ]
 * ```
 */

// Auth state file paths
const CONSUMER_AUTH_FILE = path.join(__dirname, "../.auth/consumer.json")
const ADVISOR_AUTH_FILE = path.join(__dirname, "../.auth/advisor.json")

// Test user credentials - these should match users in your test database
// In CI/CD, these can be overridden via environment variables
const TEST_CONSUMER = {
  email: process.env.TEST_CONSUMER_EMAIL || "test-consumer@advyser.test",
  password: process.env.TEST_CONSUMER_PASSWORD || "TestPassword123!",
}

const TEST_ADVISOR = {
  email: process.env.TEST_ADVISOR_EMAIL || "test-advisor@advyser.test",
  password: process.env.TEST_ADVISOR_PASSWORD || "TestPassword123!",
}

/**
 * Helper function to perform login via the UI
 */
async function performLogin(
  page: import("@playwright/test").Page,
  email: string,
  password: string
) {
  // Navigate to login page
  await page.goto("/login")

  // Wait for the login form to be ready
  await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible()

  // Fill in email
  await page.getByLabel(/email/i).fill(email)

  // Fill in password
  await page.getByLabel(/password/i).fill(password)

  // Click sign in button
  await page.getByRole("button", { name: /sign in/i }).click()

  // Wait for successful login.
  // The redirect path depends on user role (consumer -> /, advisor -> /advisor)
  await page.waitForURL((url) => url.pathname === "/" || url.pathname.startsWith("/advisor"), {
    timeout: 15000,
  })

  // Verify we're logged in by checking for authenticated UI elements
  // This ensures the session is fully established before saving state
  await expect(page).not.toHaveURL(/\/login/)
}

/**
 * Setup: Authenticate as test consumer user
 */
setup("authenticate as consumer", async ({ page }) => {
  await performLogin(page, TEST_CONSUMER.email, TEST_CONSUMER.password)

  // Verify consumer-specific redirect (consumers go to /)
  await expect(page).toHaveURL(/\/$/)

  // Save authentication state
  await page.context().storageState({ path: CONSUMER_AUTH_FILE })
})

/**
 * Setup: Authenticate as test advisor user
 */
setup("authenticate as advisor", async ({ page }) => {
  await performLogin(page, TEST_ADVISOR.email, TEST_ADVISOR.password)

  // Verify advisor-specific redirect (advisors go to /advisor)
  await expect(page).toHaveURL(/\/advisor/)

  // Save authentication state
  await page.context().storageState({ path: ADVISOR_AUTH_FILE })
})
