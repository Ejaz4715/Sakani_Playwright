import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const timestamp = new Date().toISOString().replace(/[:T]/g, '-').replace(/\..+/, '');

export default defineConfig({
  preserveOutput: 'always',
  testDir: './', 
  testMatch: [
    'tests/**/*.spec.{js,ts}',
    'e2e-scenarios/tests/**/*.spec.{js,ts}'
  ],
  testIgnore: [
    /tests[\\/]e2e-scenarios[\\/]test-suits-e2e[\\/](?!(?:moh-land|auction|offplan-moh-land|offplan-private-land)-booking-journey-suit\.spec\.ts$|mega-project-suit\.spec\.ts$|payment-tracking-(?:completion-percentage|specified-period)-suit\.spec\.ts$)/,
  ],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['json', { outputFile: `report-dashboard/test-reports-history/results-${timestamp}.json` }]
  ],

  metadata: {
    // Default fallback environment
    environment: process.env.TEST_ENV || 'Pre-Prod',
    
    // Per-product environment mapping
    environments: {
      Sakani: process.env.MARKETPLACE_ENV || 'Pre-Prod',
      Digitar: process.env.DIGITAR_ENV || 'STG',
      Sayal: process.env.SAYAL_ENV || 'Pre-Prod',
    }
  },

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
