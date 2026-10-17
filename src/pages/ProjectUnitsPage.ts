import { expect, Locator, Page } from "@playwright/test";
const path = require("path");
import { ProjectUnitsObjects } from '@objects/ProjectUnitsObjects'

export class ProjectUnitsPage {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async openUnitInPopup(unitIndex: number) {
    const unitCard = this.page
      .locator(ProjectUnitsObjects.unitCard).nth(unitIndex);
    await unitCard.waitFor({ state: "visible", timeout: 30000 });
    await unitCard.click();
  }

  async selectLand(unitIndex: number) {
    const landCard = this.page
      .locator(ProjectUnitsObjects.landUnitCard).nth(unitIndex);
    await landCard.waitFor({ state: "visible", timeout: 30000 });
    await landCard.click();
  }

  async validateTheUnitPresence(apartmentNumber: string) {
    const unit = this.page.locator(ProjectUnitsObjects.unitCardApartmentNumber(apartmentNumber));
    const nextPageButton = this.page.locator(ProjectUnitsObjects.nextPageButton);

    while (true) {
      const isVisible = await unit.isVisible().catch(() => false);
      if (isVisible) {
        break;
      }
      const isNextEnabled = await nextPageButton.isEnabled().catch(() => false);
      if (!isNextEnabled) {
        throw new Error(`The added unit '${apartmentNumber}' is not present in the units page of the project model.`);
      }
      await nextPageButton.click();
    }
    await expect(unit, "The added unit is not present in the units page of the project model").toBeVisible({ timeout: 20000 });
  }
}