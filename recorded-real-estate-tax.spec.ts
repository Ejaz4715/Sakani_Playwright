import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://pre-sakani.housingapps.sa/');
});