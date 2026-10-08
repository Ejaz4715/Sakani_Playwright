import { test } from '@playwright/test';
import fs from "node:fs";
import os from "node:os";
const path = require("path");
import { WebApp } from "@base-class/web-app";
import { logStep } from '@helpers/LogSteps'
import testDataUpdateUnit from '@data/test-data.json'

test.describe("Update unit status (active/inactive) from partners", () => {
    test("TC-01 Developer updates the unit status active or inactive of available unit", { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        //read data from json relative to the service
        const environment = testDataUpdateUnit.environments;
        const data = testDataUpdateUnit.services["update-unit"];
        const app = new WebApp(page);
        const projectName = data.projectName;
        const developerUserId = data.developerUserId;
        const sapaPortalUrl = environment.sapaPortalUrl;

        await logStep("Step 01: Login as developer to sapa portal and open the project");
        await app.developerProjectPage.gotoAuth(sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();

        await logStep("Step 02: Search for project and unit > Get the current unit status");
        await app.developerProjectPage.openProjectBySearch(projectName);
        const unitCode = data.availableUnitCode;
        await app.updateUnitsPage.clickUnitDetailsTab();
        await app.updateUnitsPage.selectUnitCodeSearchCriteria();
        await app.updateUnitsPage.fillUnitCode(unitCode);
        await app.updateUnitsPage.clickSearchButton();
        const unitStatusArOld = await app.updateUnitsPage.getUnitStatus();
        let unitStatusArNew;
        let unitStatusEng;
        if (unitStatusArOld === 'غير نشط') {
            unitStatusArNew = 'نشط';
            unitStatusEng = 'active';
        } else {
            unitStatusArNew = 'غير نشط';
            unitStatusEng = 'inactive';
        }
        const projectCode = data.projectCode;
        const productCode = data.availableUnitCode;

        
        await logStep("Step 03: Navigate to update units page");
        await app.updateUnitsPage.clickUpdateUnitStatusLink();
        await app.updateUnitsPage.clickPilotLaunchButton();

        await logStep("Step 04: Update excel file and upload");
        const filePath = path.join(process.cwd(), "src", "data", "update_unit_status.xlsx");
        await app.updateUnitsPage.updateWorkbookStatus(
            filePath,
            unitStatusEng,
            projectCode,
            productCode,
        );
        await app.updateUnitsPage.uploadWorkbook(filePath);
        
        await logStep("Step 05: Validate the file is uploaded");
        await app.updateUnitsPage.verifyUploadedFile(path.basename(filePath));

        await logStep("Step 06: Analyse the file and approve the update");
        await app.updateUnitsPage.clickAnalyzeFileButton();
        await app.updateUnitsPage.clickFirstAnalysisResult();
        await app.updateUnitsPage.clickApproveButton();
        await app.updateUnitsPage.clickConfirmationDialog();
        await app.updateUnitsPage.verifyApprovalSuccessMessage();
        await app.updateUnitsPage.clickSuccessCheckmark();
        await app.updateUnitsPage.clickConfirmYesButton();

        await logStep("Step 07: Search and open the project");
        await app.developerProjectPage.openProjectBySearch(projectName);

        await logStep("Step 08: Navigate to units > Search with unit code");
        await app.updateUnitsPage.clickUnitDetailsTab();
        await app.updateUnitsPage.selectUnitCodeSearchCriteria();
        await app.updateUnitsPage.fillUnitCode(unitCode);
        await app.updateUnitsPage.clickSearchButton();

        await logStep("Step 09: Validate the unit status has been changed");
        await app.updateUnitsPage.expectUnitStatus(unitStatusArNew);
    });

    test("TC-02 Verify booked unit status can't be updated", { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        //read data from json relative to the service
        const environment = testDataUpdateUnit.environments;
        const data = testDataUpdateUnit.services["update-unit"];
        const app = new WebApp(page);
        const projectName = data.projectName;
        const developerUserId = data.developerUserId;
        const sapaPortalUrl = environment.sapaPortalUrl;

        await logStep("Step 01: Login as developer to sapa portal and open the project");
        await app.developerProjectPage.gotoAuth(sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();

        await logStep("Step 02: Search for project and unit > Get the current unit status");
        await app.developerProjectPage.openProjectBySearch(projectName);
        const unitCode = data.bookedUnitCode;
        await app.updateUnitsPage.clickUnitDetailsTab();
        await app.updateUnitsPage.selectUnitCodeSearchCriteria();
        await app.updateUnitsPage.fillUnitCode(unitCode);
        await app.updateUnitsPage.clickSearchButton();
        await app.updateUnitsPage.vrifyTheUnitStatusIsBooked("محجوز");
        const unitStatusArOld = await app.updateUnitsPage.getUnitStatus();
        let unitStatusArNew;
        let unitStatusEng;
        if (unitStatusArOld === 'غير نشط') {
            unitStatusArNew = 'نشط';
            unitStatusEng = 'active';
        } else {
            unitStatusArNew = 'غير نشط';
            unitStatusEng = 'inactive';
        }
        const projectCode = data.projectCode;
        const productCode = data.bookedUnitCode;

        await logStep("Step 03: Navigate to update units page");
        await app.updateUnitsPage.clickUpdateUnitStatusLink();
        await app.updateUnitsPage.clickPilotLaunchButton();

        await logStep("Step 04: Update excel file and upload");
        const filePath = path.join(process.cwd(), "src", "data", "update_unit_status.xlsx");
        await app.updateUnitsPage.updateWorkbookStatus(
            filePath,
            unitStatusEng,
            projectCode,
            productCode,
        );
        await app.updateUnitsPage.uploadWorkbook(filePath);

        await logStep("Step 05: Validate the file is uploaded");
        await app.updateUnitsPage.verifyUploadedFile(path.basename(filePath));

        await logStep("Step 06: Analyse the file and navigate to the results page");
        await app.updateUnitsPage.clickAnalyzeFileButton();
        await app.updateUnitsPage.clickFirstAnalysisResult();
        
        await logStep("Step 09: Validate the error message is present for booked unit");
        await app.updateUnitsPage.verifyTheUpdateIsRejected();
    });
});
