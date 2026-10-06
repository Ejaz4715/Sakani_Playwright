import { test, expect, Page } from "@playwright/test";
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
import { WebApp } from "@base-class/web-app";
import { logStep } from '@helpers/LogSteps'
import { DateUtils } from "@pages/utils/DateUtils";
import { DataHelper } from "@helpers/DataHelper";
import testDataFilters from "@data/test-data.json";
import { FiltersObjects } from "@objects/FiltersObjects";


test.describe("Filters", () => {
    test("TC-01 - Validate the minimum and maximum prices fields messages", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        // const testData = readTestData();
        // const reissueData = testData.services["reissue-price-quotation"];;
        const environments = testDataFilters.environments;
        const app = new WebApp(page);
        const userPortalUrl = environments.userPortalUrl;

        await logStep("Step 01: Navigate to user portal > Navigate to filter");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();
        await app.filtersPage.clickOnPropertiesForSaleButton();
        await app.filtersPage.clickOnOffPlanSaleUnits();
        await app.filtersPage.clickOnFilterResultButton();
        await logStep("Step 02: Clear the minimum price then validate the message > Enter value more the minimum then validate");
        await app.filtersPage.clearInputField(FiltersObjects.minimumPriceInputfield);
        await app.filtersPage.validateElementExists(FiltersObjects.minimumPriceRequiredMessage);
        await app.filtersPage.fillInputField(FiltersObjects.minimumPriceInputfield, "11111111111111111111111111111");
        await app.filtersPage.validateElementExists(FiltersObjects.minimumPriceMoreMessage);
        await logStep("Step 03: Clear the maximum price then validate the message > Enter value more the maximum then validate");
        await app.filtersPage.clearInputField(FiltersObjects.maximumPriceInputfield);
        await app.filtersPage.validateElementExists(FiltersObjects.maximumPriceRequiredMessage);
        await app.filtersPage.fillInputField(FiltersObjects.maximumPriceInputfield, "999999999999999999999999999999999999999999999999999");
        await app.filtersPage.validateElementExists(FiltersObjects.maximumPriceMoreMessage);
    });

    test("TC-02 - Validate the minimum and maximum areas fields messages", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        // const testData = readTestData();
        // const reissueData = testData.services["reissue-price-quotation"];;
        const environments = testDataFilters.environments;
        const app = new WebApp(page);
        const userPortalUrl = environments.userPortalUrl;

        await logStep("Step 01: Navigate to user portal > Navigate to filter");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();
        await app.filtersPage.clickOnPropertiesForSaleButton();
        await app.filtersPage.clickOnOffPlanSaleUnits();
        await app.filtersPage.clickOnFilterResultButton();
        await logStep("Step 02: Clear the minimum area then validate the message > Enter value more the minimum then validate");
        await app.filtersPage.clearInputField(FiltersObjects.minimumAreaInputfield);
        await app.filtersPage.validateElementExists(FiltersObjects.minimumAreaRequiredMessage);
        await app.filtersPage.fillInputField(FiltersObjects.minimumAreaInputfield, "11111111111111111111111111111");
        await app.filtersPage.validateElementExists(FiltersObjects.minimumAreaMoreMessage);
        await logStep("Step 03: Clear the maximum area then validate the message > Enter value more the maximum then validate");
        await app.filtersPage.clearInputField(FiltersObjects.maximumAreaInputfield);
        await app.filtersPage.validateElementExists(FiltersObjects.maximumAreaRequiredMessage);
        await app.filtersPage.fillInputField(FiltersObjects.maximumAreaInputfield, "999999999999999999999999999999999999999999999999999");
        await app.filtersPage.validateElementExists(FiltersObjects.maximumAreaMoreMessage);
    });

     test("TC-03 - Verify that user able to select by eligibilty type", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        // const testData = readTestData();
        // const reissueData = testData.services["reissue-price-quotation"];;
        const environments = testDataFilters.environments;
        const app = new WebApp(page);
        const userPortalUrl = environments.userPortalUrl;

        await logStep("Step 01: Navigate to user portal > Navigate to filter");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();
        await app.filtersPage.clickOnPropertiesForSaleButton();
        await app.filtersPage.clickOnOffPlanSaleUnits();
        await app.filtersPage.clickOnFilterResultButton();
        await app.filtersPage.clickOnClearFiltersButton();
        await logStep("Step 02: Click on eligibilty type radio buttons >Verify they are selected");
        await app.filtersPage.clickElement(FiltersObjects.allBeneficiaryRadio);
        await app.filtersPage.verifyElementValueAttribute(FiltersObjects.allBeneficiaryValue, "true");
        await app.filtersPage.clickElement(FiltersObjects.beneficiaryRadio);
        await app.filtersPage.verifyElementValueAttribute(FiltersObjects.beneficiaryValue, "true");
        await app.filtersPage.clickElement(FiltersObjects.nonBeneficiaryRadio);
        await app.filtersPage.verifyElementValueAttribute(FiltersObjects.nonBeneficiaryValue, "true");
    });

     test("TC-04 - Verify that user able to select by construction status", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        // const testData = readTestData();
        // const reissueData = testData.services["reissue-price-quotation"];;
        const environments = testDataFilters.environments;
        const app = new WebApp(page);
        const userPortalUrl = environments.userPortalUrl;

        await logStep("Step 01: Navigate to user portal > Navigate to filter");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();
        await app.filtersPage.clickOnPropertiesForSaleButton();
        await app.filtersPage.clickOnOffPlanSaleUnits();
        await app.filtersPage.clickOnFilterResultButton();
        await app.filtersPage.clickOnClearFiltersButton();
        await logStep("Step 02: Click on eligibilty type radio buttons >Verify they are selected");
        await app.filtersPage.clickElement(FiltersObjects.underConstructionRadio);
        await app.filtersPage.verifyElementValueAttribute(FiltersObjects.underConstructionValue, "true");
        await app.filtersPage.clickElement(FiltersObjects.readyUnitsRadio);
        await app.filtersPage.verifyElementValueAttribute(FiltersObjects.readyUnitsValue, "true");
        await app.filtersPage.clickElement(FiltersObjects.landRadio);
        await app.filtersPage.verifyElementValueAttribute(FiltersObjects.landValue, "true");
    });

         test("TC-05 - Verify that user able to select by project status", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        // const testData = readTestData();
        // const reissueData = testData.services["reissue-price-quotation"];;
        const environments = testDataFilters.environments;
        const app = new WebApp(page);
        const userPortalUrl = environments.userPortalUrl;

        await logStep("Step 01: Navigate to user portal > Navigate to filter");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();
        await app.filtersPage.clickOnPropertiesForSaleButton();
        await app.filtersPage.clickOnOffPlanSaleUnits();
        await app.filtersPage.clickOnFilterResultButton();
        await app.filtersPage.clickOnClearFiltersButton();
        await logStep("Step 02: Click on eligibilty type radio buttons >Verify they are selected");
        await app.filtersPage.clickElement(FiltersObjects.availableForBookingCheckbox);
        await app.filtersPage.verifyElementValueAttribute(FiltersObjects.availableForBookingValue, "true");
        await app.filtersPage.clickElement(FiltersObjects.availableSoonCheckbox);
        await app.filtersPage.verifyElementValueAttribute(FiltersObjects.availableSoonValue, "true");
        await app.filtersPage.clickElement(FiltersObjects.lastUnitsRemainingCheckbox);
        await app.filtersPage.verifyElementValueAttribute(FiltersObjects.lastUnitsRemainingValue, "true");
    });



    
});