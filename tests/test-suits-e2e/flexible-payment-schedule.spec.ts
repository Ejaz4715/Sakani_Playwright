import { test } from '@playwright/test';
const path = require("path");
import { WebApp } from "@base-class/web-app";
import { DataHelper } from '@helpers/DataHelper'
import { logStep } from '@helpers/LogSteps'

const SERVICE = "flexible-payment-schedule";
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

test.describe("Add flexible payment schedules", () => {
    test("TC-01 Add flexible payment schedule (Completion percentage)", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        //read data from json relative to the service
        const environment = readEnvironments();
        const data = readServiceData();
        const app = new WebApp(page);
        const projectName = data.projectName;
        const developerUserId = data.developerUserId;
        const sapaPortalUrl = environment.sapaPortalUrl;

        await logStep("Step 01: Login as developer to sapa portal and open the project");
        await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
        await app.partnersLoginPage.loginToSapaPortal(developerUserId);
        await app.partnersLoginPage.switchRoleToDeveloper();

        await logStep("Step 02: Define the schedule name in AR and EN");
        const scheduleTitleAr = `جدول دفع مرن لخدمات أتمتة الاختبارات ${new Date()
            .toISOString()
            .replace(/[-:T.]/g, "")
            .slice(0, 14)}`;

        const scheduleTitleEn = `Automation Flexible Payment Schedule ${new Date()
            .toISOString()
            .replace(/[-:T.]/g, "")
            .slice(0, 14)}`;

        DataHelper.updateServiceData(SERVICE, "scheduleTitleAr", scheduleTitleAr);
        DataHelper.updateServiceData(SERVICE, "scheduleTitleEn", scheduleTitleEn);

        await logStep("Step 03: Navigate to financials management > Payment Schedules");
        await app.flexiblePaymentPage.clickOnFinancialManagement();
        await app.flexiblePaymentPage.clickOnPaymentSchedules();

        await logStep("Step 04: Navigate to add new flexible payment schedule > Provide basic details");
        await app.flexiblePaymentPage.clickOnNewSchedulesButton();
        await app.flexiblePaymentPage.enterScheduleNameInArabic(scheduleTitleAr);
        await app.flexiblePaymentPage.enterScheduleNameInEnglish(scheduleTitleEn);
        await app.flexiblePaymentPage.selectScheduleType("completionPercentage");
        await app.flexiblePaymentPage.clickOnNextButton();

        await logStep("Step 05: Select the payment percenatge and completion percentage of all the installments");
        await app.flexiblePaymentPage.fillFirstPaymentPaidPercentage(50);
        await app.flexiblePaymentPage.fillFirstPaymentCompletionPercentage(20);
        await app.flexiblePaymentPage.fillSecondPaymentPaidPercentage(30);
        await app.flexiblePaymentPage.fillSecondPaymentCompletionPercentage(30);
        await app.flexiblePaymentPage.fillThirdPaymentPaidPercentage(20);
        await app.flexiblePaymentPage.fillThirdPaymentCompletionPercentage(100);
        await app.flexiblePaymentPage.clickOnNextButton();

        await logStep("Step 06: Search and select project");
        await app.flexiblePaymentPage.serachByprojectName(projectName);
        await app.flexiblePaymentPage.checkOnProjectNameSearchedResult();
        await app.flexiblePaymentPage.clickOnNextButton();

        await logStep("Step 07: Review the summary and move to next section");
        await app.flexiblePaymentPage.clickOnNextButton();

        await logStep("Step 08: Confirm the schedule > Validate the success message");
        await app.flexiblePaymentPage.clickOnConfirmButton();
        await app.flexiblePaymentPage.verifyTheSuccessfulMessage();

        // await page.getByRole('dialog').locator('a').filter({ hasText: 'الإدارة المالية' }).click();
        // await page.getByRole('link', { name: 'جداول الدفع' }).click();
        // await page.getByRole('button', { name: 'جدول جديد' }).click();
        // await page.locator("//input[@placeholder='على سبيل المثال: خطة مرنة لمدة عامين']").fill('test arabic title');
        // await page.locator("//input[@placeholder='خطة مرنة لمدة عامين']").fill('test english title');
        // await page.getByRole('combobox').click();
        // await page.getByRole('option', { name: 'نسبة الإنجاز' }).click();
        // await page.getByRole('textbox', { name: 'مثال: 10%' }).fill('2');
        // await page.getByRole('button', { name: 'عقد أساسي' }).click();
        // await page.getByRole('button', { name: 'التالي' }).click();
        // await page.getByRole('textbox', { name: 'مثال: 15%' }).first().fill('30');
        // await page.getByRole('textbox', { name: 'مثال: 15%' }).nth(1).fill('30');
        // await page.getByRole('textbox', { name: 'مثال: 15%' }).nth(2).fill('30');
        // await page.getByRole('textbox', { name: 'مثال: 15%' }).nth(3).fill('60');
        // await page.getByRole('textbox', { name: 'مثال: 15%' }).nth(4).fill('40');
        // await page.getByRole('textbox', { name: 'مثال: 15%' }).nth(5).fill('100');
        // await page.getByRole('button', { name: 'التالي' }).click();
        // await page.getByRole('textbox', { name: 'ابحث برمز المشروع أو اسمه' }).fill('Automation Project P_003');
        // await page.getByRole('cell').filter({ hasText: /^$/ }).click();
        // await page.getByRole('cell').filter({ hasText: /^$/ }).check();
        // await page.getByRole('button', { name: 'التالي' }).click();
        // await page.getByText('جميع الوحدات المتاحة الحالية والمستقبلية').click();
        // await page.getByText('جميع الوحدات المتاحة الحالية والمستقبلية').check();
        // await page.getByRole('button', { name: 'التالي' }).click();
        // await page.getByRole('button', { name: 'تأكيد' }).click();
        // await page.getByText('تم إنشاء جدول الدفع بنجاح').click();
        // await page.getByRole('button', { name: 'الانتقال إلى التفاصيل' }).click();
        // await page.getByRole('heading', { name: 'تفاصيل جدول الدفع' }).click();
        //span[normalize-space ()='تحديث']
    });

    test("TC-02 Delete flexible payment schedule (Completion percentage)", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        //read data from json relative to the service
        const environment = readEnvironments();
        const data = readServiceData();
        const app = new WebApp(page);
        const developerUserId = data.developerUserId;
        const sapaPortalUrl = environment.sapaPortalUrl;
        const scheduleTitleAr = data.scheduleTitleAr;
        const scheduleTitleEn = data.scheduleTitleEn;

        await logStep("Step 01: Login as developer to sapa portal and open the project");
        await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
        await app.partnersLoginPage.loginToSapaPortal(developerUserId);
        await app.partnersLoginPage.switchRoleToDeveloper();

        await logStep("Step 02: Navigate to financials management > Payment Schedules");
        await app.flexiblePaymentPage.clickOnFinancialManagement();
        await app.flexiblePaymentPage.clickOnPaymentSchedules();

        await logStep("Step 03: Search for a schedule > View details of the schedule");
        await app.flexiblePaymentPage.searchScheduleByTitle(scheduleTitleAr);
        await page.waitForTimeout(5000);
        await app.flexiblePaymentPage.clickOnScheduleDetails();

        await logStep("Step 04: Delete schedule");
        await app.flexiblePaymentPage.clickOnDeleteSchedule();
        await page.waitForTimeout(2000);
        await app.flexiblePaymentPage.clickOnDeleteSchedule();

        await logStep("Step 04: Validate the toast message");
        await app.flexiblePaymentPage.clickOnScheduleDeletedMessage();
    });

    test("TC-03 Add flexible payment schedule (Specific period)", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        //read data from json relative to the service
        const environment = readEnvironments();
        const data = readServiceData();
        const app = new WebApp(page);
        const projectName = data.projectName;
        const developerUserId = data.developerUserId;
        const sapaPortalUrl = environment.sapaPortalUrl;

        await logStep("Step 01: Login as developer to sapa portal and open the project");
        await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
        await app.partnersLoginPage.loginToSapaPortal(developerUserId);
        await app.partnersLoginPage.switchRoleToDeveloper();

        await logStep("Step 02: Define the schedule name in AR and EN");
        const scheduleTitleAr = `جدول دفع مرن لخدمات أتمتة الاختبارات ${new Date()
            .toISOString()
            .replace(/[-:T.]/g, "")
            .slice(0, 14)}`;

        const scheduleTitleEn = `Automation Flexible Payment Schedule ${new Date()
            .toISOString()
            .replace(/[-:T.]/g, "")
            .slice(0, 14)}`;

        DataHelper.updateServiceData("flexible-payment-schedule", "scheduleTitleAr", scheduleTitleAr);
        DataHelper.updateServiceData("flexible-payment-schedule", "scheduleTitleEn", scheduleTitleEn);

        await logStep("Step 03: Navigate to financials management > Payment Schedules");
        await app.flexiblePaymentPage.clickOnFinancialManagement();
        await app.flexiblePaymentPage.clickOnPaymentSchedules();

        await logStep("Step 04: Navigate to add new flexible payment schedule > Provide basic details");
        await app.flexiblePaymentPage.clickOnNewSchedulesButton();
        await app.flexiblePaymentPage.enterScheduleNameInArabic(scheduleTitleAr);
        await app.flexiblePaymentPage.enterScheduleNameInEnglish(scheduleTitleEn);

        await logStep("Step 05: Select schedule type to be specific period");
        await app.flexiblePaymentPage.selectScheduleType("specificPeriod");
        await app.flexiblePaymentPage.selectPlanTypeMonthly();
        await app.flexiblePaymentPage.enterPlanPeriod("36");
        await app.flexiblePaymentPage.clickOnNextButton();

        await logStep("Step 06: Review the monthly payments plan and move to next section");
        await app.flexiblePaymentPage.clickOnNextButton();

        await logStep("Step 07: Search and select project");
        await app.flexiblePaymentPage.serachByprojectName(projectName);
        await app.flexiblePaymentPage.checkOnProjectNameSearchedResult();
        await app.flexiblePaymentPage.clickOnNextButton();

        await logStep("Step 08: Review the summary and move to next section");
        await app.flexiblePaymentPage.clickOnNextButton();

        await logStep("Step 09: Confirm the schedule > Validate the success message");
        await app.flexiblePaymentPage.clickOnConfirmButton();
        await app.flexiblePaymentPage.verifyTheSuccessfulMessage();
    });

    test("TC-04 Delete flexible payment schedule (Specific period)", { annotation: [{ product: 'Marketplace', type: 'critical' }] as any }, async ({ page }) => {
        test.setTimeout(0);
        //read data from json relative to the service
        const environment = readEnvironments();
        const data = readServiceData();
        const app = new WebApp(page);
        const developerUserId = data.developerUserId;
        const sapaPortalUrl = environment.sapaPortalUrl;
        const scheduleTitleAr = data.scheduleTitleAr;
        const scheduleTitleEn = data.scheduleTitleEn;

        await logStep("Step 01: Login as developer to sapa portal and open the project");
        await app.partnersLoginPage.gotoAuth(sapaPortalUrl);
        await app.partnersLoginPage.loginToSapaPortal(developerUserId);
        await app.partnersLoginPage.switchRoleToDeveloper();

        await logStep("Step 02: Navigate to financials management > Payment Schedules");
        await app.flexiblePaymentPage.clickOnFinancialManagement();
        await app.flexiblePaymentPage.clickOnPaymentSchedules();

        await logStep("Step 03: Search for a schedule > View details of the schedule");
        await app.flexiblePaymentPage.searchScheduleByTitle(scheduleTitleAr);
        await page.waitForTimeout(5000);
        await app.flexiblePaymentPage.clickOnScheduleDetails();

        await logStep("Step 04: Delete schedule");
        await app.flexiblePaymentPage.clickOnDeleteSchedule();
        await page.waitForTimeout(2000);
        await app.flexiblePaymentPage.clickOnDeleteSchedule();

        await logStep("Step 04: Validate the toast message");
        await app.flexiblePaymentPage.clickOnScheduleDeletedMessage();
    });
});
