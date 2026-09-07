import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();
export default defineConfig({
// Tell Playwright to look at the project root level
  testDir: './', 
  
  // Match .js and .ts test files across both folder locations
  testMatch: [
    'tests/**/*.spec.{js,ts}',
    'e2e-scenarios/tests/**/*.spec.{js,ts}'
  ],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
      ['allure-playwright', { outputFolder: 'allure-results' }],
    // ['allure-playwright'],
  ],

  timeout: 480_000,
  expect: { timeout: 30_000 },

  use: {
    baseURL: process.env.BASE_URL ?? 'https://pre-sakani.housingapps.sa',
    navigationTimeout: 90_000,
    actionTimeout: 30_000,
    trace: 'on',
    screenshot: 'on',
    video: 'on',
    locale: 'ar-SA',
    timezoneId: 'Asia/Riyadh',
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
        launchOptions: {
      args: ["--start-maximized"],
    },
    headless: false,
    permissions: ["geolocation"],
    geolocation: { latitude: 24.7136, longitude: 46.6753 },
  },

  projects: [
    {
      name: 'chromium',
      use: {...devices["Desktop Chrome"],
        viewport: null,
        deviceScaleFactor: undefined,
      },
    },
    ...(process.env.ALL_BROWSERS
      ? [
          {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } },
          },
          {
            name: 'webkit',
            use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } },
          },
        ]
      : []),
  ],
});
