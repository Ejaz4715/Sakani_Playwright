// @ts-nocheck
import { expect } from "@playwright/test";
import { mkdir, readdir, unlink, readFile } from "node:fs/promises";
import path from "node:path";
import { PDFParse } from "pdf-parse";
import { BookingCancellationObjects } from '@objects/BookingCancellationObjects'

export class BookingPage {
  constructor(page) {
    this.page = page;
  }

  async click(locator) {
    await expect(locator).toBeVisible({ timeout: 90000 })
    await locator.click();
  }

  async check(locator) {
    await expect(locator).toBeVisible({ timeout: 90000 })
    await locator.check();
  }

  async openActiveBookings() {
    const userProfileButton = this.page.locator(
      BookingCancellationObjects.userProfileButton,
    );
    await this.click(userProfileButton);

    const myBookingsLink = this.page.locator(
      BookingCancellationObjects.myBookingsLink,
    );
    await this.click(myBookingsLink);

    const activeBookingsTab = this.page.getByRole(
      BookingCancellationObjects.activeBookingsTab.role,
      { name: BookingCancellationObjects.activeBookingsTab.name },
    );
    await this.click(activeBookingsTab);
  }

  async openCompletedBookings() {
    const userProfileButton = this.page.locator(
      BookingCancellationObjects.userProfileButton,
    );
     await expect(userProfileButton).toBeVisible({ timeout: 90000 });
    await this.click(userProfileButton);

    const myBookingsLink = this.page.locator(
      BookingCancellationObjects.myBookingsLink,
    );
     await expect(myBookingsLink).toBeVisible({ timeout: 90000 });
    await this.click(myBookingsLink);

    const completedBookingsTab = this.page.getByRole(
      BookingCancellationObjects.completedBookingsTab.role,
      { name: BookingCancellationObjects.completedBookingsTab.name },
    );
    await expect(completedBookingsTab).toBeVisible({ timeout: 150000 });
    await this.click(completedBookingsTab);
  }

  async clickProfileIcon() {
    const userProfileButton = this.page.locator(
      BookingCancellationObjects.userProfileButton,
    );
    await this.click(userProfileButton);
  }
  
  async clickManageProfile() {
    const manageProfile = this.page.locator(
      BookingCancellationObjects.manageProfile,
    );
    await this.click(manageProfile);
  }

  async openBookingDetails() {
    const bookingDetailsButton = this.page
      .getByRole(BookingCancellationObjects.bookingDetailsButton.role, {
        name: BookingCancellationObjects.bookingDetailsButton.name,
      })
      .first();
    await this.click(bookingDetailsButton);
  }

  async verifyTheRefundedStatus(){
    const refundedStatus = this.page.locator(
      BookingCancellationObjects.refudedStatus.xpath
    );
     await expect(refundedStatus).toBeVisible({ timeout: 5000 });
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
    await expect(successHeading, "Cancellation success message is not visible").toBeVisible();
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

  //click on view of price quotation
async clickOnViewOfProcequotationButton() {
        const viewPriceQuotationButton = this.page.locator(
            BookingCancellationObjects.viewPriceQuotationButton.xpath
        );

        await expect(viewPriceQuotationButton).toBeVisible({ timeout: 90000 });
        await viewPriceQuotationButton.click();
    }

  

  async verifyPriceQuotationContainsRequiredSections(pdfPath: string) {
      const parser = new PDFParse({ data: await readFile(pdfPath) });
      try {
        const { text } = await parser.getText();
        const normalizeText = (value: string): string =>
          value
            .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, "")
            .replace(/[أإآؤئ]/g, "ا")
            .replace(/\s+/g, " ");
        const normalizedText = normalizeText(text);
        const requiredSections = [
          "معلومات قيمة الوحدة",
          "معلومات المطور العقاري",
          "معلومات الإقرار",
        ];

        for (const section of requiredSections) {
          const normalizedSection = normalizeText(section);
          const reversedSection = [...normalizedSection].reverse().join("");
          expect(
            normalizedText.includes(normalizedSection) ||
              normalizedText.includes(reversedSection),
            `Price quotation PDF is missing the "${section}" section`,
          ).toBe(true);
        }
      } finally {
        await parser.destroy();
      }
    }


     async verifyCompletionPercentageProgressIsVisible(shouldBeVisible: boolean) {
    const completionPercentageProgress = this.page.locator(
      BookingCancellationObjects.compeltiopnPercentageProgress.xpath,
    );
    if (shouldBeVisible) {
      await expect(completionPercentageProgress).toBeVisible();
    } else {
      await expect(completionPercentageProgress).toBeHidden();
    }
  }
  async verifyTheAvialabilityOfTheBanks(shouldBeVisible: boolean) {
    const noBanksAvailableMessage = this.page.locator(
      BookingCancellationObjects.noBanksAvailableMessage.xpath,
    );
    if (shouldBeVisible) {
      await expect(noBanksAvailableMessage).toBeVisible();
    } else {
      await expect(noBanksAvailableMessage).toBeHidden();
    }
  }

  async verifyElementVisibility(
    elementObject: { readonly xpath: string },
    shouldBeVisible: boolean,
  ) {
    const element = this.page.locator(elementObject.xpath);
    if (shouldBeVisible) {
      await expect(element).toBeVisible();
    } else {
      await expect(element).toBeHidden();
    }
  }

async clickBrochureButton() {
    const brochureButton = this.page.locator(
      BookingCancellationObjects.brochureButton.xpath,
    );
    await this.click(brochureButton);
  }


  async clickCloseBrochureButton() {
    const closebrochureButton = this.page.locator(
      BookingCancellationObjects.closebrochureButton.xpath,
    );
    await this.click(closebrochureButton);
  }

  async clickMasterplanButton() {
    const masterplanButton = this.page.locator(
      BookingCancellationObjects.masterplanButton.xpath,
    );
    await this.click(masterplanButton);
  }
 async clickCloseMasterplanButton() {
    const closemasterplanButton = this.page.locator(
      BookingCancellationObjects.closemasterplanButton.xpath,
    );
    await this.click(closemasterplanButton);
  }

}