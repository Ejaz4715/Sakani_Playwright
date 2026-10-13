import { test, expect } from '@playwright/test';
const path = require("path");
import { WebApp } from "@base-class/web-app";
import { DataHelper } from '@helpers/DataHelper'
import { logStep } from '@helpers/LogSteps'
import { ExcelUtils } from '@pages/utils/ExcelUtils';

const SERVICE = "developer-unit-reservation";

const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;


test.describe("Update unit price from partners", () => {
    test("TC-03 - Developer | Books multiple units", {annotation: [{product: 'Marketplace', type: 'critical'}] as any}, async ({ page }) => {
        const data = readServiceData();
        const environments = readEnvironments();
        const app = new WebApp(page);
        const projectName = data.projectName;
        const nationalId = data.sakaniUserId;
        const unitCode = data.unitCode;

        const developerUserId = data.developerUserId;

        await logStep("Step 01: Navigate to partners portal > Login as developer");
        await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();

        await logStep("Step 02: Start new individual booking > Enter user id");
        await app.developerProjectPage.bookUnitsForCustomersUsingUnitCode(nationalId, projectName);
        await page.waitForTimeout(10000);

        await logStep("Step 03: Select unit");
        await app.developerProjectPage.selectUnitCheckbox(1);

        await logStep("Step 04: Confirm the booking > Verify booking list is visible");
        await app.developerProjectPage.clickOnNextButton();
        await app.developerProjectPage.clickOnConfirmationButton();

        expect(await app.developerProjectPage.isBookingListButtonVisible()).toBe(true);
    });

    test("TC-02 Verify the price of the unit has been updated", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        //read data from json relative to the service
        const environment = readEnvironments();
        const data = readServiceData();
        const app = new WebApp(page);
        const projectName = data.projectName;
        const developerUserId = data.developerUserId;
        const sapaPortalUrl = environment.sapaPortalUrl;
        const updatedPrice = data.updatedPrice;
        const unitCode = data.unitCodeUpdatePrice;

        await logStep("Step 01: Login as developer to sapa portal and open the project");
        await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
        await app.partnersLoginPage.loginToSapaPortal(developerUserId);
        await app.partnersLoginPage.switchRoleToDeveloper();

        await logStep("Step 02: Search for project > Navigate to project units");
        await app.developerProjectPage.openProjectBySearch(projectName);
        await app.updateUnitsPage.clickUnitDetailsTab();

        await logStep('Step 03: Search unit with unit code > Navigate to the details of searched unit');
        await app.updateUnitsPage.selectUnitCodeSearchCriteria();
        await app.updateUnitsPage.fillUnitCode(unitCode);
        await app.updateUnitsPage.clickSearchUnitButton();
        await app.updateUnitsPage.navigateToSearchedUnit();

        await logStep('Step 04: Validate the prices are updated');
        await app.updateUnitsPage.verifyUnitPricesAreUpdated(updatedPrice);
    });
});