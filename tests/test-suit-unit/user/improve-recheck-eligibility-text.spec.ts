import { test, expect } from '@playwright/test';
import { WebApp } from '@base-class/web-app';
import { DataHelper } from '@helpers/DataHelper';
import { logStep } from '@helpers/LogSteps';

const SERVICE = 'moh-land-booking-journey';
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe('SAK-1901 - Improve Eligibility Recheck Message for Free Land Booking', () => {
  test(
    'SAK-1901-01 Verify the check eligibility pop up message is updated to - Please recheck your eligibility before proceeding with your booking',
    { annotation: [{ product: 'Rebranding', type: 'non-critical' }] as any },
    async ({ page }) => {
      await logStep('Step 00: Read test data relative to the service');
      const app = new WebApp(page);
      const environment = readEnvironments();
      const data = readServiceData();
      const userId = data.sakaniUserRecheckEligibility;
      const URL = environment.userPortalUrl;

      await logStep('Step 01: Open user portal and log in with Nafath');
      await app.loginPage.gotoHomePage(URL);
      await app.loginPage.acceptCookies();
      await app.loginPage.openLogin();
      await app.loginPage.loginWithNafath(userId);
      await app.loginPage.waitForNafathPromptToDisappear();
      await app.loginPage.continueNewUserPopup();
      await app.loginPage.handlePushNotificationPopup();

      await logStep('Step 02: Search for the project');
      await app.marketplaceLandingPage.openSearch();
      await app.marketplaceLandingPage.searchForProject(data.exisitingProject);
      await app.projectDetailsPage.openUnitsAndScroll();

      await logStep('Step 03: Select land to select');
      await app.projectUnitsPage.selectLand(0);

      await logStep('Step 04: Click reserve button');
      await app.unitDetailsPage.reserveUnit();

      await logStep('Step 05: Validate the recheck eligibility pop up is displayed with a message');
      const popUpHeading = page.locator("//h3[normalize-space() = 'تعذر إتمام عملية الحجز'] | //p[normalize-space() = 'تعذر إتمام عملية الحجز']");
      const popUpMessage = page.locator("//div[contains (text() , 'يرجى إعادة التحقق من أهليتك قبل المتابعة في عملية الحجز')]");
      await expect(popUpHeading, 'User is not navigated to Check Eligibility service page').toBeVisible({ timeout: 20000 });
      await expect(popUpMessage, 'User is not navigated to Check Eligibility service page').toBeVisible({ timeout: 20000 });
    }
  );

  test(
    'SAK-1901-02 Verify when user clicks on "Recheck Eligibility" the system navigate to "Eligibility" check service',
    { annotation: [{ product: 'Rebranding', type: 'non-critical' }] as any },
    async ({ page }) => {
      await logStep('Step 00: Read test data relative to the service');
      const app = new WebApp(page);
      const environment = readEnvironments();
      const data = readServiceData();
      const userId = data.sakaniUserRecheckEligibility;
      const URL = environment.userPortalUrl;

      await logStep('Step 01: Open user portal and log in with Nafath');
      await app.loginPage.gotoHomePage(URL);
      await app.loginPage.acceptCookies();
      await app.loginPage.openLogin();
      await app.loginPage.loginWithNafath(userId);
      await app.loginPage.waitForNafathPromptToDisappear();
      await app.loginPage.continueNewUserPopup();
      await app.loginPage.handlePushNotificationPopup();

      await logStep('Step 02: Search for the project');
      await app.marketplaceLandingPage.openSearch();
      await app.marketplaceLandingPage.searchForProject(data.exisitingProject);
      await app.projectDetailsPage.openUnitsAndScroll();

      await logStep('Step 03: Select land to select');
      await app.projectUnitsPage.selectLand(0);

      await logStep('Step 04: Click reserve button');
      await app.unitDetailsPage.reserveUnit();

      await logStep('Step 05: Click recheck eligibilty button');
      await page.locator("//button[normalize-space() = 'إعادة التحقق من الأهلية']").click();

      await logStep('Step 06: Validate the system navigates the user to check eligibility service page');
      const heading = page.locator("//h2[normalize-space() = 'التحقق من أهلية الاستحقاق السكني']");
      await expect(heading, 'User is not navigated to Check Eligibility service page').toBeVisible({ timeout: 20000 });
    }
  );
});
