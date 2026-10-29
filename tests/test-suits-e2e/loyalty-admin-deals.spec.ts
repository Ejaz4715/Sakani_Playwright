import { test, expect, Page } from '@playwright/test';
import path from 'node:path';
import { WebApp } from '@base-class/web-app';
import { DataHelper } from '@helpers/DataHelper';
import { logStep } from '@helpers/LogSteps';

const SERVICE = 'loyalty-admin-deals';
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

// a date some days after today, kept inside the current month (never later than the last day of the month)
const daysFromTodayInMonth = (days: number) => {
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  return new Date(today.getFullYear(), today.getMonth(), Math.min(today.getDate() + days, lastDayOfMonth));
};
const INACTIVE_STATUS = 'غير نشط';

// random numbers and texts, because a company can't have two deals with the same price and discount
async function randomNumber(min: number, max: number) {
  const { faker } = await import('@faker-js/faker');
  return String(faker.number.int({ min, max }));
}
async function randomDealTexts() {
  const { faker } = await import('@faker-js/faker');
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    details: faker.lorem.sentence(),
    termsAndConditions: faker.lorem.paragraph(),
  };
}
// the admin account allows only one OTP every few minutes, so the session is saved to a file and shared with all tests
const adminSessionFile = path.join(require('os').tmpdir(), 'loyalty-admin-deals-session.json');
const fs = require('fs');
if (!fs.existsSync(adminSessionFile)) {
  fs.writeFileSync(adminSessionFile, JSON.stringify({ cookies: [], origins: [] }));
}
// Opens the admin portal in the test's own browser and logs in (one OTP) only when the saved session is missing or expired
async function openAdminPortal(page: Page, app: WebApp) {
  const environment = readEnvironments();
  const data = readServiceData();
  await page.goto(new URL(environment.adminPortalUrl).origin);

  // with an expired session the site first shows the menu, then the server rejects the session and it redirects to login,
  // so wait until the site stops talking to the server before deciding
  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});

  // wait until it shows either the login form or the logged-in menu
  const loginHeading = page.getByRole('heading', { name: 'لتسجيل الدخول' });
  const loyaltyMenu = page.locator('a').filter({ hasText: 'برنامج شراي' });
  await expect(loginHeading.or(loyaltyMenu)).toBeVisible({ timeout: 30_000 });

  if (await loginHeading.isVisible()) {
    await app.adminProjectPage.login(environment.adminPortalUrl, data.adminUsername, data.adminPassword);
    await page.context().storageState({ path: adminSessionFile });
  }
  await expect(loyaltyMenu).toBeVisible({ timeout: 30_000 });
}
// Opens the admin portal and goes to the deals list
async function openDealsList(page: Page, app: WebApp) {
  await logStep('Step 01: Open admin portal (login only if the saved session expired)');
  await openAdminPortal(page, app);

  await logStep('Step 02: Navigate to the deals list');
  await app.adminLoyaltyPage.clickLoyaltyProgram();
  await app.adminLoyaltyPage.clickManageDeals();
}
// Creates a deal with random data between the given dates, then checks the company name and status in the record and in the list
async function createDealAndVerifyStatus(page: Page, status: string, campaignStartDate: Date, campaignEndDate: Date) {
  //read data from json relative to the service
  const data = readServiceData();
  const app = new WebApp(page);
  const companyName = data.companyName;
  const price = await randomNumber(1000, 9999);
  const discount = await randomNumber(1, 90);
  const acceptableQuantity = await randomNumber(1, 5);
  const commissionValue = await randomNumber(1, 50);
  const { termsAndConditions, ...dealTexts } = await randomDealTexts();
  const imageFilePath = path.join(process.cwd(), 'src', 'data', 'Sample image 2.png');
  const pdfFilePath = path.join(process.cwd(), 'src', 'data', 'Sample pdf.pdf');
  await openDealsList(page, app);

  await logStep('Step 02: Click add new deal');
  await app.adminLoyaltyPage.clickAddNewOffer();

  await logStep(`Step 03: Select office name and status "${status}"`);
  await app.loyaltyAdminDealsPage.selectOfficeName(companyName);
  await app.loyaltyAdminDealsPage.selectStatus(status);

  await logStep('Step 04: Select campaign start and end dates from calendar');
  await app.loyaltyAdminDealsPage.selectCampaignStartDate(campaignStartDate);
  await app.loyaltyAdminDealsPage.selectCampaignEndDate(campaignEndDate);

  await logStep('Step 05: Fill price, discount and acceptable quantity per user');
  await app.adminLoyaltyPage.fillPrice(price);
  await app.adminLoyaltyPage.fillDiscount(discount);
  await app.adminLoyaltyPage.fillAcceptableQuantityPerUser(acceptableQuantity);

  await logStep('Step 06: Select Sakani commission percentage');
  await app.adminLoyaltyPage.selectSakaniCommissionType('النسبة المئوية');
  await app.adminLoyaltyPage.fillSakaniCommissionValue(commissionValue);

  await logStep('Step 07: Fill title, description and details');
  await app.loyaltyAdminDealsPage.fillDealTexts(dealTexts);

  await logStep('Step 08: Upload deal image and PDF');
  await app.loyaltyAdminDealsPage.uploadDealImage(imageFilePath);
  await app.loyaltyAdminDealsPage.uploadDealPdf(pdfFilePath);

  await logStep('Step 09: Fill terms and conditions > Save');
  await app.adminLoyaltyPage.fillTermsAndConditions(termsAndConditions);
  await app.adminLoyaltyPage.clickSave();

  await logStep('Step 10: Verify the deal is created for the company');
  expect(await app.loyaltyAdminDealsPage.isDealCompanyHeadingVisible(companyName)).toBeTruthy();
  const expectedStatus = app.loyaltyAdminDealsPage.getExpectedStatus(campaignStartDate, campaignEndDate, status);

  await logStep('Step 11: Verify the company name and status in the deal record');
  expect(await app.loyaltyAdminDealsPage.getOfficeNameInRecord()).toContain(companyName);
  expect(await app.loyaltyAdminDealsPage.getStatusInRecord()).toBe(expectedStatus);

  await logStep('Step 12: Back to list > Verify the deal status according to the end date');
  await app.loyaltyAdminDealsPage.clickBackToList();
  expect(await app.loyaltyAdminDealsPage.getDealStatusInList(companyName, price)).toBe(expectedStatus);

  return { companyName, price };
}

// Creates a deal that starts later this month, so it is not running yet (status inactive)
const createInactiveDeal = (page: Page) => createDealAndVerifyStatus(page, INACTIVE_STATUS, daysFromTodayInMonth(3), daysFromTodayInMonth(10));

test.describe('Loyalty admin deals Update,creat,Delete', () => {
  test.use({ storageState: adminSessionFile });

  test('TC-01 Loyalty admin deal - create, update and delete', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    const app = new WebApp(page);

    // Create: asserts company, status in the record and in the list
    const { companyName, price } = await createInactiveDeal(page);

    const newTexts = await randomDealTexts();
    const newPrice = await randomNumber(10000, 99999);

    await logStep('Step 13: Open the deal for edit from the list');
    await app.loyaltyAdminDealsPage.clickEditDealInList(companyName, price);

    await logStep('Step 14: Update title, description, details and price > Save');
    await app.loyaltyAdminDealsPage.fillDealTexts(newTexts);
    await app.adminLoyaltyPage.fillPrice(newPrice);
    await app.adminLoyaltyPage.clickSave();

    // the deal now has the new price, so every step below finds it by the new price
    const updatedDealRow = app.loyaltyAdminDealsPage.getDealRow(companyName, newPrice);

    await logStep('Step 15: Verify the list shows the updated deal (new title, description and price) and no deal with the old price');
    const updatedRowText = await app.loyaltyAdminDealsPage.getDealRowInList(companyName, newPrice);
    expect(updatedRowText).toContain(companyName);
    expect(updatedRowText).toContain(newTexts.title);
    expect(updatedRowText).toContain(newTexts.description);
    expect(updatedRowText).toContain(app.loyaltyAdminDealsPage.toListPrice(newPrice));
    expect(updatedRowText).toContain(INACTIVE_STATUS);
    await expect(app.loyaltyAdminDealsPage.getDealRow(companyName, price)).toHaveCount(0);

    await logStep('Step 16: Click delete on the updated deal > Verify the popup and the cancel button are displayed');
    await app.loyaltyAdminDealsPage.clickDeleteDealInList(companyName, newPrice);
    expect(await app.loyaltyAdminDealsPage.isDeletePopupVisible()).toBeTruthy();
    expect(await app.loyaltyAdminDealsPage.isCancelButtonVisibleInModal()).toBeTruthy();

    await logStep('Step 17: Click cancel > Verify the popup is closed and the deal is still in the list');
    await app.loyaltyAdminDealsPage.clickCancelInModal();
    await expect(updatedDealRow).toBeVisible();

    await logStep('Step 18: Click delete again > Click remove');
    await app.loyaltyAdminDealsPage.clickDeleteDealInList(companyName, newPrice);
    await app.loyaltyAdminDealsPage.clickRemoveInModal();

    await logStep('Step 19: Verify the deal is removed from the list');
    await expect(updatedDealRow).toHaveCount(0);
  });

  test('TC-02 Loyalty admin deals filter and reset', { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    const app = new WebApp(page);

    await openDealsList(page, app);

    await logStep('Step 03: Verify the list results before using the filter > Take the first deal in the list');
    const rowsBeforeFilter = await app.loyaltyAdminDealsPage.getLoadedListRowsCount();
    expect(rowsBeforeFilter).toBeGreaterThan(0);
    const { companyName, status } = await app.loyaltyAdminDealsPage.getFirstDealInList();

    // the search matches part of the name, so it also returns other companies that share it
    const searchText = companyName.replace(/\s*\d+$/, '');

    await logStep(`Step 04: Filter by "${searchText}" and status "${status}" > Verify the results`);
    await app.loyaltyAdminDealsPage.fillFilterSearch(searchText);
    await app.loyaltyAdminDealsPage.selectFilterStatus(status);
    await app.loyaltyAdminDealsPage.clickFilterSearch();
    const resultTexts = await app.loyaltyAdminDealsPage.getListRowsTexts();
    expect(resultTexts.some((rowText) => rowText.includes(companyName))).toBeTruthy();
    for (const rowText of resultTexts) {
      expect(rowText).toContain(searchText);
      expect(rowText).toContain(status);
    }

    await logStep('Step 05: Click reset > Verify the filter is cleared');
    await app.loyaltyAdminDealsPage.clickFilterReset();
    expect(await app.loyaltyAdminDealsPage.getFilterSearchValue()).toBe('');
    expect(await app.loyaltyAdminDealsPage.getFilterSelectedValuesCount()).toBe(0);
    await expect.poll(() => app.loyaltyAdminDealsPage.getLoadedListRowsCount()).toBe(rowsBeforeFilter);
  });
});
