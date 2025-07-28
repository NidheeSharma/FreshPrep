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
      name: 'Desktop Chrome',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'Desktop Firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        hasTouch: true,
        isMobile: true,
      },
    },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        hasTouch: true,
        isMobile: true,
      },
    },
  ],

  timeout: 60000, // 60 seconds per test
  expect: {
    timeout: 15000, // 15 seconds for assertions
  },
});