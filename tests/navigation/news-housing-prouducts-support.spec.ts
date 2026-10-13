import { test, expect } from '@fixtures/pages.fixture';
import { logStep } from '@helpers/LogSteps';
import {WebApp} from "@base-class/web-app";
import {DataHelper} from "@helpers/DataHelper";

const SERVICE = "news-housing-products-support";

const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe('News, Housing Support Products and Housing Support List ', () => {

  test("TC-01 Verify navigating to news in Sakani", {
    annotation: [{
      product: 'Marketplace',
      type: 'Non-Critical',
    }] as any
  }, async ({page}) => {
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const sakaniUserId = data.sakaniUserId;
    const userPortalUrl = environments.userPortalUrl;

    await logStep("Step 01: Navigate to user portal > Login");
    await app.loginPage.gotoHomePage(userPortalUrl);
    //await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await app.marketplaceLandingPage.clickOnNews();
    await expect(page).toHaveURL(/news$/);

  });

  test("TC-02 Verify navigating to Housing support products in Sakani", {
    annotation: [{
      product: 'Marketplace',
      type: 'Non-Critical',
    }] as any
  }, async ({page}) => {
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const sakaniUserId = data.sakaniUserId;
    const userPortalUrl = environments.userPortalUrl;

    await logStep("Step 01: Navigate to user portal > Login");
    await app.loginPage.gotoHomePage(userPortalUrl);
    //await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await app.marketplaceLandingPage.clickOnServices();
    await app.marketplaceLandingPage.clickOnEligibilityCheckerLink();
    await expect(page).toHaveURL(/check-eligibility$/);

    await app.marketplaceLandingPage.clickOnServices();
    await app.marketplaceLandingPage.clickOnRealStateTaxExemptionLink();
    await expect(page).toHaveURL(/real-estate-tax-incurred-service$/);

    await app.marketplaceLandingPage.clickOnServices();
    await app.marketplaceLandingPage.clickOnFinancialAdvisoryLink();
    await expect(page).toHaveURL(/financial-advisory$/);
  });

  test("TC-03 Verify navigating to all services and products in Sakani", {
    annotation: [{
      product: 'Marketplace',
      type: 'Non-Critical',
    }] as any
  }, async ({page}) => {
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const sakaniUserId = data.sakaniUserId;
    const userPortalUrl = environments.userPortalUrl;

    await logStep("Step 01: Navigate to user portal > Login");
    await app.loginPage.gotoHomePage(userPortalUrl);
    //await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await app.marketplaceLandingPage.clickOnServices();
    await app.marketplaceLandingPage.clickOnAllServices();

    await app.marketplaceLandingPage.clickOnOffPlanProjectsProductLink();
    await expect(page).toHaveURL(/off-plan-projects$/);
    expect(await app.marketplaceLandingPage.isOffPlanProductPageVisible()).toBe(true);


    await app.marketplaceLandingPage.clickOnServices();
    await app.marketplaceLandingPage.clickOnAllServices();

    await app.marketplaceLandingPage.clickOnReadyUnitsProductLink();
    await expect(page).toHaveURL(/ready-units$/);
    expect(await app.marketplaceLandingPage.isReadyUnitsProductPageVisible()).toBe(true);

    await app.marketplaceLandingPage.clickOnServices();
    await app.marketplaceLandingPage.clickOnAllServices();

    await app.marketplaceLandingPage.clickOnLandsProductLink();
    await expect(page).toHaveURL(/lands$/);
    expect(await app.marketplaceLandingPage.isLandsProductPageVisible()).toBe(true);

  });

  test("TC-04 Verify navigating to housing support list in Sakani", {
    annotation: [{
      product: 'Marketplace',
      type: 'Non-Critical',
    }] as any
  }, async ({page, context}) => {
    const data = readServiceData();
    const environments = readEnvironments();
    const app = new WebApp(page);
    const sakaniUserId = data.sakaniUserId;
    const userPortalUrl = environments.userPortalUrl;

    await logStep("Step 01: Navigate to user portal > Login");
    await app.loginPage.gotoHomePage(userPortalUrl);
    //await app.loginPage.acceptCookies();
    await app.loginPage.openLogin();
    await app.loginPage.loginWithNafath(sakaniUserId);
    await app.loginPage.waitForNafathPromptToDisappear();
    await app.loginPage.continueNewUserPopup();
    await app.loginPage.handlePushNotificationPopup();

    await app.marketplaceLandingPage.clickOnTermsAndConditionsLink();
    await expect(page).toHaveURL(/terms$/);

    await app.marketplaceLandingPage.clickOnSupportAndHelpLink();
    await expect(context.pages()[1]).toHaveURL(/support-and-help$/);


    await app.marketplaceLandingPage.clickOnSupportAndHelpFAQLink();
    await expect(context.pages()[2]).toHaveURL(/support-and-help\/faqs$/);


    await app.marketplaceLandingPage.clickOnExecutiveRegulationLink();
    await expect(context.pages()[3]).toHaveURL(/housing-subsidy-policy$/);
  });

});

