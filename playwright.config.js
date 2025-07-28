import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['line']
  ],
  
  use: {
    baseURL: 'https://www.freshdev.ca/gift',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'Chrome',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'Mobile Web (iPhone 12)',
      use: {
        browserName: 'webkit', // or 'chromium' if preferred
        viewport: { width: 390, height: 844 },
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        isMobile: true,
        hasTouch: true,
      },
    },
  ],

  timeout: 60000, // 60 seconds per test
  expect: {
    timeout: 15000, // 15 seconds for assertions
  },
});