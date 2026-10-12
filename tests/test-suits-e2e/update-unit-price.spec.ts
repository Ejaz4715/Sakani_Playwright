import { test } from '@playwright/test';
const path = require("path");
import { WebApp } from "@base-class/web-app";
import { DataHelper } from '@helpers/DataHelper'
import { logStep } from '@helpers/LogSteps'
import { ExcelUtils } from '@pages/utils/ExcelUtils';

const SERVICE = "update-unit";

const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;
const writeServiceData = (key: string, value: any) => DataHelper.updateServiceData(SERVICE, key, value);


test.describe("Update unit price from partners", () => {
    test("TC-01 Update the price of a unit", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        //read data from json relative to the service
        const environment = readEnvironments();
        const data = readServiceData();
        const app = new WebApp(page);
        const projectName = data.projectName;
        const developerUserId = data.developerUserId;
        const sapaPortalUrl = environment.sapaPortalUrl;
        const unitCode = data.unitCodeUpdatePrice;
        const filePath = path.join(process.cwd(), "src", "downloads", "unit-prices.xlsx");

        await logStep("Step 01: Login as developer to sapa portal and open the project");
        await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
        await app.partnersLoginPage.loginToSapaPortal(developerUserId);
        await app.partnersLoginPage.switchRoleToDeveloper();

        await logStep("Step 02: Search for project");
        await app.developerProjectPage.openProjectBySearch(projectName);

        await logStep('Step 03: Clear the downloads folder');
        const downloadDirectory = path.join(process.cwd(), "src", "downloads");
        await app.paymentsAndTransactionsPage.clearDownloadsFolder(downloadDirectory);

        await logStep('Step 04: Download unit prices Excel file');
        const excelDownloadPromise = ExcelUtils.waitForExcelDownload(page);
        await app.updateUnitsPage.clickDownloadUnitPricesButton();
        const excelDownload = await excelDownloadPromise;
        const fileName = 'unit-prices.xlsx';
        const downloadPath = path.join(downloadDirectory, fileName);

        await logStep('Step 05: Save the Excel file and verify it exists');
        await ExcelUtils.saveExcelDownload(excelDownload, downloadPath);
        await app.paymentsAndTransactionsPage.verifySavedFile(downloadPath, downloadDirectory);

        await logStep('Step 05: Read excel file and retrive the exisitng price > Write updated prices to the excel file and save');
        const exsitingPrice = app.updateUnitsPage.getUnitPriceFromWorkbook(filePath, unitCode);
        writeServiceData("exsitingPrice", exsitingPrice);
        const updatedPrice = Number(exsitingPrice) + 2;
        writeServiceData("updatedPrice", updatedPrice);
        await app.updateUnitsPage.updateUnitPricesWorkbook(filePath, unitCode, updatedPrice);

        await logStep('Step 06: Navigate to update unit price page > Upload updated unit price file');
        await app.updateUnitsPage.clickUpdateUnitPricesButton();
        await app.updateUnitsPage.uploadUpdatedUnitPricesFile(filePath);
        await page.waitForTimeout(1500);
        await app.updateUnitsPage.clickUpdatePricesButton();
        await app.updateUnitsPage.clickConfirmYesButton();
        await page.waitForTimeout(3000);
        await app.updateUnitsPage.clickConfirmYesButton();
        await app.updateUnitsPage.verifyPriceAnalysisDetailsVisible();

        await logStep('Step 07: Confirm the file and approve');
        await page.waitForTimeout(5000);
        await app.updateUnitsPage.reloadPage();
        await page.waitForTimeout(3000);
        await app.updateUnitsPage.clickConfirmUnitPriceUpdateButton();
        await app.updateUnitsPage.clickConfirmYesButton();
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
