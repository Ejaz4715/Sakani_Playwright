import { expect, Locator, Page, test } from '@playwright/test';
import { WebApp } from '@base-class/web-app';
import { DataHelper } from '@helpers/DataHelper';
import { logStep } from '@helpers/LogSteps';
const SERVICE = 'sales-channels-target-audience-unit-issuance';

const DEFAULT_TIMEOUT = 30_000;
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

const unitCheckbox = (page: Page, row: number) => page.locator(`//datatable-row-wrapper[${row}]/datatable-body-row/div[3]/datatable-body-cell/div/div/app-sapa-checkbox-v2/div/div/input/..`);

async function waitAndClick(locator: Locator, timeout = DEFAULT_TIMEOUT) {
  await locator.waitFor({ state: 'visible', timeout });
  await locator.click();
}

test.describe('Functionality of sales Channels, target Audience and tnit issuance ', () => {
  test(
    'TC-01 Verify the developer is able filter the units based on sales channel and target audience',
    { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any },
    async ({ page }) => {
      const data = readServiceData();
      const environments = readEnvironments();
      const app = new WebApp(page);
      const developerUserId = data.developerUserId;

      await logStep('Step 01: Navigate to partners portal > Login as developer');
      await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
      await app.partnersLoginPage.loginToSapaPortalBeta(developerUserId);
      await app.partnersLoginPage.switchRoleToDeveloper();

      await logStep('Step 02: Open projects > Open the first project > Unit details > Advanced search');
      await app.developerProjectPage.openProjectsPage();
      await app.developerProjectPage.openTheFirstExistingProject();
      await app.salesChannelTargetAudiencePage.clickOnUnitDetails();
      await app.salesChannelTargetAudiencePage.clickOnAdvancedSearch();

      await logStep('Step 03: Select all sales channels');
      await app.salesChannelTargetAudiencePage.selectMobileSalesChannel();
      await app.salesChannelTargetAudiencePage.selectOpsTeamSalesChannel();
      await app.salesChannelTargetAudiencePage.selectPartnerSalesChannel();
      await app.salesChannelTargetAudiencePage.selectThirdPartySalesChannel();
      await app.salesChannelTargetAudiencePage.selectWebSalesChannel();

      await logStep('Step 04: Select all target audiences');
      await app.salesChannelTargetAudiencePage.selectBeneficiaryTargetAudience();
      await app.salesChannelTargetAudiencePage.selectCharityTargetAudience();
      await app.salesChannelTargetAudiencePage.selectCompanyTargetAudience();
      await app.salesChannelTargetAudiencePage.selectNonBeneficiaryTargetAudience();
      await app.salesChannelTargetAudiencePage.selectTanmwiTargetAudience();

      await logStep('Step 05: Search > Verify the search results table is visible');
      await app.salesChannelTargetAudiencePage.clickOnSearch();
      expect(await app.salesChannelTargetAudiencePage.isSearchResultsTableVisible()).toBe(true);
    }
  );

  test("TC-02 Verify the developer can't book a unit which does not have partners as a sales channel", { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const developerUserId = data.developerUserId;
    const unitWithoutSalesChannels = data.unitWithoutSalesChannels;
    const userId = data.userId;

    await logStep('Step 01: Navigate to partners portal > Login as developer');
    await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
    await app.partnersLoginPage.loginToSapaPortalBeta(developerUserId);
    await app.partnersLoginPage.switchRoleToDeveloper();

    await logStep('Step 02: Open projects > Open the first project > Unit details');
    await app.developerProjectPage.openProjectsPage();
    await app.developerProjectPage.openTheFirstExistingProject();
    await app.salesChannelTargetAudiencePage.clickOnUnitDetails();

    await logStep('Step 03: Search by the unit code without partners sales channel > Verify no results are shown');
    await app.salesChannelTargetAudiencePage.selectSearchUsingUnitCode();
    await app.salesChannelTargetAudiencePage.fillUnitCode(unitWithoutSalesChannels);
    await app.salesChannelTargetAudiencePage.clickOnSearch();

    expect(await app.salesChannelTargetAudiencePage.isSearchResultEmpty()).toBe(true);

    await logStep('Step 04: Start new booking for the customer using the unit code > Select the unit');
    await app.developerProjectPage.bookUnitsForCustomersUsingUnitCode(userId, unitWithoutSalesChannels);
    await waitAndClick(unitCheckbox(page, 1));

    await logStep('Step 05: Click next > Verify the unit is not available for booking');
    await app.developerProjectPage.clickOnNextButton();
    expect(await app.salesChannelTargetAudiencePage.isBookingNotAvailable()).toBe(true);
  });
});
