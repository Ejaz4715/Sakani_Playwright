import { test } from '@playwright/test';
import { WebApp } from '@base-class/web-app';
import { logStep } from '@helpers/LogSteps';
import { DataHelper } from '@helpers/DataHelper';

const SERVICE = 'verifying-eligibility-for-developmental-housing';
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe('Verifying eligibility for developmental housing', () => {
  test('TC-01 - Developer verifying the eleigiblity of user for developmental housing', { annotation: [{ product: 'Digitar Developer', type: 'critical' }] as any }, async ({ page }) => {
    test.setTimeout(0);
    await logStep('Step 00: Read data from json relative to the service');
    const environment = readEnvironments();
    const data = readServiceData();
    const app = new WebApp(page);
    const sapaUrl = environment.sapaPortalUrl;
    const developerUserId = data.developerUserId;
    const userId = data.sakaniUserId;

    await logStep('Step 01: Navigate to partners portal > Login');
    await app.developerProjectPage.gotoAuth(sapaUrl);
    await app.developerProjectPage.loginDeveloper(developerUserId);
    await app.developerProjectPage.switchRoleToDeveloper();

    await logStep('Step 02: Navigate to check eligiblity fo developmental housing');
    await app.verifyingEligibilityForDevelopmentalHousingPage.clickDevelopmentalHousingEligibilityLink();

    await logStep('Step 03: Enter wrong national id number - non saudi > Verify the message');
    await app.verifyingEligibilityForDevelopmentalHousingPage.fillNationalIdInputfield(2020201001);
    await app.verifyingEligibilityForDevelopmentalHousingPage.clickCheckStatusButton();
    await app.verifyingEligibilityForDevelopmentalHousingPage.verifyWrongNationalIdMessageIsVisible();

    await logStep('Step 04: Enter wrong national id number - text > Verify the message');
    await app.verifyingEligibilityForDevelopmentalHousingPage.fillNationalIdInputfield('testid');
    await app.verifyingEligibilityForDevelopmentalHousingPage.clickCheckStatusButton();
    await app.verifyingEligibilityForDevelopmentalHousingPage.verifyWrongIdMessageIsVisible();

    await logStep('Step 05: Enter national id number > Verify the user eligible or not');
    await app.verifyingEligibilityForDevelopmentalHousingPage.fillNationalIdInputfield(userId);
  });
});
