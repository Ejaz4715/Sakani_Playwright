import {RealEstateTaxExemptionObjects} from '@objects/RealEstateTaxExemptionObjects'
import {Page} from "@playwright/test";

const DEFAULT_TIMEOUT = 30_000;

export class RealEstateTaxExemptionPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async clickOnRealEstateTaxExemptionService() {
        const serviceButton = this.page.getByRole(RealEstateTaxExemptionObjects.realEstateTaxExemptionServiceButton.role, {name: RealEstateTaxExemptionObjects.realEstateTaxExemptionServiceButton.name});
        await serviceButton.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await serviceButton.click();
    }

    async clickOnStartServiceButton() {
        const startServiceButton = this.page.getByRole(RealEstateTaxExemptionObjects.startServiceButton.role, {name: RealEstateTaxExemptionObjects.startServiceButton.name});
        await startServiceButton.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await startServiceButton.click();
    }

    async getCertificateNumber() {
        const certificateNumber = this.page.getByText(RealEstateTaxExemptionObjects.certificateNumberText).first();
        await certificateNumber.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        return (await certificateNumber.textContent())!.trim();
    }

    async clickOnViewCertificateButton() {
        const viewCertificateButton = this.page.getByRole(RealEstateTaxExemptionObjects.viewCertificateButton.role, {name: RealEstateTaxExemptionObjects.viewCertificateButton.name});
        await viewCertificateButton.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await viewCertificateButton.click();
    }

    async isCertificateDialogVisible() {
        const certificateDialog = this.page.getByRole(RealEstateTaxExemptionObjects.certificateDialog.role);
        await certificateDialog.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        return await certificateDialog.isVisible();
    }

    async closeCertificateDialog() {
        const certificateDialog = this.page.getByRole(RealEstateTaxExemptionObjects.certificateDialog.role);
        await this.page.keyboard.press('Escape');
        await certificateDialog.waitFor({state: "hidden", timeout: DEFAULT_TIMEOUT});
    }

    async downloadCertificate() {
        const downloadLink = this.page.getByRole(RealEstateTaxExemptionObjects.downloadCertificateLink.role, {name: RealEstateTaxExemptionObjects.downloadCertificateLink.name});
        await downloadLink.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        const popupPromise = this.page.waitForEvent('popup');
        await downloadLink.click();
        const certificatePage = await popupPromise;
        await certificatePage.waitForLoadState();
        return certificatePage;
    }

    async clickOnCertificateInquiryTab() {
        const certificateInquiryTab = this.page.getByRole(RealEstateTaxExemptionObjects.certificateInquiryTab.role, {name: RealEstateTaxExemptionObjects.certificateInquiryTab.name});
        await certificateInquiryTab.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await certificateInquiryTab.click();
    }

    async enterCertificateNumber(certificateNumber: string) {
        const certificateNumberField = this.page.getByRole(RealEstateTaxExemptionObjects.certificateNumberField.role, {name: RealEstateTaxExemptionObjects.certificateNumberField.name});
        await certificateNumberField.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await certificateNumberField.fill(certificateNumber);
    }

    async enterNationalId(nationalId: string) {
        const nationalIdField = this.page.getByRole(RealEstateTaxExemptionObjects.nationalIdField.role, {name: RealEstateTaxExemptionObjects.nationalIdField.name});
        await nationalIdField.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await nationalIdField.fill(nationalId);
    }

    async clickOnVerifyButton() {
        const verifyButton = this.page.getByRole(RealEstateTaxExemptionObjects.verifyButton.role, {name: RealEstateTaxExemptionObjects.verifyButton.name, exact: true});
        await verifyButton.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await verifyButton.click();
    }

    async isCertificateDetailDisplayed(value: string) {
        const detail = this.page.getByText(value, {exact: true}).filter({visible: true}).first();
        await detail.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        return await detail.isVisible();
    }

    async isCertificateNotBelongMessageVisible() {
        const message = this.page.getByText(RealEstateTaxExemptionObjects.certificateNotBelongMessage);
        await message.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        return await message.isVisible();
    }
}
