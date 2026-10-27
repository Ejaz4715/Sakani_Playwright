import { expect, test } from '@playwright/test';
import { WebApp } from '@base-class/web-app';
import { DataHelper } from '@helpers/DataHelper';
import { logStep } from '@helpers/LogSteps';

const SERVICE = 'dashboard-view';
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe('Dashboard View', () => {
  test('TC-01 Verify that sapa user navigates to dashboard', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const developerUserId = data.developerUserId;

    await logStep('Step 01: Navigate to partners portal > Login as developer');
    await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortalBeta(developerUserId);
    await app.partnersLoginPage.switchRoleToDeveloper();

    await logStep('Step 02: Open dashboard view > Verify all dashboard elements are visible');
    await app.dashboardViewPage.clickOnDashboardView();
    expect(await app.dashboardViewPage.areAllDashboardViewElementsVisible()).toBe(true);
  });

  test('TC-02 Verify that sapa user navigates to bookings page', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const developerUserId = data.developerUserId;

    await logStep('Step 01: Navigate to partners portal > Login as developer');
    await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortalBeta(developerUserId);
    await app.partnersLoginPage.switchRoleToDeveloper();

    await logStep('Step 02: Open dashboard view');
    await app.dashboardViewPage.clickOnDashboardView();

    await logStep('Step 03: Click on bookings card > Verify bookings page elements are visible');
    await app.dashboardViewPage.clickOnBookingCard();
    expect(await app.dashboardViewPage.areAllReservationsElementsVisible()).toBe(true);
  });

  test('TC-03 Verify that sapa user navigates to the projects page', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const developerUserId = data.developerUserId;

    await logStep('Step 01: Navigate to partners portal > Login as developer');
    await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortalBeta(developerUserId);
    await app.partnersLoginPage.switchRoleToDeveloper();

    await logStep('Step 02: Open dashboard view');
    await app.dashboardViewPage.clickOnDashboardView();

    await logStep('Step 03: Click on the projects card > Verify all projects are visible');
    await app.dashboardViewPage.clickOnTheProjectsCard();
    expect(await app.dashboardViewPage.areAllProjectsVisible()).toBe(true);
  });

  test('TC-04 Verify that sapa user navigates to all updated bookings page', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const developerUserId = data.developerUserId;

    await logStep('Step 01: Navigate to partners portal > Login as developer');
    await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortalBeta(developerUserId);
    await app.partnersLoginPage.switchRoleToDeveloper();

    await logStep('Step 02: Open dashboard view');
    await app.dashboardViewPage.clickOnDashboardView();

    await logStep('Step 03: Click on updated bookings > Verify all updated bookings are visible');
    await app.dashboardViewPage.clickOnUpdatedBookings();
    expect(await app.dashboardViewPage.areAllUpdatedBookingsVisible()).toBe(true);
  });

  test('TC-05 Verify that sapa user navigates to projects page', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const developerUserId = data.developerUserId;

    await logStep('Step 01: Navigate to partners portal > Login as developer');
    await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortalBeta(developerUserId);
    await app.partnersLoginPage.switchRoleToDeveloper();

    await logStep('Step 02: Open dashboard view');
    await app.dashboardViewPage.clickOnDashboardView();

    await logStep('Step 03: Click on projects card > Verify all projects are visible');
    await app.dashboardViewPage.clickOnProjectsCard();
    expect(await app.dashboardViewPage.areAllProjectsVisible()).toBe(true);
  });

  test('TC-06 Verify that sapa user navigates to payments page', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const developerUserId = data.developerUserId;

    await logStep('Step 01: Navigate to partners portal > Login as developer');
    await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortalBeta(developerUserId);
    await app.partnersLoginPage.switchRoleToDeveloper();

    await logStep('Step 02: Open dashboard view');
    await app.dashboardViewPage.clickOnDashboardView();

    await logStep('Step 03: Click on payments card > Verify bookings payments are visible');
    await app.dashboardViewPage.clickOnPayCard();
    expect(await app.dashboardViewPage.areAllBookingsPaymentVisible()).toBe(true);
  });
});
