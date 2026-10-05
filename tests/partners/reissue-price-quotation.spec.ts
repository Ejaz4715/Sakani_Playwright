import { test, expect, Page } from "@playwright/test";
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
import { WebApp } from "@base-class/web-app";
import { logStep } from '@helpers/LogSteps'
import { DateUtils } from "@pages/utils/DateUtils";
import { DataHelper } from "@helpers/DataHelper";
import testDataReissuePriceQuotation from "@data/test-data.json";

const testDataPath = path.join(process.cwd(), "src", "data", "test-data.json");

function readTestData() {
    return JSON.parse(fs.readFileSync(testDataPath, "utf8"));
}

function writeTestData(data: any) {
    fs.writeFileSync(testDataPath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function updateReissuePriceQuotationTestData(key: string, value: string) {
    const testData = readTestData();
    testData.services["reissue-price-quotation"] = {
        ...testData.services["reissue-price-quotation"],
        [key]: value,
    };
    writeTestData(testData);
}

test.describe("Reissue Price Quotation For The Beneficiaries", () => {

    //tc1 add project
    test("TC-01 - Add new project", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const testData = readTestData();
        const app = new WebApp(page);
 const environments = testDataReissuePriceQuotation.environments;
        const data = testDataReissuePriceQuotation.services["reissue-price-quotation"];
        const currentDate = DateUtils.getDateISO(600);
        const projectName = `Automation Project ${new Date()
            .toISOString()
            .replace(/[-:T.]/g, "")
            .slice(0, 14)}`;
        // const updatedData = {
        //     ...testData,
        //     projectName,
        //     services: {
        //         ...testData.services,
        //         "reissue-price-quotation": {
        //             ...testData.services["reissue-price-quotation"],
        //             projectName,
        //         },
        //     },
        // };
        // writeTestData(updatedData);

        // Project details
        await app.adminProjectPage.login(
            environments.adminPortalUrl,
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
        await page.waitForTimeout(5000);
        await page.getByRole("checkbox", { name: "Select all rows" }).click();
        await page.waitForTimeout(5000);
        await page.getByRole("button", { name: "حفظ" }).click();

        // Import units
        await page.getByRole("tab", { name: "الوحدات", exact: true }).click();

        await expect(
            page.getByRole("button", { name: "استيراد وحدة جديدة" }),
        ).toBeVisible({ timeout: 30000 });
        await page.getByRole("button", { name: "استيراد وحدة جديدة" }).click();
        await page.waitForTimeout(4000);
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
        await page.waitForTimeout(16000);
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
        await page.locator("input[formcontrolname='guarantees_after_service']").fill("الضمانات وخدمة ما بعد البيع");
        await expect(
            page.locator("//button[contains (@class, 'uploadStatus')]"),
        ).toBeVisible({ timeout: 120000 });
        await page.waitForTimeout(1500);
        await page.locator("#save_btn").click();

        // // Approve media
        await page.getByRole("tab", { name: "تفاصيل المشروع" }).click();

        await page.waitForTimeout(5000);

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




    test("TC-02 - Developer approves sales contract", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        const data = testDataReissuePriceQuotation.services["reissue-price-quotation"];
        const environments = testDataReissuePriceQuotation.environments;
        // const testData = readTestData();
        // const reissueData = testData.services["reissue-price-quotation"];
        const app = new WebApp(page);
        const sapaUrl = environments.sapaPortalUrl;
        const projectName = data.projectName;
        const developerUserId = data.developerUserId;
        await logStep("Step 01: Navigate to partners portal > Login");
        await app.developerProjectPage.gotoAuth(sapaUrl);
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




    test("TC-03 - User books offplan unit and pay the fees", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        // const testData = readTestData();
        // const reissueData = testData.services["reissue-price-quotation"];;
        const data = testDataReissuePriceQuotation.services["reissue-price-quotation"];
        const environments = testDataReissuePriceQuotation.environments;
        const app = new WebApp(page);
        const userPortalUrl = environments.userPortalUrl;
        const userID = data.sakaniUserId;
        const projectName = data.projectName;

        await logStep("Step 01: Navigate to user portal > Login");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();
        await app.loginPage.openLogin();
        await app.loginPage.loginWithNafath(userID);
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




    test("TC-04 - User signs sales contract", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        // const testData = readTestData();
        // const reissueData = testData.services["reissue-price-quotation"];
        const data = testDataReissuePriceQuotation.services["reissue-price-quotation"];
        const environments = testDataReissuePriceQuotation.environments;
        const app = new WebApp(page);
        const userPortalUrl = environments.userPortalUrl;
        const userID = data.sakaniUserId;

        await logStep("Step 01: Login to user protal");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();
        await app.loginPage.openLogin();
        await app.loginPage.loginWithNafath(userID);
        await app.loginPage.waitForNafathPromptToDisappear();
        await app.loginPage.continueNewUserPopup();
        await app.loginPage.handlePushNotificationPopup();
        await logStep("Step 02 Navigate to active booking");
        await app.bookingPage.openActiveBookings();
        const bookedUnitCode =
            await app.bookingPage.getBookedUnitCode();
        expect(bookedUnitCode).toBeTruthy();
        updateReissuePriceQuotationTestData("bookedUnitCode", bookedUnitCode);
        await logStep("Step 03: Sign the sale contract > Verify the success message");
        await app.bookingPage.openBookingDetails();
        await app.unitDetailsPage.openSalesContract();
        await app.unitBookingPage.signSalesContract();
        await app.unitBookingPage.expectSalesContractSuccess();
    });


    //  test("TC-05 - Developer extend price quotation", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
    //     test.setTimeout(0);
    //     const testData = readTestData();
    //     const reissueData = testData.services["reissue-price-quotation"];
    //     const app = new WebApp(page);
    //     const unitCode = reissueData.bookedUnitCode;
    //     const developerUserId = reissueData.developerUserId;
    //     const sapaUrl = testData.environments.sapaPortalUrl;
    //     await logStep("Step 01: Navigate to partners portal > Login");
    //     await app.developerProjectPage.gotoAuth(sapaUrl);
    //     await app.developerProjectPage.loginDeveloper(developerUserId);
    //     await app.developerProjectPage.switchRoleToDeveloper();
    //     await logStep("Step 02: Navigate to the booked unit details");
    //     await app.discountOnReservedUnitsPage.clickOnManageBookingsButton();
    //     await app.discountOnReservedUnitsPage.clickOnIndividualBookingsButton();
    //     await app.discountOnReservedUnitsPage.fillSearchForUnitOrIDInputfield(unitCode);
    //     await app.discountOnReservedUnitsPage.selectPriceQuotationStatus();
    //     await app.discountOnReservedUnitsPage.clickOnViewDetailsOfSearchedResultButton();
    //     await logStep("Step 03: Navigate to price quotation > Click on extend price quotation then verify the success toast message");
    //     await app.discountOnReservedUnitsPage.clickOnPriceQuotationTab();
    //     await app.discountOnReservedUnitsPage.clickOnExtendPriceQuotationButton();
    //     await app.discountOnReservedUnitsPage.verifyPriceQuotationExtendSuccessMessage();

    // });

    test("TC-05 - Developer reissue price quotation", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        // const testData = readTestData();
        // const reissueData = testData.services["reissue-price-quotation"];
        const data = testDataReissuePriceQuotation.services["reissue-price-quotation"];
        const environments = testDataReissuePriceQuotation.environments;
        const app = new WebApp(page);
        const unitCode = data.bookedUnitCode;
        const developerUserId = data.developerUserId;
        const sapaUrl = environments.sapaPortalUrl;
        await logStep("Step 01: Navigate to partners portal > Login");
        await app.developerProjectPage.gotoAuth(sapaUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();
        await logStep("Step 02: Navigate to the booked unit details");
        await app.discountOnReservedUnitsPage.clickOnManageBookingsButton();
        await app.discountOnReservedUnitsPage.clickOnIndividualBookingsButton();
        await app.discountOnReservedUnitsPage.fillSearchForUnitOrIDInputfield(unitCode);
        await app.discountOnReservedUnitsPage.selectPriceQuotationStatus();
        await app.discountOnReservedUnitsPage.clickOnViewDetailsOfSearchedResultButton();
        await logStep("Step 03: Navigate to price quotation > Click on reissue price quotation then verify the success toast message");
        await app.discountOnReservedUnitsPage.clickOnPriceQuotationTab();
        await app.discountOnReservedUnitsPage.clickOnReissuePriceQuotationButton();
        await app.discountOnReservedUnitsPage.verifyPriceQuotationReissueSuccessMessage();

    });
    test("TC-06 - Developer cancel the booking", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        // const testData = readTestData();
        // const reissueData = testData.services["reissue-price-quotation"];
        const data = testDataReissuePriceQuotation.services["reissue-price-quotation"];
        const environments = testDataReissuePriceQuotation.environments;
        const app = new WebApp(page);
        const unitCode = data.bookedUnitCode;
        const developerUserId = data.developerUserId;
        const sapaUrl = environments.sapaPortalUrl;
        await logStep("Step 01: Navigate to partners portal > Login");
        await app.developerProjectPage.gotoAuth(sapaUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();
        await logStep("Step 02: Navigate to the booked unit details");
        await app.discountOnReservedUnitsPage.clickOnManageBookingsButton();
        await app.discountOnReservedUnitsPage.clickOnIndividualBookingsButton();
        await app.discountOnReservedUnitsPage.fillSearchForUnitOrIDInputfield(unitCode);
        await app.discountOnReservedUnitsPage.selectPriceQuotationStatus();
        await app.discountOnReservedUnitsPage.clickOnViewDetailsOfSearchedResultButton();
        await logStep("Step 03: Navigate to booking details > Click on cancel booking and select reason then verify the success toast message");
        await app.discountOnReservedUnitsPage.clickOnBookingsTab();
        await app.discountOnReservedUnitsPage.selectCancellationReasonOption();
        await app.discountOnReservedUnitsPage.clickOnCancelBookingButton();
        await app.discountOnReservedUnitsPage.clickOnContinueCancellationButton();
        await app.discountOnReservedUnitsPage.clickOnNoButton();
        await app.discountOnReservedUnitsPage.clickOnYesButton();
        //await app.developerProjectPage.fillOtp();
        await app.discountOnReservedUnitsPage.fillCancellationOtpCodeInput(1234);
        await app.discountOnReservedUnitsPage.clickOnVerifyCancellationCodeButton();
        await app.discountOnReservedUnitsPage.verifyBeneficiaryCancellationToastSuccessMessage();

    });


});
