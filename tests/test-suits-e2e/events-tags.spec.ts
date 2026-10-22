import { test, expect } from "@playwright/test";
const path = require("path");
import { WebApp } from "@base-class/web-app";
import { logStep } from "@helpers/LogSteps";
import { DataHelper } from "@helpers/DataHelper";
import { EventsTagsObjects } from "@objects/EventsTagsObjects";

const SERVICE = 'events-tags';

const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;
const writeServiceData = (key: string, value: any) => DataHelper.updateServiceData(SERVICE, key, value);

test.describe("Events Tags", () => {
    test("TC-01 Admin add new event tag", { annotation: [{ product: "Loyalty", type: "critical" }] as any }, async ({ page }) => {
        test.setTimeout(0);
        //read data from json relative to the service
        const environment = readEnvironments();
        const data = readServiceData();
        const app = new WebApp(page);
        const adminUsername = data.adminUsername;
        const adminPassword = data.adminPassword;
        const adminPortalUrl = environment.adminPortalUrl;
        const uploadDesign = path.join(process.cwd(), 'src', 'data', 'Sample image 2.png');
        const tagName = `Tag Name ${new Date()
            .toISOString()
            .replace(/[-:T.]/g, '')
            .slice(0, 14)}`;
        writeServiceData('tagName', tagName);

        await logStep("Step 01: Login to admin portal as a super admin");
        await app.adminProjectPage.login(adminPortalUrl, adminUsername, adminPassword);
        await logStep("Step 02: Navigate to events tags");
        await app.commonMethods.clickElement(EventsTagsObjects.neighborGreetingLink);
        await app.commonMethods.clickElement(EventsTagsObjects.eventsTagsLink);
        await logStep("Step 03: Clck on update new tag");
        await app.commonMethods.clickElement(EventsTagsObjects.updateNewTagButton);
        await logStep("Step 04: Fill all information > Click on save > Verify the successful message");
        await app.commonMethods.fill(EventsTagsObjects.tageNameInputfield, tagName);
        await app.commonMethods.uploadFile(EventsTagsObjects.uploadDesign, uploadDesign);
        await page.waitForTimeout(3000);
        await app.commonMethods.clickElement(EventsTagsObjects.appPicker);
        await app.commonMethods.press(EventsTagsObjects.colorsInputfield, "Control+A");
         await page.waitForTimeout(3000);
        await app.commonMethods.fill(EventsTagsObjects.colorsInputfield, "#100101");
        await app.adminProjectPage.clickSaveButton();
        await app.commonMethods.verifyElementVisible(EventsTagsObjects.successfulMessageTagCreation);
    });
    test("TC-02 Admin edit the event tag", { annotation: [{ product: "Loyalty", type: "critical" }] as any }, async ({ page }) => {
        test.setTimeout(0);
        //read data from json relative to the service
        const environment = readEnvironments();
        const data = readServiceData();
        const app = new WebApp(page);
        const adminUsername = data.adminUsername;
        const adminPassword = data.adminPassword;
        const adminPortalUrl = environment.adminPortalUrl;
        const tagName = data.tagName;
        await logStep("Step 01: Login to admin portal as a super admin");
        await app.adminProjectPage.login(adminPortalUrl, adminUsername, adminPassword);
        await logStep("Step 02: Navigate to events tags");
        await app.commonMethods.clickElement(EventsTagsObjects.neighborGreetingLink);
        await app.commonMethods.clickElement(EventsTagsObjects.eventsTagsLink);
        await logStep("Step 03: Select same tag name > Edit then verify successfull message");
        await app.commonMethods.hoverElement(EventsTagsObjects.updateNewTagButton);
        await app.commonMethods.clickElement(EventsTagsObjects.datatableBodyCellLabel(tagName));
        await app.commonMethods.clickElement(EventsTagsObjects.editButton);
        await app.commonMethods.press(EventsTagsObjects.tageNameInputfield, "Control+A");
        await app.commonMethods.fill(EventsTagsObjects.tageNameInputfield, tagName);
        await app.commonMethods.clickElement(EventsTagsObjects.updateButton);
        await app.commonMethods.verifyElementVisible(EventsTagsObjects.updatedMessage);
    });
    test("TC-03 Admin delete the event tag", { annotation: [{ product: "Loyalty", type: "critical" }] as any }, async ({ page }) => {
        test.setTimeout(0);
        //read data from json relative to the service
        const environment = readEnvironments();
        const data = readServiceData();
        const app = new WebApp(page);
        const adminUsername = data.adminUsername;
        const adminPassword = data.adminPassword;
        const adminPortalUrl = environment.adminPortalUrl;
        const tagName = data.tagName;
        await logStep("Step 01: Login to admin portal as a super admin");
        await app.adminProjectPage.login(adminPortalUrl, adminUsername, adminPassword);
        await logStep("Step 02: Navigate to events tags");
        await app.commonMethods.clickElement(EventsTagsObjects.neighborGreetingLink);
        await app.commonMethods.clickElement(EventsTagsObjects.eventsTagsLink);
        await logStep("Step 03: Select same tag name > Edit then verify successfull message");
        await app.commonMethods.hoverElement(EventsTagsObjects.updateNewTagButton);
        await app.commonMethods.clickElement(EventsTagsObjects.datatableBodyCellLabel(tagName));
        await logStep("Step 04: Delete same tag name > Verify successful deleted message");
        await app.commonMethods.clickElement(EventsTagsObjects.deleteButton);
        await app.commonMethods.clickElement(EventsTagsObjects.deletePopupButton);
        await app.commonMethods.verifyElementVisible(EventsTagsObjects.deletedMessage);
    });
});