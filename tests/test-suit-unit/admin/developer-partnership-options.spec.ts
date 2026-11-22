import { test, expect } from '@playwright/test';
import { DateUtils } from '@pages/utils/DateUtils';
import { WebApp, Products } from '@base-class/web-app';
import { logStep } from '@helpers/LogSteps';
import { DataHelper } from '@helpers/DataHelper';
import { AdminProjectObjects } from '@objects/AdminProjectsObjects';

const SERVICE = 'offplan-booking';
const readServiceData = () => DataHelper.readData().services[SERVICE];
const readEnvironments = () => DataHelper.readData().environments;

/** All the project types to be used across different test cases */
enum projectType {
  ReadymadePrivateLand = 'مشاريع الوحدات الجاهزة على الأراضي الخاصة',
  OffplanMOHLand = 'مشاريع البيع على الخارطة على أراضي الوزارة',
  ReadymadeMOHLand = 'مشاريع الوحدات الجاهزة على أراضي الوزارة',
  OffplanPrivateLand = 'مشاريع البيع على الخارطة على الأراضي الخاصة',
  LandsPrivateLand = 'أراضي القطاع الخاص',
  LandsMOHLand = 'أراضي وزارة البلديات والإسكان',
  AdvancedSelfConstruction = 'البناء المطور',
  OffplanLand_LandOnly = 'البيع على الخارطة - أراضي',
}

test.describe('SAK-1537 - Add 3 more field for agreement type field when user creates-edit project detail in admin', () => {
  test(
    'SAK-1537-01 Verify the availability of Developer Partnership Type old and new values "Marketing & Sales, Sales & Listing, Listing" - Advanced Self Construction Project',
    { annotation: [{ product: Products.Marketplace, type: 'non-critical' }] as any },
    async ({ page }) => {
      await logStep('Step 00: Read data from json relative to the service');
      const data = readServiceData();
      const environments = readEnvironments();
      const app = new WebApp(page);
      const projectName = `Automation Project Offplan ${new Date()
        .toISOString()
        .replace(/[-:T.]/g, '')
        .slice(0, 14)}`;
      DataHelper.updateServiceData(SERVICE, 'projectName', projectName);

      await logStep('Step 01: Login to admin portal as a super admin');
      await app.adminProjectPage.login(environments.adminPortalUrl, data.adminUsername, data.adminPassword);

      await logStep('Step 02: Navigate to internal inventory > Project');
      await app.adminProjectPage.clickInternalInventory();
      await app.adminProjectPage.clickProjectsLink();

      await logStep('Step 03: Navigate to add new project page');
      await app.adminProjectPage.clickAddNewProjectButton();

      await logStep('Step 04: Select project type as ReadyMade Private Land');
      await app.adminProjectPage.fillProjectName(projectName);
      await app.adminProjectPage.selectProjectType(projectType.AdvancedSelfConstruction);

      await logStep('Step 05: Open developer partnership type list');
      await app.adminProjectPage.clickDeveloperPartnerShipDropdown();

      await logStep('Step 06: Validate the presence of all the existing and new partnership type options');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('شراكة – نسبة عمولة');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('اتفاقية شراكة - موقعة');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('اتفاقية شراكة - غير موقعة');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('تسويق وبيع');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('البيع والإدراج');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('الإدراج');
    }
  );

  test(
    'SAK-1537-02 Verify the availability of Developer Partnership Type old and new values "Marketing & Sales, Sales & Listing, Listing" - Offplan Land Land Only Project',
    { annotation: [{ product: Products.Marketplace, type: 'non-critical' }] as any },
    async ({ page }) => {
      await logStep('Step 00: Read data from json relative to the service');
      const data = readServiceData();
      const environments = readEnvironments();
      const app = new WebApp(page);
      const projectName = `Automation Project Offplan ${new Date()
        .toISOString()
        .replace(/[-:T.]/g, '')
        .slice(0, 14)}`;
      DataHelper.updateServiceData(SERVICE, 'projectName', projectName);

      await logStep('Step 01: Login to admin portal as a super admin');
      await app.adminProjectPage.login(environments.adminPortalUrl, data.adminUsername, data.adminPassword);

      await logStep('Step 02: Navigate to internal inventory > Project');
      await app.adminProjectPage.clickInternalInventory();
      await app.adminProjectPage.clickProjectsLink();

      await logStep('Step 03: Navigate to add new project page');
      await app.adminProjectPage.clickAddNewProjectButton();

      await logStep('Step 04: Select project type as Offplan Land Land Only');
      await app.adminProjectPage.fillProjectName(projectName);
      await app.adminProjectPage.selectProjectType(projectType.OffplanLand_LandOnly);

      await logStep('Step 05: Open developer partnership type list');
      await app.adminProjectPage.clickDeveloperPartnerShipDropdown();

      await logStep('Step 06: Validate the presence of all the existing and new partnership type options');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('شراكة – نسبة عمولة');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('تسويق وبيع');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('البيع والإدراج');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('الإدراج');
    }
  );

  test(
    'SAK-1537-03 Verify the availability of Developer Partnership Type old and new values "Marketing & Sales, Sales & Listing, Listing" - Offplan MOH Land Project',
    { annotation: [{ product: Products.Marketplace, type: 'non-critical' }] as any },
    async ({ page }) => {
      await logStep('Step 00: Read data from json relative to the service');
      const data = readServiceData();
      const environments = readEnvironments();
      const app = new WebApp(page);
      const projectName = `Automation Project Offplan ${new Date()
        .toISOString()
        .replace(/[-:T.]/g, '')
        .slice(0, 14)}`;
      DataHelper.updateServiceData(SERVICE, 'projectName', projectName);

      await logStep('Step 01: Login to admin portal as a super admin');
      await app.adminProjectPage.login(environments.adminPortalUrl, data.adminUsername, data.adminPassword);

      await logStep('Step 02: Navigate to internal inventory > Project');
      await app.adminProjectPage.clickInternalInventory();
      await app.adminProjectPage.clickProjectsLink();

      await logStep('Step 03: Navigate to add new project page');
      await app.adminProjectPage.clickAddNewProjectButton();

      await logStep('Step 04: Select project type as Offplan MOH Land');
      await app.adminProjectPage.fillProjectName(projectName);
      await app.adminProjectPage.selectProjectType(projectType.OffplanMOHLand);

      await logStep('Step 05: Open developer partnership type list');
      await app.adminProjectPage.clickDeveloperPartnerShipDropdown();

      await logStep('Step 06: Validate the presence of all the existing and new partnership type options');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('شراكة – نسبة عمولة');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('اتفاقية شراكة - موقعة');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('اتفاقية شراكة - غير موقعة');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('تسويق وبيع');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('البيع والإدراج');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('الإدراج');
    }
  );

  test(
    'SAK-1537-04 Verify the availability of Developer Partnership Type old and new values "Marketing & Sales, Sales & Listing, Listing" - Offplan Private Land Project',
    { annotation: [{ product: Products.Marketplace, type: 'non-critical' }] as any },
    async ({ page }) => {
      await logStep('Step 00: Read data from json relative to the service');
      const data = readServiceData();
      const environments = readEnvironments();
      const app = new WebApp(page);
      const projectName = `Automation Project Offplan ${new Date()
        .toISOString()
        .replace(/[-:T.]/g, '')
        .slice(0, 14)}`;
      DataHelper.updateServiceData(SERVICE, 'projectName', projectName);

      await logStep('Step 01: Login to admin portal as a super admin');
      await app.adminProjectPage.login(environments.adminPortalUrl, data.adminUsername, data.adminPassword);

      await logStep('Step 02: Navigate to internal inventory > Project');
      await app.adminProjectPage.clickInternalInventory();
      await app.adminProjectPage.clickProjectsLink();

      await logStep('Step 03: Navigate to add new project page');
      await app.adminProjectPage.clickAddNewProjectButton();

      await logStep('Step 04: Select project type as Offplan Private Land');
      await app.adminProjectPage.fillProjectName(projectName);
      await app.adminProjectPage.selectProjectType(projectType.OffplanPrivateLand);

      await logStep('Step 05: Open developer partnership type list');
      await app.adminProjectPage.clickDeveloperPartnerShipDropdown();

      await logStep('Step 06: Validate the presence of all the existing and new partnership type options');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('شراكة – نسبة عمولة');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('اتفاقية شراكة - موقعة');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('اتفاقية شراكة - غير موقعة');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('تسويق وبيع');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('البيع والإدراج');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('الإدراج');
    }
  );

  test(
    'SAK-1537-05 Verify the availability of Developer Partnership Type old and new values "Marketing & Sales, Sales & Listing, Listing" - Readymade MOH Land Project ',
    { annotation: [{ product: Products.Marketplace, type: 'non-critical' }] as any },
    async ({ page }) => {
      await logStep('Step 00: Read data from json relative to the service');
      const data = readServiceData();
      const environments = readEnvironments();
      const app = new WebApp(page);
      const projectName = `Automation Project Offplan ${new Date()
        .toISOString()
        .replace(/[-:T.]/g, '')
        .slice(0, 14)}`;
      DataHelper.updateServiceData(SERVICE, 'projectName', projectName);

      await logStep('Step 01: Login to admin portal as a super admin');
      await app.adminProjectPage.login(environments.adminPortalUrl, data.adminUsername, data.adminPassword);

      await logStep('Step 02: Navigate to internal inventory > Project');
      await app.adminProjectPage.clickInternalInventory();
      await app.adminProjectPage.clickProjectsLink();

      await logStep('Step 03: Navigate to add new project page');
      await app.adminProjectPage.clickAddNewProjectButton();

      await logStep('Step 04: Select project type as Readymade MOH Land');
      await app.adminProjectPage.fillProjectName(projectName);
      await app.adminProjectPage.selectProjectType(projectType.ReadymadeMOHLand);

      await logStep('Step 05: Open developer partnership type list');
      await app.adminProjectPage.clickDeveloperPartnerShipDropdown();

      await logStep('Step 06: Validate the presence of all the existing and new partnership type options');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('شراكة – نسبة عمولة');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('اتفاقية شراكة - موقعة');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('اتفاقية شراكة - غير موقعة');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('تسويق وبيع');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('البيع والإدراج');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('الإدراج');
    }
  );

  test(
    'SAK-1537-06 Verify the availability of Developer Partnership Type old and new values "Marketing & Sales, Sales & Listing, Listing" - Readymade Private Land Project ',
    { annotation: [{ product: Products.Marketplace, type: 'non-critical' }] as any },
    async ({ page }) => {
      await logStep('Step 00: Read data from json relative to the service');
      const data = readServiceData();
      const environments = readEnvironments();
      const app = new WebApp(page);
      const projectName = `Automation Project Offplan ${new Date()
        .toISOString()
        .replace(/[-:T.]/g, '')
        .slice(0, 14)}`;
      DataHelper.updateServiceData(SERVICE, 'projectName', projectName);

      await logStep('Step 01: Login to admin portal as a super admin');
      await app.adminProjectPage.login(environments.adminPortalUrl, data.adminUsername, data.adminPassword);

      await logStep('Step 02: Navigate to internal inventory > Project');
      await app.adminProjectPage.clickInternalInventory();
      await app.adminProjectPage.clickProjectsLink();

      await logStep('Step 03: Navigate to add new project page');
      await app.adminProjectPage.clickAddNewProjectButton();

      await logStep('Step 04: Select project type as Readymade Private Land Project');
      await app.adminProjectPage.fillProjectName(projectName);
      await app.adminProjectPage.selectProjectType(projectType.ReadymadePrivateLand);

      await logStep('Step 05: Open developer partnership type list');
      await app.adminProjectPage.clickDeveloperPartnerShipDropdown();

      await logStep('Step 06: Validate the presence of all the existing and new partnership type options');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('شراكة – نسبة عمولة');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('اتفاقية شراكة - موقعة');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('اتفاقية شراكة - غير موقعة');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('تسويق وبيع');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('البيع والإدراج');
      await app.adminProjectPage.validateThePresenceOfPartnershipOption('الإدراج');
    }
  );

  test(
    'SAK-1537-07 Verify a project cannot be saved if Project Agreement Sign Date and End Dates are not provided - ReadyMade or Self Construction Project',
    { annotation: [{ product: Products.Marketplace, type: 'non-critical' }] as any },
    async ({ page }) => {
      await logStep('Step 00: Read data from json relative to the service');
      const data = readServiceData();
      const environments = readEnvironments();
      const app = new WebApp(page);
      const projectName = `Automation Project Offplan ${new Date()
        .toISOString()
        .replace(/[-:T.]/g, '')
        .slice(0, 14)}`;
      DataHelper.updateServiceData(SERVICE, 'projectName', projectName);

      await logStep('Step 01: Login to admin portal as a super admin');
      await app.adminProjectPage.login(environments.adminPortalUrl, data.adminUsername, data.adminPassword);

      await logStep('Step 02: Navigate to internal inventory > Project');
      await app.adminProjectPage.clickInternalInventory();
      await app.adminProjectPage.clickProjectsLink();

      await logStep('Step 03: Navigate to add new project page');
      await app.adminProjectPage.clickAddNewProjectButton();

      await logStep('Step 04: Select project type as Readymade Private Land Project');
      await app.adminProjectPage.fillProjectName(projectName);
      await app.adminProjectPage.selectProjectType(projectType.AdvancedSelfConstruction);

      await logStep('Step 05: Enter compulsory project details');
      await app.adminProjectPage.selectRegion('الرياض');
      await app.adminProjectPage.selectCity('الخرج');
      await app.adminProjectPage.selectSubsidyType('دعم عيني كامل');

      await logStep('Step 06: Open developer partnership type list');
      await app.adminProjectPage.clickDeveloperPartnerShipDropdown();

      await logStep('Step 07: Select Listing partnership type');
      await app.adminProjectPage.selectPartnershipOption('الإدراج');

      await logStep('Step 08: Save the project');
      await app.adminProjectPage.clickSaveButton();

      await logStep('Step 09: Validate the project cannot be saved and an error message is displayed under the agreement date textboxes');
      await app.adminProjectPage.validatePresenceOfAgreementDateRequiredText();
    }
  );

  test(
    'SAK-1537-08 Verify selecting a Partnership type displays specific corresponding fields "Agreement amount, Agreement End date, etc" - Offplan Private Land Project',
    { annotation: [{ product: Products.Marketplace, type: 'non-critical' }] as any },
    async ({ page }) => {
      await logStep('Step 00: Read data from json relative to the service');
      const data = readServiceData();
      const environments = readEnvironments();
      const app = new WebApp(page);
      const projectName = `Automation Project Offplan ${new Date()
        .toISOString()
        .replace(/[-:T.]/g, '')
        .slice(0, 14)}`;
      DataHelper.updateServiceData(SERVICE, 'projectName', projectName);

      await logStep('Step 01: Login to admin portal as a super admin');
      await app.adminProjectPage.login(environments.adminPortalUrl, data.adminUsername, data.adminPassword);

      await logStep('Step 02: Navigate to internal inventory > Project');
      await app.adminProjectPage.clickInternalInventory();
      await app.adminProjectPage.clickProjectsLink();

      await logStep('Step 03: Navigate to add new project page');
      await app.adminProjectPage.clickAddNewProjectButton();

      await logStep('Step 04: Select project type as Offplan Private Land Project');
      await app.adminProjectPage.fillProjectName(projectName);
      await app.adminProjectPage.selectProjectType(projectType.OffplanPrivateLand);

      await logStep('Step 05: Open developer partnership type list');
      await app.adminProjectPage.clickDeveloperPartnerShipDropdown();

      await logStep('Step 06: Select Listing partnership type and validate corresponding fields of selected type are displayed');
      await app.adminProjectPage.selectPartnershipOption('الإدراج');
      await app.commonMethods.verifyElementVisible(AdminProjectObjects.projectAgreementDate);
      await app.commonMethods.verifyElementVisible(AdminProjectObjects.agreementEndDate);
      await app.commonMethods.verifyElementVisible(AdminProjectObjects.agreementAmount);

      await logStep('Step 07: Select Sales & Listing partnership type and validate corresponding fields of selected type are displayed');
      await app.adminProjectPage.clickDeveloperPartnerShipDropdown();
      await app.adminProjectPage.selectPartnershipOption('البيع والإدراج');
      await app.commonMethods.verifyElementVisible(AdminProjectObjects.projectAgreementDate);
      await app.commonMethods.verifyElementVisible(AdminProjectObjects.agreementEndDate);
      await app.commonMethods.verifyElementVisible(AdminProjectObjects.agreementAmount);
      await app.commonMethods.verifyElementVisible(AdminProjectObjects.saleAndListingSubTypeDropdown);

      await logStep('Step 08: Select Marketing & Sale partnership type and validate corresponding fields of selected type are displayed');
      await app.adminProjectPage.clickDeveloperPartnerShipDropdown();
      await app.adminProjectPage.selectPartnershipOption('تسويق وبيع');
      await app.commonMethods.verifyElementVisible(AdminProjectObjects.projectAgreementDate);
      await app.commonMethods.verifyElementVisible(AdminProjectObjects.agreementEndDate);
      await app.commonMethods.verifyElementVisible(AdminProjectObjects.agreementAmount);
      await app.commonMethods.verifyElementVisible(AdminProjectObjects.agreementAmount);
    }
  );

  test(
    'SAK-1537-09 Verify agreement amount resets upon changing the partnership type selection - Advanced Self Construction Project',
    { annotation: [{ product: Products.Marketplace, type: 'non-critical' }] as any },
    async ({ page }) => {
      await logStep('Step 00: Read data from json relative to the service');
      const data = readServiceData();
      const environments = readEnvironments();
      const app = new WebApp(page);
      const projectName = `Automation Project Offplan ${new Date()
        .toISOString()
        .replace(/[-:T.]/g, '')
        .slice(0, 14)}`;
      DataHelper.updateServiceData(SERVICE, 'projectName', projectName);

      await logStep('Step 01: Login to admin portal as a super admin');
      await app.adminProjectPage.login(environments.adminPortalUrl, data.adminUsername, data.adminPassword);

      await logStep('Step 02: Navigate to internal inventory > Project');
      await app.adminProjectPage.clickInternalInventory();
      await app.adminProjectPage.clickProjectsLink();

      await logStep('Step 03: Navigate to add new project page');
      await app.adminProjectPage.clickAddNewProjectButton();

      await logStep('Step 04: Select project type as Advanced Self Construction Project');
      await app.adminProjectPage.fillProjectName(projectName);
      await app.adminProjectPage.selectProjectType(projectType.AdvancedSelfConstruction);

      await logStep('Step 05: Select Listing partnership type and retrive the value of agreement amount');
      await app.adminProjectPage.clickDeveloperPartnerShipDropdown();
      await app.adminProjectPage.selectPartnershipOption('الإدراج');
      const listingAgreementAmount = await app.commonMethods.getLocator(AdminProjectObjects.agreementAmount).inputValue();

      await logStep('Step 06: Select Sale & Listing partnership type and retrive the value of agreement amount');
      await app.adminProjectPage.clickDeveloperPartnerShipDropdown();
      await app.adminProjectPage.selectPartnershipOption('البيع والإدراج');
      const saleAndListingAgreementAmount = await app.commonMethods.getLocator(AdminProjectObjects.agreementAmount).inputValue();

      await logStep('Step 07: Validate the agreement amount value is changed');
      expect(listingAgreementAmount).not.toBe(saleAndListingAgreementAmount);
    }
  );

  test(
    'SAK-1537-10 Verify when "Listing" partnership type is selected it disables and off the "Bookable" toggle - Offplan MOH Land Project',
    { annotation: [{ product: Products.Marketplace, type: 'non-critical' }] as any },
    async ({ page }) => {
      await logStep('Step 00: Read data from json relative to the service');
      const data = readServiceData();
      const environments = readEnvironments();
      const app = new WebApp(page);
      const projectName = `Automation Project Offplan ${new Date()
        .toISOString()
        .replace(/[-:T.]/g, '')
        .slice(0, 14)}`;
      DataHelper.updateServiceData(SERVICE, 'projectName', projectName);

      await logStep('Step 01: Login to admin portal as a super admin');
      await app.adminProjectPage.login(environments.adminPortalUrl, data.adminUsername, data.adminPassword);

      await logStep('Step 02: Navigate to internal inventory > Project');
      await app.adminProjectPage.clickInternalInventory();
      await app.adminProjectPage.clickProjectsLink();

      await logStep('Step 03: Navigate to add new project page');
      await app.adminProjectPage.clickAddNewProjectButton();

      await logStep('Step 04: Select project type as Offplan MOH Land Project');
      await app.adminProjectPage.fillProjectName(projectName);
      await app.adminProjectPage.selectProjectType(projectType.OffplanMOHLand);

      await logStep('Step 05: Select Listing partnership type');
      await app.adminProjectPage.clickDeveloperPartnerShipDropdown();
      await app.adminProjectPage.selectPartnershipOption('الإدراج');

      await logStep('Step 06: Validate the bookable toggle is disabled');
      await app.commonMethods.getLocator(AdminProjectObjects.bookableSwitch).isDisabled({ timeout: 20000 });
    }
  );

  test(
    'SAK-1537-11 Verify the boundary values of "Agreement amount" when "Marketing & Sale" partnership type is selected - Offplan Land Land Only Project',
    { annotation: [{ product: Products.Marketplace, type: 'non-critical' }] as any },
    async ({ page }) => {
      await logStep('Step 00: Read data from json relative to the service');
      const data = readServiceData();
      const environments = readEnvironments();
      const app = new WebApp(page);
      const projectName = `Automation Project Offplan ${new Date()
        .toISOString()
        .replace(/[-:T.]/g, '')
        .slice(0, 14)}`;
      DataHelper.updateServiceData(SERVICE, 'projectName', projectName);

      await logStep('Step 01: Login to admin portal as a super admin');
      await app.adminProjectPage.login(environments.adminPortalUrl, data.adminUsername, data.adminPassword);

      await logStep('Step 02: Navigate to internal inventory > Project');
      await app.adminProjectPage.clickInternalInventory();
      await app.adminProjectPage.clickProjectsLink();

      await logStep('Step 03: Navigate to add new project page');
      await app.adminProjectPage.clickAddNewProjectButton();

      await logStep('Step 04: Select project type as Offplan Land Land Only Project');
      await app.adminProjectPage.fillProjectName(projectName);
      await app.adminProjectPage.selectProjectType(projectType.OffplanLand_LandOnly);

      await logStep('Step 05: Select Marketing and Sales partnership type');
      await app.adminProjectPage.clickDeveloperPartnerShipDropdown();
      await app.adminProjectPage.selectPartnershipOption('تسويق وبيع');

      await logStep('Step 06: Enter agreement amount less than 1.25 and validate the error is displayed "Agreement amount must be greater than or equal to 1.25"');
      await app.adminProjectPage.enterAgreementAmount('1');
      const belwoLowerBoundaryMessage = await app.commonMethods.getLocator(AdminProjectObjects.agreementAmountTextboxErrorMessage).innerText();
      expect(belwoLowerBoundaryMessage).toBe('يجب أن يكون مبلغ الاتفاقية أكبر من أو يساوي 1.25');

      await logStep('Step 07: Enter agreement amount less than 100 and validate the error is displayed "Agreement amount must be less than or equal to 100"');
      await app.adminProjectPage.enterAgreementAmount('101');
      const aboveUpperBoundaryMessage = await app.commonMethods.getLocator(AdminProjectObjects.agreementAmountTextboxErrorMessage).innerText();
      expect(aboveUpperBoundaryMessage).toBe('يجب أن يكون مبلغ الاتفاقية أقل من أو يساوي 100');
    }
  );

  test(
    'SAK-1537-12 Expired agreement end date keeps the project publish status unchanged - Offplan MOH Land Project',
    { annotation: [{ product: Products.Marketplace, type: 'non-critical' }] as any },
    async ({ page }) => {
      await logStep('Step 00: Read data from json relative to the service');
      const data = readServiceData();
      const environments = readEnvironments();
      const app = new WebApp(page);
      const projectName = 'Automation Project 20260819085457';

      await logStep('Step 01: Login to admin portal as a super admin');
      await app.adminProjectPage.login(environments.adminPortalUrl, data.adminUsername, data.adminPassword);

      await logStep('Step 02: Navigate to internal inventory > Project');
      await app.adminProjectPage.clickInternalInventory();
      await app.adminProjectPage.clickProjectsLink();

      await logStep('Step 03: Search for a published offplan moh land project and navigate to project details page');
      await app.resaleOfUnitsPage.fillProjectName(projectName);
      await app.resaleOfUnitsPage.clickProjectSearchButton();
      await app.resaleOfUnitsPage.clickSearchedProjectResult(projectName);
      await page.waitForTimeout(10000);

      await logStep('Step 04: Select Marketing and Sales partnership type');
      await app.adminProjectPage.clickDeveloperPartnerShipDropdown();
      await app.adminProjectPage.selectPartnershipOption('تسويق وبيع');

      await logStep('Step 06: Enter expired agreement sign date and end date ');
      await app.adminProjectPage.fillProjectAgreementDate('30/08/2020');
      await app.adminProjectPage.fillProjectAgreementEndDate('18/08/2026');

      await logStep('Step 07: Enter agreement amount less than 100 and validate the error is displayed "Agreement amount must be less than or equal to 100"');
      await app.adminProjectPage.clickSaveButton();
      await app.adminProjectPage.validateProjectSavedToastMessage();
      await page.waitForTimeout(4000);
      await expect(app.commonMethods.getLocator(AdminProjectObjects.projectPublishedToggle)).toHaveAttribute('aria-checked', 'true');
    }
  );

  test(
    'SAK-1537-13 Verify project agreement end date must be after agreement sign date - ReadyMade MOH Land Project',
    { annotation: [{ product: Products.Marketplace, type: 'non-critical' }] as any },
    async ({ page }) => {
      await logStep('Step 00: Read data from json relative to the service');
      const data = readServiceData();
      const environments = readEnvironments();
      const app = new WebApp(page);
      const projectName = 'Automation Project 20260819085457';

      await logStep('Step 01: Login to admin portal as a super admin');
      await app.adminProjectPage.login(environments.adminPortalUrl, data.adminUsername, data.adminPassword);

      await logStep('Step 02: Navigate to internal inventory > Project');
      await app.adminProjectPage.clickInternalInventory();
      await app.adminProjectPage.clickProjectsLink();

      await logStep('Step 03: Navigate to add new project page');
      await app.adminProjectPage.clickAddNewProjectButton();

      await logStep('Step 04: Select project type as ReadyMade MOH Land Project');
      await app.adminProjectPage.fillProjectName(projectName);
      await app.adminProjectPage.selectProjectType(projectType.ReadymadeMOHLand);

      await logStep('Step 05: Enter compulsory project details');
      await app.adminProjectPage.selectRegion('الرياض');
      await app.adminProjectPage.selectCity('الخرج');
      await app.adminProjectPage.selectDeveloperName('شركة الضاحية المثالية للتطوير والاستثمار العقاري');
      await app.adminProjectPage.selectProjectStatus('متاح');

      await logStep('Step 06: Open developer partnership type list');
      await app.adminProjectPage.clickDeveloperPartnerShipDropdown();

      await logStep('Step 07: Select Makrketing and Sale partnership type');
      await app.adminProjectPage.selectPartnershipOption('تسويق وبيع');

      await logStep('Step 08: Enter agreement sign and end dates "Both the dates are same"');
      await app.adminProjectPage.fillProjectAgreementDate(DateUtils.getDateWithOffsetAndFormat(0, 'DD/MM/YYYY'));
      await app.adminProjectPage.enterAgreementAmount('5');
      await app.adminProjectPage.fillProjectAgreementEndDate(DateUtils.getDateWithOffsetAndFormat(0, 'DD/MM/YYYY'));
      await app.adminProjectPage.clickSaveButton();

      await logStep('Step 08: Validate the error message is displayed "Agreement end date must be after the agreement sign date"');
      let errorMessage = await app.commonMethods.getLocator(AdminProjectObjects.agreementEndDateErrorMessage).innerText();
      expect(errorMessage).toBe('يجب أن يكون تاريخ انتهاء الاتفاقية بعد تاريخ توقيع الاتفاقية');

      await logStep('Step 09: Enter agreement sign and end dates "agreement end date is before sign date"');
      await app.adminProjectPage.fillProjectAgreementDate(DateUtils.getDateWithOffsetAndFormat(0, 'DD/MM/YYYY'));
      await app.adminProjectPage.enterAgreementAmount('5');
      await app.adminProjectPage.fillProjectAgreementEndDate('10/10/2026');
      await app.adminProjectPage.clickSaveButton();

      await logStep('Step 10: Validate the error message is displayed "Agreement end date must be after the agreement sign date"');
      errorMessage = await app.commonMethods.getLocator(AdminProjectObjects.agreementEndDateErrorMessage).innerText();
      expect(errorMessage).toBe('يجب أن يكون تاريخ انتهاء الاتفاقية بعد تاريخ توقيع الاتفاقية');
    }
  );

  test(
    'SAK-1537-14 Verify agreement end date cannott be selected without selecting agreement sign date - ReadyMade Private Land Project',
    { annotation: [{ product: Products.Marketplace, type: 'non-critical' }] as any },
    async ({ page }) => {
      await logStep('Step 00: Read data from json relative to the service');
      const data = readServiceData();
      const environments = readEnvironments();
      const app = new WebApp(page);
      const projectName = 'Automation Project 20260819085457';

      await logStep('Step 01: Login to admin portal as a super admin');
      await app.adminProjectPage.login(environments.adminPortalUrl, data.adminUsername, data.adminPassword);

      await logStep('Step 02: Navigate to internal inventory > Project');
      await app.adminProjectPage.clickInternalInventory();
      await app.adminProjectPage.clickProjectsLink();

      await logStep('Step 03: Navigate to add new project page');
      await app.adminProjectPage.clickAddNewProjectButton();

      await logStep('Step 04: Select project type as ReadyMade Private Land Project');
      await app.adminProjectPage.fillProjectName(projectName);
      await app.adminProjectPage.selectProjectType(projectType.ReadymadePrivateLand);

      await logStep('Step 05: Open developer partnership type list');
      await app.adminProjectPage.clickDeveloperPartnerShipDropdown();

      await logStep('Step 06: Select Makrketing and Sale partnership type');
      await app.adminProjectPage.selectPartnershipOption('تسويق وبيع');

      await logStep('Step 07: Enter agreement sign and end dates "Both the dates are same"');
      expect(app.commonMethods.getLocator(AdminProjectObjects.agreementEndDate).isDisabled({ timeout: 20000 }));
    }
  );
});
