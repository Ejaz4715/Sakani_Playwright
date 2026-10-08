import {expect, Locator, Page, test} from "@playwright/test";
import {WebApp} from "@base-class/web-app";
import {DateUtils} from "@pages/utils/DateUtils";
import {DataHelper} from "@helpers/DataHelper";
import {logStep} from "@helpers/LogSteps";

const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const SERVICE = "unit-delivery";

const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;
const writeServiceData = (key: string, value: any) => DataHelper.updateServiceData(SERVICE, key, value);

const DEFAULT_TIMEOUT = 30_000;
const LONG_TIMEOUT = 90_000;

async function waitAndClick(locator: Locator, timeout = DEFAULT_TIMEOUT) {
    await locator.waitFor({state: 'visible', timeout});
    await locator.click();
}

async function waitAndFill(locator: Locator, value: string, timeout = DEFAULT_TIMEOUT) {
    await locator.waitFor({state: 'visible', timeout});
    await locator.fill(value);
}

const unitCheckbox = (page: Page, row: number) => page.locator(`//datatable-row-wrapper[${row}]/datatable-body-row/div[3]/datatable-body-cell/div/div/app-sapa-checkbox-v2/div/div/input/..`);

test.describe("Unit Delivery Partner/Marketplace", () => {
    let deliveryUnitCode: string;

    test("TC-01 - Add new project", {
        annotation: [{
            product: 'Marketplace', type: 'critical'
        }] as any
    }, async ({page}) => {
        const data = readServiceData();
        const environments = readEnvironments();
        const app = new WebApp(page);

        const currentDate = DateUtils.getDateISO(600);
        const projectName = `Automation Project ${new Date()
            .toISOString()
            .replace(/[-:T.]/g, "")
            .slice(0, 14)}`;
        writeServiceData("projectName", projectName);

        // Project details

        await logStep("Step 01: Navigate to admin portal > Login");
        await app.adminProjectPage.login(environments.adminPortalUrl, data.adminUsername, data.adminPassword);

        await logStep("Step 02: Create new project > Fill project details > Save");
        await app.adminProjectPage.openProjectCreation();
        await page
            .locator("form-field-component")
            .filter({hasText: "إسم المشروع *"})
            .getByPlaceholder("إسم المشروع")
            .fill(projectName);
        const projectTypeDropdown = page.locator("//mat-select[@formcontrolname='project_type']",);
        const projectTypeOption = page.getByText("مشاريع البيع على الخارطة على أراضي الوزارة", {exact: true},);

        let projectTypeVisible = false;
        for (let attempt = 0; attempt < 5; attempt++) {
            await projectTypeDropdown.click();
            projectTypeVisible = await projectTypeOption.isVisible().catch(() => false);

            if (projectTypeVisible) {
                break;
            }

            await page.waitForTimeout(2000);
        }

        await expect(projectTypeOption).toBeVisible({timeout: 30000});
        await projectTypeOption.click();
        await page
            .locator("//ng-select[@formcontrolname='region_id']")
            .getByRole("combobox")
            .click();
        await page.getByText("الرياض").click();
        await page.locator("//input[@id='inputCity']").click();
        await page.getByRole("option", {name: "الخرج", exact: true}).click();
        await page
            .locator("//input[@id='inputDeveloper']")
            .fill("شركة الضاحية المثالية للتطوير والاستثمار العقاري");
        await page
            .getByText(/شركة الضاحية المثالية للتطوير والاستثمار العقاري.*/)
            .click();
        await page.getByRole("switch", {name: "قابل للحجز؟"}).click();
        await page.locator("//mat-select[@formcontrolname='status']").click();
        await page.getByRole("option", {name: "متاح"}).click();
        await page
            .getByRole("textbox", {name: "تاريخ انتهاء رخصة البيع في وافي"})
            .fill(currentDate);
        await page.locator("//mat-select[@formcontrolname='subsidy_type']").click();
        await page.getByText("دعم عيني كامل").click();
        await page
            .locator("//input[@formcontrolname='max_subsidy_amount']")
            .fill("2");
        await page
            .getByRole("textbox", {name: "تاريخ توقيع الاتفاقيه للمشروع"})
            .fill("2026-01-01");
        await page.getByRole("textbox", {name: "رقم ترخيص المشروع"}).fill("665334");
        await page
            .getByRole("textbox", {name: "تاريخ ترخيص المشروع"})
            .fill("2026-01-01");
        await page
            .getByRole("textbox", {name: "اسم حساب الضمان"})
            .fill("Test user");
        await page
            .getByRole("textbox", {name: "رقم حساب الضمان"})
            .fill("SA1111111111111111111111");
        await page
            .locator("//app-nsar-dropdown[@formcontrolname='bank_name']/descendant::ng-select",)
            .first()
            .click();
        await page.getByText("بنك الأهلي السعودي").click();
        await page.locator("//input[@formcontrolname='deduct_percentage']").fill("2");
        await page
            .getByRole("textbox", {name: "المدينة المصدر منها الصك (بالعربية)"})
            .fill("test");
        await page
            .getByRole("textbox", {name: "المدينة المصدر منها الصك (بالإنجليزية)"})
            .fill("test");
        await page.getByRole("textbox", {name: "DD/MM/YYYY"}).fill("01/01/2026");
        await page.getByRole("button", {name: "حفظ"}).click();
        const saveSuccessToast = page.locator("//app-toasts").getByText("تم الحفظ بنجاح!");
        await expect(saveSuccessToast).toBeVisible({timeout: 120000});


        await logStep("Step 03: Link the project with AZM");
        // Link with AZM
        await page.waitForTimeout(3000);
        const azmToggle = page.locator("//label[contains (text(), 'AZM')]/preceding-sibling::button",);
        const isAzmLinked = await azmToggle.getAttribute("aria-checked");
        if (isAzmLinked === "false") {
            await azmToggle.click();
            await page.waitForTimeout(5000);
            await expect(azmToggle).toHaveAttribute("aria-checked", "true");
        } else {
            await expect(azmToggle).toHaveAttribute("aria-checked", "true");
        }


        await logStep("Step 04: Select the participating banks");
        // Partcipating banks
        await expect(page.getByText(/قائمة الجهات التمويلية/i)).toBeVisible({
            timeout: 30000,
        });
        await page.getByText(/قائمة الجهات التمويلية/i).click();
        await expect(page.getByRole("checkbox", {name: "Select all rows"}),).toBeVisible({timeout: 30000});
        await page.getByRole("checkbox", {name: "Select all rows"}).click();
        await page.getByRole("button", {name: "حفظ"}).click();

        await logStep("Step 05: Import the project units > Approve the import");
        // Import units
        await page.getByRole("tab", {name: "الوحدات", exact: true}).click();
        await expect(page.getByRole("button", {name: "استيراد وحدة جديدة"}),).toBeVisible({timeout: 30000});
        await page.getByRole("button", {name: "استيراد وحدة جديدة"}).click();
        await expect(page.getByRole("combobox", {name: "نوع الوحدة السكنية"}),).toBeVisible({timeout: 30000});
        await page.waitForTimeout(3000);
        await page.getByRole("combobox", {name: "نوع الوحدة السكنية"}).click();
        await page.getByRole("option", {name: "شقة"}).click();
        const unitsImportFilePath = path.join(process.cwd(), "src", "data", "Offplan_MOH.xlsx",);
        await page
            .locator("//input[@type='file']")
            .setInputFiles(unitsImportFilePath);
        await page.getByRole("button", {name: " حفظ"}).click();

        const importInProgress = page.getByText("تحت الإجراء ...", {exact: true});
        await expect(importInProgress).toBeVisible({timeout: 120000});
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

            }
        }
        await page.getByRole("button", {name: "اعتماد"}).click();
        await page.getByRole("button", {name: "موافق"}).click();
        await page.waitForTimeout(3000);
        await page.getByRole("button", {name: "رجوع"}).click();

        await logStep("Step 06: Upload the project media");
        // //Upload media
        await page
            .locator("span")
            .filter({hasText: /المحتوى المرئي/i})
            .first()
            .click();
        const bannerImagePath = path.join(process.cwd(), "src", "data", "Sample image.jpg",);
        await page
            .locator("//h1[contains (text(), 'الصورة الإعلانية')]/parent::div/following-sibling::div/child::input[@type='file']",)
            .setInputFiles(bannerImagePath);
        await page.locator("//mat-icon[contains (text(), 'file_upload')]").click();
        await page.waitForTimeout(30000);
        await page
            .locator("div")
            .filter({hasText: /^Display method$/})
            .first()
            .click();
        await page.getByText("Hero").click();
        await page
            .getByRole("textbox", {name: "عنوان صفحة التفاصيل (باللغة العربية)"})
            .fill(projectName);
        await page
            .getByRole("textbox", {name: "عنوان صفحة التفاصيل (باللغة الإنجليزية)"})
            .fill(projectName);
        await page
            .getByRole("textbox", {name: "تاريخ جهوزية أول وحدة"})
            .fill("2026-01-01");
        await page
            .getByRole("textbox", {name: "الاسم (باللغة العربية)"})
            .fill("test bb");
        await page
            .getByRole("textbox", {name: "الاسم (باللغة الإنجليزية)"})
            .fill("test bb");
        await page
            .getByRole("textbox", {name: "الملخص AR"})
            .fill("الملخص ARالملخص ARالملخص ARالملخص ARالملخص ARالملخص ARالملخص ARالملخص AR",);
        await page
            .getByRole("textbox", {name: "ملخص EN"})
            .fill("Summary EN Summary EN Summary EN Summary EN Summary EN Summary EN Summary EN Summary EN Summary EN",);
        await page
            .getByRole("textbox", {name: "الوصف (باللغة العربية)"})
            .fill("الوصف (باللغة العربية)الوصف (باللغة العربية)الوصف (باللغة العربية)الوصف (باللغة العربية)الوصف (باللغة العربية)الوصف (باللغة العربية)الوصف (باللغة العربية)",);
        await page
            .getByRole("textbox", {name: "الوصف (باللغة الإنجليزية)"})
            .fill("Description EN Description EN Description EN Description EN Description EN Description EN Description EN Description EN Description EN",);
        await page.getByRole("textbox", {name: "السعر يبدأ من"}).fill("500000");
        await page.getByRole("spinbutton", {name: "خط العرض"}).fill("1.1");
        await page.getByRole("spinbutton", {name: "خط الطول"}).fill("1.1");
        await expect(page.locator("//button[contains (@class, 'uploadStatus')]"),).toBeVisible({timeout: 120000});
        await page.locator("input[formcontrolname='guarantees_after_service']").fill("الضمانات وخدمة ما بعد البيع");
        await page.waitForTimeout(1000);
        await page.locator("#save_btn").click();


        await logStep("Step 07: Approve the uploaded media");
        // // Approve media
        await page.getByRole("tab", {name: "تفاصيل المشروع"}).click();
        await page.waitForTimeout(20000);
        await page
            .getByRole("button", {name: "تقديم طلب موافقة على نشر المحتوى المرفوع"})
            .click();
        await page
            .getByRole("button", {name: "قبول المحتوى المرئي المرفوع"})
            .click();
        await page.getByRole("button", {name: "إبقاء المشروع غير منشور"}).click();
        await page.getByRole("button", {name: "حفظ"}).click();
        await expect(saveSuccessToast).toBeVisible({timeout: 120000});

        await logStep("Step 08: Publish the unit model");
        // // Publish unit model
        await page.getByText("نماذج الوحدات").click();
        await page.getByRole("cell", {name: "model_1"}).click();
        await page.getByRole("button", {name: "حفظ"}).click();
        await page.getByText("المحتوى المرئي ( مسودة )").click();
        await page.getByRole("button", {name: "حفظ"}).click();
        await page.waitForTimeout(30000);
        await page
            .getByRole("button", {name: "تقديم طلب موافقة على نشر المحتوى المرفوع"})
            .click();
        await page.waitForTimeout(2000);
        await page
            .getByRole("button", {name: "قبول المحتوى المرئي المرفوع"})
            .click();
        await page.waitForTimeout(2000);
        await page.getByRole("button", {name: "وحدة النشر"}).click();
        await page.locator("a").filter({hasText: "model_1 - شقة"}).click();

        await page.waitForTimeout(10000);

        await logStep("Step 09: Set project as available and bookable > Publish the project");
        // Navigate to project details page
        await page.getByText("تفاصيل المشروع").click();

        // Select status to be available
        await page.locator("//mat-select[@formcontrolname='status']").click();
        await page.getByRole("option", {name: "متاح"}).click();

        //Save project details
        await page.getByRole("button", {name: "حفظ"}).click();
        // await expect(saveSuccessToast).toBeVisible({ timeout: 120000 });

        // Check the bookable toggle
        const bookingAvailableToggle = page.locator("//label[contains (text(), 'قابل للحجز')]/preceding-sibling::button",);
        await expect(bookingAvailableToggle).toBeVisible({timeout: 30000});
        const isBookingAvailable = await bookingAvailableToggle.getAttribute("aria-checked");
        if (isBookingAvailable === "false") {
            await bookingAvailableToggle.click();
            await expect(bookingAvailableToggle).toHaveAttribute("aria-checked", "true",);
        } else {
            await expect(bookingAvailableToggle).toHaveAttribute("aria-checked", "true",);
        }

        // Publish project
        const publishProjectToggle = page.locator("//label[contains (text(), 'هل تم نشر المشروع')]/preceding-sibling::button",);
        await expect(publishProjectToggle).toBeVisible({timeout: 30000});
        const isPublished = await publishProjectToggle.getAttribute("aria-checked");
        if (isPublished === "false") {
            await publishProjectToggle.click();
            await expect(publishProjectToggle).toHaveAttribute("aria-checked", "true");
        } else {
            await expect(publishProjectToggle).toHaveAttribute("aria-checked", "true");
        }


        await page.getByRole("button", {name: "حفظ"}).click();
        await expect(saveSuccessToast).toBeVisible({timeout: 120000});

        await page.getByText("تفاصيل المشروع").click();

        await logStep("Step 10: Activate multiple units booking for non-beneficiary > Verify setting is saved");
        // TC_02_Admin | Verify Activate multiple units booking for non-beneficiary settings
        // Project settings
        await page.keyboard.press('PageDown');
        await waitAndClick(page.locator("//span[contains(text(), 'إعدادات المشاريع')]"))
        // تفعيل الحجز المتعدد في سكني (الويب، تطبيقات الهاتف المحمول)
        //await page.locator("//label[contains(text(), ' تفعيل الحجز المتعدد في سكني (الويب، تطبيقات الهاتف المحمول) ')]/../button/div").click();
        await waitAndClick(page.locator("//mat-tab-body[1]/div/div/form/div[2]/div[4]/div[2]/div/div[2]/div[5]/mat-slide-toggle[1]/div/button"))
        // تفعيل الحجز المتعدد في بوابة شركاء
        //await page.locator("//label[contains(text(), ' تفعيل الحجز المتعدد في بوابة شركاء ')]/../button/div").click();
        await waitAndClick(page.locator("//mat-tab-body[1]/div/div/form/div[2]/div[4]/div[2]/div/div[2]/div[5]/mat-slide-toggle[2]/div/button"));

        // عدد الحجوزات المسموح بها لغير المستفيد
        await waitAndFill(page.locator("input[formcontrolname='maximum_booking_per_non_beneficiary']"), "5");

        await page.keyboard.press('PageDown');
        await page.getByRole("button", {name: "حفظ"}).click();
        await expect(saveSuccessToast).toBeVisible({timeout: 120000});
        await page.waitForTimeout(3000);
        expect(await page.locator("input[formcontrolname='maximum_booking_per_non_beneficiary']").inputValue()).toEqual("5");
    });

    test("TC-02 - Developer approves sales contract", {
        annotation: [{
            product: 'Marketplace', type: 'critical'
        }] as any
    }, async ({page}) => {
        const data = readServiceData();
        const environments = readEnvironments();
        const app = new WebApp(page);
        const projectName = data.projectName;
        const developerUserId = data.developerUserId;

        await logStep("Step 01: Navigate to partners portal > Login as developer");
        await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();

        await logStep("Step 02: Search for the project > Open it");
        await app.developerProjectPage.openProjectBySearch(projectName);

        await logStep("Step 03: Approve the sales contract > Verify approval success message");
        await app.developerProjectPage.openSalesContractsTab();
        await app.developerProjectPage.viewAndApproveSalesContract();
        await app.developerProjectPage.approveUnitSpecification();
        await app.developerProjectPage.fillOtp("1234");
        await app.developerProjectPage.verifyOtp();
        await app.developerProjectPage.verifyApprovalSuccessMessage();
    });

    test("TC-03 - Developer books one unit", {
        annotation: [{
            product: 'Marketplace', type: 'critical'
        }] as any
    }, async ({page}) => {
        const data = readServiceData();
        const environments = readEnvironments();
        const app = new WebApp(page);
        const projectName = data.projectName;
        const developerUserId = data.developerUserId;

        await logStep("Step 01: Navigate to partners portal > Login as developer");
        await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();

        await logStep("Step 02: Navigate to bookings management > Individual bookings > New booking");
        await waitAndClick(page.locator("//span[contains(text(),' إدارة الحجوزات')]/../.."));
        await waitAndClick(page.locator("//span[contains(text(),'الحجوزات الفردية')]/../.."));

        await waitAndClick(page.locator("//span[contains(text(),' حجز جديد ')]/.."), LONG_TIMEOUT);

        await logStep("Step 03: Search for the customer by ID");
        await waitAndFill(page.locator("//label[contains(text(),' رقم الهوية ')]/../..//input"), "1300070834");
        await waitAndClick(page.locator("//button[contains(text(),' بحث ')]"));

        const nextButton = page.locator("//button[contains(text(), 'التالي')]");
        await expect(nextButton).toBeEnabled({timeout: DEFAULT_TIMEOUT});
        await nextButton.click();

        await page.waitForTimeout(3000);

        await logStep("Step 04: Select the project > Select one unit > Keep booking");
        await page.locator("(//input[@aria-autocomplete='list'])[1]").fill(projectName);

        await page.waitForTimeout(2000);

        await page.locator("div[role='listbox'] span").click();

        await page.waitForTimeout(10000);
        await waitAndClick(unitCheckbox(page, 1));
        await nextButton.click();
        await waitAndClick(page.locator("//button[contains(text(),' مواصلة الحجز')]"));

        await logStep("Step 05: Select the bank");
        // Select the bank
        await waitAndClick(page.locator("app-bank-list-dropdown-control input[role='combobox']"));
        await waitAndClick(page.locator("//span[contains(text(),'CRM Bank Test')]"));
        await nextButton.click();
        await page.waitForTimeout(1000);

        await logStep("Step 06: Confirm the booking > Verify booking details are visible");
        await waitAndClick(page.locator("//span[contains(text(),'تأكيد')]/.."), DEFAULT_TIMEOUT);

        await expect(page.locator("//button[contains(text(),'عرض التفاصيل')]"))
            .toBeVisible({timeout: DEFAULT_TIMEOUT});
    });

    test("TC-04 - User Pays the invoices for a unit", {
        annotation: [{
            product: 'Marketplace', type: 'critical'
        }] as any
    }, async ({page}) => {
        const data = readServiceData();
        const environments = readEnvironments();
        const app = new WebApp(page);
        const sakaniUserId = data.sakaniUserId;
        const userPortalUrl = environments.userPortalUrl;

        await logStep("Step 01: Navigate to user portal > Login");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();
        await app.loginPage.openLogin();
        await app.loginPage.loginWithNafath(sakaniUserId);
        await app.loginPage.waitForNafathPromptToDisappear();
        await app.loginPage.continueNewUserPopup();
        await app.loginPage.handlePushNotificationPopup();
        await page.waitForTimeout(3000);

        await logStep("Step 02: Navigate to my activities > Active bookings > Not billed");
        await app.marketplaceLandingPage.openProfileManagement();
        await app.offPlanBasketMultipleBookingPage.clickMyActivities();
        await app.offPlanBasketMultipleBookingPage.clickOnBookings();
        await app.offPlanBasketMultipleBookingPage.clickOnActiveBooking();
        await app.offPlanBasketMultipleBookingPage.clickOnNotBilled();

        await logStep("Step 03: Save the delivery unit code to test data");
        // add the unit codes to json
        deliveryUnitCode = await app.offPlanBasketMultipleBookingPage.getUnit1Code();
        writeServiceData("deliveryUnitCode", deliveryUnitCode);

        await logStep("Step 04: Select the unit > Pay the invoice");
        await app.offPlanBasketMultipleBookingPage.clickOnUnit1CheckBox();
        await app.offPlanBasketMultipleBookingPage.clickOnPayBills();
        await app.paymentGatewayPage.fillCardDetails();
        await page.waitForTimeout(10000);
    });

    test("TC-05 - User Signs sale contract for a unit", async ({page}) => {
        const data = readServiceData();
        const environments = readEnvironments();
        const app = new WebApp(page);
        const sakaniUserId = data.sakaniUserId;
        const userPortalUrl = environments.userPortalUrl;

        await logStep("Step 01: Navigate to user portal > Login");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();
        await app.loginPage.openLogin();
        await app.loginPage.loginWithNafath(sakaniUserId);
        await app.loginPage.waitForNafathPromptToDisappear();
        await app.loginPage.continueNewUserPopup();
        await app.loginPage.handlePushNotificationPopup();

        await logStep("Step 02: Navigate to my activities > Active bookings > Ready for sign");
        await app.marketplaceLandingPage.openProfileManagement();
        await app.offPlanBasketMultipleBookingPage.clickMyActivities();
        await app.offPlanBasketMultipleBookingPage.clickOnBookings();
        await app.offPlanBasketMultipleBookingPage.clickOnActiveBooking();
        await app.offPlanBasketMultipleBookingPage.clickOnReadyForSign();

        await logStep("Step 03: Select the unit > Continue");
        await app.offPlanBasketMultipleBookingPage.clickOnUnit1CheckBox();
        await app.offPlanBasketMultipleBookingPage.clickOnContinue();

        await logStep("Step 04: Agree on the sale contract > Verify OTP > Verify contract is signed");
        await app.offPlanBasketMultipleBookingPage.clickOnProjectCheckBox();
        await app.offPlanBasketMultipleBookingPage.clickOnAgreeOnAll();

        await app.offPlanBasketMultipleBookingPage.typeVerifyOtpCode();
        await app.offPlanBasketMultipleBookingPage.clickOnVerify();

        await expect.poll(() => app.offPlanBasketMultipleBookingPage.isSuccessfulContractSignMessage(), {timeout: LONG_TIMEOUT}).toBe(true);
    });

    test("TC-06 Cash payment from the developer side", {
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

        await logStep("Step 02: Open financial management > Cash payment > Search customer by ID");
        await app.flexiblePaymentPage.clickOnFinancialManagement();
        await app.flexiblePaymentPage.clickOnCashPayment();
        await app.flexiblePaymentPage.clickOnCustomerDropdownMenu();
        await app.flexiblePaymentPage.selectIndividualCustomersType();
        await app.flexiblePaymentPage.fillNationalIdentity(data.sakaniUserId);
        await app.flexiblePaymentPage.clickOnSearch();

        await logStep("Step 03: View booked unit details > Confirm the cash payment > Verify success");
        await app.flexiblePaymentPage.viewTheBookedUnitDetails();
        await app.flexiblePaymentPage.confirmTheCashPayment();
        await app.cashPaymentPage.expectCashPaymentSuccess();
    });

    test("TC-07 Unit Delivery Preparation", {
        annotation: [{
            product: 'Marketplace', type: 'critical'
        }] as any
    }, async ({page}) => {
        const data = readServiceData();
        const environments = readEnvironments();
        const projectName = data.projectName;
        const app = new WebApp(page);
        const developerUserId = data.developerUserId;

        await logStep("Step 01: Navigate to partners portal > Login as developer");
        await app.developerProjectPage.gotoAuth(environments.sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();

        await logStep("Step 02: Open units delivery > Start preparing > Search by project name > Select the unit");
        await app.unitsDeliveryPage.clickOnUnitsDelivery();
        await app.unitsDeliveryPage.clickOnStartForPreparingUnitDelivery();
        await app.unitsDeliveryPage.selectSearchingUsingProjectName();
        await app.unitsDeliveryPage.fillProjectName(projectName);
        await app.unitsDeliveryPage.clickOnSearch();
         await page.waitForTimeout(10000);
        await app.unitsDeliveryPage.clickOnSelectProject();
        // use
        // selectSearchingUsingUnitCode
        //fillUnitCode
        await app.unitsDeliveryPage.clickOnSelectUnit();

        await logStep("Step 03: Mark as ready for delivery > Set date and time > Send > Verify unit is ready");
        await app.unitsDeliveryPage.clickOnReadyForDelivery();
        await  app.unitsDeliveryPage.selectDeliveryDate();
        await  app.unitsDeliveryPage.selectDeliveryTime();
        await app.unitsDeliveryPage.clickOnSend();

        expect(await app.unitsDeliveryPage.isUnitReadyForDelivery()).toBe(true);
    });

    test("TC-08 Delivery of the ready units from Partner", {
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

        await logStep("Step 02: Open units delivery > Ready units > Search by unit code");
        await app.unitsDeliveryPage.clickOnUnitsDelivery();
        await app.unitsDeliveryPage.clickOnStartForReadyUnitDelivery();
        await app.unitsDeliveryPage.selectSearchingUsingUnitCode();
        await app.unitsDeliveryPage.fillUnitCode(data.deliveryUnitCode);
        await app.unitsDeliveryPage.clickOnSearch();

        await logStep("Step 03: Send the unit to the customer for delivery > Verify unit is delivered");
        await app.unitsDeliveryPage.sendToCustomerForDelivery();

        expect(await app.unitsDeliveryPage.isUnitDelivered()).toBe(true);
 });

    test("TC-09 Delivery confirmation from the user side `Sakani`" , {
        annotation: [{
            product: 'Marketplace', type: 'critical'
        }] as any
    }, async ({page}) => {
        const data = readServiceData();
        const environments = readEnvironments();
        const app = new WebApp(page);
        const sakaniUserId = data.sakaniUserId;
        const userPortalUrl = environments.userPortalUrl;

        await logStep("Step 01: Navigate to user portal > Login");
        await app.loginPage.gotoHomePage(userPortalUrl);
        await app.loginPage.acceptCookies();
        await app.loginPage.openLogin();
        await app.loginPage.loginWithNafath(sakaniUserId);
        await app.loginPage.waitForNafathPromptToDisappear();
        await app.loginPage.continueNewUserPopup();
        await app.loginPage.handlePushNotificationPopup();

        await app.marketplaceLandingPage.openProfileManagement();
        await app.offPlanBasketMultipleBookingPage.clickMyActivities();
        await app.unitsDeliveryPage.clickOnUnitDeliveryFromSakani();
        await app.unitsDeliveryPage.clickOnPendingUnitsForDelivery();
        await app.unitsDeliveryPage.clickOnShowDeliveryUnitModel();
        await app.unitsDeliveryPage.clickUnitDeliveryConfirmationFromSakani();
        await app.unitsDeliveryPage.agreeOnUnitDeliveryState();
        await app.unitsDeliveryPage.agreeOnTermsAndConditions();
        await app.unitsDeliveryPage.agreeOnUnitDelivery();
        await page.waitForTimeout(5000);
        await app.unitsDeliveryPage.typeVerifyOtpCode();
        await app.unitsDeliveryPage.clickOnVerify();

        expect(await app.unitsDeliveryPage.isUnitDeliveredAndAcceptedFromSakani()).toBe(true);
 });
});