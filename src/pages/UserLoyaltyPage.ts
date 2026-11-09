import { Page } from '@playwright/test';
import { UserLoyaltyObjects } from '@objects/UserLoyaltyObjects';

export class UserLoyaltyPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async clickOnSakaniLogo() {
    await this.page.locator(UserLoyaltyObjects.sakaniLogo.xpath).click();
  }

  async clickLaterButton() {
    await this.page.waitForLoadState('networkidle').catch(() => {});
    const laterButton = this.page.getByRole(UserLoyaltyObjects.laterButton.role, {
      name: UserLoyaltyObjects.laterButton.name,
    });
    const isVisible = await laterButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (isVisible) {
      await laterButton.click();
    }
  }

  async clickBuyNowLinkOnLandingPage() {
    await this.page
      .getByRole(UserLoyaltyObjects.buyNowLinkOnLandingPage.role, {
        name: UserLoyaltyObjects.buyNowLinkOnLandingPage.name,
      })
      .click();
  }

  async clickBuyNowButtonOnDealDetailsPage() {
    await this.page
      .getByRole(UserLoyaltyObjects.buyNowButtonOnDealDetailsPage.role, {
        name: UserLoyaltyObjects.buyNowButtonOnDealDetailsPage.name,
      })
      .click();
  }

  async selectCreditCardPaymentRadio() {
    await this.page.waitForLoadState('networkidle').catch(() => {});
    const radioButton = await this.page.getByRole(UserLoyaltyObjects.creditCardPaymentRadio.role, {
      name: UserLoyaltyObjects.creditCardPaymentRadio.name,
    });
    await radioButton.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    await radioButton.check();
  }

  async clickContinuePayment() {
    const continueButton = await this.page.getByRole(UserLoyaltyObjects.continuePaymentButton.role, {
      name: UserLoyaltyObjects.continuePaymentButton.name,
    });
    await continueButton.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    await continueButton.click();
  }

  async verifyPaymentFailed() {
    await this.page.waitForLoadState('networkidle').catch(() => {});
    const paymentFailureHeading = this.page.getByRole(UserLoyaltyObjects.paymentFailedHeading.role, {
      name: UserLoyaltyObjects.paymentFailedHeading.name,
      exact: UserLoyaltyObjects.paymentFailedHeading.exact,
    });
    const isPaymentFailed = await paymentFailureHeading.isVisible({ timeout: 5000 }).catch(() => false);
    if (isPaymentFailed) {
      throw new Error("Test failed: Payment failed heading ('فشل الدفع') was detected on the page.");
    }
  }
}
