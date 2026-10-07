import { test, expect, Page } from "@playwright/test";
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
import { WebApp } from "@base-class/web-app";
import { logStep } from '@helpers/LogSteps'
import { DateUtils } from "@pages/utils/DateUtils";
import { DataHelper } from "@helpers/DataHelper";
import readResaleData from "@data/test-data.json";

test.describe("Resale Of Units - With Known Buyer", () => {
    test("TC-01 - Add new project offplan project", { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(120000);
        const app = new WebApp(page);
        const environment = readResaleData.environments;
        const data = readResaleData.services["resale-of-units"];
        const currentDate = DateUtils.getDateISO(600);
        const projectName = `Automation Project ${new Date()
            .toISOString()
            .replace(/[-:T.]/g, "")
            .slice(0, 14)}`;
        DataHelper.updateServiceData("test-data.json", "resale-of-units", "projectName", projectName);

        await app.adminProjectPage.login(
            environment.adminPortalUrl,
            data.adminUsername,
            data.adminPassword,
        );

        await app.adminProjectPage.openProjectCreation();
        await page
            .locator("form-field-component")
            .filter({ hasText: "إسم المشروع *" })
            .getByPlaceholder("إسم المشروع")
            .fill(projectName);
        const projectTypeDropdown = page.locator(
            "//mat-select[@formcontrolname='project_type']",
        );
        const projectTypeOption = page.getByText(
            "مشاريع البيع على الخارطة على أراضي الوزارة",
            { exact: true },
        );

        let projectTypeVisible = false;
        for (let attempt = 0; attempt < 5; attempt++) {
            await projectTypeDropdown.click();
            projectTypeVisible = await projectTypeOption.isVisible().catch(() => false);

            if (projectTypeVisible) {
                break;
            }

            await page.waitForTimeout(2000);
        }

        await expect(projectTypeOption).toBeVisible({ timeout: 30000 });
        await projectTypeOption.click();
        await page
            .locator("//ng-select[@formcontrolname='region_id']")
            .getByRole("combobox")
            .click();
        await page.getByText("الرياض").click();
        await page.locator("//input[@id='inputCity']").click();
        await page.getByRole("option", { name: "الخرج", exact: true }).click();
        await page
            .locator("//input[@id='inputDeveloper']")
            .fill("شركة الضاحية المثالية للتطوير والاستثمار العقاري");
        await page
            .getByText(/شركة الضاحية المثالية للتطوير والاستثمار العقاري.*/)
            .click();
        await page.getByRole("switch", { name: "قابل للحجز؟" }).click();
        await page.locator("//mat-select[@formcontrolname='status']").click();
        await page.getByRole("option", { name: "متاح" }).click();
        await page
            .getByRole("textbox", { name: "تاريخ انتهاء رخصة البيع في وافي" })
            .fill(currentDate);
        await page.locator("//mat-select[@formcontrolname='subsidy_type']").click();
        await page.getByText("دعم عيني كامل").click();
        await page
            .locator("//input[@formcontrolname='max_subsidy_amount']")
            .fill("2");
        await page
            .getByRole("textbox", { name: "تاريخ توقيع الاتفاقيه للمشروع" })
            .fill("2026-01-01");
        await page.getByRole("textbox", { name: "رقم ترخيص المشروع" }).fill("665334");
        await page
            .getByRole("textbox", { name: "تاريخ ترخيص المشروع" })
            .fill("2026-01-01");
        await page
            .getByRole("textbox", { name: "اسم حساب الضمان" })
            .fill("Test user");
        await page
            .getByRole("textbox", { name: "رقم حساب الضمان" })
            .fill("SA1111111111111111111111");
        await page
            .locator(
                "//app-nsar-dropdown[@formcontrolname='bank_name']/descendant::ng-select",
            )
            .first()
            .click();
        await page.getByText("بنك الأهلي السعودي").click();
        await page.locator("//input[@formcontrolname='deduct_percentage']").fill("2");
        await page
            .getByRole("textbox", { name: "المدينة المصدر منها الصك (بالعربية)" })
            .fill("test");
        await page
            .getByRole("textbox", { name: "المدينة المصدر منها الصك (بالإنجليزية)" })
            .fill("test");
        await page.getByRole("textbox", { name: "DD/MM/YYYY" }).fill("01/01/2026");
        await page.getByRole("button", { name: "حفظ" }).click();
        const saveSuccessToast = page.locator("//app-toasts").getByText("تم الحفظ بنجاح!");
        await expect(saveSuccessToast).toBeVisible({ timeout: 120000 });


        // Link with AZM
        await page.waitForTimeout(3000);
        const azmToggle = page.locator(
            "//label[contains (text(), 'AZM')]/preceding-sibling::button",
        );
        const isAzmLinked = await azmToggle.getAttribute("aria-checked");
        if (isAzmLinked === "false") {
            await azmToggle.click();
            await page.waitForTimeout(5000);
            await expect(azmToggle).toHaveAttribute("aria-checked", "true");
        } else {
            await expect(azmToggle).toHaveAttribute("aria-checked", "true");
        }

        // Partcipating banks
        await expect(page.getByText(/قائمة الجهات التمويلية/i)).toBeVisible({
            timeout: 30000,
        });
        await page.getByText(/قائمة الجهات التمويلية/i).click();
        await expect(
            page.getByRole("checkbox", { name: "Select all rows" }),
        ).toBeVisible({ timeout: 30000 });
        await page.getByRole("checkbox", { name: "Select all rows" }).click();
        await page.getByRole("button", { name: "حفظ" }).click();

        // Import units
        await page.getByRole("tab", { name: "الوحدات", exact: true }).click();
        await expect(
            page.getByRole("button", { name: "استيراد وحدة جديدة" }),
        ).toBeVisible({ timeout: 30000 });
        await page.getByRole("button", { name: "استيراد وحدة جديدة" }).click();
        await expect(
            page.getByRole("combobox", { name: "نوع الوحدة السكنية" }),
        ).toBeVisible({ timeout: 30000 });
        await page.getByRole("combobox", { name: "نوع الوحدة السكنية" }).click();
        await page.getByRole("option", { name: "شقة" }).click();
        const unitsImportFilePath = path.join(
            process.cwd(), "src",
            "data",
            "Offplan_MOH.xlsx",
        );
        await page
            .locator("//input[@type='file']")
            .setInputFiles(unitsImportFilePath);
        await page.getByRole("button", { name: " حفظ" }).click();

        const importInProgress = page.getByText("تحت الإجراء ...", { exact: true });
        await expect(importInProgress).toBeVisible({ timeout: 120000 });
        await page.waitForTimeout(5000);
        await page.reload();
        const fileProcessedMessage = page.getByText("تم إكمال الإجراء", {
            exact: true,
        });
        let completedVisible = false;

        while (!completedVisible) {
            completedVisible = await fileProcessedMessage
                .isVisible()
                .catch(() => false);
            if (!completedVisible) {
                await page.reload();
                await page.waitForTimeout(3000);
                continue;
            }
        }
        await page.getByRole("button", { name: "اعتماد" }).click();
        await page.getByRole("button", { name: "موافق" }).click();
        await page.waitForTimeout(3000);
        await page.getByRole("button", { name: "رجوع" }).click();

        // //Upload media
        await page
            .locator("span")
            .filter({ hasText: /المحتوى المرئي/i })
            .first()
            .click();
        const bannerImagePath = path.join(
            process.cwd(), "src",
            "data",
            "Sample image.jpg",
        );
        await page
            .locator(
                "//h1[contains (text(), 'الصورة الإعلانية')]/parent::div/following-sibling::div/child::input[@type='file']",
            )
            .setInputFiles(bannerImagePath);
        await page.locator("//mat-icon[contains (text(), 'file_upload')]").click();
        await page
            .locator("div")
            .filter({ hasText: /^Display method$/ })
            .first()
            .click();
        await page.getByText("Hero").click();
        await page
            .getByRole("textbox", { name: "عنوان صفحة التفاصيل (باللغة العربية)" })
            .fill(projectName);
        await page
            .getByRole("textbox", { name: "عنوان صفحة التفاصيل (باللغة الإنجليزية)" })
            .fill(projectName);
        await page
            .getByRole("textbox", { name: "تاريخ جهوزية أول وحدة" })
            .fill("2026-01-01");
        await page
            .getByRole("textbox", { name: "الاسم (باللغة العربية)" })
            .fill("test bb");
        await page
            .getByRole("textbox", { name: "الاسم (باللغة الإنجليزية)" })
            .fill("test bb");
        await page
            .getByRole("textbox", { name: "الملخص AR" })
            .fill(
                "الملخص ARالملخص ARالملخص ARالملخص ARالملخص ARالملخص ARالملخص ARالملخص AR",
            );
        await page
            .getByRole("textbox", { name: "ملخص EN" })
            .fill(
                "Summary EN Summary EN Summary EN Summary EN Summary EN Summary EN Summary EN Summary EN Summary EN",
            );
        await page
            .getByRole("textbox", { name: "الوصف (باللغة العربية)" })
            .fill(
                "الوصف (باللغة العربية)الوصف (باللغة العربية)الوصف (باللغة العربية)الوصف (باللغة العربية)الوصف (باللغة العربية)الوصف (باللغة العربية)الوصف (باللغة العربية)",
            );
        await page
            .getByRole("textbox", { name: "الوصف (باللغة الإنجليزية)" })
            .fill(
                "Description EN Description EN Description EN Description EN Description EN Description EN Description EN Description EN Description EN",
            );
        await page.getByRole("textbox", { name: "السعر يبدأ من" }).fill("500000");
        await page.getByRole("spinbutton", { name: "خط العرض" }).fill("1.1");
        await page.getByRole("spinbutton", { name: "خط الطول" }).fill("1.1");
        await expect(
            page.locator("//button[contains (@class, 'uploadStatus')]"),
        ).toBeVisible({ timeout: 120000 });
        await page.waitForTimeout(1500);
        await page.locator("#save_btn").click();

        // // Approve media
        await page.getByRole("tab", { name: "تفاصيل المشروع" }).click();
        await page
            .getByRole("button", { name: "تقديم طلب موافقة على نشر المحتوى المرفوع" })
            .click();
        await page
            .getByRole("button", { name: "قبول المحتوى المرئي المرفوع" })
            .click();
        await page.getByRole("button", { name: "إبقاء المشروع غير منشور" }).click();
        await page.getByRole("button", { name: "حفظ" }).click();
        await expect(saveSuccessToast).toBeVisible({ timeout: 120000 });

        // // Publish unit model
        await page.getByText("نماذج الوحدات").click();
        await page.getByRole("cell", { name: "model_1" }).click();
        await page.getByRole("button", { name: "حفظ" }).click();
        await page.getByText("المحتوى المرئي ( مسودة )").click();
        await page.getByRole("button", { name: "حفظ" }).click();
        await page
            .getByRole("button", { name: "تقديم طلب موافقة على نشر المحتوى المرفوع" })
            .click();
        await page
            .getByRole("button", { name: "قبول المحتوى المرئي المرفوع" })
            .click();
        await page.getByRole("button", { name: "وحدة النشر" }).click();
        await page.locator("a").filter({ hasText: "model_1 - شقة" }).click();

        // Navigate to project details page
        await page.getByText("تفاصيل المشروع").click();

        // Select status to be available
        await page.locator("//mat-select[@formcontrolname='status']").click();
        await page.getByRole("option", { name: "متاح" }).click();

        //Save project details
        await page.getByRole("button", { name: "حفظ" }).click();
        // await expect(saveSuccessToast).toBeVisible({ timeout: 120000 });

        // Check the bookable toggle
        const bookingAvailableToggle = page.locator(
            "//label[contains (text(), 'قابل للحجز')]/preceding-sibling::button",
        );
        await expect(bookingAvailableToggle).toBeVisible({ timeout: 30000 });
        const isBookingAvailable =
            await bookingAvailableToggle.getAttribute("aria-checked");
        if (isBookingAvailable === "false") {
            await bookingAvailableToggle.click();
            await expect(bookingAvailableToggle).toHaveAttribute(
                "aria-checked",
                "true",
            );
        } else {
            await expect(bookingAvailableToggle).toHaveAttribute(
                "aria-checked",
                "true",
            );
        }

        // Publish project
        const publishProjectToggle = page.locator(
            "//label[contains (text(), 'هل تم نشر المشروع')]/preceding-sibling::button",
        );
        await expect(publishProjectToggle).toBeVisible({ timeout: 30000 });
        const isPublished = await publishProjectToggle.getAttribute("aria-checked");
        if (isPublished === "false") {
            await publishProjectToggle.click();
            await expect(publishProjectToggle).toHaveAttribute("aria-checked", "true");
        } else {
            await expect(publishProjectToggle).toHaveAttribute("aria-checked", "true");
        }
        await page.getByRole("button", { name: "حفظ" }).click();
        await expect(saveSuccessToast).toBeVisible({ timeout: 120000 });
    });

    test("TC-02 - Developer adds payment schedules", { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const app = new WebApp(page);
        const environment = readResaleData.environments;
        const projectName = readResaleData.services["resale-of-units"].projectName;
        const developerUserId = readResaleData.services["resale-of-units"].developerUserId;

        await app.developerProjectPage.gotoAuth(environment.sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();
        await app.developerProjectPage.openProjectBySearch(projectName);

        await app.developerProjectPage.openPaymentSchedulesTab();
        await app.developerProjectPage.addPaymentSchedule({
            type: "cash",
            scheduleName: "Cash 22",
            completionPercentageOneValue: "50",
            percentageOneValue: "50",
            completionPercentageTwoValue: "100",
            percentageTwoValue: "50"
        });

        await app.developerProjectPage.openProjectBySearch(projectName);
        await app.developerProjectPage.openPaymentSchedulesTab();
        await app.developerProjectPage.addPaymentSchedule({
            type: "lending",
            scheduleName: "Lending 22",
            completionPercentageOneValue: "50",
            percentageOneValue: "50",
            completionPercentageTwoValue: "100",
            percentageTwoValue: "50"
        });
    });

    test("TC-03 - Developer approves sales contract", { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const app = new WebApp(page);
        const environment = readResaleData.environments;
        const projectName = readResaleData.services["resale-of-units"].projectName;
        const developerUserId = readResaleData.services["resale-of-units"].developerUserId;

        await logStep("Step 01: Navigate to partners portal > Login");
        await app.developerProjectPage.gotoAuth(environment.sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();

        await logStep("Step 02: Navigate to searched project > Navigate to sale contracts ");
        await app.developerProjectPage.openProjectBySearch(projectName);
        await app.developerProjectPage.openSalesContractsTab();
        await app.developerProjectPage.viewAndApproveSalesContract();

        await logStep("Step 03: Approve sales contract and verify is approved");
        await app.developerProjectPage.approveUnitSpecification();
        await app.developerProjectPage.fillOtp("1234");
        await app.developerProjectPage.verifyOtp();
        await app.developerProjectPage.verifyApprovalSuccessMessage();
    });

    test("TC-04 - Seller books offplan unit and pay the fees", { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const app = new WebApp(page);
        const environment = readResaleData.environments;
        const projectName = readResaleData.services["resale-of-units"].projectName;
        const seller = readResaleData.services["resale-of-units"].sellerUserId;
        const userPortalUrl = environment.userPortalUrl;

        await logStep("Step 01: Navigate to user portal > Login");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();
        await app.loginPage.openLogin();
        await app.loginPage.loginWithNafath(seller);
        await app.loginPage.waitForNafathPromptToDisappear();
        await app.loginPage.continueNewUserPopup();
        await app.loginPage.handlePushNotificationPopup();
        await logStep("Step 02: Search for project > View units");
        await app.marketplaceLandingPage.openSearch();
        await app.marketplaceLandingPage.searchForProject(projectName);
        await app.projectDetailsPage.openUnitsAndScroll();

        await logStep("Step 03: Reserve unit > Pay the fees and verify the unit is booked");
        const page1Promise = page.waitForEvent("popup");
        await app.marketplaceLandingPage.openResidentialUnit();
        const page1 = await page1Promise;
        const page2Promise = page1.waitForEvent("popup");

        {
            const unitApp = new WebApp(page1);
            await unitApp.projectUnitsPage.openUnitInPopup(1);
        }

        const page2 = await page2Promise;

        {
            let bookingPage = page2;
            let bookingApp = new WebApp(bookingPage);
            await bookingApp.unitDetailsPage.reserveUnit();

            await bookingApp.unitBookingPage.acceptTermsAndConfirm();
            await bookingApp.paymentGatewayPage.fillCardDetails();
            await bookingApp.paymentConfirmationPage.closePayment();
            await bookingApp.paymentConfirmationPage.expectSuccessMessage();
        }
    });

    test("TC-05 - Seller signs sales contract", { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const app = new WebApp(page);
        const seller = readResaleData.services["resale-of-units"].sellerUserId;
        const userPortalUrl = readResaleData.environments.userPortalUrl;

        await logStep("Step 01: Open user portal");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();

        await logStep("Step 02: Log in with Nafath");
        await app.loginPage.openLogin();
        await app.loginPage.loginWithNafath(seller);
        await app.loginPage.waitForNafathPromptToDisappear();
        await app.loginPage.continueNewUserPopup();
        await app.loginPage.handlePushNotificationPopup();

        await logStep("Step 03: Open active bookings");
        await app.bookingPage.openActiveBookings();
        const bookedUnitCode = await app.bookingPage.getBookedUnitCode();
        expect(bookedUnitCode).toBeTruthy();
        DataHelper.updateServiceData("test-data.json", "resale-of-units", "bookedUnitCode", bookedUnitCode);

        await logStep("Step 04: Open booking details > Sign the sales contract");
        await app.bookingPage.openBookingDetails();
        await app.unitDetailsPage.openSalesContract();
        await app.unitBookingPage.signSalesContract();
        await app.unitBookingPage.expectSalesContractSuccess();
    });

    test("TC-06 - Developer confirms the booking", { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const app = new WebApp(page);
        const developerUserId = readResaleData.services["resale-of-units"].developerUserId;
        const sapaPortalUrl = readResaleData.environments.sapaPortalUrl;
        const bookedUnitCode = readResaleData.services["resale-of-units"].bookedUnitCode;

        await logStep("Step 01: Navigate to partners portal > Login");
        await app.developerProjectPage.gotoAuth(sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();

        await logStep("Step 02: Navigate to booking page > Confirm booking");
        await app.developerProjectPage.confirmBooking(bookedUnitCode);
    });


    test("TC-07 - Admin configures project-level of resale settings", { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const app = new WebApp(page);
        const adminPortalUrl = readResaleData.environments.adminPortalUrl;
        const adminUsername = readResaleData.services["resale-of-units"].adminUsername;
        const adminPassword = readResaleData.services["resale-of-units"].adminPassword;
        const projectName = readResaleData.services["resale-of-units"].projectName;

        await logStep("Step 01: Login to admin platform");
        await app.adminProjectPage.login(
            adminPortalUrl,
            adminUsername,
            adminPassword,
        );

        await logStep("Step 02: Search for project > navigate to resale settings");
        await app.adminProjectPage.openProjects();
        await app.resaleOfUnitsPage.fillProjectName(projectName);
        await app.resaleOfUnitsPage.clickProjectSearchButton();
        await app.resaleOfUnitsPage.clickSearchedProjectResult(projectName);
        await app.resaleOfUnitsPage.clickOnResaleSettingTab();

        await logStep("Step 03: Apply the confiqguartion and save");
        await app.resaleOfUnitsPage.clickOnuseGeneralResaleSettingsSwitch();
        await app.resaleOfUnitsPage.selectResaleFeeType();
        await app.resaleOfUnitsPage.fillResaleFeeValue(10);
        await app.resaleOfUnitsPage.clickOnSaveButton();
        await app.resaleOfUnitsPage.verifyTheToastMessage();
    });



    test("TC-08 - Seller submits new resale request for known buyer", { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const app = new WebApp(page);
        const seller = readResaleData.services["resale-of-units"].sellerUserId;
        const buyerId = readResaleData.services["resale-of-units"].buyerUserId;
        const buyerDob = readResaleData.services["resale-of-units"].buyerDOB;
        const userPortalUrl = readResaleData.environments.userPortalUrl;

        await logStep("Step 01: Open user portal");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();

        await logStep("Step 02: Log in with Nafath");
        await app.loginPage.openLogin();
        await app.loginPage.loginWithNafath(seller);
        await app.loginPage.waitForNafathPromptToDisappear();
        await app.loginPage.continueNewUserPopup();
        await app.loginPage.handlePushNotificationPopup();

        await logStep("Step 03: Open complete bookings");
        await app.bookingPage.openCompletedBookings();
        const bookedUnitCode = await app.bookingPage.getBookedUnitCode();
        expect(bookedUnitCode).toBeTruthy();
        DataHelper.updateServiceData("test-data.json", "resale-of-units", "bookedUnitCode", bookedUnitCode);

        await logStep("Step 04: Open booking details > Click on resale of units");
        await app.bookingPage.openBookingDetails();
        await app.resaleOfUnitsPage.clickOnResaleOfUnitsButton();

        await logStep("Step 05: Select assign to buyer and fill buyer information then click on verify");
        await app.resaleOfUnitsPage.clickOnAssignToBuyerOption();
        await app.resaleOfUnitsPage.fillBuyerIdInputfield(buyerId);
        await app.resaleOfUnitsPage.fillBuyerDobInputfield(buyerDob);
        await app.resaleOfUnitsPage.clickOnVerifyButton();

        await logStep("Step 06: Click on next to fainancial information");
        await app.resaleOfUnitsPage.clickOnNextToFinancialInfoButton();

        await logStep("Step 07: Select and fill resale reason and fill waiver amount");
        await app.resaleOfUnitsPage.selectResaleReason();
        await app.resaleOfUnitsPage.fillResaleReasonDetails("test resale deatils");
        await app.resaleOfUnitsPage.fillWaiverAmount(100);

        await logStep("Step 08: Select payment method");
        await app.resaleOfUnitsPage.selectPaymentMethod();

        await logStep("Step 09: Add an istallment");
        await app.resaleOfUnitsPage.fillPriceAmountInputfield(100);
        await app.resaleOfUnitsPage.fillPriceAmountPercentageInputfield(100);
        await app.resaleOfUnitsPage.fillCompletionPercentageInputfield(100);
        await app.resaleOfUnitsPage.selectStatus();
        await app.resaleOfUnitsPage.clickOnAddInstallmentButton();
        await logStep("Step 10: Check on desclaimer waiver then click on submit the request");
        await app.resaleOfUnitsPage.clickOnDisclaimerWaiverCheckbox();
        await app.resaleOfUnitsPage.clickOnSubmitButton();
        await app.resaleOfUnitsPage.getAndSaveRequestNumber();

    });


    test("TC-09 - Developer approves known-buyer request", { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const app = new WebApp(page);
        const developerUserId = readResaleData.services["resale-of-units"].developerUserId;
        const requestNumber = readResaleData.services["resale-of-units"].requestNumber;
        const sapaPortalUrl = readResaleData.environments.sapaPortalUrl;

        await logStep("Step 01: Open partners portal");
        await app.developerProjectPage.gotoAuth(sapaPortalUrl);

        await logStep("Step 02: Login to the platfrom");
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();

        await logStep("Step 03: Click on resale requests from side menu");
        await app.resaleOfUnitsPage.clickOnResaleRequestSideMenu();

        await logStep("Step 04: Search by reference number and click on view deatails");
        await app.resaleOfUnitsPage.selectSearchByReference();
        await app.resaleOfUnitsPage.fillRequestNumberInputfield(requestNumber);
        await app.resaleOfUnitsPage.clickOnViewDetailsButton();

        await logStep("Step 05: Approve the request and verify the request is apporved");
        await app.resaleOfUnitsPage.clickOnApproveButton();
        await app.resaleOfUnitsPage.clickOnSendButton();
        await app.resaleOfUnitsPage.verifyTheRequestisApproved();

    });

    test("TC-10 - Buyer signs contract and pays waiver", { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const app = new WebApp(page);
        const buyerId = readResaleData.services["resale-of-units"].buyerUserId;
        const userPortalUrl = readResaleData.environments.userPortalUrl;

        await logStep("Step 01: Open user portal");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();

        await logStep("Step 02: Log in with Nafath");
        await app.loginPage.openLogin();
        await app.loginPage.loginWithNafath(buyerId);
        await app.loginPage.waitForNafathPromptToDisappear();
        await app.loginPage.continueNewUserPopup();
        await app.loginPage.handlePushNotificationPopup();

        await logStep("Step 03: Open wating to sign contract");
        await app.resaleOfUnitsPage.openWaitingToSignContract();

        await logStep("Step 04: Open request details > Click confirm booking");
        await app.resaleOfUnitsPage.clickOnViewButton();
        await app.resaleOfUnitsPage.clickOnConfirmBookingButton();

        await logStep("Step 05: Click on approve sale contract and pay waiver amount");
        await app.resaleOfUnitsPage.clickOnApproveSaleContractButton();
        await app.resaleOfUnitsPage.enterOTP();
        await app.resaleOfUnitsPage.clickOnVerifyButton();
        await app.paymentGatewayPage.fillCardDetails();
        await app.resaleOfUnitsPage.verifyWaiverFeesSuccessfullyPaidMessage();

    });

});


test.describe("Resale Of Units - With Unknown Buyer", () => {
    test("TC-01 - Add new project offplan project", { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(120000);
        const app = new WebApp(page);
        const environment = readResaleData.environments;
        const data = readResaleData.services["resale-of-units"];
        const currentDate = DateUtils.getDateISO(600);
        const projectName = `Automation Project ${new Date()
            .toISOString()
            .replace(/[-:T.]/g, "")
            .slice(0, 14)}`;
        DataHelper.updateServiceData("test-data.json", "resale-of-units", "projectName", projectName);

        await app.adminProjectPage.login(
            environment.adminPortalUrl,
            data.adminUsername,
            data.adminPassword,
        );

        await app.adminProjectPage.openProjectCreation();
        await page
            .locator("form-field-component")
            .filter({ hasText: "إسم المشروع *" })
            .getByPlaceholder("إسم المشروع")
            .fill(projectName);
        const projectTypeDropdown = page.locator(
            "//mat-select[@formcontrolname='project_type']",
        );
        const projectTypeOption = page.getByText(
            "مشاريع البيع على الخارطة على أراضي الوزارة",
            { exact: true },
        );

        let projectTypeVisible = false;
        for (let attempt = 0; attempt < 5; attempt++) {
            await projectTypeDropdown.click();
            projectTypeVisible = await projectTypeOption.isVisible().catch(() => false);

            if (projectTypeVisible) {
                break;
            }

            await page.waitForTimeout(2000);
        }

        await expect(projectTypeOption).toBeVisible({ timeout: 30000 });
        await projectTypeOption.click();
        await page
            .locator("//ng-select[@formcontrolname='region_id']")
            .getByRole("combobox")
            .click();
        await page.getByText("الرياض").click();
        await page.locator("//input[@id='inputCity']").click();
        await page.getByRole("option", { name: "الخرج", exact: true }).click();
        await page
            .locator("//input[@id='inputDeveloper']")
            .fill("شركة الضاحية المثالية للتطوير والاستثمار العقاري");
        await page
            .getByText(/شركة الضاحية المثالية للتطوير والاستثمار العقاري.*/)
            .click();
        await page.getByRole("switch", { name: "قابل للحجز؟" }).click();
        await page.locator("//mat-select[@formcontrolname='status']").click();
        await page.getByRole("option", { name: "متاح" }).click();
        await page
            .getByRole("textbox", { name: "تاريخ انتهاء رخصة البيع في وافي" })
            .fill(currentDate);
        await page.locator("//mat-select[@formcontrolname='subsidy_type']").click();
        await page.getByText("دعم عيني كامل").click();
        await page
            .locator("//input[@formcontrolname='max_subsidy_amount']")
            .fill("2");
        await page
            .getByRole("textbox", { name: "تاريخ توقيع الاتفاقيه للمشروع" })
            .fill("2026-01-01");
        await page.getByRole("textbox", { name: "رقم ترخيص المشروع" }).fill("665334");
        await page
            .getByRole("textbox", { name: "تاريخ ترخيص المشروع" })
            .fill("2026-01-01");
        await page
            .getByRole("textbox", { name: "اسم حساب الضمان" })
            .fill("Test user");
        await page
            .getByRole("textbox", { name: "رقم حساب الضمان" })
            .fill("SA1111111111111111111111");
        await page
            .locator(
                "//app-nsar-dropdown[@formcontrolname='bank_name']/descendant::ng-select",
            )
            .first()
            .click();
        await page.getByText("بنك الأهلي السعودي").click();
        await page.locator("//input[@formcontrolname='deduct_percentage']").fill("2");
        await page
            .getByRole("textbox", { name: "المدينة المصدر منها الصك (بالعربية)" })
            .fill("test");
        await page
            .getByRole("textbox", { name: "المدينة المصدر منها الصك (بالإنجليزية)" })
            .fill("test");
        await page.getByRole("textbox", { name: "DD/MM/YYYY" }).fill("01/01/2026");
        await page.getByRole("button", { name: "حفظ" }).click();
        const saveSuccessToast = page.locator("//app-toasts").getByText("تم الحفظ بنجاح!");
        await expect(saveSuccessToast).toBeVisible({ timeout: 120000 });


        // Link with AZM
        await page.waitForTimeout(3000);
        const azmToggle = page.locator(
            "//label[contains (text(), 'AZM')]/preceding-sibling::button",
        );
        const isAzmLinked = await azmToggle.getAttribute("aria-checked");
        if (isAzmLinked === "false") {
            await azmToggle.click();
            await page.waitForTimeout(5000);
            await expect(azmToggle).toHaveAttribute("aria-checked", "true");
        } else {
            await expect(azmToggle).toHaveAttribute("aria-checked", "true");
        }

        // Partcipating banks
        await expect(page.getByText(/قائمة الجهات التمويلية/i)).toBeVisible({
            timeout: 30000,
        });
        await page.getByText(/قائمة الجهات التمويلية/i).click();
        await expect(
            page.getByRole("checkbox", { name: "Select all rows" }),
        ).toBeVisible({ timeout: 30000 });
        await page.getByRole("checkbox", { name: "Select all rows" }).click();
        await page.getByRole("button", { name: "حفظ" }).click();

        // Import units
        await page.getByRole("tab", { name: "الوحدات", exact: true }).click();
        await expect(
            page.getByRole("button", { name: "استيراد وحدة جديدة" }),
        ).toBeVisible({ timeout: 30000 });
        await page.getByRole("button", { name: "استيراد وحدة جديدة" }).click();
        await expect(
            page.getByRole("combobox", { name: "نوع الوحدة السكنية" }),
        ).toBeVisible({ timeout: 30000 });
        await page.getByRole("combobox", { name: "نوع الوحدة السكنية" }).click();
        await page.getByRole("option", { name: "شقة" }).click();
        const unitsImportFilePath = path.join(
            process.cwd(), "src",
            "data",
            "Offplan_MOH.xlsx",
        );
        await page
            .locator("//input[@type='file']")
            .setInputFiles(unitsImportFilePath);
        await page.getByRole("button", { name: " حفظ" }).click();

        const importInProgress = page.getByText("تحت الإجراء ...", { exact: true });
        await expect(importInProgress).toBeVisible({ timeout: 120000 });
        await page.waitForTimeout(5000);
        await page.reload();
        const fileProcessedMessage = page.getByText("تم إكمال الإجراء", {
            exact: true,
        });
        let completedVisible = false;

        while (!completedVisible) {
            completedVisible = await fileProcessedMessage
                .isVisible()
                .catch(() => false);
            if (!completedVisible) {
                await page.reload();
                await page.waitForTimeout(3000);
                continue;
            }
        }
        await page.getByRole("button", { name: "اعتماد" }).click();
        await page.getByRole("button", { name: "موافق" }).click();
        await page.waitForTimeout(3000);
        await page.getByRole("button", { name: "رجوع" }).click();

        // //Upload media
        await page
            .locator("span")
            .filter({ hasText: /المحتوى المرئي/i })
            .first()
            .click();
        const bannerImagePath = path.join(
            process.cwd(), "src",
            "data",
            "Sample image.jpg",
        );
        await page
            .locator(
                "//h1[contains (text(), 'الصورة الإعلانية')]/parent::div/following-sibling::div/child::input[@type='file']",
            )
            .setInputFiles(bannerImagePath);
        await page.locator("//mat-icon[contains (text(), 'file_upload')]").click();
        await page
            .locator("div")
            .filter({ hasText: /^Display method$/ })
            .first()
            .click();
        await page.getByText("Hero").click();
        await page
            .getByRole("textbox", { name: "عنوان صفحة التفاصيل (باللغة العربية)" })
            .fill(projectName);
        await page
            .getByRole("textbox", { name: "عنوان صفحة التفاصيل (باللغة الإنجليزية)" })
            .fill(projectName);
        await page
            .getByRole("textbox", { name: "تاريخ جهوزية أول وحدة" })
            .fill("2026-01-01");
        await page
            .getByRole("textbox", { name: "الاسم (باللغة العربية)" })
            .fill("test bb");
        await page
            .getByRole("textbox", { name: "الاسم (باللغة الإنجليزية)" })
            .fill("test bb");
        await page
            .getByRole("textbox", { name: "الملخص AR" })
            .fill(
                "الملخص ARالملخص ARالملخص ARالملخص ARالملخص ARالملخص ARالملخص ARالملخص AR",
            );
        await page
            .getByRole("textbox", { name: "ملخص EN" })
            .fill(
                "Summary EN Summary EN Summary EN Summary EN Summary EN Summary EN Summary EN Summary EN Summary EN",
            );
        await page
            .getByRole("textbox", { name: "الوصف (باللغة العربية)" })
            .fill(
                "الوصف (باللغة العربية)الوصف (باللغة العربية)الوصف (باللغة العربية)الوصف (باللغة العربية)الوصف (باللغة العربية)الوصف (باللغة العربية)الوصف (باللغة العربية)",
            );
        await page
            .getByRole("textbox", { name: "الوصف (باللغة الإنجليزية)" })
            .fill(
                "Description EN Description EN Description EN Description EN Description EN Description EN Description EN Description EN Description EN",
            );
        await page.getByRole("textbox", { name: "السعر يبدأ من" }).fill("500000");
        await page.getByRole("spinbutton", { name: "خط العرض" }).fill("1.1");
        await page.getByRole("spinbutton", { name: "خط الطول" }).fill("1.1");
        await expect(
            page.locator("//button[contains (@class, 'uploadStatus')]"),
        ).toBeVisible({ timeout: 120000 });
        await page.waitForTimeout(1500);
        await page.locator("#save_btn").click();

        // // Approve media
        await page.getByRole("tab", { name: "تفاصيل المشروع" }).click();
        await page
            .getByRole("button", { name: "تقديم طلب موافقة على نشر المحتوى المرفوع" })
            .click();
        await page
            .getByRole("button", { name: "قبول المحتوى المرئي المرفوع" })
            .click();
        await page.getByRole("button", { name: "إبقاء المشروع غير منشور" }).click();
        await page.getByRole("button", { name: "حفظ" }).click();
        await expect(saveSuccessToast).toBeVisible({ timeout: 120000 });

        // // Publish unit model
        await page.getByText("نماذج الوحدات").click();
        await page.getByRole("cell", { name: "model_1" }).click();
        await page.getByRole("button", { name: "حفظ" }).click();
        await page.getByText("المحتوى المرئي ( مسودة )").click();
        await page.getByRole("button", { name: "حفظ" }).click();
        await page
            .getByRole("button", { name: "تقديم طلب موافقة على نشر المحتوى المرفوع" })
            .click();
        await page
            .getByRole("button", { name: "قبول المحتوى المرئي المرفوع" })
            .click();
        await page.getByRole("button", { name: "وحدة النشر" }).click();
        await page.locator("a").filter({ hasText: "model_1 - شقة" }).click();

        // Navigate to project details page
        await page.getByText("تفاصيل المشروع").click();

        // Select status to be available
        await page.locator("//mat-select[@formcontrolname='status']").click();
        await page.getByRole("option", { name: "متاح" }).click();

        //Save project details
        await page.getByRole("button", { name: "حفظ" }).click();
        // await expect(saveSuccessToast).toBeVisible({ timeout: 120000 });

        // Check the bookable toggle
        const bookingAvailableToggle = page.locator(
            "//label[contains (text(), 'قابل للحجز')]/preceding-sibling::button",
        );
        await expect(bookingAvailableToggle).toBeVisible({ timeout: 30000 });
        const isBookingAvailable =
            await bookingAvailableToggle.getAttribute("aria-checked");
        if (isBookingAvailable === "false") {
            await bookingAvailableToggle.click();
            await expect(bookingAvailableToggle).toHaveAttribute(
                "aria-checked",
                "true",
            );
        } else {
            await expect(bookingAvailableToggle).toHaveAttribute(
                "aria-checked",
                "true",
            );
        }

        // Publish project
        const publishProjectToggle = page.locator(
            "//label[contains (text(), 'هل تم نشر المشروع')]/preceding-sibling::button",
        );
        await expect(publishProjectToggle).toBeVisible({ timeout: 30000 });
        const isPublished = await publishProjectToggle.getAttribute("aria-checked");
        if (isPublished === "false") {
            await publishProjectToggle.click();
            await expect(publishProjectToggle).toHaveAttribute("aria-checked", "true");
        } else {
            await expect(publishProjectToggle).toHaveAttribute("aria-checked", "true");
        }
        await page.getByRole("button", { name: "حفظ" }).click();
        await expect(saveSuccessToast).toBeVisible({ timeout: 120000 });
    });

    test("TC-02 - Developer adds payment schedules", { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const app = new WebApp(page);
        const environment = readResaleData.environments;
        const projectName = readResaleData.services["resale-of-units"].projectName;
        const developerUserId = readResaleData.services["resale-of-units"].developerUserId;

        await app.developerProjectPage.gotoAuth(environment.sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();
        await app.developerProjectPage.openProjectBySearch(projectName);

        await app.developerProjectPage.openPaymentSchedulesTab();
        await app.developerProjectPage.addPaymentSchedule({
            type: "cash",
            scheduleName: "Cash 22",
            completionPercentageOneValue: "50",
            percentageOneValue: "50",
            completionPercentageTwoValue: "100",
            percentageTwoValue: "50"
        });

        await app.developerProjectPage.openProjectBySearch(projectName);
        await app.developerProjectPage.openPaymentSchedulesTab();
        await app.developerProjectPage.addPaymentSchedule({
            type: "lending",
            scheduleName: "Lending 22",
            completionPercentageOneValue: "50",
            percentageOneValue: "50",
            completionPercentageTwoValue: "100",
            percentageTwoValue: "50"
        });
    });

    test("TC-03 - Developer approves sales contract", { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const app = new WebApp(page);
        const environment = readResaleData.environments;
        const projectName = readResaleData.services["resale-of-units"].projectName;
        const developerUserId = readResaleData.services["resale-of-units"].developerUserId;

        await logStep("Step 01: Navigate to partners portal > Login");
        await app.developerProjectPage.gotoAuth(environment.sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();

        await logStep("Step 02: Navigate to searched project > Navigate to sale contracts ");
        await app.developerProjectPage.openProjectBySearch(projectName);
        await app.developerProjectPage.openSalesContractsTab();
        await app.developerProjectPage.viewAndApproveSalesContract();

        await logStep("Step 03: Approve sales contract and verify is approved");
        await app.developerProjectPage.approveUnitSpecification();
        await app.developerProjectPage.fillOtp("1234");
        await app.developerProjectPage.verifyOtp();
        await app.developerProjectPage.verifyApprovalSuccessMessage();
    });

    test("TC-04 - Seller books offplan unit and pay the fees", { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const app = new WebApp(page);
        const environment = readResaleData.environments;
        const projectName = readResaleData.services["resale-of-units"].projectName;
        const seller = readResaleData.services["resale-of-units"].sellerUserId;
        const userPortalUrl = environment.userPortalUrl;

        await logStep("Step 01: Navigate to user portal > Login");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();
        await app.loginPage.openLogin();
        await app.loginPage.loginWithNafath(seller);
        await app.loginPage.waitForNafathPromptToDisappear();
        await app.loginPage.continueNewUserPopup();
        await app.loginPage.handlePushNotificationPopup();
        await logStep("Step 02: Search for project > View units");
        await app.marketplaceLandingPage.openSearch();
        await app.marketplaceLandingPage.searchForProject(projectName);
        await app.projectDetailsPage.openUnitsAndScroll();

        await logStep("Step 03: Reserve unit > Pay the fees and verify the unit is booked");
        const page1Promise = page.waitForEvent("popup");
        await app.marketplaceLandingPage.openResidentialUnit();
        const page1 = await page1Promise;
        const page2Promise = page1.waitForEvent("popup");

        {
            const unitApp = new WebApp(page1);
            await unitApp.projectUnitsPage.openUnitInPopup(1);
        }

        const page2 = await page2Promise;

        {
            let bookingPage = page2;
            let bookingApp = new WebApp(bookingPage);
            await bookingApp.unitDetailsPage.reserveUnit();

            await bookingApp.unitBookingPage.acceptTermsAndConfirm();
            await bookingApp.paymentGatewayPage.fillCardDetails();
            await bookingApp.paymentConfirmationPage.closePayment();
            await bookingApp.paymentConfirmationPage.expectSuccessMessage();
        }
    });

    test("TC-05 - Seller signs sales contract", { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const app = new WebApp(page);
        const seller = readResaleData.services["resale-of-units"].sellerUserId;
        const userPortalUrl = readResaleData.environments.userPortalUrl;

        await logStep("Step 01: Open user portal");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();

        await logStep("Step 02: Log in with Nafath");
        await app.loginPage.openLogin();
        await app.loginPage.loginWithNafath(seller);
        await app.loginPage.waitForNafathPromptToDisappear();
        await app.loginPage.continueNewUserPopup();
        await app.loginPage.handlePushNotificationPopup();

        await logStep("Step 03: Open active bookings");
        await app.bookingPage.openActiveBookings();
        const bookedUnitCode = await app.bookingPage.getBookedUnitCode();
        expect(bookedUnitCode).toBeTruthy();
        DataHelper.updateServiceData("test-data.json", "resale-of-units", "bookedUnitCode", bookedUnitCode);

        await logStep("Step 04: Open booking details > Sign the sales contract");
        await app.bookingPage.openBookingDetails();
        await app.unitDetailsPage.openSalesContract();
        await app.unitBookingPage.signSalesContract();
        await app.unitBookingPage.expectSalesContractSuccess();
    });

    test("TC-06 - Developer confirms the booking", { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const app = new WebApp(page);
        const developerUserId = readResaleData.services["resale-of-units"].developerUserId;
        const sapaPortalUrl = readResaleData.environments.sapaPortalUrl;
        const bookedUnitCode = readResaleData.services["resale-of-units"].bookedUnitCode;

        await logStep("Step 01: Navigate to partners portal > Login");
        await app.developerProjectPage.gotoAuth(sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();

        await logStep("Step 02: Navigate to booking page > Confirm booking");
        await app.developerProjectPage.confirmBooking(bookedUnitCode);
    });


    test("TC-07 - Admin configures project-level of resale settings", { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const app = new WebApp(page);

        const adminPortalUrl = readResaleData.environments.adminPortalUrl;
        const adminUsername = readResaleData.services["resale-of-units"].adminUsername;
        const adminPassword = readResaleData.services["resale-of-units"].adminPassword;
        const projectName = readResaleData.services["resale-of-units"].projectName;

        await logStep("Step 01: Login to admin platform");
        await app.adminProjectPage.login(
            adminPortalUrl,
            adminUsername,
            adminPassword,
        );

        await logStep("Step 02: Search for project > navigate to resale settings");
        await app.adminProjectPage.openProjects();
        await app.resaleOfUnitsPage.fillProjectName(projectName);
        await app.resaleOfUnitsPage.clickProjectSearchButton();
        await app.resaleOfUnitsPage.clickSearchedProjectResult(projectName);
        await app.resaleOfUnitsPage.clickOnResaleSettingTab();

        await logStep("Step 03: Apply the confiqguartion and save");
        await app.resaleOfUnitsPage.clickOnuseGeneralResaleSettingsSwitch();
        await app.resaleOfUnitsPage.selectResaleFeeType();
        await app.resaleOfUnitsPage.fillResaleFeeValue(10);
        await app.resaleOfUnitsPage.clickOnSaveButton();
        await app.resaleOfUnitsPage.verifyTheToastMessage();
    });



    test("TC-08 - Seller submits new resale request for unkown buyer", { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const app = new WebApp(page);
        const seller = readResaleData.services["resale-of-units"].sellerUserId;
        const userPortalUrl = readResaleData.environments.userPortalUrl;

        await logStep("Step 01: Open user portal");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();

        await logStep("Step 02: Log in with Nafath");
        await app.loginPage.openLogin();
        await app.loginPage.loginWithNafath(seller);
        await app.loginPage.waitForNafathPromptToDisappear();
        await app.loginPage.continueNewUserPopup();
        await app.loginPage.handlePushNotificationPopup();

        await logStep("Step 03: Open complete bookings");
        await app.bookingPage.openCompletedBookings();
        const bookedUnitCode = await app.bookingPage.getBookedUnitCode();
        expect(bookedUnitCode).toBeTruthy();
        DataHelper.updateServiceData("resale-of-units", "bookedUnitCode", bookedUnitCode);

        await logStep("Step 04: Open booking details > Click on resale of units");
        await app.bookingPage.openBookingDetails();
        await app.resaleOfUnitsPage.clickOnResaleOfUnitsButton();

        await logStep("Step 05: Select assign to unkown buyer");
        await app.resaleOfUnitsPage.clickOnAssignWithoutBuyerOption();

        await logStep("Step 06: Click on next to fainancial information");
        await app.resaleOfUnitsPage.clickOnNextToFinancialInfoButton();

        await logStep("Step 07: Select and fill resale reason and fill waiver amount");
        await app.resaleOfUnitsPage.selectResaleReason();
        await app.resaleOfUnitsPage.fillResaleReasonDetails("test resale deatils");
        await app.resaleOfUnitsPage.fillWaiverAmount(100);

        await logStep("Step 08: Select payment method");
        await app.resaleOfUnitsPage.selectPaymentMethod();

        await logStep("Step 09: Add an istallment");
        await app.resaleOfUnitsPage.fillPriceAmountInputfield(100);
        await app.resaleOfUnitsPage.fillPriceAmountPercentageInputfield(100);
        await app.resaleOfUnitsPage.fillCompletionPercentageInputfield(100);
        await app.resaleOfUnitsPage.selectStatus();
        await app.resaleOfUnitsPage.clickOnAddInstallmentButton();

        await logStep("Step 10: Check on desclaimer waiver then click on submit the request");
        await app.resaleOfUnitsPage.clickOnDisclaimerWaiverCheckbox();
        await app.resaleOfUnitsPage.clickOnSubmitButton();
        await app.resaleOfUnitsPage.getAndSaveRequestNumber();

    });


    test("TC-09 - Developer approves unknown-buyer request", { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const app = new WebApp(page);
        const environment = readResaleData.environments;
        const projectName = readResaleData.services["resale-of-units"].projectName;
        const developerUserId = readResaleData.services["resale-of-units"].developerUserId;
        const requestNumber = readResaleData.services["resale-of-units"].requestNumber

        await logStep("Step 01: Open partners portal");
        await app.developerProjectPage.gotoAuth(environment.sapaPortalUrl);

        await logStep("Step 02: Login to the platfrom");
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();

        await logStep("Step 03: Click on resale requests from side menu");
        await app.resaleOfUnitsPage.clickOnResaleRequestSideMenu();

        await logStep("Step 04: Search by reference number and click on view deatails");
        await app.resaleOfUnitsPage.selectSearchByReference();
        await app.resaleOfUnitsPage.fillRequestNumberInputfield(requestNumber);
        await app.resaleOfUnitsPage.clickOnViewDetailsButton();

        await logStep("Step 05: Approve the request and verify the request is apporved");
        await app.resaleOfUnitsPage.clickOnApproveButton();
        await app.resaleOfUnitsPage.clickOnSendButton();
        await app.resaleOfUnitsPage.verifyTheRequestisApproved();

    });





    test("TC-10 - Admin adds a buyer", { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const app = new WebApp(page);

        const adminPortalUrl = readResaleData.environments.adminPortalUrl;
        const adminUsername = readResaleData.services["resale-of-units"].adminUsername;
        const adminPassword = readResaleData.services["resale-of-units"].adminPassword;
        const buyerId = readResaleData.services["resale-of-units"].buyerUserId;
        const buyerDob = readResaleData.services["resale-of-units"].buyerDOB;
        const requestNumber = readResaleData.services["resale-of-units"].requestNumber;

        await logStep("Step 01: Login to admin platform");
        await app.adminProjectPage.login(
            adminPortalUrl,
            adminUsername,
            adminPassword,
        );

        await logStep("Step 02: Navigate to resale requests page and search for request number");
        await app.adminProjectPage.openResaleRequests();
        await app.resaleOfUnitsPage.fillRequestNumberInputfieldAdmin(requestNumber);
        await app.resaleOfUnitsPage.clickOnSearchButton();
        await app.resaleOfUnitsPage.clickOnSearchedResult();

        await logStep("Step 03: Add buyer information then save");
        await app.resaleOfUnitsPage.clickOnAddBuyerButton();
        await app.resaleOfUnitsPage.fillBuyerIDInputfield(buyerId);
        await app.resaleOfUnitsPage.clickOnBuyerDobInputButton();
        await app.resaleOfUnitsPage.selectBuyerDobFromHijriCalendar(buyerDob);
        await app.resaleOfUnitsPage.clickOnVerifyFromBuyerButton();
        await app.resaleOfUnitsPage.selectBuyerSource();
        await app.resaleOfUnitsPage.clickOnSaveBuyerButton();
        await app.resaleOfUnitsPage.verifyBuyerAddedToastMessage();
    });





    test("TC-11 - Buyer signs contract and pays waiver", { annotation: [{ product: 'Shared Product', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const app = new WebApp(page);
        const buyerId = readResaleData.services["resale-of-units"].buyerUserId;
        const userPortalUrl = readResaleData.environments.userPortalUrl;

        await logStep("Step 01: Open user portal");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();

        await logStep("Step 02: Log in with Nafath");
        await app.loginPage.openLogin();
        await app.loginPage.loginWithNafath(buyerId);
        await app.loginPage.waitForNafathPromptToDisappear();
        await app.loginPage.continueNewUserPopup();
        await app.loginPage.handlePushNotificationPopup();

        await logStep("Step 03: Open wating to sign contract");
        await app.resaleOfUnitsPage.openWaitingToSignContract();

        await logStep("Step 04: Open request details > Click confirm booking");
        await app.resaleOfUnitsPage.clickOnViewButton();
        await app.resaleOfUnitsPage.clickOnConfirmBookingButton();

        await logStep("Step 05: Click on approve sale contract and pay waiver amount");
        await app.resaleOfUnitsPage.clickOnApproveSaleContractButton();
        await app.resaleOfUnitsPage.enterOTP();
        await app.resaleOfUnitsPage.clickOnVerifyButton();
        await app.paymentGatewayPage.fillCardDetails();
        await app.resaleOfUnitsPage.verifyWaiverFeesSuccessfullyPaidMessage();

    });

});