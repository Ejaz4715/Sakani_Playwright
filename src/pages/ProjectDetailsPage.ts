// @ts-nocheck
import {ProjectDetailsObjects} from '@objects/ProjectDetailsObjects'

export class ProjectDetailsPage {
  constructor(page) {
    this.page = page;
  }

  async click(locator) {
    await locator.click();
  }

  async check(locator) {
    await locator.check();
  }

  async openUnits() {
    const unitsButton = this.page.getByRole(
      ProjectDetailsObjects.unitsButton.role,
      { name: ProjectDetailsObjects.unitsButton.name },
    );
    await this.click(unitsButton);
  }

  async openUnitsAndScroll() {
    const unitsButton = this.page.getByRole("button", { name: "عرض الوحدات" });
    await unitsButton.waitFor({ state: "visible", timeout: 30000 });
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(2000);
    await unitsButton.click();
  }
}