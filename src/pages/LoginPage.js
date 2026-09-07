const path = require("path");

const { LoginObjects } = require(
  path.join(process.cwd(), "src","objects", "LoginObjects")
);

const testData = require(
  path.join(process.cwd(), "src","data", "test-data.json"),
);

class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async click(locator) {
    await locator.click();
  }

  async check(locator) {
    await locator.check();
  }

  async gotoHomePage(url = testData.userPortalUrl) {
    await this.page.goto(url);
  }

  async acceptCookies() {
    // const acceptCookiesModal = this.page.locator(LoginObjects.acceptCookiesModal);
    // await this.click(acceptCookiesModal);

    const acceptCookiesButton = this.page.getByRole(
      LoginObjects.acceptCookiesButton.role,
      { name: LoginObjects.acceptCookiesButton.name },
    );
    await this.click(acceptCookiesButton);

    // const closeCookiesModal = this.page.locator(LoginObjects.closeCookiesModal);
    // await this.click(closeCookiesModal);
  }

  async openLogin() {
    const loginButton = this.page.locator(LoginObjects.loginButton);
    await this.click(loginButton);

    const continueWithNafathButton = this.page.getByRole(
      LoginObjects.continueWithNafathButton.role,
      { name: LoginObjects.continueWithNafathButton.name },
    );
    await this.click(continueWithNafathButton);
  }

  async loginWithNafath(nationalId) {
    const nafathInput = this.page.getByRole(LoginObjects.nafathIdInput.role, {
      name: LoginObjects.nafathIdInput.name,
    });
    await nafathInput.click();
    await nafathInput.fill(nationalId);

    const continueButton = this.page.getByRole(
      LoginObjects.continueButton.role,
      { name: LoginObjects.continueButton.name },
    );
    await this.click(continueButton);
  }

  async waitForNafathPromptToDisappear() {
    const nafathPromptHeading = this.page.getByRole(
      LoginObjects.nafathPromptHeading.role,
      { name: LoginObjects.nafathPromptHeading.name },
    );

    try {
      await nafathPromptHeading.waitFor({ state: "visible", timeout: 15000 });
      await nafathPromptHeading.waitFor({ state: "hidden", timeout: 30000 });
    } catch {
      // If the prompt never appears or is already gone, continue.
    }
  }

  async continueNewUserPopup() {
    const newUserContinueButton = this.page.getByRole(
      LoginObjects.newUserContinueButton.role,
      { name: LoginObjects.newUserContinueButton.name },
    );
    if (await newUserContinueButton.isVisible().catch(() => false)) {
      await newUserContinueButton.click({ force: true });
    }
  }

  async handlePushNotificationPopup() {
    const allowNotificationsButton = this.page.getByRole(
      LoginObjects.allowNotificationsButton.role,
      { name: LoginObjects.allowNotificationsButton.name },
    );

    try {
      await allowNotificationsButton.waitFor({
        state: "visible",
        timeout: 5000,
      });
      await allowNotificationsButton.click({ force: true });
    } catch {
      // Notification popup not present; continue with the flow.
    }
  }
}

module.exports = { LoginPage };
