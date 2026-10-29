import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import { Products } from '@base-class/web-app';

dotenv.config();

const timestamp = new Date().toISOString().replace(/[:T]/g, '-').replace(/\..+/, '');

export default defineConfig({
  preserveOutput: 'always',
  testDir: './',
  testMatch: ['tests/**/*.spec.{js,ts}', 'e2e-scenarios/tests/**/*.spec.{js,ts}'],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list'], ['json', { outputFile: 'test-results/results.json' }], ['json', { outputFile: `report-dashboard/test-reports-history/results-${timestamp}.json` }]],

  metadata: {
    // Default fallback environment
    environment: process.env.TEST_ENV || 'Pre-Prod',

    // Per-product environment mapping
    environments: {
      [Products.Marketplace]: process.env.MARKETPLACE_ENV || 'Pre-Prod',
      [Products.GovProducts]: process.env.GOV_PRODUCTS_ENV || 'Pre-Prod',
      [Products.SharedProducts]: process.env.SHARED_PRODUCTS_ENV || 'Pre-Prod',
      [Products.MarketService]: process.env.MARKET_SERVICE_ENV || 'Pre-Prod',
      [Products.Sayal]: process.env.SAYAL_ENV || 'Pre-Prod',
      [Products.SelfConstruction]: process.env.SELF_CONSTRUCTION_ENV || 'Pre-Prod',
      [Products.DigitarBroker]: process.env.DIGITAR_BROKER_ENV || 'STG',
      [Products.DigitarDeveloper]: process.env.DIGITAR_DEVELOPER_ENV || 'STG',
      [Products.Loyalty]: process.env.LOYALTY_ENV || 'Pre-Prod',
      [Products.RealEstateData]: process.env.REAL_ESTATE_DATA_ENV || 'Pre-Prod',
    },
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
      args: ['--start-maximized', '--disable-features=LocalNetworkAccessCheck', '--disable-blink-features=AutomationControlled'],
    },
    headless: false,
    permissions: ['geolocation', 'local-network-access'],
    geolocation: { latitude: 21.5424, longitude: 39.198 },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: null, deviceScaleFactor: undefined },
    },
  ],
});
