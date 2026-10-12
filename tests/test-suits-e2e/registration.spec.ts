import { test, expect, Page } from "@playwright/test";
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
import { WebApp } from "@base-class/web-app";
import { logStep } from '@helpers/LogSteps'
import { DateUtils } from "@pages/utils/DateUtils";
import { DataHelper } from "@helpers/DataHelper";

import { RegistrationObjects } from "@objects/RegistrationObjects";

const SERVICE = "registration";

const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;
const writeServiceData = (key: string, value: any) => DataHelper.updateServiceData(SERVICE, key, value);

test.describe("User registration and check eligibility", () => {
    test("TC-01 New user register with check eligibility", { annotation: [{ product: "Shared Product", type: "critical" }] as any }, async ({ page }) => {
        test.setTimeout(0);
        //read data from json relative to the service
        const environment = readEnvironments();
        const data = readServiceData();
        const app = new WebApp(page);

        const userPortalUrl = environment.userPortalUrl;

        await logStep("Step 01: Open the user portal and login as new user");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();
        await app.loginPage.openLogin();
        await app.registrationPage.incrementNewUserId();
        await app.registrationPage.clickContinueButton();
        await app.loginPage.waitForNafathPromptToDisappear();
        await app.registrationPage.clickContinueButton();
        await logStep("Step 02: Fill new phone and email > Continue");
        await app.registrationPage.fillRandomMobilePhone();
        await app.registrationPage.fillRandomEmail();
        await app.registrationPage.checkTermsAndConditions();
        await app.registrationPage.clickContinueButton();
        await app.page.getByRole("spinbutton", { name: "X" }).nth(0).fill("1");
        await app.page.getByRole("spinbutton", { name: "X" }).nth(1).fill("2");
        await app.page.getByRole("spinbutton", { name: "X" }).nth(2).fill("3");
        await app.page.getByRole("spinbutton", { name: "X" }).nth(3).fill("4");
        await app.loginPage.continueNewUserPopup();
        await app.registrationPage.clickExplorePropertiesButton();
        await logStep("Step 04: Navigate to user profile > Click on check elegibility");
        await app.marketplaceLandingPage.openProfileManagement();
        await app.registrationPage.clickEligibilityCheckButton();
        await app.registrationPage.checkEligibilityTerms();
        await app.registrationPage.clickAcceptTermsButton();
        await app.registrationPage.checkAdditionalEligibilityCheckboxes();
        await app.registrationPage.clickContinueButton();
        await logStep("Step 05: Select current region and city> Select preffered region, city and distruct");
        await app.registrationPage.selectDropdownOption(
            RegistrationObjects.currentRegion,
            RegistrationObjects.riyadhOption,
        );
        await app.registrationPage.selectDropdownOption(
            RegistrationObjects.currentCity,
            RegistrationObjects.shaqraOption,
        );
        await app.registrationPage.selectDropdownOption(
            RegistrationObjects.perefferdRegion,
            RegistrationObjects.makkahOption,
        );
        await app.registrationPage.selectDropdownOption(
            RegistrationObjects.prefferedCity,
            RegistrationObjects.jeddahOption,
        );

        await app.registrationPage.selectDropdownOption(
            RegistrationObjects.perefferedDistruct,
            RegistrationObjects.distructOption,
        );
        await logStep("Step 06: Select current living status - rent");
        await app.registrationPage.selectDropdownOption(
            RegistrationObjects.currentLivingStatus,
            RegistrationObjects.rentalHouseOption,
        );
        await logStep("Step 07: Enter family Ids and DOBs if exist");
        await app.registrationPage.fillAllMatchingFields(RegistrationObjects.guardianId, "1000239030");
        await app.registrationPage.fillAllMatchingFields(RegistrationObjects.guardianDob, "14000210");
        await app.registrationPage.fillAllMatchingFields(RegistrationObjects.fatherId, "1000233030");
        await app.registrationPage.fillAllMatchingFields(RegistrationObjects.fatherDob, "13800210");
        await app.registrationPage.fillAllMatchingFields(RegistrationObjects.motherId, "1000239030");
        await app.registrationPage.fillAllMatchingFields(RegistrationObjects.motherDob, "13900210");
        await app.registrationPage.clickConfirmButton();
        await logStep("Step 08: Verify the eligibility status");
        await app.registrationPage.getEligibilityResult();


    });
});