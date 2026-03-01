import { defineConfig, devices } from '@playwright/test';

const enableAuthE2E = process.env.ENABLE_AUTH_E2E === 'true';

const baseProjects = [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  },
];

const authProjects = enableAuthE2E
  ? [
      {
        name: 'setup',
        testMatch: /.*\.setup\.ts/,
      },
      {
        name: 'consumer-chromium',
        use: {
          ...devices['Desktop Chrome'],
          storageState: '.auth/consumer.json',
        },
        testMatch: /.*\.consumer\.spec\.ts/,
        dependencies: ['setup'],
      },
      {
        name: 'advisor-chromium',
        use: {
          ...devices['Desktop Chrome'],
          storageState: '.auth/advisor.json',
        },
        testMatch: /.*\.advisor\.spec\.ts/,
        dependencies: ['setup'],
      },
    ]
  : [];

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [...baseProjects, ...authProjects],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
