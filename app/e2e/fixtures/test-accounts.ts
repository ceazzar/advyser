/**
 * Test Account Credentials for E2E Tests
 *
 * These credentials correspond to the seed data in seed.sql.
 * Use these constants when authenticating in E2E test scenarios.
 */

export const TEST_CONSUMER = {
  email: 'test-consumer@advyser.test',
  password: 'TestPassword123!',
  firstName: 'Emily',
  lastName: 'Chen',
} as const;

export const TEST_ADVISOR = {
  email: 'test-advisor@advyser.test',
  password: 'TestPassword123!',
  firstName: 'James',
  lastName: 'Mitchell',
} as const;

/**
 * Additional test advisors for testing search/filtering
 */
export const TEST_ADVISORS = {
  financialAdviser: {
    email: 'sarah.thompson@advyser.test',
    password: 'TestPassword123!',
    firstName: 'Sarah',
    lastName: 'Thompson',
  },
  mortgageBroker: {
    email: 'michael.wong@advyser.test',
    password: 'TestPassword123!',
    firstName: 'Michael',
    lastName: 'Wong',
  },
  buyersAgent: {
    email: 'jessica.patel@advyser.test',
    password: 'TestPassword123!',
    firstName: 'Jessica',
    lastName: 'Patel',
  },
} as const;

/**
 * Type definitions for test accounts
 */
export type TestAccount = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};
