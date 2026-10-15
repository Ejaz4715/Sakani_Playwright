import { test, expect } from "@playwright/test";
import { WebApp } from "@base-class/web-app";
import { DataHelper } from "@helpers/DataHelper";
import { logStep } from "@helpers/LogSteps";
import path from "node:path";


const SERVICE = "voucher-management";
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe("Voucher Management", () => {
    test("TC-01 Create new voucher", { annotation: [{ product: "Loyalty", type: "critical" }] as any }, async ({ page }) => {
        await logStep("Step 00: Read test data relative to the service");
        test.setTimeout(120000);
        const app = new WebApp(page);
        const environment = readEnvironments();
        const data = readServiceData();

        const timestamp = new Date()
            .toISOString()
            .replace(/[-:T.]/g, "")
            .slice(0, 14);
        const voucherName = `Test Automation Voucher ${timestamp}`;
        DataHelper.updateServiceData(SERVICE, "voucherName", voucherName);

        await logStep("Step 01: Login to admin portal as a super admin");
        await app.adminProjectPage.login(environment.adminPortalUrl, data.adminUsername, data.adminPassword);

        await logStep("Step 02: Navigate to voucher management page");
        await app.adminProjectPage.clickInternalInventory();
        await app.adminProjectPage.clickNeighbourGreeting();
        await app.adminProjectPage.openVoucherManagement();

        await logStep("Step 03: Navigate to add new voucher");
        await app.voucherManagementPage.clickAddVoucherButton();

        await logStep("Step 04: Enter voucher details and upload the image");
        await app.voucherManagementPage.fillVoucherName(voucherName);
        await app.voucherManagementPage.fillVoucherLimit("12");
        await app.voucherManagementPage.fillVoucherDescription("Test details of voucher offer");

        const imageFilePath = path.join(process.cwd(), "src", "data", "Sample image 2.png");;
        await app.voucherManagementPage.uploadVoucherImage(imageFilePath);
        await app.voucherManagementPage.waitAfterVoucherImageUpload();

        await logStep("Step 05: Select voucher region and city");
        await app.voucherManagementPage.clickRegionSelect();
        await app.voucherManagementPage.selectRegion("منطقة الرياض");
        await app.voucherManagementPage.clickCitySelect();
        await app.voucherManagementPage.selectCity("مزرعه الدهو");

        await logStep("Step 06: Save and validate the voucher was created");
        await app.voucherManagementPage.clickSaveButton();
        await app.voucherManagementPage.expectAddVoucherButtonVisible(
            20000,
            "Voucher is not created"
        );
        await app.voucherManagementPage.expectVoucherVisible(voucherName);
    });

    test("TC-02 Update the voucher details text", { annotation: [{ product: "Loyalty", type: "critical" }] as any }, async ({ page }) => {
        await logStep("Step 00: Read test data relative to the service");
        test.setTimeout(120000);
        const app = new WebApp(page);
        const environment = readEnvironments();
        const data = readServiceData();

        await logStep("Step 01: Login to admin portal as a super admin");
        await app.adminProjectPage.login(environment.adminPortalUrl, data.adminUsername, data.adminPassword);

        await logStep("Step 02: Navigate to voucher management page");
        await app.adminProjectPage.clickInternalInventory();
        await app.adminProjectPage.clickNeighbourGreeting();
        await app.adminProjectPage.openVoucherManagement();

        await logStep("Step 03: Navigate to edit the voucher");
        await app.voucherManagementPage.expectAddVoucherButtonVisible();
        await app.voucherManagementPage.clickVoucher(data.voucherName);
        
        await logStep("Step 04: Edit the voucher description details and save");
        await app.voucherManagementPage.clickEditButton();
        const descriptionValueBefore = await app.voucherManagementPage.getVoucherDescription();
        await app.voucherManagementPage.fillVoucherDescription("Updated details of voucher");

        await logStep("Step 05: Save the updates and validates the text has been changed");
        await app.voucherManagementPage.clickSaveButton();
        await app.voucherManagementPage.expectVoucherUpdatedToastVisible();
        const descriptionValueAfter = await app.voucherManagementPage.getVoucherDescription();
        expect(descriptionValueAfter).not.toEqual(descriptionValueBefore);
    });

    test("TC-03 Delete the voucher", { annotation: [{ product: "Loyalty", type: "critical" }] as any }, async ({ page }) => {
        await logStep("Step 00: Read test data relative to the service");
        test.setTimeout(120000);
        const app = new WebApp(page);
        const environment = readEnvironments();
        const data = readServiceData();

        await logStep("Step 01: Login to admin portal as a super admin");
        await app.adminProjectPage.login(environment.adminPortalUrl, data.adminUsername, data.adminPassword);

        await logStep("Step 02: Navigate to voucher management page");
        await app.adminProjectPage.clickInternalInventory();
        await app.adminProjectPage.clickNeighbourGreeting();
        await app.adminProjectPage.openVoucherManagement();

        await logStep("Step 03: Navigate to edit the voucher");
        await app.voucherManagementPage.expectAddVoucherButtonVisible();
        await app.voucherManagementPage.clickVoucher(data.voucherName);

        await logStep("Step 04: Edit the voucher description details and save");
        await app.voucherManagementPage.clickDeleteButton();
        await app.voucherManagementPage.clickFirstDeleteButton();
        await app.voucherManagementPage.expectVoucherDeletedToastVisible();
    });
});
