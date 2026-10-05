import { test } from "@playwright/test";
import { WebApp } from "@base-class/web-app";
import { logStep } from '@helpers/LogSteps';
import testDataReportTheUnit from "@data/test-data.json";

test.describe("Report The Unit", () => {
  test("TC-01 - User report the unit", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    const data = testDataReportTheUnit.services["report-the-unit"];
    const app = new WebApp(page);

    await logStep("Step 01: Navigate to user portal > Login");
    await app.loginPage.gotoHomePage(testDataReportTheUnit.environments.userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(data.sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await logStep("Step 02: Select rental units > Open a unit");
    await app.reportTheUnitPage.selectRentalProperty();
    const unitPage = await app.reportTheUnitPage.openFirstMarketUnit();

    await logStep("Step 03: Report the unit > Verify report submitted successfully");
    const unitApp = new WebApp(unitPage);
    await unitApp.reportTheUnitPage.clickReportUnitLink();
    await unitApp.reportTheUnitPage.selectReportCategory();
    await unitApp.reportTheUnitPage.selectIncorrectPropertyPriceReason();
    await unitApp.reportTheUnitPage.clickSubmitButton();
    await unitApp.reportTheUnitPage.verifyReportSubmittedSuccessfully();
  });
});
