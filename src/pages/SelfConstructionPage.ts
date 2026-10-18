import { expect, Page } from "@playwright/test";
import { SelfConstructionObjects } from "@objects/SelfConstructionObjects";
import { AdminObjects } from "@objects/AdminProjectsObjects";

export class SelfConstructionPage {
    page: Page;
    private documentTemplateTypeDropdownIndex = 0;

    constructor(page: Page) {
        this.page = page;
    }

    async fill(inputField: { xpath: string }, value: string) {
        const input = this.page.locator(inputField.xpath);
        await expect(input).toBeVisible();
        await input.fill(value);
    }

    async waitUntilNotFoundOptionHidden(timeout = 300000, pollInterval = 500) {
      const notFoundOption = this.page.locator(
        SelfConstructionObjects.notFoundOption.xpath,
      );
      const startTime = Date.now();

      do {
        if (!(await notFoundOption.isVisible())) {
          return;
        }

        const remainingTime = timeout - (Date.now() - startTime);
        if (remainingTime <= 0) {
          throw new Error(
            `The not-found option remained visible after ${timeout}ms`,
          );
        }

        await this.page.waitForTimeout(Math.min(pollInterval, remainingTime));
      } while (await notFoundOption.isVisible());
    }

    async uploadDesignLogo(filePath: string) {
    const uploadDesignLogo = this.page.locator(SelfConstructionObjects.uploadDesignLogo.xpath);
    await uploadDesignLogo.setInputFiles(filePath);
  }
    async uploadMasterPlan(filePath: string) {
    const uploadMasterPlan = this.page.locator(SelfConstructionObjects.uploadMasterPlan.xpath);
    await uploadMasterPlan.setInputFiles(filePath);
  }
    async uploadImage(filePath: string) {
    const uplaodImage = this.page.locator(SelfConstructionObjects.uplaodImage.xpath);
    await uplaodImage.setInputFiles(filePath);
  }

   async uploadBookingDocumentTemplate(filePath: string) {
    const upoladDocument = this.page.locator(SelfConstructionObjects.upoladDocument.xpath);
    await upoladDocument.setInputFiles(filePath);
  }
    async selectFirstDocumentTemplateType() {
      const dropdown = this.page.locator(
        SelfConstructionObjects.documentTemplateTypeDrodpwnList.xpath,
      ).nth(this.documentTemplateTypeDropdownIndex);
      await expect(dropdown).toBeVisible();
      await dropdown.click();

      const firstOption = this.page
        .locator(SelfConstructionObjects.documentTemplateTypeOption.xpath)
        .first();
      await expect(firstOption).toBeVisible();
      await firstOption.click();
      this.documentTemplateTypeDropdownIndex++;
    }

    async waitForMediaApproval() {
    const visualContentTab = this.page.getByRole(AdminObjects.mediaApprovalText.role, {
      name: AdminObjects.mediaApprovalText.name,
    });
    while (!await visualContentTab.isVisible().catch(() => false)) {
      await this.page.reload();
      await this.page.waitForTimeout(2000);
    }
    await expect(visualContentTab).toBeVisible();
  }
  async publishProject() {
    await this.waitForMediaApproval();
    const publishedToggle = this.page.locator(SelfConstructionObjects.publishToggle.xpath);
    await expect(publishedToggle).toBeVisible({ timeout: 30000 });
    if ((await publishedToggle.getAttribute("aria-checked")) === "false") {
      await publishedToggle.click();
    }
    await expect(publishedToggle).toHaveAttribute("aria-checked", "true");
  }
}