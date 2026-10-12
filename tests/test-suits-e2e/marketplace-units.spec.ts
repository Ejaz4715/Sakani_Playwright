import { test, expect, Page } from "@playwright/test";
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
import { WebApp } from "@base-class/web-app";
import { logStep } from '@helpers/LogSteps'
import { DateUtils } from "@pages/utils/DateUtils";
import { DataHelper } from "@helpers/DataHelper";

import { BookingCancellationObjects } from "@objects/BookingCancellationObjects";


const readEnvironments = () => DataHelper.readData().environments;


test.describe("Marketplace Units", () => {
    test("TC-01 Verify user filter for a unit", { annotation: [{ product: "Marketplace", type: "critical" }] as any }, async ({ page }) => {
        test.setTimeout(0);
        //read data from json relative to the service
        const environment = readEnvironments();
        const app = new WebApp(page);

        const userPortalUrl = environment.userPortalUrl;

        await logStep("Step 01: Navigate to user portal > Login");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();
        await app.filtersPage.clickOnPropertiesForSaleButton();
        await app.filtersPage.clickOnOffPlanSaleUnits();
        await logStep("Step 02: Filter for unit > Verify the unit is present");
        await app.bookingPage.selectConstructionStatus();
        await app.bookingPage.clickOnSaveButton();
        await app.bookingPage.selectPropertyType();
        await app.bookingPage.clickOnSaveButton();
        await app.bookingPage.clickUnitResultCard();
        const page1Promise = page.waitForEvent("popup");
        await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.unitResultDetailsPage, true);

    });

    test("TC-02 Verify user filter by register of interest", { annotation: [{ product: "Marketplace", type: "critical" }] as any }, async ({ page }) => {
        test.setTimeout(0);
        //read data from json relative to the service
        const environment = readEnvironments();
        const app = new WebApp(page);

        const userPortalUrl = environment.userPortalUrl;

        await logStep("Step 01: Navigate to user portal > Login");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();
        await app.filtersPage.clickOnPropertiesForSaleButton();
        await app.filtersPage.clickOnOffPlanSaleUnits();
        await logStep("Step 02: Filter by register of interest > Verify the unit is present");
        await app.bookingPage.clickOnRegisterOfInterest();
        await app.bookingPage.verifyElementVisibility(BookingCancellationObjects.unitResultCard, true);
    });
});