import { test, expect } from '@playwright/test';
import { WebApp } from '@base-class/web-app';
import { logStep } from '@helpers/LogSteps';
import { DataHelper } from '@helpers/DataHelper';
import { AssetAndServiceProvidersObjects } from '@objects/AssetAndServiceProvidersObjects';

const readEnvironments = () => DataHelper.readData().environments;

test.describe('Asset and service providers', () => {
  test('TC-01 Verify user navigate to asset facility page', { annotation: [{ product: 'Market Service', type: 'non-critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environments = readEnvironments();
    const app = new WebApp(page);
    const userPortalUrl = environments.userPortalUrl;

    await logStep('Step 01: Navigate to user portal > Navigate to asset and service providers');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.buyDesignPage.clickOnServicesButton();
    await app.commonMethods.clickElement(AssetAndServiceProvidersObjects.assetsAndFacilitiesButton);

    await logStep('Step 02: Verify the assets and facilites page is present');
    await app.commonMethods.verifyElementVisible(AssetAndServiceProvidersObjects.assetAndFacilitesPage);
  });

  test('TC-02 Verify the user view the service provider - Munjz', { annotation: [{ product: 'Market Service', type: 'non-critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environments = readEnvironments();
    const app = new WebApp(page);
    const userPortalUrl = environments.userPortalUrl;

    await logStep('Step 01: Navigate to user portal > Navigate to asset and service providers');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.buyDesignPage.clickOnServicesButton();
    await app.commonMethods.clickElement(AssetAndServiceProvidersObjects.assetsAndFacilitiesButton);

    await logStep('Step 02: Navigate to Munjz provider > Verify the Munjz provider page is present');
    const popupPromise = page.waitForEvent('popup');
    await app.commonMethods.clickElement(AssetAndServiceProvidersObjects.startTheServiceMunjzButton);
    const providerPage = await popupPromise;
    await providerPage.waitForLoadState('domcontentloaded');
    await expect(providerPage.locator(AssetAndServiceProvidersObjects.munjzPage.xpath)).toBeVisible();
  });

  test('TC-03 Verify the user navigate to assets page', { annotation: [{ product: 'Market Service', type: 'non-critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environments = readEnvironments();
    const app = new WebApp(page);
    const userPortalUrl = environments.userPortalUrl;

    await logStep('Step 01: Navigate to user portal > Navigate to asset and service providers');
    await app.loginPage.gotoHomePage(userPortalUrl);
    await app.loginPage.acceptCookies();
    await app.buyDesignPage.clickOnServicesButton();
    await app.commonMethods.clickElement(AssetAndServiceProvidersObjects.assetsAndFacilitiesButton);

    await logStep('Step 02: Navigate to assets > Verify the assets page is present');
    const popupPromise = page.waitForEvent('popup');
    await app.commonMethods.clickElement(AssetAndServiceProvidersObjects.startTheServiceAssetsButton);
    const providerPage = await popupPromise;
    await providerPage.waitForLoadState('domcontentloaded');
    await expect(providerPage.locator(AssetAndServiceProvidersObjects.AssetsPage.xpath)).toBeVisible();
  });
});
