import { Page, expect, Locator } from '@playwright/test';
import { DeveloperObjects } from '@objects/DeveloperObjects';

const DEFAULT_TIMEOUT = 30_000;
const LONG_TIMEOUT = 90_000;

export class DeveloperProjectPage {
  page: Page;
  defaultTimeout: number | undefined;
  constructor(page: Page) {
    this.page = page;
    this.defaultTimeout = 60000;
  }

  async waitForVisible(locator: any) {
    await expect(locator).toBeVisible({ timeout: this.defaultTimeout });
  }

  async clickIfVisible(locator: Locator, options: { timeout?: number } = {}) {
    const timeout = options.timeout ?? 5000;
    const isVisible = await locator.isVisible({ timeout }).catch(() => false);
    if (isVisible) {
      await locator.click();
    }
  }

  async gotoAuth(url: string) {
    await this.page.goto(url);
  }

  async switchRoleToDeveloper() {
    const profileIcon = this.page.locator(DeveloperObjects.profileIcon);
    await this.waitForVisible(profileIcon);
    await profileIcon.click();

    const switchRoleButton = this.page.getByRole(DeveloperObjects.switchRoleButton.role, { name: DeveloperObjects.switchRoleButton.name });
    await this.waitForVisible(switchRoleButton);
    await switchRoleButton.click();

    const developerRole = this.page.getByText(DeveloperObjects.developerRoleText);
    await this.waitForVisible(developerRole);
    await developerRole.click();
    await this.page.waitForTimeout(3000); // Wait for 3 seconds to ensure the page is fully loaded
    const cancelButton = this.page.getByRole('button', { name: 'إلغاء' });
    await this.clickIfVisible(cancelButton.first());
  }

  async openProjectsPage() {
    // const menuIcon = this.page.locator(DeveloperObjects.menuIcon);
    // await this.waitForVisible(menuIcon);
    // await menuIcon.click();

    const projectsLink = this.page.getByRole(DeveloperObjects.projectsLink.role, { name: DeveloperObjects.projectsLink.name });
    await this.waitForVisible(projectsLink);
    await projectsLink.click();
  }

  async searchProject(projectName: string) {
    const projectFilter = this.page.locator(DeveloperObjects.projectFilter).first();
    await this.waitForVisible(projectFilter);
    await projectFilter.click();

    const projectNameOption = this.page.getByRole(DeveloperObjects.projectNameOption.role, { name: DeveloperObjects.projectNameOption.name });
    await this.waitForVisible(projectNameOption);
    await projectNameOption.click();

    const projectSearchInput = this.page.locator(DeveloperObjects.projectSearchInput).getByRole('combobox');
    await this.waitForVisible(projectSearchInput);
    await projectSearchInput.click();
    await projectSearchInput.fill(projectName);

    const projectOption = this.page.getByRole('option', { name: projectName });
    await expect(projectOption).toBeVisible({ timeout: this.defaultTimeout });
    await projectOption.click({ force: true });
  }

  async openProjectBySearch(projectName: string) {
    await this.openProjectsPage();
    await this.searchProject(projectName);

    const searchButton = this.page.getByRole(DeveloperObjects.searchButton.role, { name: DeveloperObjects.searchButton.name });
    await this.page.waitForTimeout(3000);
    await this.waitForVisible(searchButton);
    await searchButton.click();

    const passwordEyeIcon = this.page.locator(DeveloperObjects.passwordEyeIcon);
    await this.page.waitForTimeout(3000); // Wait for the password eye icon to be visible
    await this.waitForVisible(passwordEyeIcon);
    await passwordEyeIcon.click();
  }

  async openPaymentSchedulesTab() {
    const paymentScheduleTab = this.page
      .getByRole('tab', { name: /جداول الدفع/ })
      .or(this.page.getByText('جداول الدفع', { exact: true }))
      .first();
    await this.waitForVisible(paymentScheduleTab);
    await paymentScheduleTab.click();
  }

  async openSalesContractsTab() {
    const salesContractsTab = this.page.getByRole(DeveloperObjects.salesContractsTab.role, { name: DeveloperObjects.salesContractsTab.name });
    await this.waitForVisible(salesContractsTab);
    await salesContractsTab.click();
  }

  async viewAndApproveSalesContract() {
    const viewAndApproveButton = this.page.getByRole(DeveloperObjects.viewAndApproveButton.role, {
      name: DeveloperObjects.viewAndApproveButton.name,
    });
    await this.waitForVisible(viewAndApproveButton);
    await viewAndApproveButton.click();
  }

  async approveUnitSpecification() {
    const addUnitSpecificationButton = this.page.locator(DeveloperObjects.addUnitSpecificationButton);
    await this.waitForVisible(addUnitSpecificationButton);
    await addUnitSpecificationButton.click();
  }

  async fillOtp(code = '1234') {
    const otpInput = this.page.locator(DeveloperObjects.otpInput);
    await this.waitForVisible(otpInput);
    await otpInput.fill(code);
  }

  async verifyOtp() {
    const verifyCodeButton = this.page.getByRole(DeveloperObjects.verifyCodeButton.role, { name: DeveloperObjects.verifyCodeButton.name });
    await this.waitForVisible(verifyCodeButton);
    await verifyCodeButton.click();
  }

  async openAddAnnexDialog() {
    const addAnnexButton = this.page.getByRole(DeveloperObjects.addAnnexButton.role, { name: DeveloperObjects.addAnnexButton.name });
    await this.waitForVisible(addAnnexButton);
    await addAnnexButton.click();
  }

  async searchUnitByCode(unitCode: string) {
    const unitCodeInput = this.page.locator("//app-sapa-input-with-icon[@formcontrolname='unit_code']/descendant::input");
    await this.waitForVisible(unitCodeInput);
    await unitCodeInput.fill(unitCode);

    const searchButton = this.page.getByRole(DeveloperObjects.searchButton.role, { name: DeveloperObjects.searchButton.name });
    await searchButton.click();
  }

  async selectFirstUnit() {
    const firstUnit = this.page.getByRole('cell').first();
    await this.waitForVisible(firstUnit);
    await firstUnit.click();
  }

  async openSelectedUnitsAnnexDialog() {
    const addAnnexButton = this.page.getByRole(DeveloperObjects.addAnnexToSelectedUnitsButton.role, {
      name: DeveloperObjects.addAnnexToSelectedUnitsButton.name,
    });
    await this.waitForVisible(addAnnexButton);
    await addAnnexButton.click();
  }

  async uploadAnnexFile(filePath: string) {
    const fileInput = this.page.locator(DeveloperObjects.uploadFile);
    await fileInput.setInputFiles(filePath);
    const attachmentText = this.page.getByText('الملف المرفق', { exact: true });
    await attachmentText.waitFor({ state: 'visible' });
  }

  async uploadAnnex() {
    const uploadButton = this.page.getByRole(DeveloperObjects.uploadButton.role, { name: DeveloperObjects.uploadButton.name });
    await this.waitForVisible(uploadButton);

    await uploadButton.click();
  }

  async approveAnnex() {
    const approveButton = this.page.getByRole(DeveloperObjects.approveButton.role, { name: DeveloperObjects.approveButton.name });
    await this.waitForVisible(approveButton);
    await approveButton.click();
  }

  async expectAnnexSuccess() {
    const successMessage = this.page.getByText(DeveloperObjects.annexSuccessMessage);
    await this.waitForVisible(successMessage);
  }

  async verifyApprovalSuccessMessage() {
    const successMessage = this.page.getByText(DeveloperObjects.approvalSuccessMessage, { exact: false });
    await this.waitForVisible(successMessage);

    const modal = this.page.locator(DeveloperObjects.approvalModal);
    await expect(modal).toContainText(DeveloperObjects.approvalSuccessMessage);
  }

  async addPaymentSchedule({
    type,
    scheduleName,
    completionPercentageOneValue,
    percentageOneValue,
    completionPercentageTwoValue,
    percentageTwoValue,
  }: {
    type: string;
    scheduleName: string;
    completionPercentageOneValue: string;
    percentageOneValue: string;
    completionPercentageTwoValue: string;
    percentageTwoValue: string;
  }) {
    const addScheduleButton = this.page
      .getByRole('button', { name: /إضافة جدول جديد/ })
      .or(this.page.getByText('إضافة جدول جديد', { exact: true }))
      .first();
    await this.waitForVisible(addScheduleButton);
    await addScheduleButton.click();

    const scheduleType = type === 'cash' ? this.page.getByText(DeveloperObjects.cashOption) : this.page.getByText(DeveloperObjects.lendingOption);
    await this.waitForVisible(scheduleType);
    await scheduleType.click();

    const scheduleNameInput = this.page.getByRole(DeveloperObjects.scheduleNameInput.role, { name: DeveloperObjects.scheduleNameInput.name });
    await this.waitForVisible(scheduleNameInput);
    await scheduleNameInput.fill(scheduleName);

    const completionPercentageOne = this.page.locator(DeveloperObjects.completionPercentageOne).getByRole('textbox', { name: 'مثال: 15٪' });
    await this.waitForVisible(completionPercentageOne);
    await completionPercentageOne.fill(completionPercentageOneValue);

    const percentageOne = this.page.locator(DeveloperObjects.percentageOne).getByRole('textbox', { name: 'مثال: 15٪' });
    await this.waitForVisible(percentageOne);
    await percentageOne.fill(percentageOneValue);

    const completionPercentagetwo = this.page.locator(DeveloperObjects.completionPercentageTwo).getByRole('textbox', { name: 'مثال: 15٪' });
    await this.waitForVisible(completionPercentagetwo);
    await completionPercentagetwo.fill(completionPercentageTwoValue);

    const percentageTwo = this.page.locator(DeveloperObjects.percentageTwo).getByRole('textbox', { name: 'مثال: 15٪' });
    await this.waitForVisible(percentageTwo);
    await percentageTwo.fill(percentageTwoValue);

    const normalConfirmButton = this.page.getByRole(DeveloperObjects.confirmButton.role, { name: DeveloperObjects.confirmButton.name });
    await this.waitForVisible(normalConfirmButton);
    await normalConfirmButton.click({ force: true });

    const popupConfirmButton = this.page.locator(DeveloperObjects.confirmButtonPopup);
    await this.waitForVisible(popupConfirmButton);
    await popupConfirmButton.click({ force: true });

    const updateButton = this.page.getByRole(DeveloperObjects.updateButton.role, { name: /تحديث/ });
    await this.waitForVisible(updateButton);
  }

  async navigateToIndividualBookings() {
    await this.waitAndClick(this.page.locator(DeveloperObjects.manageReservationsButton));
    await this.waitAndClick(this.page.locator(DeveloperObjects.individualBooking));
  }

  async searchBookingByUnitCode(unitCode: string) {
    const searchInput = this.page.getByRole(DeveloperObjects.bookingSearchInput.role, { name: DeveloperObjects.bookingSearchInput.name });
    await this.waitForVisible(searchInput);
    await searchInput.fill(unitCode);
    await this.page.waitForTimeout(3000);
  }

  async filterBookingsByStatus(status: string) {
    const statusDropdown = this.page.locator(DeveloperObjects.bookingFilterStatusDropdown);
    await statusDropdown.click();
    const statusOption = this.page.locator(DeveloperObjects.bookingFilterStatusOptions(status));
    await statusOption.click();
    await this.page.waitForTimeout(3000);
  }

  async viewDetailsOfSearchedBooking() {
    const viewDetailsButton = this.page.locator(DeveloperObjects.viewBookingDetails);
    await viewDetailsButton.click();
  }

  async switchToBookingTab() {
    const bookingTab = this.page.getByRole(DeveloperObjects.bookingsTab.role, { name: DeveloperObjects.bookingsTab.name });
    await bookingTab.click();
  }

  async confirmBooking(unitCode: string) {
    // 1. Navigate to the manage reservations and individual booking section
    await this.navigateToIndividualBookings();

    // 2. Search for the specific unit using the provided unit code parameter
    await this.searchBookingByUnitCode(unitCode);

    // 3. Open the booking details and switch to the bookings tab
    await this.viewDetailsOfSearchedBooking();
    await this.switchToBookingTab();

    // 4. Locate and click the confirm booking buttons (handling both first and last instances)
    const confirmBookingButton = this.page.locator(DeveloperObjects.confirmBookingActionButton);
    await confirmBookingButton.nth(0).click();

    // 5. Click the confirmation popup/button ("Confirm")
    await confirmBookingButton.nth(1).click();

    // 6. Click the confirmation popup/button ("Yes") if present
    const yesButton = this.page.getByRole(DeveloperObjects.yesConfirmationButton.role, {
      name: DeveloperObjects.yesConfirmationButton.name,
    });
    if (await yesButton.isVisible()) {
      await yesButton.click();
    }

    // 7. Assert that the booking success message is visible on the screen
    await expect(this.page.getByText(DeveloperObjects.confirmBookingSuccessText), 'Confirmation booking success text is not visible').toBeVisible({ timeout: 20000 });
  }

  async confirmCompanyBooking(unitCode: string) {
    // 1. Navigate to the manage reservations and individual booking section
    await this.navigateToIndividualBookings();

    // 2. Search for the specific unit using the provided unit code parameter
    await this.searchBookingByUnitCode(unitCode);

    // 3. Open the booking details and switch to the bookings tab
    await this.page.locator(DeveloperObjects.viewBookingDetails).click();
    await this.page.getByRole(DeveloperObjects.bookingsTab.role, { name: DeveloperObjects.bookingsTab.name }).click();

    // 4. Locate and click the confirm booking buttons (handling both first and last instances)
    const confirmBookingButton = this.page.locator(DeveloperObjects.confirmBookingActionButton);
    await confirmBookingButton.nth(0).click();

    // 5. Click the confirmation popup/button ("Confirm")
    await confirmBookingButton.nth(1).click();

    // 6. Click the confirmation popup/button ("Yes") if present
    const yesButton = this.page.getByRole(DeveloperObjects.yesConfirmationButton.role, {
      name: DeveloperObjects.yesConfirmationButton.name,
    });
    if (await yesButton.isVisible()) {
      await yesButton.click();
    }

    // 7. Assert that the booking success message is visible on the screen
    await expect(this.page.getByText(DeveloperObjects.confirmBookingSuccessText), 'Confirmation booking success text is not visible').toBeVisible({ timeout: 20000 });
  }

  async isSuccessfulConfirmationMessageVisible() {
    return await this.page.locator(DeveloperObjects.successfulBookingConfirmationMessage).isVisible();
  }

  async closeConfirmationModal() {
    await this.page.locator(DeveloperObjects.closeConfirmationModal).click();
  }

  async clickOnCompanies() {
    await this.page.locator(DeveloperObjects.companiesButton).waitFor({ state: 'visible' });
    await this.page.locator(DeveloperObjects.companiesButton).click();
  }

  async waitAndClick(locator: Locator, timeout = DEFAULT_TIMEOUT) {
    await locator.waitFor({ state: 'visible', timeout });
    await locator.click();
  }

  async waitAndFill(locator: Locator, value: string, timeout = DEFAULT_TIMEOUT) {
    await locator.waitFor({ state: 'visible', timeout });
    await locator.fill(value);
  }

  async bookUnitsForCustomers(nationalIdentity: string, projectName: string) {
    await this.waitAndClick(this.page.locator(DeveloperObjects.manageReservationsButton));
    await this.waitAndClick(this.page.locator(DeveloperObjects.individualBooking));

    await this.waitAndClick(this.page.locator(DeveloperObjects.newBookingButton), LONG_TIMEOUT);
    await this.waitAndFill(this.page.locator(DeveloperObjects.nationalIdentityField), nationalIdentity);

    const searchButton = this.page.getByRole(DeveloperObjects.searchButton.role, { name: DeveloperObjects.searchButton.name });
    await this.waitForVisible(searchButton);
    await searchButton.click();

    const nextButton = this.page.locator(DeveloperObjects.nextButton);
    await expect(nextButton).toBeEnabled({ timeout: DEFAULT_TIMEOUT });
    await nextButton.click();

    await this.page.waitForTimeout(3000);
    await this.page.locator(DeveloperObjects.projectNameField).fill(projectName);
    await this.page.waitForTimeout(2000);
    await this.page.locator(DeveloperObjects.projectNameOptionSelector).click();
  }

  async bookUnitsForCustomersUsingUnitCode(nationalIdentity: string, unitCode: string) {
    await this.waitAndClick(this.page.locator(DeveloperObjects.manageReservationsButton));
    await this.waitAndClick(this.page.locator(DeveloperObjects.individualBooking));
    await this.waitAndClick(this.page.locator(DeveloperObjects.newBookingButton), LONG_TIMEOUT);
    await this.waitAndFill(this.page.locator(DeveloperObjects.nationalIdentityField), nationalIdentity);

    const searchButton = this.page.getByRole(DeveloperObjects.searchButton.role, { name: DeveloperObjects.searchButton.name });
    await this.waitForVisible(searchButton);
    await searchButton.click();

    const nextButton = this.page.locator(DeveloperObjects.nextButton);
    await expect(nextButton).toBeEnabled({ timeout: DEFAULT_TIMEOUT });
    await nextButton.click();

    await this.page.waitForTimeout(3000);
    await this.page.locator(DeveloperObjects.unitCodeTextfield).fill(unitCode);
  }

  async bookUnitsForCompanies(companyUserId: string, companyCR: string, projectName: string) {
    await this.waitAndClick(this.page.locator(DeveloperObjects.manageReservationsButton));
    await this.waitAndClick(this.page.locator(DeveloperObjects.companyBookings));
    await this.waitAndClick(this.page.locator(DeveloperObjects.newBookingButton));
    await this.waitAndFill(this.page.locator(DeveloperObjects.companyCRField), companyCR);

    const searchButton = this.page.getByRole(DeveloperObjects.searchButton.role, { name: DeveloperObjects.searchButton.name });
    await this.waitForVisible(searchButton);
    await searchButton.click();
    await this.waitAndClick(this.page.locator(DeveloperObjects.nextButton));
    await this.waitAndFill(this.page.locator(DeveloperObjects.companyUserId), companyUserId);
    await searchButton.click();
    await this.waitAndClick(this.page.locator(DeveloperObjects.nextButton));

    await this.page.waitForTimeout(3000);
    await this.page.locator(DeveloperObjects.projectNameField).fill(projectName);
    await this.page.waitForTimeout(2000);
    await this.page.locator(DeveloperObjects.projectNameOptionSelector).click();
  }

  async clickOnNextButton() {
    await this.waitAndClick(this.page.locator(DeveloperObjects.nextButton));
  }

  async clickOnKeepBooking() {
    await this.waitAndClick(this.page.locator(DeveloperObjects.continueBookingButton));
  }

  async confirmBookingForCompanies() {
    await this.waitAndClick(this.page.locator(DeveloperObjects.confirmCompanyBooking));
  }

  async isCompanyBookingConfirmed() {
    await this.page.locator(DeveloperObjects.showBookingDetailsButton).waitFor({ state: 'visible', timeout: 30000 });

    return await this.page.locator(DeveloperObjects.showBookingDetailsButton).isVisible();
  }

  async clickOnConfirmationButton() {
    const confirmButton = this.page.getByRole(DeveloperObjects.confirmButton.role, { name: DeveloperObjects.confirmButton.name });
    await confirmButton.waitFor({ state: 'visible', timeout: DEFAULT_TIMEOUT });
    await confirmButton.click();
  }

  async isBookingListButtonVisible() {
    await this.page.locator(DeveloperObjects.bookingListButton).waitFor({ state: 'visible', timeout: 90000 });
    return await this.page.locator(DeveloperObjects.bookingListButton).isVisible();
  }

  async openTheFirstExistingProject() {
    await this.page.locator(DeveloperObjects.showFirstProjectDetails).first().waitFor({ state: 'visible', timeout: DEFAULT_TIMEOUT });
    await this.page.locator(DeveloperObjects.showFirstProjectDetails).first().click();
  }

  async clickOnReports() {
    const reportsLink = this.page.getByRole(DeveloperObjects.reportsLink.role, { name: DeveloperObjects.reportsLink.name });
    await this.waitForVisible(reportsLink);
    await reportsLink.click();
  }

  async selectBookingsAndUnitsReport() {
    const reportTypeDropdown = this.page.locator(DeveloperObjects.reportTypeDropdown.xpath);
    await this.waitForVisible(reportTypeDropdown);
    await reportTypeDropdown.click();

    const reportOption = this.page.getByRole(DeveloperObjects.bookingsAndUnitsReportOption.role, {
      name: DeveloperObjects.bookingsAndUnitsReportOption.name,
    });
    await this.waitForVisible(reportOption);
    await reportOption.click();
  }

  async clickIssueTheReportButton() {
    const issueTheReportButton = this.page.getByRole(DeveloperObjects.issueTheReportButton.role, {
      name: DeveloperObjects.issueTheReportButton.name,
    });
    await this.waitForVisible(issueTheReportButton);
    await issueTheReportButton.click();
  }
  async clickIssueReportButton() {
    const issueReportButton = this.page.getByRole(DeveloperObjects.issueReportButton.role, { name: DeveloperObjects.issueReportButton.name });
    await this.waitForVisible(issueReportButton);
    await issueReportButton.click();
  }

  async searchProjectForReport(projectName: string) {
    const projectSearchInput = this.page.getByRole(DeveloperObjects.projectSearchInputFieldForReport.role, {
      name: DeveloperObjects.projectSearchInputFieldForReport.name,
    });
    await this.waitForVisible(projectSearchInput);
    await projectSearchInput.fill(projectName);
    await this.page.waitForTimeout(2000);
    // await projectSearchInput.press("Backspace");

    const projectResult = this.page.locator(DeveloperObjects.projectResult.xpath).first();
    if (await projectResult.isVisible()) {
      await projectResult.click();
    }
  }

  async refreshUntilReportStatusChanges() {
    const status = this.page.locator(DeveloperObjects.status.xpath);
    const deadline = Date.now() + LONG_TIMEOUT;

    await this.waitForVisible(status);
    while ((await status.innerText()).trim() === 'تحت الإجراء') {
      const remainingTime = deadline - Date.now();
      if (remainingTime <= 0) {
        throw new Error(`Report status remained "تحت الإجراء" for ${LONG_TIMEOUT}ms`);
      }

      await this.page.waitForTimeout(Math.min(2000, remainingTime));
      await this.page.reload();
      await status.waitFor({
        state: 'visible',
        timeout: Math.max(1, deadline - Date.now()),
      });
    }
  }

  async clickReportDownloadButton() {
    const downloadButton = this.page.locator(DeveloperObjects.downloadButton.xpath);
    await this.waitForVisible(downloadButton);
    await downloadButton.click();
  }

  async isReportAddedToastMessageVisible() {
    return await this.page.getByText(DeveloperObjects.reportAddedToastMessage).isVisible();
  }

  async selectUnitCheckbox(row: number) {
    const unitCheckbox = this.page.locator(DeveloperObjects.unitCheckbox(row));
    await this.waitForVisible(unitCheckbox);
    await unitCheckbox.click();
  }

  async clickContinueBookingButton() {
    const contiueBooking = this.page.locator(DeveloperObjects.contiueBookingButton);
    await this.waitForVisible(contiueBooking);
    await contiueBooking.click();
  }

  async selectBank(bankName: string) {
    const bankDropdown = this.page.locator(DeveloperObjects.bankDropdown);
    const bankOptions = this.page.locator(DeveloperObjects.bankOptions(bankName));
    await this.waitForVisible(bankDropdown);
    await bankDropdown.click();
    await this.waitForVisible(bankOptions);
    await bankOptions.click();
  }

  async clickSelectAndContinue() {
    const selectAndContinue = this.page.getByRole(DeveloperObjects.selectAndContinueButton.role, { name: DeveloperObjects.selectAndContinueButton.name });
    await selectAndContinue.click({ timeout: 20000 });
  }

  async validateSuccessReservationPopup() {
    const reservationSuccessPopup = this.page.locator(DeveloperObjects.reservationSuccessPopup);
    await expect(reservationSuccessPopup, 'Reservation successful message pop up is not present').toBeVisible({ timeout: 20000 });
  }

  async clickOnIndividualBookings() {
    await this.waitAndClick(this.page.locator(DeveloperObjects.manageReservationsButton));
    await this.waitAndClick(this.page.locator(DeveloperObjects.individualBooking));
  }

  async clickOnCompanyBookings() {
    await this.waitAndClick(this.page.locator(DeveloperObjects.manageReservationsButton));
    await this.waitAndClick(this.page.locator(DeveloperObjects.companyBookings));
  }

  async validateSelectedPaymentMethodIsLending() {
    const paymentMethod = this.page.locator(DeveloperObjects.selectedPaymentMethodLending.xpath);
    await expect(paymentMethod, 'Selected payment method is not Lending').toBeVisible({ timeout: 20000 });
  }

  async validateSelectedPaymentMethodIsCash() {
    const paymentMethod = this.page.locator(DeveloperObjects.selectedPaymentMethodCash.xpath);
    await expect(paymentMethod, 'Selected payment method is not Cash').toBeVisible({ timeout: 20000 });
  }
}
