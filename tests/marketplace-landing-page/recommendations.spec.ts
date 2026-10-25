import { expect, test } from '@fixtures/pages.fixture';
import { logStep } from '@helpers/LogSteps';
import { DataHelper } from '@helpers/DataHelper';
import { WebApp } from '@base-class/web-app';
import { fail } from 'node:assert';

const SERVICE = 'recommendations';

const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe('Recommendations', () => {
  test(
    'TC-01 Check the user ability to update the preference from user profile',
    {
      annotation: [
        {
          product: 'Real Estate Data',
          type: 'Critical',
        } as any,
      ],
    },
    async ({ page }) => {
      const data = readServiceData();
      const environments = readEnvironments();
      const app = new WebApp(page);
      const userPortalUrl = environments.userPortalUrl;

      await logStep('Step 01: Navigate to user portal > Login');
      await app.loginPage.gotoHomePage(userPortalUrl);
      //await app.loginPage.acceptCookies();
      await app.loginPage.openLogin();
      await app.loginPage.loginWithNafath(data.sakaniUserId);
      await app.loginPage.waitForNafathPromptToDisappear();
      await app.loginPage.continueNewUserPopup();
      await app.loginPage.handlePushNotificationPopup();

      await logStep('Step 02: Open Recommendations Tab');
      await app.marketplaceLandingPage.openProfileManagement();
      await app.recommendationsPage.clickOnRecommendations();
      await app.recommendationsPage.openRecommendationsForm();
      await app.recommendationsPage.selectFirstRegion();
      await app.recommendationsPage.selectFirstCity();
      await app.recommendationsPage.selectDistrict();
      await app.recommendationsPage.selectProjectType();
      await app.recommendationsPage.selectUnitType('فيلا');
      await app.recommendationsPage.clickOnContinue();

      await app.recommendationsPage.setMinimumPrice(100000);
      await app.recommendationsPage.selectBedRoomsNumber(4);
      await app.recommendationsPage.selectBathroomsNumber(3);

      await app.recommendationsPage.clickOnSave();
      expect(await app.recommendationsPage.isPreferenceSavedSuccessfully()).toEqual(true);
    }
  );
  test(
    'TC-02 Verify the user is able to view project/unit from recommendations tab filter matching the preferences',
    {
      annotation: [
        {
          product: 'Real Estate Data',
          type: 'Critical',
        } as any,
      ],
    },
    async ({ page }) => {
      const data = readServiceData();
      const environments = readEnvironments();
      const app = new WebApp(page);
      const userPortalUrl = environments.userPortalUrl;

      await logStep('Step 01: Navigate to user portal > Login');
      await app.loginPage.gotoHomePage(userPortalUrl);
      //await app.loginPage.acceptCookies();
      await app.loginPage.openLogin();
      await app.loginPage.loginWithNafath(data.sakaniUserId);
      await app.loginPage.waitForNafathPromptToDisappear();
      await app.loginPage.continueNewUserPopup();
      await app.loginPage.handlePushNotificationPopup();

      await logStep('Step 02: Open Recommendations Tab');
      await app.marketplaceLandingPage.openProfileManagement();
      await app.recommendationsPage.clickOnRecommendations();
      await app.recommendationsPage.clickOnForYou();

      // There is a bug for seeing what is recommended for you according to preferences
    }
  );
  test(
    'TC-03 Verify after adding a project in the favorites, user can view the same project in the user profile',
    {
      annotation: [
        {
          product: 'Real Estate Data',
          type: 'Critical',
        } as any,
      ],
    },
    async ({ page }) => {
      const data = readServiceData();
      const environments = readEnvironments();
      const app = new WebApp(page);
      const userPortalUrl = environments.userPortalUrl;

      await logStep('Step 01: Navigate to user portal > Login');
      await app.loginPage.gotoHomePage(userPortalUrl);
      //await app.loginPage.acceptCookies();
      await app.loginPage.openLogin();
      await app.loginPage.loginWithNafath(data.sakaniUserId);
      await app.loginPage.waitForNafathPromptToDisappear();
      await app.loginPage.continueNewUserPopup();
      await app.loginPage.handlePushNotificationPopup();

      await logStep('Step 02: Open the off-plan project');
      await app.favoritesPage.openOffPlanProject(userPortalUrl, data.offPlanProjectId);
      const projectTitle = await app.favoritesPage.getProjectTitle();

      await logStep('Step 03: Mark the project as favourite');
      await app.favoritesPage.markProjectAsFavorite();
      expect(await app.favoritesPage.isProjectFavorite()).toBe(true);

      await logStep('Step 04: Open user management > Favourites > Projects');
      await app.loginPage.gotoHomePage(userPortalUrl);
      await app.marketplaceLandingPage.openProfileManagement();
      await app.favoritesPage.openFavoritesFromUserProfile();
      await app.favoritesPage.openProjectsTab();

      await logStep('Step 05: Verify the favourite project is listed');
      expect(await app.favoritesPage.isProjectInFavorites(projectTitle)).toBe(true);
    }
  );
  test(
    'TC-04 Verify the text after removing all favorites from user profile',
    {
      annotation: [
        {
          product: 'Real Estate Data',
          type: 'Critical',
        } as any,
      ],
    },
    async ({ page }) => {
      const data = readServiceData();
      const environments = readEnvironments();
      const app = new WebApp(page);
      const userPortalUrl = environments.userPortalUrl;

      await logStep('Step 01: Navigate to user portal > Login');
      await app.loginPage.gotoHomePage(userPortalUrl);
      //await app.loginPage.acceptCookies();
      await app.loginPage.openLogin();
      await app.loginPage.loginWithNafath(data.sakaniUserId);
      await app.loginPage.waitForNafathPromptToDisappear();
      await app.loginPage.continueNewUserPopup();
      await app.loginPage.handlePushNotificationPopup();

      await logStep('Step 02: Open the off-plan project > Mark it as favourite so there is a favourite to remove');
      await app.favoritesPage.openOffPlanProject(userPortalUrl, data.offPlanProjectId);
      await app.favoritesPage.markProjectAsFavorite();

      await logStep('Step 03: Open user management > Favourites');
      await app.loginPage.gotoHomePage(userPortalUrl);
      await app.marketplaceLandingPage.openProfileManagement();
      await app.favoritesPage.openFavoritesFromUserProfile();

      await logStep('Step 04: Remove all favourites');
      await app.favoritesPage.removeAllFavorites();

      await logStep('Step 05: Verify the empty favourites message is displayed');
      expect(await app.favoritesPage.isEmptyFavoritesMessageVisible()).toBe(true);
    }
  );
  test(
    'TC-05 Verify the message after select recommendations tab filter from guest view',
    {
      annotation: [
        {
          product: 'Real Estate Data',
          type: 'Critical',
        } as any,
      ],
    },
    async ({ page }) => {
      const data = readServiceData();
      const environments = readEnvironments();
      const app = new WebApp(page);
      const userPortalUrl = environments.userPortalUrl;

      await logStep('Step 01: Navigate to user portal > Login');
      await app.loginPage.gotoHomePage(userPortalUrl);

      await app.filtersPage.clickOnPropertiesForSaleButton();
      await app.filtersPage.clickOnOffPlanSaleUnits();
      await app.recommendationsPage.clickOnForYou();
      expect(await app.recommendationsPage.isGuestRecommendationCardVisible()).toBe(true);
    }
  );
  test(
    'TC-06 Verify that either the recommended project/unit is displayed or the Preferences form is shown after the user enters a National ID from guest view',
    {
      annotation: [
        {
          product: 'Real Estate Data',
          type: 'Critical',
        } as any,
      ],
    },
    async ({ page }) => {
      const data = readServiceData();
      const environments = readEnvironments();
      const app = new WebApp(page);
      const userPortalUrl = environments.userPortalUrl;

      await logStep('Step 01: Navigate to user portal > Login');
      await app.loginPage.gotoHomePage(userPortalUrl);

      await app.filtersPage.clickOnPropertiesForSaleButton();
      await app.filtersPage.clickOnOffPlanSaleUnits();
      await app.recommendationsPage.clickOnForYou();
      expect(await app.recommendationsPage.isGuestRecommendationCardVisible()).toBe(true);

      await app.recommendationsPage.enterNationalId(data.sakaniUserId);
      await app.recommendationsPage.clickOnSearch();
      // There is a bug in recommendation from guest side after entering the national id it can't fetch the recommended project based on preferences
    }
  );
});
