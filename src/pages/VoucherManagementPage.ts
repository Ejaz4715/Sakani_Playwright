import { expect, Page } from "@playwright/test";
import { VoucherManagementObjects } from "@objects/VoucherManagementObjects";

export class VoucherManagementPage {
  constructor(private readonly page: Page) {}

  async clickAddVoucherButton() {
    await this.page
      .getByRole(
        VoucherManagementObjects.addVoucherButton.role,
        { name: VoucherManagementObjects.addVoucherButton.name }
      )
      .click();
  }

  async fillVoucherName(name: string) {
    await this.page.locator(VoucherManagementObjects.voucherNameInput).fill(name);
  }

  async fillVoucherLimit(limit: string) {
    await this.page
      .locator(VoucherManagementObjects.voucherLimitInput)
      .fill(limit);
  }

  async fillVoucherDescription(description: string) {
    await this.page
      .locator(VoucherManagementObjects.voucherDescriptionInput)
      .fill(description);
  }

  async uploadVoucherImage(imageFilePath: string) {
    await this.page
      .locator(VoucherManagementObjects.voucherImageInput)
      .setInputFiles(imageFilePath);
  }

  async waitAfterVoucherImageUpload() {
    await this.page.waitForTimeout(3000);
  }

  async clickRegionSelect() {
    await this.page.locator(VoucherManagementObjects.regionSelect).click();
  }

  async selectRegion(region: string) {
    await this.page
      .getByRole(VoucherManagementObjects.regionOption.role, { name: region })
      .click();
  }

  async clickCitySelect() {
    await this.page.locator(VoucherManagementObjects.citySelect).click();
  }

  async selectCity(city: string) {
    await this.page
      .getByRole(VoucherManagementObjects.cityOption.role, { name: city })
      .click();
  }

  async clickSaveButton() {
    await this.page
      .getByRole(
        VoucherManagementObjects.saveButton.role,
        { name: VoucherManagementObjects.saveButton.name }
      )
      .click();
  }

  async expectAddVoucherButtonVisible(timeout = 20000, message?: string) {
    await expect(
      this.page.getByRole(
        VoucherManagementObjects.addVoucherButton.role,
        { name: VoucherManagementObjects.addVoucherButton.name }
      ),
      message
    ).toBeVisible({ timeout });
  }

  async expectVoucherVisible(name: string, timeout = 20000) {
    await expect(this.page.getByText(name)).toBeVisible({ timeout });
  }

  async clickVoucher(name: string) {
    await this.page
      .getByRole(
        VoucherManagementObjects.voucherCell.role,
        { name }
      )
      .click();
  }

  async clickEditButton() {
    await this.page
      .getByRole(
        VoucherManagementObjects.editButton.role,
        { name: VoucherManagementObjects.editButton.name }
      )
      .click();
  }

  async getVoucherDescription() {
    return this.page
      .locator(VoucherManagementObjects.voucherDescriptionInput)
      .inputValue();
  }

  async expectVoucherUpdatedToastVisible(timeout = 20000) {
    await expect(
      this.page.locator(VoucherManagementObjects.voucherUpdatedToast),
      "Voucher is not created"
    ).toBeVisible({ timeout });
  }

  async clickDeleteButton() {
    await this.page
      .getByRole(
        VoucherManagementObjects.deleteButton.role,
        { name: VoucherManagementObjects.deleteButton.name }
      )
      .click();
  }

  async clickFirstDeleteButton() {
    await this.page
      .getByRole(
        VoucherManagementObjects.deleteButton.role,
        { name: VoucherManagementObjects.deleteButton.name }
      )
      .nth(0)
      .click();
  }

  async expectVoucherDeletedToastVisible(timeout = 20000) {
    await expect(
      this.page.locator(VoucherManagementObjects.voucherDeletedToast),
      "Voucher is not deleted"
    ).toBeVisible({ timeout });
  }
}