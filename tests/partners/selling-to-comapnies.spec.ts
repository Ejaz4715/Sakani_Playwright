import {expect, test} from '@fixtures/pages.fixture';
import {WebApp} from "@base-class/web-app";
import {DateUtils} from "@pages/utils/DateUtils";
import {Locator, Page} from "@playwright/test";


const fs = require("fs");
const path = require("path");

const DEFAULT_TIMEOUT = 30_000;
const LONG_TIMEOUT = 90_000;
const KEY = "selling-to-companies";

async function waitAndClick(locator: Locator, timeout = DEFAULT_TIMEOUT) {
    await locator.waitFor({state: 'visible', timeout});
    await locator.click();
}

async function waitAndFill(locator: Locator, value: string, timeout = DEFAULT_TIMEOUT) {
    await locator.waitFor({state: 'visible', timeout});
    await locator.fill(value);
}

const testDataPath = path.join(process.cwd(), "src", "data", "test-data.json");

function readTestData() {
    return JSON.parse(fs.readFileSync(testDataPath, "utf8"));
}


function writeTestData(data: any) {
    fs.writeFileSync(testDataPath, JSON.stringify(data, null, 2), "utf8");
}
function updateSellingToCompanies({newFields}: { newFields: any }) {
    const data = readTestData();

    if (!data[KEY]) throw new Error(`"${KEY}" not found in test-data.json`);

    data[KEY] = {...data[KEY], ...newFields};

    writeTestData(data);
    return data[KEY];
}

const unitCheckbox = (page: Page, row: number) =>
    page.locator(`//datatable-row-wrapper[${row}]/datatable-body-row/div[3]/datatable-body-cell/div/div/app-sapa-checkbox-v2/div/div/input/..`);


test.describe('Selling to companies', () => {
    let companyUnitCode:string;
    test("TC-01 - Add new project", {
        annotation: [{
            product: 'Marketplace',
            type: 'critical'
        }] as any
    }, async ({page}) => {
        const testData = readTestData();
        const app = new WebApp(page);

        const currentDate = DateUtils.getDateISO(600);
        const projectName = `Automation Project ${new Date()
            .toISOString()
            .replace(/[-:T.]/g, "")
            .slice(0, 14)}`;
        const updatedData = {...testData, projectName};
        writeTestData(updatedData);

        // Project details
        await app.adminProjectPage.login(
            updatedData.adminPortalUrl,
            updatedData.adminUsername,
            updatedData.adminPassword,
        );
        await app.adminProjectPage.openProjectCreation();
        await page
            .locator("form-field-component")
            .filter({hasText: "إسم المشروع *"})
            .getByPlaceholder("إسم المشروع")
            .fill(projectName);
        const projectTypeDropdown = page.locator(
            "//mat-select[@formcontrolname='project_type']",
        );
        const projectTypeOption = page.getByText(
            "مشاريع البيع على الخارطة على أراضي الوزارة",
            {exact: true},
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
            .locator(
                "//app-nsar-dropdown[@formcontrolname='bank_name']/descendant::ng-select",
            )
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
            page.getByRole("checkbox", {name: "Select all rows"}),
        ).toBeVisible({timeout: 30000});
        await page.getByRole("checkbox", {name: "Select all rows"}).click();
        await page.getByRole("button", {name: "حفظ"}).click();

        // Import units
        await page.getByRole("tab", {name: "الوحدات", exact: true}).click();
        await expect(
            page.getByRole("button", {name: "استيراد وحدة جديدة"}),
        ).toBeVisible({timeout: 30000});
        await page.getByRole("button", {name: "استيراد وحدة جديدة"}).click();
        await expect(
            page.getByRole("combobox", {name: "نوع الوحدة السكنية"}),
        ).toBeVisible({timeout: 30000});
        await page.waitForTimeout(3000);
        await page.getByRole("combobox", {name: "نوع الوحدة السكنية"}).click();
        await page.getByRole("option", {name: "شقة"}).click();
        const unitsImportFilePath = path.join(
            process.cwd(), "src",
            "data",
            "OffPlanCompany.xlsx",
        );
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
                continue;
            }
        }
        await page.getByRole("button", {name: "اعتماد"}).click();
        await page.getByRole("button", {name: "موافق"}).click();
        await page.waitForTimeout(3000);
        await page.getByRole("button", {name: "رجوع"}).click();

        // //Upload media
        await page
            .locator("span")
            .filter({hasText: /المحتوى المرئي/i})
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
            .fill(
                "الملخص ARالملخص ARالملخص ARالملخص ARالملخص ARالملخص ARالملخص ARالملخص AR",
            );
        await page
            .getByRole("textbox", {name: "ملخص EN"})
            .fill(
                "Summary EN Summary EN Summary EN Summary EN Summary EN Summary EN Summary EN Summary EN Summary EN",
            );
        await page
            .getByRole("textbox", {name: "الوصف (باللغة العربية)"})
            .fill(
                "الوصف (باللغة العربية)الوصف (باللغة العربية)الوصف (باللغة العربية)الوصف (باللغة العربية)الوصف (باللغة العربية)الوصف (باللغة العربية)الوصف (باللغة العربية)",
            );
        await page
            .getByRole("textbox", {name: "الوصف (باللغة الإنجليزية)"})
            .fill(
                "Description EN Description EN Description EN Description EN Description EN Description EN Description EN Description EN Description EN",
            );
        await page.getByRole("textbox", {name: "السعر يبدأ من"}).fill("500000");
        await page.getByRole("spinbutton", {name: "خط العرض"}).fill("1.1");
        await page.getByRole("spinbutton", {name: "خط الطول"}).fill("1.1");
        await expect(
            page.locator("//button[contains (@class, 'uploadStatus')]"),
        ).toBeVisible({timeout: 120000});
        await page.locator("input[formcontrolname='guarantees_after_service']").fill("الضمانات وخدمة ما بعد البيع");
        await page.waitForTimeout(1000);
        await page.locator("#save_btn").click();


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

        // Navigate to project details page
        await page.getByText("تفاصيل المشروع").click();

        // Select status to be available
        await page.locator("//mat-select[@formcontrolname='status']").click();
        await page.getByRole("option", {name: "متاح"}).click();

        //Save project details
        await page.getByRole("button", {name: "حفظ"}).click();

        // Check the bookable toggle
        const bookingAvailableToggle = page.locator(
            "//label[contains (text(), 'قابل للحجز')]/preceding-sibling::button",
        );
        await expect(bookingAvailableToggle).toBeVisible({timeout: 30000});
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

        /* await page.getByText("تفاصيل المشروع").click();

         // Select Comprehensive journey
         await page.keyboard.press('PageDown');
         await waitAndClick(page.locator("//span[contains(text(), 'إعدادات المشاريع')]"))

         await waitAndClick(page.locator("mat-slide-toggle[formcontrolname='using_general_active_offplan_comprehensive'] button"));

         await page.keyboard.press('PageDown');
         await page.getByRole("button", {name: "حفظ"}).click();
         await expect(saveSuccessToast).toBeVisible({timeout: 120000});*/
    });

    test("TC-02 - Developer adds payment schedules", {
        annotation: [{
            product: 'Marketplace',
            type: 'critical'
        }] as any
    }, async ({page}) => {
        const testData = readTestData();
        const app = new WebApp(page);
        const projectName = testData.projectName;
        const developerUserId = testData.developerUserId;

        await app.developerProjectPage.gotoAuth(testData.sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();
        await app.developerProjectPage.openProjectBySearch(projectName);

        await app.developerProjectPage.openPaymentSchedulesTab();
        await app.developerProjectPage.addPaymentSchedule({
            type: "cash",
            scheduleName: "Cash 22",
            completionPercentageOneValue: "100",
            percentageOneValue: "50",
            completionPercentageTwoValue: "100",
            percentageTwoValue: "50"
        });
    });

    test("TC-03 - Developer approves sales contract for companies", {
        annotation: [{
            product: 'Marketplace',
            type: 'critical'
        }] as any
    }, async ({page}) => {
        const testData = readTestData();
        const app = new WebApp(page);
        const projectName = testData.projectName;
        const developerUserId = testData.developerUserId;

        await app.developerProjectPage.gotoAuth(testData.sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();
        await app.developerProjectPage.openProjectBySearch(projectName);

        await app.developerProjectPage.openSalesContractsTab();
        await app.developerProjectPage.clickOnCompanies();
        await app.developerProjectPage.viewAndApproveSalesContract();
        await app.developerProjectPage.approveUnitSpecification();
        await app.developerProjectPage.fillOtp("1234");
        await app.developerProjectPage.verifyOtp();
    });

    test("TC-04 - Developer | create new booking for a company user", {
        annotation: [{
            product: 'Marketplace',
            type: 'critical'
        }] as any
    }, async ({page}) => {
        const testData = readTestData();
        const app = new WebApp(page);
        const projectName = testData.projectName;
        const developerUserId = testData.developerUserId;

        await app.developerProjectPage.gotoAuth(testData.sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();

        await waitAndClick(page.locator("//span[contains(text(),' إدارة الحجوزات')]/../.."));
        await waitAndClick(page.locator("//span[contains(text(),'حجوزات الشركة')]/../.."));

        await waitAndClick(page.locator("//span[contains(text(),' حجز جديد ')]/.."), LONG_TIMEOUT);

        await waitAndFill(page.locator("//h5[contains(text(),' البحث عن شركة')]/../..//input"), testData.companyCR);
        await waitAndClick(page.locator("//button[contains(text(),'بحث')]"));
        const nextButton = page.locator("//button[contains(text(), 'التالي')]");
        await nextButton.click();
        await waitAndFill(page.locator("//h5[contains(text(),'ممثل الشركة')]/../..//input"), testData.companyUser);
        await waitAndClick(page.locator("//button[contains(text(),'بحث')]"));
        await expect(nextButton).toBeEnabled({timeout: DEFAULT_TIMEOUT});
        await nextButton.click();

        await page.waitForTimeout(3000);

        await page.locator("(//input[@aria-autocomplete='list'])[1]").fill(projectName);

        await page.waitForTimeout(2000);

        await page.locator("div[role='listbox'] span").click();

        await page.waitForTimeout(10000);
        await waitAndClick(unitCheckbox(page, 1));

        await expect(nextButton).toBeEnabled({timeout: DEFAULT_TIMEOUT});
        await nextButton.click();
        await waitAndClick(page.locator("//button[contains(text(),' مواصلة الحجز')]"));

        // Select the bank
        await waitAndClick(page.locator("app-bank-list-dropdown-control input[role='combobox']"));
        await waitAndClick(page.locator("//span[contains(text(),'CRM Bank Test')]"));
        await nextButton.click();
        await page.waitForTimeout(1000);

        await waitAndClick(page.locator("//span[contains(text(),'تأكيد')]/.."), DEFAULT_TIMEOUT);

        await expect(page.locator("//button[contains(text(),'عرض التفاصيل')]"))
            .toBeVisible({timeout: DEFAULT_TIMEOUT});
    });

    test("TC-05 - User | Pays the invoices for all units", {
        annotation: [{
            product: 'Marketplace',
            type: 'critical'
        }] as any
    }, async ({page}) => {
        const testData = readTestData();
        const app = new WebApp(page);
        const companyUserId = testData.companyUser;
        const userPortalUrl = testData.userPortalUrl;

        await app.loginPage.gotoHomePage(userPortalUrl);
        //await app.loginPage.acceptCookies();
        await app.loginPage.openLogin();
        await app.loginPage.loginWithNafath(companyUserId);
        await app.loginPage.waitForNafathPromptToDisappear();
        await app.loginPage.continueNewUserPopup();
        await app.loginPage.handlePushNotificationPopup();

        await app.marketplaceLandingPage.openProfileManagement();
        await app.offPlanBasketMultipleBookingPage.clickOnCompanies();
        await app.offPlanBasketMultipleBookingPage.clickOnCompanyReservations();
        await app.offPlanBasketMultipleBookingPage.clickOnCompanyActiveBookings();
        await app.offPlanBasketMultipleBookingPage.clickOnNotBilled();
        await page.waitForTimeout(2000);

        // add the unit codes to json
        companyUnitCode = await app.offPlanBasketMultipleBookingPage.getCompanyUnitCode();

        writeTestData({ ...testData, companyUnitCode });

        await app.offPlanBasketMultipleBookingPage.clickOnShowDetails();
        await page.waitForTimeout(2000)
        await app.offPlanBasketMultipleBookingPage.clickOnCompanyReservationFeesPayment();
        await app.paymentGatewayPage.fillCardDetails();
        await page.waitForTimeout(2000);
    });

    test("TC-06 - User | Signs sale contract for all units", async ({page}) => {
        const testData = readTestData();
        const app = new WebApp(page);
        const companyUserId = testData.companyUser;
        const userPortalUrl = testData.userPortalUrl;

        await app.loginPage.gotoHomePage(userPortalUrl);
        //await app.loginPage.acceptCookies();
        await app.loginPage.openLogin();
        await app.loginPage.loginWithNafath(companyUserId);
        await app.loginPage.waitForNafathPromptToDisappear();
        //await app.loginPage.continueNewUserPopup();
        //await app.loginPage.handlePushNotificationPopup();

        await app.marketplaceLandingPage.openProfileManagement();
        await app.offPlanBasketMultipleBookingPage.clickOnCompanies();
        await app.offPlanBasketMultipleBookingPage.clickOnCompanyReservations();
        await app.offPlanBasketMultipleBookingPage.clickOnCompanyActiveBookings();
        await app.offPlanBasketMultipleBookingPage.clickOnReadyForSign();

        await app.offPlanBasketMultipleBookingPage.clickOnUnit1CheckBox();
        await app.offPlanBasketMultipleBookingPage.clickOnContinue();

        await app.offPlanBasketMultipleBookingPage.clickOnProjectCheckBox();
        await app.offPlanBasketMultipleBookingPage.clickOnAgreeOnAll();

        await app.offPlanBasketMultipleBookingPage.typeVerifyOtpCode();
        await app.offPlanBasketMultipleBookingPage.clickOnVerify();

        await expect.poll(
            () => app.offPlanBasketMultipleBookingPage.isSuccessfulContractSignMessage(),
            {timeout: LONG_TIMEOUT}
        ).toBe(true);
    });

    test("TC-07 - Developer | Confirms the bookings for companies", async ({page}) => {
        const testData = readTestData();
        const app = new WebApp(page);
        const developerUserId = testData.developerUserId;

        await app.developerProjectPage.gotoAuth(testData.sapaPortalUrl);
        await app.developerProjectPage.loginDeveloper(developerUserId);
        await app.developerProjectPage.switchRoleToDeveloper();

        await app.developerProjectPage.confirmCompanyBooking(readTestData().companyUnitCode);
        await expect.poll(
            () => app.developerProjectPage.isSuccessfulConfirmationMessageVisible(),
            { timeout: LONG_TIMEOUT }
        ).toBe(true);
    });

});
