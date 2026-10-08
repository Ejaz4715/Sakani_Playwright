import {expect, test} from "@playwright/test";
import {WebApp} from "@base-class/web-app";
import {DataHelper} from "@helpers/DataHelper";
import {logStep} from "@helpers/LogSteps";

const fs = require("fs");
const path = require("path");
const SERVICE = "stamp-management";

const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;
const stampImagePath = path.join(process.cwd(), "src", "data", "stamp.png");
test.describe("Stamp Management", () => {

    test("TC-01 View the last stamp ", {
        annotation: [{
            product: 'Marketplace', type: 'critical'
        }] as any
    }, async ({page}) => {
        const data = readServiceData();
        const environments = readEnvironments();
        const app = new WebApp(page);
        const developerUserId = data.developerUserId;

        await logStep("Step 01: Navigate to partners portal > Login as developer");
        await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();

        await logStep("Step 02: Open stamp management");
        await app.stampManagementPage.clickOnStampManagement();

        await logStep("Step 03: View the last stamp > Verify the stamp image is visible");
        await app.stampManagementPage.clickOnViewLastStamp();
        expect(await app.stampManagementPage.isLastStampImageVisible()).toBe(true);
    });

    test("TC-02 Add a new stamp", {
        annotation: [{
            product: 'Marketplace', type: 'critical'
        }] as any
    }, async ({page}) => {
        const data = readServiceData();
        const environments = readEnvironments();
        const app = new WebApp(page);
        const developerUserId = data.developerUserId;

        await logStep("Step 01: Navigate to partners portal > Login as developer");
        await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();

        await logStep("Step 02: Open stamp management > Click update");
        await app.stampManagementPage.clickOnStampManagement();
        await app.stampManagementPage.clickOnStampUpdateButton();

        await logStep("Step 03: Upload the new stamp image");
        await app.stampManagementPage.uploadNewStampImage(stampImagePath);

        await logStep("Step 04: Add the new stamp > Verify OTP");
        await app.stampManagementPage.clickOnAddNewStamp();
        await app.stampManagementPage.fillTheOtp();
        await app.stampManagementPage.clickOnVerify();

        await logStep("Step 05: Update the update the stamp image");
        await app.stampManagementPage.clickOnStampUpdateButton();

        await logStep("Step 05: Verify the new stamp is added successfully");
        expect(await app.stampManagementPage.isTheNewStampAddedSuccessfully()).toBe(true);
    });




});
