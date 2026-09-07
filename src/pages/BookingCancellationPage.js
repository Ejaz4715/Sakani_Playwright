const { expect } = require("@playwright/test");
const path = require("path");

const { BookingCancellationObjects } = require(
  path.join(process.cwd(), "src","objects", "BookingCancellationObjects")
);

class BookingCancellationPage {
  constructor(page) {
    this.page = page;
  }

  async click(locator) {
    await locator.click();
  }

  async check(locator) {
    await locator.check();
  }

  async openMyBookings() {
    const userProfileButton = this.page.locator(
      BookingCancellationObjects.userProfileButton,
    );
    await this.click(userProfileButton);

    const myBookingsLink = this.page.getByText(
      BookingCancellationObjects.myBookingsLink.text,
    );
    await this.click(myBookingsLink);

    const activeBookingsTab = this.page.getByRole(
      BookingCancellationObjects.activeBookingsTab.role,
      { name: BookingCancellationObjects.activeBookingsTab.name },
    );
    await this.click(activeBookingsTab);
  }

  async clickProfileIcon() {
    const userProfileButton = this.page.locator(
      BookingCancellationObjects.userProfileButton,
    );
    await this.click(userProfileButton);
  }


  async openBookingDetails() {
    const bookingDetailsButton = this.page
      .getByRole(BookingCancellationObjects.bookingDetailsButton.role, {
        name: BookingCancellationObjects.bookingDetailsButton.name,
      })
      .first();
    await this.click(bookingDetailsButton);
  }

  async getBookedUnitCode() {
    const unitCode = this.page.locator(
      "(//div[text() = 'رمز الوحدة']/following-sibling::div/child::div)[1]",
    );
    await unitCode.waitFor({ state: "visible", timeout: 30000 });
    return (await unitCode.textContent())?.trim();
  }

  async cancelBooking() {
    const cancelBookingText = this.page.getByText(
      BookingCancellationObjects.cancelBookingText.text,
    );
    await this.click(cancelBookingText);

    const continueButton = this.page.getByRole(
      BookingCancellationObjects.continueButton.role,
      { name: BookingCancellationObjects.continueButton.name },
    );
    await this.click(continueButton);

    const projectLocationRadio = this.page.getByRole(
      BookingCancellationObjects.projectLocationRadio.role,
      { name: BookingCancellationObjects.projectLocationRadio.name },
    );
    await this.check(projectLocationRadio);

    const confirmCancelButton = this.page.getByRole(
      BookingCancellationObjects.confirmCancelButton.role,
      { name: BookingCancellationObjects.confirmCancelButton.name },
    );
    await this.click(confirmCancelButton);

    const yesButton = this.page.getByRole(
      BookingCancellationObjects.yesButton.role,
      { name: BookingCancellationObjects.yesButton.name },
    );
    await this.click(yesButton);
  }

  async expectCancellationSuccess() {
    const successHeading = this.page.getByRole(
      BookingCancellationObjects.cancellationSuccessHeading.role,
      { name: BookingCancellationObjects.cancellationSuccessHeading.name },
    );
    await expect(successHeading).toBeVisible();
  }

  async cancelMohLandBooking(otp = ["1", "2", "3", "4"]) {
    await this.page.getByText("إلغاء الحجز").click();
    await this.page
      .locator("//app-dropdown[@formcontrolname='cancel_reason']")
      .click();
    await this.page.getByText("موقع المشروع").click();
    await this.page.getByRole("button", { name: "حفظ ومتابعة" }).click();
    await this.page
      .getByRole("checkbox", {
        name: "أؤكد قراءة وفهم الشروط والأحكام والموافقة عليها",
      })
      .check();
    await this.page.getByRole("button", { name: "الاستمرار" }).click();
    const otpInputs = this.page.getByRole("textbox");
    for (let index = 0; index < otp.length; index++) {
      await otpInputs.nth(index).fill(otp[index]);
    }
    await this.page.getByRole("button", { name: "تحقق", exact: true }).click();
    await this.page
      .getByRole("heading", { name: "تم إلغاء الحجز بنجاح!" })
      .click();
  }
}

module.exports = { BookingCancellationPage };
